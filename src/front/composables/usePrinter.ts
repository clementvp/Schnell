import { ThermalPrinterClient, WebBluetoothAdapter } from 'mxw01-thermal-printer'

const PRINTER_WIDTH = 384

function toImageData(base64: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const height = Math.round(PRINTER_WIDTH * (img.height / img.width))
      const canvas = document.createElement('canvas')
      canvas.width = PRINTER_WIDTH
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, PRINTER_WIDTH, height)
      ctx.drawImage(img, 0, 0, PRINTER_WIDTH, height)
      resolve(ctx.getImageData(0, 0, PRINTER_WIDTH, height))
    }
    img.onerror = reject
    img.src = base64
  })
}

export type DitherAlgorithm = 'threshold' | 'steinberg' | 'bayer' | 'atkinson' | 'pattern'

export const ditherOptions: { label: string; value: DitherAlgorithm }[] = [
  { label: 'Floyd-Steinberg', value: 'steinberg' },
  { label: 'Threshold', value: 'threshold' },
  { label: 'Bayer', value: 'bayer' },
  { label: 'Atkinson', value: 'atkinson' },
  { label: 'Pattern', value: 'pattern' },
]

export function usePrinter() {
  async function print(base64: string, dither: DitherAlgorithm = 'steinberg'): Promise<void> {
    const imageData = await toImageData(base64)
    const adapter = new WebBluetoothAdapter()
    const printer = new ThermalPrinterClient(adapter)
    await printer.connect()
    await printer.print(imageData, { dither, brightness: 128, intensity: 93 })
    await printer.disconnect()
  }

  return { print }
}
