<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="true"
    :draggable="false"
    :style="{ width: '640px' }"
  >
    <template #header>
      <span class="modal-title">{{ title }}</span>
    </template>

    <img :src="imageSrc" alt="Image générée" class="result-img" />
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog'

const visible = defineModel<boolean>('visible', { required: true })

defineProps<{
  imageSrc: string
  title?: string
}>()
</script>

<style scoped>
.modal-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--p-surface-950);
}

.result-img {
  width: 100%;
  border-radius: 8px;
  display: block;
}
</style>
