# 184–199 年郡级控制关键帧

供地图着色使用。每一帧先用几句话说明当时的格局，接着是一份自包含的 JSON：`provinces` 是州级默认，`overrides` 只写和该州默认不一样的郡国。某郡没有出现在 `overrides` 里，就按所在州的默认上色。

政区名单据《续汉书·郡国志》（约公元 140 年的 105 个郡国）。谭其骧《中国历史地图集》第二册的东汉图是永和五年（140）的界线底图，不能直接当成 184–199 年的势力图。控制判断主要据《后汉书》《三国志》及裴注、《资治通鉴》卷五十八至六十三。

`strength`：`core` 实心稳定控制；`weak` 名义控制、残破或半独立；`contested` 多方争夺，看 `contenders`；`lost` 郡治流徙或被周边人群占据。`lost` 的 `controller` 只表示名分上挂在谁的州里，着色应作废弃或边地，不要涂成实心领地。

坐标是汉晋治所的大致现代位置，常见误差零点二度左右，只供落点，不是考古测绘。`丹杨郡` 即郡国志里的丹阳郡；`勃海郡` 即渤海郡；`甘陵国` 即清河，桓帝以后用甘陵这个名字。

新增势力 ID：

- `minor_hanfu`：韩馥。董卓所署冀州牧，只在 190 年使用，191 年把冀州让给袁绍。
- `minor_kongrong`：孔融。约 190–196 年占北海国，后被袁谭赶走，投曹操。
- `minor_wanglang`：王朗。约 194–196 年领会稽郡，196 年被孙策打败。

`liuzhang` 同时指刘焉（188–194）和刘璋（194 起）。`dong` 在董卓死后指李傕、郭汜一伙。`huangjin` 含白波等余部。`liang` 是马腾、韩遂等凉州诸将，他们彼此也打仗，不是一个整齐的政权。

## 郡国归属（105）

未在某帧单独改写的郡，用该州默认。

- 司隶：河南尹、河内郡、河东郡、弘农郡、京兆尹、左冯翊、右扶风
- 豫州：颍川郡、汝南郡、梁国、沛国、陈国、鲁国
- 冀州：魏郡、巨鹿郡、常山国、中山国、安平国、河间国、甘陵国、赵国、勃海郡
- 兖州：陈留郡、东郡、东平国、任城国、泰山郡、济北国、山阳郡、济阴郡
- 徐州：东海郡、琅邪国、彭城国、广陵郡、下邳国
- 青州：济南国、平原郡、乐安国、北海国、东莱郡、齐国
- 荆州：南阳郡、南郡、江夏郡、零陵郡、桂阳郡、武陵郡、长沙郡
- 扬州：九江郡、丹杨郡、庐江郡、会稽郡、吴郡、豫章郡
- 益州：汉中郡、巴郡、广汉郡、蜀郡、犍为郡、牂柯郡、越巂郡、益州郡、永昌郡、广汉属国、蜀郡属国、犍为属国
- 凉州：陇西郡、汉阳郡、武都郡、金城郡、安定郡、北地郡、武威郡、张掖郡、酒泉郡、敦煌郡、张掖属国、张掖居延属国
- 并州：上党郡、太原郡、上郡、西河郡、五原郡、云中郡、定襄郡、雁门郡、朔方郡
- 幽州：涿郡、广阳郡、代郡、上谷郡、渔阳郡、右北平郡、辽西郡、辽东郡、玄菟郡、乐浪郡、辽东属国
- 交州：南海郡、苍梧郡、郁林郡、合浦郡、交趾郡、九真郡、日南郡

属国和郡一样上色。孙策后来从豫章分出的庐陵郡，地图上仍算在豫章郡里。

为什么比题目多两帧：190 年和 194 年之间，董卓死了、袁绍得到冀州、曹操得到兖州；194 年和 197 年之间，曹操又从吕布手里收回兖州，孙策刚过江。不把 192 年底和 195 年底补上，时间轴会把这些变化涂错。

## 184 年四月：黄巾三面围逼洛阳

东汉朝廷还在，洛阳仍是首都。黄巾在二月同日起事，到四月已经分成几大块：河北张角兄弟守巨鹿一带，颍川波才把官军围在长社，南阳张曼成占着宛城，汝南、陈国、东郡、广阳也都打了起来。安平、甘陵的人抓住了本国王来响应。这还不是新王朝，郡城多半正在拉锯。取四月，是因为三月南阳才杀掉太守、广阳才杀掉刺史，地理格局到这时最清楚；五月长社一战黄巾就开始溃败。凉州大乱要到这年十月才爆发，这一帧里凉州仍算汉朝。

```json
{
  "year": 184,
  "month": 4,
  "label": "黄巾起义爆发",
  "provinces": [
    {"province": "司隶", "controller": "han", "strength": "core"},
    {"province": "豫州", "controller": "han", "strength": "core"},
    {"province": "冀州", "controller": "han", "strength": "core"},
    {"province": "兖州", "controller": "han", "strength": "core"},
    {"province": "徐州", "controller": "han", "strength": "core"},
    {"province": "青州", "controller": "han", "strength": "core"},
    {"province": "荆州", "controller": "han", "strength": "core"},
    {"province": "扬州", "controller": "han", "strength": "core"},
    {"province": "益州", "controller": "han", "strength": "core"},
    {"province": "凉州", "controller": "han", "strength": "core"},
    {"province": "并州", "controller": "han", "strength": "core"},
    {"province": "幽州", "controller": "han", "strength": "core"},
    {"province": "交州", "controller": "han", "strength": "core"}
  ],
  "overrides": [
    {"name": "巨鹿郡", "controller": "huangjin", "strength": "contested", "contenders": ["huangjin", "han"], "note": "张角兄弟根据地，广宗、下曲阳是稍后决战的地点"},
    {"name": "甘陵国", "controller": "huangjin", "strength": "contested", "contenders": ["huangjin", "han"], "note": "国人执甘陵王响应，不是黄巾建了完整政权"},
    {"name": "安平国", "controller": "huangjin", "strength": "contested", "contenders": ["huangjin", "han"], "note": "国人执安平王响应"},
    {"name": "颍川郡", "controller": "huangjin", "strength": "contested", "contenders": ["huangjin", "han"], "note": "波才围皇甫嵩于长社，五月被击破"},
    {"name": "汝南郡", "controller": "huangjin", "strength": "contested", "contenders": ["huangjin", "han"], "note": "黄巾败太守赵谦于邵陵，彭脱活动于此与陈国"},
    {"name": "陈国", "controller": "huangjin", "strength": "contested", "contenders": ["huangjin", "han"], "note": "彭脱，随后在西华被破"},
    {"name": "东郡", "controller": "huangjin", "strength": "contested", "contenders": ["huangjin", "han"], "note": "卜己，八月苍亭被皇甫嵩俘获"},
    {"name": "南阳郡", "controller": "huangjin", "strength": "contested", "contenders": ["huangjin", "han"], "note": "三月张曼成攻杀太守褚贡，屯宛；宛城到次年才彻底收回"},
    {"name": "广阳郡", "controller": "huangjin", "strength": "contested", "contenders": ["huangjin", "han"], "note": "杀幽州刺史郭勋及太守刘卫"},
    {"name": "安定郡", "controller": "han", "strength": "weak", "contenders": [], "note": "羌患已久；边章、韩遂之起在本年十月，此帧尚未爆发"},
    {"name": "北地郡", "controller": "han", "strength": "weak", "contenders": [], "note": "先零羌活动区，十月与金城变乱连在一起"},
    {"name": "西河郡", "controller": "han", "strength": "weak", "contenders": [], "note": "南匈奴单于庭原在美稷，汉民与匈奴错居"},
    {"name": "上郡", "controller": "han", "strength": "lost", "contenders": [], "note": "《晋书·地理志》：灵帝末羌胡大扰，此郡与定襄、云中、五原、朔方流徙分散"},
    {"name": "定襄郡", "controller": "han", "strength": "lost", "contenders": [], "note": "郡治流徙，不宜画成东汉实控"},
    {"name": "云中郡", "controller": "han", "strength": "lost", "contenders": [], "note": "郡治流徙"},
    {"name": "五原郡", "controller": "han", "strength": "lost", "contenders": [], "note": "郡治流徙"},
    {"name": "朔方郡", "controller": "han", "strength": "lost", "contenders": [], "note": "郡治流徙，正式省并要到建安二十年"}
  ],
  "capitals": [
    {"faction": "han", "city": "雒阳", "lng": 112.61, "lat": 34.72},
    {"faction": "huangjin", "city": "广宗", "lng": 115.27, "lat": 36.97}
  ],
  "sources": ["《后汉书·孝灵帝纪》", "《后汉书·皇甫嵩传》", "《后汉书·朱儁传》", "《资治通鉴》卷五十八", "《晋书·地理志》"]
}
```

