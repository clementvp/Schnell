<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="true"
    :draggable="false"
    :style="{ width: '640px' }"
  >
    <template #header>
      <span class="modal-title">Image générée</span>
    </template>

    <img :src="imageSrc" alt="Image générée" class="result-img" />

    <template #footer>
      <Button
        label="Télécharger"
        icon="pi pi-download"
        :loading="saving"
        @click="emit('save')"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const visible = defineModel<boolean>('visible', { required: true })

defineProps<{
  imageSrc: string
  saving: boolean
}>()

const emit = defineEmits<{
  save: []
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
