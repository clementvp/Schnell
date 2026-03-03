<template>
  <div class="gallery">
    <div v-if="loading" class="centered-state">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem; color: var(--p-surface-400)" />
    </div>

    <div v-else-if="entries.length === 0" class="centered-state">
      <i class="pi pi-images" />
      <p>Aucune image générée pour l'instant.</p>
    </div>

    <div v-else class="grid">
      <div v-for="entry in entries" :key="entry.id" class="card" @click="open(entry)">
        <div class="card-img-wrap">
          <img
            v-if="images[entry.id]"
            :src="images[entry.id]"
            :alt="entry.prompt"
            class="card-img"
          />
          <div v-else class="card-img-placeholder">
            <i class="pi pi-spin pi-spinner" />
          </div>
          <button class="delete-btn" @click.stop="remove(entry.id)">
            <i class="pi pi-trash" />
          </button>
        </div>
        <div class="card-meta">
          <p class="card-prompt">{{ entry.prompt }}</p>
          <span class="card-date">{{ formatDate(entry.createdAt) }}</span>
        </div>
      </div>
    </div>

    <ImageModal
      v-if="selectedEntry && images[selectedEntry.id]"
      v-model:visible="modalVisible"
      :images="[images[selectedEntry.id]]"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { GalleryEntry } from '../../types'
import ImageModal from '../components/ImageModal.vue'

const entries = ref<GalleryEntry[]>([])
const images = ref<Record<string, string>>({})
const loading = ref(true)
const modalVisible = ref(false)
const selectedEntry = ref<GalleryEntry | null>(null)

onMounted(async () => {
  entries.value = await window.api.gallery.list()
  loading.value = false
  loadImages()
})

function loadImages(): void {
  Promise.all(
    entries.value.map(async (entry) => {
      images.value[entry.id] = await window.api.gallery.getImage(entry.filename)
    }),
  )
}

function open(entry: GalleryEntry): void {
  if (!images.value[entry.id]) return
  selectedEntry.value = entry
  modalVisible.value = true
}

async function remove(id: string): Promise<void> {
  await window.api.gallery.delete(id)
  delete images.value[id]
  entries.value = entries.value.filter((e) => e.id !== id)
  if (selectedEntry.value?.id === id) {
    modalVisible.value = false
    selectedEntry.value = null
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.gallery {
  padding: 2rem;
  min-height: 100%;
}

.centered-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  height: calc(100vh - 56px - 4rem);
  color: var(--p-surface-400);
}

.centered-state .pi-images {
  font-size: 3rem;
}

.centered-state p {
  margin: 0;
  font-size: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
}

.card {
  background: var(--p-surface-100);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.card-img-wrap {
  position: relative;
  aspect-ratio: 1;
  background: var(--p-surface-200);
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--p-surface-400);
  font-size: 1.5rem;
}

.delete-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 28px;
  height: 28px;
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
  font-size: 0.75rem;
}

.card-img-wrap:hover .delete-btn {
  opacity: 1;
}

.card-meta {
  padding: 0.75rem;
}

.card-prompt {
  margin: 0 0 0.4rem;
  font-size: 0.82rem;
  color: var(--p-surface-700);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-date {
  font-size: 0.75rem;
  color: var(--p-surface-400);
}
</style>