## 190 年四月：董卓在长安，关东联军按兵不进

黄巾主力早在 184 年冬天失败。这六年里凉州成了韩遂、马腾的地盘，黑山军占着太行山一段，白波军扰动河东，刘焉到了益州。189 年董卓进洛阳、废少帝。190 年正月关东州郡起兵，推袁绍做盟主；二月董卓把献帝迁到长安，并烧掉洛阳。四月这一帧：皇帝在长安，董卓控制关中；袁绍人在河内，冀州仍是韩馥的；袁术屯鲁阳；曹操只有一支小部队，还没有自己的州。联军怕董卓的凉州兵，大多停在酸枣喝酒，没有真正西进。取四月，是迁都和焚洛阳已经发生，而酸枣诸军还没因为缺粮散掉。

```json
{
  "year": 190,
  "month": 4,
  "label": "关东联军讨董，迁都长安之后",
  "provinces": [
    {"province": "司隶", "controller": "dong", "strength": "core"},
    {"province": "豫州", "controller": "han", "strength": "weak"},
    {"province": "冀州", "controller": "minor_hanfu", "strength": "weak"},
    {"province": "兖州", "controller": "han", "strength": "weak"},
    {"province": "徐州", "controller": "taoqian", "strength": "core"},
    {"province": "青州", "controller": "han", "strength": "weak"},
    {"province": "荆州", "controller": "han", "strength": "weak"},
    {"province": "扬州", "controller": "han", "strength": "weak"},
    {"province": "益州", "controller": "liuzhang", "strength": "weak"},
    {"province": "凉州", "controller": "liang", "strength": "weak"},
    {"province": "并州", "controller": "han", "strength": "weak"},
    {"province": "幽州", "controller": "han", "strength": "weak"},
    {"province": "交州", "controller": "han", "strength": "weak"}
  ],
  "overrides": [
    {"name": "河南尹", "controller": "dong", "strength": "weak", "contenders": [], "note": "洛阳宫室民居被焚，二百里内荒残"},
    {"name": "河内郡", "controller": "yuanshao", "strength": "weak", "contenders": ["yuanshao", "dong"], "note": "太守王匡与盟主袁绍屯此，不是董卓的稳定后方"},
    {"name": "河东郡", "controller": "huangjin", "strength": "contested", "contenders": ["huangjin", "dong"], "note": "白波军自188年起于西河白波谷，寇太原、河东"},
    {"name": "勃海郡", "controller": "yuanshao", "strength": "weak", "contenders": [], "note": "袁绍本任勃海太守，人已去河内，郡内控制弱"},
    {"name": "常山国", "controller": "heishan", "strength": "contested", "contenders": ["heishan", "minor_hanfu"], "note": "张燕黑山军在山险，郡治城邑未必全在其手"},
    {"name": "北海国", "controller": "minor_kongrong", "strength": "weak", "contenders": ["minor_kongrong", "huangjin"], "note": "孔融为北海相，屡被黄巾余部围攻"},
    {"name": "南阳郡", "controller": "yuanshu", "strength": "core", "contenders": [], "note": "袁术屯鲁阳；孙坚杀南阳太守张咨后北上，部众归袁术节制"},
    {"name": "南郡", "controller": "liubiao", "strength": "weak", "contenders": ["liubiao", "han"], "note": "刘表单马入宜城，靠蒯越、蔡瑁才在襄阳站住，江南宗帅未平"},
    {"name": "长沙郡", "controller": "sun", "strength": "weak", "contenders": [], "note": "孙坚起兵前的后方，本人已北上到鲁阳，不在郡中"},
    {"name": "广陵郡", "controller": "taoqian", "strength": "weak", "contenders": [], "note": "太守张超随兄张邈在酸枣，人离开了郡"},
    {"name": "交趾郡", "controller": "shixie", "strength": "weak", "contenders": [], "note": "士燮已为交趾太守，兄弟尚未分领各郡"},
    {"name": "辽东郡", "controller": "gongsun_liaodong", "strength": "weak", "contenders": [], "note": "董卓所署辽东太守公孙度刚到任，开始自立"},
    {"name": "玄菟郡", "controller": "gongsun_liaodong", "strength": "weak", "contenders": [], "note": "随辽东成为公孙度势力"},
    {"name": "乐浪郡", "controller": "gongsun_liaodong", "strength": "weak", "contenders": [], "note": "公孙度遥领，控制程度低于辽东"},
    {"name": "辽东属国", "controller": "gongsun_liaodong", "strength": "weak", "contenders": [], "note": "近辽东，名义归公孙度"},
    {"name": "西河郡", "controller": "han", "strength": "weak", "contenders": [], "note": "南匈奴错居，白波亦出白波谷"},
    {"name": "上郡", "controller": "han", "strength": "lost", "contenders": [], "note": "灵帝末已流徙"},
    {"name": "定襄郡", "controller": "han", "strength": "lost", "contenders": [], "note": "灵帝末已流徙"},
    {"name": "云中郡", "controller": "han", "strength": "lost", "contenders": [], "note": "灵帝末已流徙"},
    {"name": "五原郡", "controller": "han", "strength": "lost", "contenders": [], "note": "灵帝末已流徙"},
    {"name": "朔方郡", "controller": "han", "strength": "lost", "contenders": [], "note": "灵帝末已流徙"}
  ],
  "capitals": [
    {"faction": "dong", "city": "长安", "lng": 108.86, "lat": 34.3},
    {"faction": "yuanshao", "city": "怀县", "lng": 113.38, "lat": 35.1},
    {"faction": "yuanshu", "city": "鲁阳", "lng": 112.9, "lat": 33.74},
    {"faction": "minor_hanfu", "city": "邺", "lng": 114.45, "lat": 36.28},
    {"faction": "taoqian", "city": "郯", "lng": 118.35, "lat": 34.61},
    {"faction": "liubiao", "city": "襄阳", "lng": 112.15, "lat": 32.02},
    {"faction": "liuzhang", "city": "绵竹", "lng": 104.2, "lat": 31.34},
    {"faction": "liang", "city": "允吾", "lng": 103.3, "lat": 36.1},
    {"faction": "gongsun_liaodong", "city": "襄平", "lng": 123.17, "lat": 41.27},
    {"faction": "minor_kongrong", "city": "剧县", "lng": 118.74, "lat": 36.88},
    {"faction": "shixie", "city": "龙编", "lng": 105.85, "lat": 21.03}
  ],
  "sources": ["《三国志·武帝纪》", "《三国志·董卓传》", "《三国志·袁绍传》", "《三国志·孙破虏传》", "《三国志·刘焉传》", "《资治通鉴》卷五十九", "《晋书·地理志》"]
}
```

