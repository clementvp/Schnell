<template>
  <header class="app-header">
    <div class="header-brand">
      <i class="pi pi-bolt" />
      <span class="header-title">Schnell</span>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background-color: var(--p-surface-300);
  padding: 0 2rem;
  height: 56px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-brand .pi {
  font-size: 1.25rem;
  color: var(--p-primary-color);
}

.header-title {
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--p-surface-950);
}
</style>
