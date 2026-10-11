# 220–280 年关键帧：郡由谁控制

本文件覆盖曹丕称帝到晋灭吴。地图着色以郡为准。每一帧先用几句话说明形势，再给一份可直接解析的 JSON。

## 给转数据的人

- `provinces` 是这一年的州级底色。`overrides` 不是“例外清单”，而是这一年的全部郡，以及地位相当于郡的典农校尉、都尉。着色以 `overrides` 为准。
- 当时魏和吴各设荆州、扬州。280 年以前写成“荆州（魏）”“荆州（吴）”“扬州（魏）”“扬州（吴）”，只为避免重名；显示给读者时可以去掉括号。280 年合并后不再加括号。
- “江夏（沔北）”和“江夏（江南）”、“庐江（皖北）”和“庐江（皖）”是同一个东汉郡被两国分领。如果底图只有一个郡界，要沿汉水或长江切开，不能整郡涂成一家。
- “新都（扬）”在今浙江、安徽山地；“新都（梁）”在今四川三台一带，由蜀的东广汉改名。不能并成一郡。
- `strength`：`core` 稳定设官收税；`weak` 有郡名、控制松（南中、山越、氐羌、鲜卑边郡）；`contested` 两国边境或正在易手，`contenders` 列出争夺方；本时段没有整郡废弃到要标 `lost` 的情况。云中、定襄、五原、朔方在 215 年已废，不进入本表。
- `capitals` 多了一个 `role` 字段（都城、陪都、治所）。吴的武昌是今湖北鄂州，不是今天武汉的武昌。坐标是治所今天的大约位置，供落点，不是考古实测点。
- 政权 ID 只用：`wei`、`shu`、`wu`、`jin`、`gongsun_liaodong`、`shixie`。高平陵之变以后、代魏以前仍写 `wei`。周边民族不另设政权；他们真正占住或让控制变弱时，用 `strength` 和 `note` 说明。
- 新增关键帧只有 226 年。227 年孟达、232 年公孙渊通吴、257 年诸葛诞，都没有改变稳定的郡界，写在相关帧的说明里，不单列。

## 220 年 曹丕称帝

公元220年十月，曹丕在洛阳称帝，东汉的招牌换成了魏。北方、关中、河西和荆州北部归魏；刘备在成都，手里是益州，荆州已经在前一年丢给孙权。孙权的基地在长江以南，都城还在建业；交州名义上听他的，实际由士燮家族管理。这一年的地图，是三国成形的前夕：魏已称帝，蜀、吴还没有。

```json
{
  "year": 220,
  "month": 10,
  "label": "曹丕称帝",
  "provinces": [
    {
      "province": "司隶",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "豫州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "兖州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "青州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "徐州",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "冀州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "幽州",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "并州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "雍州",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "凉州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "荆州（魏）",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "扬州（魏）",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "益州",
      "controller": "shu",
      "strength": "contested"
    },
    {
      "province": "扬州（吴）",
      "controller": "wu",
      "strength": "contested"
    },
    {
      "province": "荆州（吴）",
      "controller": "wu",
      "strength": "contested"
    },
    {
      "province": "交州",
      "controller": "shixie",
      "strength": "core"
    }
  ],
  "overrides": [
    {
      "name": "河南尹",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治洛阳，东汉旧名。魏、晋都城所在。"
    },
    {
      "name": "河内",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治怀县。"
    },
    {
      "name": "河东",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治安邑。247年分出平阳前，平阳一带仍属本郡。"
    },
    {
      "name": "弘农",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治弘农。函谷道所经。"
    },
    {
      "name": "颍川",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治阳翟。"
    },
    {
      "name": "襄城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末曹操分颍川置，治襄城。"
    },
    {
      "name": "汝南",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治新息，后常治平舆一带。"
    },
    {
      "name": "汝阴",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末分汝南置，治汝阴。"
    },
    {
      "name": "梁国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治睢阳。"
    },
    {
      "name": "沛国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治沛。"
    },
    {
      "name": "谯郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安末分沛国置，治谯，曹氏乡里。"
    },
    {
      "name": "鲁郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治鲁。"
    },
    {
      "name": "陈郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治陈。"
    },
    {
      "name": "弋阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安二十三年（218）分汝南、江夏置，治弋阳，滨江夏北缘。"
    },
    {
      "name": "安丰",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初初分庐江置，属豫州，治安风。设立或在220–222之间，各帧从220列入。"
    },
    {
      "name": "陈留",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治陈留。"
    },
    {
      "name": "东郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治濮阳。"
    },
    {
      "name": "济阴",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治定陶。"
    },
    {
      "name": "山阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治昌邑。"
    },
    {
      "name": "任城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治任城。"
    },
    {
      "name": "东平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治无盐。"
    },
    {
      "name": "济北",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治卢。"
    },
    {
      "name": "泰山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治奉高。"
    },
    {
      "name": "齐国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治临淄。"
    },
    {
      "name": "济南",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治东平陵。"
    },
    {
      "name": "乐安",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治临济。"
    },
    {
      "name": "北海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治平寿。"
    },
    {
      "name": "东莱",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治黄。"
    },
    {
      "name": "城阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安三年（198）分琅邪、北海置，治东武。"
    },
    {
      "name": "彭城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治彭城。魏徐州常治此。"
    },
    {
      "name": "下邳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治下邳。"
    },
    {
      "name": "东海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治郯。"
    },
    {
      "name": "琅邪",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治开阳。"
    },
    {
      "name": "东莞",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安三年（198）分琅邪置，治东莞。"
    },
    {
      "name": "广陵",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "治淮阴一带。江北属魏（晋），江南江都等县时被吴占据，沿江是拉锯带。"
    },
    {
      "name": "魏郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治邺。221年分出广平、阳平后辖境缩小。邺是曹操旧都，此后仍是河北重镇。"
    },
    {
      "name": "巨鹿",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治瘿陶。"
    },
    {
      "name": "赵国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治邯郸。"
    },
    {
      "name": "常山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治元氏。"
    },
    {
      "name": "中山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治卢奴。"
    },
    {
      "name": "安平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治信都。冀州治所黄初后常在此。"
    },
    {
      "name": "河间",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治乐成。"
    },
    {
      "name": "勃海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治南皮。"
    },
    {
      "name": "清河",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉曾名甘陵，魏复称清河，治清河。"
    },
    {
      "name": "平原",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡。建安十八年（213）自青州改属冀州，治平原。"
    },
    {
      "name": "乐陵",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安十八年（213）分平原、勃海置，治厌次。"
    },
    {
      "name": "章武",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安末分河间、勃海置。嘉平年间废，249帧仍列，263帧起不再单列。"
    },
    {
      "name": "涿郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治涿。黄初七年（226）改名范阳。"
    },
    {
      "name": "广阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治蓟（今北京西南）。太和六年（232）改燕国，234帧起改称燕国。"
    },
    {
      "name": "代郡",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治高柳。鲜卑压力大，郡境控制不稳定。"
    },
    {
      "name": "上谷",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治沮阳。北缘与鲜卑相邻。"
    },
    {
      "name": "渔阳",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治渔阳。边郡，乌桓旧地，控制比内地弱。"
    },
    {
      "name": "右北平",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治土垠。东与鲜卑、辽西相连。"
    },
    {
      "name": "辽西",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治阳乐。鲜卑经常进出，城池在、乡野不稳。"
    },
    {
      "name": "辽东属国",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧属国，在辽西、辽东之间。244年改昌黎郡。名义属魏，公孙氏与鲜卑都影响得到。"
    },
    {
      "name": "辽东",
      "controller": "gongsun_liaodong",
      "strength": "core",
      "contenders": [],
      "note": "公孙氏治襄平。"
    },
    {
      "name": "玄菟",
      "controller": "gongsun_liaodong",
      "strength": "weak",
      "contenders": [],
      "note": "治高句骊县旧地，郡境受高句丽挤压。238年前随公孙氏，其后归魏、晋。244年毌丘俭出击高句丽，并未把其地改为魏郡。"
    },
    {
      "name": "乐浪",
      "controller": "gongsun_liaodong",
      "strength": "core",
      "contenders": [],
      "note": "朝鲜半岛北部旧郡，治朝鲜县。238年前由公孙氏管，其后归魏、晋。"
    },
    {
      "name": "带方",
      "controller": "gongsun_liaodong",
      "strength": "core",
      "contenders": [],
      "note": "建安末公孙康分乐浪南部置。238年后归魏、晋。倭使接触曹魏，多经此郡。"
    },
    {
      "name": "太原",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治晋阳。并州治所。"
    },
    {
      "name": "上党",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治壶关，后常治潞。"
    },
    {
      "name": "西河",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治离石。南匈奴五部所在，行政在，部落势力大。"
    },
    {
      "name": "雁门",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治广武。鲜卑、匈奴交会，边郡。"
    },
    {
      "name": "新兴",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十年（215）废云中、定襄、五原、朔方，分太原置新兴以处其民，治九原。四郡故地不再设郡。"
    },
    {
      "name": "乐平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安二十一年（216）分上党、太原置，治沾。"
    },
    {
      "name": "京兆",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治长安。魏改左冯翊为冯翊、右扶风为扶风，三辅仍是关中核心。"
    },
    {
      "name": "冯翊",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "魏改左冯翊为冯翊郡，治临晋。"
    },
    {
      "name": "扶风",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "魏改右扶风为扶风郡，治槐里。"
    },
    {
      "name": "北地",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治泥阳。羌乱反复，乡野控制弱。"
    },
    {
      "name": "新平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "兴平元年（194）分安定、扶风置，治漆。"
    },
    {
      "name": "安定",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治临泾。陇东军事重镇，羌人时叛，郡治仍在魏、晋手中。"
    },
    {
      "name": "陇西",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治襄武。黄初曾短暂设秦州，旋废，本帧陇右仍属雍州。"
    },
    {
      "name": "南安",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "中平五年（188）分汉阳置，治獂道。228年诸葛亮第一次北伐时曾降蜀，随即复归魏。"
    },
    {
      "name": "天水",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治冀县。228年郡中诸县多应诸葛亮，街亭败后复归魏。"
    },
    {
      "name": "广魏",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末由永阳改广魏，治临渭。约泰始中改名略阳。271帧起书略阳，并划入秦州。"
    },
    {
      "name": "武都",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "治下辨。氐人聚居，与蜀争夺。229年入蜀。"
    },
    {
      "name": "阴平",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "治阴平。本广汉属国改郡，地险，氐羌杂居。229年入蜀。"
    },
    {
      "name": "金城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治榆中一带。建安末又分金城置西平。河西东口，羌、鲜卑时常扰动，郡治仍在。"
    },
    {
      "name": "武威",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "凉州治所，姑臧。271年鲜卑树机能已杀两任刺史，河西震动，本帧标弱。279年十二月马隆斩树机能，280年凉州平。"
    },
    {
      "name": "张掖",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治张掖。"
    },
    {
      "name": "酒泉",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治福禄。"
    },
    {
      "name": "敦煌",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治敦煌。走廊西端，行政在，离中原极远。"
    },
    {
      "name": "西郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "兴平二年（195）分张掖置，治日勒。"
    },
    {
      "name": "西平",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "建安末分金城置，治西都。羌人势力大。"
    },
    {
      "name": "西海",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，居延一带。户籍与驻军都少，近于边地哨所。"
    },
    {
      "name": "南阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治宛。魏荆州初治宛。"
    },
    {
      "name": "南乡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安十三年（208）分南阳置，治南乡。"
    },
    {
      "name": "襄阳",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "建安十三年（208）分南郡置，治襄阳。城为魏有，汉水一线与吴对峙。"
    },
    {
      "name": "义阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初初分南阳、江夏置。嘉平中废。249帧仍列，其后不再单列，晋平吴后另有义阳，不提前写入。"
    },
    {
      "name": "江夏（沔北）",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉江夏郡跨汉水。魏领安陆、石阳等沔北诸县。236年吴曾短暂占新市、安陆，随即失去。与吴境“江夏（江南）”是一郡分涂，地图需沿汉水切开。"
    },
    {
      "name": "新城",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "黄初元年（220）七月合房陵、上庸、西城为新城，治房陵。227年孟达叛，司马懿迅即平定。263年蜀灭前与蜀隔山对峙，其后不再是国境。"
    },
    {
      "name": "淮南",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉九江郡，魏改称淮南，治寿春。合肥、寿春是对吴主战场。249年后诸葛诞等淮南三叛都发生在此，叛平后仍属魏，不是吴土。"
    },
    {
      "name": "庐江（皖北）",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉庐江郡被魏、吴分成两块。魏领皖北，合肥为其军镇。与吴境“庐江（皖）”须沿江切开。"
    },
    {
      "name": "蜀郡",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治成都。蜀汉都城，263年后为晋益州核心。"
    },
    {
      "name": "广汉",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治雒。265年梁州析出后改属梁州。"
    },
    {
      "name": "梓潼",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "建安二十二年（217）分广汉置，治梓潼。刘备入蜀时已有。"
    },
    {
      "name": "犍为",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治武阳。"
    },
    {
      "name": "江阳",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "建安十八年（213）分犍为置，治江阳。"
    },
    {
      "name": "汶山",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "建安末分蜀郡置，治绵虒。羌人地区，控制弱。"
    },
    {
      "name": "蜀郡属国",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉属国，治汉嘉。221年改汉嘉郡。羌、叟所居，控制弱。"
    },
    {
      "name": "巴郡",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治江州（今重庆）。刘璋时已与巴西、巴东分治。"
    },
    {
      "name": "巴西",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治阆中。"
    },
    {
      "name": "固陵",
      "controller": "shu",
      "strength": "contested",
      "contenders": [
        "shu",
        "wu"
      ],
      "note": "巴东前身。221年复名巴东，治鱼复。东境巫县一带与吴相接。"
    },
    {
      "name": "涪陵",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "建安末改巴东属国为涪陵，治涪陵。滨五溪，248年邓芝曾讨郡夷，控制弱于成都平原。"
    },
    {
      "name": "宕渠",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "建安末一度分巴西置，章武年间并回巴西。仅220帧列出，其后不再单列。"
    },
    {
      "name": "汉中",
      "controller": "shu",
      "strength": "contested",
      "contenders": [
        "shu",
        "wei"
      ],
      "note": "219年刘备所得，治南郑。北缘阳平关与魏对峙，郡境本身是蜀的北边大门。"
    },
    {
      "name": "益州郡",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治滇池。223年起雍闿等叛，太守不能进郡。225年改名建宁。"
    },
    {
      "name": "牂柯",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治故且兰。223–225年曾叛，平后仍弱。271年宁州初置时尚未划入，仍属益州。"
    },
    {
      "name": "越巂",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治邛都。223年叛，240年张嶷重新打通郡道，其后仍弱。271年仍属益州。"
    },
    {
      "name": "永昌",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治不韦，远至今云南西部。南中叛乱时吕凯为蜀守住郡境。271年《晋书》把它算入宁州（或写作交州之永昌）。"
    },
    {
      "name": "朱提",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十年（215）刘备改犍为属国为朱提，治朱提。《晋书》或系于221年。接近南中，控制弱。延熙中曾分南广，约九年即废，各帧不单列。"
    },
    {
      "name": "丹阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治建业。郡治一带是吴的政治核心；郡南山区山越反复，没有单列到县。"
    },
    {
      "name": "吴郡",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治吴县。"
    },
    {
      "name": "会稽",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治山阴。257年分临海，260年分建安，266年分东阳，故后期辖境缩小。"
    },
    {
      "name": "豫章",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治南昌。"
    },
    {
      "name": "庐陵",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "建安初分豫章置，治西昌。236年又分南部都尉。"
    },
    {
      "name": "鄱阳",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "建安十五年（210）分豫章置，治鄱阳。山越刚被贺齐压住，220–222标弱。"
    },
    {
      "name": "新都（扬）",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "建安十三年（208）分丹阳置，治始新。为控制山越而设，全境标弱。"
    },
    {
      "name": "庐江（皖）",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "吴领庐江郡江南、皖城一带，治皖。与魏“庐江（皖北）”是一郡分涂。"
    },
    {
      "name": "蕲春",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "建安十三年（208）分江夏置，属扬州。建安末入魏，黄武二年（223）复归吴。220与222帧归魏。"
    },
    {
      "name": "南郡",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治江陵。219年吕蒙袭取。江陵是吴西边军镇，北与魏襄阳对峙，城本身长期在吴手中。"
    },
    {
      "name": "宜都",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "shu"
      ],
      "note": "219年入吴，治夷道。222年夷陵之战后蜀军退出，此前巫、秭归一线仍在拉锯。"
    },
    {
      "name": "江夏（江南）",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "吴领鄂、夏口、武昌（今鄂州）及江南诸县。221–229年、265–266年吴都在武昌，即本郡境。与魏“江夏（沔北）”须沿汉水切开。"
    },
    {
      "name": "长沙",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治临湘。257年分出衡阳、湘东，辖境缩小。"
    },
    {
      "name": "零陵",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治泉陵。265年分始安，266年分昭陵。"
    },
    {
      "name": "桂阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治郴。265年分始兴。"
    },
    {
      "name": "武陵",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "治临沅。沅水上游蛮族聚居，郡治在、溪峒弱。263年分天门。"
    },
    {
      "name": "交趾",
      "controller": "shixie",
      "strength": "core",
      "contenders": [],
      "note": "治龙编。士燮本人驻此。名义上孙权有交州刺史，实际士家管事。"
    },
    {
      "name": "九真",
      "controller": "shixie",
      "strength": "weak",
      "contenders": [],
      "note": "士家子弟参与治理。当地越人势力大。"
    },
    {
      "name": "日南",
      "controller": "shixie",
      "strength": "weak",
      "contenders": [],
      "note": "最南旧郡，象林县汉末已废，控制更弱。"
    },
    {
      "name": "合浦",
      "controller": "shixie",
      "strength": "weak",
      "contenders": [],
      "note": "士家势力可及。州境北部与苍梧相连。"
    },
    {
      "name": "南海",
      "controller": "shixie",
      "strength": "weak",
      "contenders": [],
      "note": "士燮之弟曾为南海太守。吴亦派刺史，驻番禺一带。"
    },
    {
      "name": "苍梧",
      "controller": "shixie",
      "strength": "weak",
      "contenders": [],
      "note": "交州州治曾在广信。吴刺史与士家并存，本帧整体算士燮势力范围。"
    },
    {
      "name": "郁林",
      "controller": "shixie",
      "strength": "weak",
      "contenders": [],
      "note": "岭西旧郡，控制松。"
    },
    {
      "name": "高凉",
      "controller": "shixie",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十五年（220）分合浦置，治安宁。刚设立，势力属交州士家一边。"
    }
  ],
  "capitals": [
    {
      "faction": "wei",
      "city": "洛阳",
      "lng": 112.62,
      "lat": 34.72,
      "role": "都城"
    },
    {
      "faction": "shu",
      "city": "成都",
      "lng": 104.06,
      "lat": 30.67,
      "role": "都城"
    },
    {
      "faction": "wu",
      "city": "建业",
      "lng": 118.78,
      "lat": 31.95,
      "role": "都城"
    },
    {
      "faction": "gongsun_liaodong",
      "city": "襄平",
      "lng": 123.17,
      "lat": 41.27,
      "role": "都城"
    },
    {
      "faction": "shixie",
      "city": "龙编",
      "lng": 105.97,
      "lat": 21.18,
      "role": "治所"
    }
  ],
  "sources": [
    "《三国志》魏书文帝纪、明帝纪、三少帝纪、明悼毛后无关；蜀书先主传、后主传；吴书吴主传、三嗣主传。交趾、辽东、南中细节见吕岱、士燮、公孙度、诸葛亮、霍弋等传。",
    "《晋书》卷三武帝纪（泰始五年置秦州、泰始七年七月交趾三郡降吴、八月置宁州、咸宁二年置平州、咸宁五年十二月凉州平、太康元年平吴）；卷十四至十五地理志。",
    "《资治通鉴》卷六十九至八十一。灭蜀月份从《三国志·三少帝纪》景元四年十一月，通鉴或系于十月。",
    "郡的置废主要对照《晋书·地理志》《华阳国志》巴志、蜀志、南中志，以及清人洪亮吉《补三国疆域志》、吴增仅《三国郡县表》、近人陈健梅《孙吴政区地理研究》的结论；与谭其骧《中国历史地图集》第三册“三国时期”标准年代（魏景元三年，262年）对读。维基百科条目只用来查找上述书的线索，有出入时以史志为准。"
  ]
}
```

## 222 年 夷陵之战后

刘备为夺荆州，从三峡打到夷陵，公元222年被陆逊击败，退回永安。吴和蜀的边界从此大体定在三峡。孙权前一年已把都城迁到武昌（今湖北鄂州），这一年又和魏翻脸。交州仍由士燮家族掌管。黄初年间魏曾短暂设置秦州，很快废掉，所以陇右在这张图上仍算雍州。

```json
{
  "year": 222,
  "month": 8,
  "label": "夷陵之战后",
  "provinces": [
    {
      "province": "司隶",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "豫州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "兖州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "青州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "徐州",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "冀州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "幽州",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "并州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "雍州",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "凉州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "荆州（魏）",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "扬州（魏）",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "益州",
      "controller": "shu",
      "strength": "contested"
    },
    {
      "province": "扬州（吴）",
      "controller": "wu",
      "strength": "contested"
    },
    {
      "province": "荆州（吴）",
      "controller": "wu",
      "strength": "contested"
    },
    {
      "province": "交州",
      "controller": "shixie",
      "strength": "core"
    }
  ],
  "overrides": [
    {
      "name": "河南尹",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治洛阳，东汉旧名。魏、晋都城所在。"
    },
    {
      "name": "河内",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治怀县。"
    },
    {
      "name": "河东",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治安邑。247年分出平阳前，平阳一带仍属本郡。"
    },
    {
      "name": "弘农",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治弘农。函谷道所经。"
    },
    {
      "name": "颍川",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治阳翟。"
    },
    {
      "name": "襄城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末曹操分颍川置，治襄城。"
    },
    {
      "name": "汝南",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治新息，后常治平舆一带。"
    },
    {
      "name": "汝阴",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末分汝南置，治汝阴。"
    },
    {
      "name": "梁国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治睢阳。"
    },
    {
      "name": "沛国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治沛。"
    },
    {
      "name": "谯郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安末分沛国置，治谯，曹氏乡里。"
    },
    {
      "name": "鲁郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治鲁。"
    },
    {
      "name": "陈郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治陈。"
    },
    {
      "name": "弋阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安二十三年（218）分汝南、江夏置，治弋阳，滨江夏北缘。"
    },
    {
      "name": "安丰",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初初分庐江置，属豫州，治安风。设立或在220–222之间，各帧从220列入。"
    },
    {
      "name": "陈留",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治陈留。"
    },
    {
      "name": "东郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治濮阳。"
    },
    {
      "name": "济阴",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治定陶。"
    },
    {
      "name": "山阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治昌邑。"
    },
    {
      "name": "任城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治任城。"
    },
    {
      "name": "东平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治无盐。"
    },
    {
      "name": "济北",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治卢。"
    },
    {
      "name": "泰山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治奉高。"
    },
    {
      "name": "齐国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治临淄。"
    },
    {
      "name": "济南",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治东平陵。"
    },
    {
      "name": "乐安",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治临济。"
    },
    {
      "name": "北海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治平寿。"
    },
    {
      "name": "东莱",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治黄。"
    },
    {
      "name": "城阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安三年（198）分琅邪、北海置，治东武。"
    },
    {
      "name": "彭城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治彭城。魏徐州常治此。"
    },
    {
      "name": "下邳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治下邳。"
    },
    {
      "name": "东海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治郯。"
    },
    {
      "name": "琅邪",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治开阳。"
    },
    {
      "name": "东莞",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安三年（198）分琅邪置，治东莞。"
    },
    {
      "name": "广陵",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "治淮阴一带。江北属魏（晋），江南江都等县时被吴占据，沿江是拉锯带。"
    },
    {
      "name": "魏郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治邺。221年分出广平、阳平后辖境缩小。邺是曹操旧都，此后仍是河北重镇。"
    },
    {
      "name": "广平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初二年（221）分魏郡置，治曲梁。"
    },
    {
      "name": "阳平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初二年（221）分魏郡置，治馆陶。"
    },
    {
      "name": "巨鹿",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治瘿陶。"
    },
    {
      "name": "赵国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治邯郸。"
    },
    {
      "name": "常山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治元氏。"
    },
    {
      "name": "中山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治卢奴。"
    },
    {
      "name": "安平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治信都。冀州治所黄初后常在此。"
    },
    {
      "name": "河间",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治乐成。"
    },
    {
      "name": "勃海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治南皮。"
    },
    {
      "name": "清河",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉曾名甘陵，魏复称清河，治清河。"
    },
    {
      "name": "平原",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡。建安十八年（213）自青州改属冀州，治平原。"
    },
    {
      "name": "乐陵",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安十八年（213）分平原、勃海置，治厌次。"
    },
    {
      "name": "章武",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安末分河间、勃海置。嘉平年间废，249帧仍列，263帧起不再单列。"
    },
    {
      "name": "涿郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治涿。黄初七年（226）改名范阳。"
    },
    {
      "name": "广阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治蓟（今北京西南）。太和六年（232）改燕国，234帧起改称燕国。"
    },
    {
      "name": "代郡",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治高柳。鲜卑压力大，郡境控制不稳定。"
    },
    {
      "name": "上谷",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治沮阳。北缘与鲜卑相邻。"
    },
    {
      "name": "渔阳",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治渔阳。边郡，乌桓旧地，控制比内地弱。"
    },
    {
      "name": "右北平",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治土垠。东与鲜卑、辽西相连。"
    },
    {
      "name": "辽西",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治阳乐。鲜卑经常进出，城池在、乡野不稳。"
    },
    {
      "name": "辽东属国",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧属国，在辽西、辽东之间。244年改昌黎郡。名义属魏，公孙氏与鲜卑都影响得到。"
    },
    {
      "name": "辽东",
      "controller": "gongsun_liaodong",
      "strength": "core",
      "contenders": [],
      "note": "公孙氏治襄平。"
    },
    {
      "name": "玄菟",
      "controller": "gongsun_liaodong",
      "strength": "weak",
      "contenders": [],
      "note": "治高句骊县旧地，郡境受高句丽挤压。238年前随公孙氏，其后归魏、晋。244年毌丘俭出击高句丽，并未把其地改为魏郡。"
    },
    {
      "name": "乐浪",
      "controller": "gongsun_liaodong",
      "strength": "core",
      "contenders": [],
      "note": "朝鲜半岛北部旧郡，治朝鲜县。238年前由公孙氏管，其后归魏、晋。"
    },
    {
      "name": "带方",
      "controller": "gongsun_liaodong",
      "strength": "core",
      "contenders": [],
      "note": "建安末公孙康分乐浪南部置。238年后归魏、晋。倭使接触曹魏，多经此郡。"
    },
    {
      "name": "太原",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治晋阳。并州治所。"
    },
    {
      "name": "上党",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治壶关，后常治潞。"
    },
    {
      "name": "西河",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治离石。南匈奴五部所在，行政在，部落势力大。"
    },
    {
      "name": "雁门",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治广武。鲜卑、匈奴交会，边郡。"
    },
    {
      "name": "新兴",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十年（215）废云中、定襄、五原、朔方，分太原置新兴以处其民，治九原。四郡故地不再设郡。"
    },
    {
      "name": "乐平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安二十一年（216）分上党、太原置，治沾。"
    },
    {
      "name": "京兆",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治长安。魏改左冯翊为冯翊、右扶风为扶风，三辅仍是关中核心。"
    },
    {
      "name": "冯翊",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "魏改左冯翊为冯翊郡，治临晋。"
    },
    {
      "name": "扶风",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "魏改右扶风为扶风郡，治槐里。"
    },
    {
      "name": "北地",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治泥阳。羌乱反复，乡野控制弱。"
    },
    {
      "name": "新平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "兴平元年（194）分安定、扶风置，治漆。"
    },
    {
      "name": "安定",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治临泾。陇东军事重镇，羌人时叛，郡治仍在魏、晋手中。"
    },
    {
      "name": "陇西",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治襄武。黄初曾短暂设秦州，旋废，本帧陇右仍属雍州。"
    },
    {
      "name": "南安",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "中平五年（188）分汉阳置，治獂道。228年诸葛亮第一次北伐时曾降蜀，随即复归魏。"
    },
    {
      "name": "天水",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治冀县。228年郡中诸县多应诸葛亮，街亭败后复归魏。"
    },
    {
      "name": "广魏",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末由永阳改广魏，治临渭。约泰始中改名略阳。271帧起书略阳，并划入秦州。"
    },
    {
      "name": "武都",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "治下辨。氐人聚居，与蜀争夺。229年入蜀。"
    },
    {
      "name": "阴平",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "治阴平。本广汉属国改郡，地险，氐羌杂居。229年入蜀。"
    },
    {
      "name": "金城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治榆中一带。建安末又分金城置西平。河西东口，羌、鲜卑时常扰动，郡治仍在。"
    },
    {
      "name": "武威",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "凉州治所，姑臧。271年鲜卑树机能已杀两任刺史，河西震动，本帧标弱。279年十二月马隆斩树机能，280年凉州平。"
    },
    {
      "name": "张掖",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治张掖。"
    },
    {
      "name": "酒泉",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治福禄。"
    },
    {
      "name": "敦煌",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治敦煌。走廊西端，行政在，离中原极远。"
    },
    {
      "name": "西郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "兴平二年（195）分张掖置，治日勒。"
    },
    {
      "name": "西平",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "建安末分金城置，治西都。羌人势力大。"
    },
    {
      "name": "西海",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，居延一带。户籍与驻军都少，近于边地哨所。"
    },
    {
      "name": "南阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治宛。魏荆州初治宛。"
    },
    {
      "name": "南乡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安十三年（208）分南阳置，治南乡。"
    },
    {
      "name": "襄阳",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "建安十三年（208）分南郡置，治襄阳。城为魏有，汉水一线与吴对峙。"
    },
    {
      "name": "义阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初初分南阳、江夏置。嘉平中废。249帧仍列，其后不再单列，晋平吴后另有义阳，不提前写入。"
    },
    {
      "name": "江夏（沔北）",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉江夏郡跨汉水。魏领安陆、石阳等沔北诸县。236年吴曾短暂占新市、安陆，随即失去。与吴境“江夏（江南）”是一郡分涂，地图需沿汉水切开。"
    },
    {
      "name": "新城",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "黄初元年（220）七月合房陵、上庸、西城为新城，治房陵。227年孟达叛，司马懿迅即平定。263年蜀灭前与蜀隔山对峙，其后不再是国境。"
    },
    {
      "name": "魏兴",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "215年曹操分汉中东部置西城郡，221年改名魏兴，治西城。220帧尚并在新城中。263年前与蜀对峙。"
    },
    {
      "name": "淮南",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉九江郡，魏改称淮南，治寿春。合肥、寿春是对吴主战场。249年后诸葛诞等淮南三叛都发生在此，叛平后仍属魏，不是吴土。"
    },
    {
      "name": "庐江（皖北）",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉庐江郡被魏、吴分成两块。魏领皖北，合肥为其军镇。与吴境“庐江（皖）”须沿江切开。"
    },
    {
      "name": "蜀郡",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治成都。蜀汉都城，263年后为晋益州核心。"
    },
    {
      "name": "广汉",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治雒。265年梁州析出后改属梁州。"
    },
    {
      "name": "梓潼",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "建安二十二年（217）分广汉置，治梓潼。刘备入蜀时已有。"
    },
    {
      "name": "犍为",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治武阳。"
    },
    {
      "name": "江阳",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "建安十八年（213）分犍为置，治江阳。"
    },
    {
      "name": "汶山",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "建安末分蜀郡置，治绵虒。羌人地区，控制弱。"
    },
    {
      "name": "汉嘉",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "章武元年（221）由蜀郡属国改名，治汉嘉。240年张嶷曾平郡乱，乡野仍弱。"
    },
    {
      "name": "巴郡",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治江州（今重庆）。刘璋时已与巴西、巴东分治。"
    },
    {
      "name": "巴西",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治阆中。"
    },
    {
      "name": "巴东",
      "controller": "shu",
      "strength": "contested",
      "contenders": [
        "shu",
        "wu"
      ],
      "note": "221年由固陵改名，治鱼复，222年改鱼复为永安。夷陵败后，蜀守三峡西口，与吴建平、宜都相对。"
    },
    {
      "name": "涪陵",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "建安末改巴东属国为涪陵，治涪陵。滨五溪，248年邓芝曾讨郡夷，控制弱于成都平原。"
    },
    {
      "name": "汉中",
      "controller": "shu",
      "strength": "contested",
      "contenders": [
        "shu",
        "wei"
      ],
      "note": "219年刘备所得，治南郑。北缘阳平关与魏对峙，郡境本身是蜀的北边大门。"
    },
    {
      "name": "益州郡",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治滇池。223年起雍闿等叛，太守不能进郡。225年改名建宁。"
    },
    {
      "name": "牂柯",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治故且兰。223–225年曾叛，平后仍弱。271年宁州初置时尚未划入，仍属益州。"
    },
    {
      "name": "越巂",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治邛都。223年叛，240年张嶷重新打通郡道，其后仍弱。271年仍属益州。"
    },
    {
      "name": "永昌",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治不韦，远至今云南西部。南中叛乱时吕凯为蜀守住郡境。271年《晋书》把它算入宁州（或写作交州之永昌）。"
    },
    {
      "name": "朱提",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十年（215）刘备改犍为属国为朱提，治朱提。《晋书》或系于221年。接近南中，控制弱。延熙中曾分南广，约九年即废，各帧不单列。"
    },
    {
      "name": "丹阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治建业。郡治一带是吴的政治核心；郡南山区山越反复，没有单列到县。"
    },
    {
      "name": "吴郡",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治吴县。"
    },
    {
      "name": "会稽",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治山阴。257年分临海，260年分建安，266年分东阳，故后期辖境缩小。"
    },
    {
      "name": "豫章",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治南昌。"
    },
    {
      "name": "庐陵",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "建安初分豫章置，治西昌。236年又分南部都尉。"
    },
    {
      "name": "鄱阳",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "建安十五年（210）分豫章置，治鄱阳。山越刚被贺齐压住，220–222标弱。"
    },
    {
      "name": "新都（扬）",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "建安十三年（208）分丹阳置，治始新。为控制山越而设，全境标弱。"
    },
    {
      "name": "庐江（皖）",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "吴领庐江郡江南、皖城一带，治皖。与魏“庐江（皖北）”是一郡分涂。"
    },
    {
      "name": "蕲春",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "建安十三年（208）分江夏置，属扬州。建安末入魏，黄武二年（223）复归吴。220与222帧归魏。"
    },
    {
      "name": "南郡",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治江陵。219年吕蒙袭取。江陵是吴西边军镇，北与魏襄阳对峙，城本身长期在吴手中。"
    },
    {
      "name": "宜都",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "222年夷陵战败蜀后，夷陵改名西陵，郡境稳定属吴。260年分出建平。272年步阐据西陵降晋，数月后被陆抗夺回，不单独成帧。"
    },
    {
      "name": "江夏（江南）",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "吴领鄂、夏口、武昌（今鄂州）及江南诸县。221–229年、265–266年吴都在武昌，即本郡境。与魏“江夏（沔北）”须沿汉水切开。"
    },
    {
      "name": "长沙",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治临湘。257年分出衡阳、湘东，辖境缩小。"
    },
    {
      "name": "零陵",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治泉陵。265年分始安，266年分昭陵。"
    },
    {
      "name": "桂阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治郴。265年分始兴。"
    },
    {
      "name": "武陵",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "治临沅。沅水上游蛮族聚居，郡治在、溪峒弱。263年分天门。"
    },
    {
      "name": "交趾",
      "controller": "shixie",
      "strength": "core",
      "contenders": [],
      "note": "治龙编。士燮本人驻此。名义上孙权有交州刺史，实际士家管事。"
    },
    {
      "name": "九真",
      "controller": "shixie",
      "strength": "weak",
      "contenders": [],
      "note": "士家子弟参与治理。当地越人势力大。"
    },
    {
      "name": "日南",
      "controller": "shixie",
      "strength": "weak",
      "contenders": [],
      "note": "最南旧郡，象林县汉末已废，控制更弱。"
    },
    {
      "name": "合浦",
      "controller": "shixie",
      "strength": "weak",
      "contenders": [],
      "note": "士家势力可及。州境北部与苍梧相连。"
    },
    {
      "name": "南海",
      "controller": "shixie",
      "strength": "weak",
      "contenders": [],
      "note": "士燮之弟曾为南海太守。吴亦派刺史，驻番禺一带。"
    },
    {
      "name": "苍梧",
      "controller": "shixie",
      "strength": "weak",
      "contenders": [],
      "note": "交州州治曾在广信。吴刺史与士家并存，本帧整体算士燮势力范围。"
    },
    {
      "name": "郁林",
      "controller": "shixie",
      "strength": "weak",
      "contenders": [],
      "note": "岭西旧郡，控制松。"
    },
    {
      "name": "高凉",
      "controller": "shixie",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十五年（220）分合浦置，治安宁。刚设立，势力属交州士家一边。"
    }
  ],
  "capitals": [
    {
      "faction": "wei",
      "city": "洛阳",
      "lng": 112.62,
      "lat": 34.72,
      "role": "都城"
    },
    {
      "faction": "shu",
      "city": "成都",
      "lng": 104.06,
      "lat": 30.67,
      "role": "都城"
    },
    {
      "faction": "wu",
      "city": "武昌",
      "lng": 114.89,
      "lat": 30.4,
      "role": "都城"
    },
    {
      "faction": "wu",
      "city": "建业",
      "lng": 118.78,
      "lat": 31.95,
      "role": "陪都"
    },
    {
      "faction": "gongsun_liaodong",
      "city": "襄平",
      "lng": 123.17,
      "lat": 41.27,
      "role": "都城"
    },
    {
      "faction": "shixie",
      "city": "龙编",
      "lng": 105.97,
      "lat": 21.18,
      "role": "治所"
    }
  ],
  "sources": [
    "《三国志》魏书文帝纪、明帝纪、三少帝纪、明悼毛后无关；蜀书先主传、后主传；吴书吴主传、三嗣主传。交趾、辽东、南中细节见吕岱、士燮、公孙度、诸葛亮、霍弋等传。",
    "《晋书》卷三武帝纪（泰始五年置秦州、泰始七年七月交趾三郡降吴、八月置宁州、咸宁二年置平州、咸宁五年十二月凉州平、太康元年平吴）；卷十四至十五地理志。",
    "《资治通鉴》卷六十九至八十一。灭蜀月份从《三国志·三少帝纪》景元四年十一月，通鉴或系于十月。",
    "郡的置废主要对照《晋书·地理志》《华阳国志》巴志、蜀志、南中志，以及清人洪亮吉《补三国疆域志》、吴增仅《三国郡县表》、近人陈健梅《孙吴政区地理研究》的结论；与谭其骧《中国历史地图集》第三册“三国时期”标准年代（魏景元三年，262年）对读。维基百科条目只用来查找上述书的线索，有出入时以史志为准。"
  ]
}
```

