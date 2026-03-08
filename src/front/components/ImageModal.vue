<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="true"
    :draggable="false"
    :style="{ width: images.length > 1 ? '900px' : '640px' }"
  >
    <template #header>
      <span class="modal-title">{{ title }}</span>
    </template>

    <div :class="['image-container', images.length > 1 && 'image-container--grid']">
      <div v-for="(src, i) in images" :key="i" class="image-wrap">
        <img :src="src" alt="Image générée" class="result-img" />
        <div v-if="showPrint" class="print-overlay">
          <template v-if="printingIndex === i">
            <i class="pi pi-spin pi-spinner print-spinner" />
          </template>
          <template v-else-if="pendingIndex === i">
            <div class="dither-panel">
              <select v-model="selectedDither" class="dither-select" @click.stop>
                <option v-for="opt in ditherOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
              <button class="confirm-btn" @click.stop="confirmPrint(src, i)">
                <i class="pi pi-print" />
              </button>
              <button class="cancel-btn" @click.stop="pendingIndex = null">
                <i class="pi pi-times" />
              </button>
            </div>
          </template>
          <template v-else>
            <button class="print-btn" @click.stop="pendingIndex = i">
              <i class="pi pi-print" />
            </button>
          </template>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import Dialog from 'primevue/dialog'
  import { usePrinter, ditherOptions, type DitherAlgorithm } from '../composables/usePrinter'

  const visible = defineModel<boolean>('visible', { required: true })

  const props = defineProps<{
    images: string[]
    showPrint?: boolean
  }>()

  const title = computed(() =>
    props.images.length > 1 ? `${props.images.length} images générées` : 'Image générée'
  )

  const selectedDither = ref<DitherAlgorithm>('steinberg')
  const pendingIndex = ref<number | null>(null)
  const printingIndex = ref<number | null>(null)

  const { print: doPrint } = usePrinter()

  async function confirmPrint(src: string, i: number) {
    pendingIndex.value = null
    printingIndex.value = i
    try {
      await doPrint(src, selectedDither.value)
    } finally {
      printingIndex.value = null
    }
  }
</script>

<style scoped>
  .modal-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--p-surface-950);
  }

  .image-container {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .image-wrap {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
  }

  .result-img {
    width: 100%;
    display: block;
  }

  .print-overlay {
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .print-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s;
    font-size: 0.8rem;
  }

  .image-wrap:hover .print-btn {
    opacity: 1;
  }

  .print-spinner {
    color: #fff;
    font-size: 0.9rem;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.6));
  }

  .dither-panel {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    border-radius: 20px;
    padding: 0.25rem 0.4rem;
  }

  .dither-select {
    padding: 0.2rem 0.4rem;
    border-radius: 12px;
    border: none;
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
    font-size: 0.75rem;
    cursor: pointer;
    outline: none;
  }

  .dither-select option {
    background: #222;
    color: #fff;
  }

  .confirm-btn,
  .cancel-btn {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.7rem;
  }

  .confirm-btn {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
  }

  .cancel-btn {
    background: transparent;
    color: rgba(255, 255, 255, 0.6);
  }

  .confirm-btn:hover {
    background: rgba(255, 255, 255, 0.35);
  }

  .cancel-btn:hover {
    color: #fff;
  }
</style>
