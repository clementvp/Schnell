export interface GalleryEntry {
  id: string
  filename: string
  prompt: string
  createdAt: string
}

export interface Settings {
  cloudflareEndpoint: string
  cloudflareToken: string
}
