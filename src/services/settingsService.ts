import Store from 'electron-store'
import type { Settings } from '../types'

const store = new Store<Settings>({
  defaults: {
    cloudflareEndpoint: '',
    cloudflareToken: '',
  },
})

export function getSettings(): Settings {
  return {
    cloudflareEndpoint: store.get('cloudflareEndpoint'),
    cloudflareToken: store.get('cloudflareToken'),
  }
}

export function saveSettings(settings: Partial<Settings>): void {
  if (settings.cloudflareEndpoint !== undefined) {
    store.set('cloudflareEndpoint', settings.cloudflareEndpoint)
  }
  if (settings.cloudflareToken !== undefined) {
    store.set('cloudflareToken', settings.cloudflareToken)
  }
}
