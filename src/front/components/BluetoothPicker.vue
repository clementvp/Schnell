<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="false"
    :draggable="false"
    :style="{ width: '380px' }"
    @hide="cancel"
  >
    <template #header>
      <span class="picker-title">Choisir une imprimante</span>
    </template>

    <div v-if="devices.length === 0" class="scanning">
      <i class="pi pi-spin pi-spinner" />
      <span>Recherche en cours…</span>
    </div>

    <ul v-else class="device-list">
      <li
        v-for="device in devices"
        :key="device.deviceId"
        class="device-item"
        @click="select(device.deviceId)"
      >
        <i class="pi pi-print" />
        <span>{{ device.deviceName || 'Appareil inconnu' }}</span>
      </li>
    </ul>

    <template #footer>
      <Button label="Annuler" severity="secondary" text @click="cancel" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import Dialog from 'primevue/dialog'
  import Button from 'primevue/button'
  import type { BluetoothDevice } from '../../preload'

  const visible = ref(false)
  const devices = ref<BluetoothDevice[]>([])

  onMounted(() => {
    window.api.bluetooth.onDevices((incoming) => {
      devices.value = incoming
      visible.value = true
    })
  })

  function select(deviceId: string) {
    visible.value = false
    window.api.bluetooth.select(deviceId)
  }

  function cancel() {
    visible.value = false
    devices.value = []
    window.api.bluetooth.select('')
  }
</script>

<style scoped>
  .picker-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--p-surface-950);
  }

  .scanning {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 0;
    color: var(--p-surface-500);
    font-size: 0.9rem;
  }

  .device-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .device-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    color: var(--p-surface-800);
    transition: background 0.15s;
  }

  .device-item:hover {
    background: var(--p-surface-100);
  }
</style>
