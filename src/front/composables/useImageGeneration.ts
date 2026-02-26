import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'

export function useImageGeneration() {
  const toast = useToast()

  const prompt = ref('')
  const loading = ref(false)
  const saving = ref(false)
  const imageSrc = ref<string | null>(null)
  const error = ref<string | null>(null)
  const modalVisible = ref(false)

  async function generate() {
    if (!prompt.value.trim()) return

    loading.value = true
    error.value = null

    try {
      imageSrc.value = await window.api.generateImage(prompt.value.trim())
      modalVisible.value = true
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Une erreur est survenue.'
    } finally {
      loading.value = false
    }
  }

  async function save() {
    if (!imageSrc.value) return

    saving.value = true
    const saved = await window.api.saveImage(imageSrc.value)
    saving.value = false

    if (saved) {
      modalVisible.value = false
      toast.add({
        severity: 'success',
        summary: 'Image sauvegardée',
        detail: 'Le fichier a bien été enregistré.',
        life: 3000,
      })
    }
  }

  return { prompt, loading, saving, imageSrc, error, modalVisible, generate, save }
}
