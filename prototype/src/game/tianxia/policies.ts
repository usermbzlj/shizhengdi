import type { Fid } from './roster'

export type Mod = 'grain' | 'manpower' | 'order' | 'navy' | 'cav' | 'mountainSupply' | 'river' | 'legit' | 'talent' | 'growth'

export interface Policy {
  id: string
  name: string
  /** who may take it; empty means everyone */
  who: Fid[]
  days: number
  /** grain in 万斛 */
  cost: number
  needs?: string[]
  /** commanderies that must be held */
  hold?: string[]
  /** minimum number of commanderies */
  size?: number
  /** a general who must serve you */
  with?: string
  what: string
  mods: Partial<Record<Mod, number>>
  /** also a title: 1 king, 2 emperor */
  title?: 1 | 2
  /** turns these borders into waterways: [a, b, river] */
  canal?: [string, string, string][]
  /** when each side really did it; `text` is shown in the game */
  history?: { years: Partial<Record<Fid, number>>; text: string }
}

export const POLICIES: Policy[] = [
  {
    id: 'quannong', name: '劝课农桑', who: [], days: 90, cost: 4,
    what: '派官员下乡督促耕种、修补沟渠。全境粮食收成 +10%。',
    mods: { grain: 0.1 },
  },
  {
    id: 'liumin', name: '招抚流民', who: [], days: 120, cost: 6,
    what: '乱世里大批农民流亡。把他们召回来分给土地，人口恢复更快，兵源 +10%。',
    mods: { growth: 0.6, manpower: 0.1 },
  },
  {
    id: 'lianbing', name: '整训士卒', who: [], days: 90, cost: 5,
    what: '新兵和老兵混编操练。军队士气恢复更快。',
    mods: { order: 0.03 },
  },
  {
    id: 'tuntian', name: '屯田', who: ['cao'], days: 150, cost: 8,
    what: '把无主的荒地收归官府，招募流民和士兵耕种，收成和官府分。中原的平原郡粮食 +40%。',
    mods: { grain: 0.25 },
    history: { years: { cao: 196 }, text: '196 年，曹操采纳枣祗、韩浩的建议在许下屯田，“得谷百万斛”，后来推广到各州郡。' },
  },
  {
    id: 'weicai', name: '唯才是举', who: ['cao'], days: 60, cost: 2, needs: ['tuntian'],
    what: '只看本事，不问出身和品行。失去主公的名将更愿意投奔你。',
    mods: { talent: 1, legit: 1 },
    history: { years: { cao: 210 }, text: '210 年，曹操下《求贤令》：“唯才是举，吾得而用之。”' },
  },
  {
    id: 'baigou', name: '遏淇水入白沟', who: ['cao', 'yuan'], days: 120, cost: 10, hold: ['魏郡', '河内'],
    what: '在淇水入黄河的地方打下大木桩筑堰，逼淇水改道流进白沟。河北的粮船从此可以从黄河一直开到邺城附近。',
    mods: {},
    canal: [['河内', '魏郡', '白沟'], ['魏郡', '巨鹿', '白沟'], ['魏郡', '清河', '白沟']],
    history: { years: { cao: 204 }, text: '204 年正月，曹操围邺城前“遏淇水入白沟以通粮道”，筑堰的地方后来叫作枋头。' },
  },
  {
    id: 'pinglu', name: '开平虏渠、泉州渠', who: ['cao', 'yuan'], days: 150, cost: 12, hold: ['渤海', '渔阳'], needs: ['baigou'],
    what: '从滹沱河挖渠通到泒水，这条叫平虏渠；泉州渠是从泃河口通到潞河。粮船可以北上到幽州。',
    mods: {},
    canal: [['渤海', '河间', '平虏渠'], ['河间', '涿郡', '平虏渠'], ['涿郡', '渔阳', '泉州渠'], ['渔阳', '右北平郡', '泉州渠']],
    history: { years: { cao: 206 }, text: '206 年，曹操为北征乌桓开平虏渠、泉州渠运粮，第二年远征柳城大胜。' },
  },
  {
    id: 'shijia', name: '士家制', who: ['cao', 'sun'], days: 90, cost: 4, size: 12,
    what: '当兵的人家世代当兵，家属集中居住。兵源 +30%，但百姓不太乐意。',
    mods: { manpower: 0.3, order: -0.04 },
    history: { years: { cao: 205, sun: 205 }, text: '曹魏和孙吴都实行士家（世兵）制度，士兵的家属作为人质集中居住。' },
  },
  {
    id: 'weigong', name: '进爵魏公', who: ['cao'], days: 60, cost: 6, size: 18,
    what: '以冀州十郡为魏国，名义上仍是汉臣。声望提高，但汉室忠臣会不满。',
    mods: { legit: 1, order: -0.02 },
    history: { years: { cao: 213 }, text: '213 年，曹操受封魏公；216 年进爵魏王。荀彧因反对此事而死。' },
  },
  {
    id: 'king', name: '称王', who: [], days: 120, cost: 15, size: 16,
    what: '自立为王，名分更高，部下更有盼头。只要汉天子还在，这就是僭越，各郡民心会下降。',
    mods: { legit: 1, manpower: 0.05 },
    title: 1,
    history: { years: { cao: 216, liubei: 219, sun: 221 }, text: '216 年曹操称魏王，219 年刘备称汉中王，221 年孙权受魏封为吴王。' },
  },
  {
    id: 'emperor', name: '称帝', who: [], days: 180, cost: 30, size: 20, needs: ['king'],
    what: '登基称帝，改元建号。从此天下不再只有一个皇帝。197 年袁术称帝，诸侯群起而攻之，两年后就败亡了。',
    mods: { legit: 2, manpower: 0.05 },
    title: 2,
    history: { years: { cao: 220, liubei: 221, sun: 229 }, text: '220 年曹丕代汉称帝，221 年刘备称帝，229 年孙权称帝。三国正式鼎立。' },
  },
  {
    id: 'shanyue', name: '征讨山越', who: ['sun'], days: 180, cost: 8, hold: ['丹阳'],
    what: '江南山里住着不服管的山越人。把他们迁出山来编户当兵，兵源 +40%。',
    mods: { manpower: 0.4, order: -0.03 },
    history: { years: { sun: 203 }, text: '孙吴几十年里不断征讨山越，诸葛恪一次就从丹阳山中得兵四万。' },
  },
  {
    id: 'jianye', name: '徙治秣陵', who: ['sun'], days: 90, cost: 6, hold: ['丹阳'],
    what: '把治所搬到秣陵，次年改名建业，筑石头城。治所靠着长江。',
    mods: { river: 0.15 },
    history: { years: { sun: 211 }, text: '211 年孙权徙治秣陵，次年改名建业、筑石头城，就是今天的南京。' },
  },
  {
    id: 'ruxu', name: '筑濡须坞', who: ['sun'], days: 120, cost: 6, hold: ['庐江'],
    what: '在濡须水口两岸筑起营寨，把水军藏在里面。曹军从合肥南下，没有船就很难从这里过江。',
    mods: { river: 0.15 },
    history: { years: { sun: 213 }, text: '213 年曹操号称四十万大军攻濡须口，相持一个多月，叹道“生子当如孙仲谋”，退兵。' },
  },
  {
    id: 'haiyun', name: '浮海求夷洲', who: ['sun'], days: 240, cost: 15, size: 10,
    what: '派一万甲士渡海寻找东方的大岛。路途凶险，带回来的人口不多，但这是对海洋的一次真实远航。',
    mods: { manpower: 0.03 },
    history: { years: { sun: 230 }, text: '230 年孙权派卫温、诸葛直率甲士万人浮海求夷洲（学界多认为即今台湾），带回数千人，士兵病死十之八九。' },
  },
  {
    id: 'longzhong', name: '隆中对', who: ['liubei'], days: 30, cost: 0, with: 'zhugeliang',
    what: '诸葛亮的规划：先取荆州、益州，西和诸戎，南抚夷越，外结孙权，等天下有变再两路北伐。孙权更愿意和你结盟。',
    mods: { legit: 1 },
    history: { years: { liubei: 207 }, text: '207 年冬，刘备三顾茅庐，诸葛亮在隆中提出“跨有荆益”的战略。' },
  },
  {
    id: 'nanzhong', name: '平定南中', who: ['liubei', 'liuzhang'], days: 180, cost: 12, hold: ['益州郡'],
    what: '南中各族叛乱不断。攻心为上，平定后让当地首领自治。南方四郡安定，兵源和粮食增加。',
    mods: { manpower: 0.15, order: 0.05 },
    history: { years: { liubei: 225 }, text: '225 年诸葛亮南征，平定南中，“军资所出，国以富饶”。七擒孟获不见于《三国志》正文，真假有争论。' },
  },
  {
    id: 'muniu', name: '木牛流马', who: ['liubei'], days: 150, cost: 8, with: 'zhugeliang',
    what: '后人多推测是一种在山路上运粮的独轮车。山地运粮的消耗减少 40%。',
    mods: { mountainSupply: 0.4 },
    history: { years: { liubei: 231 }, text: '231 年诸葛亮第四次北伐“以木牛运”，234 年第五次北伐“以流马运”。' },
  },
  {
    id: 'shujin', name: '蜀锦官营', who: ['liubei', 'liuzhang'], days: 120, cost: 6, hold: ['蜀郡'],
    what: '成都设锦官，织造蜀锦卖到魏、吴两国。国库收入增加，粮食 +12%。',
    mods: { grain: 0.12 },
    history: { years: { liubei: 221 }, text: '蜀汉“决敌之资，唯仰锦耳”，成都因此又叫“锦官城”。' },
  },
  {
    id: 'xuegong', name: '开立学官', who: ['liubiao', 'shixie'], days: 120, cost: 5,
    what: '收留北方逃来的学者，开办学校。民心更稳，人才愿意来。',
    mods: { order: 0.06, talent: 1 },
    history: { years: { liubiao: 195 }, text: '刘表在襄阳“起立学校，博求儒术”，宋忠等人在这里编定《五经章句》。' },
  },
  {
    id: 'yishe', name: '设立义舍', who: ['zhanglu'], days: 60, cost: 3,
    what: '在路边设义舍，放上米和肉，过路的人按需取用。百姓安居，流民涌入汉中。',
    mods: { order: 0.08, growth: 0.8 },
    history: { years: { zhanglu: 200 }, text: '张鲁“作义舍，置义米肉，行路者量腹取足”，关中流民数万家逃入汉中。' },
  },
  {
    id: 'qianghu', name: '结好羌胡', who: ['ma', 'yuan'], days: 90, cost: 4,
    what: '与塞外的羌、乌桓首领联姻结盟，换来他们的骑兵。骑兵作战更强。',
    mods: { cav: 0.15 },
    history: { years: { yuan: 200, ma: 200 }, text: '袁绍与乌桓单于结亲，乌桓骑兵为他作战；马超、韩遂的军中也有大批羌胡骑兵。' },
  },
  {
    id: 'shuijun', name: '大治水军', who: ['cao', 'sun', 'liubiao', 'liubei'], days: 120, cost: 10,
    what: '造楼船、艨艟、斗舰，挖池练兵。在有船的郡驻扎时，水军训练快一倍。',
    mods: { navy: 1 },
    history: { years: { cao: 208 }, text: '208 年正月，曹操在邺城挖玄武池操练水军，准备南征。' },
  },
]
export const policyById = new Map(POLICIES.map((p) => [p.id, p]))
