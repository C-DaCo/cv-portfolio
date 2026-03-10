import { describe, it, expect } from "vitest";
import { contactSchema } from "./contact";

const validBody = {
  name: "Carole Rotton",
  email: "carole@exemple.com",
  subject: "Proposition de mission",
  message: "Bonjour, je souhaite vous contacter au sujet d'une opportunité.",
};

describe("contactSchema (Zod)", () => {

  it("valide un body correct", () => {
    const result = contactSchema.safeParse(validBody);
    expect(result.success).toBe(true);
  });

  it("rejette un nom trop court", () => {
    const result = contactSchema.safeParse({ ...validBody, name: "A" });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toBe("Nom invalide.");
  });

  it("rejette un nom vide", () => {
    const result = contactSchema.safeParse({ ...validBody, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejette un email invalide", () => {
    const result = contactSchema.safeParse({ ...validBody, email: "pasunemail" });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toBe("Email invalide.");
  });

  it("rejette un sujet trop court", () => {
    const result = contactSchema.safeParse({ ...validBody, subject: "Hi" });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toBe("Sujet invalide.");
  });

  it("rejette un message trop court", () => {
    const result = contactSchema.safeParse({ ...validBody, message: "Trop court." });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toBe("Message invalide.");
  });

  it("trim les espaces sur name et subject", () => {
    const result = contactSchema.safeParse({
      ...validBody,
      name: "  Carole  ",
      subject: "  Proposition  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Carole");
      expect(result.data.subject).toBe("Proposition");
    }
  });

  it("rejette un body vide", () => {
    const result = contactSchema.safeParse({});
    expect(result.success).toBe(false);
    expect(result.error?.errors.length).toBeGreaterThan(0);
  });
});