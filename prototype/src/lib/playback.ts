/**
 * Dragging and scripted moves write `year` and `target` together, so the map stays on the finger.
 * This loop only closes a gap left by something that moved the cursor alone, and it does so in a
 * few frames — never by replaying the years in between after the hand has stopped.
 */
import { getState, setState } from './store'

/** Time constant of the follow. Short enough that a leftover gap still feels stuck to the cursor. */
const TAU = 0.05

let raf = 0
let last = 0

function frame(now: number) {
  raf = requestAnimationFrame(frame)
  const dt = Math.min(0.05, (now - last) / 1000)
  last = now
  const s = getState()
  const gap = s.target - s.year
  if (Math.abs(gap) < 0.0004) {
    if (gap !== 0) setState({ year: s.target })
    return
  }
  const k = 1 - Math.exp(-dt / TAU)
  let next = s.year + gap * k
  if (Math.abs(s.target - next) < 0.0004) next = s.target
  setState({ year: next })
}

export function startPlayback() {
  if (raf) return
  last = performance.now()
  raf = requestAnimationFrame(frame)
}

/** Whether the map is still catching up with the cursor. */
export function isCatchingUp() {
  const s = getState()
  return Math.abs(s.target - s.year) > 0.02
}
