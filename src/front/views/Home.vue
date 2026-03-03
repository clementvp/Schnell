<template>
  <div class="home">
    <GenerateForm
      v-model="prompt"
      v-model:iterations="iterations"
      :loading="loading"
      :error="error"
      @submit="generate"
    />

    <ImageModal
      v-if="images.length"
      v-model:visible="modalVisible"
      :images="images"
    />
  </div>
</template>

<script setup lang="ts">
import GenerateForm from '../components/GenerateForm.vue'
import ImageModal from '../components/ImageModal.vue'
import { useImageGeneration } from '../composables/useImageGeneration'

const { prompt, iterations, loading, images, error, modalVisible, generate } = useImageGeneration()
</script>

<style scoped>
.home {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 2rem;
}
</style>
