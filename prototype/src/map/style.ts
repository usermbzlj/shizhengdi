import type { ExpressionSpecification, FilterSpecification, Map as MLMap, StyleSpecification } from 'maplibre-gl'

type Theme = 'dark' | 'light'

export interface Palette {
  sea: string
  land: string
  /** [elevation m, color] stops for the hypsometric tint; negative = sea depth */
  relief: [number, string][]
  shadow: string
  highlight: string
  accent: string
  hillshade: number
  coast: string
  coastGlow: string
  river: string
  lake: string
  wash: string
  modernLight: string
  railway: string
  provinces: string
  /** outline around arrowheads so they read on any territory colour */
  halo: string
}

export const PALETTES: Record<Theme, Palette> = {
  dark: {
    sea: '#0b131a',
    land: '#1c2226',
    relief: [
      [-6000, '#0b131a'],
      [-1500, '#0c1620'],
      [-200, '#102030'],
      [-20, '#15283a'],
      [0, '#1d2428'],
      [300, '#20272a'],
      [1000, '#252c2e'],
      [2500, '#2b3133'],
      [4500, '#353a3b'],
      [6500, '#4a4e4f'],
    ],
    shadow: '#05080b',
    highlight: '#6b7682',
    accent: '#e8c77a',
    hillshade: 0.5,
    coast: '#3d5566',
    coastGlow: '#2c5a78',
    river: '#4b7d9c',
    lake: '#16293a',
    wash: '#a39a86',
    modernLight: '#ffd27a',
    railway: '#c9a86a',
    provinces: '#d8cfbf',
    halo: '#0b131a',
  },
  light: {
    sea: '#c9d8df',
    land: '#efe8d8',
    relief: [
      [-6000, '#b3c8d2'],
      [-1500, '#bcd0d9'],
      [-200, '#c9dae1'],
      [-20, '#d6e3e7'],
      [0, '#eee8d6'],
      [300, '#ece4cf'],
      [1000, '#e5dbc2'],
      [2500, '#dbd0b8'],
      [4500, '#d4cbb9'],
      [6500, '#eeebe4'],
    ],
    shadow: '#5b4a35',
    highlight: '#fffaf0',
    accent: '#9a6b1f',
    hillshade: 0.32,
    coast: '#8fa8b3',
    coastGlow: '#9fc0cf',
    river: '#6b9bb5',
    lake: '#c3d6de',
    wash: '#8a7c62',
    modernLight: '#c07a1a',
    railway: '#8a6a3a',
    provinces: '#5a4c38',
    halo: '#fffaf0',
  },
}

const empty: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] }

function reliefExpr(p: Palette): ExpressionSpecification {
  return ['interpolate', ['linear'], ['elevation'], ...p.relief.flat()] as unknown as ExpressionSpecification
}

