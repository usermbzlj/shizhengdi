# 200–219 年郡级控制关键帧

本文件供地图直接转数据。郡名用《续汉书·郡国志》；该志以顺帝永和五年（140）约 105 郡国为底，此后至 219 年新设、改名、废弃的单位在名录中另注。上色规则：

1. 某年有效郡 = 名录中 `start ≤ 年`，且 `end` 为空或 `年 < end`。
2. 先按该郡所属州，套用该帧 `provinces` 的默认 `controller` 与 `strength`。
3. `overrides` 覆盖同名郡。与州默认相同但必须保留说明的郡，也写在 `overrides` 里。
4. `controller` 为 `null` 且 `strength` 为 `lost`：旧地已无汉郡行政，或实际由匈奴、鲜卑、羌、氐等占据。周边民族的势力 ID 不在本文件指定。
5. `contested` 必有 `contenders`。`core` = 稳定设治；`weak` = 名义归属或治所在、内地空虚。
6. 坐标是古治所的今地约数，只供落点。
7. 建安十八年（213）曹操曾改十三州为九州（并州、幽州并入冀州等）。这次改制多停留在文书上，本表仍按郡国志的十三州归郡，不按九州重画。

势力 ID 只用指定写法。高干是袁绍外甥、袁氏并州牧，归 `yuanshao`。宋建只占陇西枹罕一带，不单列势力。黑山军张燕、黄巾余部、张绣在本时段都没有整郡控制，见各帧说明。

## 郡国名录

### 郡国志 105 郡国（140 年前后）

| 州 | 郡国 |
| --- | --- |
| 司隶 | 河南尹、河内郡、河东郡、弘农郡、京兆尹、左冯翊、右扶风 |
| 豫州 | 颍川郡、汝南郡、梁国、沛国、陈国、鲁国 |
| 冀州 | 魏郡、巨鹿郡、常山国、中山国、安平国、河间国、清河国、赵国、勃海郡 |
| 兖州 | 陈留郡、东郡、东平国、任城国、泰山郡、济北国、山阳郡、济阴郡 |
| 徐州 | 东海郡、琅邪国、彭城国、广陵郡、下邳国 |
| 青州 | 济南国、平原郡、乐安国、北海国、东莱郡、齐国 |
| 荆州 | 南阳郡、南郡、江夏郡、零陵郡、桂阳郡、武陵郡、长沙郡 |
| 扬州 | 九江郡、丹阳郡、庐江郡、会稽郡、吴郡、豫章郡 |
| 益州 | 汉中郡、巴郡、广汉郡、蜀郡、犍为郡、牂柯郡、越巂郡、益州郡、永昌郡、广汉属国、蜀郡属国、犍为属国 |
| 凉州 | 陇西郡、汉阳郡、武都郡、金城郡、安定郡、北地郡、武威郡、张掖郡、酒泉郡、敦煌郡、张掖属国、张掖居延属国 |
| 并州 | 上党郡、太原郡、上郡、西河郡、五原郡、云中郡、定襄郡、雁门郡、朔方郡 |
| 幽州 | 涿郡、广阳郡、代郡、上谷郡、渔阳郡、右北平郡、辽西郡、辽东郡、玄菟郡、乐浪郡、辽东属国 |
| 交州 | 南海郡、苍梧郡、郁林郡、合浦郡、交趾郡、九真郡、日南郡 |

清河国：桓帝建和二年（148）改名甘陵。本表沿用郡国志旧名，避免一地两名。

### 140 年之后、本时段已经存在的郡

| 郡 | 州 | start | end | 从何析出 | 处理 |
| --- | --- | --- | --- | --- | --- |
| 博陵郡 | 冀州 | 158 | — | 桓帝延熹元年分中山置 | 随冀州默认上色 |
| 庐陵郡 | 扬州 | 194 | — | 兴平元年孙策分豫章置。另有建安初之异说 | 随扬州默认 |
| 巴东郡 | 益州 | 195 | — | 兴平二年刘璋分巴郡置固陵，建安六年（201）改巴东 | 200 年或仍名固陵，地图用巴东 |
| 新平郡 | 凉州 | 194 | — | 兴平元年分安定、右扶风置 | 见各帧 |
| 西郡 | 凉州 | 195 | — | 兴平二年前后分张掖置，年份略有异说 | 随凉州默认 |

### 200–219 年新设（进入对应年份的帧）

| 郡 | 州 | start | 从何析出 | 说明 |
| --- | --- | --- | --- | --- |
| 巴西郡 | 益州 | 201 | 分巴郡，治阆中 | 建安六年刘璋以庞羲为巴西太守 |
| 带方郡 | 幽州 | 207 | 公孙康分乐浪南部置 | 确切年份在公孙康时期，本表从 207 年起列入 |
| 襄阳郡 | 荆州 | 208 | 分南阳（襄阳县本属南阳） | 曹操南征占领荆北后置。另有“分南郡”的晚出说法，见争议 |
| 南乡郡 | 荆州 | 208 | 分南阳 | 同上，约建安十三年 |
| 新都郡 | 扬州 | 208 | 孙权分丹阳 | 建安十三年 |
| 宜都郡 | 荆州 | 210 | 分南郡（临江一带） | 刘备得南郡后置，后改称宜都 |
| 汉昌郡 | 荆州 | 210 | 分长沙北部 | 鲁肃为汉昌太守，与关羽相接 |
| 鄱阳郡 | 扬州 | 210 | 孙权分豫章 | 建安十五年 |
| 江阳郡 | 益州 | 211 | 刘璋分犍为 | 置年或稍早，至迟入蜀前已有 |
| 蕲春郡 | 扬州 | 213 | 孙权分江夏 | 《吴书》系统在建安十八年以前；本表从 213 年起列入 |
| 涪陵郡 | 益州 | 214 | 刘备分巴郡 | |
| 汶山郡 | 益州 | 214 | 刘备复置，地出蜀郡北部 | 汶山郡东汉曾省 |
| 新兴郡 | 并州 | 215 | 不是河套旧地 | 省云中、定襄、五原、朔方，各留一县，合置于太原、雁门之间（今忻州一带）安置遗民 |
| 西平郡 | 凉州 | 215 | 约建安末分金城 | 或稍晚至黄初，见争议 |
| 乐平郡 | 并州 | 216 | 分常山、上党 | 建安二十一年 |
| 梓潼郡 | 益州 | 217 | 刘备分广汉 | 约建安二十二年，霍峻守葭萌一线 |
| 高凉郡 | 交州 | 218 | 孙权分合浦 | 建安二十三年。实际仍在士氏范围内 |
| 宕渠郡 | 益州 | 218 | 刘备分巴西 | 不久即省。219 帧保留并注明 |
| 房陵郡、上庸郡、西城郡 | 益州 | 219 | 分汉中东三郡 | 刘备先置太守；219 年末孟达降曹。曹魏后来改西城为魏兴，三郡合为新城，那是 220 年前后的事 |

建安二十年（215）起，云中、定襄、五原、朔方在文书上已省。地图仍要画出这四郡的旧地，颜色用 `lost`，不要涂成新兴郡。上郡、西河同样早废，旧地保留为 `lost`。

### 本表不单独上色的短命或年份不明郡

章陵郡（刘表分南阳，置年与省年都不清）、东安郡（孙权约 208–213 分丹阳，旋废）、谯郡、弋阳郡（多在建安末或黄初，难定是否已在 219 年独立）、城阳、利城、昌虑（初平年间自琅邪、东海分出，昌虑约 206 年并回东海）。理由见文末。

---

## 200 年冬：官渡之战后

官渡之战在建安五年十月，袁绍主力溃于官渡，退回河北，但并没有垮台。他仍占冀、青、幽、并四州的内地，三个儿子和外甥高干各守一州。曹操稳住兖、豫、徐和司隶东部，南阳郡的郡治宛城也在他手里；关中只是马腾、韩遂表面上服从。刘备这年春在徐州被曹操击破，战后流亡，尚未在荆州站住脚。张绣已在 199 年降曹，张燕的黑山军只在太行山里活动，都没有整郡。

