import { app, dialog } from 'electron'
import fs from 'node:fs/promises'
import path from 'node:path'

export async function saveImage(base64: string): Promise<boolean> {
  const { filePath, canceled } = await dialog.showSaveDialog({
    title: "Enregistrer l'image",
    defaultPath: path.join(app.getPath('pictures'), `schnell-${Date.now()}.jpg`),
    filters: [{ name: 'Image JPEG', extensions: ['jpg'] }],
  })

  if (canceled || !filePath) return false

  const data = base64.replace(/^data:image\/jpeg;base64,/, '')
  await fs.writeFile(filePath, Buffer.from(data, 'base64'))
  return true
}
