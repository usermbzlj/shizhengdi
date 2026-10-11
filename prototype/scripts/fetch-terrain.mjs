// Downloads Terrarium-encoded DEM tiles (AWS Open Data "Terrain Tiles") covering China into public/terrain.
import { mkdir, writeFile, access } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const OUT = join(process.cwd(), 'public', 'terrain')
const BBOX = { west: 70, south: 15, east: 140, north: 55 }
const MAX_Z = Number(process.argv[2] ?? 6)
const URL = (z, x, y) => `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`

const lon2x = (lon, z) => Math.floor(((lon + 180) / 360) * 2 ** z)
const lat2y = (lat, z) => {
  const r = (lat * Math.PI) / 180
  return Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z)
}

const jobs = []
for (let z = 0; z <= MAX_Z; z++) {
  for (let x = lon2x(BBOX.west, z); x <= lon2x(BBOX.east, z); x++) {
    for (let y = lat2y(BBOX.north, z); y <= lat2y(BBOX.south, z); y++) jobs.push([z, x, y])
  }
}
console.log(`tiles: ${jobs.length}`)

let done = 0
let failed = 0
async function worker() {
  while (jobs.length) {
    const [z, x, y] = jobs.shift()
    const file = join(OUT, String(z), String(x), `${y}.png`)
    try {
      await access(file)
      done++
      continue
    } catch {}
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch(URL(z, x, y))
        if (!res.ok) throw new Error(String(res.status))
        await mkdir(dirname(file), { recursive: true })
        await writeFile(file, Buffer.from(await res.arrayBuffer()))
        done++
        break
      } catch (e) {
        if (attempt === 2) {
          failed++
          console.warn(`fail ${z}/${x}/${y}: ${e.message}`)
        }
      }
    }
    if (done % 25 === 0) console.log(`${done} done`)
  }
}
await Promise.all(Array.from({ length: 8 }, worker))
console.log(`finished: ${done} ok, ${failed} failed`)
