<template>
  <header class="app-header">
    <div class="header-brand">
      <i class="pi pi-bolt" />
      <span class="header-title">Schnell</span>
    </div>

    <button class="burger-btn" @click="open = true">
      <i class="pi pi-bars" />
    </button>

    <Drawer v-model:visible="open" position="right" :style="{ width: '220px' }">
      <template #header>
        <span class="drawer-title">Navigation</span>
      </template>
      <nav class="drawer-nav">
        <RouterLink to="/" class="nav-link" exact-active-class="nav-link--active" @click="open = false">
          <i class="pi pi-sparkles" />
          Générer
        </RouterLink>
        <RouterLink to="/gallery" class="nav-link" active-class="nav-link--active" @click="open = false">
          <i class="pi pi-images" />
          Galerie
        </RouterLink>
        <hr class="nav-divider" />
        <RouterLink to="/settings" class="nav-link" active-class="nav-link--active" @click="open = false">
          <i class="pi pi-cog" />
          Paramètres
        </RouterLink>
      </nav>
    </Drawer>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Drawer from 'primevue/drawer'

const open = ref(false)
</script>

<style scoped>
.app-header {
  background-color: var(--p-surface-300);
  padding: 0 2rem;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-brand .pi-bolt {
  font-size: 1.25rem;
  color: var(--p-primary-color);
}

.header-title {
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--p-surface-950);
}

.burger-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 6px;
  color: var(--p-surface-700);
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  transition: background 0.15s, color 0.15s;
}

.burger-btn:hover {
  background: var(--p-surface-400);
  color: var(--p-surface-950);
}

.drawer-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--p-surface-600);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.drawer-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-top: 0.5rem;
}

.nav-divider {
  border: none;
  border-top: 1px solid var(--p-surface-200);
  margin: 0.25rem 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.75rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--p-surface-600);
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}

.nav-link:hover {
  background: var(--p-surface-100);
  color: var(--p-surface-900);
}

.nav-link--active {
  background: var(--p-primary-color);
  color: #fff;
}

.nav-link--active:hover {
  background: var(--p-primary-color);
  color: #fff;
}
</style>
