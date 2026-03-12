<template>
  <div ref="editorEl" class="editor-canvas" />

  <div v-if="hasImage" class="editor-toolbar">
    <PrintPanel
      v-if="isPending"
      v-model="selectedDither"
      variant="toolbar"
      :loading="isPrinting"
      @confirm="confirmPrint(getDataUrl())"
      @cancel="cancelPrint"
    />
    <template v-else>
      <button class="toolbar-btn" :disabled="saving" @click="saveToGallery">
        <i :class="saving ? 'pi pi-spin pi-spinner' : 'pi pi-save'" />
        <span>{{ saving ? 'Sauvegarde…' : 'Sauvegarder' }}</span>
      </button>
      <button class="toolbar-btn" @click="requestPrint">
        <i class="pi pi-print" />
        <span>Imprimer</span>
      </button>
    </template>
  </div>

  <div v-if="!hasImage" class="editor-empty">
    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      hidden
      @change="onFileChange"
    />
    <div class="editor-empty__content">
      <i class="pi pi-image editor-empty__icon" />
      <button class="editor-empty__btn" @click="fileInput?.click()">
        <i class="pi pi-upload" /> Importer une image
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import ImageEditor from 'tui-image-editor'
  import 'tui-image-editor/dist/tui-image-editor.css'
  import 'tui-color-picker/dist/tui-color-picker.css'
  import { useEditorStore } from '../composables/useEditorStore'
  import { usePrintFlow } from '../composables/usePrintFlow'
  import PrintPanel from '../components/PrintPanel.vue'

  const { selectedDither, isPending, isPrinting, requestPrint, cancelPrint, confirmPrint } =
    usePrintFlow()

  const HEADER_HEIGHT = 56
  // TUI reserves 64px for its sidebar (right) and its header area (top: 64px in CSS),
  // even when the header is hidden — canvas must stay within these bounds.
  const TUI_CHROME = 64

  // required for loadImageFromFile to work — keeps TUI in "has image" state from init
  const PLACEHOLDER =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQAABjE+ibYAAAAASUVORK5CYII='

  const WHITE_THEME: Record<string, string> = {
    'common.bi.image': '',
    'common.bisize.width': '0px',
    'common.bisize.height': '0px',
    'common.backgroundImage': 'none',
    'common.backgroundColor': '#fff',
    'common.border': '1px solid #c1c1c1',
    'header.backgroundImage': 'none',
    'header.backgroundColor': '#f3f4f6',
    'header.border': '0px',
    'menu.normalIcon.color': '#8a8a8a',
    'menu.activeIcon.color': '#191917',
    'menu.disabledIcon.color': '#ccc',
    'menu.hoverIcon.color': '#555',
    'menu.iconSize.width': '24px',
    'menu.iconSize.height': '24px',
    'submenu.backgroundColor': '#fff',
    'submenu.partition.color': '#e5e5e5',
    'submenu.normalIcon.color': '#8a8a8a',
    'submenu.activeIcon.color': '#555',
    'submenu.iconSize.width': '32px',
    'submenu.iconSize.height': '32px',
    'submenu.normalLabel.color': '#858585',
    'submenu.normalLabel.fontWeight': 'lighter',
    'submenu.activeLabel.color': '#191917',
    'submenu.activeLabel.fontWeight': 'normal',
    'checkbox.border': '1px solid #ccc',
    'checkbox.backgroundColor': '#fff',
    'range.track.color': '#ccc',
    'range.value.color': '#191917',
    'range.value.fontWeight': 'normal',
    'range.value.fontSize': '11px',
    'range.value.border': '1px solid #ccc',
    'range.value.backgroundColor': '#fff',
    'range.title.color': '#191917',
    'range.title.fontWeight': 'lighter',
    'colorpicker.button.border': '0px',
    'colorpicker.title.color': '#191917',
  }

  const editorEl = ref<HTMLDivElement | null>(null)
  const fileInput = ref<HTMLInputElement | null>(null)
  const hasImage = ref(false)
  const saving = ref(false)
  let editor: ImageEditor | null = null
  let resizeObserver: ResizeObserver | null = null

  function getDataUrl(): string {
    return editor?.toDataURL({ format: 'jpeg', quality: 0.92 }) ?? ''
  }

  async function loadFile(file: File) {
    try {
      await editor?.loadImageFromFile(file)
      hasImage.value = true
    } catch (err) {
      console.error('[Editor] loadImageFromFile failed:', err)
    }
  }

  function onFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) loadFile(file)
  }

  function canvasDimensions(w: number, h: number) {
    return { width: w - TUI_CHROME, height: h - TUI_CHROME }
  }

  function onResize([entry]: ResizeObserverEntry[]) {
    if (!editor) return
    const { width, height } = entry.contentRect
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e = editor as any
    const g = e._graphics
    if (g) {
      g.setCssMaxDimension(canvasDimensions(width, height))
      if (g.canvasImage) g.adjustCanvasDimension()
    }
    e.ui?.resizeEditor({ uiSize: { width: '100%', height: '100%' } })
  }

  onMounted(() => {
    const pending = useEditorStore().consumeImage()
    const { clientWidth, clientHeight } = editorEl.value!

    editor = new ImageEditor(editorEl.value!, {
      ...canvasDimensions(clientWidth, clientHeight),
      includeUI: {
        loadImage: { path: pending ?? PLACEHOLDER, name: 'image' },
        theme: WHITE_THEME,
        menu: ['crop', 'flip', 'rotate', 'draw', 'shape', 'text', 'filter', 'mask', 'icon'],
        uiSize: { width: '100%', height: '100%' },
        menuBarPosition: 'right',
      },
      usageStatistics: false,
    })

    if (pending) hasImage.value = true

    resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(editorEl.value!)
  })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    resizeObserver = null
    editor?.destroy()
    editor = null
  })

  async function saveToGallery() {
    saving.value = true
    try {
      const title = new Date().toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      await window.api.gallery.save(getDataUrl(), `Édition — ${title}`)
    } finally {
      saving.value = false
    }
  }
</script>

<style>
  .tui-image-editor-header-buttons,
  .tui-image-editor-header-logo {
    display: none !important;
  }

  .tui-image-editor-wrap {
    overflow: hidden !important;
  }
</style>

<style scoped>
  .editor-canvas {
    height: calc(100vh - 56px);
  }

  .editor-toolbar {
    position: fixed;
    top: calc(56px + 1rem);
    right: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    z-index: 10;
  }

  .toolbar-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 1rem;
    border-radius: 8px;
    border: none;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(6px);
    color: #fff;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.15s;
  }

  .toolbar-btn:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.85);
  }

  .toolbar-btn:disabled {
    opacity: 0.6;
    cursor: default;
  }

  .editor-empty {
    position: fixed;
    inset: 56px 0 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f9f9f9;
    z-index: 10;
  }

  .editor-empty__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: #aaa;
  }

  .editor-empty__icon {
    font-size: 3rem;
  }

  .editor-empty__btn {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 1.1rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: #fff;
    color: #374151;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
  }

  .editor-empty__btn:hover {
    background: #f3f4f6;
  }
</style>
