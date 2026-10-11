type Ring = number[][]

function inRing(pt: [number, number], ring: Ring) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    if (yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

function inPolygon(pt: [number, number], rings: Ring[]) {
  if (!inRing(pt, rings[0])) return false
  for (let i = 1; i < rings.length; i++) if (inRing(pt, rings[i])) return false
  return true
}

export function featureAt<P>(fc: GeoJSON.FeatureCollection | undefined, pt: [number, number]): P | null {
  if (!fc) return null
  for (const f of fc.features) {
    const g = f.geometry
    if (g.type === 'Polygon' && inPolygon(pt, g.coordinates)) return f.properties as P
    if (g.type === 'MultiPolygon' && g.coordinates.some((p) => inPolygon(pt, p))) return f.properties as P
  }
  return null
}

const jsonCache = new Map<string, Promise<GeoJSON.FeatureCollection>>()
export function loadJSON(path: string) {
  let p = jsonCache.get(path)
  if (!p) {
    p = fetch(`${import.meta.env.BASE_URL}${path}`).then((r) => {
      if (!r.ok) throw new Error(`${path} ${r.status}`)
      return r.json() as Promise<GeoJSON.FeatureCollection>
    })
    jsonCache.set(path, p)
    p.catch(() => jsonCache.delete(path))
  }
  return p
}
