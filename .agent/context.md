# 工作状态

- 目标：面向初中生的史政地趣味 AI 学习系统，核心是随时间变化的互动中国地图
- 已确认决定：见 `产品方案.md` v0.2（权威记录）
- 用户明确：不考虑竞争；不考虑人工内容审核；资料由 AI 尽量详尽搜集（鼓励大量派 Grok 4.7 子代理多轮调研），用户可提供电子书；暂不考虑备案与合规；大模型用 DeepSeek

## 原型（2026-09-25）
- 位置：`prototype/`（Vite 8 + React 19 + MapLibre 6.11），`npm run dev` → http://localhost:5173
- 已实现：倒带开场、疆域 30 关键帧交叉淡入、郡治/古地名随年代、时间轴（非线性、惯性、吸附、世界大事菱形）、专线 48 段（chapters.json）+ edge-tts 配音、两条线（lines.json）、城市页 16 座、家乡卡、搜索、图层、深浅主题、手机底部抽屉、反向穿越（DeepSeek 代理 server/chat.ts，模型 deepseek-flash，思考关闭）
- 数据流水线：research/*.md（子代理调研）→ scripts/build_map.py 等 → src/data/*.json 与 public/data/；Python 用 data/.venv（需 PYTHONUTF8=1；uv 全局镜像清华 403，安装用 --no-config --default-index https://pypi.org/simple）
- 疆域算法：每关键帧按郡治 Voronoi，用 CHGIS 县治缓冲裁轮廓，按(势力,强度)合并；外轮廓线仅画势力之间
- 环境坑：Windows 下 Write/StrReplace 后文件同步有延迟，跑脚本前 sleep 数秒；MapLibre 6 需 setWorkerUrl（src/map/worker.ts）

## 2026-09-25 下午打磨
- 默认浅色（纸质地图集），深色可选；地势分层设色（color-relief）+ 海深 + igor 晕渲 + 海岸水线
- 疆域：县治 Voronoi→郡；外轮廓用县治聚类凹包+平滑；coverage_simplify + Chaikin 平滑边界；水彩内描边（line-offset，环逆时针，海岸段裁掉）；填色按精细海岸裁切
- 动态呈现：src/map/dynamics.ts（进军路线逐段绘制+箭头+标签；迁都/迁徙见 src/data/moves.json，手工整理的真实迁都）；事件改图标胶囊（src/map/icons.ts），战役进行中冲击波、事后留淡色战场标记；人物换地方时平滑移动；专线讲述期间时间缓慢前进
- 时间轴：图标 + 事件名称带（按离播放头距离避让）+ 世界大事一行
- 截图工具：tools/shot（puppeteer-core + 本机 Edge 无头），`node shot.mjs scenes.json out`；内置浏览器面板不可见时页面 rAF 暂停，别误判为 bug
- 注意：Python 在 Windows 文本模式写文件会变 CRLF；motion 会覆盖 CSS transform，居中不要用 translateX

## 2026-09-30 修复
- 导览：旁白计时等飞年结束再走；暂停可续；静音和倍速不重开这一步；上一段会收起后面打开的线；年份落在事件仍显示的窗口里
- 行军：多年战役按全程走；「献帝东逃」不再和「献帝东归」叠线；重播按年数放慢，定时器可取消
- 地名：东郡、张掖属国、辽东属国补上与地图一致的坐标；安溪、吴川、常平镇、婺源、峄山镇、锦溪改到正确的省
- 搜索轮流给出城市/人物/事件，人物可搜字；中文输入法回车不再误发。导览和穿越里点搜索会回到可看见的侧栏
- 人物在收尾年与出发年相同的时候也会平滑搬家。疆域加载失败会重试，远跳先显示最近一帧

## 2026-09-30 三场景重构
- 赤壁之战、九品中正、阴平灭蜀各5段：SceneExperience + SceneDiagrams + SceneNarration，共用原地图；入口为精选故事及 `?scene=chibi|jiupin|yinping`，直链不挂载倒带开场。
- 肖像周瑜、陈群、邓艾：public/images/portraits 无损WebP；PNG与完整生成提示词存 docs/scene-upgrade。15段旁白已经生成，tts.py --scenes 按正文哈希增量检查。
- 手机支持地图/展开阅读，段落进度按场景恢复，键盘页签、标题焦点、故事集焦点圈与退出恢复已验证。
- 修正三条旧事件，其余105条不变；research/scene_event_overrides.json 在 build_map.py 旧审查之后应用，避免再生成覆盖。
- mapRef：布局留白更新须等相机移动结束；MapLibre setPadding 内部 jumpTo 会打断 flyTo。已复现并修复，不要在飞行中强制 setPadding。
- 验收与截图：docs/scene-upgrade/README.md、verification.md、browser-checks.json、asset-checks.json；本机生产预览 http://127.0.0.1:4173/。构建通过；16条lint警告、大包提示、真实AI对话与低端手机性能仍须后续验收。

## 待办
- 2026-09-30 用户鼓励大胆创新后：三个场景入口改用 SceneStudio（整页故事现场 / 拆开看看 / 地图手札），BattleLab 支持赤壁3视角与阴平路线/阶段；InstitutionLab 为文书和评价权研究台。切视图保持研究组件挂载；幕次localStorage，视图/研究点/研究选项sessionStorage。旧SceneExperience仍承载SceneHub/SceneMap导出，不再作为主故事入口。
- 新壳键盘、查阅焦点恢复、320/390/820/740短横屏/1440布局、15幕、音频结束后查阅不自动重播已实际检查。mapRef flyTo 增加AbortSignal和相机请求所有权，m.stop在注册自身moveend前；不要把旧同步moveend误当新请求结束。docs/scene-upgrade/camera-race-checks.mjs 可重跑10项竞争检查。
- 当前呈现与证据以 docs/scene-upgrade/studio-browser-checks.json 及 screenshots/08—15 为准，02—07是早期形态。新场景组件lint无警告，整体仍16条；主JS gzip约675kB，大包与真实低端性能仍有验收边界。
- 用户提供 DeepSeek 密钥（prototype/.env）后实测对话
- 已合并：persons_more（共 48 人）、review_data 修正（build_map.py 内应用，SKIP_REVIEW 列出未采纳的存疑项）
- 已知局限：Voronoi 郡界近似（如杭州显示为会稽郡）；CHGIS V6 许可为非商业、禁止再分发，公开/商用前须取得许可或自绘
