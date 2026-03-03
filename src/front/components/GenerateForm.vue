<template>
  <div class="generate-form">
    <h1 class="page-title">Générez une image</h1>
    <p class="page-subtitle">Décrivez ce que vous souhaitez voir, Schnell s'occupe du reste.</p>

    <Textarea
      v-model="prompt"
      placeholder="Un renard roux traversant une forêt enneigée au lever du soleil…"
      rows="5"
      autoResize
      class="prompt-input"
      @keydown.ctrl.enter="emit('submit')"
      @keydown.meta.enter="emit('submit')"
    />

    <div class="form-footer">
      <div class="iterations-field">
        <label class="iterations-label">Images</label>
        <Select
          v-model="iterations"
          :options="[1, 2, 3, 4]"
          class="iterations-select"
        />
      </div>

      <Button
        :label="iterations === 1 ? 'Générer' : `Générer ${iterations}`"
        icon="pi pi-sparkles"
        iconPos="right"
        :loading="loading"
        :disabled="!prompt.trim()"
        size="large"
        @click="emit('submit')"
      />
    </div>

    <div v-if="error" class="error-banner">
      <div class="error-banner-header">
        <i class="pi pi-times-circle" />
        <span class="error-banner-title">Une erreur est survenue</span>
      </div>
      <p class="error-banner-detail">{{ error.detail }}</p>
      <RouterLink v-if="error.showSettings" to="/settings" class="error-banner-link">
        <i class="pi pi-cog" />
        Vérifier les paramètres
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Select from 'primevue/select'
import type { GenerationError } from '../composables/useImageGeneration'

const prompt = defineModel<string>({ required: true })
const iterations = defineModel<number>('iterations', { required: true })

defineProps<{
  loading: boolean
  error: GenerationError | null
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

.prompt-input {
  width: 100%;
  resize: none;
}

.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.iterations-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.iterations-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--p-surface-600);
  white-space: nowrap;
}

.iterations-select {
  width: 80px;
}

.error-banner {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1rem 1.1rem;
  border-radius: 8px;
  background: var(--p-red-50);
  border: 1px solid var(--p-red-200);
}

.error-banner-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--p-red-700);
}

.error-banner-header .pi {
  font-size: 1rem;
}

.error-banner-title {
  font-size: 0.95rem;
  font-weight: 600;
}

.error-banner-detail {
  margin: 0;
  font-size: 0.875rem;
  color: var(--p-red-600);
  padding-left: 1.5rem;
}

.error-banner-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.25rem;
  padding-left: 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--p-red-700);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.error-banner-link:hover {
  color: var(--p-red-900);
}
</style>