这一帧的幽州默认是汉（刘虞坐镇蓟县）。公孙瓒兵多，但还没有杀掉刘虞，所以不把幽州整州涂成他的。益州的 `liuzhang` 这时是刘焉。豫州、兖州、青州、扬州默认 `han` 且为 `weak`，意思是还挂着汉朝刺史太守的名号，人各有军队，不是洛阳那种统一朝廷。

## 192 年十二月：董卓已死，曹操刚得兖州

董卓在这年四月被吕布杀掉，六月李傕、郭汜打进长安，杀死王允，天子仍在他们手里。袁绍在 191 年秋天从韩馥手里得到冀州，治所迁到邺城，并在界桥打败南下的公孙瓒。冬天，青州黄巾涌进兖州，刺史刘岱战死，州里的人请曹操来领州，曹操收降三十多万兵，挑出精锐称作青州兵。孙坚在打刘表时死了（通鉴放在 191 年），长沙一带归刘表；袁术还在南阳，要到明年春天才败走寿春。刘虞还活着。取十二月，是为了让“李傕入长安”和“曹操领兖州”都已经发生。

```json
{
  "year": 192,
  "month": 12,
  "label": "董卓死后，曹操领兖州",
  "provinces": [
    {"province": "司隶", "controller": "dong", "strength": "weak"},
    {"province": "豫州", "controller": "han", "strength": "weak"},
    {"province": "冀州", "controller": "yuanshao", "strength": "core"},
    {"province": "兖州", "controller": "cao", "strength": "core"},
    {"province": "徐州", "controller": "taoqian", "strength": "core"},
    {"province": "青州", "controller": "gongsunzan", "strength": "weak"},
    {"province": "荆州", "controller": "liubiao", "strength": "weak"},
    {"province": "扬州", "controller": "han", "strength": "weak"},
    {"province": "益州", "controller": "liuzhang", "strength": "weak"},
    {"province": "凉州", "controller": "liang", "strength": "weak"},
    {"province": "并州", "controller": "han", "strength": "weak"},
    {"province": "幽州", "controller": "han", "strength": "weak"},
    {"province": "交州", "controller": "han", "strength": "weak"}
  ],
  "overrides": [
    {"name": "河南尹", "controller": "dong", "strength": "weak", "contenders": [], "note": "洛阳仍是空城，李傕主力在长安"},
    {"name": "河内郡", "controller": "zhangyang", "strength": "weak", "contenders": ["zhangyang", "yuanshao"], "note": "袁绍表张杨为河内太守，张杨半独立"},
    {"name": "河东郡", "controller": "huangjin", "strength": "contested", "contenders": ["huangjin", "dong"], "note": "白波帅胡才、李乐、韩暹等仍在"},
    {"name": "弘农郡", "controller": "dong", "strength": "weak", "contenders": [], "note": "张济屯陕、弘农一带，属于李傕集团"},
    {"name": "常山国", "controller": "heishan", "strength": "contested", "contenders": ["heishan", "yuanshao"], "note": "张燕曾助公孙瓒打袁绍，兵败后仍在山中"},
    {"name": "北海国", "controller": "minor_kongrong", "strength": "weak", "contenders": [], "note": "孔融"},
    {"name": "平原郡", "controller": "liubei", "strength": "weak", "contenders": ["liubei", "gongsunzan"], "note": "公孙瓒表刘备为平原相，兵只有数千，寄寓性质"},
    {"name": "南阳郡", "controller": "yuanshu", "strength": "weak", "contenders": ["yuanshu", "liubiao"], "note": "孙坚已死，袁术仍在南阳，次年春被曹操打败后南奔寿春"},
    {"name": "蜀郡", "controller": "liuzhang", "strength": "core", "contenders": [], "note": "刘焉核心区"},
    {"name": "广汉郡", "controller": "liuzhang", "strength": "core", "contenders": [], "note": "治所绵竹在此"},
    {"name": "犍为郡", "controller": "liuzhang", "strength": "core", "contenders": [], "note": "任岐、贾龙之乱已在初平二年被刘焉压下"},
    {"name": "巴郡", "controller": "liuzhang", "strength": "weak", "contenders": [], "note": "张鲁西据汉中后，巴地北缘开始不稳"},
    {"name": "汉中郡", "controller": "zhanglu", "strength": "weak", "contenders": ["zhanglu", "liuzhang"], "note": "张鲁杀太守苏固、断斜谷，人仍是刘焉所遣，尚未公开决裂"},
    {"name": "交趾郡", "controller": "shixie", "strength": "weak", "contenders": [], "note": "士燮"},
    {"name": "辽东郡", "controller": "gongsun_liaodong", "strength": "core", "contenders": [], "note": "公孙度自称平州牧，分置辽东属下诸郡"},
    {"name": "玄菟郡", "controller": "gongsun_liaodong", "strength": "core", "contenders": [], "note": "公孙度"},
    {"name": "乐浪郡", "controller": "gongsun_liaodong", "strength": "weak", "contenders": [], "note": "遥领"},
    {"name": "辽东属国", "controller": "gongsun_liaodong", "strength": "weak", "contenders": [], "note": "近辽东"},
    {"name": "西河郡", "controller": "han", "strength": "weak", "contenders": [], "note": "南匈奴与汉民错居"},
    {"name": "上郡", "controller": "han", "strength": "lost", "contenders": [], "note": "流徙"},
    {"name": "定襄郡", "controller": "han", "strength": "lost", "contenders": [], "note": "流徙"},
    {"name": "云中郡", "controller": "han", "strength": "lost", "contenders": [], "note": "流徙"},
    {"name": "五原郡", "controller": "han", "strength": "lost", "contenders": [], "note": "流徙"},
    {"name": "朔方郡", "controller": "han", "strength": "lost", "contenders": [], "note": "流徙"}
  ],
  "capitals": [
    {"faction": "dong", "city": "长安", "lng": 108.86, "lat": 34.3},
    {"faction": "yuanshao", "city": "邺", "lng": 114.45, "lat": 36.28},
    {"faction": "cao", "city": "鄄城", "lng": 115.51, "lat": 35.59},
    {"faction": "yuanshu", "city": "鲁阳", "lng": 112.9, "lat": 33.74},
    {"faction": "taoqian", "city": "郯", "lng": 118.35, "lat": 34.61},
    {"faction": "liubei", "city": "平原", "lng": 116.43, "lat": 37.16},
    {"faction": "liubiao", "city": "襄阳", "lng": 112.15, "lat": 32.02},
    {"faction": "liuzhang", "city": "绵竹", "lng": 104.2, "lat": 31.34},
    {"faction": "zhanglu", "city": "南郑", "lng": 106.94, "lat": 33.07},
    {"faction": "zhangyang", "city": "野王", "lng": 112.95, "lat": 35.09},
    {"faction": "liang", "city": "允吾", "lng": 103.3, "lat": 36.1},
    {"faction": "gongsun_liaodong", "city": "襄平", "lng": 123.17, "lat": 41.27},
    {"faction": "minor_kongrong", "city": "剧县", "lng": 118.74, "lat": 36.88},
    {"faction": "shixie", "city": "龙编", "lng": 105.85, "lat": 21.03}
  ],
  "sources": ["《三国志·武帝纪》", "《三国志·董卓传》", "《三国志·袁绍传》", "《三国志·吕布传》", "《后汉书·刘焉传》", "《资治通鉴》卷六十"]
}
```

幽州仍写汉，是因为刘虞到 193 年冬天才被公孙瓒杀死。公孙瓒的军队这年在冀州南边打了败仗，不能把幽州十一郡都涂成他的。青州默认写成公孙瓒，是因为他委派了田楷做青州刺史，实际只是松散控制。

## 194 年十二月：吕布占兖州大部，刘备刚领徐州