```json
{
  "year": 200,
  "month": 12,
  "label": "官渡之战后",
  "provinces": [
    {"province": "司隶", "controller": "cao", "strength": "core"},
    {"province": "豫州", "controller": "cao", "strength": "core"},
    {"province": "冀州", "controller": "yuanshao", "strength": "core"},
    {"province": "兖州", "controller": "cao", "strength": "core"},
    {"province": "徐州", "controller": "cao", "strength": "core"},
    {"province": "青州", "controller": "yuanshao", "strength": "core"},
    {"province": "荆州", "controller": "liubiao", "strength": "core"},
    {"province": "扬州", "controller": "sun", "strength": "core"},
    {"province": "益州", "controller": "liuzhang", "strength": "core"},
    {"province": "凉州", "controller": "liang", "strength": "weak"},
    {"province": "并州", "controller": "yuanshao", "strength": "core"},
    {"province": "幽州", "controller": "yuanshao", "strength": "core"},
    {"province": "交州", "controller": "shixie", "strength": "core"}
  ],
  "overrides": [
    {"name": "河东郡", "controller": "cao", "strength": "weak", "note": "钟繇以司隶校尉经营关中，河东要到建安七年击破郭援后才稳定"},
    {"name": "京兆尹", "controller": "liang", "strength": "contested", "contenders": ["cao"], "note": "马腾部驻右扶风郿县一带，关中诸将名义上听汉廷、曹操调遣"},
    {"name": "左冯翊", "controller": "liang", "strength": "contested", "contenders": ["cao"], "note": "同关中，无曹操直属太守稳定驻守"},
    {"name": "右扶风", "controller": "liang", "strength": "contested", "contenders": ["cao"], "note": "马腾根据地在郿"},
    {"name": "泰山郡", "controller": "cao", "strength": "weak", "note": "臧霸等青徐豪帅自主权大，仍属曹操阵营"},
    {"name": "琅邪国", "controller": "cao", "strength": "weak", "note": "臧霸等豪帅分据琅邪、东海，建安十一年昌豨败后才更稳"},
    {"name": "东海郡", "controller": "cao", "strength": "weak", "note": "同琅邪"},
    {"name": "广陵郡", "controller": "cao", "strength": "weak", "note": "江淮之间户口流散，郡治不稳定，孙权未能占郡"},
    {"name": "东莱郡", "controller": "yuanshao", "strength": "weak", "note": "袁谭平青州时，东莱沿海控制较弱"},
    {"name": "南阳郡", "controller": "cao", "strength": "contested", "contenders": ["liubiao"], "note": "宛城自张绣建安四年降曹后属曹操；襄阳、新野仍是刘表，刘备尚未寄寓"},
    {"name": "九江郡", "controller": "cao", "strength": "core", "note": "扬州州治在合肥，寿春亦为曹氏淮南根本。郡国志扬州其余郡属孙权"},
    {"name": "汉中郡", "controller": "zhanglu", "strength": "core", "note": "张鲁政教合一，断斜谷道，不听刘璋"},
    {"name": "巴郡", "controller": "liuzhang", "strength": "weak", "note": "北境与张鲁相接。巴东已分出，今年或仍称固陵"},
    {"name": "益州郡", "controller": "liuzhang", "strength": "weak", "note": "南中大姓实际影响大"},
    {"name": "永昌郡", "controller": "liuzhang", "strength": "weak", "note": "极西南，郡治时断，当地部族势力强"},
    {"name": "越巂郡", "controller": "liuzhang", "strength": "weak", "note": "遥控"},
    {"name": "牂柯郡", "controller": "liuzhang", "strength": "weak", "note": "遥控"},
    {"name": "广汉属国", "controller": "liuzhang", "strength": "weak", "note": "氐人聚居，后来的阴平"},
    {"name": "蜀郡属国", "controller": "liuzhang", "strength": "weak", "note": "后来的汉嘉"},
    {"name": "犍为属国", "controller": "liuzhang", "strength": "weak", "note": "后来的朱提"},
    {"name": "北地郡", "controller": null, "strength": "lost", "note": "羌乱后郡治内徙，旧地弃置"},
    {"name": "汉阳郡", "controller": "liang", "strength": "core", "note": "马腾一系的陇右根本，治冀县"},
    {"name": "陇西郡", "controller": "liang", "strength": "core", "note": "宋建割据枹罕，在郡境西部自称河首平汉王，全郡仍归凉州诸将"},
    {"name": "金城郡", "controller": "liang", "strength": "core", "note": "韩遂主要活动地"},
    {"name": "武都郡", "controller": "liang", "strength": "weak", "note": "氐、羌势力大"},
    {"name": "上郡", "controller": null, "strength": "lost", "note": "永和后郡治已侨置左冯翊夏阳，旧地废弃"},
    {"name": "西河郡", "controller": null, "strength": "lost", "note": "灵帝末郡废。南匈奴王庭原在美稷，汉末已不能当汉郡治理"},
    {"name": "五原郡", "controller": null, "strength": "lost", "note": "汉末流徙，建安二十年正式省入新兴"},
    {"name": "云中郡", "controller": null, "strength": "lost", "note": "鲜卑、南匈奴交侵，郡民流散"},
    {"name": "定襄郡", "controller": null, "strength": "lost", "note": "同云中"},
    {"name": "朔方郡", "controller": null, "strength": "lost", "note": "永和五年已侨置五原，旧地废弃"},
    {"name": "雁门郡", "controller": "yuanshao", "strength": "weak", "note": "高干所能及主要在郡南；郡北空虚"},
    {"name": "代郡", "controller": "yuanshao", "strength": "weak", "note": "鲜卑压力大"},
    {"name": "上谷郡", "controller": "yuanshao", "strength": "weak", "note": "鲜卑、乌桓交错"},
    {"name": "右北平郡", "controller": "yuanshao", "strength": "weak", "note": "三郡乌桓之一，军权在乌桓大人，袁熙仅有名义"},
    {"name": "辽西郡", "controller": "yuanshao", "strength": "weak", "note": "蹋顿所在。袁氏与乌桓是同盟，不是袁氏直辖"},
    {"name": "辽东属国", "controller": "yuanshao", "strength": "weak", "note": "乌桓聚居，袁氏、公孙氏都不稳"},
    {"name": "辽东郡", "controller": "gongsun_liaodong", "strength": "core", "note": "公孙度在世，治襄平，不听袁绍"},
    {"name": "玄菟郡", "controller": "gongsun_liaodong", "strength": "weak", "note": "公孙氏向北延伸，郡境已较西汉内缩"},
    {"name": "乐浪郡", "controller": "gongsun_liaodong", "strength": "core", "note": "公孙氏遥领朝鲜半岛北部"},
    {"name": "苍梧郡", "controller": "shixie", "strength": "weak", "note": "士燮兄弟重点在交趾、合浦、九真、南海"},
    {"name": "郁林郡", "controller": "shixie", "strength": "weak", "note": "遥控"},
    {"name": "日南郡", "controller": "shixie", "strength": "weak", "note": "最南，控制松弛"}
  ],
  "capitals": [
    {"faction": "yuanshao", "city": "邺", "lng": 114.35, "lat": 36.33},
    {"faction": "cao", "city": "许", "lng": 113.85, "lat": 34.03},
    {"faction": "liubiao", "city": "襄阳", "lng": 112.15, "lat": 32.01},
    {"faction": "sun", "city": "吴县", "lng": 120.62, "lat": 31.30},
    {"faction": "liuzhang", "city": "成都", "lng": 104.06, "lat": 30.67},
    {"faction": "zhanglu", "city": "南郑", "lng": 106.94, "lat": 33.07},
    {"faction": "liang", "city": "冀县", "lng": 105.34, "lat": 34.74},
    {"faction": "gongsun_liaodong", "city": "襄平", "lng": 123.17, "lat": 41.27},
    {"faction": "shixie", "city": "龙编", "lng": 105.85, "lat": 21.03}
  ],
  "sources": [
    "《三国志·武帝纪》建安五年",
    "《三国志·袁绍传》",
    "《三国志·张绣传》《钟繇传》《张鲁传》",
    "《资治通鉴》卷六十三",
    "《晋书·地理志》上郡、朔方等郡汉末流废"
  ]
}
```

曹操的大本营和汉献帝都在许。邺还是袁绍的。袁谭在平原、袁熙在蓟、高干在晋阳，都算袁绍一方，不另标都城。孙策这年四月死，孙权继立，治所仍在吴县。

---

## 205 年冬：曹操破袁谭之后

建安十年正月，曹操在南皮攻杀袁谭，冀州、青州随后平定。到这年年末，幽州内地（涿郡、广阳一带）也因焦触等人倒向曹操而改属。这还不是“四州都平了”：高干在并州重新反叛，壶关要到建安十一年（206）才破；袁尚、袁熙逃去辽西，依附乌桓蹋顿，要到 207 年白狼山之后才消灭。公孙度已在 204 年死去，儿子公孙康继续据辽东。

```json
{
  "year": 205,
  "month": 12,
  "label": "破袁谭后",
  "provinces": [
    {"province": "司隶", "controller": "cao", "strength": "core"},
    {"province": "豫州", "controller": "cao", "strength": "core"},
    {"province": "冀州", "controller": "cao", "strength": "core"},
    {"province": "兖州", "controller": "cao", "strength": "core"},
    {"province": "徐州", "controller": "cao", "strength": "core"},
    {"province": "青州", "controller": "cao", "strength": "core"},
    {"province": "荆州", "controller": "liubiao", "strength": "core"},
    {"province": "扬州", "controller": "sun", "strength": "core"},
    {"province": "益州", "controller": "liuzhang", "strength": "core"},
    {"province": "凉州", "controller": "liang", "strength": "weak"},
    {"province": "并州", "controller": "yuanshao", "strength": "core"},
    {"province": "幽州", "controller": "cao", "strength": "core"},
    {"province": "交州", "controller": "shixie", "strength": "core"}
  ],
  "overrides": [
    {"name": "京兆尹", "controller": "liang", "strength": "contested", "contenders": ["cao"], "note": "关中仍未经过潼关之战"},
    {"name": "左冯翊", "controller": "liang", "strength": "contested", "contenders": ["cao"], "note": "同京兆"},
    {"name": "右扶风", "controller": "liang", "strength": "contested", "contenders": ["cao"], "note": "马腾仍在陇右、关中之间"},
    {"name": "泰山郡", "controller": "cao", "strength": "weak", "note": "豪帅问题尚未完全解决"},
    {"name": "琅邪国", "controller": "cao", "strength": "weak", "note": "昌豨尚在，明年才平"},
    {"name": "东海郡", "controller": "cao", "strength": "weak", "note": "同琅邪"},
    {"name": "广陵郡", "controller": "cao", "strength": "weak", "note": "江淮空地"},
    {"name": "南阳郡", "controller": "cao", "strength": "contested", "contenders": ["liubiao"], "note": "宛属曹操，襄阳、新野属刘表。刘备自建安六年起寄寓新野"},
    {"name": "九江郡", "controller": "cao", "strength": "core", "note": "合肥"},
    {"name": "汉中郡", "controller": "zhanglu", "strength": "core"},
    {"name": "巴西郡", "controller": "liuzhang", "strength": "weak", "note": "建安六年已置，北与张鲁对峙"},
    {"name": "巴郡", "controller": "liuzhang", "strength": "weak", "note": "三巴已分，巴郡治江州"},
    {"name": "益州郡", "controller": "liuzhang", "strength": "weak"},
    {"name": "永昌郡", "controller": "liuzhang", "strength": "weak"},
    {"name": "越巂郡", "controller": "liuzhang", "strength": "weak"},
    {"name": "牂柯郡", "controller": "liuzhang", "strength": "weak"},
    {"name": "广汉属国", "controller": "liuzhang", "strength": "weak", "note": "氐"},
    {"name": "蜀郡属国", "controller": "liuzhang", "strength": "weak"},
    {"name": "犍为属国", "controller": "liuzhang", "strength": "weak"},
    {"name": "北地郡", "controller": null, "strength": "lost"},
    {"name": "汉阳郡", "controller": "liang", "strength": "core"},
    {"name": "陇西郡", "controller": "liang", "strength": "core", "note": "宋建仍据枹罕"},
    {"name": "金城郡", "controller": "liang", "strength": "core"},
    {"name": "武都郡", "controller": "liang", "strength": "weak", "note": "氐羌"},
    {"name": "上郡", "controller": null, "strength": "lost"},
    {"name": "西河郡", "controller": null, "strength": "lost", "note": "南匈奴"},
    {"name": "五原郡", "controller": null, "strength": "lost"},
    {"name": "云中郡", "controller": null, "strength": "lost"},
    {"name": "定襄郡", "controller": null, "strength": "lost"},
    {"name": "朔方郡", "controller": null, "strength": "lost"},
    {"name": "太原郡", "controller": "yuanshao", "strength": "core", "note": "高干复叛，治晋阳。建安十一年破壶关后才归曹操"},
    {"name": "上党郡", "controller": "yuanshao", "strength": "core", "note": "高干守壶关"},
    {"name": "雁门郡", "controller": "yuanshao", "strength": "weak", "note": "高干势力的边缘"},
    {"name": "代郡", "controller": "cao", "strength": "weak", "note": "鲜卑"},
    {"name": "上谷郡", "controller": "cao", "strength": "weak", "note": "鲜卑、乌桓"},
    {"name": "右北平郡", "controller": "yuanshao", "strength": "weak", "note": "乌桓与袁尚、袁熙，曹操的幽州官吏尚未到达"},
    {"name": "辽西郡", "controller": "yuanshao", "strength": "weak", "note": "袁尚、袁熙依附蹋顿"},
    {"name": "辽东属国", "controller": "yuanshao", "strength": "weak", "note": "乌桓"},
    {"name": "辽东郡", "controller": "gongsun_liaodong", "strength": "core", "note": "公孙康"},
    {"name": "玄菟郡", "controller": "gongsun_liaodong", "strength": "weak"},
    {"name": "乐浪郡", "controller": "gongsun_liaodong", "strength": "core"},
    {"name": "苍梧郡", "controller": "shixie", "strength": "weak"},
    {"name": "郁林郡", "controller": "shixie", "strength": "weak"},
    {"name": "日南郡", "controller": "shixie", "strength": "weak"}
  ],
  "capitals": [
    {"faction": "cao", "city": "许", "lng": 113.85, "lat": 34.03},
    {"faction": "cao", "city": "邺", "lng": 114.35, "lat": 36.33},
    {"faction": "yuanshao", "city": "令支", "lng": 118.70, "lat": 40.40},
    {"faction": "liubiao", "city": "襄阳", "lng": 112.15, "lat": 32.01},
    {"faction": "liubei", "city": "新野", "lng": 112.36, "lat": 32.52},
    {"faction": "sun", "city": "吴县", "lng": 120.62, "lat": 31.30},
    {"faction": "liuzhang", "city": "成都", "lng": 104.06, "lat": 30.67},
    {"faction": "zhanglu", "city": "南郑", "lng": 106.94, "lat": 33.07},
    {"faction": "liang", "city": "冀县", "lng": 105.34, "lat": 34.74},
    {"faction": "gongsun_liaodong", "city": "襄平", "lng": 123.17, "lat": 41.27},
    {"faction": "shixie", "city": "龙编", "lng": 105.85, "lat": 21.03}
  ],
  "sources": [
    "《三国志·武帝纪》建安九年至十一年",
    "《三国志·袁绍传》",
    "《资治通鉴》卷六十四",
    "《三国志·公孙度传》"
  ]
}
```

