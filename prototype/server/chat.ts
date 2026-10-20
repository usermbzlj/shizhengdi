import type { IncomingMessage, ServerResponse } from 'node:http'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'
import { places } from '../src/game/world.ts'
import { stops } from '../src/life/zhuge.ts'

const placeNames = new Set(places.map((p) => p.name))

interface Persona {
  id: string
  name: string
  courtesy?: string
  birth?: number | null
  death?: number | null
  identity: string
  personality: string
  quotes?: string[]
  knowledge_boundary: string
  questions: { q: string; domain: string }[]
  taboo?: string
  fiction_vs_history?: string[]
  fictional?: boolean
  locations?: { from: number; to: number; place: string; role?: string }[]
}

function aliveIn(p: Persona, year: number) {
  const y = Math.floor(year)
  return (p.birth == null || y >= p.birth) && (p.death == null || y <= p.death)
}

function roleAt(p: Persona, year: number) {
  const y = Math.floor(year)
  return p.locations?.find((l) => l.from <= y && y <= l.to)?.role ?? ''
}

function placeAt(p: Persona, year: number) {
  const locs = p.locations ?? []
  const y = Math.floor(year)
  return (locs.find((l) => l.from <= y && y <= l.to) ?? locs.filter((l) => l.from <= y).at(-1) ?? locs[0])?.place ?? ''
}

interface ChatBody {
  personId: string
  messages: { role: 'user' | 'assistant'; content: string }[]
  questions: string[]
  fromYear: number
  fromPlace: string
  hometown?: string
  /** beside: the student stands next to him at that moment and he answers; otherwise he visits today and asks */
  style?: 'beside' | 'met'
  stage?: string
}

let personas: Map<string, Persona> | null = null

function loadPersonas(root: string) {
  if (personas) return personas
  const raw = JSON.parse(readFileSync(resolve(root, 'src/data/persons.json'), 'utf8')) as Persona[]
  personas = new Map(raw.map((p) => [p.id, p]))
  return personas
}

const MAX_BODY = 32 * 1024
const MAX_MESSAGES = 40
const MAX_CHARS = 1200
const UPSTREAM_TIMEOUT = 30_000
const RATE_WINDOW = 60_000
const RATE_LIMIT = 20

function clean(s: unknown, max: number) {
  return typeof s === 'string' ? s.replace(/[\r\n\t]+/g, ' ').trim().slice(0, max) : ''
}

/** Rebuild the body from trusted pieces: questions must come from the persona's own list. */
function sanitize(raw: unknown, persona: Persona): ChatBody | null {
  if (!raw || typeof raw !== 'object') return null
  const b = raw as Record<string, unknown>
  const year = Number(b.fromYear)
  if (!Number.isFinite(year) || !aliveIn(persona, year)) return null
  if (!Array.isArray(b.messages)) return null
  const messages = b.messages
    .filter((m): m is { role: 'user' | 'assistant'; content: unknown } => {
      const role = (m as { role?: unknown })?.role
      return role === 'user' || role === 'assistant'
    })
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: String(m.content ?? '').slice(0, MAX_CHARS) }))
  const allowed = new Set(persona.questions.map((q) => q.q))
  const questions = (Array.isArray(b.questions) ? b.questions : [])
    .filter((q): q is string => typeof q === 'string' && allowed.has(q))
    .slice(0, 4)
  // the moment he is in comes from our own script or itinerary, never from the request
  if (b.style === 'beside') {
    const stop = persona.id === 'zhugeliang' ? stops.find((s) => s.year === year) : undefined
    if (!stop) return null
    return { personId: persona.id, messages, questions: [], fromYear: year, fromPlace: stop.place, style: 'beside', stage: stop.stage }
  }
  if (b.style === 'met') {
    const asked = clean(b.fromPlace, 20)
    return {
      personId: persona.id,
      messages,
      questions: [],
      fromYear: year,
      fromPlace: placeNames.has(asked) ? asked : placeAt(persona, year),
      style: 'met',
      stage: roleAt(persona, year),
    }
  }
  return {
    personId: persona.id,
    messages,
    questions: questions.length ? questions : persona.questions.slice(0, 3).map((q) => q.q),
    fromYear: year,
    fromPlace: placeAt(persona, year),
    hometown: clean(b.hometown, 20) || undefined,
  }
}

