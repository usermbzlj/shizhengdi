# 三国前后（原型）

公元 184—280 年。打开先是游戏大厅：坐到曹操、孙权、刘备的位置上打一场关键时刻，在沙盘里分天下，穿越回汉末去找人，或者跟着十三岁的诸葛亮从山东走到五丈原。大厅底部进入地图资料馆：一张随时间变化的中国地图，可以拖时间轴看疆域、事件和人物，跟着专线走完这段历史。

## 运行

需要 Node.js 20 以上。

```bash
npm install
npm run dev
```

浏览器打开终端里显示的地址（默认 http://localhost:5173 ）。手机或平板在同一局域网内，可以用终端里显示的 Network 地址访问。

### 启用“反向穿越”的 AI 对话

古人对话调用 DeepSeek。在本目录新建 `.env` 文件：

```
DEEPSEEK_API_KEY=你的密钥
DEEPSEEK_MODEL=deepseek-flash
```

保存后重启 `npm run dev`。密钥只在本机的开发服务器里使用，不会发送到浏览器。未配置时，对话窗口会给出提示，其他功能不受影响。

## 入口

| 地址 | 内容 |
| --- | --- |
| `/` | 游戏大厅 |
| `?play=<局>&side=<势力>` | 关键时刻与乱世沙盘，`&resume=1` 接着上次 |
| `?roam` | 穿越者，`&resume=1` 接着上次 |
| `?life` | 一个十三岁的男孩（诸葛亮的一生） |
| `?atlas` | 地图资料馆；`?scene=chibi\|jiupin\|yinping` 直接进精修场景 |

存档在浏览器本地（`szd-war-save`、`szd-roam-save`），带版本号，结构不对会自动丢弃。

## 地图资料馆

- **倒带开场**：从今天的地球回到公元 184 年，城市灯光、铁路、长城、运河依次消失。
- **时空地图**：势力范围按郡着色，控制薄弱或争夺中的地区颜色更淡；关键帧之间平滑过渡；地名随年代变化；缩放到区域级时出现郡治。
- **时间轴**：年份、年号和局势写在播放头上。拖动、惯性、吸附到重大事件；方向键逐年移动，Shift + 方向键跳到上一个或下一个重大事件。轴上的图标是大事，名字在悬停时出现。
- **跟着历史走**：48 段讲述放在画面下方，地图只留下这一段正在说的事。拖动时间轴会暂停，而不是退出。配音在讲述条上开关。
- **一条线的故事**：长江、秦岭—淮河，在右上角「更多」里打开。
- **城市与家乡**：搜索古今地名。在「更多」里设置家乡后，地图上会钉住它；点那枚针，看它在当前年份属于哪个郡、由谁控制。
- **地图默认很安静**：势力与河流常在。大事会先演开场，再演本身，最后才给出结果；「全部事件」「全部人物」在「更多」里。放大到区域，或点「今天」，人物才会铺开。
- **反向穿越**：邀请后时间快进到今天，这个人站在家乡的位置，一次问一件事。

## 目录

```
server/chat.ts        DeepSeek 代理（古人对话、推演列传；Vite 开发/预览服务器中间件）
src/game/             游戏大厅、关键时刻与沙盘（engine.ts + world.ts）、穿越者、存档
src/game/tianxia/     “天下”逐日推演引擎与 110 郡棋盘（还没有界面，用 scripts/tianxia-*.ts 推演）
src/life/             诸葛亮的一生：讲述稿 zhuge.ts、环境声与朗读 sound.ts
src/map/              地图渲染：样式、疆域过渡、标记
src/components/       资料馆的时间轴、面板、专线、场景、开场、对话
src/data/*.json       内容数据（由脚本生成，讲述稿除外）
public/data/          地理数据（疆域、郡、州界、水系、陆地）
public/terrain/       本地地形瓦片（z0—7，中国范围）
public/audio/         专线与“线”的配音
scripts/              数据构建脚本
```

## 重新生成数据

调研资料在上级目录 `research/`，原始地理数据在 `data/raw/`。脚本使用 `data/.venv` 中的 Python（含 geopandas、shapely、pyogrio、edge-tts）：

```powershell
$env:PYTHONUTF8='1'
..\data\.venv\Scripts\python.exe scripts\build_base.py   # 陆地、现代叠加层、现代城市地名
..\data\.venv\Scripts\python.exe scripts\build_map.py    # 疆域关键帧、郡、州界、事件、城市、人物、世界大事
..\data\.venv\Scripts\python.exe scripts\build_water.py  # 水系、湖泊、线、关隘
..\data\.venv\Scripts\python.exe scripts\tts.py          # 配音（只重新生成文字有改动的段落；--life 只做一生）
node scripts\fetch-terrain.mjs 7                         # 地形瓦片
..\data\.venv\Scripts\python.exe scripts\parse_junguo.py      # 《郡国志》户口 → data/derived/junguo_pop.json
..\data\.venv-geo\Scripts\python.exe scripts\build_tianxia.py # “天下”棋盘 src/game/tianxia/board.json
```

`build_map.py` 不是逐字节可复现的，几何坐标在小数点后第三位有浮点噪声（`build_tianxia.py` 未验证，按同样对待）；只改了文字时，提交前把无关的几何变动还原掉。

推演脚本（只在开发时用，先打包再运行，命令写在各文件开头）：

- `scripts/tianxia-verify.ts`：多种子统计乌巢、赤壁等是否从规则里长出来（`wuchao`、`chibi`、`trace`）。
- `scripts/tianxia-sim.ts`：逐年打印一局“天下”。
- `scripts/strategy-sim.ts`：无界面跑关键时刻与沙盘。

`src/data/chapters.json`（专线讲述稿）和 `src/data/lines.json`（线的故事）是直接编辑的内容文件，不由脚本生成。

## 数据来源

- 政区与郡治、县治：复旦大学中国历史地理研究所 CHGIS V6 时间序列数据
- 陆地、河流、湖泊、铁路、现代城市：Natural Earth（公有领域）
- 地形：AWS Open Data Terrain Tiles（Terrarium 编码）
- 历史内容：《后汉书》《三国志》及裴注、《晋书》《资治通鉴》、谭其骧《中国历史地图集》等，出处写在各事件与城市卡片底部
- 配音：edge-tts（微软神经语音，非官方接口）

## 已知局限

- edge-tts 自 2026 年 10 月起返回 403，配音暂时无法生成。一生的旁白没有录音，用浏览器自带的朗读或按阅读时长推进；专线与“秦岭—淮河”的五丈原段文字已修正，录音仍是旧文。
- 郡界是按郡治位置划分、再用县治分布裁出轮廓的近似结果，不是考证过的郡界。靠近郡界的地点可能被划到相邻郡，例如杭州（汉钱唐县）属吴郡，地图上会显示为会稽郡。
- 周边民族的活动范围是示意性的大致区域。
- 疆域以约 30 个关键帧表示，两帧之间是渐变过渡，不代表逐年变化。
- CHGIS V6 的许可仅限非商业学术、教育使用，并禁止再分发。本原型的疆域、郡治数据由它派生，公开发布或商用前需要向 CHGIS 管理委员会取得许可，或改用自绘数据。CBDB 人物资料同样限非商业使用。
