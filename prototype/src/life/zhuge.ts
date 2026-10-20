export type LngLat = [number, number]

export interface Callout {
  at: LngLat
  text: string
  /** index of the narration line that brings this callout up */
  line: number
}

export interface Passing {
  year: number
  text: string
  /** a march that leaves from `from`, reaches `to`, then falls back */
  march?: LngLat[]
}

export type Gesture =
  | { kind: 'walk'; path: LngLat[]; hint: string; toYear: number }
  | {
      kind: 'hold'
      hint: string
      toYear: number
      passing: Passing[]
      secondsPerYear: number
      /** pull back so the world changing around him is in sight */
      view?: { center: LngLat; zoom: number }
    }

export interface Segment {
  id: string
  lines: string[]
  callouts?: Callout[]
  /** camera while this segment is spoken */
  center?: LngLat
  zoom?: number
}

export interface Stop {
  id: string
  year: number
  place: string
  at: LngLat
  zoom: number
  /** what he is going through right now, for talking with him */
  stage: string
  sound: { wind: number; water: number }
  before: Segment
  /** spoken right after `before`, still ahead of the gesture */
  then?: Segment
  gesture?: Gesture
  after?: Segment
  /** refugees streaming south while this stop is on screen */
  flight?: boolean
}

export const BORN = 181
export const HOME: LngLat = [118.47, 35.55]

const WALK: LngLat[] = [
  HOME,
  [118.12, 34.86],
  [117.75, 34.05],
  [117.3, 33.25],
  [116.78, 32.58],
  [116.95, 31.75],
  [116.95, 30.95],
  [116.45, 30.1],
  [115.98, 29.72],
  [115.88, 28.68],
]

