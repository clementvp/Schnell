# Schnell

Application desktop de génération d'images par IA. Un prompt suffit — Schnell l'envoie au modèle **Flux Schnell** via un endpoint **Cloudflare Workers** personnalisé et affiche le résultat. L'image peut ensuite être téléchargée en JPEG.

## Stack

| Couche | Technologie |
|---|---|
| Shell desktop | [Electron](https://www.electronjs.org/) 40 |
| Build & bundler | [Vite](https://vitejs.dev/) 5 + [Electron Forge](https://www.electronforge.io/) 7 |
| UI framework | [Vue 3](https://vuejs.org/) (Composition API) |
| Composants UI | [PrimeVue](https://primevue.org/) 4 + PrimeIcons |
| Langage | TypeScript 5 |
| Linting / Format | ESLint + Prettier |

## Prérequis

- Node.js >= 18
- npm

## Installation

```bash
npm install
```

Copier le fichier d'exemple et renseigner les valeurs :

```bash
cp .env.example .env
```

```env
CLOUDFLARE_ENDPOINT=https://<worker>.workers.dev/
CLOUDFLARE_TOKEN=<token>
```

> `.env` est ignoré par git et ne doit jamais être commité.

## Lancer en développement

```bash
npm start
```

## Build & package

```bash
# Packager l'application
npm run package

# Créer les installeurs (deb, rpm, squirrel, zip)
npm run make
```

Les artefacts sont générés dans le dossier `out/`.

## Structure

```
src/
├── main.ts                  # Lifecycle Electron
├── preload.ts               # Bridge main ↔ renderer
├── renderer.ts              # Bootstrap Vue
├── ipc/
│   └── handlers.ts          # Handlers IPC
├── services/
│   ├── imageService.ts      # Appel Cloudflare
│   └── fileService.ts       # Sauvegarde disque
└── front/
    ├── App.vue
    ├── components/
    │   ├── AppHeader.vue
    │   ├── GenerateForm.vue
    │   └── ImageModal.vue
    ├── composables/
    │   └── useImageGeneration.ts
    └── views/
        └── Home.vue
```
