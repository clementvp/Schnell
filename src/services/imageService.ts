import { getSettings } from './settingsService'

export async function generateImage(prompt: string): Promise<string> {
  const { cloudflareEndpoint, cloudflareToken } = getSettings()

  if (!cloudflareEndpoint || !cloudflareToken) {
    throw new Error("Configure l'endpoint et le token Cloudflare dans les paramètres.")
  }

  const response = await fetch(cloudflareEndpoint, {
    method: 'POST',
    headers: {
      Authorization: cloudflareToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  })

  if (!response.ok) {
    throw new Error(`Erreur ${response.status} : ${await response.text()}`)
  }

  const buffer = await response.arrayBuffer()
  const base64 = Buffer.from(buffer).toString('base64')
  return `data:image/jpeg;base64,${base64}`
}
