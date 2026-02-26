<template>
  <div class="home">
    <GenerateForm
      v-model="prompt"
      :loading="loading"
      :error="error"
      @submit="generate"
    />

    <ImageModal
      v-if="imageSrc"
      v-model:visible="modalVisible"
      :image-src="imageSrc"
      :saving="saving"
      @save="save"
    />
  </div>
</template>

<script setup lang="ts">
import GenerateForm from '../components/GenerateForm.vue'
import ImageModal from '../components/ImageModal.vue'
import { useImageGeneration } from '../composables/useImageGeneration'

const { prompt, loading, saving, imageSrc, error, modalVisible, generate, save } =
  useImageGeneration()
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
