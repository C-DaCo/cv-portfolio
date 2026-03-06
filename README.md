# 🎨 Carole Rotton — Portfolio CV

> Portfolio interactif construit avec React · TypeScript · Node.js · SCSS

[![CI](https://github.com/carole-rotton/cv-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/carole-rotton/cv-portfolio/actions)

## 🚀 Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React 18 + TypeScript |
| Styles | SCSS Modules + CSS Variables |
| Tests unitaires | Vitest + React Testing Library |
| Tests E2E | Playwright |
| Backend | Node.js + Express |
| Validation API | Zod |
| CI/CD | GitHub Actions |
| Hébergement | Vercel (front) + Render (API) |

## 📁 Structure

```
cv-portfolio/
├── apps/
│   ├── web/          # React + TypeScript (Vite)
│   └── api/          # Node.js + Express
└── .github/
    └── workflows/    # CI/CD
```

## 🛠️ Installation

```bash
# Cloner le repo
git clone https://github.com/carole-rotton/cv-portfolio.git
cd cv-portfolio

# Installer les dépendances (monorepo)
npm install

# Lancer en développement
npm run dev
```

- Frontend : http://localhost:5173
- API : http://localhost:3001

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests avec couverture
npm run test:coverage -w apps/web

# Tests E2E
npm run test:e2e -w apps/web
```

## ♿ Accessibilité

- Skip link en premier élément du DOM
- Landmarks ARIA sémantiques
- `prefers-reduced-motion` respecté
- Focus visible sur tous les éléments interactifs
- Ratio de contraste ≥ 4.5:1 (WCAG AA)

## 📝 Variables d'environnement

```bash
# apps/api/.env
PORT=3001
FRONTEND_URL=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_USER=your@email.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=caroledacosta.rotton@gmail.com
```
