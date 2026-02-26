import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    define: {
      'process.env.CLOUDFLARE_TOKEN': JSON.stringify(env.CLOUDFLARE_TOKEN ?? ''),
      'process.env.CLOUDFLARE_ENDPOINT': JSON.stringify(env.CLOUDFLARE_ENDPOINT ?? ''),
    },
  }
})
