import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  isVerified: boolean;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: true }, // No OTP for signup
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
