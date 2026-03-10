import { Router, Request, Response } from "express";
import { Resend } from "resend";
import { z } from "zod";

const router = Router();

export const contactSchema = z.object({
  name:    z.string().trim().min(2, "Nom invalide."),
  email:   z.string().email("Email invalide."),
  subject: z.string().trim().min(5, "Sujet invalide."),
  message: z.string().trim().min(20, "Message invalide."),
});

export type ContactBody = z.infer<typeof contactSchema>;

router.post("/", async (req: Request, res: Response) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? "Données invalides.";
    return res.status(400).json({ success: false, message });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const body = parsed.data;

  try {
    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
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
              <td style="padding: 8px;"><a href="mailto:${body.email}">${body.email}</a></td>
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
          <p style="color: #999; font-size: 12px;">Envoyé depuis carole-rotton.dev</p>
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