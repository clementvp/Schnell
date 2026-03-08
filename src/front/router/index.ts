import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Gallery from '../views/Gallery.vue'
import Settings from '../views/Settings.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/gallery', component: Gallery },
    { path: '/settings', component: Settings },
    { path: '/qr', component: () => import('../views/QrGenerator.vue') },
  ],
})

router.beforeEach(async (to) => {
  if (to.path === '/settings') return true
  const settings = await window.api.settings.get()
  if (!settings.cloudflareEndpoint || !settings.cloudflareToken) {
    return '/settings'
  }
  return true
})

export default router