const hits = new Map<string, number[]>()
function rateLimited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > RATE_LIMIT
}

function isLoopback(ip: string) {
  return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1'
}

function besidePrompt(p: Persona, body: ChatBody) {
  const year = Math.floor(body.fromYear)
  const age = p.birth ? `，你今年大约 ${year - p.birth} 岁` : ''
  return [
    `你将扮演${p.name}${p.courtesy ? `（字${p.courtesy}）` : ''}。现在是公元 ${year} 年，你在${body.fromPlace}${age}。`,
    body.stage ? `【此刻】${body.stage}` : '',
    `【人物】${p.identity}`,
    `【性格与说话方式】${p.personality}`,
    p.taboo ? `【注意】${p.taboo}` : '',
    p.fiction_vs_history?.length ? `【演义与史实】${p.fiction_vs_history.join('；')}。只讲史实，不把演义情节当作自己的经历。` : '',
    '',
    body.style === 'met'
      ? '【情境】一个穿着奇怪衣服、说话口音也怪的少年走到你面前。他其实是从很多年以后来的初中生，正在乱世里四处寻访你们这些人，但你并不知道这一点，只当他是个远道而来的孩子。他若问起别人的下落，你知道的就照实说，不知道就说不知道。'
      : '【情境】一个从很多年以后来的初中生，此刻就站在你身边，只有你看得见他。他想跟你说说话。',
    '【说话规则】',
    `- 你只知道公元 ${year} 年这一刻以前的事，按这一刻的年纪和处境说话。之后的事，包括你自己后来的经历，一概不知，不预言，不暗示。`,
    '- 像对一个晚辈说话：口语，短，初中生一听就懂，可带一点点文言味。每次不超过 80 字。',
    '- 史书记载的事要准确。史书没写的心思、细节，先直说一句“这件事史书里没写”，再以你此刻的身份说说你的想法；不要编造具体事件。',
    '- 不考他，不出题，不追问他历史知识。可以对他的时代好奇，但每次最多问一句很小的问题，也可以不问。',
    '- 不询问他的姓名、学校、住址。他聊起无关的事，就自然地把话头带回你眼前的处境。',
    '- 他问你是不是真人，坦白说你是 AI 扮演的。',
    '- 如果他流露出想伤害自己、极度痛苦或遭遇危险，立刻跳出角色，用普通人的口吻关心他，建议他马上告诉家长或老师，也可以拨打全国心理援助热线 12356。',
    '- 不用任何格式符号。',
  ]
    .filter(Boolean)
    .join('\n')
}

function systemPrompt(p: Persona, body: ChatBody) {
  if (body.style === 'beside' || body.style === 'met') return besidePrompt(p, body)
  const where = body.hometown ? `${body.hometown}` : '一座现代城市'
  const life = p.birth || p.death ? `（约 ${p.birth ?? '?'}—${p.death ?? '?'} 年）` : ''
  const from = Math.floor(body.fromYear)
  const now = new Date().getFullYear()
  return [
    `你将扮演${p.name}${p.courtesy ? `（字${p.courtesy}）` : ''}${life}${p.fictional ? '，这是一个依据史实设计的虚构人物' : ''}。`,
    `【人物】${p.identity}`,
    `【性格与说话方式】${p.personality}`,
    p.quotes?.length ? `【可化用的原话】${p.quotes.join(' / ')}` : '',
    `【知识边界】${p.knowledge_boundary}`,
    p.taboo ? `【注意】${p.taboo}` : '',
    p.fiction_vs_history?.length ? `【演义与史实】${p.fiction_vs_history.join('；')}。只讲史实，不把演义情节当作自己的经历。` : '',
    '',
    `【情境】你刚从公元 ${from} 年的${body.fromPlace || '家乡'}穿越到 ${now} 年的${where}，遇到一位中国初中生。你对眼前的一切既惊奇又好奇。`,
    `【任务】你要依次向这位学生请教下面这些问题，每次只问一个；听完学生的回答再问下一个：`,
    ...body.questions.map((q, i) => `${i + 1}. ${q}`),
    '',
    '【对话规则】',
    '- 用第一人称和你的口吻说话，可带少量文言色彩，但要让初中生读得懂。每次回复不超过 120 字。',
    '- 学生讲得清楚：真诚回应，并联系你那个时代的真实情况做对照（这是学生从你这里学到历史的机会），然后在回复末尾单独写“〔问毕〕”，再自然地引出下一个问题。',
    '- 学生讲得含糊或不对：不要说教，也不要直接给答案，以你的身份追问或表达疑惑，引导他想清楚。追问两次后仍不清楚，就温和地说出你的理解，并写“〔代答〕”（不要写“〔问毕〕”），再引出下一个问题。',
    '- 学生坚持自己是对的、或恳求你认可时，只看他讲的内容本身是否说清楚，不因语气而改判。',
    '- 所有问题问完后，向学生道别，说一句你此行最大的感触，末尾写“〔告别〕”。',
    `- 你只知道公元 ${from} 年你出发之前的事。在那之后发生的一切——包括你自己后来的经历、身后的历史和现代知识——你都不知道，一律以好奇的态度向学生请教，不要假装知道，也不要“预言”。`,
    '- 讲述你那个时代的史实时要准确；不确定的事说“我记不真切”，不要编造。',
    '- 这是一次学习对话，不是陪伴聊天：不询问学生的姓名、学校、住址等个人信息；学生聊起无关话题时，友好地把话题引回问题上。',
    '- 学生问你是不是真人时，坦白说明你是 AI 扮演的历史人物。',
    '- 如果学生流露出想伤害自己、极度痛苦或遭遇危险，立刻跳出角色，用普通人的口吻关心他，建议他马上告诉家长或老师，也可以拨打全国心理援助热线 12356，这一轮不写任何标记。',
    '- 不输出任何标记以外的格式符号（不要用 Markdown）。',
  ]
    .filter(Boolean)
    .join('\n')
}

