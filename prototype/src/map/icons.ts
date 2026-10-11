/** Line icons (24×24, stroke = currentColor) used on the map and the timeline. */
const P: Record<string, string> = {
  battle: '<path d="M4 4l9.5 9.5M4 4v3.5M4 4h3.5M20 4l-9.5 9.5M20 4v3.5M20 4h-3.5M8.5 15.5l-3 3M15.5 15.5l3 3M6.5 13.5l4 4M17.5 13.5l-4 4"/>',
  uprising: '<path d="M12 21c-4 0-6.5-2.6-6.5-6 0-3.5 3-5.5 3.5-9 2.5 1.5 3.5 3.5 3.5 5.5 1-.8 1.6-2 1.8-3.4 2 1.7 4.2 4.3 4.2 7 0 3.4-2.5 5.9-6.5 5.9z"/>',
  founding: '<path d="M4 17l1.5-9 4.5 4 2-6 2 6 4.5-4 1.5 9zM4 20h16"/>',
  political: '<path d="M5 5h14v14H5zM9 9h6v6H9z"/>',
  capital: '<path d="M4 20V10l4-3 4 3 4-3 4 3v10M4 20h16M10 20v-5h4v5M4 10h16"/>',
  diplomacy: '<path d="M6 4h9l3 3v13H6zM15 4v3h3M9 11h6M9 14h6M9 17h4"/>',
  institution: '<path d="M4 9l8-5 8 5M6 9v8M10 9v8M14 9v8M18 9v8M4 20h16"/>',
  law: '<path d="M12 4v16M8 20h8M5 7h14M7 7l-3 6h6zM17 7l-3 6h6z"/>',
  economy: '<path d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM9.5 9.5h5v5h-5z"/>',
  science: '<path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15.5 8.5l-2 5-5 2 2-5z"/>',
  culture: '<path d="M5 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H5zM19 5h-6M19 5v12h-6"/>',
  society: '<path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3.5 19c.5-3 2.7-5 5.5-5s5 2 5.5 5M16 11a2.5 2.5 0 1 0 0-5M16.5 14c2.3.3 3.7 2.1 4 5"/>',
  world: '<path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.6 3.6 5.6 3.6 9S14.5 18.4 12 21c-2.5-2.6-3.6-5.6-3.6-9S9.5 5.6 12 3z"/>',
  migration: '<path d="M4 12h12M12 7l5 5-5 5M4 7h4M4 17h4"/>',
}

export function iconSvg(kind: string, size = 16) {
  const d = P[kind] ?? P.political
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`
}

export const KIND_LABEL: Record<string, string> = {
  battle: '战役',
  political: '政局',
  capital: '迁都',
  founding: '立国',
  uprising: '起义',
  diplomacy: '外交',
  institution: '制度',
  law: '法律',
  economy: '经济',
  science: '科技',
  culture: '文化',
  society: '社会',
  migration: '迁徙',
}

export const KIND_COLOR: Record<string, string> = {
  battle: '#c9553f',
  uprising: '#d99a2b',
  founding: '#a27b2a',
  political: '#7a6a55',
  capital: '#9a6b1f',
  diplomacy: '#4d8a8a',
  institution: '#4f8a64',
  law: '#4f8a64',
  economy: '#8a7a3c',
  science: '#4d7aa8',
  culture: '#8a5a8a',
  society: '#6b6b6b',
  world: '#4d86a8',
}