帧取建安十年年末，所以写 12 月，而不写破袁谭的正月。许仍是献帝所在，邺从建安九年起是曹操自己的根据地，两处都标。袁氏残部的落点放在辽西郡治令支附近，只表示袁尚、袁熙依附乌桓，不是新的国都。刘备的新野是寄寓刘表，新野县仍算南阳郡里刘表的地盘。

---

## 207 年秋：白狼山之战后

建安十二年，曹操北征三郡乌桓，在白狼山打败蹋顿。袁尚、袁熙逃入辽东，被公孙康杀掉，首级送给曹操。高干已在前一年败死。到这一年，曹操才真正把冀、青、幽、并的汉郡内地连成一片。辽东仍是公孙康的。并州黄河以北的旧郡照旧空着。此帧是补入的：若只用 205 年，会把乌桓和辽西提前画进曹操境内。

```json
{
  "year": 207,
  "month": 8,
  "label": "白狼山之战后",
  "provinces": [
    {"province": "司隶", "controller": "cao", "strength": "core"},
    {"province": "豫州", "controller": "cao", "strength": "core"},
    {"province": "冀州", "controller": "cao", "strength": "core"},
    {"province": "兖州", "controller": "cao", "strength": "core"},
    {"province": "徐州", "controller": "cao", "strength": "core"},
    {"province": "青州", "controller": "cao", "strength": "core"},
    {"province": "荆州", "controller": "liubiao", "strength": "core"},
    {"province": "扬州", "controller": "sun", "strength": "core"},
    {"province": "益州", "controller": "liuzhang", "strength": "core"},
    {"province": "凉州", "controller": "liang", "strength": "weak"},
    {"province": "并州", "controller": "cao", "strength": "core"},
    {"province": "幽州", "controller": "cao", "strength": "core"},
    {"province": "交州", "controller": "shixie", "strength": "core"}
  ],
  "overrides": [
    {"name": "京兆尹", "controller": "liang", "strength": "contested", "contenders": ["cao"]},
    {"name": "左冯翊", "controller": "liang", "strength": "contested", "contenders": ["cao"]},
    {"name": "右扶风", "controller": "liang", "strength": "contested", "contenders": ["cao"]},
    {"name": "广陵郡", "controller": "cao", "strength": "weak", "note": "江淮空地"},
    {"name": "南阳郡", "controller": "cao", "strength": "contested", "contenders": ["liubiao"], "note": "宛属曹操，襄阳、新野属刘表，刘备屯新野"},
    {"name": "九江郡", "controller": "cao", "strength": "core"},
    {"name": "汉中郡", "controller": "zhanglu", "strength": "core"},
    {"name": "巴西郡", "controller": "liuzhang", "strength": "weak", "note": "对张鲁前线"},
    {"name": "益州郡", "controller": "liuzhang", "strength": "weak"},
    {"name": "永昌郡", "controller": "liuzhang", "strength": "weak"},
    {"name": "越巂郡", "controller": "liuzhang", "strength": "weak"},
    {"name": "牂柯郡", "controller": "liuzhang", "strength": "weak"},
    {"name": "广汉属国", "controller": "liuzhang", "strength": "weak"},
    {"name": "蜀郡属国", "controller": "liuzhang", "strength": "weak"},
    {"name": "犍为属国", "controller": "liuzhang", "strength": "weak"},
    {"name": "北地郡", "controller": null, "strength": "lost"},
    {"name": "汉阳郡", "controller": "liang", "strength": "core"},
    {"name": "陇西郡", "controller": "liang", "strength": "core"},
    {"name": "金城郡", "controller": "liang", "strength": "core"},
    {"name": "武都郡", "controller": "liang", "strength": "weak"},
    {"name": "上郡", "controller": null, "strength": "lost"},
    {"name": "西河郡", "controller": null, "strength": "lost", "note": "南匈奴五部之制要到建安二十一年才建立，此时旧地仍非汉郡"},
    {"name": "五原郡", "controller": null, "strength": "lost"},
    {"name": "云中郡", "controller": null, "strength": "lost"},
    {"name": "定襄郡", "controller": null, "strength": "lost"},
    {"name": "朔方郡", "controller": null, "strength": "lost"},
    {"name": "雁门郡", "controller": "cao", "strength": "weak", "note": "郡北对鲜卑"},
    {"name": "代郡", "controller": "cao", "strength": "weak"},
    {"name": "上谷郡", "controller": "cao", "strength": "weak"},
    {"name": "右北平郡", "controller": "cao", "strength": "weak", "note": "乌桓已破，户口残破"},
    {"name": "辽西郡", "controller": "cao", "strength": "weak", "note": "白狼山在此方向。战后曹操把一批乌桓迁入内地，郡境仍弱"},
    {"name": "辽东属国", "controller": "cao", "strength": "weak", "note": "乌桓余部"},
    {"name": "辽东郡", "controller": "gongsun_liaodong", "strength": "core", "note": "公孙康斩袁尚、袁熙，向曹操送首级，辽东仍自立"},
    {"name": "玄菟郡", "controller": "gongsun_liaodong", "strength": "weak"},
    {"name": "乐浪郡", "controller": "gongsun_liaodong", "strength": "core"},
    {"name": "带方郡", "controller": "gongsun_liaodong", "strength": "weak", "note": "公孙康分乐浪南部置，置年或略晚于 207，本帧起列入"},
    {"name": "苍梧郡", "controller": "shixie", "strength": "weak"},
    {"name": "郁林郡", "controller": "shixie", "strength": "weak"},
    {"name": "日南郡", "controller": "shixie", "strength": "weak"}
  ],
  "capitals": [
    {"faction": "cao", "city": "许", "lng": 113.85, "lat": 34.03},
    {"faction": "cao", "city": "邺", "lng": 114.35, "lat": 36.33},
    {"faction": "liubiao", "city": "襄阳", "lng": 112.15, "lat": 32.01},
    {"faction": "liubei", "city": "新野", "lng": 112.36, "lat": 32.52},
    {"faction": "sun", "city": "吴县", "lng": 120.62, "lat": 31.30},
    {"faction": "liuzhang", "city": "成都", "lng": 104.06, "lat": 30.67},
    {"faction": "zhanglu", "city": "南郑", "lng": 106.94, "lat": 33.07},
    {"faction": "liang", "city": "冀县", "lng": 105.34, "lat": 34.74},
    {"faction": "gongsun_liaodong", "city": "襄平", "lng": 123.17, "lat": 41.27},
    {"faction": "shixie", "city": "龙编", "lng": 105.85, "lat": 21.03}
  ],
  "sources": [
    "《三国志·武帝纪》建安十二年",
    "《三国志·乌丸传》《公孙度传》",
    "《资治通鉴》卷六十五"
  ]
}
```

---

## 208 年上半年：曹操南下之前

时间定在建安十三年六月，理由：这年七月曹操才南征；八月刘表死，九月刘琮降。六月时刘表还在襄阳，刘备驻新野、樊城，替刘表看守南阳南境。孙权这年春天攻江夏、斩黄祖，但没有留下稳定的郡治，江夏仍算刘表一方，只是变弱了。北方格局与 207 年秋相同。马腾约在此前后入朝，家属留在邺，关中军事实体还在。

