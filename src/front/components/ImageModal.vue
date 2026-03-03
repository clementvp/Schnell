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
        <button v-if="showPrint" class="print-btn" :disabled="printing" @click="print(src)">
          <i :class="printing ? 'pi pi-spin pi-spinner' : 'pi pi-print'" />
        </button>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import Dialog from 'primevue/dialog'
  import { usePrinter } from '../composables/usePrinter'

  const visible = defineModel<boolean>('visible', { required: true })

  const props = defineProps<{
    images: string[]
    showPrint?: boolean
  }>()

  const title = computed(() =>
    props.images.length > 1 ? `${props.images.length} images générées` : 'Image générée'
  )

  const { print: doPrint } = usePrinter()
  const printing = ref(false)

  async function print(src: string) {
    printing.value = true
    try {
      await doPrint(src)
    } finally {
      printing.value = false
    }
  }
</script>

<style scoped>
  .modal-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--p-surface-950);
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

  .print-btn {
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
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

  .print-btn:disabled {
    opacity: 1;
    cursor: not-allowed;
  }

  .image-wrap:hover .print-btn {
    opacity: 1;
  }
</style>
