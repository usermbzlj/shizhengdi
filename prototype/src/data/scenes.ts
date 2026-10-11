/** Editorial scene journeys. Dates are deliberate stops, never an automatic clock. */
export interface SceneSource {
  title: string;
  url: string;
  note?: string;
}

export interface ScenePerson {
  /** Existing person id where available; chenqun is a scene-only editorial identity. */
  id: string;
  name: string;
  role: string;
}

export interface SceneStep {
  id: string;
  title: string;
  text: string;
  focus: "terrain" | "people" | "institution" | "outcome";
  /** Map context, not a claim about the exact month or day of the event. */
  year: number;
  yearLabel: string;
  center: [number, number];
  zoom: number;
  lines?: string[];
  portraitIds?: string[];
  evidence: { label: string; text: string };
}

export interface SceneDefinition {
  id: string;
  eventId: string;
  title: string;
  kicker: string;
  question: string;
  summary: string;
  portraitId: string;
  people: ScenePerson[];
  steps: SceneStep[];
  sources: SceneSource[];
  boundaries: string[];
}

export const scenes: SceneDefinition[] = [
  {
    id: "chibi",
    eventId: "chibi_zhizhan",
    title: "赤壁之战",
    kicker: "208年冬 · 长江中游",
    question: "占住北方之后，为什么仍跨不过这段长江？",
    summary:
      "沿江而来的大军，遇上联盟、水战与一场火攻。看见地理，也看见人的选择。",
    portraitId: "zhouyu",
    people: [
      { id: "zhouyu", name: "周瑜", role: "与程普率孙权军，与刘备合力迎战" },
      { id: "caocao", name: "曹操", role: "进入荆州，率军沿江东下" },
      { id: "sunquan", name: "孙权", role: "决定抵抗，派出水军" },
      { id: "liubei", name: "刘备", role: "与孙权结盟，共同迎战" },
      { id: "huanggai", name: "黄盖", role: "提出火攻，诈降接近曹军" },
    ],
    steps: [
      {
        id: "chibi-1",
        title: "长江的防线，已经变了",
        focus: "terrain",
        year: 208.8,
        yearLabel: "208年 · 曹军进入荆州",
        center: [112.9, 30.2],
        zoom: 5.1,
        lines: ["changjiang"],
        portraitIds: ["zhouyu"],
        text: "曹操进入荆州，也接收了刘表的水军。长江仍在眼前，船却不只在孙权手中；一道天险，已经不能独自挡住来敌。",
        evidence: {
          label: "看见地理",
          text: "沿江看江陵、赤壁与江东：河流既能阻隔，也能把军队送向下游。",
        },
      },
      {
        id: "chibi-2",
        title: "人数之外，还有什么",
        focus: "people",
        year: 208.8,
        yearLabel: "208年冬 · 决定迎战",
        center: [114.0, 29.9],
        zoom: 5.3,
        portraitIds: ["zhouyu"],
        text: "孙权决定抵抗，与刘备合力迎战。周瑜判断：北方士兵远来，水战与水土都成难题；史书也记下曹军已经有疾病。",
        evidence: {
          label: "看见选择",
          text: "联盟、作战方式和军队状态，不能只用地图面积或兵力大小代替。",
        },
      },
      {
        id: "chibi-3",
        title: "火船为什么能靠近",
        focus: "people",
        year: 208.8,
        yearLabel: "208年冬 · 火攻",
        center: [113.63, 29.87],
        zoom: 6.3,
        lines: ["changjiang"],
        portraitIds: ["zhouyu"],
        text: "黄盖发现曹军船舰首尾相接，先送信假称投降，再让装着薪草、油料的船靠近。火借强风蔓延，连岸上的营地也被烧到。",
        evidence: {
          label: "因果相连",
          text: "诈降让火船接近，船舰相接让火势扩散，风又放大了破坏。",
        },
      },
      {
        id: "chibi-4",
        title: "一场胜利，没有立刻分成三国",
        focus: "outcome",
        year: 208.8,
        yearLabel: "赤壁战后 · 三国尚未建立",
        center: [113.5, 31.0],
        zoom: 4.7,
        lines: ["changjiang"],
        portraitIds: ["zhouyu"],
        text: "曹操败退，仍留曹仁守江陵；孙刘联军继续争夺南郡。赤壁改变了统一的进程，却没有在一夜之间划出魏、蜀、吴的边界。",
        evidence: {
          label: "辨认结果",
          text: "把战役的转折与后来政权的建立分开看，才不会把208年读成三国已经鼎立。",
        },
      },
      {
        id: "chibi-5",
        title: "风是真的，借风是故事",
        focus: "outcome",
        year: 208.8,
        yearLabel: "回望208年冬",
        center: [113.63, 29.87],
        zoom: 5.7,
        portraitIds: ["zhouyu"],
        text: "《周瑜传》记下火攻时风势猛烈，裴注引《江表传》进一步说是东南风。诸葛亮设坛“借东风”，属于后来小说的讲法。",
        evidence: {
          label: "读懂史料",
          text: "战场采用今赤壁一带的示意定位；古河岸、船位与行军箭头，都不能当作精确复原。",
        },
      },
    ],
    sources: [
      {
        title: "《三国志》卷五十四 · 周瑜传",
        url: "https://zh.wikisource.org/wiki/三國志/卷54",
        note: "含裴松之注；风向的东南风表述出自所引《江表传》，须与本传分开。",
      },
    ],
    boundaries: [
      "本场景只写208年冬，不在十月、十二月的不同编年之间伪造一致的精确日期。",
      "以今湖北赤壁一带为故事定位，河岸、舰队与路线均为示意；该定位不等于古战场已被精确测定。",
      "火攻、诈降和船舰首尾相接有史料依据；铁链捆船的具体构造不能由这句话直接推出。",
      "强风见本传，东南风见裴注所引《江表传》；不制作诸葛亮施法改变天气的画面。",
      "人物肖像为当代艺术想象，不是本人容貌的考古复原。",
    ],
  },
  {
    id: "jiupin",
    eventId: "inst-jiupin-220",
    title: "九品中正",
    kicker: "220年起 · 从选人到门第",
    question: "把人才分成九等，就能让选官更公平吗？",
    summary:
      "地图没有改色，决定谁能进入朝廷的办法却变了。从一项选人制度，看见评价的权力。",
    portraitId: "chenqun",
    people: [
      { id: "chenqun", name: "陈群", role: "提出九品官人法" },
      { id: "caopi", name: "曹丕", role: "即魏王位后采用新办法" },
      { id: "weijuan", name: "卫瓘", role: "西晋时批评制度变化，建议改制" },
      { id: "liuyi", name: "刘毅", role: "西晋时指出品评偏向势族" },
    ],
    steps: [
      {
        id: "jiupin-1",
        title: "战乱之后，怎样认识一个人",
        focus: "institution",
        year: 220.5,
        yearLabel: "220年 · 制度创立",
        center: [113.4, 34.4],
        zoom: 4.7,
        portraitIds: ["chenqun"],
        text: "多年战乱让士人离开乡里，朝廷更难了解他们。后来卫瓘回顾说，九品之制起初是为应对这种难题，提供一套选人的依据。",
        evidence: {
          label: "先看难题",
          text: "从卫瓘的回顾理解初建时的难题，再与后来制度的变化作比较。",
        },
      },
      {
        id: "jiupin-2",
        title: "让评价进入选官",
        focus: "institution",
        year: 220.5,
        yearLabel: "220年 · 九品官人法",
        center: [112.62, 34.72],
        zoom: 5.5,
        portraitIds: ["chenqun"],
        text: "曹丕即魏王位后，陈群提出九品官人法。中正负责品评人物、分列等第，朝廷再据此选官；九品首先是人的品评等级。",
        evidence: {
          label: "看见制度",
          text: "人物 → 中正品评 → 朝廷选用。九品不是一次考试的九档分数，也不是直接给官职编号。",
        },
      },
      {
        id: "jiupin-3",
        title: "评价者的尺子",
        focus: "people",
        year: 220.5,
        yearLabel: "220年 · 新办法的难处",
        center: [113.85, 34.04],
        zoom: 5.3,
        portraitIds: ["chenqun"],
        text: "一张等第表，需要有人判断谁值得推荐。评价者知道多少、偏爱谁，都会影响结果；办法写得整齐，并不意味着每个人都被公平看见。",
        evidence: {
          label: "读懂权力",
          text: "追问评价者怎样认识一个人：依据从哪里来，判断又怎样影响选用？",
        },
      },
      {
        id: "jiupin-4",
        title: "后来，家世进入了尺子",
        focus: "institution",
        year: 280,
        yearLabel: "西晋初年 · 后来的变化",
        center: [112.62, 34.72],
        zoom: 5.1,
        portraitIds: ["chenqun"],
        text: "到了西晋，卫瓘批评品评逐渐按资望定等，刘毅也指出高等第偏向有势力的家族。不能把后来的门第化，直接当作220年创制时的全部面貌。",
        evidence: {
          label: "分开两个时代",
          text: "把220年的创制与西晋人的批评分开观察：同一项制度，会在时间中改变。",
        },
      },
      {
        id: "jiupin-5",
        title: "谁来评价评价者",
        focus: "outcome",
        year: 280,
        yearLabel: "西晋初年 · 回望制度",
        center: [112.62, 34.72],
        zoom: 4.8,
        portraitIds: ["chenqun"],
        text: "刘毅追问：品评缺少约束，受委屈的人又难以申诉，怎样避免偏私？选官不仅要有标准，还要让评价的理由能够被检查。",
        evidence: {
          label: "带走一个问题",
          text: "从刘毅的批评继续追问：评价的理由怎样被检查，受委屈的人怎样被听见？",
        },
      },
    ],
    sources: [
      {
        title: "《三国志》卷二十二 · 陈群传",
        url: "https://zh.wikisource.org/wiki/三國志_(四庫全書本)/魏志/卷22",
        note: "陈群建法位于曹丕即魏王位之后、践阼称帝之前。",
      },
      {
        title: "《晋书》卷三十六 · 卫瓘传",
        url: "https://zh.wikisource.org/wiki/晉書/卷036",
        note: "保存对创制背景与后来计资定品的回顾，不是220年的立法原文。",
      },
      {
        title: "《晋书》卷四十五 · 刘毅传",
        url: "https://zh.wikisource.org/wiki/晉書_(四庫全書本)/卷045",
        note: "保存对中正权力、偏私与申诉限制的批评。",
      },
    ],
    boundaries: [
      "创立节点用220年，不宣称掌握完整原始法令、精确实施日或各地同时落地的时间。",
      "初衷依据后人的历史回顾说明；不虚构陈群当面说出的台词，也不把动机压缩成唯一原因。",
      "九品人物等第与官品有关联，但不是同一个概念；图示只解释评人到选官的关系。",
      "后两段呈现西晋初年的变化；地图以280年表达时代背景，不代表卫瓘、刘毅奏疏的确切日期。",
      "制度关系图为教学示意，不伪造一份完整存世的220年品评名册。",
      "陈群肖像为当代艺术想象，不依据存世容貌复原。",
    ],
  },
  {
    id: "yinping",
    eventId: "yinping_mieshu",
    title: "阴平灭蜀",
    kicker: "263年 · 剑阁之外",
    question: "守住了剑阁，为什么仍没守住成都？",
    summary:
      "一条险路绕过正面的关口，也把进攻者推到缺粮的边缘。山险并非不能跨越，跨越却有代价。",
    portraitId: "dengai",
    people: [
      { id: "dengai", name: "邓艾", role: "从阴平绕行，进入蜀地腹地" },
      { id: "jiang-wei", name: "姜维", role: "退守剑阁，抵抗钟会" },
      { id: "zhong-hui", name: "钟会", role: "率军从正面进攻剑阁" },
      { id: "zhugezhan", name: "诸葛瞻", role: "在绵竹迎战邓艾，战死" },
      { id: "liushan", name: "刘禅", role: "成都面临进攻后投降" },
    ],
    steps: [
      {
        id: "yinping-1",
        title: "正面那道门，还守得住",
        focus: "terrain",
        year: 263.8,
        yearLabel: "263年 · 剑阁对峙",
        center: [105.57, 32.23],
        zoom: 6.0,
        portraitIds: ["dengai"],
        text: "姜维退守剑阁，钟会从正面进攻，未能攻下。山地把大路收束在关口，但守住这道门，还不等于守住所有通向腹地的方向。",
        evidence: {
          label: "看见地形",
          text: "找剑阁，再看它的西侧：关口控制主路，山地仍可能留下难走的绕行空间。",
        },
      },
      {
        id: "yinping-2",
        title: "把难题送到防线背后",
        focus: "people",
        year: 263.8,
        yearLabel: "263年 · 阴平绕行",
        center: [104.95, 32.4],
        zoom: 5.5,
        portraitIds: ["dengai"],
        text: "邓艾提出，从阴平的小路绕向涪。姜维若回救，剑阁会少一道屏障；若不回救，腹地就要独自面对这支突然出现的军队。",
        evidence: {
          label: "看见选择",
          text: "绕行的目标是迫使守方分兵应对，不是把山从地图上抹掉。",
        },
      },
      {
        id: "yinping-3",
        title: "险路，也困住进攻者",
        focus: "terrain",
        year: 263.8,
        yearLabel: "263年冬 · 翻山",
        center: [104.8, 32.15],
        zoom: 6.1,
        portraitIds: ["dengai"],
        text: "《邓艾传》记载，他们凿山修路、搭建桥阁，粮食转运几乎耗尽。山谷越深，绕行越难被预料，军队也越难得到补给。",
        evidence: {
          label: "看见代价",
          text: "地图上的短箭头可能对应漫长山路；古里程不能按比例直接换成今天的公路长度。",
        },
      },
      {
        id: "yinping-4",
        title: "关口以南，防线被打开",
        focus: "outcome",
        year: 263.8,
        yearLabel: "263年 · 江油与绵竹",
        center: [104.65, 31.48],
        zoom: 5.7,
        portraitIds: ["dengai"],
        text: "邓艾抵达江油，守将投降；随后在绵竹击败诸葛瞻。威胁已经进入成都一侧，剑阁守军再坚守，也无法单独挡住这条进攻线。",
        evidence: {
          label: "连接地点",
          text: "把江油、绵竹、成都连起来，再对照仍在北面的剑阁，理解正面与侧后的区别。",
        },
      },
      {
        id: "yinping-5",
        title: "蜀地并入魏，吴仍在江南",
        focus: "outcome",
        year: 263.95,
        yearLabel: "263年末 · 蜀汉灭亡",
        center: [105.5, 31.3],
        zoom: 4.8,
        portraitIds: ["dengai"],
        text: "刘禅请降，蜀汉在263年灭亡。山险曾帮助蜀汉守住边境，最终的结果还取决于路线、补给和防守选择；此时的魏尚未变成晋。",
        evidence: {
          label: "辨认时代",
          text: "这次变化是魏灭蜀，不是三国已经归晋；吴仍在长江以南。",
        },
      },
    ],
    sources: [
      {
        title: "《三国志》卷二十八 · 邓艾传",
        url: "https://zh.wikisource.org/wiki/三國志_(四庫全書本)/魏志/卷28",
        note: "绕行计划、修路、补给危机、江油降与绵竹战均据本传。",
      },
      {
        title: "《三国志》卷三十三 · 后主传",
        url: "https://zh.wikisource.org/wiki/三國志/卷33",
        note: "用于核对263年蜀汉灭亡与刘禅请降。",
      },
      {
        title: "四川省文物考古研究院 · 德阳绵竹城遗址",
        url: "https://www.sckg.com/qinhan/1770.html",
        note: "古绵竹在今德阳黄许一带，区别于今天的绵竹市；地图采用区域示意。",
      },
    ],
    boundaries: [
      "剑阁、阴平、江油、绵竹的地图点和连接线用于解释空间关系，不是考古复原的逐段行军轨迹。",
      "古江油城、古绵竹与现代同名市区须分开；镜头中心只是观察范围，不是事件精确坐标。",
      "七百余里是史书里程，不按现代单位简单换算；不把图上的直线当成实际山路。",
      "险路成功并不说明补给无关紧要，也不把所有因果归结为单个将领的天才。",
      "263年是魏灭蜀；晋代魏与280年灭吴是后续事件，本场景不提前改变国号。",
      "人物肖像为艺术想象；不使用神谕、诸葛亮预先留下地图等演义化情节。",
    ],
  },
];

export const sceneById = new Map(scenes.map((scene) => [scene.id, scene]));
export const sceneByEventId = new Map(
  scenes.map((scene) => [scene.eventId, scene]),
);
