# Carole Rotton — Portfolio CV

> Portfolio interactif construit avec React · TypeScript · Node.js · SCSS

[![CI](https://github.com/C-DaCo/cv-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/C-DaCo/cv-portfolio/actions)

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styles | SCSS Modules + CSS Variables |
| Tests unitaires | Vitest + React Testing Library |
| Tests E2E | Playwright |
| Backend | Node.js + Express |
| Validation API | Zod |
| CI/CD | GitHub Actions + Lighthouse CI |
| Hébergement | Vercel (front) + Render (API) |

## Structure

```
cv-portfolio/
├── apps/
│   ├── web/          # React + TypeScript (Vite, port 5173)
│   └── api/          # Node.js + Express (port 3001)
└── .github/
    └── workflows/    # CI/CD
```

## Installation

```bash
git clone https://github.com/C-DaCo/cv-portfolio.git
cd cv-portfolio
yarn install
yarn dev
```

- Frontend : http://localhost:5173
- API : http://localhost:3001

## Tests

```bash
# Tests unitaires (web)
cd apps/web && yarn test

# Tests avec couverture
cd apps/web && yarn test:coverage

# Tests E2E (nécessite le dev server)
cd apps/web && yarn test:e2e
```

## Accessibilité

- Skip link en premier élément du DOM
- Landmarks ARIA sémantiques
- Focus trap sur les modales et menus mobiles
- `prefers-reduced-motion` respecté
- Focus visible sur tous les éléments interactifs
- Ratio de contraste ≥ 4.5:1 (WCAG AA)

## Variables d'environnement

Copier `.env.example` vers `.env` dans `apps/api/` :

```bash
cp apps/api/.env.example apps/api/.env
```

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Clé API Claude (assistant IA) |
| `RESEND_API_KEY` | Clé API Resend (envoi emails) |
| `CONTACT_EMAIL` | Destinataire des emails de contact |
| `FROM_EMAIL` | Expéditeur vérifié dans Resend |
| `FRONTEND_URL` | Origine autorisée par CORS |
