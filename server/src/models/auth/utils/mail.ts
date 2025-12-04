import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const mailFrom = process.env.MAIL_FROM;

if (!apiKey) throw new Error("Missing RESEND_API_KEY in .env");
if (!mailFrom) throw new Error("Missing MAIL_FROM in .env");

const resend = new Resend(apiKey);

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const response = await resend.emails.send({
      from: mailFrom!,
      to,
      subject,
      html,
      text: html.replace(/<[^>]+>/g, ""),
    });

    if (response.error) throw new Error(response.error.message);

    console.log("📨 EMAIL SENT:", response.data);
    return response.data;
  } catch (err: any) {
    console.error("❌ EMAIL ERROR:", err.message);
    throw new Error("Email sending failed");
  }
}
