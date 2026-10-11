import { abortTravel } from '../components/Travel'
import { getState, setState, type AppState } from './store'

/**
 * Open something on the historical map. Guide, travel and chat hide the side panel,
 * so those modes return to explore first; otherwise a search or a map click looks dead.
 */
export function openExplore(patch: Partial<AppState>) {
  const mode = getState().mode
  if (mode === 'explore') {
    setState(patch)
    return
  }
  if (mode === 'travel' || mode === 'chat') abortTravel()
  const leavingToday = mode === 'travel' || mode === 'chat' || mode === 'opening'
  setState({
    ...patch,
    mode: 'explore',
    hold: false,
    chatPerson: null,
    ...(leavingToday ? { modernity: 0 } : {}),
  })
}
