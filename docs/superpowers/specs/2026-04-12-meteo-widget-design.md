# Design — Intégration widget Station Météo

**Date :** 2026-04-12  
**Statut :** Approuvé

---

## Contexte

Le projet `weather-station` existe déjà dans `projects.data.ts` avec `wip: true` et une image statique. La station météo est maintenant live avec un widget embarquable via iframe (`https://meteo.lejardindecarole.dev/widget`). L'objectif est de remplacer l'image statique par le widget en direct dans la ProjectCard, supprimer le badge "En cours", et ajouter un onglet Architecture dans le Drawer.

---

## Architecture

### Champ `widget` dans le type `Project`

Ajout d'un champ optionnel `widget?: string` dans `src/types/projects.types.ts`. Cette approche suit le pattern existant (`video?: string`) : la donnée contrôle le rendu, pas le composant.

### Logique de rendu dans `ProjectCard`

Priorité dans le bloc `.media` :
1. `project.widget` → `<iframe>` (widget live)
2. `project.image` → `<img>` (comportement actuel)
3. fallback → bloc archDiagram existant

Le badge `wip` et sa condition sont supprimés entièrement.

### Onglet `archi` pour weather-station

Le Drawer sait déjà gérer un onglet `archi` via `ArchiTab`. Il faut ajouter un cas `weather-station` dans `ArchiTab` pointant vers le nouveau composant `MeteoStationArchiContent`.

---

## Composants

### `MeteoStationArchiContent` (nouveau)

Fichier : `src/components/sections/Projects/ArchDiagram/MeteoStationArchiContent.tsx`  
Copie structurelle de `BrainZupArchiContent` avec les données de la station météo.

**Onglets :**
- **Couches** (icône `Layers`) — 4 couches : Hardware, Infrastructure, Serveur, Front-End
- **Flux données** (icône `GitBranch`) — 6 étapes : DHT22 → MQTT → Mosquitto → Node.js → WebSocket → Dashboard/Widget

**Données couches :**

| Couche | Couleur | Techs |
|---|---|---|
| Hardware | coral | ESP32, DHT22 ×2, Deep Sleep, Raspberry Pi |
| Infrastructure | sage | Mosquitto, PM2, Cloudflare Tunnel, SQLite |
| Serveur | mauve | Node.js, WebSocket, REST API, better-sqlite3 |
| Front-End | sand | Vanilla JS, Chart.js 4, CSS vars, Jest (24 tests) |

**Données flux :**

| Étape | Couleur | Description |
|---|---|---|
| DHT22 | coral | Lecture température et humidité |
| MQTT (ESP32 → Pi) | coral | Publication JSON via WiFi toutes les 10 minutes |
| Mosquitto | sage | Réception et dispatch du message MQTT |
| Node.js Server | mauve | Insertion SQLite + broadcast WebSocket |
| WebSocket | mauve | Push instantané vers dashboard et widget |
| Dashboard / Widget | sand | Affichage temps réel et historique Chart.js |

---

## Données

### `projects.data.ts` — weather-station

Modifications :
- Supprimer `wip: true`
- Supprimer `image`, `imageWidth`, `imageHeight`
- Ajouter `widget: "https://meteo.lejardindecarole.dev/widget"`
- Ajouter tab `{ id: "archi", label: t("projects.drawer.archi") }`
- Garder tab `screenshots` en premier (fallback si widget indisponible)

### i18n `fr.json` + `en.json`

Mettre à jour `projects.weather.longDesc` : retirer la mention WIP, mentionner le widget live et l'architecture IoT (ESP32 → MQTT → Raspberry Pi → WebSocket).

---

## CSS

Ajouter `.widgetFrame` dans `Projects.module.scss` :

```scss
.widgetFrame {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  pointer-events: none; // l'iframe ne capte pas le clic → le Drawer s'ouvre normalement
}
```

---

## Tests

- `Projects.test.tsx` : vérifier si les projets sont mockés — si oui, ajouter un cas `project.widget` pour couvrir le rendu iframe.
- `MeteoStationArchiContent` : pas de test requis (composant purement présentationnel, aucune logique).
- Pas de nouveau fichier de test à créer.

---

## Fichiers touchés

| Fichier | Type de modification |
|---|---|
| `src/types/projects.types.ts` | Ajout `widget?: string` |
| `src/data/projects.data.ts` | Mise à jour weather-station |
| `src/components/sections/Projects/Projects.tsx` | Rendu iframe + suppression badge wip |
| `src/components/sections/Projects/Projects.module.scss` | Ajout `.widgetFrame` |
| `src/components/sections/Projects/Drawer/Drawer.tsx` | Cas weather-station dans `ArchiTab` |
| `src/components/sections/Projects/ArchDiagram/MeteoStationArchiContent.tsx` | Nouveau fichier |
| `src/i18n/locales/fr.json` | Mise à jour `weather.longDesc` |
| `src/i18n/locales/en.json` | Mise à jour `weather.longDesc` |
