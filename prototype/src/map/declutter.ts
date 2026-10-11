/**
 * Greedy label collision avoidance for DOM markers.
 * Markers carry `data-p` (priority, higher wins) and `data-hide` ("label" hides only the text, "all" hides the marker).
 */
const OBSTACLES = '.brand, .search, .tools, .panel, .guide, .chat, .tl-main, .tl-today'

export function declutter(root: HTMLElement) {
  const els = Array.from(root.querySelectorAll<HTMLElement>('.mk[data-p]'))
  const items: { el: HTMLElement; p: number; r: DOMRect }[] = []
  for (const el of els) {
    if (el.classList.contains('mk-leave')) continue
    el.classList.remove('mk-clash')
    const target = el.querySelector<HTMLElement>('[data-box]') ?? el
    const r = target.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    items.push({ el, p: Number(el.dataset.p), r })
  }
  items.sort((a, b) => b.p - a.p)
  // fixed UI floating over the map counts as occupied space
  const placed: DOMRect[] = Array.from(document.querySelectorAll<HTMLElement>(OBSTACLES)).map((n) => n.getBoundingClientRect())
  const pad = 3
  for (const it of items) {
    const { r } = it
    const hit = placed.some((q) => r.left < q.right + pad && r.right > q.left - pad && r.top < q.bottom + pad && r.bottom > q.top - pad)
    if (hit) it.el.classList.add('mk-clash')
    else placed.push(r)
  }
}