曹操为父报仇，193 年到 194 年两次打陶谦，在彭城一带杀掠很重。194 年他第二次东征时，陈留太守张邈和陈宫叛变，迎接吕布。兖州多数郡县倒向吕布，曹操只保住鄄城、范县、东阿三座县城。陶谦这年病死，麋竺、陈登、孔融劝刘备领徐州。袁术已经败到寿春。刘焉这年病死，刘璋继任，治所迁到成都；张鲁占着汉中，和益州本部分道。刘虞已死，公孙瓒暂时说自己占有幽州。取十二月：陶谦之死没有留下月份，传统放在兴平元年后半，年末三件事（吕布入兖、陶谦死、刘备领徐）才同时成立。

```json
{
  "year": 194,
  "month": 12,
  "label": "吕布争兖州，刘备领徐州",
  "provinces": [
    {"province": "司隶", "controller": "dong", "strength": "weak"},
    {"province": "豫州", "controller": "han", "strength": "weak"},
    {"province": "冀州", "controller": "yuanshao", "strength": "core"},
    {"province": "兖州", "controller": "lvbu", "strength": "weak"},
    {"province": "徐州", "controller": "liubei", "strength": "weak"},
    {"province": "青州", "controller": "gongsunzan", "strength": "weak"},
    {"province": "荆州", "controller": "liubiao", "strength": "core"},
    {"province": "扬州", "controller": "yuanshu", "strength": "weak"},
    {"province": "益州", "controller": "liuzhang", "strength": "weak"},
    {"province": "凉州", "controller": "liang", "strength": "weak"},
    {"province": "并州", "controller": "han", "strength": "weak"},
    {"province": "幽州", "controller": "gongsunzan", "strength": "weak"},
    {"province": "交州", "controller": "han", "strength": "weak"}
  ],
  "overrides": [
    {"name": "河南尹", "controller": "dong", "strength": "weak", "contenders": [], "note": "空城"},
    {"name": "河内郡", "controller": "zhangyang", "strength": "weak", "contenders": [], "note": "张杨"},
    {"name": "河东郡", "controller": "huangjin", "strength": "contested", "contenders": ["huangjin", "dong"], "note": "白波"},
    {"name": "弘农郡", "controller": "dong", "strength": "weak", "contenders": [], "note": "张济"},
    {"name": "右扶风", "controller": "liang", "strength": "contested", "contenders": ["liang", "dong"], "note": "马腾这年与韩遂袭长安失败，退回凉州，三辅仍以李傕为主"},
    {"name": "东郡", "controller": "lvbu", "strength": "contested", "contenders": ["lvbu", "cao"], "note": "吕布争濮阳；范县、东阿仍在曹操手里，都是县不是整郡"},
    {"name": "济阴郡", "controller": "lvbu", "strength": "contested", "contenders": ["lvbu", "cao"], "note": "曹操的鄄城在济阴，是他仅存的根本"},
    {"name": "常山国", "controller": "heishan", "strength": "contested", "contenders": ["heishan", "yuanshao"], "note": "张燕残部"},
    {"name": "北海国", "controller": "minor_kongrong", "strength": "weak", "contenders": [], "note": "孔融，尚未被袁谭赶走"},
    {"name": "南阳郡", "controller": "liubiao", "strength": "weak", "contenders": [], "note": "袁术已南走，刘表接收南阳，控制松；张绣要到196年才入宛"},
    {"name": "丹杨郡", "controller": "liuyao", "strength": "contested", "contenders": ["liuyao", "yuanshu"], "note": "扬州刺史刘繇治曲阿；吴景、孙贲在历阳与之相拒"},
    {"name": "吴郡", "controller": "liuyao", "strength": "weak", "contenders": [], "note": "刘繇势力，孙策尚未渡江"},
    {"name": "会稽郡", "controller": "minor_wanglang", "strength": "weak", "contenders": [], "note": "太守王朗"},
    {"name": "豫章郡", "controller": "liuyao", "strength": "contested", "contenders": ["liuyao", "yuanshu"], "note": "笮融杀豫章太守朱皓后游走，郡中没有稳定主人"},
    {"name": "九江郡", "controller": "yuanshu", "strength": "core", "contenders": [], "note": "袁术治寿春"},
    {"name": "蜀郡", "controller": "liuzhang", "strength": "core", "contenders": [], "note": "刘璋迁治成都"},
    {"name": "广汉郡", "controller": "liuzhang", "strength": "core", "contenders": [], "note": "刘璋"},
    {"name": "犍为郡", "controller": "liuzhang", "strength": "core", "contenders": [], "note": "刘璋"},
    {"name": "巴郡", "controller": "liuzhang", "strength": "weak", "contenders": ["liuzhang", "zhanglu"], "note": "北巴受张鲁压力"},
    {"name": "汉中郡", "controller": "zhanglu", "strength": "core", "contenders": [], "note": "刘焉已死，张鲁不再听益州调遣"},
    {"name": "交趾郡", "controller": "shixie", "strength": "weak", "contenders": [], "note": "刺史朱符仍在，要到196年被杀后士燮才署兄弟分领诸郡"},
    {"name": "辽东郡", "controller": "gongsun_liaodong", "strength": "core", "contenders": [], "note": "公孙度"},
    {"name": "玄菟郡", "controller": "gongsun_liaodong", "strength": "core", "contenders": [], "note": "公孙度"},
    {"name": "乐浪郡", "controller": "gongsun_liaodong", "strength": "weak", "contenders": [], "note": "遥领"},
    {"name": "辽东属国", "controller": "gongsun_liaodong", "strength": "weak", "contenders": [], "note": "公孙度"},
    {"name": "西河郡", "controller": "han", "strength": "weak", "contenders": [], "note": "南匈奴错居"},
    {"name": "上郡", "controller": "han", "strength": "lost", "contenders": [], "note": "流徙"},
    {"name": "定襄郡", "controller": "han", "strength": "lost", "contenders": [], "note": "流徙"},
    {"name": "云中郡", "controller": "han", "strength": "lost", "contenders": [], "note": "流徙"},
    {"name": "五原郡", "controller": "han", "strength": "lost", "contenders": [], "note": "流徙"},
    {"name": "朔方郡", "controller": "han", "strength": "lost", "contenders": [], "note": "流徙"}
  ],
  "capitals": [
    {"faction": "dong", "city": "长安", "lng": 108.86, "lat": 34.3},
    {"faction": "yuanshao", "city": "邺", "lng": 114.45, "lat": 36.28},
    {"faction": "cao", "city": "鄄城", "lng": 115.51, "lat": 35.59},
    {"faction": "lvbu", "city": "濮阳", "lng": 115.03, "lat": 35.76},
    {"faction": "liubei", "city": "下邳", "lng": 117.96, "lat": 34.34},
    {"faction": "yuanshu", "city": "寿春", "lng": 116.78, "lat": 32.56},
    {"faction": "liubiao", "city": "襄阳", "lng": 112.15, "lat": 32.02},
    {"faction": "liuzhang", "city": "成都", "lng": 104.07, "lat": 30.67},
    {"faction": "zhanglu", "city": "南郑", "lng": 106.94, "lat": 33.07},
    {"faction": "gongsunzan", "city": "蓟", "lng": 116.4, "lat": 39.9},
    {"faction": "liuyao", "city": "曲阿", "lng": 119.57, "lat": 31.99},
    {"faction": "minor_wanglang", "city": "山阴", "lng": 120.58, "lat": 30.0},
    {"faction": "zhangyang", "city": "野王", "lng": 112.95, "lat": 35.09},
    {"faction": "liang", "city": "允吾", "lng": 103.3, "lat": 36.1},
    {"faction": "gongsun_liaodong", "city": "襄平", "lng": 123.17, "lat": 41.27},
    {"faction": "minor_kongrong", "city": "剧县", "lng": 118.74, "lat": 36.88},
    {"faction": "shixie", "city": "龙编", "lng": 105.85, "lat": 21.03}
  ],
  "sources": ["《三国志·武帝纪》", "《三国志·吕布传》", "《三国志·先主传》", "《三国志·陶谦传》", "《后汉书·刘焉传》", "《资治通鉴》卷六十一"]
}
```

