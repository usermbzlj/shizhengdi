import { factions, type Faction } from './world'

const extra: Record<string, Faction> = {
  lianjun: { id: 'lianjun', name: '孙刘联军', short: '联', color: '#e0805a', home: 'south' },
}

export function sideOf(id: string): Faction {
  return factions[id] ?? extra[id] ?? { id, name: id, short: id.slice(0, 1), color: '#999', home: 'north' }
}
