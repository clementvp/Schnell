import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import started from 'electron-squirrel-startup'
import { registerHandlers } from './ipc/handlers'
import { getWindowState, trackWindowState } from './services/windowStateService'

app.commandLine.appendSwitch('enable-experimental-web-platform-features')

if (started) {
  app.quit()
}

let pendingBluetoothCallback: ((deviceId: string) => void) | null = null

function registerBluetoothHandlers(mainWindow: BrowserWindow): void {
  // select-bluetooth-device est un événement webContents (pas session).
  // event.preventDefault() est obligatoire pour prendre la main sur la sélection.
  mainWindow.webContents.on('select-bluetooth-device', (event, deviceList, callback) => {
    event.preventDefault()
    pendingBluetoothCallback = callback
    const filtered = deviceList.filter((d) => d.deviceName.toLowerCase().includes('mxw'))
    mainWindow.webContents.send('bluetooth:devices', filtered)
  })
}

function createWindow(): void {
  const state = getWindowState()

  const mainWindow = new BrowserWindow({
    width: state.width,
    height: state.height,
    ...(state.x !== undefined && state.y !== undefined ? { x: state.x, y: state.y } : {}),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  trackWindowState(mainWindow)
  registerBluetoothHandlers(mainWindow)

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
  }
}

app.on('ready', () => {
  registerHandlers()

  ipcMain.handle('bluetooth:select', (_event, deviceId: string) => {
    pendingBluetoothCallback?.(deviceId)
    pendingBluetoothCallback = null
  })

  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