徐州写成 `weak`，是因为曹操前一年的屠杀让彭城、下邳一带很残破，刘备的统治并不稳。兖州不能整州涂成吕布：鄄城三城还在曹操手里，只是这三城分属东郡和济阴，地图上这两郡应作争夺，不是吕布独有。

## 195 年十二月：曹操收回兖州，天子逃出长安

李傕和郭汜在长安内斗，这年七月以后挟着皇帝东跑，十二月在弘农东边大败护驾的军队，献帝继续往河东逃，还没有到洛阳，更没有到许。曹操在这年打败吕布，收回兖州，吕布东投刘备，屯在下邳西边，还没有夺走徐州。孙策在十二月打跑曲阿的刘繇，得到丹杨、吴郡；会稽仍是王朗的。公孙瓒在幽州连败，鲜于辅、乌桓和袁绍的将领麴义已经在北面挖他的墙角，他开始退向易京。取十二月，是为了同时看见“兖州回到曹操手里”和“孙策刚过江”，又不要提前写成吕布已经是徐州牧（那是明年夏天的事）。

```json
{
  "year": 195,
  "month": 12,
  "label": "献帝东迁，曹操复兖州",
  "provinces": [
    {"province": "司隶", "controller": "dong", "strength": "weak"},
    {"province": "豫州", "controller": "han", "strength": "weak"},
    {"province": "冀州", "controller": "yuanshao", "strength": "core"},
    {"province": "兖州", "controller": "cao", "strength": "core"},
    {"province": "徐州", "controller": "liubei", "strength": "weak"},
    {"province": "青州", "controller": "gongsunzan", "strength": "weak"},
    {"province": "荆州", "controller": "liubiao", "strength": "core"},
    {"province": "扬州", "controller": "yuanshu", "strength": "weak"},
    {"province": "益州", "controller": "liuzhang", "strength": "weak"},
    {"province": "凉州", "controller": "liang", "strength": "weak"},
    {"province": "并州", "controller": "han", "strength": "weak"},
    {"province": "幽州", "controller": "gongsunzan", "strength": "weak"},
    {"province": "交州", "controller": "han", "strength": "weak"}
  ],
  "overrides": [
    {"name": "河南尹", "controller": "dong", "strength": "weak", "contenders": [], "note": "洛阳空城，天子尚未还京"},
    {"name": "河内郡", "controller": "zhangyang", "strength": "weak", "contenders": [], "note": "张杨在野王，随后参与迎天子"},
    {"name": "河东郡", "controller": "huangjin", "strength": "contested", "contenders": ["huangjin", "dong"], "note": "白波胡才、李乐、韩暹迎驾，郡不是李傕的了"},
    {"name": "弘农郡", "controller": "dong", "strength": "contested", "contenders": ["dong", "huangjin"], "note": "十二月天子至弘农，李傕、郭汜、张济追击，段煨在华阴供给百官"},
    {"name": "京兆尹", "controller": "dong", "strength": "weak", "contenders": [], "note": "长安城空四十余日，二三年间关中几乎没有人烟"},
    {"name": "右扶风", "controller": "liang", "strength": "weak", "contenders": ["liang", "dong"], "note": "马腾势力窥三辅"},
    {"name": "常山国", "controller": "heishan", "strength": "contested", "contenders": ["heishan", "yuanshao"], "note": "张燕"},
    {"name": "北海国", "controller": "minor_kongrong", "strength": "weak", "contenders": [], "note": "孔融，明年被袁谭逐走"},
    {"name": "广阳郡", "controller": "gongsunzan", "strength": "contested", "contenders": ["gongsunzan", "yuanshao"], "note": "郡人杀公孙瓒所置长吏，与鲜于辅及袁绍将麴义合兵"},
    {"name": "上谷郡", "controller": "gongsunzan", "strength": "contested", "contenders": ["gongsunzan", "yuanshao"], "note": "杀瓒所置长吏"},
    {"name": "代郡", "controller": "gongsunzan", "strength": "contested", "contenders": ["gongsunzan", "yuanshao"], "note": "杀瓒所置长吏"},
    {"name": "右北平郡", "controller": "gongsunzan", "strength": "contested", "contenders": ["gongsunzan", "yuanshao"], "note": "杀瓒所置长吏；乌桓亦在边郡"},
    {"name": "南阳郡", "controller": "liubiao", "strength": "weak", "contenders": [], "note": "张绣尚未入宛"},
    {"name": "丹杨郡", "controller": "sun", "strength": "weak", "contenders": ["sun", "liuyao"], "note": "十二月孙策破刘繇于曲阿，新占，尚未稳"},
    {"name": "吴郡", "controller": "sun", "strength": "weak", "contenders": [], "note": "随曲阿之胜归孙策"},
    {"name": "会稽郡", "controller": "minor_wanglang", "strength": "weak", "contenders": [], "note": "王朗要到196年才败"},
    {"name": "豫章郡", "controller": "liuyao", "strength": "weak", "contenders": [], "note": "刘繇自曲阿逃入豫章"},
    {"name": "九江郡", "controller": "yuanshu", "strength": "core", "contenders": [], "note": "寿春"},
    {"name": "蜀郡", "controller": "liuzhang", "strength": "core", "contenders": [], "note": "刘璋"},
    {"name": "广汉郡", "controller": "liuzhang", "strength": "core", "contenders": [], "note": "刘璋"},
    {"name": "犍为郡", "controller": "liuzhang", "strength": "core", "contenders": [], "note": "刘璋"},
    {"name": "巴郡", "controller": "liuzhang", "strength": "weak", "contenders": ["liuzhang", "zhanglu"], "note": "北巴不稳"},
    {"name": "汉中郡", "controller": "zhanglu", "strength": "core", "contenders": [], "note": "张鲁"},
    {"name": "交趾郡", "controller": "shixie", "strength": "weak", "contenders": [], "note": "士燮"},
    {"name": "辽东郡", "controller": "gongsun_liaodong", "strength": "core", "contenders": [], "note": "公孙度，不在公孙瓒的幽州里"},
    {"name": "玄菟郡", "controller": "gongsun_liaodong", "strength": "core", "contenders": [], "note": "公孙度"},
    {"name": "乐浪郡", "controller": "gongsun_liaodong", "strength": "weak", "contenders": [], "note": "遥领"},
    {"name": "辽东属国", "controller": "gongsun_liaodong", "strength": "weak", "contenders": [], "note": "公孙度"},
    {"name": "西河郡", "controller": "han", "strength": "weak", "contenders": [], "note": "南匈奴错居"},
    {"name": "上郡", "controller": "han", "strength": "lost", "contenders": [], "note": "流徙"},
    {"name": "定襄郡", "controller": "han", "strength": "lost", "contenders": [], "note": "流徙"},
    {"name": "云中郡", "controller": "han", "strength": "lost", "contenders": [], "note": "流徙"},
    {"name": "五原郡", "controller": "han", "strength": "lost", "contenders": [], "note": "流徙"},
    {"name": "朔方郡", "controller": "han", "strength": "lost", "contenders": [], "note": "流徙"}
  ],
  "capitals": [
    {"faction": "dong", "city": "长安", "lng": 108.86, "lat": 34.3},
    {"faction": "yuanshao", "city": "邺", "lng": 114.45, "lat": 36.28},
    {"faction": "cao", "city": "鄄城", "lng": 115.51, "lat": 35.59},
    {"faction": "liubei", "city": "下邳", "lng": 117.96, "lat": 34.34},
    {"faction": "yuanshu", "city": "寿春", "lng": 116.78, "lat": 32.56},
    {"faction": "sun", "city": "曲阿", "lng": 119.57, "lat": 31.99},
    {"faction": "liubiao", "city": "襄阳", "lng": 112.15, "lat": 32.02},
    {"faction": "liuzhang", "city": "成都", "lng": 104.07, "lat": 30.67},
    {"faction": "zhanglu", "city": "南郑", "lng": 106.94, "lat": 33.07},
    {"faction": "gongsunzan", "city": "易京", "lng": 116.1, "lat": 39.04},
    {"faction": "liuyao", "city": "豫章", "lng": 115.89, "lat": 28.68},
    {"faction": "minor_wanglang", "city": "山阴", "lng": 120.58, "lat": 30.0},
    {"faction": "zhangyang", "city": "野王", "lng": 112.95, "lat": 35.09},
    {"faction": "liang", "city": "允吾", "lng": 103.3, "lat": 36.1},
    {"faction": "gongsun_liaodong", "city": "襄平", "lng": 123.17, "lat": 41.27},
    {"faction": "shixie", "city": "龙编", "lng": 105.85, "lat": 21.03}
  ],
  "sources": ["《三国志·武帝纪》", "《三国志·吕布传》", "《三国志·孙讨逆传》", "《三国志·公孙瓒传》", "《资治通鉴》卷六十一"]
}
```

