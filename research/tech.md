# 技术调研：历史地图原型

核实日期：2026-09-25。价格与接口以当日打开的官方页面为准；厂商可随时改价。未在本机实际合成音频或渲染地图，文中示例依据官方文档与库源码，不是现场跑通记录。

本项目用法：旁白离线批量生成；古人对话走后端；地图在浏览器里用本地地形瓦片和中文标注。

---

## 1. DeepSeek API

**结论：角色对话用 `deepseek-flash`，关闭思考模式，经自有后端代理调用。** 它与 `deepseek-v4-pro` 都支持思考开关、JSON 输出和工具调用；Flash 更便宜、并发更高，并支持图像。Pro 不支持图像，官方已宣布 2026-09-14 之后继续提供，计费不变。浏览器预检目前会放行跨域，密钥仍然不能放进前端。

### 模型

现行文档只列两个模型名。思考模式是请求参数，不再用单独的“推理模型名”。

| 调用名 | 实际版本 | 思考 | 上下文 / 最大输出 | 图像 | 账户并发 |
| --- | --- | --- | --- | --- | --- |
| `deepseek-flash` | DeepSeek-V4.1-Flash | 默认开启，可关 | 1M / 384K | 支持 | 2500 |
| `deepseek-v4-pro` | DeepSeek-V4-Pro-0813 | 同上 | 1M / 384K | 不支持 | 500 |

- 旧名 `deepseek-v4-flash`、`deepseek-v4-flash-vision-exp` 仍可传入，对应模型已下线，请求由 V4.1-Flash 承接，按 Flash 计费。
- `deepseek-chat`、`deepseek-reasoner` 按 2026-04-24 更新日志应于 2026-07-24 停用。2026-09-25 的快速开始页已不再列出它们，新代码不要使用。
- 思考开关（OpenAI 格式）：`thinking: { "type": "enabled" | "disabled" }`。力度 `reasoning_effort`: `low` / `high` / `max`，默认 `high`。`minimal` 映射为 `low`，`medium` 与 `xhigh` 映射为 `high`，`ultra` 映射为 `max`。
- 思考模式下 `temperature`、`presence_penalty`、`frequency_penalty` 不报错也不生效。`top_p` 仅在思考模式生效，低于 0.95 会当成 0.95；非思考模式固定为 1。
- 思考内容在 `reasoning_content`，与 `content` 并列。不带 `tools` 的多轮对话不必把 `reasoning_content` 传回去，传了也会被忽略。带 `tools` 时，后续每一轮都必须原样回传，否则 400。
- 古人对话建议 `thinking.type = "disabled"`：延迟和输出费用都更低。只有孩子的问题明显需要多步推理时再用 `low`。

### 地址与兼容方式

- OpenAI 格式 base URL：`https://api.deepseek.com`
- Anthropic 格式：`https://api.deepseek.com/anthropic`
- 对话端点：`POST https://api.deepseek.com/chat/completions`
- 另有 Responses API（语义化 SSE，结束事件是 `response.completed` 等，没有 `data: [DONE]`）和 Anthropic Messages API。角色对话用 Chat Completions 即可。
- 请求头：`Authorization: Bearer <API_KEY>`，`Content-Type: application/json`。

### 流式输出（Chat Completions SSE）

`stream: true` 时响应为 `text/event-stream`。每个增量是一行 `data: {JSON}`，流以 `data: [DONE]` 结束。等待推理时服务端会插入注释行 `: keep-alive`，解析时跳过空行和以 `:` 开头的行。推理开始前若超过 10 分钟仍无进展，连接会被关闭。

增量在 `choices[0].delta`：

- `delta.content`：最终回答
- `delta.reasoning_content`：思考过程（仅思考模式）
- `delta.tool_calls`：工具调用参数分片，首片带 `id`、`type`、`function.name`，后续片主要追加 `function.arguments`

`stream_options: { "include_usage": true }` 必须与 `stream: true` 一起用。用量出现在最后一块，其余块的 `usage` 为 `null`。缓存相关字段包括命中 token 与未命中 token。

### 价格（2026-09-25）

