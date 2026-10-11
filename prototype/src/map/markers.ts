import { Marker, type Map as MLMap, type PositionAnchor } from 'maplibre-gl'

export interface MarkerItem {
  id: string
  lngLat: [number, number]
  /** Called once when the element is created. */
  render: () => HTMLElement
  /** Called on every sync to refresh text / classes. */
  update?: (el: HTMLElement) => void
  opacity?: number
  anchor?: PositionAnchor
  z?: number
  /** Collision priority; markers without it never hide. */
  p?: number
}

interface Entry {
  marker: Marker
  el: HTMLElement
  removing?: number
}

/** Keeps a keyed set of DOM markers in sync, fading elements in and out. */
export class MarkerPool {
  private entries = new Map<string, Entry>()
  private map: MLMap
  private className: string

  constructor(map: MLMap, className: string) {
    this.map = map
    this.className = className
  }

  sync(items: MarkerItem[]) {
    const seen = new Set<string>()
    for (const it of items) {
      seen.add(it.id)
      let e = this.entries.get(it.id)
      if (!e) {
        const el = it.render()
        el.classList.add('mk', this.className, 'mk-enter')
        const marker = new Marker({ element: el, anchor: it.anchor ?? 'center' }).setLngLat(it.lngLat).addTo(this.map)
        e = { marker, el }
        this.entries.set(it.id, e)
        requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('mk-enter')))
      } else if (e.removing) {
        clearTimeout(e.removing)
        e.removing = undefined
        e.el.classList.remove('mk-leave')
      }
      const cur = e.marker.getLngLat()
      if (cur.lng !== it.lngLat[0] || cur.lat !== it.lngLat[1]) e.marker.setLngLat(it.lngLat)
      if (it.opacity !== undefined) e.el.style.setProperty('--o', String(it.opacity))
      if (it.z !== undefined) e.el.style.zIndex = String(it.z)
      if (it.p !== undefined && e.el.dataset.p !== String(it.p)) e.el.dataset.p = String(it.p)
      else if (it.p === undefined && e.el.dataset.p !== undefined) {
        delete e.el.dataset.p
        e.el.classList.remove('mk-clash')
      }
      it.update?.(e.el)
    }
    for (const [id, e] of this.entries) {
      if (seen.has(id) || e.removing) continue
      e.el.classList.add('mk-leave')
      e.removing = window.setTimeout(() => {
        e.marker.remove()
        this.entries.delete(id)
      }, 450)
    }
  }

  clear() {
    for (const e of this.entries.values()) {
      if (e.removing) clearTimeout(e.removing)
      e.marker.remove()
    }
    this.entries.clear()
  }
}

export function el(tag: string, className: string, text?: string) {
  const n = document.createElement(tag)
  n.className = className
  if (text !== undefined) n.textContent = text
  return n
}
