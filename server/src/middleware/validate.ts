// server/src/middleware/validate.ts
import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate = (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      // Zod v3 uses .issues instead of .errors
      const errors = parsed.error.issues.map(issue => issue.message);
      return res.status(400).json({ errors });
    }

    next();
  };
