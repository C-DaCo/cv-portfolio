// ─────────────────────────────────────────────
// Conventions de nommage des tests
// Utiliser desc() pour tous les describes de premier niveau
// ─────────────────────────────────────────────

export enum TestScope {
  UI      = "ui",
  SECTION = "section",
  LAYOUT  = "layout",
  HOOK    = "hook",
  PAGE    = "page",
}

export enum TestType {
  RENDU        = "rendu",
  A11Y         = "a11y",
  INTERACTIONS = "interactions",
}

/**
 * Construit le nom d'un describe de premier niveau.
 * @example desc(TestScope.UI, "Button", TestType.RENDU)
 * // → "[ui] Button — [rendu]"
 */
export function desc(scope: TestScope, name: string, type: TestType): string {
  return `[${scope}] ${name} — [${type}]`;
}

/**
 * Parse un nom de describe pour en extraire scope, name et type.
 * Retourne null si le format ne correspond pas.
 * @example parse("[ui] Button — [rendu]")
 * // → { scope: "ui", name: "Button", type: "rendu" }
 */
export function parseDesc(descName: string): {
  scope: string;
  name: string;
  type: string;
} | null {
  const match = descName.match(/^\[(\w+)\] (.+) — \[(\w+)\]$/);
  if (!match) return null;
  return { scope: match[1], name: match[2], type: match[3] };
}