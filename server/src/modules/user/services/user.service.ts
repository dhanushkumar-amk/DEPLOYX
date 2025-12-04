import bcrypt from "bcryptjs";
import crypto from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";

import { User } from "../../auth/models/user.model";
import { r2 } from "../utils/r2";

// SAFE file type (avoid Multer namespace issues)
type UploadedFile = {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

export class UserService {
  // GET PROFILE
  static async getProfile(userId: string) {
    const user = await User.findById(userId).select("-password");
    if (!user) throw new Error("User not found");
    return user;
  }

  // UPDATE PROFILE
  static async updateProfile(userId: string, data: any) {
    if (data.username) {
      const exists = await User.findOne({ username: data.username });
      if (exists && exists._id.toString() !== userId) {
        throw new Error("Username already taken");
      }
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true }
    ).select("-password");

    return updated;
  }

  // CHANGE PASSWORD
  static async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) throw new Error("Old password incorrect");

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { message: "Password updated" };
  }

  // UPLOAD AVATAR TO CLOUDFLARE R2
  static async uploadAvatar(userId: string, file: UploadedFile) {
    if (!file) throw new Error("No file uploaded");

    const ext = file.originalname.split(".").pop() || "png";
    const filename = `avatars/${userId}-${crypto.randomUUID()}.${ext}`;

    // Upload to R2
    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    // Public URL (R2 → CDN URL)
    const avatarUrl = `${process.env.R2_PUBLIC_URL}/${filename}`;

    // Save in DB
    await User.findByIdAndUpdate(userId, { avatarUrl });

    return { avatarUrl };
  }
}