```json
{
  "year": 208,
  "month": 6,
  "label": "南征荆州前",
  "provinces": [
    {"province": "司隶", "controller": "cao", "strength": "core"},
    {"province": "豫州", "controller": "cao", "strength": "core"},
    {"province": "冀州", "controller": "cao", "strength": "core"},
    {"province": "兖州", "controller": "cao", "strength": "core"},
    {"province": "徐州", "controller": "cao", "strength": "core"},
    {"province": "青州", "controller": "cao", "strength": "core"},
    {"province": "荆州", "controller": "liubiao", "strength": "core"},
    {"province": "扬州", "controller": "sun", "strength": "core"},
    {"province": "益州", "controller": "liuzhang", "strength": "core"},
    {"province": "凉州", "controller": "liang", "strength": "weak"},
    {"province": "并州", "controller": "cao", "strength": "core"},
    {"province": "幽州", "controller": "cao", "strength": "core"},
    {"province": "交州", "controller": "shixie", "strength": "core"}
  ],
  "overrides": [
    {"name": "京兆尹", "controller": "liang", "strength": "contested", "contenders": ["cao"], "note": "马腾入朝前后，关中尚无曹操驻军"},
    {"name": "左冯翊", "controller": "liang", "strength": "contested", "contenders": ["cao"]},
    {"name": "右扶风", "controller": "liang", "strength": "contested", "contenders": ["cao"]},
    {"name": "广陵郡", "controller": "cao", "strength": "weak"},
    {"name": "南阳郡", "controller": "cao", "strength": "contested", "contenders": ["liubiao"], "note": "宛属曹操；新野、樊城、襄阳属刘表。刘备是客军，不单占一郡"},
    {"name": "江夏郡", "controller": "liubiao", "strength": "weak", "note": "春孙权斩黄祖，未久驻。郡仍属刘表，秋后刘琦走江夏"},
    {"name": "九江郡", "controller": "cao", "strength": "core"},
    {"name": "新都郡", "controller": "sun", "strength": "weak", "note": "建安十三年分丹阳置，山越未靖，置郡或在下半年，本帧预先标出并注明"},
    {"name": "汉中郡", "controller": "zhanglu", "strength": "core"},
    {"name": "巴西郡", "controller": "liuzhang", "strength": "weak"},
    {"name": "益州郡", "controller": "liuzhang", "strength": "weak"},
    {"name": "永昌郡", "controller": "liuzhang", "strength": "weak"},
    {"name": "越巂郡", "controller": "liuzhang", "strength": "weak"},
    {"name": "牂柯郡", "controller": "liuzhang", "strength": "weak"},
    {"name": "广汉属国", "controller": "liuzhang", "strength": "weak"},
    {"name": "蜀郡属国", "controller": "liuzhang", "strength": "weak"},
    {"name": "犍为属国", "controller": "liuzhang", "strength": "weak"},
    {"name": "北地郡", "controller": null, "strength": "lost"},
    {"name": "汉阳郡", "controller": "liang", "strength": "core"},
    {"name": "陇西郡", "controller": "liang", "strength": "core"},
    {"name": "金城郡", "controller": "liang", "strength": "core"},
    {"name": "武都郡", "controller": "liang", "strength": "weak"},
    {"name": "上郡", "controller": null, "strength": "lost"},
    {"name": "西河郡", "controller": null, "strength": "lost"},
    {"name": "五原郡", "controller": null, "strength": "lost"},
    {"name": "云中郡", "controller": null, "strength": "lost"},
    {"name": "定襄郡", "controller": null, "strength": "lost"},
    {"name": "朔方郡", "controller": null, "strength": "lost"},
    {"name": "雁门郡", "controller": "cao", "strength": "weak"},
    {"name": "代郡", "controller": "cao", "strength": "weak"},
    {"name": "上谷郡", "controller": "cao", "strength": "weak"},
    {"name": "右北平郡", "controller": "cao", "strength": "weak"},
    {"name": "辽西郡", "controller": "cao", "strength": "weak"},
    {"name": "辽东属国", "controller": "cao", "strength": "weak"},
    {"name": "辽东郡", "controller": "gongsun_liaodong", "strength": "core"},
    {"name": "玄菟郡", "controller": "gongsun_liaodong", "strength": "weak"},
    {"name": "乐浪郡", "controller": "gongsun_liaodong", "strength": "core"},
    {"name": "带方郡", "controller": "gongsun_liaodong", "strength": "weak"},
    {"name": "苍梧郡", "controller": "shixie", "strength": "weak"},
    {"name": "郁林郡", "controller": "shixie", "strength": "weak"},
    {"name": "日南郡", "controller": "shixie", "strength": "weak"}
  ],
  "capitals": [
    {"faction": "cao", "city": "许", "lng": 113.85, "lat": 34.03},
    {"faction": "cao", "city": "邺", "lng": 114.35, "lat": 36.33},
    {"faction": "liubiao", "city": "襄阳", "lng": 112.15, "lat": 32.01},
    {"faction": "liubei", "city": "新野", "lng": 112.36, "lat": 32.52},
    {"faction": "sun", "city": "吴县", "lng": 120.62, "lat": 31.30},
    {"faction": "liuzhang", "city": "成都", "lng": 104.06, "lat": 30.67},
    {"faction": "zhanglu", "city": "南郑", "lng": 106.94, "lat": 33.07},
    {"faction": "liang", "city": "冀县", "lng": 105.34, "lat": 34.74},
    {"faction": "gongsun_liaodong", "city": "襄平", "lng": 123.17, "lat": 41.27},
    {"faction": "shixie", "city": "龙编", "lng": 105.85, "lat": 21.03}
  ],
  "sources": [
    "《三国志·武帝纪》建安十三年",
    "《三国志·刘表传》《先主传》《吴主传》",
    "《资治通鉴》卷六十五"
  ]
}
```

新都郡若严格放在下半年，本帧可以不画。名录把它标在 208 年，这里用 `weak` 加注，避免把丹阳山区提前涂成稳定郡。

---

## 209 年冬：赤壁之战后

赤壁战事在建安十三年冬（208 年末到 209 年初）。本帧取建安十四年冬：曹仁撤出江陵，周瑜占领南郡郡治；刘备收下江南四郡（武陵、长沙、桂阳、零陵），自己驻在公安。公安在南郡南境，所以南郡郡治属孙权，刘备只是在郡里驻军。曹操保住南阳，并新置襄阳郡、南乡郡。江夏一郡三家都插了手。刘琦这年病死，刘备从此领荆州牧的名义。

```json
{
  "year": 209,
  "month": 12,
  "label": "赤壁之战后",
  "provinces": [
    {"province": "司隶", "controller": "cao", "strength": "core"},
    {"province": "豫州", "controller": "cao", "strength": "core"},
    {"province": "冀州", "controller": "cao", "strength": "core"},
    {"province": "兖州", "controller": "cao", "strength": "core"},
    {"province": "徐州", "controller": "cao", "strength": "core"},
    {"province": "青州", "controller": "cao", "strength": "core"},
    {"province": "荆州", "controller": "liubei", "strength": "core"},
    {"province": "扬州", "controller": "sun", "strength": "core"},
    {"province": "益州", "controller": "liuzhang", "strength": "core"},
    {"province": "凉州", "controller": "liang", "strength": "weak"},
    {"province": "并州", "controller": "cao", "strength": "core"},
    {"province": "幽州", "controller": "cao", "strength": "core"},
    {"province": "交州", "controller": "shixie", "strength": "core"}
  ],
  "overrides": [
    {"name": "京兆尹", "controller": "liang", "strength": "contested", "contenders": ["cao"]},
    {"name": "左冯翊", "controller": "liang", "strength": "contested", "contenders": ["cao"]},
    {"name": "右扶风", "controller": "liang", "strength": "contested", "contenders": ["cao"]},
    {"name": "广陵郡", "controller": "cao", "strength": "weak"},
    {"name": "南阳郡", "controller": "cao", "strength": "core", "note": "赤壁后曹操荆州只稳在汉水以北"},
    {"name": "襄阳郡", "controller": "cao", "strength": "core", "note": "建安十三年分南阳置，曹仁系驻此"},
    {"name": "南乡郡", "controller": "cao", "strength": "core", "note": "建安十三年分南阳置，在南阳西鄙"},
    {"name": "南郡", "controller": "sun", "strength": "core", "note": "周瑜取江陵，任南郡太守。刘备屯公安，尚未领有全郡"},
    {"name": "江夏郡", "controller": "sun", "strength": "contested", "contenders": ["cao", "liubei"], "note": "文聘为曹操守江北石阳；程普为孙权守沙羡；刘备收刘琦余部。一郡三治"},
    {"name": "九江郡", "controller": "cao", "strength": "core"},
    {"name": "新都郡", "controller": "sun", "strength": "weak", "note": "山越出没，郡治不稳"},
    {"name": "汉中郡", "controller": "zhanglu", "strength": "core"},
    {"name": "巴西郡", "controller": "liuzhang", "strength": "weak"},
    {"name": "益州郡", "controller": "liuzhang", "strength": "weak"},
    {"name": "永昌郡", "controller": "liuzhang", "strength": "weak"},
    {"name": "越巂郡", "controller": "liuzhang", "strength": "weak"},
    {"name": "牂柯郡", "controller": "liuzhang", "strength": "weak"},
    {"name": "广汉属国", "controller": "liuzhang", "strength": "weak"},
    {"name": "蜀郡属国", "controller": "liuzhang", "strength": "weak"},
    {"name": "犍为属国", "controller": "liuzhang", "strength": "weak"},
    {"name": "北地郡", "controller": null, "strength": "lost"},
    {"name": "汉阳郡", "controller": "liang", "strength": "core"},
    {"name": "陇西郡", "controller": "liang", "strength": "core"},
    {"name": "金城郡", "controller": "liang", "strength": "core"},
    {"name": "武都郡", "controller": "liang", "strength": "weak"},
    {"name": "上郡", "controller": null, "strength": "lost"},
    {"name": "西河郡", "controller": null, "strength": "lost"},
    {"name": "五原郡", "controller": null, "strength": "lost"},
    {"name": "云中郡", "controller": null, "strength": "lost"},
    {"name": "定襄郡", "controller": null, "strength": "lost"},
    {"name": "朔方郡", "controller": null, "strength": "lost"},
    {"name": "雁门郡", "controller": "cao", "strength": "weak"},
    {"name": "代郡", "controller": "cao", "strength": "weak"},
    {"name": "上谷郡", "controller": "cao", "strength": "weak"},
    {"name": "右北平郡", "controller": "cao", "strength": "weak"},
    {"name": "辽西郡", "controller": "cao", "strength": "weak"},
    {"name": "辽东属国", "controller": "cao", "strength": "weak"},
    {"name": "辽东郡", "controller": "gongsun_liaodong", "strength": "core"},
    {"name": "玄菟郡", "controller": "gongsun_liaodong", "strength": "weak"},
    {"name": "乐浪郡", "controller": "gongsun_liaodong", "strength": "core"},
    {"name": "带方郡", "controller": "gongsun_liaodong", "strength": "weak"},
    {"name": "苍梧郡", "controller": "shixie", "strength": "weak"},
    {"name": "郁林郡", "controller": "shixie", "strength": "weak"},
    {"name": "日南郡", "controller": "shixie", "strength": "weak"}
  ],
  "capitals": [
    {"faction": "cao", "city": "许", "lng": 113.85, "lat": 34.03},
    {"faction": "cao", "city": "邺", "lng": 114.35, "lat": 36.33},
    {"faction": "liubei", "city": "公安", "lng": 112.23, "lat": 30.06},
    {"faction": "sun", "city": "吴县", "lng": 120.62, "lat": 31.30},
    {"faction": "liuzhang", "city": "成都", "lng": 104.06, "lat": 30.67},
    {"faction": "zhanglu", "city": "南郑", "lng": 106.94, "lat": 33.07},
    {"faction": "liang", "city": "冀县", "lng": 105.34, "lat": 34.74},
    {"faction": "gongsun_liaodong", "city": "襄平", "lng": 123.17, "lat": 41.27},
    {"faction": "shixie", "city": "龙编", "lng": 105.85, "lat": 21.03}
  ],
  "sources": [
    "《三国志·周瑜传》《鲁肃传》《先主传》《吴主传》",
    "《三国志·武帝纪》建安十三至十四年",
    "《资治通鉴》卷六十六"
  ]
}
```

荆州默认改记刘备，是因为江南四郡已经归他。南郡、江夏和荆北三郡都在 overrides 里，不会被这个默认误涂。孙权的后方仍在吴县；周瑜在江陵是前线太守，不是孙氏都城。

---

## 210 年冬：南郡交给刘备之后

建安十五年周瑜死。鲁肃劝孙权把南郡让给刘备，共同防曹操。刘备从公安进驻江陵，并分置宜都；孙权分长沙北部置汉昌，由鲁肃驻守，又分豫章置鄱阳。交州士燮大约从此向孙权称臣、送质子，郡仍由士家治理。“借荆州”借的是南郡，不是江南四郡。四郡是刘备自己打下的。此帧补在 209 与 211 之间，否则 211 年的荆州会少掉这次易手。