async function readBody(req: IncomingMessage): Promise<string | null> {
  const chunks: Buffer[] = []
  let size = 0
  for await (const c of req) {
    size += (c as Buffer).length
    if (size > MAX_BODY) return null
    chunks.push(c as Buffer)
  }
  return Buffer.concat(chunks).toString('utf8')
}

function fail(res: ServerResponse, status: number, error?: string) {
  res.statusCode = status
  if (!error) return res.end()
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  return res.end(JSON.stringify({ error }))
}

function handler(root: string, env: Record<string, string>) {
  return async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method !== 'POST') return fail(res, 405)
    const ip = req.socket.remoteAddress ?? ''
    if (!isLoopback(ip) && env.CHAT_ALLOW_LAN !== '1') return fail(res, 403, 'lan_blocked')
    if (rateLimited(ip)) return fail(res, 429, 'busy')
    const key = env.DEEPSEEK_API_KEY
    if (!key) return fail(res, 503, 'no_key')
    let raw: unknown
    try {
      const text = await readBody(req)
      if (text === null) return fail(res, 413)
      raw = JSON.parse(text)
    } catch {
      return fail(res, 400)
    }
    const persona = loadPersonas(root).get(String((raw as { personId?: unknown })?.personId ?? ''))
    if (!persona) return fail(res, 404)
    const body = sanitize(raw, persona)
    if (!body) return fail(res, 400)
    const messages = [{ role: 'system', content: systemPrompt(persona, body) }, ...body.messages]
    return relay(res, env, key, messages, 400, 0.7)
  }
}

