declare module 'tui-image-editor' {
  interface IOptions {
    includeUI?: {
      loadImage?: { path: string; name: string }
      theme?: Record<string, string>
      menu?: string[]
      menuBarPosition?: 'top' | 'bottom' | 'left' | 'right'
      uiSize?: { width: string; height: string }
    }
    cssMaxWidth?: number
    cssMaxHeight?: number
    usageStatistics?: boolean
  }

  interface IToDataURLOptions {
    format?: 'jpeg' | 'png' | 'webp'
    quality?: number
  }

  class ImageEditor {
    constructor(element: HTMLElement, options?: IOptions)
    loadImageFromURL(url: string, imageName: string): Promise<{ newWidth: number; newHeight: number }>
    loadImageFromFile(file: File, imageName?: string): Promise<{ newWidth: number; newHeight: number }>
    toDataURL(options?: IToDataURLOptions): string
    destroy(): void
  }

  export default ImageEditor
}