官方同时公布人民币价和美元价，比例大约是 1 美元对应 6.7–6.8 元，不是实时汇率。大陆账户充值以[中文价格页](https://api-docs.deepseek.com/zh-cn/quick_start/pricing)为准。

高峰时段：北京时间周一至周五 9:00–12:00、14:00–18:00，不含中国法定节假日。周末和法定节假日全天，以及其他时段，都是空闲价（高峰的一半）。没有单独的“缓存写入”费用项。

人民币 / 百万 tokens：

| | Flash 空闲 | Flash 高峰 | Pro 空闲 | Pro 高峰 |
| --- | ---: | ---: | ---: | ---: |
| 输入，缓存命中 | 0.02 元 | 0.04 元 | 0.15 元 | 0.30 元 |
| 输入，缓存未命中 | 1 元 | 2 元 | 4.5 元 | 9.0 元 |
| 输出 | 4 元 | 8 元 | 13.5 元 | 27.0 元 |

美元价见[英文价格页](https://api-docs.deepseek.com/quick_start/pricing)：Flash 高峰为输入命中 $0.006、未命中 $0.3、输出 $1.2；Pro 高峰为 $0.044、$1.32、$3.96。空闲均为一半。

计费口径是输入 token 加输出 token。价格页没有把 `reasoning_content` 列为免费。思考模式会拉长生成，输出费用随之增加。稳定的人设放在 system 消息里，有利于上下文缓存命中。

### 并发与限速

官方限速页只公布**账户级并发**，没有公布每分钟请求数或 TPM。一条请求从发出到响应结束占一个并发；超限返回 HTTP 429。扩容不另收费，需另行申请。`user_id`（`[a-zA-Z0-9\-_]+`，最长 512，不要放隐私）用于内容安全、KV 缓存和调度隔离；普通账户的并发仍按账户合计。

### JSON 与工具调用

- Chat Completions：`response_format: { "type": "json_object" }`。必须在 system 或 user 消息里要求输出 JSON，否则模型可能一直输出空白直到顶满 token。`finish_reason = "length"` 时 JSON 可能被截断。该接口的取值是 `text` 或 `json_object`。
- Responses API 另支持 `json_schema` 结构化输出。
- 工具调用：`tools` 里目前只有 function。普通模式 base URL 用 `https://api.deepseek.com`。`tool_choice` 的 `required` 和指定函数名在思考模式下会 400，需先关闭思考。
- `strict: true` 仍是 Beta：base URL 改为 `https://api.deepseek.com/beta`，每个 function 都要 `strict: true`，对象的属性必须全部列入 `required`，且 `additionalProperties: false`。支持 object、string、number、integer、boolean、array、enum、anyOf 以及 `$ref`/`$def`。string 不支持 `minLength`/`maxLength`，array 不支持 `minItems`/`maxItems`。
- Chat Completions 不能在对话中途插入不是模型自己产生的 tool call；Anthropic 格式和 Responses API 可以。

### CORS

2026-09-25 对 `OPTIONS https://api.deepseek.com/chat/completions` 做了预检（`Access-Control-Request-Method: POST`，请求头 `authorization,content-type`）。`Origin: http://localhost:5173` 与 `Origin: https://example.com` 都得到 `access-control-allow-origin` 回显该来源，并允许 POST 与上述头，且 `access-control-allow-credentials: true`。因此**当前**从浏览器直接调用，预检本身可以通过。

这不构成把密钥放进前端的理由：页面里的 key 会被任何打开页面的人拿走。角色对话应走自己的后端，由后端持有 `DEEPSEEK_API_KEY` 并转发 SSE。2025 年末有第三方站点报告过缺少 CORS 头；该行为可能再变，不要依赖“浏览器能直连”。

### 最小 Node.js 流式示例

Node 18+ 原生 `fetch`，无 SDK。密钥只从环境变量读取，这段代码应跑在后端。

```js
const resp = await fetch("https://api.deepseek.com/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
  },
  body: JSON.stringify({
    model: "deepseek-flash",
    messages: [
      { role: "system", content: "你是一位来到今天的古人，用口语回答孩子。" },
      { role: "user", content: "长安是什么样的？" },
    ],
    thinking: { type: "disabled" },
    stream: true,
    stream_options: { include_usage: true },
  }),
});

if (!resp.ok || !resp.body) {
  throw new Error(`DeepSeek HTTP ${resp.status}`);
}

const reader = resp.body.getReader();
const decoder = new TextDecoder();
let buf = "";

while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  buf += decoder.decode(value, { stream: true });
  const lines = buf.split("\n");
  buf = lines.pop() ?? "";
  for (const line of lines) {
    const s = line.trim();
    if (!s || s.startsWith(":")) continue;
    if (!s.startsWith("data:")) continue;
    const data = s.slice(5).trim();
    if (data === "[DONE]") continue;
    const delta = JSON.parse(data).choices?.[0]?.delta;
    if (delta?.content) process.stdout.write(delta.content);
  }
}
```

来源：

- https://api-docs.deepseek.com/
- https://api-docs.deepseek.com/zh-cn/quick_start/pricing
- https://api-docs.deepseek.com/quick_start/pricing
- https://api-docs.deepseek.com/quick_start/rate_limit
- https://api-docs.deepseek.com/guides/thinking_mode
- https://api-docs.deepseek.com/guides/tool_calls
- https://api-docs.deepseek.com/api/create-chat-completion
- https://api-docs.deepseek.com/updates
- CORS 为 2026-09-25 对本机预检的结果，官方文档未写成“支持浏览器直连”

---

## 2. 中文语音合成

**结论：旁白批量生成先用 `edge-tts` 7.2.8。** 男声用 `zh-CN-YunjianNeural`（偏成熟）或 `zh-CN-YunyangNeural`（偏播音），女声用 `zh-CN-XiaoxiaoNeural`。它免费、无 key、Windows 上用 uv 即可，输出 MP3，并能给出逐字时间戳。它走的是 Edge 朗读的非官方接口，不能当生产 SLA。断供或需要“纪录片旁白”风格标签时，改用火山引擎豆包长文本合成（国内、有字级时间戳、需 key 和费用）。完全离线且有 NVIDIA 显卡时再考虑 CosyVoice 3，时间戳要另做对齐。

音质判断来自厂商说明与公开评测描述，不是本次听感实测。

| 方案 | 音质与旁白适合度 | Key / 费用 | Windows 本地 | 输出 | 时间戳 |
| --- | --- | --- | --- | --- | --- |
| edge-tts 7.2.8 | 微软神经语音，默音色自然，适合旁白；不能选 Azure 的风格标签 | 无 key，免费 | 纯 Python，可行 | MP3 | 有。`WordBoundary` / `SentenceBoundary`，可写成 SRT |
| Azure 语音（正式） | 同一套音色，且 `zh-CN-YunjianNeural` 有 `documentary-narration` | 需要 key，按量计费 | 云 API，本机只跑 SDK | 多种，含 WAV/MP3 | 有。`WordBoundary`，偏移以 100 纳秒 tick 计 |
| 豆包语音 / 火山长文本 | 大模型音色，中文韵律好，适合成段旁白 | 需要 key。合成模型 2.0 新用户 2 万字符、半年 | 云 API | mp3、ogg_opus、pcm、wav | 长文本接口 `enable_timestamp: true` 返回句时间以及句内每个字 |
| MiniMax speech-2.8 | HD 偏有声书；turbo 更快 | 需要 key。HD 3.5 元/万字符，turbo 2 元/万字符；1 个汉字算 2 个字符 | 云 API | mp3 等，可设采样率 | WebSocket 的 `subtitle` 可选 `word`；异步长文本文档写的是精确到句 |
| 讯飞超拟人合成 | 中文自然度够用，纪录片控制力弱于可指定风格的 Azure | 需要 AppID / APIKey / APISecret，按套餐 | 云 API | mp3、pcm、opus 等 | 本次看到的“时间戳”是引擎版本字段，不是逐字对齐 |
| CosyVoice 3 开源 | 零样本复刻和指令控制强，默认可不做旁白音色 | 本地免费；模型约 0.5B | 官方路径是 Conda + Python 3.10，Linux/Docker 优先。社区能在 Windows + NVIDIA 上跑，4GB 显存有人跑通过，依赖重 | 常见为 WAV | 2024 年维护者明确没有词级时间戳；2026 年官方 README 仍未把它列为输出。云上百炼/千问的 CosyVoice v2+ 另有 `word_timestamp_enabled`，那是付费 API |

### edge-tts：现在是否还能用

- PyPI 最新版 **7.2.8**，发布于 2026-03-22，至核实日没有更新的版本。
- 声音名与 Azure 神经语音同一套。微软文档中 `zh-CN-YunjianNeural` 的风格含 `documentary-narration`、`narration-relaxed`、`serious`；`zh-CN-YunxiNeural` 含 `narration-relaxed`、`newscast`。这些风格要在 Azure SSML 里指定。
- edge-tts 已移除自定义 SSML：服务端只接受 Edge 自己会生成的那一种 `<speak>`/`<voice>`。因此**选不到** `documentary-narration`，只能用该声音的默认风格，外加 `--rate`、`--pitch`、`--volume`。旁白可以把语速略放慢（例如 `-8%`）。
- 其他可用普通话声音：`zh-CN-XiaoxiaoNeural`、`zh-CN-YunxiNeural`、`zh-CN-XiaoyiNeural`。完整列表以 `edge-tts --list-voices` 当时返回为准。
- 稳定性：库作者写明接口由微软控制，可能限流或随时变更。第三方工具说明（更新于 2026-07）记载 2025-12 曾大规模断供，并建议不要当作唯一通道。本次没有实际发起合成，不能把“包还在 PyPI”写成“今天合成一定成功”。

适合本项目的原因：旁白是离线批量、句数有限、需要文字跟读。`WordBoundary` 的 `offset` 与 `duration` 按 100 纳秒 tick 计，`SubMaker` 会转成 SRT。同步播放时用这些 cue，不必再做强制对齐。

### 其他方案何时再上

- **要风格标签或 edge-tts 不可用：** 火山长文本（国内直连、字级时间戳）或 Azure 语音（`documentary-narration` + `WordBoundary`）。流式接口 V3 的文档把 `enable_timestamp` 标成仅 TTS 1.0；离线批量应走长文本异步接口，不要假设 2.0 流式也返回字级字幕。火山按量单价以控制台为准，本次未把社区文章里的“1.3 元/千字”当作官方报价。计费概述确认：豆包语音合成模型 2.0 按字符计费，免费额度 20000 字符、有效期半年。
- **要更高的有声书质感并且接受按字付费：** MiniMax `speech-2.8-hd`。注意异步文档与 WebSocket 的时间戳粒度不同；要逐字同步就用 WebSocket 的 `subtitle: "word"`，或按句切开再对齐。
- **要机器完全离线：** Fun-CosyVoice3-0.5B（ModelScope / Hugging Face 模型名 `Fun-CosyVoice3-0.5B-2512`）。官方安装是 Conda、Python 3.10、`requirements.txt`，GPU 推理可选 vLLM 0.9.0 或 0.11.x。Windows 不是官方一等路径。没有字级时间戳时，生成后再用对齐工具，成本明显高于 edge-tts。云上 CosyVoice 的字级时间戳不能算作本地开源模型的能力。
- **讯飞：** 国内接入成熟，但是次目标（纪录片旁白 + 逐字同步）没有比前几项更直接的组合，不作为第一选择。

### 最小示例（uv + edge-tts）

```powershell
uv init narration
cd narration
uv add edge-tts==7.2.8
uv run python gen.py
```

`gen.py`：

```python
import asyncio
import edge_tts

TEXT = "西汉定都长安，关中成为帝国的心脏。"
VOICE = "zh-CN-YunjianNeural"  # 女声可改为 zh-CN-XiaoxiaoNeural

async def main() -> None:
    comm = edge_tts.Communicate(TEXT, VOICE, rate="-8%")
    submaker = edge_tts.SubMaker()
    with open("narration.mp3", "wb") as audio:
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                audio.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                submaker.feed(chunk)
    with open("narration.srt", "w", encoding="utf-8") as sub:
        sub.write(submaker.get_srt())

asyncio.run(main())
```

命令行等价形式：`edge-tts --voice zh-CN-YunjianNeural --rate=-8% --text "..." --write-media narration.mp3 --write-subtitles narration.srt`。

来源：

- https://pypi.org/project/edge-tts/ （7.2.8，2026-03-22）
- https://github.com/rany2/edge-tts/blob/master/README.md
- https://github.com/rany2/edge-tts/blob/master/src/edge_tts/submaker.py
- https://github.com/MicrosoftDocs/azure-ai-docs/blob/main/articles/ai-services/speech-service/includes/language-support/voice-styles-and-roles.md
- https://docs.azure.cn/zh-cn/ai-services/speech-service/how-to-speech-synthesis （WordBoundary）
- https://github.com/FunAudioLLM/CosyVoice/blob/main/README.md
- https://github.com/FunAudioLLM/CosyVoice/issues/269
- https://docs.volcengine.com/docs/6561/1829010 （长文本与时间戳）
- https://docs.volcengine.com/docs/6561/1598757 （流式时间戳仅 TTS 1.0）
- https://docs.volcengine.com/docs/DoubaoVoice/BillingOverview-15 （免费额度）
- https://platform.minimaxi.com/docs/guides/pricing-paygo
- https://platform.minimaxi.com/docs/guides/speech-t2a-async
- https://platform.minimaxi.com/docs/api-reference/speech-t2a-websocket （`subtitle`: sentence / word）
- https://www.xfyun.cn/doc/spark/super%20smart-tts.html

---

## 3. 地图渲染（MapLibre GL JS）

**结论：用 npm 包 `maplibre-gl@6.11.2`。地形用本地 terrarium PNG 加 `hillshade` 层。疆域随时间变化时，用两层 fill 做透明度交叉淡入，不要指望多边形几何自动变形。中文标注靠 `localIdeographFontFamily` 和本机/自托管字体，拉丁字母和数字仍需一份本地 glyph PBF。**

文档站示例仍写着 `maplibre-gl@^6.7.0`。npm `latest` 在 2026-09-24 为 **6.11.2**。新项目锁定 6.11.2。v6 只发布 ES module（`maplibre-gl.mjs`），Vite 直接 `import maplibregl from "maplibre-gl"`，并引入 `maplibre-gl/dist/maplibre-gl.css`。

### terrarium 地形晕渲

`raster-dem` 的 `encoding` 默认是 `mapbox`。Terrarium 必须显式写 `"encoding": "terrarium"`。解码为 `(R × 256 + G + B / 256) − 32768` 米。样式规范里 `tileSize` 默认 512；常见 terrarium 瓦片是 256，必须写成 `256`，否则高程会错位。

优先用 `tiles` 数组指向本地文件。2023 年的 issue 里，用 `url` 指向 TileJSON 时，若 bounds 缺失或为 0，hillshade 会不显示；`tiles` 路径不受该问题影响。把瓦片放进 Vite 的 `public/dem/` 后，浏览器请求的是同源相对路径，不依赖境外高程服务。

```ts
map.addSource("dem", {
  type: "raster-dem",
  tiles: ["/dem/{z}/{x}/{y}.png"],
  encoding: "terrarium",
  tileSize: 256,
  maxzoom: 12,
});

map.addLayer({
  id: "hillshade",
  type: "hillshade",
  source: "dem",
  paint: {
    "hillshade-method": "standard",
    "hillshade-illumination-direction": 315,
    "hillshade-exaggeration": 0.4,
    "hillshade-shadow-color": "#473b2f",
    "hillshade-highlight-color": "#ffffff",
    "hillshade-accent-color": "#5c5346",
  },
});
```

晕渲放在政权填色之下，地形始终可见。`encoding: "custom"` 时才使用 `redFactor` 等参数，terrarium 不用写这些。

### 多边形之间的平滑过渡

历史疆域每一年几何都可能不同，MapLibre 不会把两个多边形的顶点插值成变形动画。可行做法按数据是否同一套要素来分：

1. **两层交叉淡入（推荐，几何在变时）。** 维护 A/B 两个 GeoJSON source 和两个 fill 层。换年时把新数据写入当前隐藏层，再把该层 `fill-opacity`（或整层 `fill-layer-opacity`）从 0 过渡到 1，旧层过渡到 0。`fill-color`、`fill-opacity` 在样式规范中均为 Transitionable。层上可设 `"transition": { "duration": 450, "delay": 0 }`。同一政权沿用同一色系，弱控制区用较低透明度，视觉上就是扩张、收缩和交融。时间跳得很远时形状仍会“换”而不是“长”，这是数据帧间隔问题，不是渲染器能补出来的。
2. **`feature-state`（几何稳定时）。** 郡界不动、只改归属颜色时，给 feature 稳定 `id`（或 `promoteId`），用 `["feature-state", "color"]` 驱动 `fill-color`。样式规范写明 `fill-color` / `fill-opacity` 支持 feature-state。整层 `setPaintProperty` 会走 transition；逐要素、逐帧去改 feature-state 并不是一条现成的时间轴。社区库 `maplibre-transition` 用动画循环写 feature-state，正是因为要自己驱动插值，且它声明的 peer 是 MapLibre ≥ 3。郡界本身逐年重画时，不要用这条路径硬做变形。
3. **预计算中间帧。** 若某个政权的扩张需要“长出去”的感觉，在数据阶段生成若干中间多边形，播放时仍用第 1 种交叉淡入。这比在运行时做多边形 morph 可控。
4. **deck.gl 9.4.0。** `GeoJsonLayer` 可以对颜色、高度做属性过渡，适合海量点、弧线（迁都）和轨迹。与 MapLibre 叠加要多一个画布并同步相机。郡级多边形的数量用 MapLibre 双图层足够；deck.gl 留作迁都弧线和事件点密度上来之后的选项，不作为底图引擎。中文标注仍建议留在 MapLibre symbol 层。

`fill-layer-opacity` 是整层合成后的透明度，重叠区域不会像 `fill-opacity` 那样逐要素累加。两个政权层交叉淡入时，用它更不容易在重叠处闪出深色。

### 中文标注，不依赖境外字体服务

`localIdeographFontFamily` 默认是 `'sans-serif'`。CJK 用浏览器本地画，不请求 glyph 服务器；样式里的 `text-font` 对汉字无效，仍认字重关键字（light / regular / medium / bold）。设为 `false` 才会向 `glyphs` URL 要中文 PBF，慢且依赖外部服务。

Windows 上指定已安装或自托管的字体：

```ts
localIdeographFontFamily: '"Source Han Serif SC", "Noto Serif SC", "Microsoft YaHei", serif'
```

自托管时把思源宋体等 woff2 放进站点，用 CSS `@font-face` 注册同名 family，再把该名字传给上面的参数。这是本地字体，不是 glyph 服务器。

汉字以外的字符（数字、拼音、拉丁字母）仍走样式里的 `glyphs`：`{fontstack}/{range}.pbf`。把这份小字形集放在自己的静态目录，例如 `glyphs: "/fonts/{fontstack}/{range}.pbf"`。只靠 `localIdeographFontFamily` 不能盖住年份数字。

来源：

- npm `maplibre-gl` 6.11.2（2026-09-24）
- https://maplibre.org/maplibre-gl-js/docs/
- https://maplibre.org/maplibre-style-spec/sources/ （raster-dem `encoding`: terrarium / mapbox / custom）
- https://maplibre.org/maplibre-style-spec/layers/ （hillshade、fill-color、fill-opacity、fill-layer-opacity）
- https://github.com/maplibre/maplibre-gl-js/blob/main/src/data/dem_data.ts （terrarium 解码系数）
- https://maplibre.org/maplibre-gl-js/docs/examples/add-a-hillshade-layer/
- https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MapOptions/ （`localIdeographFontFamily` 默认 `'sans-serif'`）
- https://maplibre.org/maplibre-gl-js/docs/examples/use-locally-generated-ideographs/
- https://github.com/maplibre/maplibre-gl-js/issues/3527
- npm `deck.gl` 9.4.0（2026-09-05）

---

## 4. 动效与时间轴

**结论：界面过渡用 `motion@13.4.3`（导入路径 `motion/react`）。底部时间轴的拖动、惯性和吸附用 `gsap@3.15.0` 的 Draggable + InertiaPlugin。** 时间刻度是非线性的，惯性要发生在像素轴上，吸附点用刻度的像素位置，不要在“年份数值”上做线性吸附。

### 库

- 包名是 `motion`，不再新装 `framer-motion`。npm 上两者目前都是 13.4.3（2026-09-24）。官方升级方式是改从 `motion/react` 导入。`framer-motion` 仍在发相同版本，旧项目可以留着，新代码不要用旧包名。
- Motion 适合组件进出、布局动画、开场镜头的 UI 层。地图 WebGL 画布不要交给它逐帧改 GeoJSON。
- GSAP 3.13 起全部插件免费，含原先 Club 的 InertiaPlugin，商业使用也不需要会员。npm 最新稳定版仍是 **3.15.0**（2026-04-13）。时间轴这种“甩出去再停在刻度上”的交互，Draggable 的 `inertia: true` 和 Inertia 的 snap 数组是直接能力。

```ts
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(Draggable, InertiaPlugin);

Draggable.create(handle, {
  type: "x",
  bounds: track,
  inertia: true,
  snap: {
    x: (end) => nearestTickPx(end),
  },
  onDrag() {
    setYear(yearAtPx(this.x));
  },
  onThrowUpdate() {
    setYear(yearAtPx(this.x));
  },
});
```

`nearestTickPx` 在朝代色带和事件标记的像素坐标里找最近点，阈值内吸附，否则停在惯性结束处。远古压缩、近现代展开，都编码在 `yearAtPx` / `pxAtYear` 这一对函数里。播放专线时用 `gsap.to` 把把手移到目标像素，并在 `onUpdate` 里换地图年份。

若不想为时间轴引入 GSAP：在 pointerup 时记录最近 100ms 的像素速度，用指数衰减的 `requestAnimationFrame` 滑行，速度低于阈值后调用同一个 `nearestTickPx`。行为要和上面一致，拖动空间仍然是像素。Motion 的 `drag` 与 `dragMomentum` 适合普通滑块，非线性历史轴的吸附要自己写，它不会比这段更短。

来源：

- npm `motion` 13.4.3、`framer-motion` 13.4.3（2026-09-24）
- https://motion.dev/docs/react-upgrade-guide
- npm `gsap` 3.15.0（2026-04-13）
- https://gsap.com/docs/v3/Installation/
- https://gsap.com/docs/v3/Plugins/Draggable/
- https://gsap.com/docs/v3/Plugins/InertiaPlugin/
- https://github.com/greensock/GSAP/compare/3.12.7...3.13.0 （3.13 起插件免费）

---

## 推荐技术栈清单

| 用途 | 包 | 版本 | 说明 |
| --- | --- | --- | --- |
| 地图 | `maplibre-gl` | 6.11.2 | 样式与 CSS 一起引入；地形与标注见第 3 节 |
| 界面动效 | `motion` | 13.4.3 | `import { motion } from "motion/react"` |
| 时间轴拖动 | `gsap` | 3.15.0 | 使用 Draggable 与 InertiaPlugin |
| 角色对话 | DeepSeek HTTP API | 模型 `deepseek-flash` | 无 npm 依赖；后端原生 fetch。思考默认关掉 |
| 旁白 | `edge-tts` | 7.2.8 | Python，`uv add edge-tts==7.2.8` |

不进入第一期依赖：`deck.gl@9.4.0`（迁都弧线或超大图层再评估）、`framer-motion`（只作旧名）、CosyVoice 本地权重、MiniMax / 火山 / 讯飞 SDK。火山长文本作为 edge-tts 断供时的旁白后备，不提前装进仓库。
