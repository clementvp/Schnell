import { contextBridge, ipcRenderer } from 'electron'

const api = {
  generateImage: (prompt: string): Promise<string> => ipcRenderer.invoke('image:generate', prompt),
  saveImage: (base64: string): Promise<boolean> => ipcRenderer.invoke('image:save', base64),
}

contextBridge.exposeInMainWorld('api', api)

export type Api = typeof api
