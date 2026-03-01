import { ipcMain } from 'electron'
import { generateImage } from '../services/imageService'
import { saveToGallery, listGallery, getGalleryImage, deleteFromGallery } from '../services/galleryService'
import { getSettings, saveSettings } from '../services/settingsService'

export function registerHandlers(): void {
  ipcMain.handle('image:generate', (_event, prompt: string) => generateImage(prompt))
  ipcMain.handle('gallery:save', (_event, base64: string, prompt: string) => saveToGallery(base64, prompt))
  ipcMain.handle('gallery:list', () => listGallery())
  ipcMain.handle('gallery:getImage', (_event, filename: string) => getGalleryImage(filename))
  ipcMain.handle('gallery:delete', (_event, id: string) => deleteFromGallery(id))
  ipcMain.handle('settings:get', () => getSettings())
  ipcMain.handle('settings:save', (_event, settings) => saveSettings(settings))
}