export function buildStyle(theme: Theme): StyleSpecification {
  const p = PALETTES[theme]
  const base = import.meta.env.BASE_URL
  const zoomFade = (from: number, to: number, max = 1): ExpressionSpecification => ['interpolate', ['linear'], ['zoom'], from, 0, to, max]
  return {
    version: 8,
    projection: { type: ['interpolate', ['linear'], ['zoom'], 2.2, 'vertical-perspective', 3.6, 'mercator'] },
    sky: skyFor(theme),
    sources: {
      dem: {
        type: 'raster-dem',
        tiles: [`${location.origin}${base}terrain/{z}/{x}/{y}.png`],
        encoding: 'terrarium',
        tileSize: 256,
        maxzoom: 7,
        bounds: [70, 15, 140, 55],
      },
      land: { type: 'geojson', data: `${base}data/land.geojson` },
      rivers: { type: 'geojson', data: `${base}data/rivers.geojson` },
      lakes: { type: 'geojson', data: `${base}data/lakes.geojson` },
      modern: { type: 'geojson', data: `${base}data/modern.geojson` },
      periphery: { type: 'geojson', data: `${base}data/periphery.geojson` },
      provinces: { type: 'geojson', data: empty },
      terr: { type: 'geojson', data: empty },
      lines: { type: 'geojson', data: `${base}data/lines.geojson` },
      routes: { type: 'geojson', data: empty },
      'anim-line': { type: 'geojson', data: empty },
      'anim-head': { type: 'geojson', data: empty },
    },
    layers: [
      { id: 'sea', type: 'background', paint: { 'background-color': p.sea } },
      { id: 'land', type: 'fill', source: 'land', paint: { 'fill-color': p.land, 'fill-antialias': true } },
      {
        id: 'relief',
        type: 'color-relief',
        source: 'dem',
        paint: { 'color-relief-color': reliefExpr(p), 'color-relief-opacity': zoomFade(3.3, 3.9) },
      },
      {
        id: 'coast-glow',
        type: 'line',
        source: 'land',
        layout: { 'line-join': 'round' },
        paint: {
          'line-color': p.coastGlow,
          'line-width': ['interpolate', ['linear'], ['zoom'], 3, 4, 7, 14],
          'line-blur': ['interpolate', ['linear'], ['zoom'], 3, 4, 7, 14],
          'line-opacity': theme === 'dark' ? 0.35 : 0.45,
        },
      },
      {
        id: 'hillshade',
        type: 'hillshade',
        source: 'dem',
        paint: {
          'hillshade-method': 'igor',
          'hillshade-shadow-color': p.shadow,
          'hillshade-highlight-color': p.highlight,
          'hillshade-accent-color': p.shadow,
          'hillshade-exaggeration': zoomFade(3.3, 3.9, p.hillshade),
          'hillshade-illumination-direction': 315,
        },
      },
      {
        id: 'land-edge',
        type: 'line',
        source: 'land',
        paint: { 'line-color': p.coast, 'line-width': ['interpolate', ['linear'], ['zoom'], 3, 0.5, 7, 1] },
      },
      {
        id: 'lakes',
        type: 'fill',
        source: 'lakes',
        paint: { 'fill-color': p.lake, 'fill-opacity': ['case', ['boolean', ['get', 'ancient'], false], 0.7, 0.95] },
      },
      {
        id: 'rivers',
        type: 'line',
        source: 'rivers',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': p.river,
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            3,
            ['*', 0.35, ['coalesce', ['get', 'w'], 1]],
            7,
            ['*', 1.4, ['coalesce', ['get', 'w'], 1]],
          ],
          'line-opacity': ['interpolate', ['linear'], ['zoom'], 3, 0.55, 6, 0.9],
        },
      },
      {
        id: 'periphery-fill',
        type: 'fill',
        source: 'periphery',
        paint: { 'fill-color': p.wash, 'fill-opacity': 0.05 },
      },
      {
        id: 'periphery-line',
        type: 'line',
        source: 'periphery',
        layout: { 'line-join': 'round' },
        paint: { 'line-color': p.wash, 'line-width': 0.8, 'line-dasharray': [2, 3], 'line-opacity': 0.35 },
      },
      ...territoryLayers(),
      {
        id: 'provinces-line',
        type: 'line',
        source: 'provinces',
        layout: { visibility: 'none', 'line-join': 'round' },
        paint: { 'line-color': p.provinces, 'line-width': 0.9, 'line-dasharray': [3, 2], 'line-opacity': 0.55 },
      },
      {
        id: 'lines-glow',
        type: 'line',
        source: 'lines',
        filter: ['==', ['get', 'id'], '__none__'],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': ['get', 'color'], 'line-width': 12, 'line-blur': 10, 'line-opacity': 0.4 },
      },
      {
        id: 'lines-core',
        type: 'line',
        source: 'lines',
        filter: ['==', ['get', 'id'], '__none__'],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': ['get', 'color'], 'line-width': 2, 'line-opacity': 0.95 },
      },
      {
        id: 'routes-line',
        type: 'line',
        source: 'routes',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': ['get', 'color'], 'line-width': 2.4, 'line-opacity': 0.95, 'line-dasharray': [0.1, 1.8] },
      },
      {
        id: 'routes-head',
        type: 'symbol',
        source: 'routes',
        layout: {
          'symbol-placement': 'line',
          'symbol-spacing': 120,
          'icon-image': 'arrow',
          'icon-size': 0.6,
          'icon-allow-overlap': true,
          'icon-rotation-alignment': 'map',
        },
        paint: { 'icon-color': ['get', 'color'], 'icon-halo-color': p.halo, 'icon-halo-width': 1 },
      },
      {
        id: 'anim-glow',
        type: 'line',
        source: 'anim-line',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': ['interpolate', ['linear'], ['zoom'], 3, 5, 7, 10],
          'line-blur': ['interpolate', ['linear'], ['zoom'], 3, 4, 7, 8],
          'line-opacity': ['*', 0.22, ['get', 'o']],
        },
      },
      {
        id: 'anim-line',
        type: 'line',
        source: 'anim-line',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': ['interpolate', ['linear'], ['zoom'], 3, 1.6, 7, 3],
          'line-opacity': ['*', 0.9, ['get', 'o']],
        },
      },
      {
        id: 'anim-head',
        type: 'symbol',
        source: 'anim-head',
        layout: {
          'icon-image': 'arrow',
          'icon-size': ['interpolate', ['linear'], ['zoom'], 3, 0.5, 7, 0.85],
          'icon-rotate': ['-', ['get', 'bearing'], 90],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
        },
        paint: { 'icon-color': ['get', 'color'], 'icon-opacity': ['get', 'o'], 'icon-halo-color': p.halo, 'icon-halo-width': 1.2 },
      },
      {
        id: 'modern-heritage',
        type: 'line',
        source: 'modern',
        filter: ['in', ['get', 'kind'], ['literal', ['wall', 'canal']]],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': ['match', ['get', 'kind'], 'wall', p.accent, p.river],
          'line-width': ['match', ['get', 'kind'], 'wall', 1.6, 2],
          'line-opacity': 0,
        },
      },
      {
        id: 'modern-rail',
        type: 'line',
        source: 'modern',
        filter: ['==', ['get', 'kind'], 'rail'],
        paint: { 'line-color': p.railway, 'line-width': 0.9, 'line-opacity': 0 },
      },
      {
        id: 'modern-lights',
        type: 'circle',
        source: 'modern',
        filter: ['==', ['get', 'kind'], 'city'],
        paint: {
          'circle-color': p.modernLight,
          'circle-radius': ['interpolate', ['linear'], ['coalesce', ['get', 'pop'], 1], 1, 1.2, 20000000, 7],
          'circle-blur': 0.9,
          'circle-opacity': 0,
        },
      },
    ],
  }
}