```json
{
  "year": 210,
  "month": 12,
  "label": "孙权以南郡给刘备后",
  "provinces": [
    {"province": "司隶", "controller": "cao", "strength": "core"},
    {"province": "豫州", "controller": "cao", "strength": "core"},
    {"province": "冀州", "controller": "cao", "strength": "core"},
    {"province": "兖州", "controller": "cao", "strength": "core"},
    {"province": "徐州", "controller": "cao", "strength": "core"},
    {"province": "青州", "controller": "cao", "strength": "core"},
    {"province": "荆州", "controller": "liubei", "strength": "core"},
    {"province": "扬州", "controller": "sun", "strength": "core"},
    {"province": "益州", "controller": "liuzhang", "strength": "core"},
    {"province": "凉州", "controller": "liang", "strength": "weak"},
    {"province": "并州", "controller": "cao", "strength": "core"},
    {"province": "幽州", "controller": "cao", "strength": "core"},
    {"province": "交州", "controller": "shixie", "strength": "core"}
  ],
  "overrides": [
    {"name": "京兆尹", "controller": "liang", "strength": "contested", "contenders": ["cao"]},
    {"name": "左冯翊", "controller": "liang", "strength": "contested", "contenders": ["cao"]},
    {"name": "右扶风", "controller": "liang", "strength": "contested", "contenders": ["cao"]},
    {"name": "广陵郡", "controller": "cao", "strength": "weak"},
    {"name": "南阳郡", "controller": "cao", "strength": "core"},
    {"name": "襄阳郡", "controller": "cao", "strength": "core"},
    {"name": "南乡郡", "controller": "cao", "strength": "core"},
    {"name": "南郡", "controller": "liubei", "strength": "core", "note": "周瑜死后鲁肃建议把南郡给刘备。江陵成为刘备荆州治所。后世称为借荆州"},
    {"name": "宜都郡", "controller": "liubei", "strength": "core", "note": "分南郡置，约在得南郡之后"},
    {"name": "江夏郡", "controller": "sun", "strength": "contested", "contenders": ["cao"], "note": "江南属孙权，江北属曹操。刘备不再是第三方太守"},
    {"name": "汉昌郡", "controller": "sun", "strength": "core", "note": "分长沙北境，鲁肃驻此，与关羽邻接"},
    {"name": "九江郡", "controller": "cao", "strength": "core"},
    {"name": "新都郡", "controller": "sun", "strength": "weak"},
    {"name": "汉中郡", "controller": "zhanglu", "strength": "core"},
    {"name": "巴西郡", "controller": "liuzhang", "strength": "weak"},
    {"name": "益州郡", "controller": "liuzhang", "strength": "weak"},
    {"name": "永昌郡", "controller": "liuzhang", "strength": "weak"},
    {"name": "越巂郡", "controller": "liuzhang", "strength": "weak"},
    {"name": "牂柯郡", "controller": "liuzhang", "strength": "weak"},
    {"name": "广汉属国", "controller": "liuzhang", "strength": "weak"},
    {"name": "蜀郡属国", "controller": "liuzhang", "strength": "weak"},
    {"name": "犍为属国", "controller": "liuzhang", "strength": "weak"},
    {"name": "北地郡", "controller": null, "strength": "lost"},
    {"name": "汉阳郡", "controller": "liang", "strength": "core"},
    {"name": "陇西郡", "controller": "liang", "strength": "core"},
    {"name": "金城郡", "controller": "liang", "strength": "core"},
    {"name": "武都郡", "controller": "liang", "strength": "weak"},
    {"name": "上郡", "controller": null, "strength": "lost"},
    {"name": "西河郡", "controller": null, "strength": "lost"},
    {"name": "五原郡", "controller": null, "strength": "lost"},
    {"name": "云中郡", "controller": null, "strength": "lost"},
    {"name": "定襄郡", "controller": null, "strength": "lost"},
    {"name": "朔方郡", "controller": null, "strength": "lost"},
    {"name": "雁门郡", "controller": "cao", "strength": "weak"},
    {"name": "代郡", "controller": "cao", "strength": "weak"},
    {"name": "上谷郡", "controller": "cao", "strength": "weak"},
    {"name": "右北平郡", "controller": "cao", "strength": "weak"},
    {"name": "辽西郡", "controller": "cao", "strength": "weak"},
    {"name": "辽东属国", "controller": "cao", "strength": "weak"},
    {"name": "辽东郡", "controller": "gongsun_liaodong", "strength": "core"},
    {"name": "玄菟郡", "controller": "gongsun_liaodong", "strength": "weak"},
    {"name": "乐浪郡", "controller": "gongsun_liaodong", "strength": "core"},
    {"name": "带方郡", "controller": "gongsun_liaodong", "strength": "weak"},
    {"name": "交趾郡", "controller": "shixie", "strength": "core", "note": "约建安十五年士燮向孙权称臣，内政仍属士氏"},
    {"name": "合浦郡", "controller": "shixie", "strength": "core", "note": "士壹等士氏兄弟"},
    {"name": "九真郡", "controller": "shixie", "strength": "core", "note": "士氏"},
    {"name": "南海郡", "controller": "shixie", "strength": "core", "note": "士氏。孙权所置交州刺史步骘约在此年南下，未能取代士燮"},
    {"name": "苍梧郡", "controller": "shixie", "strength": "weak"},
    {"name": "郁林郡", "controller": "shixie", "strength": "weak"},
    {"name": "日南郡", "controller": "shixie", "strength": "weak"}
  ],
  "capitals": [
    {"faction": "cao", "city": "许", "lng": 113.85, "lat": 34.03},
    {"faction": "cao", "city": "邺", "lng": 114.35, "lat": 36.33},
    {"faction": "liubei", "city": "江陵", "lng": 112.19, "lat": 30.35},
    {"faction": "sun", "city": "吴县", "lng": 120.62, "lat": 31.30},
    {"faction": "liuzhang", "city": "成都", "lng": 104.06, "lat": 30.67},
    {"faction": "zhanglu", "city": "南郑", "lng": 106.94, "lat": 33.07},
    {"faction": "liang", "city": "冀县", "lng": 105.34, "lat": 34.74},
    {"faction": "gongsun_liaodong", "city": "襄平", "lng": 123.17, "lat": 41.27},
    {"faction": "shixie", "city": "龙编", "lng": 105.85, "lat": 21.03}
  ],
  "sources": [
    "《三国志·鲁肃传》《周瑜传》《先主传》",
    "《三国志·士燮传》《步骘传》",
    "《资治通鉴》卷六十六",
    "田余庆《秦汉魏晋史探微》中关于孙吴与荆州的讨论"
  ]
}
```

---

## 211 年秋：潼关之后、刘备入蜀之前

建安十六年春，曹操以征张鲁为名进兵关中，马超、韩遂等七月在潼关抗拒，秋天战败，退回陇右。关中三辅从此归曹操。刘备被刘璋请来防张鲁，是这年冬天的事。本帧放在九月：潼关已分胜负，刘备还没有进入益州。孙权这年把治所迁到秣陵，次年改名建业、修石头城。荆州仍由关羽留守的格局要到刘备入蜀之后才完全形成；九月时刘备本人还在江陵一线。

```json
{
  "year": 211,
  "month": 9,
  "label": "潼关之战后、刘备入蜀前",
  "provinces": [
    {"province": "司隶", "controller": "cao", "strength": "core"},
    {"province": "豫州", "controller": "cao", "strength": "core"},
    {"province": "冀州", "controller": "cao", "strength": "core"},
    {"province": "兖州", "controller": "cao", "strength": "core"},
    {"province": "徐州", "controller": "cao", "strength": "core"},
    {"province": "青州", "controller": "cao", "strength": "core"},
    {"province": "荆州", "controller": "liubei", "strength": "core"},
    {"province": "扬州", "controller": "sun", "strength": "core"},
    {"province": "益州", "controller": "liuzhang", "strength": "core"},
    {"province": "凉州", "controller": "liang", "strength": "weak"},
    {"province": "并州", "controller": "cao", "strength": "core"},
    {"province": "幽州", "controller": "cao", "strength": "core"},
    {"province": "交州", "controller": "shixie", "strength": "core"}
  ],
  "overrides": [
    {"name": "广陵郡", "controller": "cao", "strength": "weak"},
    {"name": "南阳郡", "controller": "cao", "strength": "core"},
    {"name": "襄阳郡", "controller": "cao", "strength": "core"},
    {"name": "南乡郡", "controller": "cao", "strength": "core"},
    {"name": "南郡", "controller": "liubei", "strength": "core", "note": "自 210 年起由刘备驻江陵"},
    {"name": "宜都郡", "controller": "liubei", "strength": "core"},
    {"name": "江夏郡", "controller": "sun", "strength": "contested", "contenders": ["cao"]},
    {"name": "汉昌郡", "controller": "sun", "strength": "core"},
    {"name": "九江郡", "controller": "cao", "strength": "core"},
    {"name": "新都郡", "controller": "sun", "strength": "weak"},
    {"name": "汉中郡", "controller": "zhanglu", "strength": "core", "note": "曹操尚未进兵。马超败后将投张鲁"},
    {"name": "江阳郡", "controller": "liuzhang", "strength": "core", "note": "刘璋分犍为置"},
    {"name": "巴西郡", "controller": "liuzhang", "strength": "weak", "note": "对张鲁"},
    {"name": "益州郡", "controller": "liuzhang", "strength": "weak"},
    {"name": "永昌郡", "controller": "liuzhang", "strength": "weak"},
    {"name": "越巂郡", "controller": "liuzhang", "strength": "weak"},
    {"name": "牂柯郡", "controller": "liuzhang", "strength": "weak"},
    {"name": "广汉属国", "controller": "liuzhang", "strength": "weak"},
    {"name": "蜀郡属国", "controller": "liuzhang", "strength": "weak"},
    {"name": "犍为属国", "controller": "liuzhang", "strength": "weak"},
    {"name": "新平郡", "controller": "cao", "strength": "core", "note": "地在扶风、安定之间，潼关战后随三辅归曹操"},
    {"name": "安定郡", "controller": "liang", "strength": "contested", "contenders": ["cao"], "note": "陇东门户，韩遂、马超败退经过，曹操尚未深入陇右"},
    {"name": "北地郡", "controller": null, "strength": "lost"},
    {"name": "汉阳郡", "controller": "liang", "strength": "core", "note": "马超、韩遂退回陇右"},
    {"name": "陇西郡", "controller": "liang", "strength": "core"},
    {"name": "金城郡", "controller": "liang", "strength": "core"},
    {"name": "武都郡", "controller": "liang", "strength": "weak"},
    {"name": "上郡", "controller": null, "strength": "lost"},
    {"name": "西河郡", "controller": null, "strength": "lost"},
    {"name": "五原郡", "controller": null, "strength": "lost"},
    {"name": "云中郡", "controller": null, "strength": "lost"},
    {"name": "定襄郡", "controller": null, "strength": "lost"},
    {"name": "朔方郡", "controller": null, "strength": "lost"},
    {"name": "雁门郡", "controller": "cao", "strength": "weak"},
    {"name": "代郡", "controller": "cao", "strength": "weak"},
    {"name": "上谷郡", "controller": "cao", "strength": "weak"},
    {"name": "右北平郡", "controller": "cao", "strength": "weak"},
    {"name": "辽西郡", "controller": "cao", "strength": "weak"},
    {"name": "辽东属国", "controller": "cao", "strength": "weak"},
    {"name": "辽东郡", "controller": "gongsun_liaodong", "strength": "core"},
    {"name": "玄菟郡", "controller": "gongsun_liaodong", "strength": "weak"},
    {"name": "乐浪郡", "controller": "gongsun_liaodong", "strength": "core"},
    {"name": "带方郡", "controller": "gongsun_liaodong", "strength": "weak"},
    {"name": "交趾郡", "controller": "shixie", "strength": "core", "note": "名义上属孙权，内政属士燮"},
    {"name": "合浦郡", "controller": "shixie", "strength": "core"},
    {"name": "九真郡", "controller": "shixie", "strength": "core"},
    {"name": "南海郡", "controller": "shixie", "strength": "core"},
    {"name": "苍梧郡", "controller": "shixie", "strength": "weak"},
    {"name": "郁林郡", "controller": "shixie", "strength": "weak"},
    {"name": "日南郡", "controller": "shixie", "strength": "weak"}
  ],
  "capitals": [
    {"faction": "cao", "city": "许", "lng": 113.85, "lat": 34.03},
    {"faction": "cao", "city": "邺", "lng": 114.35, "lat": 36.33},
    {"faction": "liubei", "city": "江陵", "lng": 112.19, "lat": 30.35},
    {"faction": "sun", "city": "建业", "lng": 118.79, "lat": 32.06},
    {"faction": "liuzhang", "city": "成都", "lng": 104.06, "lat": 30.67},
    {"faction": "zhanglu", "city": "南郑", "lng": 106.94, "lat": 33.07},
    {"faction": "liang", "city": "冀县", "lng": 105.34, "lat": 34.74},
    {"faction": "gongsun_liaodong", "city": "襄平", "lng": 123.17, "lat": 41.27},
    {"faction": "shixie", "city": "龙编", "lng": 105.85, "lat": 21.03}
  ],
  "sources": [
    "《三国志·武帝纪》建安十六年",
    "《三国志·马超传》《先主传》《吴主传》",
    "《资治通鉴》卷六十六"
  ]
}
```

