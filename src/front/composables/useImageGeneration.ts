import { ref } from 'vue'

export interface GenerationError {
  detail: string
  showSettings: boolean
}

function parseError(e: unknown): GenerationError {
  const msg = e instanceof Error ? e.message : ''

  if (msg.includes('401') || msg.includes('403')) {
    return {
      detail: 'Token invalide ou expiré. Vérifiez vos paramètres.',
      showSettings: true,
    }
  }
  if (/Erreur 5\d\d/.test(msg)) {
    return {
      detail: 'Le service Cloudflare est temporairement indisponible.',
      showSettings: false,
    }
  }
  if (msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network')) {
    return {
      detail: "L'endpoint est inaccessible. Vérifiez l'URL dans vos paramètres.",
      showSettings: true,
    }
  }
  if (msg.includes('paramètres')) {
    return { detail: msg, showSettings: true }
  }
  return {
    detail: 'Une erreur inattendue est survenue. Veuillez réessayer.',
    showSettings: false,
  }
}

export function useImageGeneration() {
  const prompt = ref('')
  const loading = ref(false)
  const imageSrc = ref<string | null>(null)
  const error = ref<GenerationError | null>(null)
  const modalVisible = ref(false)

  async function generate() {
    if (!prompt.value.trim()) return

    loading.value = true
    error.value = null

    try {
      const result = await window.api.generateImage(prompt.value.trim())
      imageSrc.value = result
      modalVisible.value = true
      window.api.gallery.save(result, prompt.value.trim()).catch(console.error)
    } catch (e: unknown) {
      error.value = parseError(e)
    } finally {
      loading.value = false
    }
  }

  return { prompt, loading, imageSrc, error, modalVisible, generate }
}