function skyFor(theme: Theme) {
  const p = PALETTES[theme]
  return {
    'sky-color': p.sea,
    'horizon-color': theme === 'dark' ? '#1b2a36' : '#eef2f3',
    'fog-color': p.sea,
    'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 1, 3, 0.4, 4, 0] as ExpressionSpecification,
  }
}

/** Re-apply every theme-dependent paint value on a live map. */
export function applyPalette(map: MLMap, theme: Theme) {
  const p = PALETTES[theme]
  const set = (layer: string, prop: string, value: unknown) => map.setPaintProperty(layer, prop as 'fill-color', value as string)
  set('sea', 'background-color', p.sea)
  set('land', 'fill-color', p.land)
  set('relief', 'color-relief-color', reliefExpr(p))
  set('coast-glow', 'line-color', p.coastGlow)
  set('coast-glow', 'line-opacity', theme === 'dark' ? 0.35 : 0.45)
  set('hillshade', 'hillshade-shadow-color', p.shadow)
  set('hillshade', 'hillshade-highlight-color', p.highlight)
  set('hillshade', 'hillshade-accent-color', p.shadow)
  set('hillshade', 'hillshade-exaggeration', ['interpolate', ['linear'], ['zoom'], 3.3, 0, 3.9, p.hillshade])
  set('routes-head', 'icon-halo-color', p.halo)
  set('anim-head', 'icon-halo-color', p.halo)
  set('land-edge', 'line-color', p.coast)
  set('lakes', 'fill-color', p.lake)
  set('rivers', 'line-color', p.river)
  set('periphery-fill', 'fill-color', p.wash)
  set('periphery-line', 'line-color', p.wash)
  set('provinces-line', 'line-color', p.provinces)
  set('modern-rail', 'line-color', p.railway)
  set('modern-lights', 'circle-color', p.modernLight)
  set('modern-heritage', 'line-color', ['match', ['get', 'kind'], 'wall', p.accent, p.river])
  map.setSky(skyFor(theme))
}

/**
 * Watercolour territories: a light flat wash, a stronger band just inside each faction's border
 * (line-offset toward the interior; lines keep the faction on their left), and a fine edge.
 * The source holds one keyframe-to-keyframe transition (see scripts/build_transitions.py): land that does
 * not change is drawn by the static layers, land and borders that do change by the `-dyn` layers.
 */
function territoryLayers() {
  const fill = (ch: number): FilterSpecification => ['all', ['==', ['get', 'k'], 'f'], ['==', ['get', 'ch'], ch]]
  const line = (moving: boolean): FilterSpecification => ['all', ['==', ['get', 'k'], 'l'], [moving ? '!=' : '==', ['get', 'm'], 'c']]
  const band = (z3: number, z7: number): ExpressionSpecification => ['interpolate', ['exponential', 1.6], ['zoom'], 3, z3, 7, z7]
  const wash = (id: string, moving: boolean) => ({
    id,
    type: 'line' as const,
    source: 'terr',
    filter: line(moving),
    layout: { 'line-join': 'round' as const },
    paint: { 'line-color': '#888', 'line-width': band(5, 22), 'line-offset': band(-2.5, -11), 'line-blur': band(5, 22), 'line-opacity': 0 },
  })
  const edge = (id: string, moving: boolean) => ({
    id,
    type: 'line' as const,
    source: 'terr',
    filter: line(moving),
    layout: { 'line-join': 'round' as const },
    paint: {
      'line-color': '#888',
      'line-width': ['interpolate', ['linear'], ['zoom'], 3, 0.6, 7, 1.2] as ExpressionSpecification,
      'line-opacity': 0,
    },
  })
  const area = (id: string, ch: number) => ({
    id,
    type: 'fill' as const,
    source: 'terr',
    filter: fill(ch),
    paint: { 'fill-color': '#888', 'fill-opacity': 0, 'fill-antialias': false },
  })
  return [
    area('terr-fill', 0),
    area('terr-fill-dyn', 1),
    wash('terr-wash', false),
    wash('terr-wash-dyn', true),
    edge('terr-edge', false),
    edge('terr-edge-dyn', true),
  ]
}
