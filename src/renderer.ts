import { createApp } from 'vue'
import App from './front/App.vue'
import router from './front/router'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'
import 'primeicons/primeicons.css'
import './assets/main.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#f2f2f0',
      100: '#e3e3e0',
      200: '#c8c8c3',
      300: '#a0a09a',
      400: '#6b6b64',
      500: '#191917',
      600: '#141412',
      700: '#101010',
      800: '#0c0c0b',
      900: '#080807',
      950: '#040403',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.600}',
          activeColor: '{primary.700}',
        },
        surface: {
          0: '#ffffff',
          50: '#f7f7f5',
          100: '#f1f1ef',
          200: '#eeecea',
          300: '#e3e2de',
          400: '#c7c6c1',
          500: '#9b9a96',
          600: '#6b6b66',
          700: '#4a4a45',
          800: '#373733',
          900: '#2f2f2c',
          950: '#191917',
        },
      },
      dark: {
        primary: {
          color: '{primary.50}',
          contrastColor: '{primary.950}',
          hoverColor: '{primary.100}',
          activeColor: '{primary.200}',
        },
        surface: {
          0: '#ffffff',
          50: '#f9f9f8',
          100: '#f1f1ef',
          200: '#e3e3e0',
          300: '#cfcfca',
          400: '#9b9b95',
          500: '#6b6b66',
          600: '#4a4a45',
          700: '#373733',
          800: '#2f2f2c',
          900: '#252522',
          950: '#191917',
        },
      },
    },
  },
})

const app = createApp(App)

app.use(router)
app.use(ToastService)
app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: '.dark',
    },
  },
})

app.mount('#app')
