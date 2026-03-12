# Schnell

Application desktop de génération et d'édition d'images par IA. Un prompt suffit — Schnell l'envoie au modèle **Flux Schnell** via un endpoint **Cloudflare Workers** personnalisé, affiche le résultat et permet de l'imprimer directement sur une imprimante thermique **MXW01** via Bluetooth.

## Stack

| Couche | Technologie |
|---|---|
| Shell desktop | [Electron](https://www.electronjs.org/) 40 |
| Build & bundler | [Vite](https://vitejs.dev/) 5 + [Electron Forge](https://www.electronforge.io/) 7 |
| UI framework | [Vue 3](https://vuejs.org/) (Composition API) |
| Composants UI | [PrimeVue](https://primevue.org/) 4 + PrimeIcons |
| Éditeur d'image | [tui-image-editor](https://github.com/nhn/tui.image-editor) |
| Génération QR | [qrcode](https://github.com/soldair/node-qrcode) |
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
    ├── router/
    │   └── index.ts             # Routes + guard Cloudflare
    ├── components/
    │   ├── AppHeader.vue        # Navigation (drawer)
    │   ├── GenerateForm.vue     # Formulaire prompt + sélecteur d'itérations
    │   ├── ImageModal.vue       # Modale résultat (grille si N images) + actions print/éditeur
    │   ├── PrintPanel.vue       # Sélecteur dithering + boutons confirm/cancel
    │   └── BluetoothPicker.vue  # Picker de device BLE (s'ouvre au moment du print)
    ├── composables/
    │   ├── useImageGeneration.ts  # Génération (prompt, N itérations parallèles, gestion erreurs)
    │   ├── usePrinter.ts          # Impression via Web Bluetooth + options de dithering
    │   ├── usePrintFlow.ts        # État du flow d'impression (pending, confirm, cancel)
    │   └── useEditorStore.ts      # Store singleton pour passer une image à l'éditeur
    └── views/
        ├── Editor.vue           # Éditeur d'image (tui-image-editor) + impression
        ├── Home.vue             # Page génération
        ├── Gallery.vue          # Galerie des images sauvegardées
        ├── QrGenerator.vue      # Générateur de QR code + impression
        └── Settings.vue         # Configuration endpoint / token Cloudflare
```

## Fonctionnalités

- **Génération** — prompt libre, génération de 1 à 4 images en parallèle (Ctrl/Cmd+Entrée)
- **Éditeur** — recadrage, rotation, filtres, texte, dessin, masques sur n'importe quelle image
- **Galerie** — toutes les images générées sont sauvegardées localement et consultables
- **QR Generator** — encodage de texte en QR code imprimable directement
- **Impression** — impression directe sur imprimante thermique MXW01 via Bluetooth, avec choix de l'algorithme de dithering (Floyd-Steinberg, Threshold, Bayer, Atkinson, Pattern)
- **Paramètres** — endpoint Cloudflare et token configurables depuis l'interface (stockés via electron-store)

---

## Bluetooth

Impression via **Web Bluetooth API** (renderer) — aucun module natif requis.

- `select-bluetooth-device` doit être écouté sur `webContents`, pas `session`
- Le flag `enable-experimental-web-platform-features` est requis avant `app.whenReady()`
- macOS exige une permission Bluetooth explicite — à accorder dans **Préférences Système → Confidentialité & Sécurité → Bluetooth** (en dev : `node_modules/electron/dist/Electron.app`, en prod : l'app packagée)
