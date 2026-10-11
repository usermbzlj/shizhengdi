import type { IncomingMessage, ServerResponse } from 'node:http'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'

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
  locations?: { from: number; to: number; place: string }[]
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
  if (!Number.isFinite(year)) return null
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

function systemPrompt(p: Persona, body: ChatBody) {
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
        temperature: 0.7,
        max_tokens: 400,
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
}

export function chatPlugin(root: string, env: Record<string, string>): Plugin {
  return {
    name: 'szd-chat',
    configureServer(server) {
      server.middlewares.use('/api/chat', handler(root, env))
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/chat', handler(root, env))
    },
  }
}
