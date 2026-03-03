#!/usr/bin/env node
/**
 * Génère les icônes de l'app pour tous les OS.
 * Usage : dépose une image PNG (1024x1024 min) dans icon-source/, puis lance :
 *   npm run set-icon
 */

import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SOURCE_DIR = path.join(ROOT, 'icon-source');
const BUILD_DIR = path.join(ROOT, 'build');
const ICONS_DIR = path.join(BUILD_DIR, 'icons');

// --- Trouver l'image source ---
if (!fs.existsSync(SOURCE_DIR)) fs.mkdirSync(SOURCE_DIR, { recursive: true });

const files = fs.readdirSync(SOURCE_DIR).filter(f => /\.(png|jpg|jpeg)$/i.test(f));

if (files.length === 0) {
  console.error('❌  Aucune image trouvée dans icon-source/');
  console.error('    Dépose-y une image PNG (1024×1024 minimum) puis relance npm run set-icon.');
  process.exit(1);
}

const sourceImage = path.join(SOURCE_DIR, files[0]);
console.log(`🖼  Image source : ${files[0]}`);

// --- Générer les icônes avec electron-icon-builder ---
fs.mkdirSync(BUILD_DIR, { recursive: true });

console.log('⚙️  Génération des icônes...');

const result = spawnSync(
  'npx',
  ['--yes', 'electron-icon-builder', `--input=${sourceImage}`, `--output=${BUILD_DIR}`],
  { stdio: 'inherit', shell: true }
);

if (result.status !== 0) {
  console.error('❌  Échec de la génération. Assure-toi que ton image fait au moins 1024×1024 px.');
  process.exit(1);
}

// --- Copier vers build/icon.{icns,ico,png} (chemin attendu par forge.config.ts) ---
let ok = 0;

const icnsSource = path.join(ICONS_DIR, 'mac', 'icon.icns');
if (fs.existsSync(icnsSource)) {
  fs.copyFileSync(icnsSource, path.join(BUILD_DIR, 'icon.icns'));
  console.log('✅  build/icon.icns  (macOS)');
  ok++;
}

const icoSource = path.join(ICONS_DIR, 'win', 'icon.ico');
if (fs.existsSync(icoSource)) {
  fs.copyFileSync(icoSource, path.join(BUILD_DIR, 'icon.ico'));
  console.log('✅  build/icon.ico   (Windows)');
  ok++;
}

const pngDir = path.join(ICONS_DIR, 'png');
if (fs.existsSync(pngDir)) {
  const pngs = fs.readdirSync(pngDir).filter(f => f.endsWith('.png')).sort((a, b) => {
    const sa = parseInt(a.split('x')[0]) || 0;
    const sb = parseInt(b.split('x')[0]) || 0;
    return sb - sa; // descending → largest first
  });
  if (pngs.length > 0) {
    fs.copyFileSync(path.join(pngDir, pngs[0]), path.join(BUILD_DIR, 'icon.png'));
    console.log('✅  build/icon.png   (Linux)');
    ok++;
  }
}

if (ok === 0) {
  console.error('❌  Aucun fichier généré. Vérifie la sortie de electron-icon-builder ci-dessus.');
  process.exit(1);
}

console.log('\n🎉  Icônes prêtes ! Lance npm run make pour packager l\'app.');