吕布这个月没有自己的州。他在刘备境内寄居，下一帧才变成徐州的主人。长安仍标成董卓余部的旧都，但皇帝已经不在城里。

## 197 年二月：袁术称帝，曹操在许，吕布在徐州

196 年发生了三件地图上的大事，都算进这一帧，不再单独切年：夏天吕布趁刘备和袁术对打，袭取下邳，自称徐州牧，把刘备安置在小沛；秋天曹操把献帝从残破的洛阳接到许县；孙策南下打败王朗，占了会稽。197 年春天袁术在寿春称帝，孙策与他断交。同一春天，张绣先在宛城投降曹操，随即复叛，曹操长子曹昂、大将典韦战死，南阳仍是张绣的，并且依附刘表。孔融已被袁谭赶出北海，青州大部算袁绍（由长子袁谭统领），但并不扎实。公孙瓒被困在易京，幽州乡野多已倒向袁绍一边。取二月：称帝和宛城复叛都已经发生。

```json
{
  "year": 197,
  "month": 2,
  "label": "袁术称帝，献帝在许",
  "provinces": [
    {"province": "司隶", "controller": "dong", "strength": "weak"},
    {"province": "豫州", "controller": "cao", "strength": "core"},
    {"province": "冀州", "controller": "yuanshao", "strength": "core"},
    {"province": "兖州", "controller": "cao", "strength": "core"},
    {"province": "徐州", "controller": "lvbu", "strength": "weak"},
    {"province": "青州", "controller": "yuanshao", "strength": "weak"},
    {"province": "荆州", "controller": "liubiao", "strength": "core"},
    {"province": "扬州", "controller": "yuanshu", "strength": "weak"},
    {"province": "益州", "controller": "liuzhang", "strength": "weak"},
    {"province": "凉州", "controller": "liang", "strength": "weak"},
    {"province": "并州", "controller": "han", "strength": "weak"},
    {"province": "幽州", "controller": "yuanshao", "strength": "weak"},
    {"province": "交州", "controller": "shixie", "strength": "weak"}
  ],
  "overrides": [
    {"name": "河南尹", "controller": "cao", "strength": "weak", "contenders": [], "note": "196年天子曾还洛阳，随即迁许；洛阳仍荒残"},
    {"name": "河内郡", "controller": "zhangyang", "strength": "weak", "contenders": ["zhangyang", "cao"], "note": "张杨仍在，要到198–199年才被部将杀死"},
    {"name": "河东郡", "controller": "han", "strength": "contested", "contenders": ["han", "liang"], "note": "白波诸帅多已随驾东去或死散，郡内大姓与匈奴错居"},
    {"name": "弘农郡", "controller": "cao", "strength": "weak", "contenders": [], "note": "段煨屯华阴，名义服从迁到许的朝廷"},
    {"name": "右扶风", "controller": "liang", "strength": "weak", "contenders": ["liang", "dong"], "note": "马腾在槐里一带，与李傕余部交错"},
    {"name": "泰山郡", "controller": "lvbu", "strength": "weak", "contenders": ["lvbu", "cao"], "note": "臧霸等泰山帅附吕布，半独立；郡属兖州，人不在曹操直管下"},
    {"name": "沛国", "controller": "liubei", "strength": "weak", "contenders": ["liubei", "lvbu"], "note": "吕布使刘备屯小沛，名为豫州刺史"},
    {"name": "汝南郡", "controller": "cao", "strength": "weak", "contenders": ["cao", "huangjin"], "note": "何仪等黄巾196年被曹操击破，余部仍在"},
    {"name": "常山国", "controller": "heishan", "strength": "contested", "contenders": ["heishan", "yuanshao"], "note": "张燕残部在山中"},
    {"name": "涿郡", "controller": "gongsunzan", "strength": "contested", "contenders": ["gongsunzan", "yuanshao"], "note": "易京在涿郡、河间国交界，公孙瓒困守到199年春"},
    {"name": "东莱郡", "controller": "gongsun_liaodong", "strength": "weak", "contenders": ["gongsun_liaodong", "yuanshao"], "note": "公孙度曾越海收取东莱若干县，不是稳定的全郡"},
    {"name": "南阳郡", "controller": "zhangxiu", "strength": "weak", "contenders": ["zhangxiu", "liubiao", "cao"], "note": "正月降曹后复叛，依托刘表"},
    {"name": "丹杨郡", "controller": "sun", "strength": "core", "contenders": [], "note": "孙策与袁术断交后的江东"},
    {"name": "吴郡", "controller": "sun", "strength": "core", "contenders": [], "note": "孙策"},
    {"name": "会稽郡", "controller": "sun", "strength": "core", "contenders": [], "note": "196年破王朗"},
    {"name": "豫章郡", "controller": "liuyao", "strength": "weak", "contenders": [], "note": "刘繇病死前后，华歆奉王命维持，孙策199年才进入"},
    {"name": "九江郡", "controller": "yuanshu", "strength": "core", "contenders": [], "note": "袁术称帝，都寿春"},
    {"name": "蜀郡", "controller": "liuzhang", "strength": "core", "contenders": [], "note": "刘璋"},
    {"name": "广汉郡", "controller": "liuzhang", "strength": "core", "contenders": [], "note": "刘璋"},
    {"name": "犍为郡", "controller": "liuzhang", "strength": "core", "contenders": [], "note": "刘璋"},
    {"name": "巴郡", "controller": "liuzhang", "strength": "weak", "contenders": ["liuzhang", "zhanglu"], "note": "张鲁逼北巴；刘璋已杀张鲁母家"},
    {"name": "汉中郡", "controller": "zhanglu", "strength": "core", "contenders": [], "note": "张鲁政教自成一区"},
    {"name": "辽东郡", "controller": "gongsun_liaodong", "strength": "core", "contenders": [], "note": "公孙度"},
    {"name": "玄菟郡", "controller": "gongsun_liaodong", "strength": "core", "contenders": [], "note": "公孙度"},
    {"name": "乐浪郡", "controller": "gongsun_liaodong", "strength": "weak", "contenders": [], "note": "遥领"},
    {"name": "辽东属国", "controller": "gongsun_liaodong", "strength": "weak", "contenders": [], "note": "公孙度"},
    {"name": "西河郡", "controller": "han", "strength": "weak", "contenders": [], "note": "南匈奴错居；此时不把并州整州划给袁绍"},
    {"name": "上郡", "controller": "han", "strength": "lost", "contenders": [], "note": "流徙"},
    {"name": "定襄郡", "controller": "han", "strength": "lost", "contenders": [], "note": "流徙"},
    {"name": "云中郡", "controller": "han", "strength": "lost", "contenders": [], "note": "流徙"},
    {"name": "五原郡", "controller": "han", "strength": "lost", "contenders": [], "note": "流徙"},
    {"name": "朔方郡", "controller": "han", "strength": "lost", "contenders": [], "note": "流徙"}
  ],
  "capitals": [
    {"faction": "cao", "city": "许", "lng": 113.83, "lat": 34.03},
    {"faction": "lvbu", "city": "下邳", "lng": 117.96, "lat": 34.34},
    {"faction": "liubei", "city": "小沛", "lng": 116.94, "lat": 34.74},
    {"faction": "yuanshu", "city": "寿春", "lng": 116.78, "lat": 32.56},
    {"faction": "yuanshao", "city": "邺", "lng": 114.45, "lat": 36.28},
    {"faction": "sun", "city": "曲阿", "lng": 119.57, "lat": 31.99},
    {"faction": "liubiao", "city": "襄阳", "lng": 112.15, "lat": 32.02},
    {"faction": "zhangxiu", "city": "宛", "lng": 112.54, "lat": 33.0},
    {"faction": "liuzhang", "city": "成都", "lng": 104.07, "lat": 30.67},
    {"faction": "zhanglu", "city": "南郑", "lng": 106.94, "lat": 33.07},
    {"faction": "gongsunzan", "city": "易京", "lng": 116.1, "lat": 39.04},
    {"faction": "zhangyang", "city": "野王", "lng": 112.95, "lat": 35.09},
    {"faction": "dong", "city": "长安", "lng": 108.86, "lat": 34.3},
    {"faction": "liang", "city": "槐里", "lng": 108.49, "lat": 34.3},
    {"faction": "gongsun_liaodong", "city": "襄平", "lng": 123.17, "lat": 41.27},
    {"faction": "shixie", "city": "龙编", "lng": 105.85, "lat": 21.03}
  ],
  "sources": ["《三国志·武帝纪》", "《三国志·袁术传》", "《三国志·吕布传》", "《三国志·张绣传》", "《三国志·孙讨逆传》", "《资治通鉴》卷六十二"]
}
```

