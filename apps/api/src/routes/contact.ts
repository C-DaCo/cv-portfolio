import { Router, Request, Response } from "express";
import { Resend } from "resend";

const router = Router();

interface ContactBody {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function validate(body: ContactBody): string | null {
  if (!body.name || body.name.trim().length < 2) return "Nom invalide.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return "Email invalide.";
  if (!body.subject || body.subject.trim().length < 5) return "Sujet invalide.";
  if (!body.message || body.message.trim().length < 20) return "Message invalide.";
  return null;
}

router.post("/", async (req: Request, res: Response) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const body = req.body as ContactBody;

  const error = validate(body);
  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  try {
    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>", // à remplacer par ton domaine vérifié
      to: process.env.CONTACT_EMAIL!,
      replyTo: body.email,
      subject: `[Portfolio] ${body.subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #E8715A;">Nouveau message depuis le portfolio</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; color: #666; width: 100px;"><strong>De</strong></td>
              <td style="padding: 8px;">${body.name}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 8px; color: #666;"><strong>Email</strong></td>
              <td style="padding: 8px;">
                <a href="mailto:${body.email}">${body.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; color: #666;"><strong>Sujet</strong></td>
              <td style="padding: 8px;">${body.subject}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 8px; color: #666; vertical-align: top;"><strong>Message</strong></td>
              <td style="padding: 8px; white-space: pre-wrap;">${body.message}</td>
            </tr>
          </table>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
          <p style="color: #999; font-size: 12px;">
            Envoyé depuis carole-rotton.dev
          </p>
        </div>
      `,
    });

    return res.status(200).json({ success: true, message: "Email envoyé avec succès." });
  } catch (err) {
    console.error("Erreur Resend:", err);
    return res.status(500).json({ success: false, message: "Erreur lors de l'envoi." });
  }
});

export default router;