import { ref } from 'vue'

const _pendingImage = ref<string | null>(null)

export function useEditorStore() {
  function setImage(base64: string) {
    _pendingImage.value = base64
  }

  function consumeImage(): string | null {
    const img = _pendingImage.value
    _pendingImage.value = null
    return img
  }

  return { setImage, consumeImage }
}
