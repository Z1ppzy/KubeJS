import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const width = 16
const height = 16
const outputDirectory = path.resolve(import.meta.dirname, '../assets/kubejs/textures/item')

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let value = index
  for (let bit = 0; bit < 8; bit++) {
    value = (value & 1) ? 0xEDB88320 ^ (value >>> 1) : value >>> 1
  }
  return value >>> 0
})

const crc32 = buffer => {
  let crc = 0xFFFFFFFF
  for (const value of buffer) crc = crcTable[(crc ^ value) & 0xFF] ^ (crc >>> 8)
  return (crc ^ 0xFFFFFFFF) >>> 0
}

const chunk = (type, data) => {
  const typeBuffer = Buffer.from(type, 'ascii')
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])))
  return Buffer.concat([length, typeBuffer, data, crc])
}

const writePng = (name, paint) => {
  const pixels = Buffer.alloc(width * height * 4)

  const set = (x, y, color) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return
    const offset = (y * width + x) * 4
    pixels[offset] = color[0]
    pixels[offset + 1] = color[1]
    pixels[offset + 2] = color[2]
    pixels[offset + 3] = color[3] ?? 255
  }

  paint(set)

  const scanlines = Buffer.alloc(height * (1 + width * 4))
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * 4)
    scanlines[rowOffset] = 0
    pixels.copy(scanlines, rowOffset + 1, y * width * 4, (y + 1) * width * 4)
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 6

  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(scanlines, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ])

  fs.writeFileSync(path.join(outputDirectory, name), png)
}

writePng('automation_bus.png', set => {
  const shadow = [12, 18, 39, 255]
  const casing = [25, 73, 105, 255]
  const cyan = [50, 231, 224, 255]
  const highlight = [190, 255, 246, 255]
  const violet = [139, 75, 240, 255]
  const gold = [244, 180, 48, 255]

  for (let y = 4; y <= 11; y++) {
    for (let x = 4; x <= 11; x++) set(x, y, shadow)
  }
  for (let x = 5; x <= 10; x++) {
    set(x, 4, casing)
    set(x, 11, casing)
  }
  for (let y = 5; y <= 10; y++) {
    set(4, y, casing)
    set(11, y, casing)
  }

  for (const pin of [5, 8, 10]) {
    set(2, pin, gold)
    set(3, pin, gold)
    set(12, pin, gold)
    set(13, pin, gold)
    set(pin, 2, gold)
    set(pin, 3, gold)
    set(pin, 12, gold)
    set(pin, 13, gold)
  }

  for (let x = 5; x <= 10; x++) {
    set(x, 5, cyan)
    set(x, 10, cyan)
  }
  for (let y = 6; y <= 9; y++) {
    set(5, y, cyan)
    set(10, y, cyan)
  }

  for (let y = 6; y <= 9; y++) {
    for (let x = 6; x <= 9; x++) set(x, y, violet)
  }
  set(7, 7, highlight)
  set(8, 7, highlight)
  set(7, 8, cyan)
  set(8, 8, cyan)
})

writePng('neural_calibration_matrix.png', set => {
  const outline = [13, 31, 42, 255]
  const green = [39, 220, 147, 255]
  const cyan = [61, 244, 224, 255]
  const pale = [205, 255, 238, 255]
  const violet = [164, 65, 238, 255]
  const core = [247, 91, 214, 255]

  const rows = {
    2: [7, 8],
    3: [5, 10],
    4: [4, 11],
    5: [3, 12],
    6: [3, 12],
    7: [2, 13],
    8: [2, 13],
    9: [3, 12],
    10: [3, 12],
    11: [4, 11],
    12: [5, 10],
    13: [7, 8]
  }

  for (const [row, range] of Object.entries(rows)) {
    const y = Number(row)
    for (let x = range[0]; x <= range[1]; x++) set(x, y, outline)
  }
  for (let y = 4; y <= 11; y++) {
    const inset = Math.abs(7.5 - y) > 2.5 ? 5 : 4
    for (let x = inset; x <= 15 - inset; x++) set(x, y, green)
  }
  for (let y = 5; y <= 10; y++) {
    for (let x = 5; x <= 10; x++) set(x, y, cyan)
  }
  for (let y = 6; y <= 9; y++) {
    for (let x = 6; x <= 9; x++) set(x, y, violet)
  }
  set(7, 6, pale)
  set(8, 6, pale)
  set(7, 7, core)
  set(8, 7, core)
  set(7, 8, core)
  set(8, 8, core)
  set(7, 9, violet)
  set(8, 9, violet)
})

console.log('Generated automation_bus.png and neural_calibration_matrix.png')