## 225 年 南中平定

诸葛亮在公元225年秋天平定南中，把益州郡改名建宁，新设云南、兴古两郡。南中在地图上算蜀的，但当地大姓势力很大，不能看成和成都一样的稳固统治。吴和蜀已经重新结盟。交州这一年士燮还在，要到下一年才由吴直接接管。

```json
{
  "year": 225,
  "month": 9,
  "label": "南中平定",
  "provinces": [
    {
      "province": "司隶",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "豫州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "兖州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "青州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "徐州",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "冀州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "幽州",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "并州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "雍州",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "凉州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "荆州（魏）",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "扬州（魏）",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "益州",
      "controller": "shu",
      "strength": "contested"
    },
    {
      "province": "扬州（吴）",
      "controller": "wu",
      "strength": "contested"
    },
    {
      "province": "荆州（吴）",
      "controller": "wu",
      "strength": "contested"
    },
    {
      "province": "交州",
      "controller": "shixie",
      "strength": "core"
    }
  ],
  "overrides": [
    {
      "name": "河南尹",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治洛阳，东汉旧名。魏、晋都城所在。"
    },
    {
      "name": "河内",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治怀县。"
    },
    {
      "name": "河东",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治安邑。247年分出平阳前，平阳一带仍属本郡。"
    },
    {
      "name": "弘农",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治弘农。函谷道所经。"
    },
    {
      "name": "颍川",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治阳翟。"
    },
    {
      "name": "襄城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末曹操分颍川置，治襄城。"
    },
    {
      "name": "汝南",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治新息，后常治平舆一带。"
    },
    {
      "name": "汝阴",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末分汝南置，治汝阴。"
    },
    {
      "name": "梁国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治睢阳。"
    },
    {
      "name": "沛国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治沛。"
    },
    {
      "name": "谯郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安末分沛国置，治谯，曹氏乡里。"
    },
    {
      "name": "鲁郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治鲁。"
    },
    {
      "name": "陈郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治陈。"
    },
    {
      "name": "弋阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安二十三年（218）分汝南、江夏置，治弋阳，滨江夏北缘。"
    },
    {
      "name": "安丰",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初初分庐江置，属豫州，治安风。设立或在220–222之间，各帧从220列入。"
    },
    {
      "name": "陈留",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治陈留。"
    },
    {
      "name": "东郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治濮阳。"
    },
    {
      "name": "济阴",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治定陶。"
    },
    {
      "name": "山阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治昌邑。"
    },
    {
      "name": "任城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治任城。"
    },
    {
      "name": "东平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治无盐。"
    },
    {
      "name": "济北",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治卢。"
    },
    {
      "name": "泰山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治奉高。"
    },
    {
      "name": "齐国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治临淄。"
    },
    {
      "name": "济南",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治东平陵。"
    },
    {
      "name": "乐安",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治临济。"
    },
    {
      "name": "北海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治平寿。"
    },
    {
      "name": "东莱",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治黄。"
    },
    {
      "name": "城阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安三年（198）分琅邪、北海置，治东武。"
    },
    {
      "name": "彭城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治彭城。魏徐州常治此。"
    },
    {
      "name": "下邳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治下邳。"
    },
    {
      "name": "东海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治郯。"
    },
    {
      "name": "琅邪",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治开阳。"
    },
    {
      "name": "东莞",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安三年（198）分琅邪置，治东莞。"
    },
    {
      "name": "广陵",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "治淮阴一带。江北属魏（晋），江南江都等县时被吴占据，沿江是拉锯带。"
    },
    {
      "name": "魏郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治邺。221年分出广平、阳平后辖境缩小。邺是曹操旧都，此后仍是河北重镇。"
    },
    {
      "name": "广平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初二年（221）分魏郡置，治曲梁。"
    },
    {
      "name": "阳平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初二年（221）分魏郡置，治馆陶。"
    },
    {
      "name": "巨鹿",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治瘿陶。"
    },
    {
      "name": "赵国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治邯郸。"
    },
    {
      "name": "常山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治元氏。"
    },
    {
      "name": "中山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治卢奴。"
    },
    {
      "name": "安平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治信都。冀州治所黄初后常在此。"
    },
    {
      "name": "河间",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治乐成。"
    },
    {
      "name": "勃海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治南皮。"
    },
    {
      "name": "清河",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉曾名甘陵，魏复称清河，治清河。"
    },
    {
      "name": "平原",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡。建安十八年（213）自青州改属冀州，治平原。"
    },
    {
      "name": "乐陵",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安十八年（213）分平原、勃海置，治厌次。"
    },
    {
      "name": "章武",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安末分河间、勃海置。嘉平年间废，249帧仍列，263帧起不再单列。"
    },
    {
      "name": "涿郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治涿。黄初七年（226）改名范阳。"
    },
    {
      "name": "广阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治蓟（今北京西南）。太和六年（232）改燕国，234帧起改称燕国。"
    },
    {
      "name": "代郡",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治高柳。鲜卑压力大，郡境控制不稳定。"
    },
    {
      "name": "上谷",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治沮阳。北缘与鲜卑相邻。"
    },
    {
      "name": "渔阳",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治渔阳。边郡，乌桓旧地，控制比内地弱。"
    },
    {
      "name": "右北平",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治土垠。东与鲜卑、辽西相连。"
    },
    {
      "name": "辽西",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治阳乐。鲜卑经常进出，城池在、乡野不稳。"
    },
    {
      "name": "辽东属国",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧属国，在辽西、辽东之间。244年改昌黎郡。名义属魏，公孙氏与鲜卑都影响得到。"
    },
    {
      "name": "辽东",
      "controller": "gongsun_liaodong",
      "strength": "core",
      "contenders": [],
      "note": "公孙氏治襄平。"
    },
    {
      "name": "玄菟",
      "controller": "gongsun_liaodong",
      "strength": "weak",
      "contenders": [],
      "note": "治高句骊县旧地，郡境受高句丽挤压。238年前随公孙氏，其后归魏、晋。244年毌丘俭出击高句丽，并未把其地改为魏郡。"
    },
    {
      "name": "乐浪",
      "controller": "gongsun_liaodong",
      "strength": "core",
      "contenders": [],
      "note": "朝鲜半岛北部旧郡，治朝鲜县。238年前由公孙氏管，其后归魏、晋。"
    },
    {
      "name": "带方",
      "controller": "gongsun_liaodong",
      "strength": "core",
      "contenders": [],
      "note": "建安末公孙康分乐浪南部置。238年后归魏、晋。倭使接触曹魏，多经此郡。"
    },
    {
      "name": "太原",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治晋阳。并州治所。"
    },
    {
      "name": "上党",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治壶关，后常治潞。"
    },
    {
      "name": "西河",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治离石。南匈奴五部所在，行政在，部落势力大。"
    },
    {
      "name": "雁门",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治广武。鲜卑、匈奴交会，边郡。"
    },
    {
      "name": "新兴",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十年（215）废云中、定襄、五原、朔方，分太原置新兴以处其民，治九原。四郡故地不再设郡。"
    },
    {
      "name": "乐平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安二十一年（216）分上党、太原置，治沾。"
    },
    {
      "name": "京兆",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治长安。魏改左冯翊为冯翊、右扶风为扶风，三辅仍是关中核心。"
    },
    {
      "name": "冯翊",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "魏改左冯翊为冯翊郡，治临晋。"
    },
    {
      "name": "扶风",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "魏改右扶风为扶风郡，治槐里。"
    },
    {
      "name": "北地",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治泥阳。羌乱反复，乡野控制弱。"
    },
    {
      "name": "新平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "兴平元年（194）分安定、扶风置，治漆。"
    },
    {
      "name": "安定",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治临泾。陇东军事重镇，羌人时叛，郡治仍在魏、晋手中。"
    },
    {
      "name": "陇西",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治襄武。黄初曾短暂设秦州，旋废，本帧陇右仍属雍州。"
    },
    {
      "name": "南安",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "中平五年（188）分汉阳置，治獂道。228年诸葛亮第一次北伐时曾降蜀，随即复归魏。"
    },
    {
      "name": "天水",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治冀县。228年郡中诸县多应诸葛亮，街亭败后复归魏。"
    },
    {
      "name": "广魏",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末由永阳改广魏，治临渭。约泰始中改名略阳。271帧起书略阳，并划入秦州。"
    },
    {
      "name": "武都",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "治下辨。氐人聚居，与蜀争夺。229年入蜀。"
    },
    {
      "name": "阴平",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "治阴平。本广汉属国改郡，地险，氐羌杂居。229年入蜀。"
    },
    {
      "name": "金城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治榆中一带。建安末又分金城置西平。河西东口，羌、鲜卑时常扰动，郡治仍在。"
    },
    {
      "name": "武威",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "凉州治所，姑臧。271年鲜卑树机能已杀两任刺史，河西震动，本帧标弱。279年十二月马隆斩树机能，280年凉州平。"
    },
    {
      "name": "张掖",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治张掖。"
    },
    {
      "name": "酒泉",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治福禄。"
    },
    {
      "name": "敦煌",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治敦煌。走廊西端，行政在，离中原极远。"
    },
    {
      "name": "西郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "兴平二年（195）分张掖置，治日勒。"
    },
    {
      "name": "西平",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "建安末分金城置，治西都。羌人势力大。"
    },
    {
      "name": "西海",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，居延一带。户籍与驻军都少，近于边地哨所。"
    },
    {
      "name": "南阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治宛。魏荆州初治宛。"
    },
    {
      "name": "南乡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安十三年（208）分南阳置，治南乡。"
    },
    {
      "name": "襄阳",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "建安十三年（208）分南郡置，治襄阳。城为魏有，汉水一线与吴对峙。"
    },
    {
      "name": "义阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初初分南阳、江夏置。嘉平中废。249帧仍列，其后不再单列，晋平吴后另有义阳，不提前写入。"
    },
    {
      "name": "江夏（沔北）",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉江夏郡跨汉水。魏领安陆、石阳等沔北诸县。236年吴曾短暂占新市、安陆，随即失去。与吴境“江夏（江南）”是一郡分涂，地图需沿汉水切开。"
    },
    {
      "name": "新城",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "黄初元年（220）七月合房陵、上庸、西城为新城，治房陵。227年孟达叛，司马懿迅即平定。263年蜀灭前与蜀隔山对峙，其后不再是国境。"
    },
    {
      "name": "魏兴",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "215年曹操分汉中东部置西城郡，221年改名魏兴，治西城。220帧尚并在新城中。263年前与蜀对峙。"
    },
    {
      "name": "淮南",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉九江郡，魏改称淮南，治寿春。合肥、寿春是对吴主战场。249年后诸葛诞等淮南三叛都发生在此，叛平后仍属魏，不是吴土。"
    },
    {
      "name": "庐江（皖北）",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉庐江郡被魏、吴分成两块。魏领皖北，合肥为其军镇。与吴境“庐江（皖）”须沿江切开。"
    },
    {
      "name": "蜀郡",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治成都。蜀汉都城，263年后为晋益州核心。"
    },
    {
      "name": "广汉",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治雒。265年梁州析出后改属梁州。"
    },
    {
      "name": "梓潼",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "建安二十二年（217）分广汉置，治梓潼。刘备入蜀时已有。"
    },
    {
      "name": "犍为",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治武阳。"
    },
    {
      "name": "江阳",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "建安十八年（213）分犍为置，治江阳。"
    },
    {
      "name": "汶山",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "建安末分蜀郡置，治绵虒。羌人地区，控制弱。"
    },
    {
      "name": "汉嘉",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "章武元年（221）由蜀郡属国改名，治汉嘉。240年张嶷曾平郡乱，乡野仍弱。"
    },
    {
      "name": "巴郡",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治江州（今重庆）。刘璋时已与巴西、巴东分治。"
    },
    {
      "name": "巴西",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治阆中。"
    },
    {
      "name": "巴东",
      "controller": "shu",
      "strength": "contested",
      "contenders": [
        "shu",
        "wu"
      ],
      "note": "221年由固陵改名，治鱼复，222年改鱼复为永安。夷陵败后，蜀守三峡西口，与吴建平、宜都相对。"
    },
    {
      "name": "涪陵",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "建安末改巴东属国为涪陵，治涪陵。滨五溪，248年邓芝曾讨郡夷，控制弱于成都平原。"
    },
    {
      "name": "汉中",
      "controller": "shu",
      "strength": "contested",
      "contenders": [
        "shu",
        "wei"
      ],
      "note": "219年刘备所得，治南郑。北缘阳平关与魏对峙，郡境本身是蜀的北边大门。"
    },
    {
      "name": "建宁",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "225年由益州郡改名。233年庲降都督才把治所稳定到味县。271年划入宁州。大姓势力大。"
    },
    {
      "name": "云南",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "225年分建宁、永昌置，治梇栋。271年属宁州。"
    },
    {
      "name": "兴古",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "225年分建宁、牂柯置，治宛温。271年属宁州。"
    },
    {
      "name": "牂柯",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治故且兰。223–225年曾叛，平后仍弱。271年宁州初置时尚未划入，仍属益州。"
    },
    {
      "name": "越巂",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治邛都。223年叛，240年张嶷重新打通郡道，其后仍弱。271年仍属益州。"
    },
    {
      "name": "永昌",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治不韦，远至今云南西部。南中叛乱时吕凯为蜀守住郡境。271年《晋书》把它算入宁州（或写作交州之永昌）。"
    },
    {
      "name": "朱提",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十年（215）刘备改犍为属国为朱提，治朱提。《晋书》或系于221年。接近南中，控制弱。延熙中曾分南广，约九年即废，各帧不单列。"
    },
    {
      "name": "丹阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治建业。郡治一带是吴的政治核心；郡南山区山越反复，没有单列到县。"
    },
    {
      "name": "吴郡",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治吴县。"
    },
    {
      "name": "会稽",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治山阴。257年分临海，260年分建安，266年分东阳，故后期辖境缩小。"
    },
    {
      "name": "豫章",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治南昌。"
    },
    {
      "name": "庐陵",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "建安初分豫章置，治西昌。236年又分南部都尉。"
    },
    {
      "name": "鄱阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "210年分豫章置，治鄱阳。225年以后郡治稳定，山区仍有零星山越。"
    },
    {
      "name": "新都（扬）",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "建安十三年（208）分丹阳置，治始新。为控制山越而设，全境标弱。"
    },
    {
      "name": "庐江（皖）",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "吴领庐江郡江南、皖城一带，治皖。与魏“庐江（皖北）”是一郡分涂。"
    },
    {
      "name": "蕲春",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "223年自魏收回，治蕲春。江北小郡，夹在两军之间。"
    },
    {
      "name": "南郡",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治江陵。219年吕蒙袭取。江陵是吴西边军镇，北与魏襄阳对峙，城本身长期在吴手中。"
    },
    {
      "name": "宜都",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "222年夷陵战败蜀后，夷陵改名西陵，郡境稳定属吴。260年分出建平。272年步阐据西陵降晋，数月后被陆抗夺回，不单独成帧。"
    },
    {
      "name": "江夏（江南）",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "吴领鄂、夏口、武昌（今鄂州）及江南诸县。221–229年、265–266年吴都在武昌，即本郡境。与魏“江夏（沔北）”须沿汉水切开。"
    },
    {
      "name": "长沙",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治临湘。257年分出衡阳、湘东，辖境缩小。"
    },
    {
      "name": "零陵",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治泉陵。265年分始安，266年分昭陵。"
    },
    {
      "name": "桂阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治郴。265年分始兴。"
    },
    {
      "name": "武陵",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "治临沅。沅水上游蛮族聚居，郡治在、溪峒弱。263年分天门。"
    },
    {
      "name": "交趾",
      "controller": "shixie",
      "strength": "core",
      "contenders": [],
      "note": "治龙编。士燮本人驻此。名义上孙权有交州刺史，实际士家管事。"
    },
    {
      "name": "九真",
      "controller": "shixie",
      "strength": "weak",
      "contenders": [],
      "note": "士家子弟参与治理。当地越人势力大。"
    },
    {
      "name": "日南",
      "controller": "shixie",
      "strength": "weak",
      "contenders": [],
      "note": "最南旧郡，象林县汉末已废，控制更弱。"
    },
    {
      "name": "合浦",
      "controller": "shixie",
      "strength": "weak",
      "contenders": [],
      "note": "士家势力可及。州境北部与苍梧相连。"
    },
    {
      "name": "南海",
      "controller": "shixie",
      "strength": "weak",
      "contenders": [],
      "note": "士燮之弟曾为南海太守。吴亦派刺史，驻番禺一带。"
    },
    {
      "name": "苍梧",
      "controller": "shixie",
      "strength": "weak",
      "contenders": [],
      "note": "交州州治曾在广信。吴刺史与士家并存，本帧整体算士燮势力范围。"
    },
    {
      "name": "郁林",
      "controller": "shixie",
      "strength": "weak",
      "contenders": [],
      "note": "岭西旧郡，控制松。"
    },
    {
      "name": "高凉",
      "controller": "shixie",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十五年（220）分合浦置，治安宁。刚设立，势力属交州士家一边。"
    }
  ],
  "capitals": [
    {
      "faction": "wei",
      "city": "洛阳",
      "lng": 112.62,
      "lat": 34.72,
      "role": "都城"
    },
    {
      "faction": "shu",
      "city": "成都",
      "lng": 104.06,
      "lat": 30.67,
      "role": "都城"
    },
    {
      "faction": "wu",
      "city": "武昌",
      "lng": 114.89,
      "lat": 30.4,
      "role": "都城"
    },
    {
      "faction": "wu",
      "city": "建业",
      "lng": 118.78,
      "lat": 31.95,
      "role": "陪都"
    },
    {
      "faction": "gongsun_liaodong",
      "city": "襄平",
      "lng": 123.17,
      "lat": 41.27,
      "role": "都城"
    },
    {
      "faction": "shixie",
      "city": "龙编",
      "lng": 105.97,
      "lat": 21.18,
      "role": "治所"
    }
  ],
  "sources": [
    "《三国志》魏书文帝纪、明帝纪、三少帝纪、明悼毛后无关；蜀书先主传、后主传；吴书吴主传、三嗣主传。交趾、辽东、南中细节见吕岱、士燮、公孙度、诸葛亮、霍弋等传。",
    "《晋书》卷三武帝纪（泰始五年置秦州、泰始七年七月交趾三郡降吴、八月置宁州、咸宁二年置平州、咸宁五年十二月凉州平、太康元年平吴）；卷十四至十五地理志。",
    "《资治通鉴》卷六十九至八十一。灭蜀月份从《三国志·三少帝纪》景元四年十一月，通鉴或系于十月。",
    "郡的置废主要对照《晋书·地理志》《华阳国志》巴志、蜀志、南中志，以及清人洪亮吉《补三国疆域志》、吴增仅《三国郡县表》、近人陈健梅《孙吴政区地理研究》的结论；与谭其骧《中国历史地图集》第三册“三国时期”标准年代（魏景元三年，262年）对读。维基百科条目只用来查找上述书的线索，有出入时以史志为准。"
  ]
}
```

## 226 年 交州归吴直辖

士燮死于公元226年，儿子士徽不肯交出交趾，被吴将吕岱消灭，交州改由吴直接任命官员。孙权曾把岭南分成广州和交州，士氏一灭，广州又合并回交州，所以本帧不单列广州。同年，吴分苍梧设立临贺郡，划给荆州。魏在这一年改涿郡为范阳；曹丕去世、曹叡即位，疆域没有因此改变。

