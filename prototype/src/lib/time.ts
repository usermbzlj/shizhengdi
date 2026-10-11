export const YEAR_MIN = 150
export const YEAR_MAX = 300
export const TODAY = 2026

// Piecewise-linear timeline: the prototype's focus period (184–280) gets most of the width.
const SEGMENTS: { from: number; to: number; share: number }[] = [
  { from: 150, to: 184, share: 0.1 },
  { from: 184, to: 280, share: 0.8 },
  { from: 280, to: 300, share: 0.1 },
]

export function yearToRatio(year: number): number {
  const y = Math.min(YEAR_MAX, Math.max(YEAR_MIN, year))
  let acc = 0
  for (const s of SEGMENTS) {
    if (y <= s.to) return acc + ((y - s.from) / (s.to - s.from)) * s.share
    acc += s.share
  }
  return 1
}

export function ratioToYear(ratio: number): number {
  const r = Math.min(1, Math.max(0, ratio))
  let acc = 0
  for (const s of SEGMENTS) {
    if (r <= acc + s.share) return s.from + ((r - acc) / s.share) * (s.to - s.from)
    acc += s.share
  }
  return YEAR_MAX
}

interface Era {
  name: string
  from: number
  to: number
}

const HAN: Era[] = [
  { name: '和平', from: 150, to: 150 },
  { name: '元嘉', from: 151, to: 152 },
  { name: '永兴', from: 153, to: 154 },
  { name: '永寿', from: 155, to: 157 },
  { name: '延熹', from: 158, to: 166 },
  { name: '永康', from: 167, to: 167 },
  { name: '建宁', from: 168, to: 171 },
  { name: '熹平', from: 172, to: 177 },
  { name: '光和', from: 178, to: 183 },
  { name: '中平', from: 184, to: 189 },
  { name: '初平', from: 190, to: 193 },
  { name: '兴平', from: 194, to: 195 },
  { name: '建安', from: 196, to: 219 },
]

const WEI: Era[] = [
  { name: '黄初', from: 220, to: 226 },
  { name: '太和', from: 227, to: 232 },
  { name: '青龙', from: 233, to: 236 },
  { name: '景初', from: 237, to: 239 },
  { name: '正始', from: 240, to: 248 },
  { name: '嘉平', from: 249, to: 253 },
  { name: '正元', from: 254, to: 255 },
  { name: '甘露', from: 256, to: 259 },
  { name: '景元', from: 260, to: 263 },
  { name: '咸熙', from: 264, to: 264 },
]

const SHU: Era[] = [
  { name: '章武', from: 221, to: 222 },
  { name: '建兴', from: 223, to: 237 },
  { name: '延熙', from: 238, to: 257 },
  { name: '景耀', from: 258, to: 262 },
  { name: '炎兴', from: 263, to: 263 },
]

const WU: Era[] = [
  { name: '黄武', from: 222, to: 228 },
  { name: '黄龙', from: 229, to: 231 },
  { name: '嘉禾', from: 232, to: 237 },
  { name: '赤乌', from: 238, to: 250 },
  { name: '太元', from: 251, to: 251 },
  { name: '建兴', from: 252, to: 253 },
  { name: '五凤', from: 254, to: 255 },
  { name: '太平', from: 256, to: 257 },
  { name: '永安', from: 258, to: 263 },
  { name: '元兴', from: 264, to: 264 },
  { name: '甘露', from: 265, to: 265 },
  { name: '宝鼎', from: 266, to: 268 },
  { name: '建衡', from: 269, to: 271 },
  { name: '凤凰', from: 272, to: 274 },
  { name: '天册', from: 275, to: 275 },
  { name: '天玺', from: 276, to: 276 },
  { name: '天纪', from: 277, to: 279 },
]

const JIN: Era[] = [
  { name: '泰始', from: 265, to: 274 },
  { name: '咸宁', from: 275, to: 279 },
  { name: '太康', from: 280, to: 289 },
  { name: '永熙', from: 290, to: 290 },
  { name: '永平', from: 291, to: 291 },
  { name: '元康', from: 291, to: 299 },
  { name: '永康', from: 300, to: 300 },
]

const CN_NUM = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

function cnYear(n: number): string {
  if (n === 1) return '元'
  if (n <= 10) return CN_NUM[n]
  if (n < 20) return '十' + CN_NUM[n - 10]
  const tens = Math.floor(n / 10)
  const ones = n % 10
  return CN_NUM[tens] + '十' + CN_NUM[ones]
}

function eraLabel(list: Era[], year: number): string | null {
  for (let i = list.length - 1; i >= 0; i--) {
    const e = list[i]
    if (year >= e.from && year <= e.to) return `${e.name}${cnYear(year - e.from + 1)}年`
  }
  return null
}

export interface EraReading {
  state: string
  label: string
}

export function eraReadings(year: number): EraReading[] {
  const y = Math.floor(year)
  if (y < 220) {
    const l = eraLabel(HAN, y)
    return l ? [{ state: '汉', label: l }] : []
  }
  const out: EraReading[] = []
  const add = (state: string, list: Era[]) => {
    const l = eraLabel(list, y)
    if (l) out.push({ state, label: l })
  }
  if (y < 265) add('魏', WEI)
  else add('晋', JIN)
  if (y < 264) add('蜀', SHU)
  if (y < 280) add('吴', WU)
  return out
}

export function formatYear(year: number): string {
  const y = Math.floor(year)
  return y < 0 ? `公元前 ${-y} 年` : `公元 ${y} 年`
}

export function dynastyName(year: number): string {
  if (year < 184) return '东汉'
  if (year < 220) return '东汉末年'
  if (year < 265) return '三国'
  if (year < 280) return '三国 · 西晋'
  return '西晋'
}

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
export const smoothstep = (t: number) => {
  const x = clamp(t, 0, 1)
  return x * x * (3 - 2 * x)
}
