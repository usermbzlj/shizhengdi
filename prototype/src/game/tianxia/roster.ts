export type Trait = 'navy' | 'fire' | 'raid' | 'wall' | 'cavalry' | 'mountain' | 'supply' | 'wit'

export type Fid = 'cao' | 'yuan' | 'sun' | 'liubei' | 'liubiao' | 'liuzhang' | 'zhanglu' | 'ma' | 'gongsun' | 'shixie'

export interface FactionDef {
  id: Fid
  color: string
  /** keyframe faction ids that count as this faction */
  real: string[]
  /** rulers in order; the next living one inherits */
  heirs: string[]
  /** name of the state if the ruler declares himself king or emperor */
  state: string
  /** how a 12-year-old would recognise it */
  blurb: string
  /** real-history fate, shown at the end */
  fate: string
  /** AI temper: 0 cautious … 2 bold */
  temper: number
}

const m = (y: number, month: number) => y + (month - 0.5) / 12

export const FACTIONS: FactionDef[] = [
  {
    id: 'cao', color: '#6f9fdc', real: ['cao', 'wei'], heirs: ['caocao', 'caopi', 'caorui', 'caofang'],
    state: '魏', temper: 2,
    blurb: '天子在你手里，地盘在四战之地。北有袁绍，南有刘表孙氏。',
    fate: '曹操统一北方，220 年曹丕代汉称帝，国号魏。265 年魏被司马炎所代，成为晋。',
  },
  {
    id: 'yuan', color: '#b9a24e', real: ['yuanshao'], heirs: ['yuanshao', 'yuanshang', 'yuantan'],
    state: '燕', temper: 1,
    blurb: '河北四州，天下最强。兵多粮足，只差一场决胜。',
    fate: '200 年官渡大败，202 年袁绍病死，两个儿子相争，207 年袁氏被曹操彻底消灭。',
  },
  {
    id: 'sun', color: '#e07b62', real: ['sun', 'wu'], heirs: ['sunce', 'sunquan', 'sunliang', 'sunxiu', 'sunhao'],
    state: '吴', temper: 1,
    blurb: '江东六郡，背靠长江。北方的骑兵要过江，得先有船；你的船也很难打上岸。',
    fate: '赤壁之战与刘备联手击退曹操，219 年袭取荆州，229 年孙权称帝。280 年被晋所灭，是三国中最后灭亡的。',
  },
  {
    id: 'liubei', color: '#6fbf8e', real: ['liubei', 'shu'], heirs: ['liubei', 'liushan'],
    state: '汉', temper: 1,
    blurb: '手下有关羽张飞，却常常没有一寸立足之地。',
    fate: '赤壁后取荆州南部，214 年得益州，219 年得汉中、失荆州。221 年称帝，223 年病逝白帝城。263 年蜀汉被魏所灭。',
  },
  {
    id: 'liubiao', color: '#4fb7b1', real: ['liubiao'], heirs: ['liubiao', 'liucong'],
    state: '楚', temper: 0,
    blurb: '荆州富庶安定，北方的名士都逃难到你这里。',
    fate: '坐守荆州十几年，208 年病死，儿子刘琮向曹操投降。',
  },
  {
    id: 'liuzhang', color: '#9cc36a', real: ['liuzhang'], heirs: ['liuzhang'],
    state: '蜀', temper: 0,
    blurb: '益州四面是山，外人很难打进来。你也很难打出去。',
    fate: '211 年请刘备入蜀抵御张鲁，214 年刘备反过来围成都，刘璋投降。',
  },
  {
    id: 'zhanglu', color: '#cbbd7c', real: ['zhanglu'], heirs: ['zhanglu'],
    state: '汉宁', temper: 0,
    blurb: '五斗米道的师君，汉中盆地夹在秦岭和巴山之间。',
    fate: '据汉中近三十年，215 年曹操攻破阳平关，张鲁投降。',
  },
  {
    id: 'ma', color: '#c98e52', real: ['liang'], heirs: ['mateng', 'machao'],
    state: '凉', temper: 1,
    blurb: '凉州的羌汉骑兵，来去如风。可是地广人稀，粮食少。',
    fate: '208 年马腾入朝，211 年马超、韩遂起兵，潼关之战被曹操击败，最后投奔刘备。',
  },
  {
    id: 'gongsun', color: '#63aaa6', real: ['gongsun_liaodong'], heirs: ['gongsundu', 'gongsunkang', 'gongsunyuan'],
    state: '燕', temper: 0,
    blurb: '远在辽东。中原打得再凶，也要很久才打得到你这里。',
    fate: '割据辽东三代近五十年，238 年被司马懿攻灭。',
  },
  {
    id: 'shixie', color: '#bda865', real: ['shixie'], heirs: ['shixie', 'shihui'],
    state: '越', temper: 0,
    blurb: '最南边的交州，靠海通商，学者来这里避难。',
    fate: '士燮名义上归附孙权，226 年去世后，孙权派兵平定交州。',
  },
]
export const factionDef = new Map(FACTIONS.map((f) => [f.id, f]))

