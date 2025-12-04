import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  timezone?: string;
  githubConnected: boolean;
  isVerified: boolean;
  resetToken: string | null;
  resetTokenExpires: Date | null;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    name: { type: String, default: "" },
    username: { type: String, unique: true, sparse: true },
    bio: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    timezone: { type: String, default: "UTC" },
    githubConnected: { type: Boolean, default: false },

    isVerified: { type: Boolean, default: false },
    resetToken: { type: String, default: null },
    resetTokenExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

// Remove duplicate index definition
// userSchema.index({ username: 1 });

export const User = mongoose.model<IUser>("User", userSchema);