```json
{
  "year": 226,
  "month": 7,
  "label": "交州归吴直辖",
  "provinces": [
    {
      "province": "司隶",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "豫州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "兖州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "青州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "徐州",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "冀州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "幽州",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "并州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "雍州",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "凉州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "荆州（魏）",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "扬州（魏）",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "益州",
      "controller": "shu",
      "strength": "contested"
    },
    {
      "province": "扬州（吴）",
      "controller": "wu",
      "strength": "contested"
    },
    {
      "province": "荆州（吴）",
      "controller": "wu",
      "strength": "contested"
    },
    {
      "province": "交州",
      "controller": "wu",
      "strength": "core"
    }
  ],
  "overrides": [
    {
      "name": "河南尹",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治洛阳，东汉旧名。魏、晋都城所在。"
    },
    {
      "name": "河内",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治怀县。"
    },
    {
      "name": "河东",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治安邑。247年分出平阳前，平阳一带仍属本郡。"
    },
    {
      "name": "弘农",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治弘农。函谷道所经。"
    },
    {
      "name": "颍川",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治阳翟。"
    },
    {
      "name": "襄城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末曹操分颍川置，治襄城。"
    },
    {
      "name": "汝南",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治新息，后常治平舆一带。"
    },
    {
      "name": "汝阴",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末分汝南置，治汝阴。"
    },
    {
      "name": "梁国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治睢阳。"
    },
    {
      "name": "沛国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治沛。"
    },
    {
      "name": "谯郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安末分沛国置，治谯，曹氏乡里。"
    },
    {
      "name": "鲁郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治鲁。"
    },
    {
      "name": "陈郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治陈。"
    },
    {
      "name": "弋阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安二十三年（218）分汝南、江夏置，治弋阳，滨江夏北缘。"
    },
    {
      "name": "安丰",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初初分庐江置，属豫州，治安风。设立或在220–222之间，各帧从220列入。"
    },
    {
      "name": "陈留",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治陈留。"
    },
    {
      "name": "东郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治濮阳。"
    },
    {
      "name": "济阴",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治定陶。"
    },
    {
      "name": "山阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治昌邑。"
    },
    {
      "name": "任城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治任城。"
    },
    {
      "name": "东平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治无盐。"
    },
    {
      "name": "济北",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治卢。"
    },
    {
      "name": "泰山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治奉高。"
    },
    {
      "name": "齐国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治临淄。"
    },
    {
      "name": "济南",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治东平陵。"
    },
    {
      "name": "乐安",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治临济。"
    },
    {
      "name": "北海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治平寿。"
    },
    {
      "name": "东莱",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治黄。"
    },
    {
      "name": "城阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安三年（198）分琅邪、北海置，治东武。"
    },
    {
      "name": "彭城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治彭城。魏徐州常治此。"
    },
    {
      "name": "下邳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治下邳。"
    },
    {
      "name": "东海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治郯。"
    },
    {
      "name": "琅邪",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治开阳。"
    },
    {
      "name": "东莞",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安三年（198）分琅邪置，治东莞。"
    },
    {
      "name": "广陵",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "治淮阴一带。江北属魏（晋），江南江都等县时被吴占据，沿江是拉锯带。"
    },
    {
      "name": "魏郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治邺。221年分出广平、阳平后辖境缩小。邺是曹操旧都，此后仍是河北重镇。"
    },
    {
      "name": "广平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初二年（221）分魏郡置，治曲梁。"
    },
    {
      "name": "阳平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初二年（221）分魏郡置，治馆陶。"
    },
    {
      "name": "巨鹿",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治瘿陶。"
    },
    {
      "name": "赵国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治邯郸。"
    },
    {
      "name": "常山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治元氏。"
    },
    {
      "name": "中山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治卢奴。"
    },
    {
      "name": "安平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治信都。冀州治所黄初后常在此。"
    },
    {
      "name": "河间",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治乐成。"
    },
    {
      "name": "勃海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治南皮。"
    },
    {
      "name": "清河",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉曾名甘陵，魏复称清河，治清河。"
    },
    {
      "name": "平原",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡。建安十八年（213）自青州改属冀州，治平原。"
    },
    {
      "name": "乐陵",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安十八年（213）分平原、勃海置，治厌次。"
    },
    {
      "name": "章武",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安末分河间、勃海置。嘉平年间废，249帧仍列，263帧起不再单列。"
    },
    {
      "name": "范阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "226年由涿郡改名，治涿。"
    },
    {
      "name": "广阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治蓟（今北京西南）。太和六年（232）改燕国，234帧起改称燕国。"
    },
    {
      "name": "代郡",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治高柳。鲜卑压力大，郡境控制不稳定。"
    },
    {
      "name": "上谷",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治沮阳。北缘与鲜卑相邻。"
    },
    {
      "name": "渔阳",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治渔阳。边郡，乌桓旧地，控制比内地弱。"
    },
    {
      "name": "右北平",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治土垠。东与鲜卑、辽西相连。"
    },
    {
      "name": "辽西",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治阳乐。鲜卑经常进出，城池在、乡野不稳。"
    },
    {
      "name": "辽东属国",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧属国，在辽西、辽东之间。244年改昌黎郡。名义属魏，公孙氏与鲜卑都影响得到。"
    },
    {
      "name": "辽东",
      "controller": "gongsun_liaodong",
      "strength": "core",
      "contenders": [],
      "note": "公孙氏治襄平。"
    },
    {
      "name": "玄菟",
      "controller": "gongsun_liaodong",
      "strength": "weak",
      "contenders": [],
      "note": "治高句骊县旧地，郡境受高句丽挤压。238年前随公孙氏，其后归魏、晋。244年毌丘俭出击高句丽，并未把其地改为魏郡。"
    },
    {
      "name": "乐浪",
      "controller": "gongsun_liaodong",
      "strength": "core",
      "contenders": [],
      "note": "朝鲜半岛北部旧郡，治朝鲜县。238年前由公孙氏管，其后归魏、晋。"
    },
    {
      "name": "带方",
      "controller": "gongsun_liaodong",
      "strength": "core",
      "contenders": [],
      "note": "建安末公孙康分乐浪南部置。238年后归魏、晋。倭使接触曹魏，多经此郡。"
    },
    {
      "name": "太原",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治晋阳。并州治所。"
    },
    {
      "name": "上党",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治壶关，后常治潞。"
    },
    {
      "name": "西河",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治离石。南匈奴五部所在，行政在，部落势力大。"
    },
    {
      "name": "雁门",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治广武。鲜卑、匈奴交会，边郡。"
    },
    {
      "name": "新兴",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十年（215）废云中、定襄、五原、朔方，分太原置新兴以处其民，治九原。四郡故地不再设郡。"
    },
    {
      "name": "乐平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安二十一年（216）分上党、太原置，治沾。"
    },
    {
      "name": "京兆",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治长安。魏改左冯翊为冯翊、右扶风为扶风，三辅仍是关中核心。"
    },
    {
      "name": "冯翊",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "魏改左冯翊为冯翊郡，治临晋。"
    },
    {
      "name": "扶风",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "魏改右扶风为扶风郡，治槐里。"
    },
    {
      "name": "北地",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治泥阳。羌乱反复，乡野控制弱。"
    },
    {
      "name": "新平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "兴平元年（194）分安定、扶风置，治漆。"
    },
    {
      "name": "安定",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治临泾。陇东军事重镇，羌人时叛，郡治仍在魏、晋手中。"
    },
    {
      "name": "陇西",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治襄武。黄初曾短暂设秦州，旋废，本帧陇右仍属雍州。"
    },
    {
      "name": "南安",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "中平五年（188）分汉阳置，治獂道。228年诸葛亮第一次北伐时曾降蜀，随即复归魏。"
    },
    {
      "name": "天水",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治冀县。228年郡中诸县多应诸葛亮，街亭败后复归魏。"
    },
    {
      "name": "广魏",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末由永阳改广魏，治临渭。约泰始中改名略阳。271帧起书略阳，并划入秦州。"
    },
    {
      "name": "武都",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "治下辨。氐人聚居，与蜀争夺。229年入蜀。"
    },
    {
      "name": "阴平",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "治阴平。本广汉属国改郡，地险，氐羌杂居。229年入蜀。"
    },
    {
      "name": "金城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治榆中一带。建安末又分金城置西平。河西东口，羌、鲜卑时常扰动，郡治仍在。"
    },
    {
      "name": "武威",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "凉州治所，姑臧。271年鲜卑树机能已杀两任刺史，河西震动，本帧标弱。279年十二月马隆斩树机能，280年凉州平。"
    },
    {
      "name": "张掖",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治张掖。"
    },
    {
      "name": "酒泉",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治福禄。"
    },
    {
      "name": "敦煌",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治敦煌。走廊西端，行政在，离中原极远。"
    },
    {
      "name": "西郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "兴平二年（195）分张掖置，治日勒。"
    },
    {
      "name": "西平",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "建安末分金城置，治西都。羌人势力大。"
    },
    {
      "name": "西海",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，居延一带。户籍与驻军都少，近于边地哨所。"
    },
    {
      "name": "南阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治宛。魏荆州初治宛。"
    },
    {
      "name": "南乡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安十三年（208）分南阳置，治南乡。"
    },
    {
      "name": "襄阳",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "建安十三年（208）分南郡置，治襄阳。城为魏有，汉水一线与吴对峙。"
    },
    {
      "name": "义阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初初分南阳、江夏置。嘉平中废。249帧仍列，其后不再单列，晋平吴后另有义阳，不提前写入。"
    },
    {
      "name": "江夏（沔北）",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉江夏郡跨汉水。魏领安陆、石阳等沔北诸县。236年吴曾短暂占新市、安陆，随即失去。与吴境“江夏（江南）”是一郡分涂，地图需沿汉水切开。"
    },
    {
      "name": "新城",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "黄初元年（220）七月合房陵、上庸、西城为新城，治房陵。227年孟达叛，司马懿迅即平定。263年蜀灭前与蜀隔山对峙，其后不再是国境。"
    },
    {
      "name": "魏兴",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "215年曹操分汉中东部置西城郡，221年改名魏兴，治西城。220帧尚并在新城中。263年前与蜀对峙。"
    },
    {
      "name": "淮南",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉九江郡，魏改称淮南，治寿春。合肥、寿春是对吴主战场。249年后诸葛诞等淮南三叛都发生在此，叛平后仍属魏，不是吴土。"
    },
    {
      "name": "庐江（皖北）",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉庐江郡被魏、吴分成两块。魏领皖北，合肥为其军镇。与吴境“庐江（皖）”须沿江切开。"
    },
    {
      "name": "蜀郡",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治成都。蜀汉都城，263年后为晋益州核心。"
    },
    {
      "name": "广汉",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治雒。265年梁州析出后改属梁州。"
    },
    {
      "name": "梓潼",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "建安二十二年（217）分广汉置，治梓潼。刘备入蜀时已有。"
    },
    {
      "name": "犍为",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治武阳。"
    },
    {
      "name": "江阳",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "建安十八年（213）分犍为置，治江阳。"
    },
    {
      "name": "汶山",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "建安末分蜀郡置，治绵虒。羌人地区，控制弱。"
    },
    {
      "name": "汉嘉",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "章武元年（221）由蜀郡属国改名，治汉嘉。240年张嶷曾平郡乱，乡野仍弱。"
    },
    {
      "name": "巴郡",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治江州（今重庆）。刘璋时已与巴西、巴东分治。"
    },
    {
      "name": "巴西",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治阆中。"
    },
    {
      "name": "巴东",
      "controller": "shu",
      "strength": "contested",
      "contenders": [
        "shu",
        "wu"
      ],
      "note": "221年由固陵改名，治鱼复，222年改鱼复为永安。夷陵败后，蜀守三峡西口，与吴建平、宜都相对。"
    },
    {
      "name": "涪陵",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "建安末改巴东属国为涪陵，治涪陵。滨五溪，248年邓芝曾讨郡夷，控制弱于成都平原。"
    },
    {
      "name": "汉中",
      "controller": "shu",
      "strength": "contested",
      "contenders": [
        "shu",
        "wei"
      ],
      "note": "219年刘备所得，治南郑。北缘阳平关与魏对峙，郡境本身是蜀的北边大门。"
    },
    {
      "name": "建宁",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "225年由益州郡改名。233年庲降都督才把治所稳定到味县。271年划入宁州。大姓势力大。"
    },
    {
      "name": "云南",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "225年分建宁、永昌置，治梇栋。271年属宁州。"
    },
    {
      "name": "兴古",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "225年分建宁、牂柯置，治宛温。271年属宁州。"
    },
    {
      "name": "牂柯",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治故且兰。223–225年曾叛，平后仍弱。271年宁州初置时尚未划入，仍属益州。"
    },
    {
      "name": "越巂",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治邛都。223年叛，240年张嶷重新打通郡道，其后仍弱。271年仍属益州。"
    },
    {
      "name": "永昌",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治不韦，远至今云南西部。南中叛乱时吕凯为蜀守住郡境。271年《晋书》把它算入宁州（或写作交州之永昌）。"
    },
    {
      "name": "朱提",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十年（215）刘备改犍为属国为朱提，治朱提。《晋书》或系于221年。接近南中，控制弱。延熙中曾分南广，约九年即废，各帧不单列。"
    },
    {
      "name": "丹阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治建业。郡治一带是吴的政治核心；郡南山区山越反复，没有单列到县。"
    },
    {
      "name": "吴郡",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治吴县。"
    },
    {
      "name": "会稽",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治山阴。257年分临海，260年分建安，266年分东阳，故后期辖境缩小。"
    },
    {
      "name": "豫章",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治南昌。"
    },
    {
      "name": "庐陵",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "建安初分豫章置，治西昌。236年又分南部都尉。"
    },
    {
      "name": "鄱阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "210年分豫章置，治鄱阳。225年以后郡治稳定，山区仍有零星山越。"
    },
    {
      "name": "新都（扬）",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "建安十三年（208）分丹阳置，治始新。为控制山越而设，全境标弱。"
    },
    {
      "name": "庐江（皖）",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "吴领庐江郡江南、皖城一带，治皖。与魏“庐江（皖北）”是一郡分涂。"
    },
    {
      "name": "蕲春",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "223年自魏收回，治蕲春。江北小郡，夹在两军之间。"
    },
    {
      "name": "南郡",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治江陵。219年吕蒙袭取。江陵是吴西边军镇，北与魏襄阳对峙，城本身长期在吴手中。"
    },
    {
      "name": "宜都",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "222年夷陵战败蜀后，夷陵改名西陵，郡境稳定属吴。260年分出建平。272年步阐据西陵降晋，数月后被陆抗夺回，不单独成帧。"
    },
    {
      "name": "江夏（江南）",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "吴领鄂、夏口、武昌（今鄂州）及江南诸县。221–229年、265–266年吴都在武昌，即本郡境。与魏“江夏（沔北）”须沿汉水切开。"
    },
    {
      "name": "长沙",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治临湘。257年分出衡阳、湘东，辖境缩小。"
    },
    {
      "name": "零陵",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治泉陵。265年分始安，266年分昭陵。"
    },
    {
      "name": "桂阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治郴。265年分始兴。"
    },
    {
      "name": "武陵",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "治临沅。沅水上游蛮族聚居，郡治在、溪峒弱。263年分天门。"
    },
    {
      "name": "临贺",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "黄武五年（226）分苍梧置，改属荆州，治临贺。"
    },
    {
      "name": "交趾",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "226年吕岱杀士徽后由吴直接设太守，治龙编。"
    },
    {
      "name": "九真",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "226年后吴直辖。当地渠帅势力大。"
    },
    {
      "name": "日南",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "吴直辖后仍是最弱的一郡。"
    },
    {
      "name": "合浦",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "226年后吴直接治理。交趾三郡脱离期间，吴的交州办事机构常退到合浦一带。"
    },
    {
      "name": "南海",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "226年士氏灭亡后归吴。同年曾短暂设广州，旋废，本帧仍统于交州。"
    },
    {
      "name": "苍梧",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治广信。226年分出临贺（改属荆州）。265年起属广州。"
    },
    {
      "name": "郁林",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "治布山。控制松。274年分桂林。265年起属广州。"
    },
    {
      "name": "高凉",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "220年分合浦置。226年后明确属吴。265年起属广州。"
    }
  ],
  "capitals": [
    {
      "faction": "wei",
      "city": "洛阳",
      "lng": 112.62,
      "lat": 34.72,
      "role": "都城"
    },
    {
      "faction": "shu",
      "city": "成都",
      "lng": 104.06,
      "lat": 30.67,
      "role": "都城"
    },
    {
      "faction": "wu",
      "city": "武昌",
      "lng": 114.89,
      "lat": 30.4,
      "role": "都城"
    },
    {
      "faction": "wu",
      "city": "建业",
      "lng": 118.78,
      "lat": 31.95,
      "role": "陪都"
    },
    {
      "faction": "gongsun_liaodong",
      "city": "襄平",
      "lng": 123.17,
      "lat": 41.27,
      "role": "都城"
    }
  ],
  "sources": [
    "《三国志》魏书文帝纪、明帝纪、三少帝纪、明悼毛后无关；蜀书先主传、后主传；吴书吴主传、三嗣主传。交趾、辽东、南中细节见吕岱、士燮、公孙度、诸葛亮、霍弋等传。",
    "《晋书》卷三武帝纪（泰始五年置秦州、泰始七年七月交趾三郡降吴、八月置宁州、咸宁二年置平州、咸宁五年十二月凉州平、太康元年平吴）；卷十四至十五地理志。",
    "《资治通鉴》卷六十九至八十一。灭蜀月份从《三国志·三少帝纪》景元四年十一月，通鉴或系于十月。",
    "郡的置废主要对照《晋书·地理志》《华阳国志》巴志、蜀志、南中志，以及清人洪亮吉《补三国疆域志》、吴增仅《三国郡县表》、近人陈健梅《孙吴政区地理研究》的结论；与谭其骧《中国历史地图集》第三册“三国时期”标准年代（魏景元三年，262年）对读。维基百科条目只用来查找上述书的线索，有出入时以史志为准。"
  ]
}
```

## 229 年 孙权称帝迁都

公元229年四月孙权称帝，九月把都城从武昌迁回建业，武昌留下当西边的陪都。同一年春天，诸葛亮取得武都、阴平，蜀的西北边界推进到陇南。这两郡氐人、羌人很多，蜀只是设了郡，不是把山里都管严了。魏的扬州仍然只有淮河以南的淮南、庐江北半，和吴隔江对峙。

```json
{
  "year": 229,
  "month": 9,
  "label": "孙权称帝迁都",
  "provinces": [
    {
      "province": "司隶",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "豫州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "兖州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "青州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "徐州",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "冀州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "幽州",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "并州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "雍州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "益州",
      "controller": "shu",
      "strength": "contested"
    },
    {
      "province": "凉州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "荆州（魏）",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "扬州（魏）",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "扬州（吴）",
      "controller": "wu",
      "strength": "contested"
    },
    {
      "province": "荆州（吴）",
      "controller": "wu",
      "strength": "contested"
    },
    {
      "province": "交州",
      "controller": "wu",
      "strength": "core"
    }
  ],
  "overrides": [
    {
      "name": "河南尹",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治洛阳，东汉旧名。魏、晋都城所在。"
    },
    {
      "name": "河内",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治怀县。"
    },
    {
      "name": "河东",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治安邑。247年分出平阳前，平阳一带仍属本郡。"
    },
    {
      "name": "弘农",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治弘农。函谷道所经。"
    },
    {
      "name": "颍川",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治阳翟。"
    },
    {
      "name": "襄城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末曹操分颍川置，治襄城。"
    },
    {
      "name": "汝南",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治新息，后常治平舆一带。"
    },
    {
      "name": "汝阴",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末分汝南置，治汝阴。"
    },
    {
      "name": "梁国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治睢阳。"
    },
    {
      "name": "沛国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治沛。"
    },
    {
      "name": "谯郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安末分沛国置，治谯，曹氏乡里。"
    },
    {
      "name": "鲁郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治鲁。"
    },
    {
      "name": "陈郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治陈。"
    },
    {
      "name": "弋阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安二十三年（218）分汝南、江夏置，治弋阳，滨江夏北缘。"
    },
    {
      "name": "安丰",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初初分庐江置，属豫州，治安风。设立或在220–222之间，各帧从220列入。"
    },
    {
      "name": "陈留",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治陈留。"
    },
    {
      "name": "东郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治濮阳。"
    },
    {
      "name": "济阴",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治定陶。"
    },
    {
      "name": "山阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治昌邑。"
    },
    {
      "name": "任城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治任城。"
    },
    {
      "name": "东平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治无盐。"
    },
    {
      "name": "济北",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治卢。"
    },
    {
      "name": "泰山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治奉高。"
    },
    {
      "name": "齐国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治临淄。"
    },
    {
      "name": "济南",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治东平陵。"
    },
    {
      "name": "乐安",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治临济。"
    },
    {
      "name": "北海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治平寿。"
    },
    {
      "name": "东莱",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治黄。"
    },
    {
      "name": "城阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安三年（198）分琅邪、北海置，治东武。"
    },
    {
      "name": "彭城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治彭城。魏徐州常治此。"
    },
    {
      "name": "下邳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治下邳。"
    },
    {
      "name": "东海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治郯。"
    },
    {
      "name": "琅邪",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治开阳。"
    },
    {
      "name": "东莞",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安三年（198）分琅邪置，治东莞。"
    },
    {
      "name": "广陵",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "治淮阴一带。江北属魏（晋），江南江都等县时被吴占据，沿江是拉锯带。"
    },
    {
      "name": "魏郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治邺。221年分出广平、阳平后辖境缩小。邺是曹操旧都，此后仍是河北重镇。"
    },
    {
      "name": "广平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初二年（221）分魏郡置，治曲梁。"
    },
    {
      "name": "阳平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初二年（221）分魏郡置，治馆陶。"
    },
    {
      "name": "巨鹿",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治瘿陶。"
    },
    {
      "name": "赵国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治邯郸。"
    },
    {
      "name": "常山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治元氏。"
    },
    {
      "name": "中山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治卢奴。"
    },
    {
      "name": "安平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治信都。冀州治所黄初后常在此。"
    },
    {
      "name": "河间",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治乐成。"
    },
    {
      "name": "勃海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治南皮。"
    },
    {
      "name": "清河",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉曾名甘陵，魏复称清河，治清河。"
    },
    {
      "name": "平原",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡。建安十八年（213）自青州改属冀州，治平原。"
    },
    {
      "name": "乐陵",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安十八年（213）分平原、勃海置，治厌次。"
    },
    {
      "name": "章武",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安末分河间、勃海置。嘉平年间废，249帧仍列，263帧起不再单列。"
    },
    {
      "name": "范阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "226年由涿郡改名，治涿。"
    },
    {
      "name": "广阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治蓟（今北京西南）。太和六年（232）改燕国，234帧起改称燕国。"
    },
    {
      "name": "代郡",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治高柳。鲜卑压力大，郡境控制不稳定。"
    },
    {
      "name": "上谷",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治沮阳。北缘与鲜卑相邻。"
    },
    {
      "name": "渔阳",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治渔阳。边郡，乌桓旧地，控制比内地弱。"
    },
    {
      "name": "右北平",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治土垠。东与鲜卑、辽西相连。"
    },
    {
      "name": "辽西",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治阳乐。鲜卑经常进出，城池在、乡野不稳。"
    },
    {
      "name": "辽东属国",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧属国，在辽西、辽东之间。244年改昌黎郡。名义属魏，公孙氏与鲜卑都影响得到。"
    },
    {
      "name": "辽东",
      "controller": "gongsun_liaodong",
      "strength": "core",
      "contenders": [],
      "note": "公孙氏治襄平。"
    },
    {
      "name": "玄菟",
      "controller": "gongsun_liaodong",
      "strength": "weak",
      "contenders": [],
      "note": "治高句骊县旧地，郡境受高句丽挤压。238年前随公孙氏，其后归魏、晋。244年毌丘俭出击高句丽，并未把其地改为魏郡。"
    },
    {
      "name": "乐浪",
      "controller": "gongsun_liaodong",
      "strength": "core",
      "contenders": [],
      "note": "朝鲜半岛北部旧郡，治朝鲜县。238年前由公孙氏管，其后归魏、晋。"
    },
    {
      "name": "带方",
      "controller": "gongsun_liaodong",
      "strength": "core",
      "contenders": [],
      "note": "建安末公孙康分乐浪南部置。238年后归魏、晋。倭使接触曹魏，多经此郡。"
    },
    {
      "name": "太原",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治晋阳。并州治所。"
    },
    {
      "name": "上党",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治壶关，后常治潞。"
    },
    {
      "name": "西河",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治离石。南匈奴五部所在，行政在，部落势力大。"
    },
    {
      "name": "雁门",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治广武。鲜卑、匈奴交会，边郡。"
    },
    {
      "name": "新兴",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十年（215）废云中、定襄、五原、朔方，分太原置新兴以处其民，治九原。四郡故地不再设郡。"
    },
    {
      "name": "乐平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安二十一年（216）分上党、太原置，治沾。"
    },
    {
      "name": "京兆",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治长安。魏改左冯翊为冯翊、右扶风为扶风，三辅仍是关中核心。"
    },
    {
      "name": "冯翊",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "魏改左冯翊为冯翊郡，治临晋。"
    },
    {
      "name": "扶风",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "魏改右扶风为扶风郡，治槐里。"
    },
    {
      "name": "北地",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治泥阳。羌乱反复，乡野控制弱。"
    },
    {
      "name": "新平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "兴平元年（194）分安定、扶风置，治漆。"
    },
    {
      "name": "安定",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治临泾。陇东军事重镇，羌人时叛，郡治仍在魏、晋手中。"
    },
    {
      "name": "陇西",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治襄武。黄初曾短暂设秦州，旋废，本帧陇右仍属雍州。"
    },
    {
      "name": "南安",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "中平五年（188）分汉阳置，治獂道。228年诸葛亮第一次北伐时曾降蜀，随即复归魏。"
    },
    {
      "name": "天水",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治冀县。228年郡中诸县多应诸葛亮，街亭败后复归魏。"
    },
    {
      "name": "广魏",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末由永阳改广魏，治临渭。约泰始中改名略阳。271帧起书略阳，并划入秦州。"
    },
    {
      "name": "武都",
      "controller": "shu",
      "strength": "weak",
      "contenders": [
        "shu",
        "wei"
      ],
      "note": "建兴七年（229）春诸葛亮所得。郡在，氐人势力仍大，与魏边境相接。"
    },
    {
      "name": "阴平",
      "controller": "shu",
      "strength": "weak",
      "contenders": [
        "shu",
        "wei"
      ],
      "note": "229年与武都同入蜀。263年邓艾即由阴平小道入蜀。"
    },
    {
      "name": "金城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治榆中一带。建安末又分金城置西平。河西东口，羌、鲜卑时常扰动，郡治仍在。"
    },
    {
      "name": "武威",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "凉州治所，姑臧。271年鲜卑树机能已杀两任刺史，河西震动，本帧标弱。279年十二月马隆斩树机能，280年凉州平。"
    },
    {
      "name": "张掖",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治张掖。"
    },
    {
      "name": "酒泉",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治福禄。"
    },
    {
      "name": "敦煌",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治敦煌。走廊西端，行政在，离中原极远。"
    },
    {
      "name": "西郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "兴平二年（195）分张掖置，治日勒。"
    },
    {
      "name": "西平",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "建安末分金城置，治西都。羌人势力大。"
    },
    {
      "name": "西海",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，居延一带。户籍与驻军都少，近于边地哨所。"
    },
    {
      "name": "南阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治宛。魏荆州初治宛。"
    },
    {
      "name": "南乡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安十三年（208）分南阳置，治南乡。"
    },
    {
      "name": "襄阳",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "建安十三年（208）分南郡置，治襄阳。城为魏有，汉水一线与吴对峙。"
    },
    {
      "name": "义阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初初分南阳、江夏置。嘉平中废。249帧仍列，其后不再单列，晋平吴后另有义阳，不提前写入。"
    },
    {
      "name": "江夏（沔北）",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉江夏郡跨汉水。魏领安陆、石阳等沔北诸县。236年吴曾短暂占新市、安陆，随即失去。与吴境“江夏（江南）”是一郡分涂，地图需沿汉水切开。"
    },
    {
      "name": "新城",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "黄初元年（220）七月合房陵、上庸、西城为新城，治房陵。227年孟达叛，司马懿迅即平定。263年蜀灭前与蜀隔山对峙，其后不再是国境。"
    },
    {
      "name": "魏兴",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "215年曹操分汉中东部置西城郡，221年改名魏兴，治西城。220帧尚并在新城中。263年前与蜀对峙。"
    },
    {
      "name": "上庸",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "215年分汉中置，220年并入新城；228年复置，约230年废；237年再置，嘉平中又废；259年再置。本帧按此置废列入。234年不列。"
    },
    {
      "name": "淮南",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉九江郡，魏改称淮南，治寿春。合肥、寿春是对吴主战场。249年后诸葛诞等淮南三叛都发生在此，叛平后仍属魏，不是吴土。"
    },
    {
      "name": "庐江（皖北）",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉庐江郡被魏、吴分成两块。魏领皖北，合肥为其军镇。与吴境“庐江（皖）”须沿江切开。"
    },
    {
      "name": "蜀郡",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治成都。蜀汉都城，263年后为晋益州核心。"
    },
    {
      "name": "广汉",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治雒。265年梁州析出后改属梁州。"
    },
    {
      "name": "梓潼",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "建安二十二年（217）分广汉置，治梓潼。刘备入蜀时已有。"
    },
    {
      "name": "犍为",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治武阳。"
    },
    {
      "name": "江阳",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "建安十八年（213）分犍为置，治江阳。"
    },
    {
      "name": "汶山",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "建安末分蜀郡置，治绵虒。羌人地区，控制弱。"
    },
    {
      "name": "汉嘉",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "章武元年（221）由蜀郡属国改名，治汉嘉。240年张嶷曾平郡乱，乡野仍弱。"
    },
    {
      "name": "巴郡",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治江州（今重庆）。刘璋时已与巴西、巴东分治。"
    },
    {
      "name": "巴西",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治阆中。"
    },
    {
      "name": "巴东",
      "controller": "shu",
      "strength": "contested",
      "contenders": [
        "shu",
        "wu"
      ],
      "note": "221年由固陵改名，治鱼复，222年改鱼复为永安。夷陵败后，蜀守三峡西口，与吴建平、宜都相对。"
    },
    {
      "name": "涪陵",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "建安末改巴东属国为涪陵，治涪陵。滨五溪，248年邓芝曾讨郡夷，控制弱于成都平原。"
    },
    {
      "name": "汉中",
      "controller": "shu",
      "strength": "contested",
      "contenders": [
        "shu",
        "wei"
      ],
      "note": "219年刘备所得，治南郑。北缘阳平关与魏对峙，郡境本身是蜀的北边大门。"
    },
    {
      "name": "建宁",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "225年由益州郡改名。233年庲降都督才把治所稳定到味县。271年划入宁州。大姓势力大。"
    },
    {
      "name": "云南",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "225年分建宁、永昌置，治梇栋。271年属宁州。"
    },
    {
      "name": "兴古",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "225年分建宁、牂柯置，治宛温。271年属宁州。"
    },
    {
      "name": "牂柯",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治故且兰。223–225年曾叛，平后仍弱。271年宁州初置时尚未划入，仍属益州。"
    },
    {
      "name": "越巂",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治邛都。223年叛，240年张嶷重新打通郡道，其后仍弱。271年仍属益州。"
    },
    {
      "name": "永昌",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治不韦，远至今云南西部。南中叛乱时吕凯为蜀守住郡境。271年《晋书》把它算入宁州（或写作交州之永昌）。"
    },
    {
      "name": "朱提",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十年（215）刘备改犍为属国为朱提，治朱提。《晋书》或系于221年。接近南中，控制弱。延熙中曾分南广，约九年即废，各帧不单列。"
    },
    {
      "name": "丹阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治建业。郡治一带是吴的政治核心；郡南山区山越反复，没有单列到县。"
    },
    {
      "name": "吴郡",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治吴县。"
    },
    {
      "name": "会稽",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治山阴。257年分临海，260年分建安，266年分东阳，故后期辖境缩小。"
    },
    {
      "name": "豫章",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治南昌。"
    },
    {
      "name": "庐陵",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "建安初分豫章置，治西昌。236年又分南部都尉。"
    },
    {
      "name": "鄱阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "210年分豫章置，治鄱阳。225年以后郡治稳定，山区仍有零星山越。"
    },
    {
      "name": "新都（扬）",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "建安十三年（208）分丹阳置，治始新。为控制山越而设，全境标弱。"
    },
    {
      "name": "庐江（皖）",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "吴领庐江郡江南、皖城一带，治皖。与魏“庐江（皖北）”是一郡分涂。"
    },
    {
      "name": "蕲春",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "223年自魏收回，治蕲春。江北小郡，夹在两军之间。"
    },
    {
      "name": "南郡",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治江陵。219年吕蒙袭取。江陵是吴西边军镇，北与魏襄阳对峙，城本身长期在吴手中。"
    },
    {
      "name": "宜都",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "222年夷陵战败蜀后，夷陵改名西陵，郡境稳定属吴。260年分出建平。272年步阐据西陵降晋，数月后被陆抗夺回，不单独成帧。"
    },
    {
      "name": "江夏（江南）",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "吴领鄂、夏口、武昌（今鄂州）及江南诸县。221–229年、265–266年吴都在武昌，即本郡境。与魏“江夏（沔北）”须沿汉水切开。"
    },
    {
      "name": "长沙",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治临湘。257年分出衡阳、湘东，辖境缩小。"
    },
    {
      "name": "零陵",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治泉陵。265年分始安，266年分昭陵。"
    },
    {
      "name": "桂阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治郴。265年分始兴。"
    },
    {
      "name": "武陵",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "治临沅。沅水上游蛮族聚居，郡治在、溪峒弱。263年分天门。"
    },
    {
      "name": "临贺",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "黄武五年（226）分苍梧置，改属荆州，治临贺。"
    },
    {
      "name": "交趾",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "226年吕岱杀士徽后由吴直接设太守，治龙编。"
    },
    {
      "name": "九真",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "226年后吴直辖。当地渠帅势力大。"
    },
    {
      "name": "日南",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "吴直辖后仍是最弱的一郡。"
    },
    {
      "name": "合浦",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "226年后吴直接治理。交趾三郡脱离期间，吴的交州办事机构常退到合浦一带。"
    },
    {
      "name": "南海",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "226年士氏灭亡后归吴。同年曾短暂设广州，旋废，本帧仍统于交州。"
    },
    {
      "name": "苍梧",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治广信。226年分出临贺（改属荆州）。265年起属广州。"
    },
    {
      "name": "郁林",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "治布山。控制松。274年分桂林。265年起属广州。"
    },
    {
      "name": "高凉",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "220年分合浦置。226年后明确属吴。265年起属广州。"
    }
  ],
  "capitals": [
    {
      "faction": "wei",
      "city": "洛阳",
      "lng": 112.62,
      "lat": 34.72,
      "role": "都城"
    },
    {
      "faction": "shu",
      "city": "成都",
      "lng": 104.06,
      "lat": 30.67,
      "role": "都城"
    },
    {
      "faction": "wu",
      "city": "建业",
      "lng": 118.78,
      "lat": 31.95,
      "role": "都城"
    },
    {
      "faction": "wu",
      "city": "武昌",
      "lng": 114.89,
      "lat": 30.4,
      "role": "陪都"
    },
    {
      "faction": "gongsun_liaodong",
      "city": "襄平",
      "lng": 123.17,
      "lat": 41.27,
      "role": "都城"
    }
  ],
  "sources": [
    "《三国志》魏书文帝纪、明帝纪、三少帝纪、明悼毛后无关；蜀书先主传、后主传；吴书吴主传、三嗣主传。交趾、辽东、南中细节见吕岱、士燮、公孙度、诸葛亮、霍弋等传。",
    "《晋书》卷三武帝纪（泰始五年置秦州、泰始七年七月交趾三郡降吴、八月置宁州、咸宁二年置平州、咸宁五年十二月凉州平、太康元年平吴）；卷十四至十五地理志。",
    "《资治通鉴》卷六十九至八十一。灭蜀月份从《三国志·三少帝纪》景元四年十一月，通鉴或系于十月。",
    "郡的置废主要对照《晋书·地理志》《华阳国志》巴志、蜀志、南中志，以及清人洪亮吉《补三国疆域志》、吴增仅《三国郡县表》、近人陈健梅《孙吴政区地理研究》的结论；与谭其骧《中国历史地图集》第三册“三国时期”标准年代（魏景元三年，262年）对读。维基百科条目只用来查找上述书的线索，有出入时以史志为准。"
  ]
}
```

## 234 年 诸葛亮卒

诸葛亮死在五丈原，时间是公元234年八月。武都、阴平仍属蜀，襄阳、合肥、汉中北缘仍是三国拉锯的边境，但这一年没有新的郡易手。此后姜维多次北伐，大多打完就退，没有留下稳定的新地盘。吴在毗陵设置典农校尉，管理长江下游的屯田，地位相当于郡。

