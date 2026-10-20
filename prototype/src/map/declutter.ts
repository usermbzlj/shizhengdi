/**
 * Greedy label collision avoidance for DOM markers.
 * Markers carry `data-p` (priority, higher wins); a losing marker gets `mk-clash`.
 * A label that is showing keeps its place until it truly overlaps; a hidden one needs clear room
 * before it comes back, so labels near the threshold don't blink while the map moves.
 */
const OBSTACLES = '.brand, .search, .tools, .panel, .guide, .chat, .tl-main, .tl-today'
const KEEP_PAD = 0
const ENTER_PAD = 8

export function declutter(root: HTMLElement) {
  const els = Array.from(root.querySelectorAll<HTMLElement>('.mk[data-p]'))
  const items: { el: HTMLElement; p: number; r: DOMRect; shown: boolean }[] = []
  for (const el of els) {
    if (el.classList.contains('mk-leave')) continue
    const target = el.querySelector<HTMLElement>('[data-box]') ?? el
    const r = target.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    const shown = !el.classList.contains('mk-clash') && !el.classList.contains('mk-enter')
    items.push({ el, p: Number(el.dataset.p), r, shown })
  }
  items.sort((a, b) => b.p - a.p || Number(b.shown) - Number(a.shown))
  // fixed UI floating over the map counts as occupied space
  const placed: DOMRect[] = Array.from(document.querySelectorAll<HTMLElement>(OBSTACLES)).map((n) => n.getBoundingClientRect())
  for (const it of items) {
    const { r } = it
    const pad = it.shown ? KEEP_PAD : ENTER_PAD
    const hit = placed.some((q) => r.left < q.right + pad && r.right > q.left - pad && r.top < q.bottom + pad && r.bottom > q.top - pad)
    it.el.classList.toggle('mk-clash', hit)
    if (!hit) placed.push(r)
  }
}
