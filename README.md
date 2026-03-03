# Schnell

Application desktop de génération d'images par IA. Un prompt suffit — Schnell l'envoie au modèle **Flux Schnell** via un endpoint **Cloudflare Workers** personnalisé, affiche le résultat et permet de l'imprimer directement sur une imprimante thermique **MXW01** via Bluetooth.

## Stack

| Couche | Technologie |
|---|---|
| Shell desktop | [Electron](https://www.electronjs.org/) 40 |
| Build & bundler | [Vite](https://vitejs.dev/) 5 + [Electron Forge](https://www.electronforge.io/) 7 |
| UI framework | [Vue 3](https://vuejs.org/) (Composition API) |
| Composants UI | [PrimeVue](https://primevue.org/) 4 + PrimeIcons |
| Langage | TypeScript 5 |
| Linting / Format | ESLint + Prettier |
| Impression | [mxw01-thermal-printer](https://github.com/clementvp/mxw01-thermal-printer) — Web Bluetooth |

## Prérequis

- Node.js >= 18
- npm
- macOS avec Bluetooth activé (pour l'impression)

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
├── main.ts                      # Lifecycle Electron + handlers Bluetooth
├── preload.ts                   # Bridge main ↔ renderer (API exposée via contextBridge)
├── renderer.ts                  # Bootstrap Vue
├── ipc/
│   └── handlers.ts              # Handlers IPC (génération, galerie, settings)
├── services/
│   ├── imageService.ts          # Appel Cloudflare AI
│   ├── galleryService.ts        # Sauvegarde et lecture des images locales
│   ├── settingsService.ts       # Persistance des paramètres (electron-store)
│   └── windowStateService.ts   # Mémorisation taille/position fenêtre
└── front/
    ├── App.vue                  # Layout racine + BluetoothPicker global
    ├── components/
    │   ├── AppHeader.vue        # Navigation
    │   ├── GenerateForm.vue     # Formulaire prompt + sélecteur d'itérations
    │   ├── ImageModal.vue       # Modale résultat (grille si N images) + bouton print
    │   └── BluetoothPicker.vue  # Picker de device BLE (s'ouvre au moment du print)
    ├── composables/
    │   ├── useImageGeneration.ts  # Logique de génération (prompt, N itérations parallèles)
    │   └── usePrinter.ts          # Impression via Web Bluetooth + resize canvas
    └── views/
        ├── Home.vue             # Page principale
        ├── Gallery.vue          # Galerie des images sauvegardées
        └── Settings.vue         # Configuration endpoint / token Cloudflare
```

## Fonctionnalités

- **Génération** — prompt libre, génération de 1 à 4 images en parallèle (Ctrl/Cmd+Entrée)
- **Galerie** — toutes les images générées sont sauvegardées localement et consultables
- **Impression** — impression directe sur imprimante thermique MXW01 via Bluetooth

---

## Bluetooth

Impression via **Web Bluetooth API** (renderer) — aucun module natif requis.

- `select-bluetooth-device` doit être écouté sur `webContents`, pas `session`
- Le flag `enable-experimental-web-platform-features` est requis avant `app.whenReady()`
- macOS exige une permission Bluetooth explicite — à accorder dans **Préférences Système → Confidentialité & Sécurité → Bluetooth** (en dev : `node_modules/electron/dist/Electron.app`, en prod : l'app packagée)