```json
{
  "year": 234,
  "month": 8,
  "label": "诸葛亮卒",
  "provinces": [
    {
      "province": "司隶",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "豫州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "兖州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "青州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "徐州",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "冀州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "幽州",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "并州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "雍州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "益州",
      "controller": "shu",
      "strength": "contested"
    },
    {
      "province": "凉州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "荆州（魏）",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "扬州（魏）",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "扬州（吴）",
      "controller": "wu",
      "strength": "contested"
    },
    {
      "province": "荆州（吴）",
      "controller": "wu",
      "strength": "contested"
    },
    {
      "province": "交州",
      "controller": "wu",
      "strength": "core"
    }
  ],
  "overrides": [
    {
      "name": "河南尹",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治洛阳，东汉旧名。魏、晋都城所在。"
    },
    {
      "name": "河内",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治怀县。"
    },
    {
      "name": "河东",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治安邑。247年分出平阳前，平阳一带仍属本郡。"
    },
    {
      "name": "弘农",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治弘农。函谷道所经。"
    },
    {
      "name": "颍川",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治阳翟。"
    },
    {
      "name": "襄城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末曹操分颍川置，治襄城。"
    },
    {
      "name": "汝南",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治新息，后常治平舆一带。"
    },
    {
      "name": "汝阴",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末分汝南置，治汝阴。"
    },
    {
      "name": "梁国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治睢阳。"
    },
    {
      "name": "沛国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治沛。"
    },
    {
      "name": "谯郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安末分沛国置，治谯，曹氏乡里。"
    },
    {
      "name": "鲁郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治鲁。"
    },
    {
      "name": "陈郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治陈。"
    },
    {
      "name": "弋阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安二十三年（218）分汝南、江夏置，治弋阳，滨江夏北缘。"
    },
    {
      "name": "安丰",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初初分庐江置，属豫州，治安风。设立或在220–222之间，各帧从220列入。"
    },
    {
      "name": "陈留",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治陈留。"
    },
    {
      "name": "东郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治濮阳。"
    },
    {
      "name": "济阴",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治定陶。"
    },
    {
      "name": "山阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治昌邑。"
    },
    {
      "name": "任城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治任城。"
    },
    {
      "name": "东平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治无盐。"
    },
    {
      "name": "济北",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治卢。"
    },
    {
      "name": "泰山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治奉高。"
    },
    {
      "name": "齐国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治临淄。"
    },
    {
      "name": "济南",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治东平陵。"
    },
    {
      "name": "乐安",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治临济。"
    },
    {
      "name": "北海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治平寿。"
    },
    {
      "name": "东莱",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治黄。"
    },
    {
      "name": "城阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安三年（198）分琅邪、北海置，治东武。"
    },
    {
      "name": "彭城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治彭城。魏徐州常治此。"
    },
    {
      "name": "下邳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治下邳。"
    },
    {
      "name": "东海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治郯。"
    },
    {
      "name": "琅邪",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治开阳。"
    },
    {
      "name": "东莞",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安三年（198）分琅邪置，治东莞。"
    },
    {
      "name": "广陵",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "治淮阴一带。江北属魏（晋），江南江都等县时被吴占据，沿江是拉锯带。"
    },
    {
      "name": "魏郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治邺。221年分出广平、阳平后辖境缩小。邺是曹操旧都，此后仍是河北重镇。"
    },
    {
      "name": "广平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初二年（221）分魏郡置，治曲梁。"
    },
    {
      "name": "阳平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初二年（221）分魏郡置，治馆陶。"
    },
    {
      "name": "巨鹿",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治瘿陶。"
    },
    {
      "name": "赵国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治邯郸。"
    },
    {
      "name": "常山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治元氏。"
    },
    {
      "name": "中山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治卢奴。"
    },
    {
      "name": "安平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治信都。冀州治所黄初后常在此。"
    },
    {
      "name": "河间",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治乐成。"
    },
    {
      "name": "勃海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治南皮。"
    },
    {
      "name": "清河",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉曾名甘陵，魏复称清河，治清河。"
    },
    {
      "name": "平原",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡。建安十八年（213）自青州改属冀州，治平原。"
    },
    {
      "name": "乐陵",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安十八年（213）分平原、勃海置，治厌次。"
    },
    {
      "name": "章武",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安末分河间、勃海置。嘉平年间废，249帧仍列，263帧起不再单列。"
    },
    {
      "name": "范阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "226年由涿郡改名，治涿。"
    },
    {
      "name": "燕国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "232年由广阳郡改燕国，治蓟。"
    },
    {
      "name": "代郡",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治高柳。鲜卑压力大，郡境控制不稳定。"
    },
    {
      "name": "上谷",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治沮阳。北缘与鲜卑相邻。"
    },
    {
      "name": "渔阳",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治渔阳。边郡，乌桓旧地，控制比内地弱。"
    },
    {
      "name": "右北平",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治土垠。东与鲜卑、辽西相连。"
    },
    {
      "name": "辽西",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治阳乐。鲜卑经常进出，城池在、乡野不稳。"
    },
    {
      "name": "辽东属国",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧属国，在辽西、辽东之间。244年改昌黎郡。名义属魏，公孙氏与鲜卑都影响得到。"
    },
    {
      "name": "辽东",
      "controller": "gongsun_liaodong",
      "strength": "core",
      "contenders": [],
      "note": "公孙氏治襄平。"
    },
    {
      "name": "玄菟",
      "controller": "gongsun_liaodong",
      "strength": "weak",
      "contenders": [],
      "note": "治高句骊县旧地，郡境受高句丽挤压。238年前随公孙氏，其后归魏、晋。244年毌丘俭出击高句丽，并未把其地改为魏郡。"
    },
    {
      "name": "乐浪",
      "controller": "gongsun_liaodong",
      "strength": "core",
      "contenders": [],
      "note": "朝鲜半岛北部旧郡，治朝鲜县。238年前由公孙氏管，其后归魏、晋。"
    },
    {
      "name": "带方",
      "controller": "gongsun_liaodong",
      "strength": "core",
      "contenders": [],
      "note": "建安末公孙康分乐浪南部置。238年后归魏、晋。倭使接触曹魏，多经此郡。"
    },
    {
      "name": "太原",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治晋阳。并州治所。"
    },
    {
      "name": "上党",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治壶关，后常治潞。"
    },
    {
      "name": "西河",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治离石。南匈奴五部所在，行政在，部落势力大。"
    },
    {
      "name": "雁门",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治广武。鲜卑、匈奴交会，边郡。"
    },
    {
      "name": "新兴",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十年（215）废云中、定襄、五原、朔方，分太原置新兴以处其民，治九原。四郡故地不再设郡。"
    },
    {
      "name": "乐平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安二十一年（216）分上党、太原置，治沾。"
    },
    {
      "name": "京兆",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治长安。魏改左冯翊为冯翊、右扶风为扶风，三辅仍是关中核心。"
    },
    {
      "name": "冯翊",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "魏改左冯翊为冯翊郡，治临晋。"
    },
    {
      "name": "扶风",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "魏改右扶风为扶风郡，治槐里。"
    },
    {
      "name": "北地",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治泥阳。羌乱反复，乡野控制弱。"
    },
    {
      "name": "新平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "兴平元年（194）分安定、扶风置，治漆。"
    },
    {
      "name": "安定",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治临泾。陇东军事重镇，羌人时叛，郡治仍在魏、晋手中。"
    },
    {
      "name": "陇西",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治襄武。黄初曾短暂设秦州，旋废，本帧陇右仍属雍州。"
    },
    {
      "name": "南安",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "中平五年（188）分汉阳置，治獂道。228年诸葛亮第一次北伐时曾降蜀，随即复归魏。"
    },
    {
      "name": "天水",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治冀县。228年郡中诸县多应诸葛亮，街亭败后复归魏。"
    },
    {
      "name": "广魏",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末由永阳改广魏，治临渭。约泰始中改名略阳。271帧起书略阳，并划入秦州。"
    },
    {
      "name": "武都",
      "controller": "shu",
      "strength": "weak",
      "contenders": [
        "shu",
        "wei"
      ],
      "note": "建兴七年（229）春诸葛亮所得。郡在，氐人势力仍大，与魏边境相接。"
    },
    {
      "name": "阴平",
      "controller": "shu",
      "strength": "weak",
      "contenders": [
        "shu",
        "wei"
      ],
      "note": "229年与武都同入蜀。263年邓艾即由阴平小道入蜀。"
    },
    {
      "name": "金城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治榆中一带。建安末又分金城置西平。河西东口，羌、鲜卑时常扰动，郡治仍在。"
    },
    {
      "name": "武威",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "凉州治所，姑臧。271年鲜卑树机能已杀两任刺史，河西震动，本帧标弱。279年十二月马隆斩树机能，280年凉州平。"
    },
    {
      "name": "张掖",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治张掖。"
    },
    {
      "name": "酒泉",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治福禄。"
    },
    {
      "name": "敦煌",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治敦煌。走廊西端，行政在，离中原极远。"
    },
    {
      "name": "西郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "兴平二年（195）分张掖置，治日勒。"
    },
    {
      "name": "西平",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "建安末分金城置，治西都。羌人势力大。"
    },
    {
      "name": "西海",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，居延一带。户籍与驻军都少，近于边地哨所。"
    },
    {
      "name": "南阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治宛。魏荆州初治宛。"
    },
    {
      "name": "南乡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安十三年（208）分南阳置，治南乡。"
    },
    {
      "name": "襄阳",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "建安十三年（208）分南郡置，治襄阳。城为魏有，汉水一线与吴对峙。"
    },
    {
      "name": "义阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初初分南阳、江夏置。嘉平中废。249帧仍列，其后不再单列，晋平吴后另有义阳，不提前写入。"
    },
    {
      "name": "江夏（沔北）",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉江夏郡跨汉水。魏领安陆、石阳等沔北诸县。236年吴曾短暂占新市、安陆，随即失去。与吴境“江夏（江南）”是一郡分涂，地图需沿汉水切开。"
    },
    {
      "name": "新城",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "黄初元年（220）七月合房陵、上庸、西城为新城，治房陵。227年孟达叛，司马懿迅即平定。263年蜀灭前与蜀隔山对峙，其后不再是国境。"
    },
    {
      "name": "魏兴",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "215年曹操分汉中东部置西城郡，221年改名魏兴，治西城。220帧尚并在新城中。263年前与蜀对峙。"
    },
    {
      "name": "淮南",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉九江郡，魏改称淮南，治寿春。合肥、寿春是对吴主战场。249年后诸葛诞等淮南三叛都发生在此，叛平后仍属魏，不是吴土。"
    },
    {
      "name": "庐江（皖北）",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉庐江郡被魏、吴分成两块。魏领皖北，合肥为其军镇。与吴境“庐江（皖）”须沿江切开。"
    },
    {
      "name": "蜀郡",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治成都。蜀汉都城，263年后为晋益州核心。"
    },
    {
      "name": "广汉",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治雒。265年梁州析出后改属梁州。"
    },
    {
      "name": "梓潼",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "建安二十二年（217）分广汉置，治梓潼。刘备入蜀时已有。"
    },
    {
      "name": "犍为",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治武阳。"
    },
    {
      "name": "江阳",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "建安十八年（213）分犍为置，治江阳。"
    },
    {
      "name": "汶山",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "建安末分蜀郡置，治绵虒。羌人地区，控制弱。"
    },
    {
      "name": "汉嘉",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "章武元年（221）由蜀郡属国改名，治汉嘉。240年张嶷曾平郡乱，乡野仍弱。"
    },
    {
      "name": "巴郡",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治江州（今重庆）。刘璋时已与巴西、巴东分治。"
    },
    {
      "name": "巴西",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治阆中。"
    },
    {
      "name": "巴东",
      "controller": "shu",
      "strength": "contested",
      "contenders": [
        "shu",
        "wu"
      ],
      "note": "221年由固陵改名，治鱼复，222年改鱼复为永安。夷陵败后，蜀守三峡西口，与吴建平、宜都相对。"
    },
    {
      "name": "涪陵",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "建安末改巴东属国为涪陵，治涪陵。滨五溪，248年邓芝曾讨郡夷，控制弱于成都平原。"
    },
    {
      "name": "汉中",
      "controller": "shu",
      "strength": "contested",
      "contenders": [
        "shu",
        "wei"
      ],
      "note": "219年刘备所得，治南郑。北缘阳平关与魏对峙，郡境本身是蜀的北边大门。"
    },
    {
      "name": "建宁",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "225年由益州郡改名。233年庲降都督才把治所稳定到味县。271年划入宁州。大姓势力大。"
    },
    {
      "name": "云南",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "225年分建宁、永昌置，治梇栋。271年属宁州。"
    },
    {
      "name": "兴古",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "225年分建宁、牂柯置，治宛温。271年属宁州。"
    },
    {
      "name": "牂柯",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治故且兰。223–225年曾叛，平后仍弱。271年宁州初置时尚未划入，仍属益州。"
    },
    {
      "name": "越巂",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治邛都。223年叛，240年张嶷重新打通郡道，其后仍弱。271年仍属益州。"
    },
    {
      "name": "永昌",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治不韦，远至今云南西部。南中叛乱时吕凯为蜀守住郡境。271年《晋书》把它算入宁州（或写作交州之永昌）。"
    },
    {
      "name": "朱提",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十年（215）刘备改犍为属国为朱提，治朱提。《晋书》或系于221年。接近南中，控制弱。延熙中曾分南广，约九年即废，各帧不单列。"
    },
    {
      "name": "丹阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治建业。郡治一带是吴的政治核心；郡南山区山越反复，没有单列到县。"
    },
    {
      "name": "吴郡",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治吴县。"
    },
    {
      "name": "会稽",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治山阴。257年分临海，260年分建安，266年分东阳，故后期辖境缩小。"
    },
    {
      "name": "豫章",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治南昌。"
    },
    {
      "name": "庐陵",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "建安初分豫章置，治西昌。236年又分南部都尉。"
    },
    {
      "name": "鄱阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "210年分豫章置，治鄱阳。225年以后郡治稳定，山区仍有零星山越。"
    },
    {
      "name": "新都（扬）",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "建安十三年（208）分丹阳置，治始新。为控制山越而设，全境标弱。"
    },
    {
      "name": "庐江（皖）",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "吴领庐江郡江南、皖城一带，治皖。与魏“庐江（皖北）”是一郡分涂。"
    },
    {
      "name": "蕲春",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "223年自魏收回，治蕲春。江北小郡，夹在两军之间。"
    },
    {
      "name": "毗陵典农",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "嘉禾三年（234）置，治毗陵，地位相当于郡，管屯田。平吴后不久改为毗陵郡。"
    },
    {
      "name": "南郡",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治江陵。219年吕蒙袭取。江陵是吴西边军镇，北与魏襄阳对峙，城本身长期在吴手中。"
    },
    {
      "name": "宜都",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "222年夷陵战败蜀后，夷陵改名西陵，郡境稳定属吴。260年分出建平。272年步阐据西陵降晋，数月后被陆抗夺回，不单独成帧。"
    },
    {
      "name": "江夏（江南）",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "吴领鄂、夏口、武昌（今鄂州）及江南诸县。221–229年、265–266年吴都在武昌，即本郡境。与魏“江夏（沔北）”须沿汉水切开。"
    },
    {
      "name": "长沙",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治临湘。257年分出衡阳、湘东，辖境缩小。"
    },
    {
      "name": "零陵",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治泉陵。265年分始安，266年分昭陵。"
    },
    {
      "name": "桂阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治郴。265年分始兴。"
    },
    {
      "name": "武陵",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "治临沅。沅水上游蛮族聚居，郡治在、溪峒弱。263年分天门。"
    },
    {
      "name": "临贺",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "黄武五年（226）分苍梧置，改属荆州，治临贺。"
    },
    {
      "name": "交趾",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "226年吕岱杀士徽后由吴直接设太守，治龙编。"
    },
    {
      "name": "九真",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "226年后吴直辖。当地渠帅势力大。"
    },
    {
      "name": "日南",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "吴直辖后仍是最弱的一郡。"
    },
    {
      "name": "合浦",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "226年后吴直接治理。交趾三郡脱离期间，吴的交州办事机构常退到合浦一带。"
    },
    {
      "name": "南海",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "226年士氏灭亡后归吴。同年曾短暂设广州，旋废，本帧仍统于交州。"
    },
    {
      "name": "苍梧",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治广信。226年分出临贺（改属荆州）。265年起属广州。"
    },
    {
      "name": "郁林",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "治布山。控制松。274年分桂林。265年起属广州。"
    },
    {
      "name": "高凉",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "220年分合浦置。226年后明确属吴。265年起属广州。"
    }
  ],
  "capitals": [
    {
      "faction": "wei",
      "city": "洛阳",
      "lng": 112.62,
      "lat": 34.72,
      "role": "都城"
    },
    {
      "faction": "shu",
      "city": "成都",
      "lng": 104.06,
      "lat": 30.67,
      "role": "都城"
    },
    {
      "faction": "wu",
      "city": "建业",
      "lng": 118.78,
      "lat": 31.95,
      "role": "都城"
    },
    {
      "faction": "wu",
      "city": "武昌",
      "lng": 114.89,
      "lat": 30.4,
      "role": "陪都"
    },
    {
      "faction": "gongsun_liaodong",
      "city": "襄平",
      "lng": 123.17,
      "lat": 41.27,
      "role": "都城"
    }
  ],
  "sources": [
    "《三国志》魏书文帝纪、明帝纪、三少帝纪、明悼毛后无关；蜀书先主传、后主传；吴书吴主传、三嗣主传。交趾、辽东、南中细节见吕岱、士燮、公孙度、诸葛亮、霍弋等传。",
    "《晋书》卷三武帝纪（泰始五年置秦州、泰始七年七月交趾三郡降吴、八月置宁州、咸宁二年置平州、咸宁五年十二月凉州平、太康元年平吴）；卷十四至十五地理志。",
    "《资治通鉴》卷六十九至八十一。灭蜀月份从《三国志·三少帝纪》景元四年十一月，通鉴或系于十月。",
    "郡的置废主要对照《晋书·地理志》《华阳国志》巴志、蜀志、南中志，以及清人洪亮吉《补三国疆域志》、吴增仅《三国郡县表》、近人陈健梅《孙吴政区地理研究》的结论；与谭其骧《中国历史地图集》第三册“三国时期”标准年代（魏景元三年，262年）对读。维基百科条目只用来查找上述书的线索，有出入时以史志为准。"
  ]
}
```

## 238 年 灭辽东公孙氏

司马懿在公元238年八月攻破襄平，公孙渊灭亡。辽东、玄菟、乐浪、带方从公孙氏转到魏的直接管辖。玄菟紧挨高句丽，控制比较弱。这一年曹叡也去世，由曹芳即位，北方疆域的变化主要就是辽东并入，不是皇位本身。

```json
{
  "year": 238,
  "month": 8,
  "label": "灭辽东公孙氏",
  "provinces": [
    {
      "province": "司隶",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "豫州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "兖州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "青州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "徐州",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "冀州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "幽州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "并州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "雍州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "益州",
      "controller": "shu",
      "strength": "contested"
    },
    {
      "province": "凉州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "荆州（魏）",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "扬州（魏）",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "扬州（吴）",
      "controller": "wu",
      "strength": "contested"
    },
    {
      "province": "荆州（吴）",
      "controller": "wu",
      "strength": "contested"
    },
    {
      "province": "交州",
      "controller": "wu",
      "strength": "core"
    }
  ],
  "overrides": [
    {
      "name": "河南尹",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治洛阳，东汉旧名。魏、晋都城所在。"
    },
    {
      "name": "河内",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治怀县。"
    },
    {
      "name": "河东",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治安邑。247年分出平阳前，平阳一带仍属本郡。"
    },
    {
      "name": "弘农",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治弘农。函谷道所经。"
    },
    {
      "name": "颍川",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治阳翟。"
    },
    {
      "name": "襄城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末曹操分颍川置，治襄城。"
    },
    {
      "name": "汝南",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治新息，后常治平舆一带。"
    },
    {
      "name": "汝阴",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末分汝南置，治汝阴。"
    },
    {
      "name": "梁国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治睢阳。"
    },
    {
      "name": "沛国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治沛。"
    },
    {
      "name": "谯郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安末分沛国置，治谯，曹氏乡里。"
    },
    {
      "name": "鲁郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治鲁。"
    },
    {
      "name": "陈郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治陈。"
    },
    {
      "name": "弋阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安二十三年（218）分汝南、江夏置，治弋阳，滨江夏北缘。"
    },
    {
      "name": "安丰",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初初分庐江置，属豫州，治安风。设立或在220–222之间，各帧从220列入。"
    },
    {
      "name": "陈留",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治陈留。"
    },
    {
      "name": "东郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治濮阳。"
    },
    {
      "name": "济阴",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治定陶。"
    },
    {
      "name": "山阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治昌邑。"
    },
    {
      "name": "任城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治任城。"
    },
    {
      "name": "东平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治无盐。"
    },
    {
      "name": "济北",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治卢。"
    },
    {
      "name": "泰山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治奉高。"
    },
    {
      "name": "齐国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治临淄。"
    },
    {
      "name": "济南",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治东平陵。"
    },
    {
      "name": "乐安",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治临济。"
    },
    {
      "name": "北海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治平寿。"
    },
    {
      "name": "东莱",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治黄。"
    },
    {
      "name": "城阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安三年（198）分琅邪、北海置，治东武。"
    },
    {
      "name": "彭城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治彭城。魏徐州常治此。"
    },
    {
      "name": "下邳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治下邳。"
    },
    {
      "name": "东海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治郯。"
    },
    {
      "name": "琅邪",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治开阳。"
    },
    {
      "name": "东莞",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安三年（198）分琅邪置，治东莞。"
    },
    {
      "name": "广陵",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "治淮阴一带。江北属魏（晋），江南江都等县时被吴占据，沿江是拉锯带。"
    },
    {
      "name": "魏郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治邺。221年分出广平、阳平后辖境缩小。邺是曹操旧都，此后仍是河北重镇。"
    },
    {
      "name": "广平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初二年（221）分魏郡置，治曲梁。"
    },
    {
      "name": "阳平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初二年（221）分魏郡置，治馆陶。"
    },
    {
      "name": "巨鹿",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治瘿陶。"
    },
    {
      "name": "赵国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治邯郸。"
    },
    {
      "name": "常山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治元氏。"
    },
    {
      "name": "中山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治卢奴。"
    },
    {
      "name": "安平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治信都。冀州治所黄初后常在此。"
    },
    {
      "name": "河间",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治乐成。"
    },
    {
      "name": "勃海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治南皮。"
    },
    {
      "name": "清河",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉曾名甘陵，魏复称清河，治清河。"
    },
    {
      "name": "平原",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡。建安十八年（213）自青州改属冀州，治平原。"
    },
    {
      "name": "乐陵",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安十八年（213）分平原、勃海置，治厌次。"
    },
    {
      "name": "章武",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安末分河间、勃海置。嘉平年间废，249帧仍列，263帧起不再单列。"
    },
    {
      "name": "范阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "226年由涿郡改名，治涿。"
    },
    {
      "name": "燕国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "232年由广阳郡改燕国，治蓟。"
    },
    {
      "name": "代郡",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治高柳。鲜卑压力大，郡境控制不稳定。"
    },
    {
      "name": "上谷",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治沮阳。北缘与鲜卑相邻。"
    },
    {
      "name": "渔阳",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治渔阳。边郡，乌桓旧地，控制比内地弱。"
    },
    {
      "name": "右北平",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治土垠。东与鲜卑、辽西相连。"
    },
    {
      "name": "辽西",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治阳乐。鲜卑经常进出，城池在、乡野不稳。"
    },
    {
      "name": "辽东属国",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧属国，在辽西、辽东之间。244年改昌黎郡。名义属魏，公孙氏与鲜卑都影响得到。"
    },
    {
      "name": "辽东",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "景初二年（238）司马懿破襄平后归魏，晋沿置。280年属平州。"
    },
    {
      "name": "玄菟",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治高句骊县旧地，郡境受高句丽挤压。238年前随公孙氏，其后归魏、晋。244年毌丘俭出击高句丽，并未把其地改为魏郡。"
    },
    {
      "name": "乐浪",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "朝鲜半岛北部旧郡，治朝鲜县。238年前由公孙氏管，其后归魏、晋。"
    },
    {
      "name": "带方",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安末公孙康分乐浪南部置。238年后归魏、晋。倭使接触曹魏，多经此郡。"
    },
    {
      "name": "太原",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治晋阳。并州治所。"
    },
    {
      "name": "上党",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治壶关，后常治潞。"
    },
    {
      "name": "西河",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治离石。南匈奴五部所在，行政在，部落势力大。"
    },
    {
      "name": "雁门",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治广武。鲜卑、匈奴交会，边郡。"
    },
    {
      "name": "新兴",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十年（215）废云中、定襄、五原、朔方，分太原置新兴以处其民，治九原。四郡故地不再设郡。"
    },
    {
      "name": "乐平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安二十一年（216）分上党、太原置，治沾。"
    },
    {
      "name": "京兆",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治长安。魏改左冯翊为冯翊、右扶风为扶风，三辅仍是关中核心。"
    },
    {
      "name": "冯翊",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "魏改左冯翊为冯翊郡，治临晋。"
    },
    {
      "name": "扶风",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "魏改右扶风为扶风郡，治槐里。"
    },
    {
      "name": "北地",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治泥阳。羌乱反复，乡野控制弱。"
    },
    {
      "name": "新平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "兴平元年（194）分安定、扶风置，治漆。"
    },
    {
      "name": "安定",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治临泾。陇东军事重镇，羌人时叛，郡治仍在魏、晋手中。"
    },
    {
      "name": "陇西",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治襄武。黄初曾短暂设秦州，旋废，本帧陇右仍属雍州。"
    },
    {
      "name": "南安",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "中平五年（188）分汉阳置，治獂道。228年诸葛亮第一次北伐时曾降蜀，随即复归魏。"
    },
    {
      "name": "天水",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治冀县。228年郡中诸县多应诸葛亮，街亭败后复归魏。"
    },
    {
      "name": "广魏",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末由永阳改广魏，治临渭。约泰始中改名略阳。271帧起书略阳，并划入秦州。"
    },
    {
      "name": "武都",
      "controller": "shu",
      "strength": "weak",
      "contenders": [
        "shu",
        "wei"
      ],
      "note": "建兴七年（229）春诸葛亮所得。郡在，氐人势力仍大，与魏边境相接。"
    },
    {
      "name": "阴平",
      "controller": "shu",
      "strength": "weak",
      "contenders": [
        "shu",
        "wei"
      ],
      "note": "229年与武都同入蜀。263年邓艾即由阴平小道入蜀。"
    },
    {
      "name": "金城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治榆中一带。建安末又分金城置西平。河西东口，羌、鲜卑时常扰动，郡治仍在。"
    },
    {
      "name": "武威",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "凉州治所，姑臧。271年鲜卑树机能已杀两任刺史，河西震动，本帧标弱。279年十二月马隆斩树机能，280年凉州平。"
    },
    {
      "name": "张掖",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治张掖。"
    },
    {
      "name": "酒泉",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治福禄。"
    },
    {
      "name": "敦煌",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治敦煌。走廊西端，行政在，离中原极远。"
    },
    {
      "name": "西郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "兴平二年（195）分张掖置，治日勒。"
    },
    {
      "name": "西平",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "建安末分金城置，治西都。羌人势力大。"
    },
    {
      "name": "西海",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，居延一带。户籍与驻军都少，近于边地哨所。"
    },
    {
      "name": "南阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治宛。魏荆州初治宛。"
    },
    {
      "name": "南乡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安十三年（208）分南阳置，治南乡。"
    },
    {
      "name": "襄阳",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "建安十三年（208）分南郡置，治襄阳。城为魏有，汉水一线与吴对峙。"
    },
    {
      "name": "义阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初初分南阳、江夏置。嘉平中废。249帧仍列，其后不再单列，晋平吴后另有义阳，不提前写入。"
    },
    {
      "name": "江夏（沔北）",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉江夏郡跨汉水。魏领安陆、石阳等沔北诸县。236年吴曾短暂占新市、安陆，随即失去。与吴境“江夏（江南）”是一郡分涂，地图需沿汉水切开。"
    },
    {
      "name": "新城",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "黄初元年（220）七月合房陵、上庸、西城为新城，治房陵。227年孟达叛，司马懿迅即平定。263年蜀灭前与蜀隔山对峙，其后不再是国境。"
    },
    {
      "name": "魏兴",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "215年曹操分汉中东部置西城郡，221年改名魏兴，治西城。220帧尚并在新城中。263年前与蜀对峙。"
    },
    {
      "name": "上庸",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "215年分汉中置，220年并入新城；228年复置，约230年废；237年再置，嘉平中又废；259年再置。本帧按此置废列入。234年不列。"
    },
    {
      "name": "淮南",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉九江郡，魏改称淮南，治寿春。合肥、寿春是对吴主战场。249年后诸葛诞等淮南三叛都发生在此，叛平后仍属魏，不是吴土。"
    },
    {
      "name": "庐江（皖北）",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉庐江郡被魏、吴分成两块。魏领皖北，合肥为其军镇。与吴境“庐江（皖）”须沿江切开。"
    },
    {
      "name": "蜀郡",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治成都。蜀汉都城，263年后为晋益州核心。"
    },
    {
      "name": "广汉",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治雒。265年梁州析出后改属梁州。"
    },
    {
      "name": "梓潼",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "建安二十二年（217）分广汉置，治梓潼。刘备入蜀时已有。"
    },
    {
      "name": "犍为",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治武阳。"
    },
    {
      "name": "江阳",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "建安十八年（213）分犍为置，治江阳。"
    },
    {
      "name": "汶山",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "建安末分蜀郡置，治绵虒。羌人地区，控制弱。"
    },
    {
      "name": "汉嘉",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "章武元年（221）由蜀郡属国改名，治汉嘉。240年张嶷曾平郡乱，乡野仍弱。"
    },
    {
      "name": "巴郡",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治江州（今重庆）。刘璋时已与巴西、巴东分治。"
    },
    {
      "name": "巴西",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治阆中。"
    },
    {
      "name": "巴东",
      "controller": "shu",
      "strength": "contested",
      "contenders": [
        "shu",
        "wu"
      ],
      "note": "221年由固陵改名，治鱼复，222年改鱼复为永安。夷陵败后，蜀守三峡西口，与吴建平、宜都相对。"
    },
    {
      "name": "涪陵",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "建安末改巴东属国为涪陵，治涪陵。滨五溪，248年邓芝曾讨郡夷，控制弱于成都平原。"
    },
    {
      "name": "汉中",
      "controller": "shu",
      "strength": "contested",
      "contenders": [
        "shu",
        "wei"
      ],
      "note": "219年刘备所得，治南郑。北缘阳平关与魏对峙，郡境本身是蜀的北边大门。"
    },
    {
      "name": "建宁",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "225年由益州郡改名。233年庲降都督才把治所稳定到味县。271年划入宁州。大姓势力大。"
    },
    {
      "name": "云南",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "225年分建宁、永昌置，治梇栋。271年属宁州。"
    },
    {
      "name": "兴古",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "225年分建宁、牂柯置，治宛温。271年属宁州。"
    },
    {
      "name": "牂柯",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治故且兰。223–225年曾叛，平后仍弱。271年宁州初置时尚未划入，仍属益州。"
    },
    {
      "name": "越巂",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治邛都。223年叛，240年张嶷重新打通郡道，其后仍弱。271年仍属益州。"
    },
    {
      "name": "永昌",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治不韦，远至今云南西部。南中叛乱时吕凯为蜀守住郡境。271年《晋书》把它算入宁州（或写作交州之永昌）。"
    },
    {
      "name": "朱提",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十年（215）刘备改犍为属国为朱提，治朱提。《晋书》或系于221年。接近南中，控制弱。延熙中曾分南广，约九年即废，各帧不单列。"
    },
    {
      "name": "丹阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治建业。郡治一带是吴的政治核心；郡南山区山越反复，没有单列到县。"
    },
    {
      "name": "吴郡",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治吴县。"
    },
    {
      "name": "会稽",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治山阴。257年分临海，260年分建安，266年分东阳，故后期辖境缩小。"
    },
    {
      "name": "豫章",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治南昌。"
    },
    {
      "name": "庐陵",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "建安初分豫章置，治西昌。236年又分南部都尉。"
    },
    {
      "name": "鄱阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "210年分豫章置，治鄱阳。225年以后郡治稳定，山区仍有零星山越。"
    },
    {
      "name": "新都（扬）",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "建安十三年（208）分丹阳置，治始新。为控制山越而设，全境标弱。"
    },
    {
      "name": "庐江（皖）",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "吴领庐江郡江南、皖城一带，治皖。与魏“庐江（皖北）”是一郡分涂。"
    },
    {
      "name": "蕲春",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "223年自魏收回，治蕲春。江北小郡，夹在两军之间。"
    },
    {
      "name": "毗陵典农",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "嘉禾三年（234）置，治毗陵，地位相当于郡，管屯田。平吴后不久改为毗陵郡。"
    },
    {
      "name": "庐陵南部都尉",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "嘉禾五年（236）分庐陵置，治雩都，地位相当于郡。入晋后改为南康郡。"
    },
    {
      "name": "南郡",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治江陵。219年吕蒙袭取。江陵是吴西边军镇，北与魏襄阳对峙，城本身长期在吴手中。"
    },
    {
      "name": "宜都",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "222年夷陵战败蜀后，夷陵改名西陵，郡境稳定属吴。260年分出建平。272年步阐据西陵降晋，数月后被陆抗夺回，不单独成帧。"
    },
    {
      "name": "江夏（江南）",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "吴领鄂、夏口、武昌（今鄂州）及江南诸县。221–229年、265–266年吴都在武昌，即本郡境。与魏“江夏（沔北）”须沿汉水切开。"
    },
    {
      "name": "长沙",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治临湘。257年分出衡阳、湘东，辖境缩小。"
    },
    {
      "name": "零陵",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治泉陵。265年分始安，266年分昭陵。"
    },
    {
      "name": "桂阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治郴。265年分始兴。"
    },
    {
      "name": "武陵",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "治临沅。沅水上游蛮族聚居，郡治在、溪峒弱。263年分天门。"
    },
    {
      "name": "临贺",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "黄武五年（226）分苍梧置，改属荆州，治临贺。"
    },
    {
      "name": "交趾",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "226年吕岱杀士徽后由吴直接设太守，治龙编。"
    },
    {
      "name": "九真",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "226年后吴直辖。当地渠帅势力大。"
    },
    {
      "name": "日南",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "吴直辖后仍是最弱的一郡。"
    },
    {
      "name": "合浦",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "226年后吴直接治理。交趾三郡脱离期间，吴的交州办事机构常退到合浦一带。"
    },
    {
      "name": "南海",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "226年士氏灭亡后归吴。同年曾短暂设广州，旋废，本帧仍统于交州。"
    },
    {
      "name": "苍梧",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治广信。226年分出临贺（改属荆州）。265年起属广州。"
    },
    {
      "name": "郁林",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "治布山。控制松。274年分桂林。265年起属广州。"
    },
    {
      "name": "高凉",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "220年分合浦置。226年后明确属吴。265年起属广州。"
    }
  ],
  "capitals": [
    {
      "faction": "wei",
      "city": "洛阳",
      "lng": 112.62,
      "lat": 34.72,
      "role": "都城"
    },
    {
      "faction": "shu",
      "city": "成都",
      "lng": 104.06,
      "lat": 30.67,
      "role": "都城"
    },
    {
      "faction": "wu",
      "city": "建业",
      "lng": 118.78,
      "lat": 31.95,
      "role": "都城"
    },
    {
      "faction": "wu",
      "city": "武昌",
      "lng": 114.89,
      "lat": 30.4,
      "role": "陪都"
    }
  ],
  "sources": [
    "《三国志》魏书文帝纪、明帝纪、三少帝纪、明悼毛后无关；蜀书先主传、后主传；吴书吴主传、三嗣主传。交趾、辽东、南中细节见吕岱、士燮、公孙度、诸葛亮、霍弋等传。",
    "《晋书》卷三武帝纪（泰始五年置秦州、泰始七年七月交趾三郡降吴、八月置宁州、咸宁二年置平州、咸宁五年十二月凉州平、太康元年平吴）；卷十四至十五地理志。",
    "《资治通鉴》卷六十九至八十一。灭蜀月份从《三国志·三少帝纪》景元四年十一月，通鉴或系于十月。",
    "郡的置废主要对照《晋书·地理志》《华阳国志》巴志、蜀志、南中志，以及清人洪亮吉《补三国疆域志》、吴增仅《三国郡县表》、近人陈健梅《孙吴政区地理研究》的结论；与谭其骧《中国历史地图集》第三册“三国时期”标准年代（魏景元三年，262年）对读。维基百科条目只用来查找上述书的线索，有出入时以史志为准。"
  ]
}
```

