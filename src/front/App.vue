<template>
  <div class="app-layout">
    <Toast position="bottom-right" />
    <AppHeader />
    <main class="app-content">
      <RouterView />
    </main>
    <BluetoothPicker />
  </div>
</template>

<script setup lang="ts">
import Toast from 'primevue/toast'
import AppHeader from './components/AppHeader.vue'
import BluetoothPicker from './components/BluetoothPicker.vue'
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.app-content {
  flex: 1;
  overflow: hidden;
}
</style>
