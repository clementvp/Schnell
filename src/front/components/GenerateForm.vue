<template>
  <div class="generate-form">
    <h1 class="title">Génère une image</h1>
    <p class="subtitle">Décris ce que tu veux voir, Schnell s'occupe du reste.</p>

    <Textarea
      v-model="prompt"
      placeholder="Un renard roux traversant une forêt enneigée au lever du soleil…"
      rows="5"
      autoResize
      class="prompt-input"
      @keydown.ctrl.enter="emit('submit')"
      @keydown.meta.enter="emit('submit')"
    />

    <Button
      label="Générer"
      icon="pi pi-sparkles"
      iconPos="right"
      :loading="loading"
      :disabled="!prompt.trim()"
      size="large"
      class="submit-btn"
      @click="emit('submit')"
    />

    <div v-if="error" class="error-msg">
      <i class="pi pi-exclamation-triangle" />
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'

const prompt = defineModel<string>({ required: true })

defineProps<{
  loading: boolean
  error: string | null
}>()

const emit = defineEmits<{
  submit: []
}>()
</script>

<style scoped>
.generate-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  max-width: 600px;
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--p-surface-950);
  margin: 0;
}

.subtitle {
  font-size: 0.95rem;
  color: var(--p-surface-500);
  margin: 0;
}

.prompt-input {
  width: 100%;
  resize: none;
}

.submit-btn {
  align-self: flex-end;
}

.error-msg {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--p-red-500);
}
</style>