## 244 年 兴势与高句丽之役

公元244年，曹爽伐蜀打到汉中北面的兴势，被王平挡住，退回；毌丘俭深入高句丽，也没有把对方的土地变成魏的郡。这一帧用来看“仗打了，地图几乎不动”。同年前后，辽东属国改称昌黎郡。南中、陇南和沿江边境的强弱，与234年相比没有稳定的易手。

```json
{
  "year": 244,
  "month": 5,
  "label": "兴势与高句丽之役",
  "provinces": [
    {
      "province": "司隶",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "豫州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "兖州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "青州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "徐州",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "冀州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "幽州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "并州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "雍州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "益州",
      "controller": "shu",
      "strength": "contested"
    },
    {
      "province": "凉州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "荆州（魏）",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "扬州（魏）",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "扬州（吴）",
      "controller": "wu",
      "strength": "contested"
    },
    {
      "province": "荆州（吴）",
      "controller": "wu",
      "strength": "contested"
    },
    {
      "province": "交州",
      "controller": "wu",
      "strength": "core"
    }
  ],
  "overrides": [
    {
      "name": "河南尹",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治洛阳，东汉旧名。魏、晋都城所在。"
    },
    {
      "name": "河内",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治怀县。"
    },
    {
      "name": "河东",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治安邑。247年分出平阳前，平阳一带仍属本郡。"
    },
    {
      "name": "弘农",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治弘农。函谷道所经。"
    },
    {
      "name": "颍川",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治阳翟。"
    },
    {
      "name": "襄城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末曹操分颍川置，治襄城。"
    },
    {
      "name": "汝南",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治新息，后常治平舆一带。"
    },
    {
      "name": "汝阴",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末分汝南置，治汝阴。"
    },
    {
      "name": "梁国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治睢阳。"
    },
    {
      "name": "沛国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治沛。"
    },
    {
      "name": "谯郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安末分沛国置，治谯，曹氏乡里。"
    },
    {
      "name": "鲁郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治鲁。"
    },
    {
      "name": "陈郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治陈。"
    },
    {
      "name": "弋阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安二十三年（218）分汝南、江夏置，治弋阳，滨江夏北缘。"
    },
    {
      "name": "安丰",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初初分庐江置，属豫州，治安风。设立或在220–222之间，各帧从220列入。"
    },
    {
      "name": "陈留",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治陈留。"
    },
    {
      "name": "东郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治濮阳。"
    },
    {
      "name": "济阴",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治定陶。"
    },
    {
      "name": "山阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治昌邑。"
    },
    {
      "name": "任城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治任城。"
    },
    {
      "name": "东平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治无盐。"
    },
    {
      "name": "济北",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治卢。"
    },
    {
      "name": "泰山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治奉高。"
    },
    {
      "name": "齐国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治临淄。"
    },
    {
      "name": "济南",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治东平陵。"
    },
    {
      "name": "乐安",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治临济。"
    },
    {
      "name": "北海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治平寿。"
    },
    {
      "name": "东莱",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治黄。"
    },
    {
      "name": "城阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安三年（198）分琅邪、北海置，治东武。"
    },
    {
      "name": "彭城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治彭城。魏徐州常治此。"
    },
    {
      "name": "下邳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治下邳。"
    },
    {
      "name": "东海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治郯。"
    },
    {
      "name": "琅邪",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治开阳。"
    },
    {
      "name": "东莞",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安三年（198）分琅邪置，治东莞。"
    },
    {
      "name": "广陵",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "治淮阴一带。江北属魏（晋），江南江都等县时被吴占据，沿江是拉锯带。"
    },
    {
      "name": "魏郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治邺。221年分出广平、阳平后辖境缩小。邺是曹操旧都，此后仍是河北重镇。"
    },
    {
      "name": "广平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初二年（221）分魏郡置，治曲梁。"
    },
    {
      "name": "阳平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初二年（221）分魏郡置，治馆陶。"
    },
    {
      "name": "巨鹿",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治瘿陶。"
    },
    {
      "name": "赵国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治邯郸。"
    },
    {
      "name": "常山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治元氏。"
    },
    {
      "name": "中山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治卢奴。"
    },
    {
      "name": "安平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治信都。冀州治所黄初后常在此。"
    },
    {
      "name": "河间",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治乐成。"
    },
    {
      "name": "勃海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治南皮。"
    },
    {
      "name": "清河",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉曾名甘陵，魏复称清河，治清河。"
    },
    {
      "name": "平原",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡。建安十八年（213）自青州改属冀州，治平原。"
    },
    {
      "name": "乐陵",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安十八年（213）分平原、勃海置，治厌次。"
    },
    {
      "name": "章武",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安末分河间、勃海置。嘉平年间废，249帧仍列，263帧起不再单列。"
    },
    {
      "name": "范阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "226年由涿郡改名，治涿。"
    },
    {
      "name": "燕国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "232年由广阳郡改燕国，治蓟。"
    },
    {
      "name": "代郡",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治高柳。鲜卑压力大，郡境控制不稳定。"
    },
    {
      "name": "上谷",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治沮阳。北缘与鲜卑相邻。"
    },
    {
      "name": "渔阳",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治渔阳。边郡，乌桓旧地，控制比内地弱。"
    },
    {
      "name": "右北平",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治土垠。东与鲜卑、辽西相连。"
    },
    {
      "name": "辽西",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治阳乐。鲜卑经常进出，城池在、乡野不稳。"
    },
    {
      "name": "昌黎",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "正始五年（244）由辽东属国改置。280年属平州。鲜卑活动频繁。"
    },
    {
      "name": "辽东",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "景初二年（238）司马懿破襄平后归魏，晋沿置。280年属平州。"
    },
    {
      "name": "玄菟",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治高句骊县旧地，郡境受高句丽挤压。238年前随公孙氏，其后归魏、晋。244年毌丘俭出击高句丽，并未把其地改为魏郡。"
    },
    {
      "name": "乐浪",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "朝鲜半岛北部旧郡，治朝鲜县。238年前由公孙氏管，其后归魏、晋。"
    },
    {
      "name": "带方",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安末公孙康分乐浪南部置。238年后归魏、晋。倭使接触曹魏，多经此郡。"
    },
    {
      "name": "太原",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治晋阳。并州治所。"
    },
    {
      "name": "上党",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治壶关，后常治潞。"
    },
    {
      "name": "西河",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治离石。南匈奴五部所在，行政在，部落势力大。"
    },
    {
      "name": "雁门",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治广武。鲜卑、匈奴交会，边郡。"
    },
    {
      "name": "新兴",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十年（215）废云中、定襄、五原、朔方，分太原置新兴以处其民，治九原。四郡故地不再设郡。"
    },
    {
      "name": "乐平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安二十一年（216）分上党、太原置，治沾。"
    },
    {
      "name": "京兆",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治长安。魏改左冯翊为冯翊、右扶风为扶风，三辅仍是关中核心。"
    },
    {
      "name": "冯翊",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "魏改左冯翊为冯翊郡，治临晋。"
    },
    {
      "name": "扶风",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "魏改右扶风为扶风郡，治槐里。"
    },
    {
      "name": "北地",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治泥阳。羌乱反复，乡野控制弱。"
    },
    {
      "name": "新平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "兴平元年（194）分安定、扶风置，治漆。"
    },
    {
      "name": "安定",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治临泾。陇东军事重镇，羌人时叛，郡治仍在魏、晋手中。"
    },
    {
      "name": "陇西",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治襄武。黄初曾短暂设秦州，旋废，本帧陇右仍属雍州。"
    },
    {
      "name": "南安",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "中平五年（188）分汉阳置，治獂道。228年诸葛亮第一次北伐时曾降蜀，随即复归魏。"
    },
    {
      "name": "天水",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治冀县。228年郡中诸县多应诸葛亮，街亭败后复归魏。"
    },
    {
      "name": "广魏",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末由永阳改广魏，治临渭。约泰始中改名略阳。271帧起书略阳，并划入秦州。"
    },
    {
      "name": "武都",
      "controller": "shu",
      "strength": "weak",
      "contenders": [
        "shu",
        "wei"
      ],
      "note": "建兴七年（229）春诸葛亮所得。郡在，氐人势力仍大，与魏边境相接。"
    },
    {
      "name": "阴平",
      "controller": "shu",
      "strength": "weak",
      "contenders": [
        "shu",
        "wei"
      ],
      "note": "229年与武都同入蜀。263年邓艾即由阴平小道入蜀。"
    },
    {
      "name": "金城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治榆中一带。建安末又分金城置西平。河西东口，羌、鲜卑时常扰动，郡治仍在。"
    },
    {
      "name": "武威",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "凉州治所，姑臧。271年鲜卑树机能已杀两任刺史，河西震动，本帧标弱。279年十二月马隆斩树机能，280年凉州平。"
    },
    {
      "name": "张掖",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治张掖。"
    },
    {
      "name": "酒泉",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治福禄。"
    },
    {
      "name": "敦煌",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治敦煌。走廊西端，行政在，离中原极远。"
    },
    {
      "name": "西郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "兴平二年（195）分张掖置，治日勒。"
    },
    {
      "name": "西平",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "建安末分金城置，治西都。羌人势力大。"
    },
    {
      "name": "西海",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，居延一带。户籍与驻军都少，近于边地哨所。"
    },
    {
      "name": "南阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治宛。魏荆州初治宛。"
    },
    {
      "name": "南乡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安十三年（208）分南阳置，治南乡。"
    },
    {
      "name": "襄阳",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "建安十三年（208）分南郡置，治襄阳。城为魏有，汉水一线与吴对峙。"
    },
    {
      "name": "义阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初初分南阳、江夏置。嘉平中废。249帧仍列，其后不再单列，晋平吴后另有义阳，不提前写入。"
    },
    {
      "name": "江夏（沔北）",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉江夏郡跨汉水。魏领安陆、石阳等沔北诸县。236年吴曾短暂占新市、安陆，随即失去。与吴境“江夏（江南）”是一郡分涂，地图需沿汉水切开。"
    },
    {
      "name": "新城",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "黄初元年（220）七月合房陵、上庸、西城为新城，治房陵。227年孟达叛，司马懿迅即平定。263年蜀灭前与蜀隔山对峙，其后不再是国境。"
    },
    {
      "name": "魏兴",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "215年曹操分汉中东部置西城郡，221年改名魏兴，治西城。220帧尚并在新城中。263年前与蜀对峙。"
    },
    {
      "name": "上庸",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "215年分汉中置，220年并入新城；228年复置，约230年废；237年再置，嘉平中又废；259年再置。本帧按此置废列入。234年不列。"
    },
    {
      "name": "淮南",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉九江郡，魏改称淮南，治寿春。合肥、寿春是对吴主战场。249年后诸葛诞等淮南三叛都发生在此，叛平后仍属魏，不是吴土。"
    },
    {
      "name": "庐江（皖北）",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉庐江郡被魏、吴分成两块。魏领皖北，合肥为其军镇。与吴境“庐江（皖）”须沿江切开。"
    },
    {
      "name": "蜀郡",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治成都。蜀汉都城，263年后为晋益州核心。"
    },
    {
      "name": "广汉",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治雒。265年梁州析出后改属梁州。"
    },
    {
      "name": "梓潼",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "建安二十二年（217）分广汉置，治梓潼。刘备入蜀时已有。"
    },
    {
      "name": "犍为",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治武阳。"
    },
    {
      "name": "江阳",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "建安十八年（213）分犍为置，治江阳。"
    },
    {
      "name": "汶山",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "建安末分蜀郡置，治绵虒。羌人地区，控制弱。"
    },
    {
      "name": "汉嘉",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "章武元年（221）由蜀郡属国改名，治汉嘉。240年张嶷曾平郡乱，乡野仍弱。"
    },
    {
      "name": "巴郡",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治江州（今重庆）。刘璋时已与巴西、巴东分治。"
    },
    {
      "name": "巴西",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治阆中。"
    },
    {
      "name": "巴东",
      "controller": "shu",
      "strength": "contested",
      "contenders": [
        "shu",
        "wu"
      ],
      "note": "221年由固陵改名，治鱼复，222年改鱼复为永安。夷陵败后，蜀守三峡西口，与吴建平、宜都相对。"
    },
    {
      "name": "涪陵",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "建安末改巴东属国为涪陵，治涪陵。滨五溪，248年邓芝曾讨郡夷，控制弱于成都平原。"
    },
    {
      "name": "汉中",
      "controller": "shu",
      "strength": "contested",
      "contenders": [
        "shu",
        "wei"
      ],
      "note": "219年刘备所得，治南郑。北缘阳平关与魏对峙，郡境本身是蜀的北边大门。"
    },
    {
      "name": "建宁",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "225年由益州郡改名。233年庲降都督才把治所稳定到味县。271年划入宁州。大姓势力大。"
    },
    {
      "name": "云南",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "225年分建宁、永昌置，治梇栋。271年属宁州。"
    },
    {
      "name": "兴古",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "225年分建宁、牂柯置，治宛温。271年属宁州。"
    },
    {
      "name": "牂柯",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治故且兰。223–225年曾叛，平后仍弱。271年宁州初置时尚未划入，仍属益州。"
    },
    {
      "name": "越巂",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治邛都。223年叛，240年张嶷重新打通郡道，其后仍弱。271年仍属益州。"
    },
    {
      "name": "永昌",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治不韦，远至今云南西部。南中叛乱时吕凯为蜀守住郡境。271年《晋书》把它算入宁州（或写作交州之永昌）。"
    },
    {
      "name": "朱提",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十年（215）刘备改犍为属国为朱提，治朱提。《晋书》或系于221年。接近南中，控制弱。延熙中曾分南广，约九年即废，各帧不单列。"
    },
    {
      "name": "丹阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治建业。郡治一带是吴的政治核心；郡南山区山越反复，没有单列到县。"
    },
    {
      "name": "吴郡",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治吴县。"
    },
    {
      "name": "会稽",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治山阴。257年分临海，260年分建安，266年分东阳，故后期辖境缩小。"
    },
    {
      "name": "豫章",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治南昌。"
    },
    {
      "name": "庐陵",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "建安初分豫章置，治西昌。236年又分南部都尉。"
    },
    {
      "name": "鄱阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "210年分豫章置，治鄱阳。225年以后郡治稳定，山区仍有零星山越。"
    },
    {
      "name": "新都（扬）",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "建安十三年（208）分丹阳置，治始新。为控制山越而设，全境标弱。"
    },
    {
      "name": "庐江（皖）",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "吴领庐江郡江南、皖城一带，治皖。与魏“庐江（皖北）”是一郡分涂。"
    },
    {
      "name": "蕲春",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "223年自魏收回，治蕲春。江北小郡，夹在两军之间。"
    },
    {
      "name": "毗陵典农",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "嘉禾三年（234）置，治毗陵，地位相当于郡，管屯田。平吴后不久改为毗陵郡。"
    },
    {
      "name": "庐陵南部都尉",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "嘉禾五年（236）分庐陵置，治雩都，地位相当于郡。入晋后改为南康郡。"
    },
    {
      "name": "南郡",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治江陵。219年吕蒙袭取。江陵是吴西边军镇，北与魏襄阳对峙，城本身长期在吴手中。"
    },
    {
      "name": "宜都",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "222年夷陵战败蜀后，夷陵改名西陵，郡境稳定属吴。260年分出建平。272年步阐据西陵降晋，数月后被陆抗夺回，不单独成帧。"
    },
    {
      "name": "江夏（江南）",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "吴领鄂、夏口、武昌（今鄂州）及江南诸县。221–229年、265–266年吴都在武昌，即本郡境。与魏“江夏（沔北）”须沿汉水切开。"
    },
    {
      "name": "长沙",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治临湘。257年分出衡阳、湘东，辖境缩小。"
    },
    {
      "name": "零陵",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治泉陵。265年分始安，266年分昭陵。"
    },
    {
      "name": "桂阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治郴。265年分始兴。"
    },
    {
      "name": "武陵",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "治临沅。沅水上游蛮族聚居，郡治在、溪峒弱。263年分天门。"
    },
    {
      "name": "临贺",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "黄武五年（226）分苍梧置，改属荆州，治临贺。"
    },
    {
      "name": "交趾",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "226年吕岱杀士徽后由吴直接设太守，治龙编。"
    },
    {
      "name": "九真",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "226年后吴直辖。当地渠帅势力大。"
    },
    {
      "name": "日南",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "吴直辖后仍是最弱的一郡。"
    },
    {
      "name": "合浦",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "226年后吴直接治理。交趾三郡脱离期间，吴的交州办事机构常退到合浦一带。"
    },
    {
      "name": "南海",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "226年士氏灭亡后归吴。同年曾短暂设广州，旋废，本帧仍统于交州。"
    },
    {
      "name": "苍梧",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治广信。226年分出临贺（改属荆州）。265年起属广州。"
    },
    {
      "name": "郁林",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "治布山。控制松。274年分桂林。265年起属广州。"
    },
    {
      "name": "高凉",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "220年分合浦置。226年后明确属吴。265年起属广州。"
    },
    {
      "name": "珠崖",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "赤乌五年（242）复置，在今海南。海上郡，控制弱，是否长期有官驻守，记载很稀。"
    }
  ],
  "capitals": [
    {
      "faction": "wei",
      "city": "洛阳",
      "lng": 112.62,
      "lat": 34.72,
      "role": "都城"
    },
    {
      "faction": "shu",
      "city": "成都",
      "lng": 104.06,
      "lat": 30.67,
      "role": "都城"
    },
    {
      "faction": "wu",
      "city": "建业",
      "lng": 118.78,
      "lat": 31.95,
      "role": "都城"
    },
    {
      "faction": "wu",
      "city": "武昌",
      "lng": 114.89,
      "lat": 30.4,
      "role": "陪都"
    }
  ],
  "sources": [
    "《三国志》魏书文帝纪、明帝纪、三少帝纪、明悼毛后无关；蜀书先主传、后主传；吴书吴主传、三嗣主传。交趾、辽东、南中细节见吕岱、士燮、公孙度、诸葛亮、霍弋等传。",
    "《晋书》卷三武帝纪（泰始五年置秦州、泰始七年七月交趾三郡降吴、八月置宁州、咸宁二年置平州、咸宁五年十二月凉州平、太康元年平吴）；卷十四至十五地理志。",
    "《资治通鉴》卷六十九至八十一。灭蜀月份从《三国志·三少帝纪》景元四年十一月，通鉴或系于十月。",
    "郡的置废主要对照《晋书·地理志》《华阳国志》巴志、蜀志、南中志，以及清人洪亮吉《补三国疆域志》、吴增仅《三国郡县表》、近人陈健梅《孙吴政区地理研究》的结论；与谭其骧《中国历史地图集》第三册“三国时期”标准年代（魏景元三年，262年）对读。维基百科条目只用来查找上述书的线索，有出入时以史志为准。"
  ]
}
```

## 249 年 高平陵之变

公元249年正月，司马懿在高平陵之变后控制洛阳。魏的疆域没有变，变的是谁做主，所以地图上的政权仍然写魏，不写晋。淮南仍是对吴前线，寿春后来的叛乱（255年毌丘俭、257年诸葛诞）都没有把这片土地交给吴。蜀在延熙年间增置东广汉，本帧开始列入；短命的南广、宕渠不单列。

```json
{
  "year": 249,
  "month": 1,
  "label": "高平陵之变",
  "provinces": [
    {
      "province": "司隶",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "豫州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "兖州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "青州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "徐州",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "冀州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "幽州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "并州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "雍州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "益州",
      "controller": "shu",
      "strength": "contested"
    },
    {
      "province": "凉州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "荆州（魏）",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "扬州（魏）",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "扬州（吴）",
      "controller": "wu",
      "strength": "contested"
    },
    {
      "province": "荆州（吴）",
      "controller": "wu",
      "strength": "contested"
    },
    {
      "province": "交州",
      "controller": "wu",
      "strength": "core"
    }
  ],
  "overrides": [
    {
      "name": "河南尹",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治洛阳，东汉旧名。魏、晋都城所在。"
    },
    {
      "name": "河内",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治怀县。"
    },
    {
      "name": "河东",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治安邑。247年分出平阳前，平阳一带仍属本郡。"
    },
    {
      "name": "弘农",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治弘农。函谷道所经。"
    },
    {
      "name": "平阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "正始八年（247）分河东置。220–244各帧不单列。"
    },
    {
      "name": "颍川",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治阳翟。"
    },
    {
      "name": "襄城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末曹操分颍川置，治襄城。"
    },
    {
      "name": "汝南",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治新息，后常治平舆一带。"
    },
    {
      "name": "汝阴",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末分汝南置，治汝阴。"
    },
    {
      "name": "梁国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治睢阳。"
    },
    {
      "name": "沛国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治沛。"
    },
    {
      "name": "谯郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安末分沛国置，治谯，曹氏乡里。"
    },
    {
      "name": "鲁郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治鲁。"
    },
    {
      "name": "陈郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治陈。"
    },
    {
      "name": "弋阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安二十三年（218）分汝南、江夏置，治弋阳，滨江夏北缘。"
    },
    {
      "name": "安丰",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初初分庐江置，属豫州，治安风。设立或在220–222之间，各帧从220列入。"
    },
    {
      "name": "陈留",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治陈留。"
    },
    {
      "name": "东郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治濮阳。"
    },
    {
      "name": "济阴",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治定陶。"
    },
    {
      "name": "山阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治昌邑。"
    },
    {
      "name": "任城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治任城。"
    },
    {
      "name": "东平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治无盐。"
    },
    {
      "name": "济北",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治卢。"
    },
    {
      "name": "泰山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治奉高。"
    },
    {
      "name": "齐国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治临淄。"
    },
    {
      "name": "济南",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治东平陵。"
    },
    {
      "name": "乐安",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治临济。"
    },
    {
      "name": "北海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治平寿。"
    },
    {
      "name": "东莱",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治黄。"
    },
    {
      "name": "城阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安三年（198）分琅邪、北海置，治东武。"
    },
    {
      "name": "彭城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治彭城。魏徐州常治此。"
    },
    {
      "name": "下邳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治下邳。"
    },
    {
      "name": "东海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治郯。"
    },
    {
      "name": "琅邪",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治开阳。"
    },
    {
      "name": "东莞",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安三年（198）分琅邪置，治东莞。"
    },
    {
      "name": "广陵",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "治淮阴一带。江北属魏（晋），江南江都等县时被吴占据，沿江是拉锯带。"
    },
    {
      "name": "魏郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治邺。221年分出广平、阳平后辖境缩小。邺是曹操旧都，此后仍是河北重镇。"
    },
    {
      "name": "广平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初二年（221）分魏郡置，治曲梁。"
    },
    {
      "name": "阳平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初二年（221）分魏郡置，治馆陶。"
    },
    {
      "name": "巨鹿",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治瘿陶。"
    },
    {
      "name": "赵国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治邯郸。"
    },
    {
      "name": "常山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治元氏。"
    },
    {
      "name": "中山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治卢奴。"
    },
    {
      "name": "安平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治信都。冀州治所黄初后常在此。"
    },
    {
      "name": "河间",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治乐成。"
    },
    {
      "name": "勃海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治南皮。"
    },
    {
      "name": "清河",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉曾名甘陵，魏复称清河，治清河。"
    },
    {
      "name": "平原",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡。建安十八年（213）自青州改属冀州，治平原。"
    },
    {
      "name": "乐陵",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安十八年（213）分平原、勃海置，治厌次。"
    },
    {
      "name": "章武",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安末分河间、勃海置。嘉平年间废，249帧仍列，263帧起不再单列。"
    },
    {
      "name": "范阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "226年由涿郡改名，治涿。"
    },
    {
      "name": "燕国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "232年由广阳郡改燕国，治蓟。"
    },
    {
      "name": "代郡",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治高柳。鲜卑压力大，郡境控制不稳定。"
    },
    {
      "name": "上谷",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治沮阳。北缘与鲜卑相邻。"
    },
    {
      "name": "渔阳",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治渔阳。边郡，乌桓旧地，控制比内地弱。"
    },
    {
      "name": "右北平",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治土垠。东与鲜卑、辽西相连。"
    },
    {
      "name": "辽西",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治阳乐。鲜卑经常进出，城池在、乡野不稳。"
    },
    {
      "name": "昌黎",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "正始五年（244）由辽东属国改置。280年属平州。鲜卑活动频繁。"
    },
    {
      "name": "辽东",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "景初二年（238）司马懿破襄平后归魏，晋沿置。280年属平州。"
    },
    {
      "name": "玄菟",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治高句骊县旧地，郡境受高句丽挤压。238年前随公孙氏，其后归魏、晋。244年毌丘俭出击高句丽，并未把其地改为魏郡。"
    },
    {
      "name": "乐浪",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "朝鲜半岛北部旧郡，治朝鲜县。238年前由公孙氏管，其后归魏、晋。"
    },
    {
      "name": "带方",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安末公孙康分乐浪南部置。238年后归魏、晋。倭使接触曹魏，多经此郡。"
    },
    {
      "name": "太原",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治晋阳。并州治所。"
    },
    {
      "name": "上党",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治壶关，后常治潞。"
    },
    {
      "name": "西河",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治离石。南匈奴五部所在，行政在，部落势力大。"
    },
    {
      "name": "雁门",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治广武。鲜卑、匈奴交会，边郡。"
    },
    {
      "name": "新兴",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十年（215）废云中、定襄、五原、朔方，分太原置新兴以处其民，治九原。四郡故地不再设郡。"
    },
    {
      "name": "乐平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安二十一年（216）分上党、太原置，治沾。"
    },
    {
      "name": "京兆",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治长安。魏改左冯翊为冯翊、右扶风为扶风，三辅仍是关中核心。"
    },
    {
      "name": "冯翊",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "魏改左冯翊为冯翊郡，治临晋。"
    },
    {
      "name": "扶风",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "魏改右扶风为扶风郡，治槐里。"
    },
    {
      "name": "北地",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治泥阳。羌乱反复，乡野控制弱。"
    },
    {
      "name": "新平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "兴平元年（194）分安定、扶风置，治漆。"
    },
    {
      "name": "安定",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治临泾。陇东军事重镇，羌人时叛，郡治仍在魏、晋手中。"
    },
    {
      "name": "陇西",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治襄武。黄初曾短暂设秦州，旋废，本帧陇右仍属雍州。"
    },
    {
      "name": "南安",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "中平五年（188）分汉阳置，治獂道。228年诸葛亮第一次北伐时曾降蜀，随即复归魏。"
    },
    {
      "name": "天水",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治冀县。228年郡中诸县多应诸葛亮，街亭败后复归魏。"
    },
    {
      "name": "广魏",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末由永阳改广魏，治临渭。约泰始中改名略阳。271帧起书略阳，并划入秦州。"
    },
    {
      "name": "武都",
      "controller": "shu",
      "strength": "weak",
      "contenders": [
        "shu",
        "wei"
      ],
      "note": "建兴七年（229）春诸葛亮所得。郡在，氐人势力仍大，与魏边境相接。"
    },
    {
      "name": "阴平",
      "controller": "shu",
      "strength": "weak",
      "contenders": [
        "shu",
        "wei"
      ],
      "note": "229年与武都同入蜀。263年邓艾即由阴平小道入蜀。"
    },
    {
      "name": "金城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治榆中一带。建安末又分金城置西平。河西东口，羌、鲜卑时常扰动，郡治仍在。"
    },
    {
      "name": "武威",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "凉州治所，姑臧。271年鲜卑树机能已杀两任刺史，河西震动，本帧标弱。279年十二月马隆斩树机能，280年凉州平。"
    },
    {
      "name": "张掖",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治张掖。"
    },
    {
      "name": "酒泉",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治福禄。"
    },
    {
      "name": "敦煌",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治敦煌。走廊西端，行政在，离中原极远。"
    },
    {
      "name": "西郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "兴平二年（195）分张掖置，治日勒。"
    },
    {
      "name": "西平",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "建安末分金城置，治西都。羌人势力大。"
    },
    {
      "name": "西海",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，居延一带。户籍与驻军都少，近于边地哨所。"
    },
    {
      "name": "南阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治宛。魏荆州初治宛。"
    },
    {
      "name": "南乡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安十三年（208）分南阳置，治南乡。"
    },
    {
      "name": "襄阳",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "建安十三年（208）分南郡置，治襄阳。城为魏有，汉水一线与吴对峙。"
    },
    {
      "name": "义阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初初分南阳、江夏置。嘉平中废。249帧仍列，其后不再单列，晋平吴后另有义阳，不提前写入。"
    },
    {
      "name": "江夏（沔北）",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉江夏郡跨汉水。魏领安陆、石阳等沔北诸县。236年吴曾短暂占新市、安陆，随即失去。与吴境“江夏（江南）”是一郡分涂，地图需沿汉水切开。"
    },
    {
      "name": "新城",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "黄初元年（220）七月合房陵、上庸、西城为新城，治房陵。227年孟达叛，司马懿迅即平定。263年蜀灭前与蜀隔山对峙，其后不再是国境。"
    },
    {
      "name": "魏兴",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "215年曹操分汉中东部置西城郡，221年改名魏兴，治西城。220帧尚并在新城中。263年前与蜀对峙。"
    },
    {
      "name": "上庸",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "shu"
      ],
      "note": "215年分汉中置，220年并入新城；228年复置，约230年废；237年再置，嘉平中又废；259年再置。本帧按此置废列入。234年不列。"
    },
    {
      "name": "淮南",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉九江郡，魏改称淮南，治寿春。合肥、寿春是对吴主战场。249年后诸葛诞等淮南三叛都发生在此，叛平后仍属魏，不是吴土。"
    },
    {
      "name": "庐江（皖北）",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉庐江郡被魏、吴分成两块。魏领皖北，合肥为其军镇。与吴境“庐江（皖）”须沿江切开。"
    },
    {
      "name": "蜀郡",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治成都。蜀汉都城，263年后为晋益州核心。"
    },
    {
      "name": "广汉",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治雒。265年梁州析出后改属梁州。"
    },
    {
      "name": "梓潼",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "建安二十二年（217）分广汉置，治梓潼。刘备入蜀时已有。"
    },
    {
      "name": "犍为",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治武阳。"
    },
    {
      "name": "江阳",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "建安十八年（213）分犍为置，治江阳。"
    },
    {
      "name": "汶山",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "建安末分蜀郡置，治绵虒。羌人地区，控制弱。"
    },
    {
      "name": "汉嘉",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "章武元年（221）由蜀郡属国改名，治汉嘉。240年张嶷曾平郡乱，乡野仍弱。"
    },
    {
      "name": "东广汉",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "延熙年间（238–257）分广汉置，治郪。确切年份不详，244帧不列，249帧起列。263年后晋改称新都，见“新都（梁）”。"
    },
    {
      "name": "巴郡",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治江州（今重庆）。刘璋时已与巴西、巴东分治。"
    },
    {
      "name": "巴西",
      "controller": "shu",
      "strength": "core",
      "contenders": [],
      "note": "治阆中。"
    },
    {
      "name": "巴东",
      "controller": "shu",
      "strength": "contested",
      "contenders": [
        "shu",
        "wu"
      ],
      "note": "221年由固陵改名，治鱼复，222年改鱼复为永安。夷陵败后，蜀守三峡西口，与吴建平、宜都相对。"
    },
    {
      "name": "涪陵",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "建安末改巴东属国为涪陵，治涪陵。滨五溪，248年邓芝曾讨郡夷，控制弱于成都平原。"
    },
    {
      "name": "汉中",
      "controller": "shu",
      "strength": "contested",
      "contenders": [
        "shu",
        "wei"
      ],
      "note": "219年刘备所得，治南郑。北缘阳平关与魏对峙，郡境本身是蜀的北边大门。"
    },
    {
      "name": "建宁",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "225年由益州郡改名。233年庲降都督才把治所稳定到味县。271年划入宁州。大姓势力大。"
    },
    {
      "name": "云南",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "225年分建宁、永昌置，治梇栋。271年属宁州。"
    },
    {
      "name": "兴古",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "225年分建宁、牂柯置，治宛温。271年属宁州。"
    },
    {
      "name": "牂柯",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治故且兰。223–225年曾叛，平后仍弱。271年宁州初置时尚未划入，仍属益州。"
    },
    {
      "name": "越巂",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治邛都。223年叛，240年张嶷重新打通郡道，其后仍弱。271年仍属益州。"
    },
    {
      "name": "永昌",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治不韦，远至今云南西部。南中叛乱时吕凯为蜀守住郡境。271年《晋书》把它算入宁州（或写作交州之永昌）。"
    },
    {
      "name": "朱提",
      "controller": "shu",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十年（215）刘备改犍为属国为朱提，治朱提。《晋书》或系于221年。接近南中，控制弱。延熙中曾分南广，约九年即废，各帧不单列。"
    },
    {
      "name": "丹阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治建业。郡治一带是吴的政治核心；郡南山区山越反复，没有单列到县。"
    },
    {
      "name": "吴郡",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治吴县。"
    },
    {
      "name": "会稽",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治山阴。257年分临海，260年分建安，266年分东阳，故后期辖境缩小。"
    },
    {
      "name": "豫章",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治南昌。"
    },
    {
      "name": "庐陵",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "建安初分豫章置，治西昌。236年又分南部都尉。"
    },
    {
      "name": "鄱阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "210年分豫章置，治鄱阳。225年以后郡治稳定，山区仍有零星山越。"
    },
    {
      "name": "新都（扬）",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "建安十三年（208）分丹阳置，治始新。为控制山越而设，全境标弱。"
    },
    {
      "name": "庐江（皖）",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "吴领庐江郡江南、皖城一带，治皖。与魏“庐江（皖北）”是一郡分涂。"
    },
    {
      "name": "蕲春",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "223年自魏收回，治蕲春。江北小郡，夹在两军之间。"
    },
    {
      "name": "毗陵典农",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "嘉禾三年（234）置，治毗陵，地位相当于郡，管屯田。平吴后不久改为毗陵郡。"
    },
    {
      "name": "庐陵南部都尉",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "嘉禾五年（236）分庐陵置，治雩都，地位相当于郡。入晋后改为南康郡。"
    },
    {
      "name": "南郡",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治江陵。219年吕蒙袭取。江陵是吴西边军镇，北与魏襄阳对峙，城本身长期在吴手中。"
    },
    {
      "name": "宜都",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "222年夷陵战败蜀后，夷陵改名西陵，郡境稳定属吴。260年分出建平。272年步阐据西陵降晋，数月后被陆抗夺回，不单独成帧。"
    },
    {
      "name": "江夏（江南）",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "吴领鄂、夏口、武昌（今鄂州）及江南诸县。221–229年、265–266年吴都在武昌，即本郡境。与魏“江夏（沔北）”须沿汉水切开。"
    },
    {
      "name": "长沙",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治临湘。257年分出衡阳、湘东，辖境缩小。"
    },
    {
      "name": "零陵",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治泉陵。265年分始安，266年分昭陵。"
    },
    {
      "name": "桂阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治郴。265年分始兴。"
    },
    {
      "name": "武陵",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "治临沅。沅水上游蛮族聚居，郡治在、溪峒弱。263年分天门。"
    },
    {
      "name": "临贺",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "黄武五年（226）分苍梧置，改属荆州，治临贺。"
    },
    {
      "name": "交趾",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "226年吕岱杀士徽后由吴直接设太守，治龙编。"
    },
    {
      "name": "九真",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "226年后吴直辖。当地渠帅势力大。"
    },
    {
      "name": "日南",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "吴直辖后仍是最弱的一郡。"
    },
    {
      "name": "合浦",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "226年后吴直接治理。交趾三郡脱离期间，吴的交州办事机构常退到合浦一带。"
    },
    {
      "name": "南海",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "226年士氏灭亡后归吴。同年曾短暂设广州，旋废，本帧仍统于交州。"
    },
    {
      "name": "苍梧",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治广信。226年分出临贺（改属荆州）。265年起属广州。"
    },
    {
      "name": "郁林",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "治布山。控制松。274年分桂林。265年起属广州。"
    },
    {
      "name": "高凉",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "220年分合浦置。226年后明确属吴。265年起属广州。"
    },
    {
      "name": "珠崖",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "赤乌五年（242）复置，在今海南。海上郡，控制弱，是否长期有官驻守，记载很稀。"
    }
  ],
  "capitals": [
    {
      "faction": "wei",
      "city": "洛阳",
      "lng": 112.62,
      "lat": 34.72,
      "role": "都城"
    },
    {
      "faction": "shu",
      "city": "成都",
      "lng": 104.06,
      "lat": 30.67,
      "role": "都城"
    },
    {
      "faction": "wu",
      "city": "建业",
      "lng": 118.78,
      "lat": 31.95,
      "role": "都城"
    },
    {
      "faction": "wu",
      "city": "武昌",
      "lng": 114.89,
      "lat": 30.4,
      "role": "陪都"
    }
  ],
  "sources": [
    "《三国志》魏书文帝纪、明帝纪、三少帝纪、明悼毛后无关；蜀书先主传、后主传；吴书吴主传、三嗣主传。交趾、辽东、南中细节见吕岱、士燮、公孙度、诸葛亮、霍弋等传。",
    "《晋书》卷三武帝纪（泰始五年置秦州、泰始七年七月交趾三郡降吴、八月置宁州、咸宁二年置平州、咸宁五年十二月凉州平、太康元年平吴）；卷十四至十五地理志。",
    "《资治通鉴》卷六十九至八十一。灭蜀月份从《三国志·三少帝纪》景元四年十一月，通鉴或系于十月。",
    "郡的置废主要对照《晋书·地理志》《华阳国志》巴志、蜀志、南中志，以及清人洪亮吉《补三国疆域志》、吴增仅《三国郡县表》、近人陈健梅《孙吴政区地理研究》的结论；与谭其骧《中国历史地图集》第三册“三国时期”标准年代（魏景元三年，262年）对读。维基百科条目只用来查找上述书的线索，有出入时以史志为准。"
  ]
}
```

