import { app } from 'electron'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { GalleryEntry } from '../types'

function getGalleryDir(): string {
  let base: string
  if (app.isPackaged) {
    if (process.platform === 'darwin') {
      // exe is at Schnell.app/Contents/MacOS/Schnell — go up 3 levels to get next to .app
      base = path.resolve(path.dirname(app.getPath('exe')), '../../..')
    } else {
      // Windows: exe is at Schnell\Schnell.exe
      base = path.dirname(app.getPath('exe'))
    }
  } else {
    base = app.getAppPath()
  }
  return path.join(base, 'schnell-gallery')
}

const historyPath = () => path.join(getGalleryDir(), 'history.json')

async function ensureDir(): Promise<void> {
  await fs.mkdir(getGalleryDir(), { recursive: true })
}

async function readHistory(): Promise<GalleryEntry[]> {
  try {
    const data = await fs.readFile(historyPath(), 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeHistory(entries: GalleryEntry[]): Promise<void> {
  await fs.writeFile(historyPath(), JSON.stringify(entries, null, 2))
}

export async function saveToGallery(base64: string, prompt: string): Promise<GalleryEntry> {
  await ensureDir()

  const id = crypto.randomUUID()
  const filename = `schnell-${id}.jpg`
  const filePath = path.join(getGalleryDir(), filename)

  const data = base64.replace(/^data:image\/jpeg;base64,/, '')
  await fs.writeFile(filePath, Buffer.from(data, 'base64'))

  const entry: GalleryEntry = { id, filename, prompt, createdAt: new Date().toISOString() }

  const history = await readHistory()
  history.unshift(entry)
  await writeHistory(history)

  return entry
}

export async function listGallery(): Promise<GalleryEntry[]> {
  return readHistory()
}

export async function getGalleryImage(filename: string): Promise<string> {
  const data = await fs.readFile(path.join(getGalleryDir(), filename))
  return `data:image/jpeg;base64,${data.toString('base64')}`
}

export async function deleteFromGallery(id: string): Promise<void> {
  const history = await readHistory()
  const entry = history.find((e) => e.id === id)
  if (entry) {
    await fs.unlink(path.join(getGalleryDir(), entry.filename)).catch(() => {})
    await writeHistory(history.filter((e) => e.id !== id))
  }
}
