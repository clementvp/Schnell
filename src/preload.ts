import { contextBridge, ipcRenderer } from 'electron'
import type { GalleryEntry, Settings } from './types'

const api = {
  generateImage: (prompt: string): Promise<string> => ipcRenderer.invoke('image:generate', prompt),
  gallery: {
    save: (base64: string, prompt: string): Promise<GalleryEntry> =>
      ipcRenderer.invoke('gallery:save', base64, prompt),
    list: (): Promise<GalleryEntry[]> => ipcRenderer.invoke('gallery:list'),
    getImage: (filename: string): Promise<string> =>
      ipcRenderer.invoke('gallery:getImage', filename),
    delete: (id: string): Promise<void> => ipcRenderer.invoke('gallery:delete', id),
  },
  settings: {
    get: (): Promise<Settings> => ipcRenderer.invoke('settings:get'),
    save: (settings: Partial<Settings>): Promise<void> =>
      ipcRenderer.invoke('settings:save', settings),
  },
}

contextBridge.exposeInMainWorld('api', api)

export type Api = typeof api
