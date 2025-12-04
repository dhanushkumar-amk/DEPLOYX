// src/routes/test-email.ts
import { Router } from "express";
import { sendEmail } from "../models/auth/utils/mail";

const router = Router();

router.get("/send", async (req, res) => {
  try {
    await sendEmail(
      "dhanushkumaramk@gmail.com",
      "DeployX Resend Test",
      "<h1>Resend Test — should arrive</h1><p>If you get this, it works.</p>"
    );
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "send failed" });
  }
});

export default router;
