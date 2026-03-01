import Store from 'electron-store'
import { BrowserWindow, screen } from 'electron'

interface WindowState {
  x?: number
  y?: number
  width: number
  height: number
}

const store = new Store<{ windowState: WindowState }>({
  defaults: {
    windowState: { width: 800, height: 600 },
  },
})

function isOnScreen(state: WindowState): boolean {
  if (state.x === undefined || state.y === undefined) return false
  return screen.getAllDisplays().some((display) => {
    const { x, y, width, height } = display.workArea
    return (
      state.x! >= x &&
      state.y! >= y &&
      state.x! + state.width <= x + width &&
      state.y! + state.height <= y + height
    )
  })
}

export function getWindowState(): WindowState {
  const state = store.get('windowState')
  if (!isOnScreen(state)) {
    return { width: state.width, height: state.height }
  }
  return state
}

export function trackWindowState(win: BrowserWindow): void {
  const save = () => store.set('windowState', win.getBounds())
  win.on('resize', save)
  win.on('move', save)
}
