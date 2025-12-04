import { Request, Response } from "express";
import { UserService } from "../services/user.service";

interface AuthUser {
  id: string;
  email: string;
}

interface AuthRequest extends Request {
  user?: AuthUser;
  file?: any; // Avoid Multer type conflicts
}

export class UserController {
  static async me(req: AuthRequest, res: Response) {
    try {
      const user = await UserService.getProfile(req.user!.id);
      res.json(user);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async update(req: AuthRequest, res: Response) {
    try {
      const updated = await UserService.updateProfile(req.user!.id, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async changePassword(req: AuthRequest, res: Response) {
    try {
      const { oldPassword, newPassword } = req.body;
      const result = await UserService.changePassword(
        req.user!.id,
        oldPassword,
        newPassword
      );
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async uploadAvatar(req: AuthRequest, res: Response) {
    try {
      const result = await UserService.uploadAvatar(req.user!.id, req.file);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