## 263 年 魏灭蜀

公元263年十一月，刘禅向邓艾投降，蜀汉的郡转入魏。成都平原立刻换了旗号，南中只是随霍弋归附，山里并没有马上变成魏的稳固领土。梁州要到下一年才正式从益州分出，所以本帧原蜀地仍统称益州。几乎同时，交趾郡吏吕兴杀掉吴的太守、向魏求援，九真、日南响应，岭南南端开始松动，但魏的军队还没有在那里站稳。

```json
{
  "year": 263,
  "month": 11,
  "label": "魏灭蜀",
  "provinces": [
    {
      "province": "司隶",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "豫州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "兖州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "青州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "徐州",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "冀州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "幽州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "并州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "雍州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "益州",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "凉州",
      "controller": "wei",
      "strength": "core"
    },
    {
      "province": "荆州（魏）",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "扬州（魏）",
      "controller": "wei",
      "strength": "contested"
    },
    {
      "province": "扬州（吴）",
      "controller": "wu",
      "strength": "contested"
    },
    {
      "province": "荆州（吴）",
      "controller": "wu",
      "strength": "contested"
    },
    {
      "province": "交州",
      "controller": "wu",
      "strength": "contested"
    }
  ],
  "overrides": [
    {
      "name": "河南尹",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治洛阳，东汉旧名。魏、晋都城所在。"
    },
    {
      "name": "河内",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治怀县。"
    },
    {
      "name": "河东",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治安邑。247年分出平阳前，平阳一带仍属本郡。"
    },
    {
      "name": "弘农",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治弘农。函谷道所经。"
    },
    {
      "name": "平阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "正始八年（247）分河东置。220–244各帧不单列。"
    },
    {
      "name": "颍川",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治阳翟。"
    },
    {
      "name": "襄城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末曹操分颍川置，治襄城。"
    },
    {
      "name": "汝南",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治新息，后常治平舆一带。"
    },
    {
      "name": "汝阴",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末分汝南置，治汝阴。"
    },
    {
      "name": "梁国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治睢阳。"
    },
    {
      "name": "沛国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治沛。"
    },
    {
      "name": "谯郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安末分沛国置，治谯，曹氏乡里。"
    },
    {
      "name": "鲁郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治鲁。"
    },
    {
      "name": "陈郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治陈。"
    },
    {
      "name": "弋阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安二十三年（218）分汝南、江夏置，治弋阳，滨江夏北缘。"
    },
    {
      "name": "安丰",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初初分庐江置，属豫州，治安风。设立或在220–222之间，各帧从220列入。"
    },
    {
      "name": "陈留",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治陈留。"
    },
    {
      "name": "东郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治濮阳。"
    },
    {
      "name": "济阴",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治定陶。"
    },
    {
      "name": "山阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治昌邑。"
    },
    {
      "name": "任城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治任城。"
    },
    {
      "name": "东平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治无盐。"
    },
    {
      "name": "济北",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治卢。"
    },
    {
      "name": "泰山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治奉高。"
    },
    {
      "name": "齐国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治临淄。"
    },
    {
      "name": "济南",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治东平陵。"
    },
    {
      "name": "乐安",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治临济。"
    },
    {
      "name": "北海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治平寿。"
    },
    {
      "name": "东莱",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治黄。"
    },
    {
      "name": "城阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安三年（198）分琅邪、北海置，治东武。"
    },
    {
      "name": "彭城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治彭城。魏徐州常治此。"
    },
    {
      "name": "下邳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治下邳。"
    },
    {
      "name": "东海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治郯。"
    },
    {
      "name": "琅邪",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治开阳。"
    },
    {
      "name": "东莞",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安三年（198）分琅邪置，治东莞。"
    },
    {
      "name": "广陵",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "治淮阴一带。江北属魏（晋），江南江都等县时被吴占据，沿江是拉锯带。"
    },
    {
      "name": "魏郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治邺。221年分出广平、阳平后辖境缩小。邺是曹操旧都，此后仍是河北重镇。"
    },
    {
      "name": "广平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初二年（221）分魏郡置，治曲梁。"
    },
    {
      "name": "阳平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初二年（221）分魏郡置，治馆陶。"
    },
    {
      "name": "巨鹿",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治瘿陶。"
    },
    {
      "name": "赵国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治邯郸。"
    },
    {
      "name": "常山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治元氏。"
    },
    {
      "name": "中山",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治卢奴。"
    },
    {
      "name": "安平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治信都。冀州治所黄初后常在此。"
    },
    {
      "name": "河间",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治乐成。"
    },
    {
      "name": "勃海",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治南皮。"
    },
    {
      "name": "清河",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉曾名甘陵，魏复称清河，治清河。"
    },
    {
      "name": "平原",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡。建安十八年（213）自青州改属冀州，治平原。"
    },
    {
      "name": "乐陵",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安十八年（213）分平原、勃海置，治厌次。"
    },
    {
      "name": "范阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "226年由涿郡改名，治涿。"
    },
    {
      "name": "燕国",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "232年由广阳郡改燕国，治蓟。"
    },
    {
      "name": "代郡",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治高柳。鲜卑压力大，郡境控制不稳定。"
    },
    {
      "name": "上谷",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治沮阳。北缘与鲜卑相邻。"
    },
    {
      "name": "渔阳",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治渔阳。边郡，乌桓旧地，控制比内地弱。"
    },
    {
      "name": "右北平",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治土垠。东与鲜卑、辽西相连。"
    },
    {
      "name": "辽西",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治阳乐。鲜卑经常进出，城池在、乡野不稳。"
    },
    {
      "name": "昌黎",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "正始五年（244）由辽东属国改置。280年属平州。鲜卑活动频繁。"
    },
    {
      "name": "辽东",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "景初二年（238）司马懿破襄平后归魏，晋沿置。280年属平州。"
    },
    {
      "name": "玄菟",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治高句骊县旧地，郡境受高句丽挤压。238年前随公孙氏，其后归魏、晋。244年毌丘俭出击高句丽，并未把其地改为魏郡。"
    },
    {
      "name": "乐浪",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "朝鲜半岛北部旧郡，治朝鲜县。238年前由公孙氏管，其后归魏、晋。"
    },
    {
      "name": "带方",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安末公孙康分乐浪南部置。238年后归魏、晋。倭使接触曹魏，多经此郡。"
    },
    {
      "name": "太原",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治晋阳。并州治所。"
    },
    {
      "name": "上党",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治壶关，后常治潞。"
    },
    {
      "name": "西河",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治离石。南匈奴五部所在，行政在，部落势力大。"
    },
    {
      "name": "雁门",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治广武。鲜卑、匈奴交会，边郡。"
    },
    {
      "name": "新兴",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十年（215）废云中、定襄、五原、朔方，分太原置新兴以处其民，治九原。四郡故地不再设郡。"
    },
    {
      "name": "乐平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安二十一年（216）分上党、太原置，治沾。"
    },
    {
      "name": "京兆",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治长安。魏改左冯翊为冯翊、右扶风为扶风，三辅仍是关中核心。"
    },
    {
      "name": "冯翊",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "魏改左冯翊为冯翊郡，治临晋。"
    },
    {
      "name": "扶风",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "魏改右扶风为扶风郡，治槐里。"
    },
    {
      "name": "北地",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "治泥阳。羌乱反复，乡野控制弱。"
    },
    {
      "name": "新平",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "兴平元年（194）分安定、扶风置，治漆。"
    },
    {
      "name": "安定",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治临泾。陇东军事重镇，羌人时叛，郡治仍在魏、晋手中。"
    },
    {
      "name": "陇西",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治襄武。黄初曾短暂设秦州，旋废，本帧陇右仍属雍州。"
    },
    {
      "name": "南安",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "中平五年（188）分汉阳置，治獂道。228年诸葛亮第一次北伐时曾降蜀，随即复归魏。"
    },
    {
      "name": "天水",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治冀县。228年郡中诸县多应诸葛亮，街亭败后复归魏。"
    },
    {
      "name": "广魏",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "汉末由永阳改广魏，治临渭。约泰始中改名略阳。271帧起书略阳，并划入秦州。"
    },
    {
      "name": "武都",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "263年随蜀入魏。265–269年间属梁州，269年秦州成立后属秦州。氐人地区，控制弱。"
    },
    {
      "name": "阴平",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "263年后归魏、晋。地理志以阴平属秦州；武帝纪写作“阳平”，应从地理志。"
    },
    {
      "name": "金城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治榆中一带。建安末又分金城置西平。河西东口，羌、鲜卑时常扰动，郡治仍在。"
    },
    {
      "name": "武威",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "凉州治所，姑臧。271年鲜卑树机能已杀两任刺史，河西震动，本帧标弱。279年十二月马隆斩树机能，280年凉州平。"
    },
    {
      "name": "张掖",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治张掖。"
    },
    {
      "name": "酒泉",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治福禄。"
    },
    {
      "name": "敦煌",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治敦煌。走廊西端，行政在，离中原极远。"
    },
    {
      "name": "西郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "兴平二年（195）分张掖置，治日勒。"
    },
    {
      "name": "西平",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "建安末分金城置，治西都。羌人势力大。"
    },
    {
      "name": "西海",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，居延一带。户籍与驻军都少，近于边地哨所。"
    },
    {
      "name": "南阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治宛。魏荆州初治宛。"
    },
    {
      "name": "南乡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安十三年（208）分南阳置，治南乡。"
    },
    {
      "name": "襄阳",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "建安十三年（208）分南郡置，治襄阳。城为魏有，汉水一线与吴对峙。"
    },
    {
      "name": "江夏（沔北）",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉江夏郡跨汉水。魏领安陆、石阳等沔北诸县。236年吴曾短暂占新市、安陆，随即失去。与吴境“江夏（江南）”是一郡分涂，地图需沿汉水切开。"
    },
    {
      "name": "新城",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "黄初元年（220）七月合房陵、上庸、西城为新城，治房陵。227年孟达叛，司马懿迅即平定。263年蜀灭前与蜀隔山对峙，其后不再是国境。"
    },
    {
      "name": "魏兴",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "215年曹操分汉中东部置西城郡，221年改名魏兴，治西城。220帧尚并在新城中。263年前与蜀对峙。"
    },
    {
      "name": "上庸",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "215年分汉中置，220年并入新城；228年复置，约230年废；237年再置，嘉平中又废；259年再置。本帧按此置废列入。234年不列。"
    },
    {
      "name": "淮南",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉九江郡，魏改称淮南，治寿春。合肥、寿春是对吴主战场。249年后诸葛诞等淮南三叛都发生在此，叛平后仍属魏，不是吴土。"
    },
    {
      "name": "庐江（皖北）",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "东汉庐江郡被魏、吴分成两块。魏领皖北，合肥为其军镇。与吴境“庐江（皖）”须沿江切开。"
    },
    {
      "name": "蜀郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治成都。蜀汉都城，263年后为晋益州核心。"
    },
    {
      "name": "广汉",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治雒。265年梁州析出后改属梁州。"
    },
    {
      "name": "梓潼",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安二十二年（217）分广汉置，治梓潼。刘备入蜀时已有。"
    },
    {
      "name": "犍为",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治武阳。"
    },
    {
      "name": "江阳",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "建安十八年（213）分犍为置，治江阳。"
    },
    {
      "name": "汶山",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "建安末分蜀郡置，治绵虒。羌人地区，控制弱。"
    },
    {
      "name": "汉嘉",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "章武元年（221）由蜀郡属国改名，治汉嘉。240年张嶷曾平郡乱，乡野仍弱。"
    },
    {
      "name": "东广汉",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "延熙年间（238–257）分广汉置，治郪。确切年份不详，244帧不列，249帧起列。263年后晋改称新都，见“新都（梁）”。"
    },
    {
      "name": "巴郡",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治江州（今重庆）。刘璋时已与巴西、巴东分治。"
    },
    {
      "name": "巴西",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "治阆中。"
    },
    {
      "name": "巴东",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "263年随蜀入魏。西陵以东仍是吴土，巴东仍是江防前哨，至280年。"
    },
    {
      "name": "涪陵",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "建安末改巴东属国为涪陵，治涪陵。滨五溪，248年邓芝曾讨郡夷，控制弱于成都平原。"
    },
    {
      "name": "汉中",
      "controller": "wei",
      "strength": "core",
      "contenders": [],
      "note": "263年钟会大军入境，此后属魏、晋梁州。国境北移，不再与蜀对峙。"
    },
    {
      "name": "建宁",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "225年由益州郡改名。233年庲降都督才把治所稳定到味县。271年划入宁州。大姓势力大。"
    },
    {
      "name": "云南",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "225年分建宁、永昌置，治梇栋。271年属宁州。"
    },
    {
      "name": "兴古",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "225年分建宁、牂柯置，治宛温。271年属宁州。"
    },
    {
      "name": "牂柯",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治故且兰。223–225年曾叛，平后仍弱。271年宁州初置时尚未划入，仍属益州。"
    },
    {
      "name": "越巂",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治邛都。223年叛，240年张嶷重新打通郡道，其后仍弱。271年仍属益州。"
    },
    {
      "name": "永昌",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治不韦，远至今云南西部。南中叛乱时吕凯为蜀守住郡境。271年《晋书》把它算入宁州（或写作交州之永昌）。"
    },
    {
      "name": "朱提",
      "controller": "wei",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十年（215）刘备改犍为属国为朱提，治朱提。《晋书》或系于221年。接近南中，控制弱。延熙中曾分南广，约九年即废，各帧不单列。"
    },
    {
      "name": "丹阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治建业。郡治一带是吴的政治核心；郡南山区山越反复，没有单列到县。"
    },
    {
      "name": "吴郡",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治吴县。"
    },
    {
      "name": "会稽",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治山阴。257年分临海，260年分建安，266年分东阳，故后期辖境缩小。"
    },
    {
      "name": "豫章",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治南昌。"
    },
    {
      "name": "庐陵",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "建安初分豫章置，治西昌。236年又分南部都尉。"
    },
    {
      "name": "鄱阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "210年分豫章置，治鄱阳。225年以后郡治稳定，山区仍有零星山越。"
    },
    {
      "name": "新都（扬）",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "建安十三年（208）分丹阳置，治始新。为控制山越而设，全境标弱。"
    },
    {
      "name": "庐江（皖）",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "吴领庐江郡江南、皖城一带，治皖。与魏“庐江（皖北）”是一郡分涂。"
    },
    {
      "name": "蕲春",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "223年自魏收回，治蕲春。江北小郡，夹在两军之间。"
    },
    {
      "name": "毗陵典农",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "嘉禾三年（234）置，治毗陵，地位相当于郡，管屯田。平吴后不久改为毗陵郡。"
    },
    {
      "name": "庐陵南部都尉",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "嘉禾五年（236）分庐陵置，治雩都，地位相当于郡。入晋后改为南康郡。"
    },
    {
      "name": "临海",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "太平二年（257）分会稽东部置，治章安。滨海，山越、水民多，标弱。"
    },
    {
      "name": "临川",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "太平二年（257）分豫章置，治南城。建安末另有短命的丹阳临川郡，与此不是一地，不列入。"
    },
    {
      "name": "建安",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "永安三年（260）分会稽南部置，治建安。今福建一带，开发有限，标弱。"
    },
    {
      "name": "南郡",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治江陵。219年吕蒙袭取。江陵是吴西边军镇，北与魏襄阳对峙，城本身长期在吴手中。"
    },
    {
      "name": "宜都",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "222年夷陵战败蜀后，夷陵改名西陵，郡境稳定属吴。260年分出建平。272年步阐据西陵降晋，数月后被陆抗夺回，不单独成帧。"
    },
    {
      "name": "江夏（江南）",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "吴领鄂、夏口、武昌（今鄂州）及江南诸县。221–229年、265–266年吴都在武昌，即本郡境。与魏“江夏（沔北）”须沿汉水切开。"
    },
    {
      "name": "长沙",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治临湘。257年分出衡阳、湘东，辖境缩小。"
    },
    {
      "name": "零陵",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治泉陵。265年分始安，266年分昭陵。"
    },
    {
      "name": "桂阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治郴。265年分始兴。"
    },
    {
      "name": "武陵",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "治临沅。沅水上游蛮族聚居，郡治在、溪峒弱。263年分天门。"
    },
    {
      "name": "临贺",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "黄武五年（226）分苍梧置，改属荆州，治临贺。"
    },
    {
      "name": "衡阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "太平二年（257）分长沙、零陵置，治湘南。"
    },
    {
      "name": "湘东",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "太平二年（257）分长沙、桂阳置，治酃。"
    },
    {
      "name": "建平",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "wei"
      ],
      "note": "永安三年（260）分宜都西部置，初治巫。与蜀巴东隔三峡对峙。"
    },
    {
      "name": "天门",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "永安六年（263）分武陵置，治零阳。溪峒地区，标弱。"
    },
    {
      "name": "交趾",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "226年吕岱杀士徽后由吴直接设太守，治龙编。263年郡吏吕兴杀吴太守，向魏求援。魏、晋派过守将，但海路难通，吴军265年后持续反攻。271年七月陶璜收复。"
    },
    {
      "name": "九真",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "226年后吴直辖。当地渠帅势力大。263年郡吏吕兴杀吴太守，向魏求援。魏、晋派过守将，但海路难通，吴军265年后持续反攻。271年七月陶璜收复。"
    },
    {
      "name": "日南",
      "controller": "wei",
      "strength": "contested",
      "contenders": [
        "wei",
        "wu"
      ],
      "note": "吴直辖后仍是最弱的一郡。263年郡吏吕兴杀吴太守，向魏求援。魏、晋派过守将，但海路难通，吴军265年后持续反攻。271年七月陶璜收复。"
    },
    {
      "name": "合浦",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "226年后吴直接治理。交趾三郡脱离期间，吴的交州办事机构常退到合浦一带。"
    },
    {
      "name": "合浦北部都尉",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "永安三年（260）分合浦置，治平山，地位相当于郡。入晋后为宁浦郡。"
    },
    {
      "name": "南海",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "226年士氏灭亡后归吴。同年曾短暂设广州，旋废，本帧仍统于交州。"
    },
    {
      "name": "苍梧",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治广信。226年分出临贺（改属荆州）。265年起属广州。"
    },
    {
      "name": "郁林",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "治布山。控制松。274年分桂林。265年起属广州。"
    },
    {
      "name": "高凉",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "220年分合浦置。226年后明确属吴。265年起属广州。"
    },
    {
      "name": "珠崖",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "赤乌五年（242）复置，在今海南。海上郡，控制弱，是否长期有官驻守，记载很稀。"
    }
  ],
  "capitals": [
    {
      "faction": "wei",
      "city": "洛阳",
      "lng": 112.62,
      "lat": 34.72,
      "role": "都城"
    },
    {
      "faction": "wu",
      "city": "建业",
      "lng": 118.78,
      "lat": 31.95,
      "role": "都城"
    },
    {
      "faction": "wu",
      "city": "武昌",
      "lng": 114.89,
      "lat": 30.4,
      "role": "陪都"
    }
  ],
  "sources": [
    "《三国志》魏书文帝纪、明帝纪、三少帝纪、明悼毛后无关；蜀书先主传、后主传；吴书吴主传、三嗣主传。交趾、辽东、南中细节见吕岱、士燮、公孙度、诸葛亮、霍弋等传。",
    "《晋书》卷三武帝纪（泰始五年置秦州、泰始七年七月交趾三郡降吴、八月置宁州、咸宁二年置平州、咸宁五年十二月凉州平、太康元年平吴）；卷十四至十五地理志。",
    "《资治通鉴》卷六十九至八十一。灭蜀月份从《三国志·三少帝纪》景元四年十一月，通鉴或系于十月。",
    "郡的置废主要对照《晋书·地理志》《华阳国志》巴志、蜀志、南中志，以及清人洪亮吉《补三国疆域志》、吴增仅《三国郡县表》、近人陈健梅《孙吴政区地理研究》的结论；与谭其骧《中国历史地图集》第三册“三国时期”标准年代（魏景元三年，262年）对读。维基百科条目只用来查找上述书的线索，有出入时以史志为准。"
  ]
}
```

## 265 年 司马炎建晋

公元265年十二月，司马炎代魏称帝，都城仍是洛阳。原魏地改标晋，原蜀地已经分出梁州，益州还领着南中。岭南则是另一番景象：广州在264年重新从交州分出，仍属吴；交趾、九真、日南名义上归晋，吴正准备夺回。孙皓把吴的都城临时迁到武昌，第二年才迁回建业。秦州要到269年才设，本帧陇右仍属雍州。

