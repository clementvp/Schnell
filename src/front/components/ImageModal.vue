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
          <i v-if="printingIndex === i" class="pi pi-spin pi-spinner print-spinner" />
          <PrintPanel
            v-else-if="pendingIndex === i"
            v-model="selectedDither"
            variant="overlay"
            :loading="isPrinting"
            @confirm="handleConfirm(src, i)"
            @cancel="pendingIndex = null"
          />
          <button v-else class="print-btn" @click.stop="pendingIndex = i">
            <i class="pi pi-print" />
          </button>
        </div>
      </div>
    </div>

    <template v-if="showPrint" #footer>
      <div class="modal-footer">
        <button class="footer-btn" @click="openInEditor(images[0])">
          <i class="pi pi-pen-to-square" /> Ouvrir dans l'éditeur
        </button>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import Dialog from 'primevue/dialog'
  import PrintPanel from './PrintPanel.vue'
  import { usePrintFlow } from '../composables/usePrintFlow'
  import { useEditorStore } from '../composables/useEditorStore'

  const router = useRouter()
  const { setImage } = useEditorStore()
  const { selectedDither, isPrinting, confirmPrint } = usePrintFlow()

  const visible = defineModel<boolean>('visible', { required: true })

  const props = defineProps<{
    images: string[]
    showPrint?: boolean
  }>()

  const title = computed(() =>
    props.images.length > 1 ? `${props.images.length} images générées` : 'Image générée'
  )

  const pendingIndex = ref<number | null>(null)
  const printingIndex = ref<number | null>(null)

  async function handleConfirm(src: string, i: number) {
    pendingIndex.value = null
    printingIndex.value = i
    await confirmPrint(src)
    printingIndex.value = null
  }

  function openInEditor(src: string) {
    setImage(src)
    visible.value = false
    router.push('/')
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

  .image-container--grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
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

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    padding: 0.25rem 0;
  }

  .footer-btn {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.9rem;
    border: 1px solid var(--p-surface-300);
    border-radius: 6px;
    background: var(--p-surface-0);
    color: var(--p-surface-700);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }

  .footer-btn:hover {
    background: var(--p-surface-100);
    color: var(--p-surface-900);
  }
</style>
