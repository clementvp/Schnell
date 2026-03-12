<template>
  <div :class="['print-panel', `print-panel--${variant}`]">
    <select v-model="dither" class="print-panel__select">
      <option v-for="opt in ditherOptions" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>

    <button class="print-panel__btn print-panel__btn--confirm" :disabled="loading" @click="emit('confirm')">
      <i :class="loading ? 'pi pi-spin pi-spinner' : 'pi pi-print'" />
    </button>

    <button class="print-panel__btn print-panel__btn--cancel" @click="emit('cancel')">
      <i class="pi pi-times" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ditherOptions, type DitherAlgorithm } from '../composables/usePrinter'

const dither = defineModel<DitherAlgorithm>({ required: true })

withDefaults(defineProps<{
  loading?: boolean
  variant?: 'toolbar' | 'overlay'
}>(), {
  variant: 'toolbar',
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<style scoped>
.print-panel {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
}

.print-panel__select {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
  outline: none;
}

.print-panel__select option {
  background: #222;
  color: #fff;
}

.print-panel__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
}

.print-panel__btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.print-panel__btn--confirm {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.print-panel__btn--confirm:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.35);
}

.print-panel__btn--cancel {
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
}

.print-panel__btn--cancel:hover {
  color: #fff;
}

.print-panel--toolbar {
  border-radius: 8px;
  padding: 0.4rem 0.6rem;
}

.print-panel--toolbar .print-panel__select {
  padding: 0.35rem 0.6rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.85rem;
}

.print-panel--toolbar .print-panel__btn {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  font-size: 0.85rem;
}

.print-panel--overlay {
  border-radius: 20px;
  padding: 0.25rem 0.4rem;
}

.print-panel--overlay .print-panel__select {
  padding: 0.2rem 0.4rem;
  border-radius: 12px;
  border: none;
  font-size: 0.75rem;
}

.print-panel--overlay .print-panel__btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  font-size: 0.7rem;
}
</style>
