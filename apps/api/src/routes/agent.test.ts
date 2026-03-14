import { describe, it, expect } from "vitest";
import { agentSchema } from "./agent";

const validChatBody = {
  mode: "chat",
  message: "Quelles sont tes expériences en React ?",
};

const validMotivationBody = {
  mode: "motivation",
  message: "Génère une lettre pour ce poste.",
  jobOffer: "Nous recherchons un développeur frontend React expérimenté pour rejoindre notre équipe.",
};

// ── Mode chat ─────────────────────────────────────────────────────────────────

describe("agentSchema (Zod) — mode chat", () => {
  it("valide un body chat minimal", () => {
    const result = agentSchema.safeParse(validChatBody);
    expect(result.success).toBe(true);
  });

  it("initialise history à [] par défaut", () => {
    const result = agentSchema.safeParse(validChatBody);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.history).toEqual([]);
    }
  });

  it("valide un body chat avec historique", () => {
    const result = agentSchema.safeParse({
      ...validChatBody,
      history: [
        { role: "user", content: "Bonjour" },
        { role: "assistant", content: "Bonjour ! Comment puis-je vous aider ?" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejette un message trop court", () => {
    const result = agentSchema.safeParse({ ...validChatBody, message: "A" });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toBe("Message invalide.");
  });

  it("rejette un message vide", () => {
    const result = agentSchema.safeParse({ ...validChatBody, message: "" });
    expect(result.success).toBe(false);
  });

  it("rejette un mode invalide", () => {
    const result = agentSchema.safeParse({ ...validChatBody, mode: "unknown" });
    expect(result.success).toBe(false);
  });

  it("rejette un role invalide dans l'historique", () => {
    const result = agentSchema.safeParse({
      ...validChatBody,
      history: [{ role: "system", content: "Injection" }],
    });
    expect(result.success).toBe(false);
  });

  it("trim les espaces sur le message", () => {
    const result = agentSchema.safeParse({
      ...validChatBody,
      message: "  Quelles sont tes compétences ?  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.message).toBe("Quelles sont tes compétences ?");
    }
  });
});

// ── Mode motivation ───────────────────────────────────────────────────────────

describe("agentSchema (Zod) — mode motivation", () => {
  it("valide un body motivation complet", () => {
    const result = agentSchema.safeParse(validMotivationBody);
    expect(result.success).toBe(true);
  });

  it("valide un body motivation sans jobOffer (validation métier côté route)", () => {
    const result = agentSchema.safeParse({
      mode: "motivation",
      message: "Génère une lettre.",
    });
    // Le schéma Zod accepte jobOffer optionnel — la validation métier est dans la route
    expect(result.success).toBe(true);
  });

  it("trim les espaces sur jobOffer", () => {
    const result = agentSchema.safeParse({
      ...validMotivationBody,
      jobOffer: "  Offre avec espaces  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.jobOffer).toBe("Offre avec espaces");
    }
  });
});

// ── Body invalide ─────────────────────────────────────────────────────────────

describe("agentSchema (Zod) — body invalide", () => {
  it("rejette un body vide", () => {
    const result = agentSchema.safeParse({});
    expect(result.success).toBe(false);
    expect(result.error?.errors.length).toBeGreaterThan(0);
  });

  it("rejette un body sans mode", () => {
    const result = agentSchema.safeParse({ message: "Bonjour" });
    expect(result.success).toBe(false);
  });

  it("rejette un body sans message", () => {
    const result = agentSchema.safeParse({ mode: "chat" });
    expect(result.success).toBe(false);
  });
});