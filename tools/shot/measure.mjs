// Geometry checks for map icons: ring vs pin centres, and whether person faces move across zoom buckets.
import puppeteer from 'puppeteer-core'

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-first-run'],
  defaultViewport: null,
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await page.evaluateOnNewDocument(() => {
  localStorage.setItem('szd-opened', '1')
  localStorage.setItem('szd-prefs', JSON.stringify({ theme: 'light', muted: true }))
})
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 60000 })
await page.waitForFunction(() => window.__map, { timeout: 60000 })
await page.evaluate(async () => {
  const url = performance.getEntriesByType('resource').map((e) => e.name).find((n) => n.includes('/src/lib/store.ts'))
  window.__store = await import(url)
})
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function at(year, center, zoom) {
  await page.evaluate(
    (year, center, zoom) => {
      window.__store.setState({ mode: 'explore', modernity: 0, year, target: year, panel: null })
      window.__map.jumpTo({ center, zoom })
    },
    year,
    center,
    zoom,
  )
  await sleep(1800)
}

// 1) burst ring centred on the pin, for live major and live minor events; pin centre for past ones
await at(214.62, [104.0, 30.6], 5.8)
const rings = await page.evaluate(() =>
  [...document.querySelectorAll('.ev.mk-event')].map((ev) => {
    const pin = ev.querySelector('.ev-pin').getBoundingClientRect()
    const burst = ev.querySelector('.ev-burst').getBoundingClientRect()
    return {
      kind: [...ev.classList].find((c) => c.startsWith('ev-') && c !== 'ev-minor'),
      minor: ev.classList.contains('ev-minor'),
      phase: ev.dataset.phase,
      pinSize: Math.round(pin.width * 10) / 10,
      ringOffset: Math.round((pin.left + pin.width / 2 - (burst.left + burst.width / 2)) * 10) / 10,
    }
  }),
)
console.log('rings (offset should be 0):', JSON.stringify(rings))

// 2) person faces: distance from the marker's anchor (its bottom edge) to the face, across the 4.2 bucket edge
const faces = {}
for (const z of [4.1, 4.3]) {
  await at(211.5, [112.5, 31], z)
  faces[z] = await page.evaluate(() =>
    Object.fromEntries(
      [...document.querySelectorAll('.mk-person')].map((m) => {
        const face = m.querySelector('.pp-faces').getBoundingClientRect()
        return [m.querySelector('.pp-name')?.textContent, Math.round(m.getBoundingClientRect().bottom - face.bottom)]
      }),
    ),
  )
}
const moved = Object.keys(faces[4.1]).filter((k) => k in faces[4.3] && faces[4.1][k] !== faces[4.3][k])
console.log('faces 4.1:', JSON.stringify(faces[4.1]))
console.log('faces that jump between 4.1 and 4.3:', moved.length ? moved.join(', ') : 'none')

await browser.close()