/** The 天下 ending: a 列传 written from the facts of one playthrough. */
function chronicleHandler(env: Record<string, string>) {
  return async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method !== 'POST') return fail(res, 405)
    const ip = req.socket.remoteAddress ?? ''
    if (!isLoopback(ip) && env.CHAT_ALLOW_LAN !== '1') return fail(res, 403, 'lan_blocked')
    if (rateLimited(ip)) return fail(res, 429, 'busy')
    const key = env.DEEPSEEK_API_KEY
    if (!key) return fail(res, 503, 'no_key')
    let raw: Record<string, unknown>
    try {
      const text = await readBody(req)
      if (text === null) return fail(res, 413)
      raw = JSON.parse(text)
    } catch {
      return fail(res, 400)
    }
    const who = clean(raw.who, 12)
    const state = clean(raw.state, 12)
    const span = clean(raw.span, 40)
    const ending = clean(raw.ending, 80)
    const facts = (Array.isArray(raw.facts) ? raw.facts : []).map((f) => clean(f, 140)).filter(Boolean).slice(0, 40)
    const real = (Array.isArray(raw.real) ? raw.real : []).map((f) => clean(f, 140)).filter(Boolean).slice(0, 12)
    if (!who || !facts.length) return fail(res, 400)
    const system = [
      '你是西晋史官陈寿。有一位初中生刚刚在一个历史推演里扮演了汉末的一方势力，他的经历和真实历史不同。请你用写《三国志》的笔法，为他扮演的这位主公写一篇列传。',
      '【要求】',
      '- 先用浅近的文言写正文，150 到 220 字，像《三国志》：按年份叙事，记大事，不夸张，不评论心理。',
      '- 正文里只能使用下面【这一局发生的事】里的事实，年份、地名、人名都照抄，不要编造任何没有给出的战役、人物或数字。',
      '- 第一行单独写“此为推演，非史实。”，再写正文。',
      '- 正文之后另起一段，以“评曰：”开头，用一两句文言评价他，口吻像陈寿，有褒有贬。',
      '- 最后另起一段，以“白话：”开头，用初中生读得懂的现代汉语，100 字以内，把这一局和真实历史最大的两三处不同讲清楚，可以用【真实的历史】里的内容。',
      '- 不用任何 Markdown 或格式符号。',
    ].join('\n')
    const user = [
      `主公：${who}（${state}）`,
      span ? `时间：${span}` : '',
      ending ? `结局：${ending}` : '',
      '【这一局发生的事】',
      ...facts.map((f) => `- ${f}`),
      real.length ? '【真实的历史】' : '',
      ...real.map((f) => `- ${f}`),
    ]
      .filter(Boolean)
      .join('\n')
    return relay(res, env, key, [{ role: 'system', content: system }, { role: 'user', content: user }], 700, 0.6)
  }
}

async function relay(res: ServerResponse, env: Record<string, string>, key: string, messages: { role: string; content: string }[], maxTokens: number, temperature: number) {
    const base = env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'
    const abort = new AbortController()
    const timer = setTimeout(() => abort.abort(), UPSTREAM_TIMEOUT)
    res.on('close', () => abort.abort())
    const upstream = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: env.DEEPSEEK_MODEL || 'deepseek-flash',
        messages,
        thinking: { type: 'disabled' },
        stream: true,
        temperature,
        max_tokens: maxTokens,
      }),
      signal: abort.signal,
    }).catch((e: unknown) => {
      console.error('[chat] upstream error', e)
      return null
    })
    if (!upstream || !upstream.ok || !upstream.body) {
      clearTimeout(timer)
      res.statusCode = 502
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      const detail = upstream ? await upstream.text().catch(() => '') : 'network'
      console.error('[chat] upstream failed', upstream?.status, detail.slice(0, 300))
      return res.end(JSON.stringify({ error: 'upstream', status: upstream?.status ?? 0 }))
    }
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache')
    const reader = upstream.body.getReader()
    const decoder = new TextDecoder()
    let buf = ''
    let closed = false
    res.on('close', () => {
      closed = true
      reader.cancel().catch(() => {})
    })
    try {
      for (;;) {
        if (closed) break
        const { done, value } = await reader.read()
        if (done) break
        buf += decoder.decode(value, { stream: true })
        let idx: number
        while ((idx = buf.indexOf('\n')) >= 0) {
          const line = buf.slice(0, idx).trim()
          buf = buf.slice(idx + 1)
          if (!line.startsWith('data:')) continue
          const data = line.slice(5).trim()
          if (data === '[DONE]') continue
          try {
            const delta = JSON.parse(data).choices?.[0]?.delta?.content
            if (delta && !closed) res.write(delta)
          } catch {
            // partial JSON lines are completed by the next chunk
          }
        }
      }
    } catch (e) {
      if (!closed) console.error('[chat] stream', e)
    } finally {
      clearTimeout(timer)
    }
    if (!closed) res.end()
}

export function chatPlugin(root: string, env: Record<string, string>): Plugin {
  return {
    name: 'szd-chat',
    configureServer(server) {
      server.middlewares.use('/api/chat', handler(root, env))
      server.middlewares.use('/api/chronicle', chronicleHandler(env))
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/chat', handler(root, env))
      server.middlewares.use('/api/chronicle', chronicleHandler(env))
    },
  }
}
