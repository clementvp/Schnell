import { ipcMain } from 'electron'
import { generateImage } from '../services/imageService'
import { saveImage } from '../services/fileService'

export function registerHandlers(): void {
  ipcMain.handle('image:generate', (_event, prompt: string) => generateImage(prompt))
  ipcMain.handle('image:save', (_event, base64: string) => saveImage(base64))
}
