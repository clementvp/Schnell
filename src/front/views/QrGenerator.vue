<template>
  <div class="qr-page">
    <div class="qr-form">
      <Textarea
        v-model="text"
        rows="4"
        placeholder="Saisir le texte à encoder…"
        class="qr-textarea"
        auto-resize
      />
      <Button
        label="Générer"
        icon="pi pi-qrcode"
        :disabled="!text.trim()"
        @click="generate"
      />
    </div>

    <div v-if="hasQr" class="qr-preview">
      <canvas ref="canvasRef" class="qr-canvas" />

      <div class="qr-actions">
        <select v-model="selectedDither" class="dither-select">
          <option v-for="opt in ditherOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
        <Button
          icon="pi pi-print"
          label="Imprimer"
          :loading="printing"
          :disabled="printing"
          @click="handlePrint"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import QRCode from 'qrcode'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import { usePrinter, ditherOptions, type DitherAlgorithm } from '../composables/usePrinter'

const text = ref('')
const canvasRef = ref<HTMLCanvasElement | null>(null)
const hasQr = ref(false)
const printing = ref(false)
const selectedDither = ref<DitherAlgorithm>('steinberg')

const { print: doPrint } = usePrinter()

async function generate() {
  if (!text.value.trim()) return
  hasQr.value = true
  await nextTick()
  if (!canvasRef.value) return
  await QRCode.toCanvas(canvasRef.value, text.value.trim(), {
    width: 384,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
  })
}

async function handlePrint() {
  if (!canvasRef.value) return
  printing.value = true
  try {
    const dataUrl = canvasRef.value.toDataURL('image/png')
    await doPrint(dataUrl, selectedDither.value)
  } finally {
    printing.value = false
  }
}
</script>

<style scoped>
.qr-page {
  max-width: 480px;
  margin: 2rem auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.qr-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.qr-textarea {
  width: 100%;
  resize: vertical;
}

.qr-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.qr-canvas {
  border-radius: 8px;
  max-width: 100%;
}

.qr-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  justify-content: center;
}

.dither-select {
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  border: 1px solid var(--p-surface-300);
  background: var(--p-surface-0);
  color: var(--p-surface-900);
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
}

.dither-select:focus {
  border-color: var(--p-primary-color);
}
</style>
