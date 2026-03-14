import { Router, Request, Response } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const router = Router();

// ── Schéma de validation ──────────────────────────────────────────────────────

export const agentSchema = z.object({
  mode: z.enum(["chat", "motivation"]),
  message: z.string().trim().min(2, "Message invalide."),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
  jobOffer: z.string().trim().optional(), // uniquement pour le mode "motivation"
});

export type AgentBody = z.infer<typeof agentSchema>;

// ── System prompts ────────────────────────────────────────────────────────────

const CV_CONTEXT = `
Tu es l'assistant IA intégré au portfolio de Carole Rotton, développeuse web frontend.
Voici son profil complet :

IDENTITÉ
- Prénom : Carole
- Métier : Développeuse web frontend
- Stack principale : React, TypeScript, SCSS, Node.js/Express
- Points forts : accessibilité (a11y), tests (Vitest/RTL), architecture propre, i18n

EXPÉRIENCES
- Maskott / Tactileo : développement d'une plateforme e-learning (React, TypeScript)
- KTM Advance : intégration et développement frontend
- Hippocad : développement web

FORMATIONS
- OpenClassrooms : Développeur web
- IFOCOP : formation développement
- Dawan : formations techniques

COMPÉTENCES TECHNIQUES
- Frontend : React, TypeScript, Vite, SCSS Modules, i18n (react-i18next)
- Accessibilité : WCAG, ARIA, navigation clavier, lecteurs d'écran
- Tests : Vitest, React Testing Library, tests a11y
- Backend : Node.js, Express, API REST
- Outils : Git, VS Code, Figma

PROJETS NOTABLES
- Ce portfolio : monorepo React TS + API Express, a11y poussée, TestDashboard
- Station météo Raspberry Pi : projet IoT personnel

SOFT SKILLS
- Soucieuse de la qualité du code et de l'expérience utilisateur
- Sensible à l'inclusion numérique via l'accessibilité
- Curieuse et en veille technologique continue
`;

const SYSTEM_CHAT = `
${CV_CONTEXT}

TON RÔLE
Réponds aux questions des recruteurs sur le profil de Carole de façon concise, professionnelle et bienveillante.
Reste factuel et basé uniquement sur les informations fournies. Si tu ne sais pas, dis-le honnêtement.
Réponds dans la langue de l'utilisateur (français ou anglais).
`;

const SYSTEM_MOTIVATION = `
${CV_CONTEXT}

TON RÔLE
Tu génères des lettres de motivation personnalisées pour Carole à partir d'une offre d'emploi.
- Ton : professionnel, chaleureux, authentique
- Structure : accroche / expériences pertinentes / motivation pour le poste / conclusion
- Longueur : 3-4 paragraphes, pas plus
- Mets en avant les compétences qui correspondent à l'offre
- Réponds dans la langue de l'offre d'emploi
`;

// ── Route POST /api/agent ─────────────────────────────────────────────────────

router.post("/", async (req: Request, res: Response) => {
  const parsed = agentSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? "Données invalides.";
    return res.status(400).json({ success: false, message });
  }

  const { mode, message, history, jobOffer } = parsed.data;

  if (mode === "motivation" && !jobOffer?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Une offre d'emploi est requise pour ce mode.",
    });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Construction du message utilisateur selon le mode
  const userMessage =
    mode === "motivation"
      ? `Voici l'offre d'emploi :\n\n${jobOffer}\n\n${message}`
      : message;

  // Historique de conversation + nouveau message
  const messages: Anthropic.MessageParam[] = [
    ...history.map((h) => ({ role: h.role, content: h.content })),
    { role: "user", content: userMessage },
  ];

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: mode === "chat" ? SYSTEM_CHAT : SYSTEM_MOTIVATION,
      messages,
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return res.status(200).json({
      success: true,
      reply: text,
      usage: response.usage,
    });
  } catch (err) {
    console.error("Erreur Anthropic:", err);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la génération de la réponse.",
    });
  }
});

export default router;