export function factionOfReal(real: string): Fid | null {
  return FACTIONS.find((f) => f.real.includes(real))?.id ?? null
}

export interface General {
  id: string
  name: string
  born: number
  died: number
  /** died by violence; in another history he may live on */
  killed?: boolean
  lead: number
  traits: Trait[]
  /** [from, faction, how]; 'defect' happens only when the old side is losing */
  serve: [number, Fid, ('join' | 'defect')?][]
  /** commandery he comes from; if his lord is gone he offers himself to whoever holds it */
  home: string
  /** one real line about him */
  line: string
}

const g = (
  id: string,
  name: string,
  born: number,
  died: number,
  lead: number,
  traits: Trait[],
  serve: General['serve'],
  home: string,
  line: string,
  killed = false,
): General => ({ id, name, born, died, lead, traits, serve, home, line, killed })

export const GENERALS: General[] = [
  // 曹
  g('caocao', '曹操', 155, m(220, 1), 9, ['wit', 'raid', 'supply'], [[0, 'cao']], '沛国', '“设使国家无有孤，不知当几人称帝，几人称王。”'),
  g('caopi', '曹丕', 187, m(226, 6), 5, ['wall'], [[205, 'cao']], '沛国', '220 年接受汉献帝禅让，建立魏。'),
  g('caorui', '曹叡', 204, m(239, 1), 5, ['wit'], [[222, 'cao']], '沛国', '魏明帝，修了许多宫殿。'),
  g('caofang', '曹芳', 232, 274, 2, [], [[239, 'cao']], '沛国', '八岁即位，后来被司马师废掉。'),
  g('xiahoudun', '夏侯惇', 160, m(220, 5), 7, ['wall', 'supply'], [[0, 'cao']], '沛国', '在陈留、颍川兴修水利，亲自背土筑堤。'),
  g('xiahouyuan', '夏侯渊', 165, m(219, 1), 8, ['raid', 'cavalry'], [[0, 'cao']], '沛国', '“三日五百，六日一千”，行军极快。219 年在定军山被黄忠所斩。', true),
  g('caoren', '曹仁', 168, m(223, 3), 8, ['wall'], [[0, 'cao']], '沛国', '守江陵一年、守樊城挡住关羽，是曹魏最可靠的守将。'),
  g('caohong', '曹洪', 170, 232, 6, [], [[0, 'cao']], '沛国', '官渡之战时留守大营。'),
  g('zhangliao', '张辽', 169, 222, 9, ['raid', 'cavalry'], [[0, 'cao']], '雁门郡', '215 年合肥之战，八百人冲进十万吴军。'),
  g('xuhuang', '徐晃', 170, 227, 8, ['raid'], [[0, 'cao']], '河东郡', '219 年击破关羽对樊城的包围。'),
  g('yujin', '于禁', 165, 221, 7, ['wall'], [[0, 'cao']], '泰山郡', '219 年汉水暴涨，七军被淹，向关羽投降。'),
  g('yuejin', '乐进', 170, 218, 7, ['raid'], [[0, 'cao']], '东郡', '每战常为先登。'),
  g('lidian', '李典', 174, 217, 6, ['supply'], [[0, 'cao']], '山阳', '官渡时为曹军运粮。'),
  g('xuchu', '许褚', 170, 230, 6, ['wall'], [[0, 'cao']], '沛国', '曹操的护卫，号“虎痴”。'),
  g('xunyu', '荀彧', 163, 212, 3, ['wit', 'supply'], [[0, 'cao']], '颍川', '劝曹操迎天子；官渡相持时写信让曹操坚持下去。'),
  g('guojia', '郭嘉', 170, 207, 3, ['wit'], [[0, 'cao']], '颍川', '随曹操北征乌桓，回军途中病死，年仅三十八。'),
  g('xunyou', '荀攸', 157, 214, 4, ['wit'], [[0, 'cao']], '颍川', '劝曹操烧乌巢。'),
  g('jiaxu', '贾诩', 147, 223, 4, ['wit'], [[0, 'cao']], '武威', '先后为李傕、张绣、曹操出谋划策，算无遗策。'),
  g('simayi', '司马懿', 179, m(251, 8), 9, ['wit', 'wall', 'supply'], [[208, 'cao']], '河内', '在五丈原坚守不战，拖到诸葛亮病逝。'),
  g('zhanghe', '张郃', 170, m(231, 6), 8, ['mountain'], [[0, 'yuan'], [m(200, 10), 'cao', 'defect']], '河间', '官渡时从袁绍投曹操；228 年在街亭击败马谡。231 年追击蜀军中箭而死。', true),
  g('caozhen', '曹真', 185, 231, 7, ['wall'], [[205, 'cao']], '沛国', '228 年在关中抵御诸葛亮第一次北伐。'),
  g('caoxiu', '曹休', 185, 228, 6, ['cavalry'], [[205, 'cao']], '沛国', '228 年在石亭被陆逊大败。'),
  g('manchong', '满宠', 170, 242, 7, ['wall'], [[0, 'cao']], '山阳', '230 年把合肥城向西移三十里，让吴国的船开不过去。'),
  g('haozhao', '郝昭', 185, 230, 7, ['wall'], [[215, 'cao']], '太原', '228 年十二月以千余人守陈仓二十多天，诸葛亮攻不下。'),
  g('guohuai', '郭淮', 185, 255, 7, ['mountain'], [[211, 'cao']], '太原', '在陇右与蜀汉相持几十年。'),
  g('dengai', '邓艾', 197, 264, 9, ['mountain', 'raid', 'supply'], [[235, 'cao']], '南阳郡', '263 年从阴平小道翻山七百里，奇袭成都。', true),
  g('zhonghui', '钟会', 225, 264, 6, ['wit'], [[250, 'cao']], '颍川', '263 年率大军攻蜀，被姜维挡在剑阁。', true),
  g('wenpin', '文聘', 170, 230, 7, ['wall', 'navy'], [[0, 'liubiao'], [m(208, 9), 'cao', 'defect']], '南阳郡', '守江夏几十年，孙权多次来攻，没有打下。'),
  g('pangde', '庞德', 170, m(219, 8), 7, ['cavalry'], [[0, 'ma'], [213, 'zhanglu', 'defect'], [m(215, 11), 'cao', 'defect']], '汉阳郡', '219 年出征前说“今年我不杀羽，羽当杀我”，被俘不降而死。', true),
  g('zangba', '臧霸', 165, 230, 6, [], [[0, 'cao']], '泰山郡', '替曹操镇守青州、徐州沿海。'),
  g('caozhang', '曹彰', 189, 223, 7, ['cavalry'], [[210, 'cao']], '沛国', '218 年北征乌桓，亲自冲阵。'),

  // 袁
  g('yuanshao', '袁绍', 154, m(202, 5), 6, ['cavalry'], [[0, 'yuan']], '汝南', '四世三公，曾是天下最强的诸侯。'),
  g('yanliang', '颜良', 160, m(200, 4), 8, ['cavalry'], [[0, 'yuan']], '魏郡', '围白马时被关羽刺于万众之中。', true),
  g('wenchou', '文丑', 160, m(200, 5), 8, ['cavalry'], [[0, 'yuan']], '魏郡', '在延津被曹操以辎重为饵击败身亡。', true),
  g('gaolan', '高览', 165, 215, 6, [], [[0, 'yuan'], [m(200, 10), 'cao', 'defect']], '魏郡', '与张郃一同投曹。'),
  g('jushou', '沮授', 160, m(200, 11), 4, ['wit', 'supply'], [[0, 'yuan']], '巨鹿', '劝袁绍不要急于决战，未被采纳。', true),
  g('tianfeng', '田丰', 160, m(200, 11), 3, ['wit'], [[0, 'yuan']], '巨鹿', '劝袁绍趁曹操东征时偷袭许都，被下狱。', true),
  g('xuyou', '许攸', 152, m(204, 6), 3, ['wit'], [[0, 'yuan'], [m(200, 10), 'cao', 'defect']], '南阳郡', '官渡相持时投奔曹操，说出了袁军囤粮的乌巢。', true),
  g('shenpei', '审配', 160, m(204, 8), 6, ['wall'], [[0, 'yuan']], '魏郡', '守邺城半年，城破不降。', true),
  g('yuantan', '袁谭', 175, m(205, 1), 5, [], [[0, 'yuan']], '汝南', '袁绍长子，与弟弟袁尚争位。', true),
  g('yuanshang', '袁尚', 178, 207, 5, ['cavalry'], [[0, 'yuan']], '汝南', '207 年逃到辽东，被公孙康斩首。', true),

  // 孙
  g('sunce', '孙策', 175, m(200, 4), 9, ['raid', 'cavalry'], [[0, 'sun']], '吴郡', '“小霸王”，几年间平定江东，二十六岁遇刺身亡。', true),
  g('sunquan', '孙权', 182, m(252, 4), 6, ['navy', 'wall'], [[0, 'sun']], '吴郡', '十九岁接掌江东，守了五十二年。'),
  g('zhouyu', '周瑜', 175, m(210, 12), 9, ['navy', 'fire'], [[0, 'sun']], '庐江', '208 年赤壁一把火，烧退曹操。'),
  g('lusu', '鲁肃', 172, 217, 6, ['wit', 'supply'], [[0, 'sun']], '下邳', '一直主张孙刘联合抗曹。'),
  g('lumeng', '吕蒙', 178, m(220, 1), 8, ['raid', 'navy'], [[0, 'sun']], '汝南', '219 年白衣渡江，偷袭荆州。'),
  g('luxun', '陆逊', 183, 245, 9, ['fire', 'wit'], [[203, 'sun']], '吴郡', '222 年夷陵火烧连营，大败刘备。'),
  g('ganning', '甘宁', 175, 220, 8, ['navy', 'raid'], [[m(208, 3), 'sun']], '巴郡', '百骑夜袭曹营。'),
  g('taishici', '太史慈', 166, 206, 8, ['cavalry'], [[0, 'sun']], '东莱郡', '与孙策在神亭单挑，后来归附。'),
  g('huanggai', '黄盖', 160, 215, 7, ['fire', 'navy'], [[0, 'sun']], '零陵', '赤壁时献火攻之计，诈降点火。'),
  g('chengpu', '程普', 155, 215, 7, ['navy'], [[0, 'sun']], '右北平郡', '孙坚时代的老将，赤壁时与周瑜分任左右督。'),
  g('handang', '韩当', 160, 227, 6, ['navy'], [[0, 'sun']], '辽西郡', '跟随孙氏三代。'),
  g('zhoutai', '周泰', 165, 225, 7, ['wall'], [[0, 'sun']], '九江郡', '身上十二处伤，都是为了救孙权。'),
  g('lingtong', '凌统', 189, 217, 7, ['navy'], [[204, 'sun']], '吴郡', '合肥之战拼死护送孙权撤退。'),
  g('zhuran', '朱然', 182, 249, 7, ['wall'], [[205, 'sun']], '丹阳', '223 年守江陵半年，挡住魏军。'),
  g('zhuhuan', '朱桓', 177, 238, 7, ['wall'], [[205, 'sun']], '吴郡', '濡须口以少胜多。'),
  g('dingfeng', '丁奉', 195, 271, 7, ['raid'], [[215, 'sun']], '庐江', '雪中奋短兵，大破魏军。'),
  g('lukang', '陆抗', 226, 274, 8, ['wall'], [[245, 'sun']], '吴郡', '陆逊之子，独力撑住吴国西线。'),
  g('sunliang', '孙亮', 243, 260, 2, [], [[250, 'sun']], '吴郡', '孙权幼子，十岁即位。'),
  g('sunxiu', '孙休', 235, 264, 3, [], [[250, 'sun']], '吴郡', '吴景帝。'),
  g('sunhao', '孙皓', 242, 284, 3, [], [[258, 'sun']], '吴郡', '吴国最后一个皇帝，280 年降晋。'),

  // 刘备
  g('liubei', '刘备', 161, m(223, 4), 7, ['wit'], [[0, 'liubei']], '涿郡', '屡败屡战，五十岁后才得到荆州、益州。'),
  g('guanyu', '关羽', 160, m(220, 1), 9, ['navy', 'cavalry'], [[0, 'liubei'], [200, 'cao'], [m(200, 5), 'liubei']], '河东郡', '219 年水淹七军，威震华夏；同年被东吴袭取荆州，败走麦城。', true),
  g('zhangfei', '张飞', 165, m(221, 6), 8, ['raid'], [[0, 'liubei']], '涿郡', '长坂据水断桥，瞋目横矛，曹军不敢近。221 年被部下所杀。', true),
  g('zhaoyun', '赵云', 168, 229, 8, ['cavalry', 'wall'], [[0, 'liubei']], '常山', '长坂坡怀抱阿斗突围。'),
  g('zhugeliang', '诸葛亮', 181, m(234, 8), 8, ['wit', 'supply'], [[m(207, 10), 'liubei']], '琅邪国', '隆中对；造木牛流马运粮；五次北伐，病逝五丈原。'),
  g('pangtong', '庞统', 179, m(214, 5), 5, ['wit', 'raid'], [[209, 'liubei']], '南郡', '“卧龙凤雏”的凤雏，随刘备入蜀，在雒城中流矢而死。', true),
  g('fazheng', '法正', 176, 220, 5, ['wit'], [[0, 'liuzhang'], [211, 'liubei', 'defect']], '右扶风', '劝刘备夺汉中，定军山之战的谋主。'),
  g('huangzhong', '黄忠', 150, 220, 8, ['raid'], [[0, 'liubiao'], [m(208, 12), 'liubei', 'defect']], '南阳郡', '219 年定军山斩夏侯渊。'),
  g('weiyan', '魏延', 175, m(234, 8), 8, ['raid', 'mountain'], [[209, 'liubei']], '南阳郡', '镇守汉中十几年；提出过“子午谷奇谋”。', true),
  g('machao', '马超', 176, 222, 8, ['cavalry'], [[0, 'ma'], [213, 'zhanglu', 'defect'], [m(214, 5), 'liubei', 'defect']], '右扶风', '潼关之战差点擒住曹操。'),
  g('madai', '马岱', 180, 240, 6, ['cavalry'], [[0, 'ma'], [m(214, 5), 'liubei', 'defect']], '右扶风', '马超的堂弟，诸葛亮死后斩杀魏延。'),
  g('jiangwei', '姜维', 202, 264, 8, ['mountain', 'wall'], [[m(228, 2), 'liubei', 'defect']], '汉阳郡', '原是魏国天水郡的将领，228 年投降诸葛亮，后来多次北伐，在剑阁挡住钟会。', true),
  g('wangping', '王平', 190, 248, 7, ['mountain', 'wall'], [[219, 'liubei']], '巴郡', '街亭之战劝马谡不要上山。'),
  g('masu', '马谡', 190, m(228, 6), 4, ['wit'], [[209, 'liubei']], '南郡', '228 年失街亭。《诸葛亮传》说“戮谡以谢众”，《马良传》说他“下狱物故”，两说并存。', true),
  g('yanyan', '严颜', 155, 220, 6, ['wall'], [[0, 'liuzhang'], [m(214, 5), 'liubei', 'defect']], '巴郡', '“但有断头将军，无有降将军。”'),
  g('liyan', '李严', 180, 234, 6, ['supply'], [[0, 'liuzhang'], [m(214, 5), 'liubei', 'defect']], '南阳郡', '北伐时负责运粮，因粮运不继被废。'),
  g('liushan', '刘禅', 207, 271, 2, [], [[220, 'liubei']], '涿郡', '“此间乐，不思蜀。”'),

  // 刘表
  g('liubiao', '刘表', 142, m(208, 8), 5, ['wall'], [[0, 'liubiao']], '山阳', '“八俊”之一，荆州在他手中二十年无大战。'),
  g('caimao', '蔡瑁', 165, 220, 5, ['navy'], [[0, 'liubiao'], [m(208, 9), 'cao', 'defect']], '南郡', '荆州水军的统领。'),
  g('huangzu', '黄祖', 150, m(208, 3), 6, ['navy', 'wall'], [[0, 'liubiao']], '江夏', '守江夏，射杀孙坚，208 年被孙权攻杀。', true),
  g('liucong', '刘琮', 190, 240, 2, [], [[205, 'liubiao']], '山阳', '刘表次子，208 年曹军未到就投降了。'),

  // 刘璋
  g('liuzhang', '刘璋', 162, 219, 3, ['wall'], [[0, 'liuzhang']], '江夏', '“温仁”但“暗弱”，最后开城投降刘备。'),
  g('zhangren', '张任', 170, m(213, 6), 7, ['wall'], [[0, 'liuzhang']], '蜀郡', '雁桥兵败被擒，不降被杀。守雒城一年的是刘循。', true),
  g('huangquan', '黄权', 175, 240, 6, ['mountain'], [[0, 'liuzhang'], [m(214, 5), 'liubei', 'defect']], '巴郡', '劝刘备先夺汉中。'),

  // 张鲁
  g('zhanglu', '张鲁', 165, 216, 4, ['wall'], [[0, 'zhanglu']], '沛国', '五斗米道在路上设“义舍”，放米肉给行人免费吃。'),
  g('yanpu', '阎圃', 170, 230, 3, ['wit'], [[0, 'zhanglu']], '巴郡', '劝张鲁不要称王。'),

  // 凉州
  g('mateng', '马腾', 156, 212, 6, ['cavalry'], [[0, 'ma']], '右扶风', '208 年入朝，全家留在邺城。'),
  g('hansui', '韩遂', 150, 215, 6, ['cavalry', 'mountain'], [[0, 'ma']], '金城郡', '在凉州割据三十多年。'),

  // 辽东
  g('gongsundu', '公孙度', 150, 204, 5, [], [[0, 'gongsun']], '玄菟郡', '东伐高句丽，西击乌桓，称霸辽东。'),
  g('gongsunkang', '公孙康', 175, 221, 5, [], [[0, 'gongsun']], '玄菟郡', '斩袁尚、袁熙，把首级送给曹操。'),
  g('gongsunyuan', '公孙渊', 195, m(238, 8), 5, [], [[0, 'gongsun']], '玄菟郡', '自立为燕王，被司马懿攻灭。', true),

  // 交州
  g('shixie', '士燮', 137, 226, 4, ['wall'], [[0, 'shixie']], '苍梧郡', '在交州四十年，中原学者纷纷来避难。'),
  g('shihui', '士徽', 175, 227, 3, [], [[0, 'shixie']], '苍梧郡', '士燮之子，被吕岱诱杀。', true),
]
export const generalById = new Map(GENERALS.map((x) => [x.id, x]))

/** How a commander behaves when the order leaves him room. Only men with a settled reputation. */
export type Temper = 'rash' | 'steady' | 'proud' | 'cautious'
export const TEMPER: Record<string, Temper> = {
  zhangfei: 'rash', machao: 'rash', xuchu: 'rash', yanliang: 'rash', wenchou: 'rash', ganning: 'rash', weiyan: 'rash', sunce: 'rash', taishici: 'rash',
  zhaoyun: 'steady', xuhuang: 'steady', zhanghe: 'steady', yujin: 'steady', luxun: 'steady', lumeng: 'steady', huangzhong: 'steady', zhangliao: 'steady',
  guanyu: 'proud', masu: 'proud',
  caoren: 'cautious', manchong: 'cautious', simayi: 'cautious', chengpu: 'cautious', zhangren: 'cautious', haozhao: 'cautious', caozhen: 'cautious',
}

/** In this history a man killed in battle may live on; give him a natural span. */
export function naturalEnd(gen: General) {
  return gen.killed ? Math.max(gen.died + 8, gen.born + 66) : gen.died
}

