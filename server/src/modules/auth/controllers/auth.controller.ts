import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  static async signup(req: Request, res: Response) {
    try {
      const result = await AuthService.signup(req.body.email, req.body.password);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const ip = req.ip || "unknown";
      const result = await AuthService.login(req.body.email, req.body.password, ip);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const result = await AuthService.forgotPassword(req.body.email);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async verifyForgotOtp(req: Request, res: Response) {
    try {
      const result = await AuthService.verifyForgotPasswordOtp(
        req.body.email,
        req.body.otp
      );
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const result = await AuthService.resetPassword(
        req.body.email,
        req.body.newPassword
      );
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) throw new Error("No token");

      await AuthService.logout(token);
      res.json({ message: "Logged out" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
