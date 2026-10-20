const MANIFEST = `${import.meta.env.BASE_URL}audio/manifest.json`
const CLIP_ROOT = `${import.meta.env.BASE_URL}audio/`
const SILENT_WAV = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='

let ctx: AudioContext | null = null
let wind: GainNode | null = null
let water: GainNode | null = null
let master: GainNode | null = null
let muted = false

function noise(c: AudioContext) {
  const len = c.sampleRate * 3
  const buf = c.createBuffer(1, len, c.sampleRate)
  const d = buf.getChannelData(0)
  let last = 0
  for (let i = 0; i < len; i++) {
    // brown noise: softer than white, closer to wind and water
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02
    d[i] = last * 3.2
  }
  const src = c.createBufferSource()
  src.buffer = buf
  src.loop = true
  return src
}

function wobble(c: AudioContext, target: AudioParam, rate: number, depth: number) {
  const lfo = c.createOscillator()
  const amt = c.createGain()
  lfo.frequency.value = rate
  amt.gain.value = depth
  lfo.connect(amt).connect(target)
  lfo.start()
}

let voice: HTMLAudioElement | null = null
let voiceGen = 0
let warmed = false
let clipKeys: Promise<Set<string>> | null = null

function loadClips() {
  if (!clipKeys) {
    clipKeys = fetch(MANIFEST)
      .then((r) => (r.ok ? (r.json() as Promise<Record<string, string>>) : Promise.reject()))
      .then((data) => new Set(Object.keys(data)))
      .catch(() => new Set<string>())
  }
  return clipKeys
}

/** Play and speech both have to start inside the first tap, or iOS / WeChat stay blocked. */
function unlockVoice() {
  if (!voice) {
    const a = new Audio()
    a.setAttribute('playsinline', '')
    a.setAttribute('webkit-playsinline', '')
    a.preload = 'auto'
    a.src = SILENT_WAV
    voice = a
    const gen = ++voiceGen
    void a.play().then(() => {
      if (voiceGen === gen) a.pause()
    }).catch(() => {})
  }
  const synth = window.speechSynthesis
  if (synth && !warmed) {
    warmed = true
    const u = new SpeechSynthesisUtterance(' ')
    u.volume = 0
    synth.speak(u)
  }
  void loadClips()
}

/** Must run inside a user gesture, or the browser keeps the context suspended. */
export function startSound() {
  unlockVoice()
  if (ctx) return void ctx.resume()
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AC) return
  const c = new AC()
  ctx = c
  master = c.createGain()
  master.gain.value = muted ? 0 : 0.5
  master.connect(c.destination)

  const w = noise(c)
  const band = c.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.value = 420
  band.Q.value = 0.6
  wobble(c, band.frequency, 0.07, 160)
  wind = c.createGain()
  wind.gain.value = 0
  w.connect(band).connect(wind).connect(master)
  w.start()

  const r = noise(c)
  const low = c.createBiquadFilter()
  low.type = 'lowpass'
  low.frequency.value = 760
  const lap = c.createGain()
  lap.gain.value = 0.75
  wobble(c, lap.gain, 0.32, 0.25)
  water = c.createGain()
  water.gain.value = 0
  r.connect(low).connect(lap).connect(water).connect(master)
  r.start()
}

export function setAmbience(level: { wind: number; water: number }) {
  if (!ctx || !wind || !water) return
  const t = ctx.currentTime
  wind.gain.cancelScheduledValues(t)
  water.gain.cancelScheduledValues(t)
  wind.gain.setTargetAtTime(level.wind * 0.55, t, 1.4)
  water.gain.setTargetAtTime(level.water * 0.7, t, 1.4)
}

export function setMuted(m: boolean) {
  muted = m
  if (ctx && master) master.gain.setTargetAtTime(m ? 0 : 0.5, ctx.currentTime, 0.2)
  if (m) {
    cutLine?.()
    window.speechSynthesis?.cancel()
  }
}

let cutLine: (() => void) | null = null
let zhVoice: SpeechSynthesisVoice | null | undefined

function pickVoice() {
  if (zhVoice !== undefined) return zhVoice
  const vs = window.speechSynthesis?.getVoices() ?? []
  if (!vs.length) return null
  const zh = vs.filter((v) => /zh[-_]CN/i.test(v.lang))
  zhVoice =
    zh.find((v) => /Yunxi|Yunjian|Yunyang/i.test(v.name)) ??
    zh.find((v) => /Natural|Online/i.test(v.name)) ??
    zh.find((v) => /Kangkang/i.test(v.name)) ??
    zh[0] ??
    null
  return zhVoice
}

function readingMs(text: string) {
  return 900 + text.length * 210
}

function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    if (signal.aborted) return resolve()
    const t = window.setTimeout(resolve, ms)
    signal.addEventListener(
      'abort',
      () => {
        window.clearTimeout(t)
        resolve()
      },
      { once: true },
    )
  })
}

function speakSynth(text: string, signal: AbortSignal) {
  const synth = window.speechSynthesis
  const voice = pickVoice()
  if (!synth || !voice) return wait(readingMs(text), signal)
  return new Promise<void>((resolve) => {
    const u = new SpeechSynthesisUtterance(text)
    u.voice = voice
    u.lang = voice.lang
    u.rate = 0.9
    // some engines never fire onend; never hang the story on it
    const guard = window.setTimeout(resolve, readingMs(text) + 4000)
    const done = () => (window.clearTimeout(guard), resolve())
    u.onend = done
    u.onerror = done
    signal.addEventListener('abort', () => (synth.cancel(), done()), { once: true })
    synth.speak(u)
  })
}

function playClip(url: string, text: string, signal: AbortSignal) {
  const a = voice!
  return new Promise<void>((resolve) => {
    let settled = false
    const finish = (fallback: boolean) => {
      if (settled) return
      settled = true
      a.onended = a.onerror = null
      if (cutLine === cut) cutLine = null
      if (fallback && !signal.aborted && !muted) speakSynth(text, signal).then(resolve)
      else resolve()
    }
    const cut = () => {
      a.pause()
      finish(false)
    }
    cutLine = cut
    a.onended = () => finish(false)
    a.onerror = () => finish(true)
    signal.addEventListener('abort', () => (a.pause(), finish(false)), { once: true })
    if (signal.aborted) return finish(false)
    voiceGen++
    a.src = url
    a.play().catch(() => finish(true))
  })
}

/** Say one line: a listed recording if we have one, otherwise the browser voice, otherwise reading time. */
export function say(clip: string, text: string, signal: AbortSignal): Promise<void> {
  if (signal.aborted) return Promise.resolve()
  if (muted) return wait(readingMs(text), signal)
  const key = `life-zhugeliang/${clip}.mp3`
  return loadClips().then((keys) => {
    if (signal.aborted) return
    if (muted) return wait(readingMs(text), signal)
    if (!keys.has(key) || !voice) return speakSynth(text, signal)
    return playClip(`${CLIP_ROOT}${key}`, text, signal)
  })
}

if (typeof window !== 'undefined' && window.speechSynthesis)
  window.speechSynthesis.onvoiceschanged = () => {
    zhVoice = undefined
  }
