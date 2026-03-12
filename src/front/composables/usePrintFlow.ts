import { ref } from 'vue'
import { usePrinter, type DitherAlgorithm } from './usePrinter'

export function usePrintFlow() {
  const { print } = usePrinter()

  const selectedDither = ref<DitherAlgorithm>('steinberg')
  const isPending = ref(false)
  const isPrinting = ref(false)

  function requestPrint() {
    isPending.value = true
  }

  function cancelPrint() {
    isPending.value = false
  }

  async function confirmPrint(src: string) {
    isPending.value = false
    isPrinting.value = true
    try {
      await print(src, selectedDither.value)
    } finally {
      isPrinting.value = false
    }
  }

  return { selectedDither, isPending, isPrinting, requestPrint, cancelPrint, confirmPrint }
}
