// Headless screenshots of the prototype for visual checks.
// usage: node shot.mjs scenes/<name>.json <outDir>
import puppeteer from 'puppeteer-core'
import { readFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const [scenesFile, outDir = 'out'] = process.argv.slice(2)
const scenes = JSON.parse(readFileSync(scenesFile, 'utf8'))
mkdirSync(outDir, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-first-run'],
  defaultViewport: null,
})

for (const sc of scenes) {
  const page = await browser.newPage()
  await page.setViewport({ width: sc.width ?? 1440, height: sc.height ?? 900, deviceScaleFactor: sc.dpr ?? 1, isMobile: !!sc.mobile, hasTouch: !!sc.mobile })
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  await page.evaluateOnNewDocument((theme) => {
    localStorage.setItem('szd-opened', '1')
    localStorage.setItem('szd-prefs', JSON.stringify({ theme, muted: true }))
  }, sc.theme ?? 'light')
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 60000 })
  await page.waitForFunction(() => window.__map, { timeout: 60000 })
  await page.evaluate(async (sc) => {
    const url = performance.getEntriesByType('resource').map((e) => e.name).find((n) => n.includes('/src/lib/store.ts'))
    const s = await import(url)
    s.setState({ mode: 'explore', modernity: 0, year: sc.from ?? sc.year, target: sc.from ?? sc.year, panel: sc.panel ?? null, hometown: sc.hometown ?? null })
    window.__map.jumpTo({ center: sc.center, zoom: sc.zoom })
    window.__store = s
  }, sc)
  await new Promise((r) => setTimeout(r, sc.settle ?? 2500))
  if (sc.from !== undefined) {
    await page.evaluate((sc) => window.__store.animateYear(sc.year, sc.animateMs ?? 1500, (t) => t), sc)
    await new Promise((r) => setTimeout(r, (sc.animateMs ?? 1500) + 300))
  }
  if (sc.eval) await page.evaluate(sc.eval)
  // optional burst of frames while something animates: [{ at: ms, suffix }]
  if (sc.frames) {
    const t0 = Date.now()
    for (const f of sc.frames) {
      await new Promise((r) => setTimeout(r, Math.max(0, f.at - (Date.now() - t0))))
      await page.screenshot({ path: join(outDir, `${sc.name}-${f.suffix}.png`), clip: sc.clip })
      const y = await page.evaluate(() => window.__store.getState().year)
      console.log(`  ${sc.name}-${f.suffix} @${Date.now() - t0}ms year=${y.toFixed(3)}`)
    }
  }
  await new Promise((r) => setTimeout(r, sc.wait ?? 600))
  const file = join(outDir, `${sc.name}.png`)
  await page.screenshot({ path: file, clip: sc.clip })
  const mapErrs = await page.evaluate(() => window.__errs || [])
  console.log(file, errors.length || mapErrs.length ? JSON.stringify({ errors, mapErrs }).slice(0, 400) : 'ok')
  await page.close()
}
await browser.close()