并州这一帧仍不整州划给袁绍。高干做并州刺史的年份，史文没有写死在 197 年；见文末争议。交州从这一帧起默认士燮：196 年刺史朱符被杀后，士燮让弟弟分别管合浦、南海等地，但边远郡仍然松。

## 199 年十一月：官渡之战前夕

吕布已在这年年初（建安三年十二月，公历已入 199）在下邳被曹操捉住杀死。袁术夏天病死在北逃的路上。公孙瓒春天在易京覆灭，袁绍因此可以说自己兼有冀、青、幽、并。这四州水分很大：并州北边五郡早已流散，幽州有鲜于辅、阎柔奉诏自守，青州的齐国和北海刚被曹操的盟友臧霸占去，东莱还有公孙度从海上插进来的县。曹操四月取得河内。十一月张绣投降，南阳从刘表一侧改到曹操一侧。孙策这年拿下庐江和豫章。刘备人已经在小沛，但杀掉徐州刺史车胄、公开叛曹，是十二月的事，这一帧故意停在那之前。取十一月：张绣之降已发生，刘备之叛尚未发生，最符合“灭吕布、张绣降曹、官渡尚未打响”。

```json
{
  "year": 199,
  "month": 11,
  "label": "官渡之战前夕",
  "provinces": [
    {"province": "司隶", "controller": "cao", "strength": "weak"},
    {"province": "豫州", "controller": "cao", "strength": "core"},
    {"province": "冀州", "controller": "yuanshao", "strength": "core"},
    {"province": "兖州", "controller": "cao", "strength": "core"},
    {"province": "徐州", "controller": "cao", "strength": "weak"},
    {"province": "青州", "controller": "yuanshao", "strength": "weak"},
    {"province": "荆州", "controller": "liubiao", "strength": "core"},
    {"province": "扬州", "controller": "sun", "strength": "weak"},
    {"province": "益州", "controller": "liuzhang", "strength": "weak"},
    {"province": "凉州", "controller": "liang", "strength": "weak"},
    {"province": "并州", "controller": "yuanshao", "strength": "weak"},
    {"province": "幽州", "controller": "yuanshao", "strength": "weak"},
    {"province": "交州", "controller": "shixie", "strength": "weak"}
  ],
  "overrides": [
    {"name": "河南尹", "controller": "cao", "strength": "weak", "contenders": [], "note": "洛阳残破，政治中心在许"},
    {"name": "河内郡", "controller": "cao", "strength": "weak", "contenders": [], "note": "张杨死后部将眭固欲附袁绍，四月被曹仁、史涣击斩，薛洪、缪尚降"},
    {"name": "河东郡", "controller": "cao", "strength": "contested", "contenders": ["cao", "liang"], "note": "白波已散；地方大姓与南匈奴错居，杜畿守河东要到200年以后"},
    {"name": "弘农郡", "controller": "cao", "strength": "weak", "contenders": [], "note": "段煨半独立"},
    {"name": "京兆尹", "controller": "liang", "strength": "weak", "contenders": ["liang", "cao"], "note": "李傕198年已死，马腾、韩遂与诸将错居；钟繇督关中约在200年前后"},
    {"name": "左冯翊", "controller": "liang", "strength": "weak", "contenders": ["liang", "cao"], "note": "关中无单一主人"},
    {"name": "右扶风", "controller": "liang", "strength": "weak", "contenders": [], "note": "马腾多驻槐里一带"},
    {"name": "汝南郡", "controller": "cao", "strength": "weak", "contenders": ["cao", "huangjin"], "note": "刘辟等黄巾余部仍在，官渡时一度响应袁绍"},
    {"name": "沛国", "controller": "cao", "strength": "weak", "contenders": ["cao", "liubei"], "note": "刘备以曹操所授豫州牧屯小沛；十二月杀车胄，此帧尚未叛"},
    {"name": "泰山郡", "controller": "cao", "strength": "weak", "contenders": [], "note": "臧霸降曹后仍自领部曲"},
    {"name": "常山国", "controller": "heishan", "strength": "contested", "contenders": ["heishan", "yuanshao"], "note": "张燕未灭，山险自守，郡城多属袁绍"},
    {"name": "齐国", "controller": "cao", "strength": "weak", "contenders": ["cao", "yuanshao"], "note": "臧霸等为曹操先锋攻入"},
    {"name": "北海国", "controller": "cao", "strength": "weak", "contenders": ["cao", "yuanshao"], "note": "同上，不是袁谭的稳固领土"},
    {"name": "东莱郡", "controller": "yuanshao", "strength": "contested", "contenders": ["yuanshao", "gongsun_liaodong"], "note": "公孙度越海收过东莱诸县，全郡归属不定"},
    {"name": "广阳郡", "controller": "yuanshao", "strength": "weak", "contenders": [], "note": "袁熙有幽州刺史名；鲜于辅、阎柔奉诏督郡，不完全听邺城"},
    {"name": "渔阳郡", "controller": "yuanshao", "strength": "weak", "contenders": [], "note": "乌桓与汉民错居，袁绍与蹋顿和亲"},
    {"name": "右北平郡", "controller": "yuanshao", "strength": "weak", "contenders": [], "note": "边郡，乌桓活动"},
    {"name": "辽西郡", "controller": "yuanshao", "strength": "weak", "contenders": [], "note": "乌桓蹋顿部靠近此郡，袁绍给过单于印绶"},
    {"name": "辽东郡", "controller": "gongsun_liaodong", "strength": "core", "contenders": [], "note": "公孙度独立于袁绍的幽州之外"},
    {"name": "玄菟郡", "controller": "gongsun_liaodong", "strength": "core", "contenders": [], "note": "公孙度"},
    {"name": "乐浪郡", "controller": "gongsun_liaodong", "strength": "weak", "contenders": [], "note": "遥领"},
    {"name": "辽东属国", "controller": "gongsun_liaodong", "strength": "weak", "contenders": [], "note": "公孙度"},
    {"name": "南阳郡", "controller": "cao", "strength": "weak", "contenders": [], "note": "张绣十一月率众降，新附"},
    {"name": "九江郡", "controller": "sun", "strength": "contested", "contenders": ["sun", "cao"], "note": "袁术六月已死，寿春空虚；孙策收了部众，但没有在寿春稳定设治"},
    {"name": "蜀郡", "controller": "liuzhang", "strength": "core", "contenders": [], "note": "刘璋"},
    {"name": "广汉郡", "controller": "liuzhang", "strength": "core", "contenders": [], "note": "刘璋"},
    {"name": "犍为郡", "controller": "liuzhang", "strength": "core", "contenders": [], "note": "刘璋"},
    {"name": "巴郡", "controller": "liuzhang", "strength": "weak", "contenders": ["liuzhang", "zhanglu"], "note": "张鲁势力进入北巴，不是整郡易手"},
    {"name": "汉中郡", "controller": "zhanglu", "strength": "core", "contenders": [], "note": "张鲁"},
    {"name": "西河郡", "controller": "yuanshao", "strength": "weak", "contenders": [], "note": "南匈奴错居；郡是否完全废弃，记载不一致，故不作 lost"},
    {"name": "雁门郡", "controller": "yuanshao", "strength": "weak", "contenders": [], "note": "鲜卑钞寇，高干能守的主要是太原、上党方向"},
    {"name": "上郡", "controller": "yuanshao", "strength": "lost", "contenders": [], "note": "名分可挂并州，实际流徙，不要涂成袁绍实心领地"},
    {"name": "定襄郡", "controller": "yuanshao", "strength": "lost", "contenders": [], "note": "流徙"},
    {"name": "云中郡", "controller": "yuanshao", "strength": "lost", "contenders": [], "note": "流徙"},
    {"name": "五原郡", "controller": "yuanshao", "strength": "lost", "contenders": [], "note": "流徙"},
    {"name": "朔方郡", "controller": "yuanshao", "strength": "lost", "contenders": [], "note": "流徙；曹操省这四郡并侨置新兴郡是215年的事"}
  ],
  "capitals": [
    {"faction": "cao", "city": "许", "lng": 113.83, "lat": 34.03},
    {"faction": "yuanshao", "city": "邺", "lng": 114.45, "lat": 36.28},
    {"faction": "sun", "city": "吴", "lng": 120.62, "lat": 31.3},
    {"faction": "liubiao", "city": "襄阳", "lng": 112.15, "lat": 32.02},
    {"faction": "liuzhang", "city": "成都", "lng": 104.07, "lat": 30.67},
    {"faction": "zhanglu", "city": "南郑", "lng": 106.94, "lat": 33.07},
    {"faction": "liang", "city": "槐里", "lng": 108.49, "lat": 34.3},
    {"faction": "gongsun_liaodong", "city": "襄平", "lng": 123.17, "lat": 41.27},
    {"faction": "shixie", "city": "龙编", "lng": 105.85, "lat": 21.03}
  ],
  "sources": ["《三国志·武帝纪》", "《三国志·袁绍传》", "《三国志·张绣传》", "《三国志·孙讨逆传》", "《三国志·公孙瓒传》", "《三国志·臧霸传》", "《资治通鉴》卷六十三", "《晋书·地理志》"]
}
```