京兆尹、左冯翊、右扶风这年秋天起随司隶默认，归曹操，所以不再出现在 overrides。曹操本人这年在关中督战，许和邺仍是常设的都城与王业根本，不把长安写成新都。

---

## 214 年夏：刘备取成都之后

建安十九年夏，刘备围下成都，刘璋投降，益州内地改属刘备。马超从张鲁那边转投刘备，参加了成都围城。同一时期夏侯渊灭宋建，陇右汉阳、陇西、金城转入曹操，河西四郡仍弱。张鲁还在汉中。荆州没有大的易手，关羽守江陵。孙权与曹操在淮南的合肥、濡须拉锯，不改变郡的归属：九江仍是曹操，庐江仍是孙权。

```json
{
  "year": 214,
  "month": 6,
  "label": "刘备取成都后",
  "provinces": [
    {"province": "司隶", "controller": "cao", "strength": "core"},
    {"province": "豫州", "controller": "cao", "strength": "core"},
    {"province": "冀州", "controller": "cao", "strength": "core"},
    {"province": "兖州", "controller": "cao", "strength": "core"},
    {"province": "徐州", "controller": "cao", "strength": "core"},
    {"province": "青州", "controller": "cao", "strength": "core"},
    {"province": "荆州", "controller": "liubei", "strength": "core"},
    {"province": "扬州", "controller": "sun", "strength": "core"},
    {"province": "益州", "controller": "liubei", "strength": "core"},
    {"province": "凉州", "controller": "cao", "strength": "weak"},
    {"province": "并州", "controller": "cao", "strength": "core"},
    {"province": "幽州", "controller": "cao", "strength": "core"},
    {"province": "交州", "controller": "shixie", "strength": "core"}
  ],
  "overrides": [
    {"name": "广陵郡", "controller": "cao", "strength": "weak"},
    {"name": "南阳郡", "controller": "cao", "strength": "core"},
    {"name": "襄阳郡", "controller": "cao", "strength": "core"},
    {"name": "南乡郡", "controller": "cao", "strength": "core"},
    {"name": "南郡", "controller": "liubei", "strength": "core", "note": "关羽守江陵"},
    {"name": "宜都郡", "controller": "liubei", "strength": "core"},
    {"name": "江夏郡", "controller": "sun", "strength": "contested", "contenders": ["cao"]},
    {"name": "汉昌郡", "controller": "sun", "strength": "core"},
    {"name": "九江郡", "controller": "cao", "strength": "core", "note": "张辽守合肥。濡须是江边战役，不是郡界改属"},
    {"name": "蕲春郡", "controller": "sun", "strength": "weak", "note": "孙权分江夏东境置，约在建安十八年以前。本帧起列入"},
    {"name": "新都郡", "controller": "sun", "strength": "weak"},
    {"name": "汉中郡", "controller": "zhanglu", "strength": "core", "note": "张鲁仍在。马超已经离开，投刘备"},
    {"name": "涪陵郡", "controller": "liubei", "strength": "weak", "note": "刘备分巴郡置，边郡"},
    {"name": "汶山郡", "controller": "liubei", "strength": "weak", "note": "复置。羌人在郡境"},
    {"name": "江阳郡", "controller": "liubei", "strength": "core"},
    {"name": "巴西郡", "controller": "liubei", "strength": "weak", "note": "仍是对汉中的前线"},
    {"name": "益州郡", "controller": "liubei", "strength": "weak", "note": "南中只是名义归属，223 年雍闿等人才公开反叛"},
    {"name": "永昌郡", "controller": "liubei", "strength": "weak"},
    {"name": "越巂郡", "controller": "liubei", "strength": "weak"},
    {"name": "牂柯郡", "controller": "liubei", "strength": "weak"},
    {"name": "广汉属国", "controller": "liubei", "strength": "weak", "note": "氐"},
    {"name": "蜀郡属国", "controller": "liubei", "strength": "weak"},
    {"name": "犍为属国", "controller": "liubei", "strength": "weak"},
    {"name": "汉阳郡", "controller": "cao", "strength": "core", "note": "夏侯渊平陇右"},
    {"name": "陇西郡", "controller": "cao", "strength": "core", "note": "宋建死于枹罕"},
    {"name": "金城郡", "controller": "cao", "strength": "weak", "note": "韩遂残部未尽，约次年才完全平息"},
    {"name": "安定郡", "controller": "cao", "strength": "weak"},
    {"name": "武都郡", "controller": "cao", "strength": "weak", "note": "氐人未服。后来曹操徙武都氐"},
    {"name": "北地郡", "controller": null, "strength": "lost"},
    {"name": "上郡", "controller": null, "strength": "lost"},
    {"name": "西河郡", "controller": null, "strength": "lost"},
    {"name": "五原郡", "controller": null, "strength": "lost"},
    {"name": "云中郡", "controller": null, "strength": "lost"},
    {"name": "定襄郡", "controller": null, "strength": "lost"},
    {"name": "朔方郡", "controller": null, "strength": "lost"},
    {"name": "雁门郡", "controller": "cao", "strength": "weak"},
    {"name": "代郡", "controller": "cao", "strength": "weak"},
    {"name": "上谷郡", "controller": "cao", "strength": "weak"},
    {"name": "右北平郡", "controller": "cao", "strength": "weak"},
    {"name": "辽西郡", "controller": "cao", "strength": "weak"},
    {"name": "辽东属国", "controller": "cao", "strength": "weak"},
    {"name": "辽东郡", "controller": "gongsun_liaodong", "strength": "core"},
    {"name": "玄菟郡", "controller": "gongsun_liaodong", "strength": "weak"},
    {"name": "乐浪郡", "controller": "gongsun_liaodong", "strength": "core"},
    {"name": "带方郡", "controller": "gongsun_liaodong", "strength": "weak"},
    {"name": "交趾郡", "controller": "shixie", "strength": "core", "note": "称臣于孙权"},
    {"name": "合浦郡", "controller": "shixie", "strength": "core"},
    {"name": "九真郡", "controller": "shixie", "strength": "core"},
    {"name": "南海郡", "controller": "shixie", "strength": "core"},
    {"name": "苍梧郡", "controller": "shixie", "strength": "weak"},
    {"name": "郁林郡", "controller": "shixie", "strength": "weak"},
    {"name": "日南郡", "controller": "shixie", "strength": "weak"}
  ],
  "capitals": [
    {"faction": "cao", "city": "许", "lng": 113.85, "lat": 34.03},
    {"faction": "cao", "city": "邺", "lng": 114.35, "lat": 36.33},
    {"faction": "liubei", "city": "成都", "lng": 104.06, "lat": 30.67},
    {"faction": "liubei", "city": "江陵", "lng": 112.19, "lat": 30.35},
    {"faction": "sun", "city": "建业", "lng": 118.79, "lat": 32.06},
    {"faction": "zhanglu", "city": "南郑", "lng": 106.94, "lat": 33.07},
    {"faction": "gongsun_liaodong", "city": "襄平", "lng": 123.17, "lat": 41.27},
    {"faction": "shixie", "city": "龙编", "lng": 105.85, "lat": 21.03}
  ],
  "sources": [
    "《三国志·先主传》建安十九年",
    "《三国志·武帝纪》《夏侯渊传》《张鲁传》",
    "《华阳国志·公孙述刘二牧志》",
    "《资治通鉴》卷六十七"
  ]
}
```

刘备有两处落点：成都是新的根本，江陵是荆州前线。凉州诸将不再单列都城。刘璋被迁出成都，不再是一股势力。

---

## 215 年冬：曹操得汉中、孙刘以湘水为界

建安二十年，曹操打下汉中，十一月张鲁出降，被迁到内地，汉中由夏侯渊镇守。曹操把汉中百姓大量北迁，所以郡虽在手，人户很虚。张郃一度攻入巴地，被张飞挡住，巴西仍属刘备。同一年孙权索要荆州，吕蒙取得长沙、桂阳，并一度进入零陵；刘备因汉中告急而求和。约定：湘水以东的长沙、江夏、桂阳归孙权，湘水以西的南郡、零陵、武陵归刘备。零陵在约定之后交还刘备。曹操文书上省并云中等四郡为新兴郡，新兴在今山西忻定一带，不是把河套涂成曹魏领土。