```json
{
  "year": 265,
  "month": 12,
  "label": "司马炎建晋",
  "provinces": [
    {
      "province": "司州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "豫州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "兖州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "青州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "徐州",
      "controller": "jin",
      "strength": "contested"
    },
    {
      "province": "冀州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "幽州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "并州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "雍州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "梁州",
      "controller": "jin",
      "strength": "contested"
    },
    {
      "province": "凉州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "荆州（魏）",
      "controller": "jin",
      "strength": "contested"
    },
    {
      "province": "扬州（魏）",
      "controller": "jin",
      "strength": "contested"
    },
    {
      "province": "益州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "扬州（吴）",
      "controller": "wu",
      "strength": "contested"
    },
    {
      "province": "荆州（吴）",
      "controller": "wu",
      "strength": "contested"
    },
    {
      "province": "交州",
      "controller": "jin",
      "strength": "contested"
    },
    {
      "province": "广州",
      "controller": "wu",
      "strength": "core"
    }
  ],
  "overrides": [
    {
      "name": "河南尹",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治洛阳，东汉旧名。魏、晋都城所在。"
    },
    {
      "name": "河内",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治怀县。"
    },
    {
      "name": "河东",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治安邑。247年分出平阳前，平阳一带仍属本郡。"
    },
    {
      "name": "弘农",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治弘农。函谷道所经。"
    },
    {
      "name": "平阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "正始八年（247）分河东置。220–244各帧不单列。"
    },
    {
      "name": "颍川",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治阳翟。"
    },
    {
      "name": "襄城",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "汉末曹操分颍川置，治襄城。"
    },
    {
      "name": "汝南",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治新息，后常治平舆一带。"
    },
    {
      "name": "汝阴",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "汉末分汝南置，治汝阴。"
    },
    {
      "name": "梁国",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治睢阳。"
    },
    {
      "name": "沛国",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治沛。"
    },
    {
      "name": "谯郡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安末分沛国置，治谯，曹氏乡里。"
    },
    {
      "name": "鲁郡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治鲁。"
    },
    {
      "name": "陈郡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治陈。"
    },
    {
      "name": "弋阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安二十三年（218）分汝南、江夏置，治弋阳，滨江夏北缘。"
    },
    {
      "name": "安丰",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "黄初初分庐江置，属豫州，治安风。设立或在220–222之间，各帧从220列入。"
    },
    {
      "name": "陈留",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治陈留。"
    },
    {
      "name": "东郡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治濮阳。"
    },
    {
      "name": "济阴",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治定陶。"
    },
    {
      "name": "山阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治昌邑。"
    },
    {
      "name": "任城",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治任城。"
    },
    {
      "name": "东平",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治无盐。"
    },
    {
      "name": "济北",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治卢。"
    },
    {
      "name": "泰山",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治奉高。"
    },
    {
      "name": "齐国",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治临淄。"
    },
    {
      "name": "济南",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治东平陵。"
    },
    {
      "name": "乐安",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治临济。"
    },
    {
      "name": "北海",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治平寿。"
    },
    {
      "name": "东莱",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治黄。"
    },
    {
      "name": "城阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安三年（198）分琅邪、北海置，治东武。"
    },
    {
      "name": "彭城",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治彭城。魏徐州常治此。"
    },
    {
      "name": "下邳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治下邳。"
    },
    {
      "name": "东海",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治郯。"
    },
    {
      "name": "琅邪",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治开阳。"
    },
    {
      "name": "东莞",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安三年（198）分琅邪置，治东莞。"
    },
    {
      "name": "广陵",
      "controller": "jin",
      "strength": "contested",
      "contenders": [
        "jin",
        "wu"
      ],
      "note": "治淮阴一带。江北属魏（晋），江南江都等县时被吴占据，沿江是拉锯带。"
    },
    {
      "name": "魏郡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治邺。221年分出广平、阳平后辖境缩小。邺是曹操旧都，此后仍是河北重镇。"
    },
    {
      "name": "广平",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "黄初二年（221）分魏郡置，治曲梁。"
    },
    {
      "name": "阳平",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "黄初二年（221）分魏郡置，治馆陶。"
    },
    {
      "name": "巨鹿",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治瘿陶。"
    },
    {
      "name": "赵国",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治邯郸。"
    },
    {
      "name": "常山",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治元氏。"
    },
    {
      "name": "中山",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治卢奴。"
    },
    {
      "name": "安平",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治信都。冀州治所黄初后常在此。"
    },
    {
      "name": "河间",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治乐成。"
    },
    {
      "name": "勃海",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治南皮。"
    },
    {
      "name": "清河",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉曾名甘陵，魏复称清河，治清河。"
    },
    {
      "name": "平原",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡。建安十八年（213）自青州改属冀州，治平原。"
    },
    {
      "name": "乐陵",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安十八年（213）分平原、勃海置，治厌次。"
    },
    {
      "name": "范阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "226年由涿郡改名，治涿。"
    },
    {
      "name": "燕国",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "232年由广阳郡改燕国，治蓟。"
    },
    {
      "name": "代郡",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治高柳。鲜卑压力大，郡境控制不稳定。"
    },
    {
      "name": "上谷",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治沮阳。北缘与鲜卑相邻。"
    },
    {
      "name": "渔阳",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治渔阳。边郡，乌桓旧地，控制比内地弱。"
    },
    {
      "name": "右北平",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治土垠。东与鲜卑、辽西相连。"
    },
    {
      "name": "辽西",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治阳乐。鲜卑经常进出，城池在、乡野不稳。"
    },
    {
      "name": "昌黎",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "正始五年（244）由辽东属国改置。280年属平州。鲜卑活动频繁。"
    },
    {
      "name": "辽东",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "景初二年（238）司马懿破襄平后归魏，晋沿置。280年属平州。"
    },
    {
      "name": "玄菟",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治高句骊县旧地，郡境受高句丽挤压。238年前随公孙氏，其后归魏、晋。244年毌丘俭出击高句丽，并未把其地改为魏郡。"
    },
    {
      "name": "乐浪",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "朝鲜半岛北部旧郡，治朝鲜县。238年前由公孙氏管，其后归魏、晋。"
    },
    {
      "name": "带方",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安末公孙康分乐浪南部置。238年后归魏、晋。倭使接触曹魏，多经此郡。"
    },
    {
      "name": "太原",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治晋阳。并州治所。"
    },
    {
      "name": "上党",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治壶关，后常治潞。"
    },
    {
      "name": "西河",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治离石。南匈奴五部所在，行政在，部落势力大。"
    },
    {
      "name": "雁门",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治广武。鲜卑、匈奴交会，边郡。"
    },
    {
      "name": "新兴",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十年（215）废云中、定襄、五原、朔方，分太原置新兴以处其民，治九原。四郡故地不再设郡。"
    },
    {
      "name": "乐平",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安二十一年（216）分上党、太原置，治沾。"
    },
    {
      "name": "京兆",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治长安。魏改左冯翊为冯翊、右扶风为扶风，三辅仍是关中核心。"
    },
    {
      "name": "冯翊",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "魏改左冯翊为冯翊郡，治临晋。"
    },
    {
      "name": "扶风",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "魏改右扶风为扶风郡，治槐里。"
    },
    {
      "name": "北地",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治泥阳。羌乱反复，乡野控制弱。"
    },
    {
      "name": "新平",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "兴平元年（194）分安定、扶风置，治漆。"
    },
    {
      "name": "安定",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治临泾。陇东军事重镇，羌人时叛，郡治仍在魏、晋手中。"
    },
    {
      "name": "陇西",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治襄武。黄初曾短暂设秦州，旋废，本帧陇右仍属雍州。"
    },
    {
      "name": "南安",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "中平五年（188）分汉阳置，治獂道。228年诸葛亮第一次北伐时曾降蜀，随即复归魏。"
    },
    {
      "name": "天水",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治冀县。228年郡中诸县多应诸葛亮，街亭败后复归魏。"
    },
    {
      "name": "广魏",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "汉末由永阳改广魏，治临渭。约泰始中改名略阳。271帧起书略阳，并划入秦州。"
    },
    {
      "name": "武都",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "263年随蜀入魏。265–269年间属梁州，269年秦州成立后属秦州。氐人地区，控制弱。"
    },
    {
      "name": "阴平",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "263年后归魏、晋。地理志以阴平属秦州；武帝纪写作“阳平”，应从地理志。"
    },
    {
      "name": "金城",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治榆中一带。建安末又分金城置西平。河西东口，羌、鲜卑时常扰动，郡治仍在。"
    },
    {
      "name": "武威",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "凉州治所，姑臧。271年鲜卑树机能已杀两任刺史，河西震动，本帧标弱。279年十二月马隆斩树机能，280年凉州平。"
    },
    {
      "name": "张掖",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治张掖。"
    },
    {
      "name": "酒泉",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治福禄。"
    },
    {
      "name": "敦煌",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治敦煌。走廊西端，行政在，离中原极远。"
    },
    {
      "name": "西郡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "兴平二年（195）分张掖置，治日勒。"
    },
    {
      "name": "西平",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "建安末分金城置，治西都。羌人势力大。"
    },
    {
      "name": "西海",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，居延一带。户籍与驻军都少，近于边地哨所。"
    },
    {
      "name": "南阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治宛。魏荆州初治宛。"
    },
    {
      "name": "南乡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安十三年（208）分南阳置，治南乡。"
    },
    {
      "name": "襄阳",
      "controller": "jin",
      "strength": "contested",
      "contenders": [
        "jin",
        "wu"
      ],
      "note": "建安十三年（208）分南郡置，治襄阳。城为魏有，汉水一线与吴对峙。"
    },
    {
      "name": "江夏（沔北）",
      "controller": "jin",
      "strength": "contested",
      "contenders": [
        "jin",
        "wu"
      ],
      "note": "东汉江夏郡跨汉水。魏领安陆、石阳等沔北诸县。236年吴曾短暂占新市、安陆，随即失去。与吴境“江夏（江南）”是一郡分涂，地图需沿汉水切开。"
    },
    {
      "name": "新城",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "黄初元年（220）七月合房陵、上庸、西城为新城，治房陵。227年孟达叛，司马懿迅即平定。263年蜀灭前与蜀隔山对峙，其后不再是国境。"
    },
    {
      "name": "魏兴",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "215年曹操分汉中东部置西城郡，221年改名魏兴，治西城。220帧尚并在新城中。263年前与蜀对峙。"
    },
    {
      "name": "上庸",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "215年分汉中置，220年并入新城；228年复置，约230年废；237年再置，嘉平中又废；259年再置。本帧按此置废列入。234年不列。"
    },
    {
      "name": "淮南",
      "controller": "jin",
      "strength": "contested",
      "contenders": [
        "jin",
        "wu"
      ],
      "note": "东汉九江郡，魏改称淮南，治寿春。合肥、寿春是对吴主战场。249年后诸葛诞等淮南三叛都发生在此，叛平后仍属魏，不是吴土。"
    },
    {
      "name": "庐江（皖北）",
      "controller": "jin",
      "strength": "contested",
      "contenders": [
        "jin",
        "wu"
      ],
      "note": "东汉庐江郡被魏、吴分成两块。魏领皖北，合肥为其军镇。与吴境“庐江（皖）”须沿江切开。"
    },
    {
      "name": "蜀郡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治成都。蜀汉都城，263年后为晋益州核心。"
    },
    {
      "name": "广汉",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治雒。265年梁州析出后改属梁州。"
    },
    {
      "name": "梓潼",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安二十二年（217）分广汉置，治梓潼。刘备入蜀时已有。"
    },
    {
      "name": "犍为",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治武阳。"
    },
    {
      "name": "江阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安十八年（213）分犍为置，治江阳。"
    },
    {
      "name": "汶山",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "建安末分蜀郡置，治绵虒。羌人地区，控制弱。"
    },
    {
      "name": "汉嘉",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "章武元年（221）由蜀郡属国改名，治汉嘉。240年张嶷曾平郡乱，乡野仍弱。"
    },
    {
      "name": "新都（梁）",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "咸熙、泰始间由蜀东广汉改名，治郪。与扬州的新都（今浙江、安徽一带）不是一地。"
    },
    {
      "name": "巴郡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治江州（今重庆）。刘璋时已与巴西、巴东分治。"
    },
    {
      "name": "巴西",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治阆中。"
    },
    {
      "name": "巴东",
      "controller": "jin",
      "strength": "contested",
      "contenders": [
        "jin",
        "wu"
      ],
      "note": "263年随蜀入魏。西陵以东仍是吴土，巴东仍是江防前哨，至280年。"
    },
    {
      "name": "涪陵",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "建安末改巴东属国为涪陵，治涪陵。滨五溪，248年邓芝曾讨郡夷，控制弱于成都平原。"
    },
    {
      "name": "汉中",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "263年钟会大军入境，此后属魏、晋梁州。国境北移，不再与蜀对峙。"
    },
    {
      "name": "建宁",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "225年由益州郡改名。233年庲降都督才把治所稳定到味县。271年划入宁州。大姓势力大。"
    },
    {
      "name": "云南",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "225年分建宁、永昌置，治梇栋。271年属宁州。"
    },
    {
      "name": "兴古",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "225年分建宁、牂柯置，治宛温。271年属宁州。"
    },
    {
      "name": "牂柯",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治故且兰。223–225年曾叛，平后仍弱。271年宁州初置时尚未划入，仍属益州。"
    },
    {
      "name": "越巂",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治邛都。223年叛，240年张嶷重新打通郡道，其后仍弱。271年仍属益州。"
    },
    {
      "name": "永昌",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治不韦，远至今云南西部。南中叛乱时吕凯为蜀守住郡境。271年《晋书》把它算入宁州（或写作交州之永昌）。"
    },
    {
      "name": "朱提",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十年（215）刘备改犍为属国为朱提，治朱提。《晋书》或系于221年。接近南中，控制弱。延熙中曾分南广，约九年即废，各帧不单列。"
    },
    {
      "name": "丹阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治建业。郡治一带是吴的政治核心；郡南山区山越反复，没有单列到县。"
    },
    {
      "name": "吴郡",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治吴县。"
    },
    {
      "name": "会稽",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治山阴。257年分临海，260年分建安，266年分东阳，故后期辖境缩小。"
    },
    {
      "name": "豫章",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治南昌。"
    },
    {
      "name": "庐陵",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "建安初分豫章置，治西昌。236年又分南部都尉。"
    },
    {
      "name": "鄱阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "210年分豫章置，治鄱阳。225年以后郡治稳定，山区仍有零星山越。"
    },
    {
      "name": "新都（扬）",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "建安十三年（208）分丹阳置，治始新。为控制山越而设，全境标弱。"
    },
    {
      "name": "庐江（皖）",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "jin"
      ],
      "note": "吴领庐江郡江南、皖城一带，治皖。与魏“庐江（皖北）”是一郡分涂。"
    },
    {
      "name": "蕲春",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "jin"
      ],
      "note": "223年自魏收回，治蕲春。江北小郡，夹在两军之间。"
    },
    {
      "name": "毗陵典农",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "嘉禾三年（234）置，治毗陵，地位相当于郡，管屯田。平吴后不久改为毗陵郡。"
    },
    {
      "name": "庐陵南部都尉",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "嘉禾五年（236）分庐陵置，治雩都，地位相当于郡。入晋后改为南康郡。"
    },
    {
      "name": "临海",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "太平二年（257）分会稽东部置，治章安。滨海，山越、水民多，标弱。"
    },
    {
      "name": "临川",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "太平二年（257）分豫章置，治南城。建安末另有短命的丹阳临川郡，与此不是一地，不列入。"
    },
    {
      "name": "建安",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "永安三年（260）分会稽南部置，治建安。今福建一带，开发有限，标弱。"
    },
    {
      "name": "南郡",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治江陵。219年吕蒙袭取。江陵是吴西边军镇，北与魏襄阳对峙，城本身长期在吴手中。"
    },
    {
      "name": "宜都",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "222年夷陵战败蜀后，夷陵改名西陵，郡境稳定属吴。260年分出建平。272年步阐据西陵降晋，数月后被陆抗夺回，不单独成帧。"
    },
    {
      "name": "江夏（江南）",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "jin"
      ],
      "note": "吴领鄂、夏口、武昌（今鄂州）及江南诸县。221–229年、265–266年吴都在武昌，即本郡境。与魏“江夏（沔北）”须沿汉水切开。"
    },
    {
      "name": "长沙",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治临湘。257年分出衡阳、湘东，辖境缩小。"
    },
    {
      "name": "零陵",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治泉陵。265年分始安，266年分昭陵。"
    },
    {
      "name": "桂阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治郴。265年分始兴。"
    },
    {
      "name": "武陵",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "治临沅。沅水上游蛮族聚居，郡治在、溪峒弱。263年分天门。"
    },
    {
      "name": "临贺",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "黄武五年（226）分苍梧置，改属荆州，治临贺。"
    },
    {
      "name": "衡阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "太平二年（257）分长沙、零陵置，治湘南。"
    },
    {
      "name": "湘东",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "太平二年（257）分长沙、桂阳置，治酃。"
    },
    {
      "name": "建平",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "jin"
      ],
      "note": "永安三年（260）分宜都西部置，初治巫。与蜀巴东隔三峡对峙。"
    },
    {
      "name": "天门",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "永安六年（263）分武陵置，治零阳。溪峒地区，标弱。"
    },
    {
      "name": "始安",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "甘露元年（265）分零陵、苍梧置，治始安。属荆州，不属广州。"
    },
    {
      "name": "始兴",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "甘露元年（265）分桂阳、南海置，治曲江。属荆州。"
    },
    {
      "name": "交趾",
      "controller": "jin",
      "strength": "contested",
      "contenders": [
        "jin",
        "wu"
      ],
      "note": "226年吕岱杀士徽后由吴直接设太守，治龙编。263年郡吏吕兴杀吴太守，向魏求援。魏、晋派过守将，但海路难通，吴军265年后持续反攻。271年七月陶璜收复。"
    },
    {
      "name": "九真",
      "controller": "jin",
      "strength": "contested",
      "contenders": [
        "jin",
        "wu"
      ],
      "note": "226年后吴直辖。当地渠帅势力大。263年郡吏吕兴杀吴太守，向魏求援。魏、晋派过守将，但海路难通，吴军265年后持续反攻。271年七月陶璜收复。"
    },
    {
      "name": "日南",
      "controller": "jin",
      "strength": "contested",
      "contenders": [
        "jin",
        "wu"
      ],
      "note": "吴直辖后仍是最弱的一郡。263年郡吏吕兴杀吴太守，向魏求援。魏、晋派过守将，但海路难通，吴军265年后持续反攻。271年七月陶璜收复。"
    },
    {
      "name": "合浦",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "226年后吴直接治理。交趾三郡脱离期间，吴的交州办事机构常退到合浦一带。"
    },
    {
      "name": "合浦北部都尉",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "永安三年（260）分合浦置，治平山，地位相当于郡。入晋后为宁浦郡。"
    },
    {
      "name": "南海",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治番禺。264年复置广州后为广州治所。279年郭马据南海，晋军北上时尚未完全平定，280帧标弱。"
    },
    {
      "name": "苍梧",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治广信。226年分出临贺（改属荆州）。265年起属广州。"
    },
    {
      "name": "郁林",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "治布山。控制松。274年分桂林。265年起属广州。"
    },
    {
      "name": "高凉",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "220年分合浦置。226年后明确属吴。265年起属广州。"
    },
    {
      "name": "珠崖",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "赤乌五年（242）复置，在今海南。海上郡，控制弱，是否长期有官驻守，记载很稀。"
    }
  ],
  "capitals": [
    {
      "faction": "jin",
      "city": "洛阳",
      "lng": 112.62,
      "lat": 34.72,
      "role": "都城"
    },
    {
      "faction": "wu",
      "city": "武昌",
      "lng": 114.89,
      "lat": 30.4,
      "role": "都城"
    },
    {
      "faction": "wu",
      "city": "建业",
      "lng": 118.78,
      "lat": 31.95,
      "role": "陪都"
    }
  ],
  "sources": [
    "《三国志》魏书文帝纪、明帝纪、三少帝纪、明悼毛后无关；蜀书先主传、后主传；吴书吴主传、三嗣主传。交趾、辽东、南中细节见吕岱、士燮、公孙度、诸葛亮、霍弋等传。",
    "《晋书》卷三武帝纪（泰始五年置秦州、泰始七年七月交趾三郡降吴、八月置宁州、咸宁二年置平州、咸宁五年十二月凉州平、太康元年平吴）；卷十四至十五地理志。",
    "《资治通鉴》卷六十九至八十一。灭蜀月份从《三国志·三少帝纪》景元四年十一月，通鉴或系于十月。",
    "郡的置废主要对照《晋书·地理志》《华阳国志》巴志、蜀志、南中志，以及清人洪亮吉《补三国疆域志》、吴增仅《三国郡县表》、近人陈健梅《孙吴政区地理研究》的结论；与谭其骧《中国历史地图集》第三册“三国时期”标准年代（魏景元三年，262年）对读。维基百科条目只用来查找上述书的线索，有出入时以史志为准。"
  ]
}
```

## 271 年 吴复交趾、晋置宁州

公元271年七月，吴将陶璜收复交趾、九真、日南，并新设新昌、武平等郡。八月，晋把建宁、云南、兴古、永昌四郡划为宁州，说明南中既大又不好管。陇右已在269年设秦州，金城也划了进去；凉州正遭秃发鲜卑树机能冲击，武威、金城一带不稳。孙皓的都城已经迁回建业。

```json
{
  "year": 271,
  "month": 8,
  "label": "吴复交趾、晋置宁州",
  "provinces": [
    {
      "province": "司州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "豫州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "兖州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "青州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "徐州",
      "controller": "jin",
      "strength": "contested"
    },
    {
      "province": "冀州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "幽州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "并州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "雍州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "秦州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "凉州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "荆州（魏）",
      "controller": "jin",
      "strength": "contested"
    },
    {
      "province": "扬州（魏）",
      "controller": "jin",
      "strength": "contested"
    },
    {
      "province": "益州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "梁州",
      "controller": "jin",
      "strength": "contested"
    },
    {
      "province": "宁州",
      "controller": "jin",
      "strength": "weak"
    },
    {
      "province": "扬州（吴）",
      "controller": "wu",
      "strength": "contested"
    },
    {
      "province": "荆州（吴）",
      "controller": "wu",
      "strength": "contested"
    },
    {
      "province": "交州",
      "controller": "wu",
      "strength": "core"
    },
    {
      "province": "广州",
      "controller": "wu",
      "strength": "core"
    }
  ],
  "overrides": [
    {
      "name": "河南尹",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治洛阳，东汉旧名。魏、晋都城所在。"
    },
    {
      "name": "河内",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治怀县。"
    },
    {
      "name": "河东",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治安邑。247年分出平阳前，平阳一带仍属本郡。"
    },
    {
      "name": "弘农",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治弘农。函谷道所经。"
    },
    {
      "name": "平阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "正始八年（247）分河东置。220–244各帧不单列。"
    },
    {
      "name": "颍川",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治阳翟。"
    },
    {
      "name": "襄城",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "汉末曹操分颍川置，治襄城。"
    },
    {
      "name": "汝南",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治新息，后常治平舆一带。"
    },
    {
      "name": "汝阴",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "汉末分汝南置，治汝阴。"
    },
    {
      "name": "梁国",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治睢阳。"
    },
    {
      "name": "沛国",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治沛。"
    },
    {
      "name": "谯郡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安末分沛国置，治谯，曹氏乡里。"
    },
    {
      "name": "鲁郡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治鲁。"
    },
    {
      "name": "陈郡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治陈。"
    },
    {
      "name": "弋阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安二十三年（218）分汝南、江夏置，治弋阳，滨江夏北缘。"
    },
    {
      "name": "安丰",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "黄初初分庐江置，属豫州，治安风。设立或在220–222之间，各帧从220列入。"
    },
    {
      "name": "陈留",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治陈留。"
    },
    {
      "name": "东郡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治濮阳。"
    },
    {
      "name": "济阴",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治定陶。"
    },
    {
      "name": "山阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治昌邑。"
    },
    {
      "name": "任城",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治任城。"
    },
    {
      "name": "东平",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治无盐。"
    },
    {
      "name": "济北",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治卢。"
    },
    {
      "name": "泰山",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治奉高。"
    },
    {
      "name": "齐国",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治临淄。"
    },
    {
      "name": "济南",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治东平陵。"
    },
    {
      "name": "乐安",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治临济。"
    },
    {
      "name": "北海",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治平寿。"
    },
    {
      "name": "东莱",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治黄。"
    },
    {
      "name": "城阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安三年（198）分琅邪、北海置，治东武。"
    },
    {
      "name": "彭城",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治彭城。魏徐州常治此。"
    },
    {
      "name": "下邳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治下邳。"
    },
    {
      "name": "东海",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治郯。"
    },
    {
      "name": "琅邪",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治开阳。"
    },
    {
      "name": "东莞",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安三年（198）分琅邪置，治东莞。"
    },
    {
      "name": "广陵",
      "controller": "jin",
      "strength": "contested",
      "contenders": [
        "jin",
        "wu"
      ],
      "note": "治淮阴一带。江北属魏（晋），江南江都等县时被吴占据，沿江是拉锯带。"
    },
    {
      "name": "魏郡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治邺。221年分出广平、阳平后辖境缩小。邺是曹操旧都，此后仍是河北重镇。"
    },
    {
      "name": "广平",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "黄初二年（221）分魏郡置，治曲梁。"
    },
    {
      "name": "阳平",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "黄初二年（221）分魏郡置，治馆陶。"
    },
    {
      "name": "巨鹿",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治瘿陶。"
    },
    {
      "name": "赵国",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治邯郸。"
    },
    {
      "name": "常山",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治元氏。"
    },
    {
      "name": "中山",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治卢奴。"
    },
    {
      "name": "安平",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治信都。冀州治所黄初后常在此。"
    },
    {
      "name": "河间",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治乐成。"
    },
    {
      "name": "勃海",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治南皮。"
    },
    {
      "name": "清河",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉曾名甘陵，魏复称清河，治清河。"
    },
    {
      "name": "平原",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡。建安十八年（213）自青州改属冀州，治平原。"
    },
    {
      "name": "乐陵",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安十八年（213）分平原、勃海置，治厌次。"
    },
    {
      "name": "范阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "226年由涿郡改名，治涿。"
    },
    {
      "name": "燕国",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "232年由广阳郡改燕国，治蓟。"
    },
    {
      "name": "代郡",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治高柳。鲜卑压力大，郡境控制不稳定。"
    },
    {
      "name": "上谷",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治沮阳。北缘与鲜卑相邻。"
    },
    {
      "name": "渔阳",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治渔阳。边郡，乌桓旧地，控制比内地弱。"
    },
    {
      "name": "右北平",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治土垠。东与鲜卑、辽西相连。"
    },
    {
      "name": "辽西",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治阳乐。鲜卑经常进出，城池在、乡野不稳。"
    },
    {
      "name": "昌黎",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "正始五年（244）由辽东属国改置。280年属平州。鲜卑活动频繁。"
    },
    {
      "name": "辽东",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "景初二年（238）司马懿破襄平后归魏，晋沿置。280年属平州。"
    },
    {
      "name": "玄菟",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治高句骊县旧地，郡境受高句丽挤压。238年前随公孙氏，其后归魏、晋。244年毌丘俭出击高句丽，并未把其地改为魏郡。"
    },
    {
      "name": "乐浪",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "朝鲜半岛北部旧郡，治朝鲜县。238年前由公孙氏管，其后归魏、晋。"
    },
    {
      "name": "带方",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安末公孙康分乐浪南部置。238年后归魏、晋。倭使接触曹魏，多经此郡。"
    },
    {
      "name": "太原",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治晋阳。并州治所。"
    },
    {
      "name": "上党",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治壶关，后常治潞。"
    },
    {
      "name": "西河",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治离石。南匈奴五部所在，行政在，部落势力大。"
    },
    {
      "name": "雁门",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治广武。鲜卑、匈奴交会，边郡。"
    },
    {
      "name": "新兴",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十年（215）废云中、定襄、五原、朔方，分太原置新兴以处其民，治九原。四郡故地不再设郡。"
    },
    {
      "name": "乐平",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安二十一年（216）分上党、太原置，治沾。"
    },
    {
      "name": "京兆",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治长安。魏改左冯翊为冯翊、右扶风为扶风，三辅仍是关中核心。"
    },
    {
      "name": "冯翊",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "魏改左冯翊为冯翊郡，治临晋。"
    },
    {
      "name": "扶风",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "魏改右扶风为扶风郡，治槐里。"
    },
    {
      "name": "北地",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治泥阳。羌乱反复，乡野控制弱。"
    },
    {
      "name": "新平",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "兴平元年（194）分安定、扶风置，治漆。"
    },
    {
      "name": "安定",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治临泾。陇东军事重镇，羌人时叛，郡治仍在魏、晋手中。"
    },
    {
      "name": "陇西",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治襄武。269年划入秦州。271年前后秃发鲜卑扰动陇右，本帧标弱；280年凉州已平，郡治仍在。"
    },
    {
      "name": "南安",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "中平五年（188）分汉阳置，治獂道。228年曾短暂降蜀，街亭后复归魏。269年起属秦州。"
    },
    {
      "name": "天水",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治冀县。秦州治所即在冀。228年郡人多应蜀，街亭后复归魏。"
    },
    {
      "name": "略阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "由广魏改名，约在泰始年间。269年秦州成立后属秦州，治临渭。"
    },
    {
      "name": "武都",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "263年随蜀入魏。265–269年间属梁州，269年秦州成立后属秦州。氐人地区，控制弱。"
    },
    {
      "name": "阴平",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "263年后归魏、晋。地理志以阴平属秦州；武帝纪写作“阳平”，应从地理志。"
    },
    {
      "name": "金城",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治榆中，后常治金城。269年自凉州划入秦州。270年树机能杀秦州刺史胡烈，271年本郡受冲击，标弱。279年马隆平凉州，280年恢复。"
    },
    {
      "name": "武威",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "凉州治所，姑臧。271年鲜卑树机能已杀两任刺史，河西震动，本帧标弱。279年十二月马隆斩树机能，280年凉州平。"
    },
    {
      "name": "张掖",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治张掖。"
    },
    {
      "name": "酒泉",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治福禄。"
    },
    {
      "name": "敦煌",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治敦煌。走廊西端，行政在，离中原极远。"
    },
    {
      "name": "西郡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "兴平二年（195）分张掖置，治日勒。"
    },
    {
      "name": "西平",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "建安末分金城置，治西都。羌人势力大。"
    },
    {
      "name": "西海",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，居延一带。户籍与驻军都少，近于边地哨所。"
    },
    {
      "name": "南阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治宛。魏荆州初治宛。"
    },
    {
      "name": "南乡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安十三年（208）分南阳置，治南乡。"
    },
    {
      "name": "襄阳",
      "controller": "jin",
      "strength": "contested",
      "contenders": [
        "jin",
        "wu"
      ],
      "note": "建安十三年（208）分南郡置，治襄阳。城为魏有，汉水一线与吴对峙。"
    },
    {
      "name": "江夏（沔北）",
      "controller": "jin",
      "strength": "contested",
      "contenders": [
        "jin",
        "wu"
      ],
      "note": "东汉江夏郡跨汉水。魏领安陆、石阳等沔北诸县。236年吴曾短暂占新市、安陆，随即失去。与吴境“江夏（江南）”是一郡分涂，地图需沿汉水切开。"
    },
    {
      "name": "新城",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "黄初元年（220）七月合房陵、上庸、西城为新城，治房陵。227年孟达叛，司马懿迅即平定。263年蜀灭前与蜀隔山对峙，其后不再是国境。"
    },
    {
      "name": "魏兴",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "215年曹操分汉中东部置西城郡，221年改名魏兴，治西城。220帧尚并在新城中。263年前与蜀对峙。"
    },
    {
      "name": "上庸",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "215年分汉中置，220年并入新城；228年复置，约230年废；237年再置，嘉平中又废；259年再置。本帧按此置废列入。234年不列。"
    },
    {
      "name": "淮南",
      "controller": "jin",
      "strength": "contested",
      "contenders": [
        "jin",
        "wu"
      ],
      "note": "东汉九江郡，魏改称淮南，治寿春。合肥、寿春是对吴主战场。249年后诸葛诞等淮南三叛都发生在此，叛平后仍属魏，不是吴土。"
    },
    {
      "name": "庐江（皖北）",
      "controller": "jin",
      "strength": "contested",
      "contenders": [
        "jin",
        "wu"
      ],
      "note": "东汉庐江郡被魏、吴分成两块。魏领皖北，合肥为其军镇。与吴境“庐江（皖）”须沿江切开。"
    },
    {
      "name": "蜀郡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治成都。蜀汉都城，263年后为晋益州核心。"
    },
    {
      "name": "广汉",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治雒。265年梁州析出后改属梁州。"
    },
    {
      "name": "梓潼",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安二十二年（217）分广汉置，治梓潼。刘备入蜀时已有。"
    },
    {
      "name": "犍为",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治武阳。"
    },
    {
      "name": "江阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安十八年（213）分犍为置，治江阳。"
    },
    {
      "name": "汶山",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "建安末分蜀郡置，治绵虒。羌人地区，控制弱。"
    },
    {
      "name": "汉嘉",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "章武元年（221）由蜀郡属国改名，治汉嘉。240年张嶷曾平郡乱，乡野仍弱。"
    },
    {
      "name": "新都（梁）",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "咸熙、泰始间由蜀东广汉改名，治郪。与扬州的新都（今浙江、安徽一带）不是一地。"
    },
    {
      "name": "巴郡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治江州（今重庆）。刘璋时已与巴西、巴东分治。"
    },
    {
      "name": "巴西",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治阆中。"
    },
    {
      "name": "巴东",
      "controller": "jin",
      "strength": "contested",
      "contenders": [
        "jin",
        "wu"
      ],
      "note": "263年随蜀入魏。西陵以东仍是吴土，巴东仍是江防前哨，至280年。"
    },
    {
      "name": "涪陵",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "建安末改巴东属国为涪陵，治涪陵。滨五溪，248年邓芝曾讨郡夷，控制弱于成都平原。"
    },
    {
      "name": "汉中",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "263年钟会大军入境，此后属魏、晋梁州。国境北移，不再与蜀对峙。"
    },
    {
      "name": "建宁",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "225年由益州郡改名。233年庲降都督才把治所稳定到味县。271年划入宁州。大姓势力大。"
    },
    {
      "name": "云南",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "225年分建宁、永昌置，治梇栋。271年属宁州。"
    },
    {
      "name": "兴古",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "225年分建宁、牂柯置，治宛温。271年属宁州。"
    },
    {
      "name": "牂柯",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治故且兰。223–225年曾叛，平后仍弱。271年宁州初置时尚未划入，仍属益州。"
    },
    {
      "name": "越巂",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治邛都。223年叛，240年张嶷重新打通郡道，其后仍弱。271年仍属益州。"
    },
    {
      "name": "永昌",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治不韦，远至今云南西部。南中叛乱时吕凯为蜀守住郡境。271年《晋书》把它算入宁州（或写作交州之永昌）。"
    },
    {
      "name": "朱提",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十年（215）刘备改犍为属国为朱提，治朱提。《晋书》或系于221年。接近南中，控制弱。延熙中曾分南广，约九年即废，各帧不单列。"
    },
    {
      "name": "丹阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治建业。郡治一带是吴的政治核心；郡南山区山越反复，没有单列到县。"
    },
    {
      "name": "吴郡",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治吴县。"
    },
    {
      "name": "会稽",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治山阴。257年分临海，260年分建安，266年分东阳，故后期辖境缩小。"
    },
    {
      "name": "豫章",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治南昌。"
    },
    {
      "name": "庐陵",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "建安初分豫章置，治西昌。236年又分南部都尉。"
    },
    {
      "name": "鄱阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "210年分豫章置，治鄱阳。225年以后郡治稳定，山区仍有零星山越。"
    },
    {
      "name": "新都（扬）",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "建安十三年（208）分丹阳置，治始新。为控制山越而设，全境标弱。"
    },
    {
      "name": "庐江（皖）",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "jin"
      ],
      "note": "吴领庐江郡江南、皖城一带，治皖。与魏“庐江（皖北）”是一郡分涂。"
    },
    {
      "name": "蕲春",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "jin"
      ],
      "note": "223年自魏收回，治蕲春。江北小郡，夹在两军之间。"
    },
    {
      "name": "毗陵典农",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "嘉禾三年（234）置，治毗陵，地位相当于郡，管屯田。平吴后不久改为毗陵郡。"
    },
    {
      "name": "庐陵南部都尉",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "嘉禾五年（236）分庐陵置，治雩都，地位相当于郡。入晋后改为南康郡。"
    },
    {
      "name": "临海",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "太平二年（257）分会稽东部置，治章安。滨海，山越、水民多，标弱。"
    },
    {
      "name": "临川",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "太平二年（257）分豫章置，治南城。建安末另有短命的丹阳临川郡，与此不是一地，不列入。"
    },
    {
      "name": "建安",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "永安三年（260）分会稽南部置，治建安。今福建一带，开发有限，标弱。"
    },
    {
      "name": "东阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "宝鼎元年（266）分会稽置，治长山。"
    },
    {
      "name": "吴兴",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "宝鼎元年（266）分丹阳、吴郡置，治乌程。"
    },
    {
      "name": "安成",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "宝鼎二年（267）分长沙、豫章、庐陵置，治平都。"
    },
    {
      "name": "南郡",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治江陵。219年吕蒙袭取。江陵是吴西边军镇，北与魏襄阳对峙，城本身长期在吴手中。"
    },
    {
      "name": "宜都",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "222年夷陵战败蜀后，夷陵改名西陵，郡境稳定属吴。260年分出建平。272年步阐据西陵降晋，数月后被陆抗夺回，不单独成帧。"
    },
    {
      "name": "江夏（江南）",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "jin"
      ],
      "note": "吴领鄂、夏口、武昌（今鄂州）及江南诸县。221–229年、265–266年吴都在武昌，即本郡境。与魏“江夏（沔北）”须沿汉水切开。"
    },
    {
      "name": "长沙",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治临湘。257年分出衡阳、湘东，辖境缩小。"
    },
    {
      "name": "零陵",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治泉陵。265年分始安，266年分昭陵。"
    },
    {
      "name": "桂阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治郴。265年分始兴。"
    },
    {
      "name": "武陵",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "治临沅。沅水上游蛮族聚居，郡治在、溪峒弱。263年分天门。"
    },
    {
      "name": "临贺",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "黄武五年（226）分苍梧置，改属荆州，治临贺。"
    },
    {
      "name": "衡阳",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "太平二年（257）分长沙、零陵置，治湘南。"
    },
    {
      "name": "湘东",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "太平二年（257）分长沙、桂阳置，治酃。"
    },
    {
      "name": "建平",
      "controller": "wu",
      "strength": "contested",
      "contenders": [
        "wu",
        "jin"
      ],
      "note": "永安三年（260）分宜都西部置，初治巫。与蜀巴东隔三峡对峙。"
    },
    {
      "name": "天门",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "永安六年（263）分武陵置，治零阳。溪峒地区，标弱。"
    },
    {
      "name": "始安",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "甘露元年（265）分零陵、苍梧置，治始安。属荆州，不属广州。"
    },
    {
      "name": "始兴",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "甘露元年（265）分桂阳、南海置，治曲江。属荆州。"
    },
    {
      "name": "昭陵",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "宝鼎元年（266）分零陵置，治昭陵。入晋后改名邵陵，本时段仍用吴名。"
    },
    {
      "name": "交趾",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "226年吕岱杀士徽后由吴直接设太守，治龙编。271年七月回到吴。陶璜增置新昌、武平。280年三月建业降晋，交州陶璜稍晚才降。"
    },
    {
      "name": "九真",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "226年后吴直辖。当地渠帅势力大。"
    },
    {
      "name": "日南",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "吴直辖后仍是最弱的一郡。"
    },
    {
      "name": "新昌",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "建衡三年（271）陶璜分交趾置。"
    },
    {
      "name": "武平",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "271年陶璜平当地势力后置。"
    },
    {
      "name": "九真属国",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "271年分交趾置。278年改为九德郡，故280帧改书九德。"
    },
    {
      "name": "合浦",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "226年后吴直接治理。交趾三郡脱离期间，吴的交州办事机构常退到合浦一带。"
    },
    {
      "name": "合浦北部都尉",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "永安三年（260）分合浦置，治平山，地位相当于郡。入晋后为宁浦郡。"
    },
    {
      "name": "南海",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治番禺。264年复置广州后为广州治所。279年郭马据南海，晋军北上时尚未完全平定，280帧标弱。"
    },
    {
      "name": "苍梧",
      "controller": "wu",
      "strength": "core",
      "contenders": [],
      "note": "治广信。226年分出临贺（改属荆州）。265年起属广州。"
    },
    {
      "name": "郁林",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "治布山。控制松。274年分桂林。265年起属广州。"
    },
    {
      "name": "高凉",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "220年分合浦置。226年后明确属吴。265年起属广州。"
    },
    {
      "name": "珠崖",
      "controller": "wu",
      "strength": "weak",
      "contenders": [],
      "note": "赤乌五年（242）复置，在今海南。海上郡，控制弱，是否长期有官驻守，记载很稀。"
    }
  ],
  "capitals": [
    {
      "faction": "jin",
      "city": "洛阳",
      "lng": 112.62,
      "lat": 34.72,
      "role": "都城"
    },
    {
      "faction": "wu",
      "city": "建业",
      "lng": 118.78,
      "lat": 31.95,
      "role": "都城"
    },
    {
      "faction": "wu",
      "city": "武昌",
      "lng": 114.89,
      "lat": 30.4,
      "role": "陪都"
    }
  ],
  "sources": [
    "《三国志》魏书文帝纪、明帝纪、三少帝纪、明悼毛后无关；蜀书先主传、后主传；吴书吴主传、三嗣主传。交趾、辽东、南中细节见吕岱、士燮、公孙度、诸葛亮、霍弋等传。",
    "《晋书》卷三武帝纪（泰始五年置秦州、泰始七年七月交趾三郡降吴、八月置宁州、咸宁二年置平州、咸宁五年十二月凉州平、太康元年平吴）；卷十四至十五地理志。",
    "《资治通鉴》卷六十九至八十一。灭蜀月份从《三国志·三少帝纪》景元四年十一月，通鉴或系于十月。",
    "郡的置废主要对照《晋书·地理志》《华阳国志》巴志、蜀志、南中志，以及清人洪亮吉《补三国疆域志》、吴增仅《三国郡县表》、近人陈健梅《孙吴政区地理研究》的结论；与谭其骧《中国历史地图集》第三册“三国时期”标准年代（魏景元三年，262年）对读。维基百科条目只用来查找上述书的线索，有出入时以史志为准。"
  ]
}
```

