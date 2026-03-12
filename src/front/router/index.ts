import { createRouter, createWebHashHistory } from 'vue-router'
import Editor from '../views/Editor.vue'
import Gallery from '../views/Gallery.vue'
import Settings from '../views/Settings.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Editor },
    { path: '/generate', component: () => import('../views/Home.vue') },
    { path: '/gallery', component: Gallery },
    { path: '/settings', component: Settings },
    { path: '/qr', component: () => import('../views/QrGenerator.vue') },
  ],
})

const PUBLIC_ROUTES = ['/', '/gallery', '/settings', '/qr']

router.beforeEach(async (to) => {
  if (PUBLIC_ROUTES.includes(to.path)) return true
  const settings = await window.api.settings.get()
  if (!settings.cloudflareEndpoint || !settings.cloudflareToken) {
    return '/settings'
  }
  return true
})

export default router