```json
{
  "year": 215,
  "month": 11,
  "label": "曹操取汉中、湘水划界",
  "provinces": [
    {"province": "司隶", "controller": "cao", "strength": "core"},
    {"province": "豫州", "controller": "cao", "strength": "core"},
    {"province": "冀州", "controller": "cao", "strength": "core"},
    {"province": "兖州", "controller": "cao", "strength": "core"},
    {"province": "徐州", "controller": "cao", "strength": "core"},
    {"province": "青州", "controller": "cao", "strength": "core"},
    {"province": "荆州", "controller": "liubei", "strength": "core"},
    {"province": "扬州", "controller": "sun", "strength": "core"},
    {"province": "益州", "controller": "liubei", "strength": "core"},
    {"province": "凉州", "controller": "cao", "strength": "weak"},
    {"province": "并州", "controller": "cao", "strength": "core"},
    {"province": "幽州", "controller": "cao", "strength": "core"},
    {"province": "交州", "controller": "shixie", "strength": "core"}
  ],
  "overrides": [
    {"name": "广陵郡", "controller": "cao", "strength": "weak"},
    {"name": "南阳郡", "controller": "cao", "strength": "core"},
    {"name": "襄阳郡", "controller": "cao", "strength": "core"},
    {"name": "南乡郡", "controller": "cao", "strength": "core"},
    {"name": "南郡", "controller": "liubei", "strength": "core", "note": "湘水之西，关羽"},
    {"name": "宜都郡", "controller": "liubei", "strength": "core", "note": "在南郡以西，随刘备"},
    {"name": "武陵郡", "controller": "liubei", "strength": "core", "note": "湘水之西"},
    {"name": "零陵郡", "controller": "liubei", "strength": "core", "note": "吕蒙曾攻下，和议后交还刘备"},
    {"name": "长沙郡", "controller": "sun", "strength": "core", "note": "湘水以东。郡西境有些县在湘水西，郡级仍整郡归孙权"},
    {"name": "桂阳郡", "controller": "sun", "strength": "core", "note": "湘水以东"},
    {"name": "汉昌郡", "controller": "sun", "strength": "core", "note": "本在长沙北，划界后仍属孙权"},
    {"name": "江夏郡", "controller": "sun", "strength": "contested", "contenders": ["cao"], "note": "盟约把刘备名下的江夏划给孙权；曹操的江北部分不在盟约内"},
    {"name": "九江郡", "controller": "cao", "strength": "core"},
    {"name": "蕲春郡", "controller": "sun", "strength": "weak"},
    {"name": "新都郡", "controller": "sun", "strength": "weak"},
    {"name": "汉中郡", "controller": "cao", "strength": "weak", "note": "张鲁十一月降。曹操徙民于长安、三辅，夏侯渊留守，人户空虚"},
    {"name": "巴西郡", "controller": "liubei", "strength": "core", "note": "张郃入侵，张飞在瓦口一线击退，郡仍属刘备"},
    {"name": "涪陵郡", "controller": "liubei", "strength": "weak"},
    {"name": "汶山郡", "controller": "liubei", "strength": "weak"},
    {"name": "益州郡", "controller": "liubei", "strength": "weak"},
    {"name": "永昌郡", "controller": "liubei", "strength": "weak"},
    {"name": "越巂郡", "controller": "liubei", "strength": "weak"},
    {"name": "牂柯郡", "controller": "liubei", "strength": "weak"},
    {"name": "广汉属国", "controller": "liubei", "strength": "weak"},
    {"name": "蜀郡属国", "controller": "liubei", "strength": "weak"},
    {"name": "犍为属国", "controller": "liubei", "strength": "weak"},
    {"name": "新兴郡", "controller": "cao", "strength": "core", "note": "安置云中等四郡遗民，治所在并州腹地，不是河套"},
    {"name": "西平郡", "controller": "cao", "strength": "weak", "note": "约建安末分金城置。若置年晚于 215，本帧可暂不画"},
    {"name": "武都郡", "controller": "cao", "strength": "weak", "note": "氐"},
    {"name": "北地郡", "controller": null, "strength": "lost"},
    {"name": "金城郡", "controller": "cao", "strength": "weak", "note": "韩遂已死，羌人仍反复"},
    {"name": "上郡", "controller": null, "strength": "lost", "note": "建安二十年前后正式放弃旧地"},
    {"name": "西河郡", "controller": null, "strength": "lost"},
    {"name": "五原郡", "controller": null, "strength": "lost", "note": "行政已省，旧地勿并入新兴郡上色"},
    {"name": "云中郡", "controller": null, "strength": "lost", "note": "行政已省，旧地仍为鲜卑、匈奴活动区"},
    {"name": "定襄郡", "controller": null, "strength": "lost", "note": "行政已省"},
    {"name": "朔方郡", "controller": null, "strength": "lost", "note": "行政已省"},
    {"name": "雁门郡", "controller": "cao", "strength": "weak"},
    {"name": "代郡", "controller": "cao", "strength": "weak"},
    {"name": "上谷郡", "controller": "cao", "strength": "weak"},
    {"name": "右北平郡", "controller": "cao", "strength": "weak"},
    {"name": "辽西郡", "controller": "cao", "strength": "weak"},
    {"name": "辽东属国", "controller": "cao", "strength": "weak"},
    {"name": "辽东郡", "controller": "gongsun_liaodong", "strength": "core"},
    {"name": "玄菟郡", "controller": "gongsun_liaodong", "strength": "weak"},
    {"name": "乐浪郡", "controller": "gongsun_liaodong", "strength": "core"},
    {"name": "带方郡", "controller": "gongsun_liaodong", "strength": "weak"},
    {"name": "交趾郡", "controller": "shixie", "strength": "core"},
    {"name": "合浦郡", "controller": "shixie", "strength": "core"},
    {"name": "九真郡", "controller": "shixie", "strength": "core"},
    {"name": "南海郡", "controller": "shixie", "strength": "core"},
    {"name": "苍梧郡", "controller": "shixie", "strength": "weak"},
    {"name": "郁林郡", "controller": "shixie", "strength": "weak"},
    {"name": "日南郡", "controller": "shixie", "strength": "weak"}
  ],
  "capitals": [
    {"faction": "cao", "city": "许", "lng": 113.85, "lat": 34.03},
    {"faction": "cao", "city": "邺", "lng": 114.35, "lat": 36.33},
    {"faction": "liubei", "city": "成都", "lng": 104.06, "lat": 30.67},
    {"faction": "liubei", "city": "江陵", "lng": 112.19, "lat": 30.35},
    {"faction": "sun", "city": "建业", "lng": 118.79, "lat": 32.06},
    {"faction": "gongsun_liaodong", "city": "襄平", "lng": 123.17, "lat": 41.27},
    {"faction": "shixie", "city": "龙编", "lng": 105.85, "lat": 21.03}
  ],
  "sources": [
    "《三国志·武帝纪》建安二十年",
    "《三国志·张鲁传》《张飞传》《先主传》《吕蒙传》《鲁肃传》",
    "《资治通鉴》卷六十七",
    "《晋书·地理志》新兴郡"
  ]
}
```

张鲁降后不再标南郑。汉中是曹操的郡，不是他的都城。

---

## 219 年十二月：汉中王与荆州易手

建安二十四年正月，黄忠在定军山斩夏侯渊。五月曹操退出汉中，刘备占有汉中郡。七月刘备在沔阳称汉中王，随后回成都，留魏延守汉中。秋天关羽北伐，水淹七军，围樊城，但没有打下襄阳。吕蒙白衣渡江，取江陵、公安。十二月关羽在临沮被擒杀。荆州长江以南因此全归孙权。汉中东边的房陵、上庸、西城在这年末到次年春之间随孟达倒向曹操，本帧按年末已倒过去、但还不稳定来画。南阳在这年春天发生过侯音叛乱，很快被平定，年末仍属曹操。

