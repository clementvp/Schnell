import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import started from 'electron-squirrel-startup'
import { registerHandlers } from './ipc/handlers'
import { getWindowState, trackWindowState } from './services/windowStateService'

if (started) {
  app.quit()
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

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
  }
}

app.on('ready', () => {
  registerHandlers()
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
