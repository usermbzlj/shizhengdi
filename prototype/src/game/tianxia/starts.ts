import type { Fid } from './roster'

export interface Start {
  id: string
  /** decimal year the game starts */
  t0: number
  title: string
  when: string
  text: string
  wars: [Fid, Fid][]
  allies: [Fid, Fid][]
  /** landless lords: [faction, commandery, troops, generals] */
  guests?: [Fid, string, number, string[]][]
  /** the AI won't start wars before this day */
  calm: number
  /** armies larger than the land alone would give */
  muster?: Partial<Record<Fid, number>>
}

export const STARTS: Start[] = [
  {
    id: '200',
    t0: 200,
    title: '官渡之前',
    when: '建安五年 · 200 年正月',
    text: '袁绍刚刚灭了公孙瓒，拥有河北四州，正准备南下。曹操挟天子在许，东边刚赶走刘备。孙策在江东，听说要偷袭许都。',
    wars: [['cao', 'yuan'], ['cao', 'liubei'], ['sun', 'liubiao'], ['liuzhang', 'zhanglu']],
    allies: [['yuan', 'liubei']],
    guests: [['liubei', '魏郡', 6000, ['liubei', 'zhangfei', 'zhaoyun']]],
    calm: 90,
    muster: { yuan: 2.4, cao: 0.5, zhanglu: 3 },
  },
  {
    id: '208',
    t0: 208.5,
    title: '赤壁之前',
    when: '建安十三年 · 208 年七月',
    text: '曹操已经平定河北，在邺城练了水军，七月挥师南下。荆州的刘表病重。刘备当时屯在樊城，兵不多。江东的孙权还没拿定主意。',
    wars: [['cao', 'liubei'], ['sun', 'liubiao'], ['liuzhang', 'zhanglu']],
    allies: [['liubei', 'liubiao']],
    guests: [['liubei', '南郡', 9000, ['liubei', 'guanyu', 'zhangfei', 'zhaoyun', 'zhugeliang']]],
    calm: 60,
    muster: { cao: 1.0, sun: 1.4, zhanglu: 3 },
  },
  {
    id: '220',
    t0: 220 + 10.5 / 12,
    title: '三分天下',
    when: '黄初元年 · 220 年冬',
    text: '曹丕刚刚代汉称帝。关羽败亡，荆州归了孙权。刘备在成都，誓要报仇。三家之外，还有远在辽东和交州的割据者。',
    wars: [['cao', 'liubei'], ['sun', 'liubei']],
    allies: [['sun', 'shixie']],
    calm: 120,
    muster: { cao: 1.6, sun: 1.5, liubei: 1.8 },
  },
]
export const startById = new Map(STARTS.map((s) => [s.id, s]))
