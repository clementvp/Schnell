if (!process.env.CLOUDFLARE_ENDPOINT || !process.env.CLOUDFLARE_TOKEN) {
  throw new Error('CLOUDFLARE_ENDPOINT et CLOUDFLARE_TOKEN doivent être définis dans .env')
}

const endpoint = process.env.CLOUDFLARE_ENDPOINT as string
const token = process.env.CLOUDFLARE_TOKEN as string

export async function generateImage(prompt: string): Promise<string> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: token,
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