```json
{
  "year": 219,
  "month": 12,
  "label": "刘备称汉中王、关羽败亡",
  "provinces": [
    {"province": "司隶", "controller": "cao", "strength": "core"},
    {"province": "豫州", "controller": "cao", "strength": "core"},
    {"province": "冀州", "controller": "cao", "strength": "core"},
    {"province": "兖州", "controller": "cao", "strength": "core"},
    {"province": "徐州", "controller": "cao", "strength": "core"},
    {"province": "青州", "controller": "cao", "strength": "core"},
    {"province": "荆州", "controller": "sun", "strength": "core"},
    {"province": "扬州", "controller": "sun", "strength": "core"},
    {"province": "益州", "controller": "liubei", "strength": "core"},
    {"province": "凉州", "controller": "cao", "strength": "weak"},
    {"province": "并州", "controller": "cao", "strength": "core"},
    {"province": "幽州", "controller": "cao", "strength": "core"},
    {"province": "交州", "controller": "shixie", "strength": "core"}
  ],
  "overrides": [
    {"name": "广陵郡", "controller": "cao", "strength": "weak"},
    {"name": "南阳郡", "controller": "cao", "strength": "core", "note": "春侯音叛，曹仁等平定。秋关羽北上未入此郡"},
    {"name": "襄阳郡", "controller": "cao", "strength": "core", "note": "关羽围樊城在襄阳北，岁末徐晃解围，郡仍属曹操"},
    {"name": "南乡郡", "controller": "cao", "strength": "core"},
    {"name": "南郡", "controller": "sun", "strength": "core", "note": "吕蒙取江陵。糜芳、士仁降"},
    {"name": "宜都郡", "controller": "sun", "strength": "core", "note": "随荆州江南一并易手"},
    {"name": "江夏郡", "controller": "sun", "strength": "contested", "contenders": ["cao"], "note": "江南归孙权已无刘备份额；江北仍是文聘"},
    {"name": "武陵郡", "controller": "sun", "strength": "weak", "note": "关羽败后归孙权，当地蛮部并未立刻顺服"},
    {"name": "零陵郡", "controller": "sun", "strength": "core"},
    {"name": "长沙郡", "controller": "sun", "strength": "core"},
    {"name": "桂阳郡", "controller": "sun", "strength": "core"},
    {"name": "汉昌郡", "controller": "sun", "strength": "core"},
    {"name": "九江郡", "controller": "cao", "strength": "core"},
    {"name": "蕲春郡", "controller": "sun", "strength": "contested", "contenders": ["cao"], "note": "蕲春太守晋宗约在建安末叛降曹操，贺齐后来又打回来。219 年末谁在城内，文献不够精确"},
    {"name": "新都郡", "controller": "sun", "strength": "weak"},
    {"name": "汉中郡", "controller": "liubei", "strength": "core", "note": "五月曹操撤出，七月刘备称汉中王，魏延为太守"},
    {"name": "房陵郡", "controller": "cao", "strength": "contested", "contenders": ["liubei"], "note": "孟达降曹约在建安二十四年末至延康元年初。本帧按年末已倒向曹操，尚未稳定设治"},
    {"name": "上庸郡", "controller": "cao", "strength": "contested", "contenders": ["liubei"], "note": "申耽随孟达之事摇摆，年末倾向曹操，次年初才稳定"},
    {"name": "西城郡", "controller": "cao", "strength": "contested", "contenders": ["liubei"], "note": "同房陵。改名魏兴、合三郡为新城，是 220 年曹丕时的建制"},
    {"name": "梓潼郡", "controller": "liubei", "strength": "core", "note": "约建安二十二年分广汉置"},
    {"name": "宕渠郡", "controller": "liubei", "strength": "weak", "note": "建安二十三年分巴西置，不久即省。若地图不画短命郡，可并回巴西"},
    {"name": "涪陵郡", "controller": "liubei", "strength": "weak"},
    {"name": "汶山郡", "controller": "liubei", "strength": "weak"},
    {"name": "益州郡", "controller": "liubei", "strength": "weak"},
    {"name": "永昌郡", "controller": "liubei", "strength": "weak"},
    {"name": "越巂郡", "controller": "liubei", "strength": "weak"},
    {"name": "牂柯郡", "controller": "liubei", "strength": "weak"},
    {"name": "广汉属国", "controller": "liubei", "strength": "weak"},
    {"name": "蜀郡属国", "controller": "liubei", "strength": "weak"},
    {"name": "犍为属国", "controller": "liubei", "strength": "weak"},
    {"name": "新兴郡", "controller": "cao", "strength": "core"},
    {"name": "乐平郡", "controller": "cao", "strength": "core", "note": "建安二十一年分常山、上党置"},
    {"name": "西平郡", "controller": "cao", "strength": "weak"},
    {"name": "武都郡", "controller": "cao", "strength": "weak", "note": "建安二十四年曹操徙氐人于天水、扶风，郡更空"},
    {"name": "北地郡", "controller": null, "strength": "lost"},
    {"name": "上郡", "controller": null, "strength": "lost"},
    {"name": "西河郡", "controller": null, "strength": "lost", "note": "建安二十一年南匈奴分为五部，安置在并州塞内，不是恢复西河旧地"},
    {"name": "五原郡", "controller": null, "strength": "lost"},
    {"name": "云中郡", "controller": null, "strength": "lost"},
    {"name": "定襄郡", "controller": null, "strength": "lost"},
    {"name": "朔方郡", "controller": null, "strength": "lost"},
    {"name": "雁门郡", "controller": "cao", "strength": "weak"},
    {"name": "代郡", "controller": "cao", "strength": "weak", "note": "鲜卑轲比能此时已强，代郡、上谷屡被寇"},
    {"name": "上谷郡", "controller": "cao", "strength": "weak"},
    {"name": "右北平郡", "controller": "cao", "strength": "weak"},
    {"name": "辽西郡", "controller": "cao", "strength": "weak"},
    {"name": "辽东属国", "controller": "cao", "strength": "weak"},
    {"name": "辽东郡", "controller": "gongsun_liaodong", "strength": "core", "note": "公孙康约在建安末死，公孙恭继立。219 年仍是公孙氏"},
    {"name": "玄菟郡", "controller": "gongsun_liaodong", "strength": "weak"},
    {"name": "乐浪郡", "controller": "gongsun_liaodong", "strength": "core"},
    {"name": "带方郡", "controller": "gongsun_liaodong", "strength": "weak"},
    {"name": "高凉郡", "controller": "shixie", "strength": "weak", "note": "建安二十三年孙权分合浦置。吏员或由孙氏任命，地面仍在士燮势力内"},
    {"name": "交趾郡", "controller": "shixie", "strength": "core"},
    {"name": "合浦郡", "controller": "shixie", "strength": "core"},
    {"name": "九真郡", "controller": "shixie", "strength": "core"},
    {"name": "南海郡", "controller": "shixie", "strength": "core"},
    {"name": "苍梧郡", "controller": "shixie", "strength": "weak"},
    {"name": "郁林郡", "controller": "shixie", "strength": "weak"},
    {"name": "日南郡", "controller": "shixie", "strength": "weak"}
  ],
  "capitals": [
    {"faction": "cao", "city": "许", "lng": 113.85, "lat": 34.03},
    {"faction": "cao", "city": "邺", "lng": 114.35, "lat": 36.33},
    {"faction": "liubei", "city": "成都", "lng": 104.06, "lat": 30.67},
    {"faction": "sun", "city": "建业", "lng": 118.79, "lat": 32.06},
    {"faction": "gongsun_liaodong", "city": "襄平", "lng": 123.17, "lat": 41.27},
    {"faction": "shixie", "city": "龙编", "lng": 105.85, "lat": 21.03}
  ],
  "sources": [
    "《三国志·武帝纪》《先主传》建安二十四年",
    "《三国志·关羽传》《吕蒙传》《刘封传》《魏延传》",
    "《资治通鉴》卷六十八",
    "《晋书·地理志》"
  ]
}
```

房陵、上庸、西城三郡用 `contested`：年末军事实体已倒向曹操，刘备一方尚未退出记录。刘备称王的祭坛在沔阳（今陕西勉县一带），人随后回成都，所以都城只标成都。

---

## 不确定与争议

1. **借荆州到底借了什么。** 《三国志·鲁肃传》说刘备求都督荆州，鲁肃劝孙权借给他。江南四郡是刘备在 209 年自己接收的，不在“借”的范围内。借的是周瑜打下的南郡。本表因此把 209 年南郡归孙权、210 年起归刘备。有的研究者认为公安驻军说明刘备 209 年已经实控南郡南岸，那只适合在南郡内部再分南北，不适合把整郡提前改色。

2. **江陵落入周瑜的月份。** 曹仁从江陵撤走，在建安十四年，传统系于这年冬天。209 帧用十二月，表示围城已经结束。若把帧放在年初，南郡应仍是曹操与孙权对峙。

3. **江夏分治。** 这是整个时段最不适合“一郡一色”的地方。曹操方面文聘长驻江北（石阳）；孙权方面程普等人在江南（沙羡）；209 年刘备还接收了刘琦的余部。215 年湘水约定里的“江夏归孙权”，只处理孙刘之间的份额，没有把文聘的江北划走。地图若不能把一郡劈开，应使用 `contested`，不要涂成任何一家的 `core`。

4. **湘水是县界，不是整郡刀切。** 《先主传》说长沙、江夏、桂阳以东属孙权，南郡、零陵、武陵以西属刘备。长沙郡有位于湘水西的县。本表按郡级整郡归孙权，县界留待放大图层。零陵在和议前曾被吕蒙占领，215 年十一月的帧按交还之后。

5. **襄阳郡从哪一郡分出。** 郡国志里襄阳县属南阳，不属南郡。本表写“208 年分南阳置襄阳郡、南乡郡”。后来有些地理书写成析自南郡。不管母郡是谁，208 年下半年以后这两郡都在曹操手里，对上色没有影响。章陵郡是刘表所分，置年和辖县都不清，本表不画。

6. **孟达降曹的月份。** 《刘封传》叙事紧接关羽之败，又用“魏文帝”称呼曹丕，容易读成 220 年。通鉴把事变放在建安二十四年末。本表 219 年十二月把房陵、上庸、西城画成已倒向曹操、强度为弱。若采用 220 年说，这三郡在本帧仍应归刘备。改称魏兴、合并为新城，不要画进 219 年。

7. **关羽败亡与年末。** 袭取江陵在建安二十四年秋冬，关羽死于十二月。219 帧若被用在“秋季围樊”的时刻，南郡、宜都仍属刘备，襄阳是 `contested`。本帧明确取十二月，荆南已归孙权，襄阳仍属曹操。

8. **并州北郡与新兴郡。** 《晋书·地理志》说灵帝末定襄、云中、五原、朔方、上郡流散；《武帝纪》说建安二十年省云中、定襄、五原、朔方，合为新兴郡。新兴郡的居民在太原北、雁门南，旧郡土地仍在长城以外。西河郡治在汉末已废，216 年南匈奴五部是塞内编户，不是西河郡复国。上郡旧地不要因为“省入左冯翊”就涂成京畿的 `core`。

9. **205 年并不能叫“四州都平”。** 冀州、青州在破袁谭后归曹操。幽州内地同年归附，辽西要到 207 年。并州高干复叛，206 年才结束。所以 205 帧的并州默认仍是 `yuanshao`，辽西也仍写袁氏残部与乌桓。

10. **关中从名义到到手。** 200 至 211 年秋以前，三辅写凉州诸将与曹操相争，不写曹操 `core`。钟繇的作用是让关中诸将没有东进帮助袁绍，不是已经派太守接管每个县。211 年九月以后三辅随司隶归曹操。陇右要到 214–215 年夏侯渊战役之后。

11. **士燮与孙权。** 210 年以前，交州在汉廷文书上有时有刺史，地面上是士燮家族。约建安十五年士燮向孙权称臣。本表始终用 `shixie` 上色，因为直到士燮 226 年死去，孙氏都没有直接治理各郡。若产品要把“称臣”画成孙权的颜色，应从 210 帧起把交州默认改成 `sun`、强度 `weak`，并在注里保留士燮。两种画法不要混在同一帧里。

12. **带方、西平、蕲春、高凉、梓潼、宕渠的置年。** 带方是公孙康时期，本表从 207 年起算，可能晚几年。西平或晚到黄初。蕲春据《吴书》在建安十八年以前，本表从 213 年起。高凉在 218 年。梓潼约 217 年。宕渠 218 年置、旋废。这些郡漏画或晚画一年，不会改变大势力的范围。

13. **谯郡、弋阳、东安、章陵、城阳、利城、昌虑。** 材料不足以在本时段每一年都稳定标出辖县，本表不进入 JSON。谯、弋阳若被证明建安中已经置郡，应归曹操，从沛国、汝南、江夏划出，不改变州的默认颜色。东安是孙权短命郡，废后回到丹阳。

14. **黑山、黄巾、张绣。** 张燕在官渡前后已接受曹操官号，太行山里没有整郡。汝南黄巾刘辟、龚都在官渡期间响应袁绍，同年被击破，200 帧的汝南随豫州归曹操。张绣 199 年降、207 年死在北征路上，南阳不归 `zhangxiu`。

15. **广陵与江淮。** 广陵在曹孙之间反复被攻，郡治多次迁动，本表全部年份写曹操 `weak`。孙权没有在此稳定设郡。不要画成孙权领土。

16. **建安十八年九州。** 并州、幽州曾被宣布并入冀州，凉州与司隶西部曾被改称雍州。禅代前后又有回调。郡的归属不因此改变。地图州界请继续用十三州，避免 213–219 年出现一块覆盖半个北方的“大冀州”。

17. **与谭图的关系。** 郡的归属按《三国志》《资治通鉴》卷六十三至六十八，《续汉书·郡国志》定名，政区沿革采用李晓杰《东汉政区地理》及《中国行政区划通史·秦汉卷》的通行结论，并对照谭其骧《中国历史地图集》第三册的画法习惯（汉中东三郡、新兴郡不在河套、荆州南北分治）。本次没有逐幅核对谭图扫描件。若谭图某一年的郡界与本表的 `controller` 冲突，以本表注记的史源为准，界线仍以谭图或 CHGIS 的几何为准。

18. **坐标。** 邺用临漳邺城遗址约数。许在今许昌东，不是今天的许昌市中心。龙编在今越南河内附近，误差可能有数十公里。冀县用今甘肃甘谷一带代表马腾的陇右基地，韩遂本人多在金城，没有另标一都。
