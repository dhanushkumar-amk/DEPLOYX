import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { User } from "../models/user.model";
import { redis } from "../../../config/redis";
import { sendEmail } from "../utils/mail";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "7d" as SignOptions["expiresIn"];

// Redis OTP settings
const OTP_EXPIRY = 10 * 60;
const OTP_RATE_LIMIT = 3;
const OTP_WINDOW = 60;

export class AuthService {

  // SIGNUP
  static async signup(email: string, password: string) {
    const exists = await User.findOne({ email });
    if (exists) throw new Error("Email already registered");

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashed, isVerified: true });

    await sendEmail(
      email,
      "Welcome to DeployX 🚀",
      `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to DeployX</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        background-color: #f5f7fa;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      }
      .header {
        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        padding: 48px 32px;
        text-align: center;
      }
      .header h1 {
        color: #ffffff;
        font-size: 28px;
        margin: 0 0 8px;
        letter-spacing: 0.5px;
      }
      .header p {
        color: #e0e7ff;
        font-size: 16px;
        margin: 0;
      }
      .content {
        padding: 40px 32px;
      }
      .content h2 {
        font-size: 22px;
        margin: 0 0 16px;
        color: #1f2937;
      }
      .content p {
        font-size: 16px;
        line-height: 1.6;
        margin: 0 0 24px;
        color: #4b5563;
      }
      .cta {
        display: inline-block;
        background-color: #4f46e5;
        color: #ffff !important;
        padding: 14px 28px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        font-size: 16px;
        transition: background-color 0.3s ease;
      }
      .cta:hover {
        background-color: #4338ca;
      }
      .footer {
        background-color: #f9fafb;
        padding: 24px 32px;
        text-align: center;
        font-size: 14px;
        color: #6b7280;
      }
      .footer a {
        color: #4f46e5;
        text-decoration: none;
      }
      @media (max-width: 600px) {
        .container {
          margin: 20px;
        }
        .header, .content, .footer {
          padding-left: 24px;
          padding-right: 24px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>DeployX</h1>
        <p>Your journey to seamless deployments starts now</p>
      </div>
      <div class="content">
        <h2>Welcome aboard, ${email.split('@')[0]}!</h2>
        <p>
          Thanks for signing up. Your account is ready—explore powerful features designed to streamline your deployment workflow.
        </p>
        <a href="https://deployx.app/dashboard" class="cta">Go to Dashboard</a>
      </div>
      <div class="footer">
        Need help? <a href="https://deployx.app/support">Contact Support</a> or simply reply to this email.
      </div>
    </div>
  </body>
</html>`
    );

    return { email };
  }

  // LOGIN
  static async login(email: string, password: string, ip: string) {
    const rlKey = `rl:login:${ip}`;
    const attempts = await redis.incr(rlKey);

    if (attempts === 1) await redis.expire(rlKey, 60);
    if (attempts > 10) throw new Error("Too many login attempts");

    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error("Invalid credentials");

    await redis.del(rlKey);

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return { token, email: user.email };
  }

  // FORGOT PASSWORD → SEND OTP
  static async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Email not found");

    const rateKey = `otp:rate:${email}`;
    const count = await redis.incr(rateKey);

    if (count === 1) await redis.expire(rateKey, OTP_WINDOW);
    if (count > OTP_RATE_LIMIT) throw new Error("Too many OTP requests");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await redis.set(`otp:forgot:${email}`, otp, { ex: OTP_EXPIRY });

    await sendEmail(
      email,
      "Your DeployX Password Reset OTP",
      `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DeployX Password Reset</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        background-color: #f5f7fa;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      }
      .header {
        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        padding: 48px 32px;
        text-align: center;
      }
      .header h1 {
        color: #ffffff;
        font-size: 28px;
        margin: 0 0 8px;
        letter-spacing: 0.5px;
      }
      .header p {
        color: #e0e7ff;
        font-size: 16px;
        margin: 0;
      }
      .content {
        padding: 40px 32px;
      }
      .content h2 {
        font-size: 22px;
        margin: 0 0 16px;
        color: #1f2937;
      }
      .content p {
        font-size: 16px;
        line-height: 1.6;
        margin: 0 0 24px;
        color: #4b5563;
      }
      .otp-box {
        display: inline-block;
        background-color: #f3f4f6;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        padding: 12px 20px;
        font-size: 24px;
        font-weight: 600;
        color: #4f46e5;
        letter-spacing: 4px;
        margin: 0 0 24px;
      }
      .footer {
        background-color: #f9fafb;
        padding: 24px 32px;
        text-align: center;
        font-size: 14px;
        color: #6b7280;
      }
      .footer a {
        color: #4f46e5;
        text-decoration: none;
      }
      @media (max-width: 600px) {
        .container {
          margin: 20px;
        }
        .header, .content, .footer {
          padding-left: 24px;
          padding-right: 24px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>DeployX</h1>
        <p>Reset your password securely</p>
      </div>
      <div class="content">
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your password. Use the OTP below to proceed:</p>
        <div class="otp-box">${otp}</div>
        <p>This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
      </div>
      <div class="footer">
        Need help? <a href="https://deployx.app/support">Contact Support</a> or simply reply to this email.
      </div>
    </div>
  </body>
</html>`
    );

    return { email };
  }

  // VERIFY FORGOT PASSWORD OTP
static async verifyForgotPasswordOtp(email: string, otp: string) {
  const stored = await redis.get(`otp:forgot:${email}`);

  if (!stored) throw new Error("OTP expired");

  const cleanOtp = otp.trim();

  if (String(stored) !== String(cleanOtp)) {
    console.log("OTP MISMATCH", { stored, cleanOtp });
    throw new Error("Invalid OTP");
  }

  // OTP matched → delete it
  await redis.del(`otp:forgot:${email}`);

  return { email };
}



  // RESET PASSWORD (after OTP verified)
  static async resetPassword(email: string, newPassword: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    await user.save();

    await sendEmail(
      email,
      "Password Reset Successful",
      `<p>Your password has been updated successfully.</p>`
    );

    return { email };
  }

  // LOGOUT (JWT Blacklist)
  static async logout(token: string) {
    await redis.set(`blacklist:${token}`, "true", { ex: 60 * 60 * 24 * 7 });
    return { success: true };
  }
}