凉州默认仍是马腾、韩遂，强度为弱：金城以西更松，他们两人也不合一。韩遂的活动中心多在金城，这一帧把凉州势力的落点放在槐里，是因为马腾这时已经深入关中。刘备不单列都城：他仍算曹操部下，人在小沛。

## 不确定与争议

1. 郡是最小上色单位，县和县不一样会被抹平。194 年曹操只守鄄城、范、东阿三县，却必须写成东郡、济阴整郡争夺。199 年公孙瓒的易京、臧霸的山地部曲，也不是整郡。
2. 并州北界五郡（上郡、定襄、云中、五原、朔方）据《晋书·地理志》“灵帝末……流徙分散”。没有精确到 184 年四月是否已经全部空掉。正式撤销是建安二十年（215）。西河郡《元和郡县图志》说灵帝末因黄巾废弃，和《晋书》五郡不是同一条史料，所以只标 `weak`，不标 `lost`。
3. “袁绍据河北四州”是《三国志·袁绍传》的概括。高干任并州刺史的月份没有写明，可能就在灭公孙瓒前后，因此 197 年不把并州画给袁绍，199 年才画，而且只把太原、上党视为稍实、北边五郡视为 `lost`。幽州在公孙瓒死后，鲜于辅、阎柔“奉王命”督郡，袁熙有刺史头衔，两边并存。
4. 青州在 199 年不是袁绍一色。齐国、北海国按《武帝纪》由臧霸攻下，东莱郡因公孙度“越海收东莱诸县”无法断全郡。
5. 孙坚战死的年份，通鉴、稽古录放在初平二年（191），有的记述按战役顺序理解成初平三年（192）。无论哪一说，192 年底长沙已不属孙氏。这一稿采用 191 年。
6. 张鲁杀掉汉中太守苏固、切断斜谷，在《刘焉传》里写在初平二年任岐造反之前，精确月份不清楚。192 年标成张鲁、但强度为弱，表示人还是刘焉派去的；194 年刘焉死后标成稳定控制。
7. 刘备领徐州在兴平元年（194），陶谦死月不明。吕布夺下邳在建安元年（196）夏天，不在 194 或 195。若把 194 年涂成“吕布已据徐州”，是错的。
8. 刘备杀车胄，《武帝纪》系于建安四年十二月，与张绣十一月投降分开。本帧停在十一月。十二月徐州会突然从曹操变成刘备，200 年正月曹操又会把它打下来。下一时段不要从这一帧直接插成“刘备已稳据徐州”。
9. 袁术死后九江、寿春谁占，史文只说部众想投孙策、被刘勋截走，孙策再打刘勋。没有“孙策入主寿春”的明确记载，故 199 年九江作争夺。
10. 长沙、零陵、桂阳一带，裴注引《英雄记》说张羡连年反抗刘表。起迄年常被放在 198–200 前后，无法钉死在 197 或 199，这两帧仍把三郡放在刘表默认里，没有单独立势力。
11. 士燮本人任职或早于 190，兄弟分领南海、合浦等郡在朱符死后（约 196）。184 年不单列士燮。交州远郡（日南、九真、郁林）始终只作弱控制。
12. 乌桓、鲜卑、南匈奴、羌不另设势力 ID。只在郡被占据或严重侵扰时把强度标成 `weak` 或 `lost`，并在备注里写明是哪一人群。南匈奴单于庭长期在西河美稷，这是东汉安置的结果，不等于西河整郡已经不是汉朝的郡。
13. 黑山军从未占有一整个郡的全部县城。常山国标成争夺，是为了在地图上留出太行山这段，不是说真定城一直由张燕治理。
14. 坐标未用复旦 CHGIS 逐点核对。龙编、允吾、怀县、易京误差可能更大。
15. 田余庆、方诗铭关于曹袁集团和青州兵性质的论述，这次没有逐页核对原书，所以不把他们的判断写进郡的归属，只在叙事里保留正史已经写明的过程。
