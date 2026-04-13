# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
yarn dev                        # Lance web (5173) + API (3001) en parallèle
cd apps/web && yarn dev         # Web seul
cd apps/api && yarn dev         # API seul
```

### Tests
```bash
# Web — unitaires (Vitest + RTL)
cd apps/web && yarn test        # Run once, génère public/test-results.json
cd apps/web && yarn test:watch  # Mode watch
cd apps/web && yarn test:coverage  # Avec couverture dans public/coverage/

# Lancer un seul fichier de test
cd apps/web && yarn vitest run src/components/sections/Hero/Hero.test.tsx

# API
cd apps/api && yarn test

# E2E Playwright (nécessite le dev server actif) — specs dans apps/web/e2e/
cd apps/web && yarn test:e2e
cd apps/web && yarn test:e2e --project=chromium  # Un seul navigateur
```

### Lint
```bash
cd apps/web && yarn lint        # ESLint sur src/ (ts, tsx)
```

### Build
```bash
cd apps/web && yarn build       # Vitest coverage + merge results + tsc + vite build
yarn build                      # Web + API
```

### Lighthouse
```bash
cd apps/web && yarn lighthouse  # Build prod + audit Lighthouse local
```

## Architecture

Monorepo Yarn Workspaces avec deux apps indépendantes :
- `apps/web` — React 18 + Vite + TypeScript (port 5173)
- `apps/api` — Express + TypeScript (port 3001)

En dev, Vite proxie `/api/*` vers `localhost:3001`.

### Web — flux de données

```
src/data/cv.data.ts          → données CV statiques (expériences, formations)
src/data/projects.data.ts    → données projets (images, tabs, liens)
src/i18n/locales/{fr,en}.json → toutes les chaînes UI
src/assets/index.ts          → imports images + assetMeta (dimensions w/h)
```

Les sections sont des composants React dans `src/components/sections/`. `Projects` et `Playground` sont lazy-chargés (`React.lazy` + `Suspense`) dans `App.tsx` pour le code splitting.

### Routing

Deux routes dans `main.tsx` :
- `/` → `App` (portfolio)
- `/tests` → `TestDashboard` (dashboard live : tests unitaires, couverture, Lighthouse, E2E)

### API — routes

| Route | Description |
|---|---|
| `POST /api/contact` | Envoi email via Resend (rate limit : 5 req/15min) |
| `POST /api/agent` | Chat IA via Claude API (rate limit : 20 req/15min) |
| `GET /health` | Healthcheck |

Le CV complet est injecté en system prompt dans `apps/api/src/routes/cv.ts`.

### Variables d'environnement API (`apps/api/.env`)

```
ANTHROPIC_API_KEY=
RESEND_API_KEY=
CONTACT_EMAIL=          # destinataire des emails de contact
FROM_EMAIL=             # expéditeur vérifié dans Resend (ex: hello@caroleroton.dev)
FRONTEND_URL=           # origine autorisée par CORS (défaut: http://localhost:5173)
PORT=3001               # optionnel
```

### Styles

SCSS Modules par composant. Deux fichiers globaux auto-injectés par Vite dans tous les modules SCSS :
- `src/styles/_variables.scss` — design tokens CSS vars (`--clr-*`, `--font-*`)
- `src/styles/_mixins.scss` — breakpoints (`m.respond-below("sm")`, `m.respond-to("md")`)

Thème géré par `data-theme="dark|light"` sur `<html>`. Le hook `useTheme` suit l'heure locale (auto dark/light), respecte `prefers-color-scheme`, et persiste le choix manuel dans `localStorage` (`cv-theme`).

### Tests — conventions

Tous les `describe` de premier niveau utilisent `desc()` de `src/tests/test-categories.ts` :
```ts
describe(desc(TestScope.SECTION, "Hero", TestType.RENDU), () => { ... })
// → "[section] Hero — [rendu]"
```

Scopes : `ui`, `section`, `layout`, `hook`, `page`.
Types : `rendu`, `interactions`, `a11y`.

`react-i18next` est mocké globalement dans `src/tests/setup.ts` — `t(key)` retourne la clé brute. Les composants qui consomment `@assets/index` doivent mocker ce module **et** inclure `assetMeta` dans le mock.

### Alias Vite

```
@components  → src/components
@hooks       → src/hooks
@styles      → src/styles
@data        → src/data
@assets      → src/assets
@tests       → src/tests
@pages       → src/pages
@/types      → src/types
```

### Projets — conventions d'extension

**Ajouter un projet** : modifier `src/data/projects.data.ts` + `src/i18n/locales/{fr,en}.json`. Le type `Project` (`src/types/projects.types.ts`) supporte :
- `widget` + `widgetHealth` : iframe embarquée avec détection online/offline via `useWidgetStatus` (hook dans `src/hooks/useWidgetStatus.ts` — fetch avec timeout 3s)
- `tabs` : `screenshots | video | archi | tests` — le Drawer switche selon `project.id` pour les onglets `archi` et `tests`

**Ajouter un onglet Architecture** dans le Drawer : créer un composant `XxxArchiContent.tsx` dans `src/components/sections/Projects/ArchDiagram/` (copier la structure de `BrainZupArchiContent.tsx`), puis ajouter un cas dans `ArchiTab` dans `Drawer.tsx`.

### Tests — axe-core et iframes

Les iframes tierces (ex: widget météo) doivent être exclues des audits axe-core :
- **Vitest** : `axe(container, { iframes: false })`
- **Playwright E2E** : `.exclude('iframe')` sur le builder `AxeBuilder`

### Fichiers générés (ne pas éditer manuellement)

| Fichier | Généré par |
|---|---|
| `apps/web/public/test-results.json` | `yarn test` (web) |
| `apps/web/public/api-test-results.json` | `yarn test:json` (api) |
| `apps/web/public/lighthouse-scores.json` | `yarn lighthouse` |
| `apps/web/public/coverage/` | `yarn test:coverage` |
