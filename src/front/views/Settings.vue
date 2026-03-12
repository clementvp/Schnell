<template>
  <div class="settings">
    <div v-if="showSetupBanner" class="setup-banner">
      <i class="pi pi-exclamation-triangle" />
      <span>Configurez votre accès Cloudflare pour commencer à générer des images.</span>
    </div>

    <h1 class="page-title">Paramètres</h1>
    <p class="page-subtitle">Configuration de l'accès à l'API Cloudflare.</p>

    <div class="field">
      <label for="endpoint">Endpoint</label>
      <InputText
        id="endpoint"
        v-model="form.cloudflareEndpoint"
        placeholder="https://api.cloudflare.com/..."
        class="w-full"
      />
    </div>

    <div class="field">
      <label for="token">Token</label>
      <Password
        id="token"
        v-model="form.cloudflareToken"
        placeholder="Bearer ..."
        :feedback="false"
        toggleMask
        fluid
      />
    </div>

    <Button
      label="Sauvegarder"
      icon="pi pi-check"
      :loading="saving"
      :disabled="!isDirty"
      @click="save"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const saving = ref(false)
const showSetupBanner = ref(false)

const initial = reactive({ cloudflareEndpoint: '', cloudflareToken: '' })
const form = reactive({ cloudflareEndpoint: '', cloudflareToken: '' })

const isDirty = computed(
  () =>
    form.cloudflareEndpoint !== initial.cloudflareEndpoint ||
    form.cloudflareToken !== initial.cloudflareToken,
)

onMounted(async () => {
  const settings = await window.api.settings.get()
  form.cloudflareEndpoint = settings.cloudflareEndpoint
  form.cloudflareToken = settings.cloudflareToken
  initial.cloudflareEndpoint = settings.cloudflareEndpoint
  initial.cloudflareToken = settings.cloudflareToken
  showSetupBanner.value = !settings.cloudflareEndpoint || !settings.cloudflareToken
})

async function save() {
  saving.value = true
  try {
    await window.api.settings.save({
      cloudflareEndpoint: form.cloudflareEndpoint,
      cloudflareToken: form.cloudflareToken,
    })
    initial.cloudflareEndpoint = form.cloudflareEndpoint
    initial.cloudflareToken = form.cloudflareToken
    showSetupBanner.value = false
    toast.add({ severity: 'success', summary: 'Paramètres sauvegardés', life: 3000 })
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 480px;
  margin: 3rem auto 0;
  padding: 0 2rem;
}

.setup-banner {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: var(--p-yellow-100);
  color: var(--p-yellow-800);
  font-size: 0.9rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--p-surface-700);
}
</style>
