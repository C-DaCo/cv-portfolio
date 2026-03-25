import { describe, it, expect } from "vitest";
import { agentSchema } from "./agent";

const validChatBody = {
  mode: "chat",
  message: "Quelles sont tes expériences en React ?",
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