## 280 年 晋灭吴

公元280年三月，晋军进入建业，孙皓投降，吴的州郡改为晋。交州的陶璜要等孙皓来信才降，时间可能略晚于三月。凉州在上一年十二月已被马隆平定。秦州、宁州、平州都还在（秦州到282年才一度裁掉）。从东汉末年开始的分裂，到这一帧在地图上重新变成一个晋。

```json
{
  "year": 280,
  "month": 3,
  "label": "晋灭吴",
  "provinces": [
    {
      "province": "司州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "豫州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "兖州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "青州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "徐州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "冀州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "幽州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "平州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "并州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "雍州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "秦州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "凉州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "荆州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "扬州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "益州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "梁州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "宁州",
      "controller": "jin",
      "strength": "weak"
    },
    {
      "province": "交州",
      "controller": "jin",
      "strength": "core"
    },
    {
      "province": "广州",
      "controller": "jin",
      "strength": "core"
    }
  ],
  "overrides": [
    {
      "name": "河南尹",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治洛阳，东汉旧名。魏、晋都城所在。"
    },
    {
      "name": "河内",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治怀县。"
    },
    {
      "name": "河东",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治安邑。247年分出平阳前，平阳一带仍属本郡。"
    },
    {
      "name": "弘农",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治弘农。函谷道所经。"
    },
    {
      "name": "平阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "正始八年（247）分河东置。220–244各帧不单列。"
    },
    {
      "name": "颍川",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治阳翟。"
    },
    {
      "name": "襄城",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "汉末曹操分颍川置，治襄城。"
    },
    {
      "name": "汝南",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治新息，后常治平舆一带。"
    },
    {
      "name": "汝阴",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "汉末分汝南置，治汝阴。"
    },
    {
      "name": "梁国",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治睢阳。"
    },
    {
      "name": "沛国",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治沛。"
    },
    {
      "name": "谯郡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安末分沛国置，治谯，曹氏乡里。"
    },
    {
      "name": "鲁郡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治鲁。"
    },
    {
      "name": "陈郡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治陈。"
    },
    {
      "name": "弋阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安二十三年（218）分汝南、江夏置，治弋阳，滨江夏北缘。"
    },
    {
      "name": "安丰",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "黄初初分庐江置，属豫州，治安风。设立或在220–222之间，各帧从220列入。"
    },
    {
      "name": "陈留",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治陈留。"
    },
    {
      "name": "东郡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治濮阳。"
    },
    {
      "name": "济阴",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治定陶。"
    },
    {
      "name": "山阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治昌邑。"
    },
    {
      "name": "任城",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治任城。"
    },
    {
      "name": "东平",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治无盐。"
    },
    {
      "name": "济北",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治卢。"
    },
    {
      "name": "泰山",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治奉高。"
    },
    {
      "name": "齐国",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治临淄。"
    },
    {
      "name": "济南",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治东平陵。"
    },
    {
      "name": "乐安",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治临济。"
    },
    {
      "name": "北海",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治平寿。"
    },
    {
      "name": "东莱",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治黄。"
    },
    {
      "name": "城阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安三年（198）分琅邪、北海置，治东武。"
    },
    {
      "name": "彭城",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治彭城。魏徐州常治此。"
    },
    {
      "name": "下邳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治下邳。"
    },
    {
      "name": "东海",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治郯。"
    },
    {
      "name": "琅邪",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治开阳。"
    },
    {
      "name": "东莞",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安三年（198）分琅邪置，治东莞。"
    },
    {
      "name": "广陵",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "平吴后江南北皆归晋。"
    },
    {
      "name": "魏郡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治邺。221年分出广平、阳平后辖境缩小。邺是曹操旧都，此后仍是河北重镇。"
    },
    {
      "name": "广平",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "黄初二年（221）分魏郡置，治曲梁。"
    },
    {
      "name": "阳平",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "黄初二年（221）分魏郡置，治馆陶。"
    },
    {
      "name": "巨鹿",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治瘿陶。"
    },
    {
      "name": "赵国",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治邯郸。"
    },
    {
      "name": "常山",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治元氏。"
    },
    {
      "name": "中山",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治卢奴。"
    },
    {
      "name": "安平",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治信都。冀州治所黄初后常在此。"
    },
    {
      "name": "河间",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧国，治乐成。"
    },
    {
      "name": "勃海",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡，治南皮。"
    },
    {
      "name": "清河",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉曾名甘陵，魏复称清河，治清河。"
    },
    {
      "name": "平原",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉旧郡。建安十八年（213）自青州改属冀州，治平原。"
    },
    {
      "name": "乐陵",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安十八年（213）分平原、勃海置，治厌次。"
    },
    {
      "name": "范阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "226年由涿郡改名，治涿。"
    },
    {
      "name": "燕国",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "232年由广阳郡改燕国，治蓟。"
    },
    {
      "name": "代郡",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治高柳。鲜卑压力大，郡境控制不稳定。"
    },
    {
      "name": "上谷",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治沮阳。北缘与鲜卑相邻。"
    },
    {
      "name": "渔阳",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治渔阳。边郡，乌桓旧地，控制比内地弱。"
    },
    {
      "name": "右北平",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治土垠。东与鲜卑、辽西相连。"
    },
    {
      "name": "辽西",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治阳乐。鲜卑经常进出，城池在、乡野不稳。"
    },
    {
      "name": "昌黎",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "正始五年（244）由辽东属国改置。280年属平州。鲜卑活动频繁。"
    },
    {
      "name": "辽东",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "景初二年（238）司马懿破襄平后归魏，晋沿置。280年属平州。"
    },
    {
      "name": "玄菟",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治高句骊县旧地，郡境受高句丽挤压。238年前随公孙氏，其后归魏、晋。244年毌丘俭出击高句丽，并未把其地改为魏郡。"
    },
    {
      "name": "乐浪",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "朝鲜半岛北部旧郡，治朝鲜县。238年前由公孙氏管，其后归魏、晋。"
    },
    {
      "name": "带方",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安末公孙康分乐浪南部置。238年后归魏、晋。倭使接触曹魏，多经此郡。"
    },
    {
      "name": "太原",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治晋阳。并州治所。"
    },
    {
      "name": "上党",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治壶关，后常治潞。"
    },
    {
      "name": "西河",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治离石。南匈奴五部所在，行政在，部落势力大。"
    },
    {
      "name": "雁门",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治广武。鲜卑、匈奴交会，边郡。"
    },
    {
      "name": "新兴",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十年（215）废云中、定襄、五原、朔方，分太原置新兴以处其民，治九原。四郡故地不再设郡。"
    },
    {
      "name": "乐平",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安二十一年（216）分上党、太原置，治沾。"
    },
    {
      "name": "京兆",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治长安。魏改左冯翊为冯翊、右扶风为扶风，三辅仍是关中核心。"
    },
    {
      "name": "冯翊",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "魏改左冯翊为冯翊郡，治临晋。"
    },
    {
      "name": "扶风",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "魏改右扶风为扶风郡，治槐里。"
    },
    {
      "name": "北地",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治泥阳。羌乱反复，乡野控制弱。"
    },
    {
      "name": "新平",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "兴平元年（194）分安定、扶风置，治漆。"
    },
    {
      "name": "安定",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治临泾。陇东军事重镇，羌人时叛，郡治仍在魏、晋手中。"
    },
    {
      "name": "陇西",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治襄武。269年划入秦州。271年前后秃发鲜卑扰动陇右，本帧标弱；280年凉州已平，郡治仍在。"
    },
    {
      "name": "南安",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "中平五年（188）分汉阳置，治獂道。228年曾短暂降蜀，街亭后复归魏。269年起属秦州。"
    },
    {
      "name": "天水",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治冀县。秦州治所即在冀。228年郡人多应蜀，街亭后复归魏。"
    },
    {
      "name": "略阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "由广魏改名，约在泰始年间。269年秦州成立后属秦州，治临渭。"
    },
    {
      "name": "武都",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "263年随蜀入魏。265–269年间属梁州，269年秦州成立后属秦州。氐人地区，控制弱。"
    },
    {
      "name": "阴平",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "263年后归魏、晋。地理志以阴平属秦州；武帝纪写作“阳平”，应从地理志。"
    },
    {
      "name": "金城",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治榆中，后常治金城。269年自凉州划入秦州。270年树机能杀秦州刺史胡烈，271年本郡受冲击，标弱。279年马隆平凉州，280年恢复。"
    },
    {
      "name": "武威",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "凉州治所，姑臧。271年鲜卑树机能已杀两任刺史，河西震动，本帧标弱。279年十二月马隆斩树机能，280年凉州平。"
    },
    {
      "name": "张掖",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治张掖。"
    },
    {
      "name": "酒泉",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治福禄。"
    },
    {
      "name": "敦煌",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治敦煌。走廊西端，行政在，离中原极远。"
    },
    {
      "name": "西郡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "兴平二年（195）分张掖置，治日勒。"
    },
    {
      "name": "西平",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "建安末分金城置，治西都。羌人势力大。"
    },
    {
      "name": "西海",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，居延一带。户籍与驻军都少，近于边地哨所。"
    },
    {
      "name": "南阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治宛。魏荆州初治宛。"
    },
    {
      "name": "南乡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安十三年（208）分南阳置，治南乡。"
    },
    {
      "name": "襄阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "平吴后不再是国境。"
    },
    {
      "name": "江夏（沔北）",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "平吴后可与江南部分合观，行政上渐复为一郡江夏。"
    },
    {
      "name": "新城",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "黄初元年（220）七月合房陵、上庸、西城为新城，治房陵。227年孟达叛，司马懿迅即平定。263年蜀灭前与蜀隔山对峙，其后不再是国境。"
    },
    {
      "name": "魏兴",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "215年曹操分汉中东部置西城郡，221年改名魏兴，治西城。220帧尚并在新城中。263年前与蜀对峙。"
    },
    {
      "name": "上庸",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "215年分汉中置，220年并入新城；228年复置，约230年废；237年再置，嘉平中又废；259年再置。本帧按此置废列入。234年不列。"
    },
    {
      "name": "淮南",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉九江郡，魏改称淮南，治寿春。合肥、寿春是对吴主战场。249年后诸葛诞等淮南三叛都发生在此，叛平后仍属魏，不是吴土。"
    },
    {
      "name": "庐江（皖北）",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "东汉庐江郡被魏、吴分成两块。魏领皖北，合肥为其军镇。与吴境“庐江（皖）”须沿江切开。"
    },
    {
      "name": "蜀郡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治成都。蜀汉都城，263年后为晋益州核心。"
    },
    {
      "name": "广汉",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治雒。265年梁州析出后改属梁州。"
    },
    {
      "name": "梓潼",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安二十二年（217）分广汉置，治梓潼。刘备入蜀时已有。"
    },
    {
      "name": "犍为",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治武阳。"
    },
    {
      "name": "江阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安十八年（213）分犍为置，治江阳。"
    },
    {
      "name": "汶山",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "建安末分蜀郡置，治绵虒。羌人地区，控制弱。"
    },
    {
      "name": "汉嘉",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "章武元年（221）由蜀郡属国改名，治汉嘉。240年张嶷曾平郡乱，乡野仍弱。"
    },
    {
      "name": "新都（梁）",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "咸熙、泰始间由蜀东广汉改名，治郪。与扬州的新都（今浙江、安徽一带）不是一地。"
    },
    {
      "name": "巴郡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治江州（今重庆）。刘璋时已与巴西、巴东分治。"
    },
    {
      "name": "巴西",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治阆中。"
    },
    {
      "name": "巴东",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "平吴后三峡不再是国境。"
    },
    {
      "name": "涪陵",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "建安末改巴东属国为涪陵，治涪陵。滨五溪，248年邓芝曾讨郡夷，控制弱于成都平原。"
    },
    {
      "name": "汉中",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "263年钟会大军入境，此后属魏、晋梁州。国境北移，不再与蜀对峙。"
    },
    {
      "name": "建宁",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "225年由益州郡改名。233年庲降都督才把治所稳定到味县。271年划入宁州。大姓势力大。"
    },
    {
      "name": "云南",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "225年分建宁、永昌置，治梇栋。271年属宁州。"
    },
    {
      "name": "兴古",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "225年分建宁、牂柯置，治宛温。271年属宁州。"
    },
    {
      "name": "牂柯",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治故且兰。223–225年曾叛，平后仍弱。271年宁州初置时尚未划入，仍属益州。"
    },
    {
      "name": "越巂",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治邛都。223年叛，240年张嶷重新打通郡道，其后仍弱。271年仍属益州。"
    },
    {
      "name": "永昌",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "东汉旧郡，治不韦，远至今云南西部。南中叛乱时吕凯为蜀守住郡境。271年《晋书》把它算入宁州（或写作交州之永昌）。"
    },
    {
      "name": "朱提",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "建安二十年（215）刘备改犍为属国为朱提，治朱提。《晋书》或系于221年。接近南中，控制弱。延熙中曾分南广，约九年即废，各帧不单列。"
    },
    {
      "name": "丹阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治建业。郡治一带是吴的政治核心；郡南山区山越反复，没有单列到县。"
    },
    {
      "name": "吴郡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治吴县。"
    },
    {
      "name": "会稽",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治山阴。257年分临海，260年分建安，266年分东阳，故后期辖境缩小。"
    },
    {
      "name": "豫章",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治南昌。"
    },
    {
      "name": "庐陵",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "建安初分豫章置，治西昌。236年又分南部都尉。"
    },
    {
      "name": "鄱阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "210年分豫章置，治鄱阳。225年以后郡治稳定，山区仍有零星山越。"
    },
    {
      "name": "新都（扬）",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "建安十三年（208）分丹阳置，治始新。为控制山越而设，全境标弱。"
    },
    {
      "name": "庐江（皖）",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "吴领庐江郡江南、皖城一带，治皖。与魏“庐江（皖北）”是一郡分涂。"
    },
    {
      "name": "蕲春",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "223年自魏收回，治蕲春。江北小郡，夹在两军之间。"
    },
    {
      "name": "毗陵典农",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "嘉禾三年（234）置，治毗陵，地位相当于郡，管屯田。平吴后不久改为毗陵郡。"
    },
    {
      "name": "庐陵南部都尉",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "嘉禾五年（236）分庐陵置，治雩都，地位相当于郡。入晋后改为南康郡。"
    },
    {
      "name": "临海",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "太平二年（257）分会稽东部置，治章安。滨海，山越、水民多，标弱。"
    },
    {
      "name": "临川",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "太平二年（257）分豫章置，治南城。建安末另有短命的丹阳临川郡，与此不是一地，不列入。"
    },
    {
      "name": "建安",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "永安三年（260）分会稽南部置，治建安。今福建一带，开发有限，标弱。"
    },
    {
      "name": "东阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "宝鼎元年（266）分会稽置，治长山。"
    },
    {
      "name": "吴兴",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "宝鼎元年（266）分丹阳、吴郡置，治乌程。"
    },
    {
      "name": "安成",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "宝鼎二年（267）分长沙、豫章、庐陵置，治平都。"
    },
    {
      "name": "南郡",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治江陵。219年吕蒙袭取。江陵是吴西边军镇，北与魏襄阳对峙，城本身长期在吴手中。"
    },
    {
      "name": "宜都",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "222年夷陵战败蜀后，夷陵改名西陵，郡境稳定属吴。260年分出建平。272年步阐据西陵降晋，数月后被陆抗夺回，不单独成帧。"
    },
    {
      "name": "江夏（江南）",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "吴领鄂、夏口、武昌（今鄂州）及江南诸县。221–229年、265–266年吴都在武昌，即本郡境。与魏“江夏（沔北）”须沿汉水切开。"
    },
    {
      "name": "长沙",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治临湘。257年分出衡阳、湘东，辖境缩小。"
    },
    {
      "name": "零陵",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治泉陵。265年分始安，266年分昭陵。"
    },
    {
      "name": "桂阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治郴。265年分始兴。"
    },
    {
      "name": "武陵",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治临沅。沅水上游蛮族聚居，郡治在、溪峒弱。263年分天门。"
    },
    {
      "name": "临贺",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "黄武五年（226）分苍梧置，改属荆州，治临贺。"
    },
    {
      "name": "衡阳",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "太平二年（257）分长沙、零陵置，治湘南。"
    },
    {
      "name": "湘东",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "太平二年（257）分长沙、桂阳置，治酃。"
    },
    {
      "name": "建平",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "永安三年（260）分宜都西部置，初治巫。与蜀巴东隔三峡对峙。"
    },
    {
      "name": "天门",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "永安六年（263）分武陵置，治零阳。溪峒地区，标弱。"
    },
    {
      "name": "始安",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "甘露元年（265）分零陵、苍梧置，治始安。属荆州，不属广州。"
    },
    {
      "name": "始兴",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "甘露元年（265）分桂阳、南海置，治曲江。属荆州。"
    },
    {
      "name": "昭陵",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "宝鼎元年（266）分零陵置，治昭陵。入晋后改名邵陵，本时段仍用吴名。"
    },
    {
      "name": "交趾",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "226年吕岱杀士徽后由吴直接设太守，治龙编。271年七月回到吴。陶璜增置新昌、武平。280年三月建业降晋，交州陶璜稍晚才降。"
    },
    {
      "name": "九真",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "226年后吴直辖。当地渠帅势力大。"
    },
    {
      "name": "日南",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "吴直辖后仍是最弱的一郡。"
    },
    {
      "name": "新昌",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "271年吴置，平吴后归晋。"
    },
    {
      "name": "武平",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "271年吴置，平吴后归晋。"
    },
    {
      "name": "九德",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "278年由九真属国改郡。"
    },
    {
      "name": "合浦",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "226年后吴直接治理。交趾三郡脱离期间，吴的交州办事机构常退到合浦一带。"
    },
    {
      "name": "合浦北部都尉",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "永安三年（260）分合浦置，治平山，地位相当于郡。入晋后为宁浦郡。"
    },
    {
      "name": "南海",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治番禺。264年复置广州后为广州治所。279年郭马据南海，晋军北上时尚未完全平定，280帧标弱。"
    },
    {
      "name": "苍梧",
      "controller": "jin",
      "strength": "core",
      "contenders": [],
      "note": "治广信。226年分出临贺（改属荆州）。265年起属广州。"
    },
    {
      "name": "郁林",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "治布山。控制松。274年分桂林。265年起属广州。"
    },
    {
      "name": "高凉",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "220年分合浦置。226年后明确属吴。265年起属广州。"
    },
    {
      "name": "珠崖",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "赤乌五年（242）复置，在今海南。海上郡，控制弱，是否长期有官驻守，记载很稀。"
    },
    {
      "name": "高兴",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "孙皓时分高凉置，年份缺确切记载。271帧不单列，280帧列入并注明不确定。"
    },
    {
      "name": "桂林",
      "controller": "jin",
      "strength": "weak",
      "contenders": [],
      "note": "凤凰三年（274）分郁林置，治武安。"
    }
  ],
  "capitals": [
    {
      "faction": "jin",
      "city": "洛阳",
      "lng": 112.62,
      "lat": 34.72,
      "role": "都城"
    }
  ],
  "sources": [
    "《三国志》魏书文帝纪、明帝纪、三少帝纪、明悼毛后无关；蜀书先主传、后主传；吴书吴主传、三嗣主传。交趾、辽东、南中细节见吕岱、士燮、公孙度、诸葛亮、霍弋等传。",
    "《晋书》卷三武帝纪（泰始五年置秦州、泰始七年七月交趾三郡降吴、八月置宁州、咸宁二年置平州、咸宁五年十二月凉州平、太康元年平吴）；卷十四至十五地理志。",
    "《资治通鉴》卷六十九至八十一。灭蜀月份从《三国志·三少帝纪》景元四年十一月，通鉴或系于十月。",
    "郡的置废主要对照《晋书·地理志》《华阳国志》巴志、蜀志、南中志，以及清人洪亮吉《补三国疆域志》、吴增仅《三国郡县表》、近人陈健梅《孙吴政区地理研究》的结论；与谭其骧《中国历史地图集》第三册“三国时期”标准年代（魏景元三年，262年）对读。维基百科条目只用来查找上述书的线索，有出入时以史志为准。"
  ]
}
```


## 不确定与争议

1. **灭蜀的月份。** 《三国志·三少帝纪》写景元四年十一月刘禅降，《资治通鉴》的记事有的落在十月。本文件用十一月。差一个月，不影响郡的归属。
2. **秦州的郡数。** 《晋书·武帝纪》泰始五年（269）说分出秦州时用了“梁州之阳平”，《地理志》作“阴平”。阳平郡在河北，不可能属梁州，这里从地理志，把阴平划进秦州。五郡的具体名单，志书没有在纪里逐一写明，本文件按陇西、南安、天水、略阳（广魏）、武都，外加金城、阴平，合成地理志说的七郡。
3. **上庸反复置废。** 220 年并入新城，228 年复置，约 230 年废，237 年再置，嘉平中又废，259 年再置。234 年因此不列上庸，249 年还列着。嘉平“中”到底是哪一年，没有精确到月的记载。
4. **东广汉、南广、宕渠。** 《华阳国志》说延熙年间置东广汉、南广，并一度复置宕渠，南广和宕渠大约九年就废。确切年份不清楚，所以只从 249 年起列东广汉，南广、宕渠除 220 年的宕渠外不单列。
5. **义阳郡。** 魏黄初有义阳，嘉平中废。晋平吴后又设义阳。249 年是否还在，不能肯定；263 年以后本文件不再列魏的义阳，也不把晋的义阳提前到 280 年以前。
6. **平阳郡的设立年。** 有的表放到曹丕初年，较通行的说法是正始八年（247）。本文件从 249 帧起单列，更早的帧把这块地留在河东。
7. **广州复置是 263 还是 264。** 记载有永安六年、七年两说。本文件在 265 帧才把南海、苍梧、郁林、高凉标成广州，263 帧仍统称交州。226 年那一次广州同年即废，不单列。
8. **交趾三郡在 263–271 年算谁的。** 吕兴向魏送款，晋也派了杨稷等人，但吴一直在打，271 年七月才被陶璜夺回。这七年标 `contested`，控制器写魏（265 年前）或晋（265 年后），表示“名义归北方、实际在打仗”，不是说晋的郡府已经稳稳设在龙编。
9. **永昌算不算宁州。** 《晋书》地理志说宁州包括“交州之永昌”，武帝纪只说“南中四郡”。本文件 271 年起把永昌放进宁州。它离味县很远，无论属哪一州，强度都是 `weak`。
10. **江夏、庐江的分界。** 史书没有画出一条县县清楚、六十年不变的线。可以确定的是：夏口、武昌（鄂州）在吴，安陆、石阳在魏；皖城在吴，合肥在魏。涂色时要切开，不要整郡给一边。
11. **巫县、秭归。** 219–222 年在吴、蜀之间拉锯，夷陵战后归吴，260 年前后划入建平。220 帧把宜都标成争夺，是为了不把还没打完的三峡涂成吴的腹地。
12. **南中的“平定”。** 225 年后蜀恢复了郡，但 233、240 年代仍有叛乱，越巂要到张嶷手里才重新通畅。所以 225 年以后南中各郡仍是 `weak`，不是 `core`。
13. **山越。** 丹阳郡治就是建业，不能把整郡涂成控制薄弱；新都、临海、建安和鄱阳早期更适合标 `weak`。这是按郡近似，不是按山头。
14. **珠崖、高兴。** 珠崖 242 年复置，后来是否一直有官，材料很少。高兴是孙皓时分高凉设置的，年份不详，只在 280 帧列入。
15. **280 年三月交州、广州是否已经投降。** 建业陷落时，陶璜还在交州，郭马之乱也刚被晋的进军打断。本帧仍把这两州标为晋，交趾和南海用 `weak` 提醒：旗号换了，地方还没安静。
16. **短命建置故意不进表。** 荥阳郡、朝歌郡、锡郡、吴的东安郡、221–229 年间可能存在的武昌郡，置废只有几年，没有足够把握在关键帧上单列。武昌作为都城，写在 `capitals` 里。
17. **与谭图的差别。** 谭其骧《中国历史地图集》第三册的三国标准年是魏景元三年（262），最接近本文件的 263 帧，但 262 年蜀还在、交趾还没叛。不能把 262 年的图直接当成 263 年十一月。