export const stops: Stop[] = [
  {
    id: 'yangdu',
    year: 194.3,
    place: '琅琊阳都',
    at: HOME,
    zoom: 6.4,
    stage: '你大约十三岁。叔叔诸葛玄要去豫章上任，带上了你和弟弟诸葛均。曹操刚在徐州杀了很多人。',
    sound: { wind: 0.55, water: 0 },
    before: {
      id: 'yangdu-a',
      lines: [
        '大约在公元一九四年。',
        '琅琊国阳都县，就是今天山东临沂的沂南。',
        '这里有个十三岁的男孩，要离开家了。',
        '他再也没有回来。',
      ],
    },
    then: {
      id: 'yangdu-b',
      center: [117.6, 34.2],
      zoom: 5.6,
      lines: [
        '他叫诸葛亮。',
        '前一年秋天，曹操为了给父亲报仇，打进徐州。史书上写，杀了几十万人，泗水都被堵得流不动了。',
        '活下来的人，一路往南逃。',
        '他的父亲早就去世了。叔叔诸葛玄要去豫章上任，带上了他和弟弟诸葛均。',
        '哥哥诸葛瑾去了江东。兄弟俩，从此分在两处。',
      ],
    },
    flight: true,
    gesture: { kind: 'walk', path: WALK, hint: '用手指，替他走这一段路', toYear: 195.2 },
  },
  {
    id: 'yuzhang',
    year: 195.2,
    place: '豫章',
    at: [115.88, 28.68],
    zoom: 6,
    stage: '你十四岁左右，跟着叔叔走到了豫章。叔叔本来要在这里做太守，可朝廷另派了人来，叔叔丢了官，打算带你们去荆州投奔刘表。',
    sound: { wind: 0.2, water: 0.35 },
    before: {
      id: 'yuzhang-a',
      lines: [
        '史书没有写他们走的是哪条路。这只是一条可能的路。',
        '八百多公里。没有车，身后还在打仗。',
        '叔叔本来是来豫章做太守的。可没多久，朝廷另派了人来，把这个位子拿走了。',
        '叔叔和荆州的刘表是老相识。一家人只好再往西走。',
      ],
    },
  },
  {
    id: 'longzhong',
    year: 197,
    place: '隆中',
    at: [112.04, 32.0],
    zoom: 7,
    stage: '你在襄阳城西的隆中种地读书。叔叔已经去世了。外面曹操、袁绍在打仗，你常把自己比作管仲、乐毅。',
    sound: { wind: 0.22, water: 0.08 },
    before: {
      id: 'longzhong-a',
      lines: ['襄阳城西二十里，有个地方叫隆中。', '过了两年多，叔叔也去世了。', '他就在这里住了下来。种地，读书。'],
    },
    gesture: {
      kind: 'hold',
      hint: '按住这里，让日子过去',
      toYear: 207.8,
      secondsPerYear: 0.85,
      view: { center: [114.2, 34.2], zoom: 4.7 },
      passing: [
        { year: 200.8, text: '官渡，曹操打败了袁绍。这一年，他十九岁。' },
        { year: 204.6, text: '曹操拿下了邺城。' },
        { year: 207.6, text: '曹操北征乌桓。河北，差不多都是他的了。' },
      ],
    },
    after: {
      id: 'longzhong-b',
      lines: [
        '十年。外面的天下，换了好几轮主人。',
        '他一直在这里，听着，想着。',
        '他常把自己比作管仲、乐毅那样的人。身边的人，大多不信。',
      ],
    },
  },
  {
    id: 'sangu',
    year: 207.9,
    place: '隆中',
    at: [112.04, 32.0],
    zoom: 7,
    stage: '你二十六岁，在隆中的草屋里。四十六岁的刘备来了三次，第三次你见了他，给他讲了天下的形势：北让曹操，东联孙权，取荆州、益州，三分天下。',
    sound: { wind: 0.18, water: 0 },
    before: {
      id: 'sangu-a',
      lines: ['二十六岁这年，一个四十六岁的人，来了三次。', '他叫刘备。第三次，诸葛亮见了他。', '他给刘备讲了一张天下的地图。'],
    },
    then: {
      id: 'sangu-b',
      center: [110.5, 31.6],
      zoom: 4.3,
      lines: [
        '北边，曹操已经有百万之众，还挟持着天子。这个人，不能跟他硬碰。',
        '东边，孙权家在江东已经三代了。可以做朋友，不能去打。',
        '中间的荆州，西边的益州，主人都守不住。',
        '把这两块拿下来，天下就成了三份。',
      ],
      callouts: [
        { at: [115.2, 35.6], text: '曹操', line: 0 },
        { at: [119.2, 30.4], text: '孙权', line: 1 },
        { at: [112.6, 29.6], text: '荆州', line: 2 },
        { at: [104.4, 30.2], text: '益州', line: 2 },
      ],
    },
    gesture: {
      kind: 'hold',
      hint: '按住，看他说的会不会成真',
      toYear: 214.4,
      secondsPerYear: 0.9,
      passing: [
        { year: 208.9, text: '赤壁。曹操的船烧起来了。' },
        { year: 209.6, text: '刘备得到了荆州南边的几个郡。' },
        { year: 211.9, text: '刘备带兵进了四川。' },
        { year: 214.3, text: '刘备拿下了成都。' },
      ],
    },
  },
  {
    id: 'chengdu',
    year: 214.5,
    place: '成都',
    at: [104.07, 30.66],
    zoom: 6.2,
    stage: '你三十三岁，刚和张飞、赵云坐船逆长江而上，随刘备进了成都。第二年哥哥诸葛瑾作为孙权的使者来成都，你们只在公开场合见面。',
    sound: { wind: 0.12, water: 0.3 },
    before: {
      id: 'chengdu-a',
      lines: [
        '三十三岁这年，他和张飞、赵云坐船，逆着长江往上游走，也进了四川。',
        '从那以后，他再没在荆州长住。',
        '第二年，哥哥诸葛瑾作为孙权的使者，来到成都。',
        '史书上写，兄弟俩只在公开的场合见面。退下来，从不私下相聚。',
      ],
    },
    gesture: {
      kind: 'hold',
      hint: '按住，让这几年过去',
      toYear: 223.2,
      secondsPerYear: 0.8,
      view: { center: [108.6, 30.9], zoom: 5.1 },
      passing: [
        { year: 219.9, text: '关羽丢了荆州。' },
        { year: 221.4, text: '刘备在成都称帝，诸葛亮做了丞相。' },
        { year: 222.5, text: '夷陵，刘备大败，退到白帝城。' },
      ],
    },
    after: {
      id: 'chengdu-b',
      lines: [
        '十五年前在草屋里讲的那张地图，差不多成真了。天下，成了三份。',
        '只是荆州，没能留住。',
      ],
    },
  },
  {
    id: 'baidi',
    year: 223.3,
    place: '白帝城',
    at: [109.57, 31.04],
    zoom: 6.6,
    stage: '你四十二岁，在白帝城。刘备刚刚临终，把儿子刘禅托付给你。',
    sound: { wind: 0.2, water: 0.45 },
    before: {
      id: 'baidi-a',
      lines: ['公元二二三年，刘备病死在白帝城。', '临死前，他把儿子刘禅，托给了诸葛亮。', '这一年，他四十二岁。'],
    },
  },
  {
    id: 'hanzhong',
    year: 227.3,
    place: '汉中',
    at: [107.03, 33.07],
    zoom: 6.2,
    stage: '你四十六岁起驻在汉中，一次次北伐。粮食要翻秦岭运上来，打不下来就退回。',
    sound: { wind: 0.5, water: 0 },
    before: {
      id: 'hanzhong-a',
      lines: [
        '四十六岁，他离开成都，住进了汉中的军营。',
        '临走，他给刘禅写了一封信，就是《出师表》。里面有一句：臣本布衣，躬耕于南阳。',
        '从这里往北，就是秦岭。',
      ],
    },
    gesture: {
      kind: 'hold',
      hint: '按住，陪他走完这几年',
      toYear: 234.4,
      secondsPerYear: 1.1,
      view: { center: [106.4, 34.0], zoom: 6.3 },
      passing: [
        {
          year: 228.2,
          text: '第一次出祁山。街亭丢了，只好退回来。',
          march: [[107.03, 33.07], [106.0, 33.6], [105.39, 34.15], [105.97, 35.0]],
        },
        {
          year: 228.95,
          text: '冬天，围陈仓二十多天。粮吃完了，退回来。',
          march: [[107.03, 33.07], [106.9, 33.7], [107.23, 34.36]],
        },
        { year: 229.4, text: '拿下了武都、阴平两个郡。', march: [[107.03, 33.07], [105.6, 33.45], [104.9, 33.4]] },
        {
          year: 231.3,
          text: '又出祁山。粮食运不上来，退回来。',
          march: [[107.03, 33.07], [106.0, 33.6], [105.39, 34.15]],
        },
        { year: 234.3, text: '最后一次。出斜谷，到了五丈原。', march: [[107.03, 33.07], [107.45, 33.65], [107.65, 34.21]] },
      ],
    },
    after: {
      id: 'hanzhong-b',
      lines: ['粮食，要靠人背、靠木牛流马，一路翻过秦岭运上来。', '打不下来，就退回来。再来。'],
    },
  },
  {
    id: 'wuzhangyuan',
    year: 234.6,
    place: '五丈原',
    at: [107.65, 34.21],
    zoom: 7,
    stage: '你五十三岁，在五丈原的军营里病得很重。司马懿也渡过渭水，在南岸扎营。两军对峙了一百多天。',
    sound: { wind: 0.62, water: 0 },
    before: {
      id: 'wuzhangyuan-a',
      lines: ['公元二三四年，秋天，五丈原。', '司马懿也渡过渭水，在南岸扎营。两军对峙了一百多天。', '八月，他病死在军营里。史书上写，时年五十四岁（古人算虚岁）。'],
    },
    after: {
      id: 'wuzhangyuan-b',
      center: [111.5, 32.2],
      zoom: 4.6,
      lines: ['从十三岁离开阳都，他走了四十年。', '他再也没有回去。'],
    },
  },
]

/** Every place he lived, in order: the line drawn at the end. */
export const lifePath: LngLat[] = [
  ...WALK,
  [112.04, 32.0],
  [115.99, 29.73],
  [112.23, 30.06],
  [104.07, 30.66],
  [109.57, 31.04],
  [104.07, 30.66],
  [107.03, 33.07],
  [107.65, 34.21],
]

export const shareLine =
  '你知道吗？诸葛亮大约十三岁那年，叔叔诸葛玄带他和弟弟去豫章上任，后来他再也没有回到山东老家。他死在陕西的五丈原，离家差不多一千公里。'
