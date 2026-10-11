export type LngLat = [number, number]

export interface Faction {
  id: string
  name: string
  color: string
  /** Factions that continue one another (e.g. 曹操 → 曹魏) share a family so their colours stay related. */
  family?: string
}

export interface Capital {
  faction: string
  city: string
  lng: number
  lat: number
}

export interface Keyframe {
  id: string
  year: number
  label: string
  summary: string
  capitals: Capital[]
  labels: { faction: string; lng: number; lat: number; size: number }[]
  seats: { name: string; lng: number; lat: number }[]
}

export interface PeripheryLabel {
  id: string
  group: string
  name: string
  from: number
  to: number
  lng: number
  lat: number
  strength: string
}

export interface Route {
  side: string
  label: string
  points: LngLat[]
}

export interface HistEvent {
  id: string
  name: string
  year: number
  month: number | null
  endYear?: number | null
  kind: 'battle' | 'political' | 'capital' | 'founding' | 'uprising' | 'diplomacy' | 'institution' | 'law' | 'economy' | 'science' | 'culture' | 'society'
  place: string
  placeModern: string
  lng: number
  lat: number
  participants: string[]
  importance: 1 | 2 | 3
  summary: string
  geography?: string
  outcome?: string
  thenVsNow?: string
  routes?: Route[]
  sources: string[]
  note?: string
  people?: string[]
}

/** One scannable line for the map: who fought, who won, what changed. */
export interface EventBrief {
  /** one side */
  a?: string[]
  /** the other side */
  b?: string[]
  /** faction ids that won; empty means no clear winner */
  win?: string[]
  /** who died, which land changed, or what the decision was */
  line: string
}

export interface WorldEvent {
  id: string
  name: string
  year: number
  endYear?: number | null
  region: string
  place: string
  lng: number
  lat: number
  bbox: [number, number, number, number]
  features: { name: string; lng: number; lat: number }[]
  summary: string
  chinaLink: string
  importance: 1 | 2 | 3
  sources: string[]
}

export interface CityName {
  name: string
  from: number
  to: number
  note?: string
  capitalOf?: string
}

export interface City {
  id: string
  modern: string
  lng: number
  lat: number
  names: CityName[]
  whyHere: string
  timeline: { year: number; title: string; text: string }[]
  threeKingdoms: string
  people: { name: string; text: string }[]
  today: string
  sources: string[]
}

export interface PersonLocation {
  from: number
  to: number
  place: string
  lng: number
  lat: number
  role: string
}

export interface Person {
  id: string
  name: string
  courtesy?: string
  birth?: number | null
  death?: number | null
  category: string
  fictional?: boolean
  locations: PersonLocation[]
  identity: string
  personality: string
  quotes?: string[]
  knowledge_boundary: string
  questions: { q: string; domain: string }[]
  taboo?: string
  fiction_vs_history?: string[]
}

export interface StoryLine {
  id: string
  name: string
  color: string
  summary: string
  /** Guided mini-story for this line; played like a chapter of the guide. */
  story: GuideStep[]
}

export interface GuideStep {
  id: string
  year: number
  center: LngLat
  zoom: number
  title?: string
  text: string
  eventId?: string
  worldId?: string
  lines?: string[]
  audio?: string
  /** Seconds the step lasts when muted; defaults to reading time. */
  hold?: number
}

export interface Chapter {
  id: string
  title: string
  subtitle: string
  steps: GuideStep[]
  /** Person who visits at the end of the chapter (reverse time travel). */
  visitor?: string
}

export interface Gazetteer {
  name: string
  alt: string[]
  lng: number
  lat: number
  kind: 'city' | 'seat' | 'modern'
  cityId?: string
}
