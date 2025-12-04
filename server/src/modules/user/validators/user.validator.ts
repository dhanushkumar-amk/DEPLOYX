import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(40).optional(),
  username: z.string().regex(/^[a-z0-9\-]+$/).min(3).max(20).optional(),
  bio: z.string().max(200).optional(),
  avatarUrl: z.string().url().optional(),
  timezone: z.string().optional(),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});
