# 东汉至西晋初郡级名录（140年基准，184–280年变动）

基准是《续汉书·郡国志》所载永和五年（140）十三州部、105个郡国属国。治所取志文“凡县名先书者，郡所治也”。各郡城数相加为 1181，志末总叙作1180，差1城，原因未强行抹平。阜陵国永和时或仍在，志不载，这里也不补进105之数。

坐标是 WGS84 十进制度，取复旦/哈佛 CHGIS（TGAZ）对应时间片，保留3位小数。没有可靠点的条目，`lng`/`lat` 写 `null`，不拿现代县城中心充数。郡点代替县点、止年写作0、或与另一时间片不一致时，写在该条 `note`。

184–280年的变动只收会改地图的郡级新设、改名、省并和州治迁移。短命郡若连治所坐标都没有，仍列出，但坐标留空。

```json
{
 "commanderies": [
  {
   "id": "henan_yin",
   "name": "河南尹",
   "province": "司隶",
   "type": "尹",
   "seat": "雒阳",
   "seat_modern": "河南省洛阳市东汉魏故城",
   "lng": 112.596,
   "lat": 34.732,
   "counties": 21,
   "note": "永和五年户口即系于本尹。点为汉魏洛阳故城。"
  },
  {
   "id": "henei",
   "name": "河内郡",
   "province": "司隶",
   "type": "郡",
   "seat": "怀",
   "seat_modern": "河南省焦作市武陟县西南",
   "lng": 113.33,
   "lat": 35.09,
   "counties": 18,
   "note": ""
  },
  {
   "id": "hedong",
   "name": "河东郡",
   "province": "司隶",
   "type": "郡",
   "seat": "安邑",
   "seat_modern": "山西省运城市夏县西北",
   "lng": 111.16,
   "lat": 35.18,
   "counties": 20,
   "note": ""
  },
  {
   "id": "hongnong",
   "name": "弘农郡",
   "province": "司隶",
   "type": "郡",
   "seat": "弘农",
   "seat_modern": "河南省三门峡市灵宝市北",
   "lng": 110.929,
   "lat": 34.655,
   "counties": 9,
   "note": ""
  },
  {
   "id": "jingzhao_yin",
   "name": "京兆尹",
   "province": "司隶",
   "type": "尹",
   "seat": "长安",
   "seat_modern": "陕西省西安市西北汉长安城",
   "lng": 108.937,
   "lat": 34.318,
   "counties": 10,
   "note": "取CHGIS长安县23–582年点。"
  },
  {
   "id": "zuopingyi",
   "name": "左冯翊",
   "province": "司隶",
   "type": "郡",
   "seat": "高陵",
   "seat_modern": "陕西省西安市高陵区",
   "lng": 109.077,
   "lat": 34.531,
   "counties": 13,
   "note": "三辅，不称郡，地位视郡。"
  },
  {
   "id": "youfufeng",
   "name": "右扶风",
   "province": "司隶",
   "type": "郡",
   "seat": "槐里",
   "seat_modern": "陕西省咸阳市兴平市",
   "lng": 108.502,
   "lat": 34.263,
   "counties": 15,
   "note": "三辅，不称郡，地位视郡。"
  },
  {
   "id": "yingchuan",
   "name": "颍川郡",
   "province": "豫州",
   "type": "郡",
   "seat": "阳翟",
   "seat_modern": "河南省禹州市",
   "lng": 113.467,
   "lat": 34.162,
   "counties": 17,
   "note": ""
  },
  {
   "id": "runan",
   "name": "汝南郡",
   "province": "豫州",
   "type": "郡",
   "seat": "平舆",
   "seat_modern": "河南省驻马店市平舆县",
   "lng": 114.567,
   "lat": 33.156,
   "counties": 37,
   "note": ""
  },
  {
   "id": "liang_guo",
   "name": "梁国",
   "province": "豫州",
   "type": "王国",
   "seat": "下邑",
   "seat_modern": "安徽省宿州市砀山县东",
   "lng": 116.34,
   "lat": 34.428,
   "counties": 9,
   "note": "《郡国志》首县为下邑，按“先书者郡所治”作治所。传统国都在睢阳（今商丘）。"
  },
  {
   "id": "pei_guo",
   "name": "沛国",
   "province": "豫州",
   "type": "王国",
   "seat": "相",
   "seat_modern": "安徽省淮北市濉溪县西北",
   "lng": 116.79,
   "lat": 33.994,
   "counties": 21,
   "note": "豫州刺史治在属县谯，不是相县。"
  },
  {
   "id": "chen_guo",
   "name": "陈国",
   "province": "豫州",
   "type": "王国",
   "seat": "陈",
   "seat_modern": "河南省周口市淮阳区",
   "lng": 114.882,
   "lat": 33.734,
   "counties": 9,
   "note": ""
  },
  {
   "id": "lu_guo",
   "name": "鲁国",
   "province": "豫州",
   "type": "王国",
   "seat": "鲁",
   "seat_modern": "山东省曲阜市",
   "lng": 116.987,
   "lat": 35.599,
   "counties": 6,
   "note": "光武时由徐州改属豫州。"
  },
  {
   "id": "wei_jun",
   "name": "魏郡",
   "province": "冀州",
   "type": "郡",
   "seat": "邺",
   "seat_modern": "河北省邯郸市临漳县西南邺城",
   "lng": 114.412,
   "lat": 36.272,
   "counties": 15,
   "note": ""
  },
  {
   "id": "julu",
   "name": "钜鹿郡",
   "province": "冀州",
   "type": "郡",
   "seat": "廮陶",
   "seat_modern": "河北省邢台市宁晋县",
   "lng": 114.916,
   "lat": 37.587,
   "counties": 15,
   "note": "CHGIS廮陶县点止年写作0，坐标仍是汉县所在。"
  },
  {
   "id": "changshan",
   "name": "常山国",
   "province": "冀州",
   "type": "王国",
   "seat": "元氏",
   "seat_modern": "河北省石家庄市元氏县西北",
   "lng": 114.415,
   "lat": 37.817,
   "counties": 13,
   "note": "冀州刺史治在属县高邑。县点止年写作0。"
  },
  {
   "id": "zhongshan",
   "name": "中山国",
   "province": "冀州",
   "type": "王国",
   "seat": "卢奴",
   "seat_modern": "河北省定州市",
   "lng": 114.975,
   "lat": 38.52,
   "counties": 13,
   "note": "县点止年写作0。"
  },
  {
   "id": "anping",
   "name": "安平国",
   "province": "冀州",
   "type": "王国",
   "seat": "信都",
   "seat_modern": "河北省衡水市冀州区",
   "lng": 115.564,
   "lat": 37.566,
   "counties": 13,
   "note": ""
  },
  {
   "id": "hejian",
   "name": "河间国",
   "province": "冀州",
   "type": "王国",
   "seat": "乐成",
   "seat_modern": "河北省沧州市献县东南",
   "lng": 116.213,
   "lat": 38.145,
   "counties": 11,
   "note": ""
  },
  {
   "id": "qinghe",
   "name": "清河国",
   "province": "冀州",
   "type": "王国",
   "seat": "甘陵",
   "seat_modern": "山东省临清市东北",
   "lng": 115.732,
   "lat": 36.761,
   "counties": 7,
   "note": "140年国名仍是清河，县已名甘陵。建和二年（148）国改名甘陵。坐标用甘陵国点。"
  },
  {
   "id": "zhao_guo",
   "name": "赵国",
   "province": "冀州",
   "type": "王国",
   "seat": "邯郸",
   "seat_modern": "河北省邯郸市",
   "lng": 114.472,
   "lat": 36.593,
   "counties": 5,
   "note": "邯郸县点止年写作0，与后世同坐标。"
  },
  {
   "id": "bohai",
   "name": "勃海郡",
   "province": "冀州",
   "type": "郡",
   "seat": "南皮",
   "seat_modern": "河北省沧州市南皮县",
   "lng": 116.697,
   "lat": 38.038,
   "counties": 8,
   "note": "用字从《郡国志》作勃海。"
  },
  {
   "id": "chenliu",
   "name": "陈留郡",
   "province": "兖州",
   "type": "郡",
   "seat": "陈留",
   "seat_modern": "河南省开封市祥符区陈留",
   "lng": 114.525,
   "lat": 34.673,
   "counties": 17,
   "note": ""
  },
  {
   "id": "dong_jun",
   "name": "东郡",
   "province": "兖州",
   "type": "郡",
   "seat": "濮阳",
   "seat_modern": "河南省濮阳市西南",
   "lng": 115.03,
   "lat": 35.76,
   "counties": 15,
   "note": "CHGIS无东汉濮阳县点。坐标与地图郡治相同，约在今濮阳西南。"
  },
  {
   "id": "dongping",
   "name": "东平国",
   "province": "兖州",
   "type": "王国",
   "seat": "无盐",
   "seat_modern": "山东省泰安市东平县",
   "lng": 116.496,
   "lat": 35.907,
   "counties": 7,
   "note": ""
  },
  {
   "id": "rencheng",
   "name": "任城国",
   "province": "兖州",
   "type": "王国",
   "seat": "任城",
   "seat_modern": "山东省济宁市",
   "lng": 116.695,
   "lat": 35.236,
   "counties": 3,
   "note": ""
  },
  {
   "id": "taishan",
   "name": "泰山郡",
   "province": "兖州",
   "type": "郡",
   "seat": "奉高",
   "seat_modern": "山东省泰安市",
   "lng": 117.392,
   "lat": 36.208,
   "counties": 12,
   "note": ""
  },
  {
   "id": "jibei",
   "name": "济北国",
   "province": "兖州",
   "type": "王国",
   "seat": "卢",
   "seat_modern": "山东省济南市长清区",
   "lng": 116.634,
   "lat": 36.413,
   "counties": 5,
   "note": ""
  },
  {
   "id": "shanyang",
   "name": "山阳郡",
   "province": "兖州",
   "type": "郡",
   "seat": "昌邑",
   "seat_modern": "山东省菏泽市巨野县南",
   "lng": 116.124,
   "lat": 35.143,
   "counties": 10,
   "note": "兖州刺史治。"
  },
  {
   "id": "jiyin",
   "name": "济阴郡",
   "province": "兖州",
   "type": "郡",
   "seat": "定陶",
   "seat_modern": "山东省菏泽市定陶区西北",
   "lng": 115.552,
   "lat": 35.089,
   "counties": 11,
   "note": ""
  },
  {
   "id": "donghai",
   "name": "东海郡",
   "province": "徐州",
   "type": "郡",
   "seat": "郯",
   "seat_modern": "山东省临沂市郯城县",
   "lng": 118.335,
   "lat": 34.621,
   "counties": 13,
   "note": "140年是郡不是国。徐州刺史治。"
  },
  {
   "id": "langya",
   "name": "琅邪国",
   "province": "徐州",
   "type": "王国",
   "seat": "开阳",
   "seat_modern": "山东省临沂市北",
   "lng": 118.389,
   "lat": 35.154,
   "counties": 13,
   "note": ""
  },
  {
   "id": "pengcheng",
   "name": "彭城国",
   "province": "徐州",
   "type": "王国",
   "seat": "彭城",
   "seat_modern": "江苏省徐州市",
   "lng": 117.188,
   "lat": 34.27,
   "counties": 8,
   "note": ""
  },
  {
   "id": "guangling",
   "name": "广陵郡",
   "province": "徐州",
   "type": "郡",
   "seat": "广陵",
   "seat_modern": "江苏省扬州市",
   "lng": 119.437,
   "lat": 32.391,
   "counties": 11,
   "note": "《郡国志》十一城。另说十二城，是把已省的海陵算入。"
  },
  {
   "id": "xiapi",
   "name": "下邳国",
   "province": "徐州",
   "type": "王国",
   "seat": "下邳",
   "seat_modern": "江苏省徐州市睢宁县古邳",
   "lng": 117.887,
   "lat": 34.118,
   "counties": 17,
   "note": "用下邳县点。CHGIS另有下邳国点117.963, 34.471。"
  },
  {
   "id": "jinan",
   "name": "济南国",
   "province": "青州",
   "type": "王国",
   "seat": "东平陵",
   "seat_modern": "山东省济南市章丘区",
   "lng": 117.522,
   "lat": 36.712,
   "counties": 10,
   "note": ""
  },
  {
   "id": "pingyuan",
   "name": "平原郡",
   "province": "青州",
   "type": "郡",
   "seat": "平原",
   "seat_modern": "山东省德州市平原县",
   "lng": 116.438,
   "lat": 37.021,
   "counties": 9,
   "note": "140年是郡。坐标用平原郡点。"
  },
  {
   "id": "lean",
   "name": "乐安国",
   "province": "青州",
   "type": "王国",
   "seat": "临济",
   "seat_modern": "山东省淄博市高青县",
   "lng": 117.949,
   "lat": 37.098,
   "counties": 9,
   "note": ""
  },
  {
   "id": "beihai",
   "name": "北海国",
   "province": "青州",
   "type": "王国",
   "seat": "剧",
   "seat_modern": "山东省潍坊市昌乐县西",
   "lng": 118.775,
   "lat": 36.657,
   "counties": 18,
   "note": ""
  },
  {
   "id": "donglai",
   "name": "东莱郡",
   "province": "青州",
   "type": "郡",
   "seat": "黄",
   "seat_modern": "山东省烟台市龙口市",
   "lng": 120.522,
   "lat": 37.647,
   "counties": 13,
   "note": ""
  },
  {
   "id": "qi_guo",
   "name": "齐国",
   "province": "青州",
   "type": "王国",
   "seat": "临菑",
   "seat_modern": "山东省淄博市临淄区",
   "lng": 118.37,
   "lat": 36.864,
   "counties": 6,
   "note": "青州刺史治。用字从《郡国志》作临菑。"
  },
  {
   "id": "nanyang",
   "name": "南阳郡",
   "province": "荆州",
   "type": "郡",
   "seat": "宛",
   "seat_modern": "河南省南阳市",
   "lng": 112.535,
   "lat": 33.002,
   "counties": 37,
   "note": ""
  },
  {
   "id": "nan_jun",
   "name": "南郡",
   "province": "荆州",
   "type": "郡",
   "seat": "江陵",
   "seat_modern": "湖北省荆州市荆州区",
   "lng": 112.191,
   "lat": 30.35,
   "counties": 17,
   "note": ""
  },
  {
   "id": "jiangxia",
   "name": "江夏郡",
   "province": "荆州",
   "type": "郡",
   "seat": "西陵",
   "seat_modern": "湖北省武汉市新洲区",
   "lng": 114.78,
   "lat": 30.846,
   "counties": 14,
   "note": ""
  },
  {
   "id": "lingling",
   "name": "零陵郡",
   "province": "荆州",
   "type": "郡",
   "seat": "泉陵",
   "seat_modern": "湖南省永州市",
   "lng": 111.613,
   "lat": 26.21,
   "counties": 13,
   "note": ""
  },
  {
   "id": "guiyang",
   "name": "桂阳郡",
   "province": "荆州",
   "type": "郡",
   "seat": "郴",
   "seat_modern": "湖南省郴州市",
   "lng": 113.025,
   "lat": 25.803,
   "counties": 11,
   "note": ""
  },
  {
   "id": "wuling",
   "name": "武陵郡",
   "province": "荆州",
   "type": "郡",
   "seat": "临沅",
   "seat_modern": "湖南省常德市",
   "lng": 111.691,
   "lat": 29.035,
   "counties": 12,
   "note": "荆州刺史治在属县汉寿，不是临沅。"
  },
  {
   "id": "changsha",
   "name": "长沙郡",
   "province": "荆州",
   "type": "郡",
   "seat": "临湘",
   "seat_modern": "湖南省长沙市",
   "lng": 112.978,
   "lat": 28.198,
   "counties": 13,
   "note": "140年是郡。"
  },
  {
   "id": "jiujiang",
   "name": "九江郡",
   "province": "扬州",
   "type": "郡",
   "seat": "阴陵",
   "seat_modern": "安徽省滁州市凤阳县",
   "lng": 117.444,
   "lat": 32.636,
   "counties": 14,
   "note": "扬州刺史治在属县历阳，不是阴陵。"
  },
  {
   "id": "danyang",
   "name": "丹阳郡",
   "province": "扬州",
   "type": "郡",
   "seat": "宛陵",
   "seat_modern": "安徽省宣城市",
   "lng": 118.743,
   "lat": 30.947,
   "counties": 16,
   "note": "用字从《郡国志》作丹阳。"
  },
  {
   "id": "lujiang",
   "name": "庐江郡",
   "province": "扬州",
   "type": "郡",
   "seat": "舒",
   "seat_modern": "安徽省合肥市庐江县西南",
   "lng": 117.174,
   "lat": 31.189,
   "counties": 14,
   "note": ""
  },
  {
   "id": "kuaiji",
   "name": "会稽郡",
   "province": "扬州",
   "type": "郡",
   "seat": "山阴",
   "seat_modern": "浙江省绍兴市",
   "lng": 120.578,
   "lat": 30.005,
   "counties": 14,
   "note": "《郡国志》十四城，含东部侯国。"
  },
  {
   "id": "wu_jun",
   "name": "吴郡",
   "province": "扬州",
   "type": "郡",
   "seat": "吴",
   "seat_modern": "江苏省苏州市",
   "lng": 120.619,
   "lat": 31.313,
   "counties": 13,
   "note": ""
  },
  {
   "id": "yuzhang",
   "name": "豫章郡",
   "province": "扬州",
   "type": "郡",
   "seat": "南昌",
   "seat_modern": "江西省南昌市",
   "lng": 115.898,
   "lat": 28.675,
   "counties": 21,
   "note": ""
  },
  {
   "id": "hanzhong",
   "name": "汉中郡",
   "province": "益州",
   "type": "郡",
   "seat": "南郑",
   "seat_modern": "陕西省汉中市",
   "lng": 107.046,
   "lat": 33.076,
   "counties": 9,
   "note": ""
  },
  {
   "id": "ba_jun",
   "name": "巴郡",
   "province": "益州",
   "type": "郡",
   "seat": "江州",
   "seat_modern": "重庆市江北一带",
   "lng": 106.556,
   "lat": 29.58,
   "counties": 14,
   "note": "140年点。建安六年后治所南移，CHGIS作106.559, 29.560。"
  },
  {
   "id": "guanghan",
   "name": "广汉郡",
   "province": "益州",
   "type": "郡",
   "seat": "雒",
   "seat_modern": "四川省德阳市广汉市",
   "lng": 104.306,
   "lat": 30.995,
   "counties": 11,
   "note": "益州刺史治。"
  },
  {
   "id": "shu_jun",
   "name": "蜀郡",
   "province": "益州",
   "type": "郡",
   "seat": "成都",
   "seat_modern": "四川省成都市",
   "lng": 104.078,
   "lat": 30.65,
   "counties": 11,
   "note": ""
  },
  {
   "id": "jianwei",
   "name": "犍为郡",
   "province": "益州",
   "type": "郡",
   "seat": "武阳",
   "seat_modern": "四川省眉山市彭山区",
   "lng": 103.92,
   "lat": 30.293,
   "counties": 9,
   "note": ""
  },
  {
   "id": "zangke",
   "name": "牂牁郡",
   "province": "益州",
   "type": "郡",
   "seat": "故且兰",
   "seat_modern": "贵州省黔南州贵定、福泉一带",
   "lng": 107.755,
   "lat": 26.802,
   "counties": 16,
   "note": ""
  },
  {
   "id": "yuexi",
   "name": "越巂郡",
   "province": "益州",
   "type": "郡",
   "seat": "邛都",
   "seat_modern": "四川省凉山州西昌市东南",
   "lng": 102.267,
   "lat": 27.9,
   "counties": 14,
   "note": "无东汉县点。用越巂郡点，其止年只到公元8年。"
  },
  {
   "id": "yizhou_jun",
   "name": "益州郡",
   "province": "益州",
   "type": "郡",
   "seat": "滇池",
   "seat_modern": "云南省昆明市晋宁区",
   "lng": 102.743,
   "lat": 24.703,
   "counties": 17,
   "note": ""
  },
  {
   "id": "yongchang",
   "name": "永昌郡",
   "province": "益州",
   "type": "郡",
   "seat": "不韦",
   "seat_modern": "云南省保山市",
   "lng": 99.258,
   "lat": 25.155,
   "counties": 8,
   "note": ""
  },
  {
   "id": "guanghan_shuguo",
   "name": "广汉属国",
   "province": "益州",
   "type": "属国",
   "seat": "阴平道",
   "seat_modern": "甘肃省陇南市文县",
   "lng": 104.678,
   "lat": 32.948,
   "counties": 3,
   "note": "无阴平道点，用后来阴平郡点。"
  },
  {
   "id": "shu_shuguo",
   "name": "蜀郡属国",
   "province": "益州",
   "type": "属国",
   "seat": "汉嘉",
   "seat_modern": "四川省雅安市芦山县",
   "lng": 102.927,
   "lat": 30.16,
   "counties": 4,
   "note": ""
  },
  {
   "id": "jianwei_shuguo",
   "name": "犍为属国",
   "province": "益州",
   "type": "属国",
   "seat": "朱提",
   "seat_modern": "云南省昭通市",
   "lng": 103.715,
   "lat": 27.343,
   "counties": 2,
   "note": ""
  },
  {
   "id": "longxi",
   "name": "陇西郡",
   "province": "凉州",
   "type": "郡",
   "seat": "狄道",
   "seat_modern": "甘肃省定西市临洮县",
   "lng": 103.858,
   "lat": 35.379,
   "counties": 11,
   "note": ""
  },
  {
   "id": "hanyang",
   "name": "汉阳郡",
   "province": "凉州",
   "type": "郡",
   "seat": "冀",
   "seat_modern": "甘肃省天水市甘谷县",
   "lng": 105.389,
   "lat": 34.738,
   "counties": 13,
   "note": "郡治冀。凉州刺史治在属县陇。"
  },
  {
   "id": "wudu",
   "name": "武都郡",
   "province": "凉州",
   "type": "郡",
   "seat": "下辨",
   "seat_modern": "甘肃省陇南市成县、西和一带",
   "lng": 105.215,
   "lat": 33.953,
   "counties": 7,
   "note": "用武都郡140–219年点。另有24–139年点105.783, 33.787，更近今成县。"
  },
  {
   "id": "jincheng",
   "name": "金城郡",
   "province": "凉州",
   "type": "郡",
   "seat": "允吾",
   "seat_modern": "甘肃省临夏州永靖县西北",
   "lng": 103.295,
   "lat": 36.09,
   "counties": 10,
   "note": "无允吾县点，用金城郡点。"
  },
  {
   "id": "anding",
   "name": "安定郡",
   "province": "凉州",
   "type": "郡",
   "seat": "临泾",
   "seat_modern": "甘肃省庆阳市镇原县东南",
   "lng": 107.202,
   "lat": 35.618,
   "counties": 8,
   "note": "用安定郡129–141年点。"
  },
  {
   "id": "beidi",
   "name": "北地郡",
   "province": "凉州",
   "type": "郡",
   "seat": "富平",
   "seat_modern": "宁夏吴忠、青铜峡一带",
   "lng": 106.137,
   "lat": 37.928,
   "counties": 6,
   "note": "用北地郡129–141年点。永和六年（141）侨置左冯翊，志仍列故县。"
  },
  {
   "id": "wuwei",
   "name": "武威郡",
   "province": "凉州",
   "type": "郡",
   "seat": "姑臧",
   "seat_modern": "甘肃省武威市",
   "lng": 102.635,
   "lat": 37.927,
   "counties": 14,
   "note": "无姑臧县点，用武威郡点。十四城；左骑千人官作一城。"
  },
  {
   "id": "zhangye",
   "name": "张掖郡",
   "province": "凉州",
   "type": "郡",
   "seat": "觻得",
   "seat_modern": "甘肃省张掖市",
   "lng": 100.403,
   "lat": 38.963,
   "counties": 8,
   "note": ""
  },
  {
   "id": "jiuquan",
   "name": "酒泉郡",
   "province": "凉州",
   "type": "郡",
   "seat": "福禄",
   "seat_modern": "甘肃省酒泉市",
   "lng": 98.511,
   "lat": 39.745,
   "counties": 9,
   "note": "用字从《郡国志》作福禄。坐标用酒泉郡140年起的点。"
  },
  {
   "id": "dunhuang",
   "name": "敦煌郡",
   "province": "凉州",
   "type": "郡",
   "seat": "敦煌",
   "seat_modern": "甘肃省敦煌市",
   "lng": 94.62,
   "lat": 40.139,
   "counties": 6,
   "note": ""
  },
  {
   "id": "zhangye_shuguo",
   "name": "张掖属国",
   "province": "凉州",
   "type": "属国",
   "seat": "候官",
   "seat_modern": "今地无考",
   "lng": 101.1,
   "lat": 38.6,
   "counties": 5,
   "note": "候官不是普通县城，福建候官与此无关。今地无考，坐标是地图上的约定位，在张掖与居延之间。"
  },
  {
   "id": "juyan_shuguo",
   "name": "张掖居延属国",
   "province": "凉州",
   "type": "属国",
   "seat": "居延",
   "seat_modern": "内蒙古阿拉善盟额济纳旗东南",
   "lng": 101.163,
   "lat": 41.836,
   "counties": 1,
   "note": "CHGIS在108–194年缺切片，前后两点相同，故沿用。"
  },
  {
   "id": "shangdang",
   "name": "上党郡",
   "province": "并州",
   "type": "郡",
   "seat": "长子",
   "seat_modern": "山西省长治市长子县",
   "lng": 112.863,
   "lat": 36.116,
   "counties": 13,
   "note": ""
  },
  {
   "id": "taiyuan",
   "name": "太原郡",
   "province": "并州",
   "type": "郡",
   "seat": "晋阳",
   "seat_modern": "山西省太原市晋源区",
   "lng": 112.565,
   "lat": 37.874,
   "counties": 16,
   "note": "并州刺史治。无可靠晋阳县点，用并州/太原郡东汉点。另有太原郡点112.388, 37.729，更近西南故城。"
  },
  {
   "id": "shangjun",
   "name": "上郡",
   "province": "并州",
   "type": "郡",
   "seat": "肤施",
   "seat_modern": "陕西省榆林市南",
   "lng": 110.398,
   "lat": 37.35,
   "counties": 10,
   "note": "永和五年九月已内徙左冯翊，志仍列故县。"
  },
  {
   "id": "xihe",
   "name": "西河郡",
   "province": "并州",
   "type": "郡",
   "seat": "离石",
   "seat_modern": "山西省吕梁市离石区",
   "lng": 111.135,
   "lat": 37.51,
   "counties": 13,
   "note": "永和五年治所徙离石。"
  },
  {
   "id": "wuyuan",
   "name": "五原郡",
   "province": "并州",
   "type": "郡",
   "seat": "九原",
   "seat_modern": "内蒙古包头市西",
   "lng": 109.65,
   "lat": 40.706,
   "counties": 10,
   "note": ""
  },
  {
   "id": "yunzhong",
   "name": "云中郡",
   "province": "并州",
   "type": "郡",
   "seat": "云中",
   "seat_modern": "内蒙古呼和浩特市托克托县",
   "lng": 111.155,
   "lat": 40.271,
   "counties": 11,
   "note": "用云中郡点。"
  },
  {
   "id": "dingxiang",
   "name": "定襄郡",
   "province": "并州",
   "type": "郡",
   "seat": "善无",
   "seat_modern": "山西省朔州市右玉县",
   "lng": 112.344,
   "lat": 40.16,
   "counties": 5,
   "note": ""
  },
  {
   "id": "yanmen",
   "name": "雁门郡",
   "province": "并州",
   "type": "郡",
   "seat": "阴馆",
   "seat_modern": "山西省朔州市东南",
   "lng": 112.727,
   "lat": 39.242,
   "counties": 14,
   "note": ""
  },
  {
   "id": "shuofang",
   "name": "朔方郡",
   "province": "并州",
   "type": "郡",
   "seat": "临戎",
   "seat_modern": "内蒙古巴彦淖尔市磴口县",
   "lng": 107.0,
   "lat": 40.325,
   "counties": 6,
   "note": "无临戎县点，用朔方郡点，经度只到整数。永和五年九月内徙五原，志仍列故县。"
  },
  {
   "id": "zhuo_jun",
   "name": "涿郡",
   "province": "幽州",
   "type": "郡",
   "seat": "涿",
   "seat_modern": "河北省涿州市",
   "lng": 115.968,
   "lat": 39.487,
   "counties": 7,
   "note": "用涿郡23–223年点。另一点116.219, 39.521不用。"
  },
  {
   "id": "guangyang",
   "name": "广阳郡",
   "province": "幽州",
   "type": "郡",
   "seat": "蓟",
   "seat_modern": "北京市西南",
   "lng": 116.368,
   "lat": 39.931,
   "counties": 5,
   "note": "无蓟县点，用广阳郡26–219年点，即幽州治。"
  },
  {
   "id": "dai_jun",
   "name": "代郡",
   "province": "幽州",
   "type": "郡",
   "seat": "高柳",
   "seat_modern": "山西省大同市阳高县",
   "lng": 113.752,
   "lat": 40.354,
   "counties": 11,
   "note": ""
  },
  {
   "id": "shanggu",
   "name": "上谷郡",
   "province": "幽州",
   "type": "郡",
   "seat": "沮阳",
   "seat_modern": "河北省张家口市怀来县",
   "lng": 115.729,
   "lat": 40.326,
   "counties": 8,
   "note": "用上谷郡23–219年点。"
  },
  {
   "id": "yuyang",
   "name": "渔阳郡",
   "province": "幽州",
   "type": "郡",
   "seat": "渔阳",
   "seat_modern": "北京市密云区",
   "lng": 116.84,
   "lat": 40.371,
   "counties": 9,
   "note": "用渔阳郡点。后世蓟州的渔阳县不是此处。"
  },
  {
   "id": "youbeiping",
   "name": "右北平郡",
   "province": "幽州",
   "type": "郡",
   "seat": "土垠",
   "seat_modern": "河北省唐山市北",
   "lng": 118.165,
   "lat": 39.828,
   "counties": 4,
   "note": "用右北平郡30–219年点。"
  },
  {
   "id": "liaoxi",
   "name": "辽西郡",
   "province": "幽州",
   "type": "郡",
   "seat": "阳乐",
   "seat_modern": "河北省秦皇岛市卢龙县一带",
   "lng": 119.555,
   "lat": 39.913,
   "counties": 5,
   "note": "用辽西郡长时段点。一说今辽宁义县。山东阳乐不是此县。"
  },
  {
   "id": "liaodong",
   "name": "辽东郡",
   "province": "幽州",
   "type": "郡",
   "seat": "襄平",
   "seat_modern": "辽宁省辽阳市",
   "lng": 123.168,
   "lat": 41.266,
   "counties": 11,
   "note": "县点无坐标，用辽东郡点。"
  },
  {
   "id": "xuantu",
   "name": "玄菟郡",
   "province": "幽州",
   "type": "郡",
   "seat": "高句骊",
   "seat_modern": "辽宁省沈阳、抚顺一带",
   "lng": 124.857,
   "lat": 41.701,
   "counties": 6,
   "note": "内迁后的郡点，止年写作0。不是汉武帝时在朝鲜半岛的故治。"
  },
  {
   "id": "lelang",
   "name": "乐浪郡",
   "province": "幽州",
   "type": "郡",
   "seat": "朝鲜",
   "seat_modern": "朝鲜平壤市大同江南",
   "lng": 125.755,
   "lat": 39.033,
   "counties": 18,
   "note": "无朝鲜县点，用乐浪郡点。"
  },
  {
   "id": "liaodong_shuguo",
   "name": "辽东属国",
   "province": "幽州",
   "type": "属国",
   "seat": "昌辽",
   "seat_modern": "辽宁省锦州市义县一带",
   "lng": 121.1,
   "lat": 41.5,
   "counties": 6,
   "note": "《郡国志》作昌辽，后改昌黎。无精确县点，坐标取义县一带，与地图郡治相同。"
  },
  {
   "id": "nanhai",
   "name": "南海郡",
   "province": "交州",
   "type": "郡",
   "seat": "番禺",
   "seat_modern": "广东省广州市",
   "lng": 113.256,
   "lat": 23.135,
   "counties": 7,
   "note": ""
  },
  {
   "id": "cangwu",
   "name": "苍梧郡",
   "province": "交州",
   "type": "郡",
   "seat": "广信",
   "seat_modern": "广西壮族自治区梧州市",
   "lng": 111.309,
   "lat": 23.487,
   "counties": 11,
   "note": ""
  },
  {
   "id": "yulin_jun",
   "name": "郁林郡",
   "province": "交州",
   "type": "郡",
   "seat": "布山",
   "seat_modern": "广西壮族自治区贵港市桂平市西南",
   "lng": 109.927,
   "lat": 23.215,
   "counties": 11,
   "note": ""
  },
  {
   "id": "hepu",
   "name": "合浦郡",
   "province": "交州",
   "type": "郡",
   "seat": "合浦",
   "seat_modern": "广西壮族自治区北海市合浦县",
   "lng": 109.47,
   "lat": 21.913,
   "counties": 5,
   "note": "用合浦郡有坐标的点。"
  },
  {
   "id": "jiaozhi",
   "name": "交趾郡",
   "province": "交州",
   "type": "郡",
   "seat": "龙编",
   "seat_modern": "越南河内市北、北宁一带",
   "lng": 106.103,
   "lat": 21.123,
   "counties": 12,
   "note": "无龙编县点，用交趾郡点。"
  },
  {
   "id": "jiuzhen",
   "name": "九真郡",
   "province": "交州",
   "type": "郡",
   "seat": "胥浦",
   "seat_modern": "越南清化省一带",
   "lng": 105.813,
   "lat": 19.852,
   "counties": 5,
   "note": "用九真郡点。浙江后世胥浦不是此处。"
  },
  {
   "id": "rinan",
   "name": "日南郡",
   "province": "交州",
   "type": "郡",
   "seat": "西卷",
   "seat_modern": "越南中部",
   "lng": 105.673,
   "lat": 18.671,
   "counties": 5,
   "note": "用日南郡点。西卷县或更南，在今广治一带，此点可能偏北。"
  }
 ],
 "changes": [
  {
   "year": 184,
   "polity": "汉",
   "type": "改名",
   "name": "汉嘉郡",
   "from": [
    "蜀郡属国"
   ],
   "seat": "汉嘉",
   "lng": 102.927,
   "lat": 30.16,
   "note": "不迟于中平元年。中平五年（188）又改回蜀郡属国，章武元年（221）蜀汉再改汉嘉。CHGIS另有182–187年郡点103.096, 30.094。",
   "source": "《续汉书·郡国志》刘昭注引《秦州记》之外，汉嘉置废年无明文，此从通常系于中平前后"
  },
  {
   "year": 188,
   "polity": "汉",
   "type": "新设",
   "name": "汶山郡",
   "from": [
    "蜀郡"
   ],
   "seat": "汶江",
   "lng": 103.849,
   "lat": 31.7,
   "note": "不迟于中平五年，建安初曾省，建安十九年（214）刘备复置。CHGIS汶山郡223年后点在103.578, 31.478，与汶江县点不同。",
   "source": "通行系年，见《三国志》《晋书·地理志》《华阳国志》；与CHGIS不一致时已写入note"
  },
  {
   "year": 188,
   "polity": "汉",
   "type": "新设",
   "name": "南安郡",
   "from": [
    "汉阳郡"
   ],
   "seat": "豲道",
   "lng": null,
   "lat": null,
   "note": "中平五年。治豲道，今甘肃陇西东南。坐标无CHGIS点。",
   "source": "《郡国志》刘昭注引《秦州记》；《晋书·地理志》"
  },
  {
   "year": 194,
   "polity": "汉",
   "type": "新设",
   "name": "新平郡",
   "from": [
    "安定郡",
    "右扶风"
   ],
   "seat": "漆",
   "lng": 108.078,
   "lat": 35.04,
   "note": "兴平元年。",
   "source": "通行系年，见《三国志》《晋书·地理志》《华阳国志》；与CHGIS不一致时已写入note"
  },
  {
   "year": 194,
   "polity": "汉",
   "type": "分置",
   "name": "雍州",
   "from": [
    "凉州"
   ],
   "seat": "姑臧",
   "lng": 102.635,
   "lat": 37.927,
   "note": "兴平元年前后分河西置雍州，治姑臧。建安十八年凉州并入后，雍州治所改到长安。此条是州，不是郡，列入变动是因地图要换州治。",
   "source": "CHGIS时间片"
  },
  {
   "year": 195,
   "polity": "汉",
   "type": "新设",
   "name": "西郡",
   "from": [
    "张掖郡"
   ],
   "seat": "日勒",
   "lng": null,
   "lat": null,
   "note": "兴平二年。治日勒，今甘肃永昌一带。无可靠坐标。",
   "source": "《续汉书·郡国志》张掖郡下刘昭注：献帝分置西郡"
  },
  {
   "year": 195,
   "polity": "汉",
   "type": "新设",
   "name": "庐陵郡",
   "from": [
    "豫章郡"
   ],
   "seat": "石阳",
   "lng": 115.139,
   "lat": 27.332,
   "note": "通常系兴平二年孙策所置。CHGIS郡对象始于191年，早于通说。",
   "source": "通行系年，见《三国志》《晋书·地理志》《华阳国志》；与CHGIS不一致时已写入note；CHGIS时间片"
  },
  {
   "year": 195,
   "polity": "汉",
   "type": "分置",
   "name": "永宁郡",
   "from": [
    "巴郡"
   ],
   "seat": "江州",
   "lng": 106.556,
   "lat": 29.58,
   "note": "兴平二年刘璋分巴为二。建安六年改永宁为巴郡。治所仍在江州一带。",
   "source": "《华阳国志·巴志》"
  },
  {
   "year": 195,
   "polity": "汉",
   "type": "分置",
   "name": "固陵郡",
   "from": [
    "巴郡"
   ],
   "seat": "鱼复",
   "lng": 109.566,
   "lat": 31.049,
   "note": "兴平二年。建安六年改巴东，二十年省为江关都尉，二十一年复固陵，章武元年再定名巴东。",
   "source": "《华阳国志·巴志》；《晋书·地理志》"
  },
  {
   "year": 201,
   "polity": "汉",
   "type": "改名",
   "name": "巴西郡",
   "from": [
    "巴郡"
   ],
   "seat": "阆中",
   "lng": 105.967,
   "lat": 31.583,
   "note": "建安六年。原巴郡改名并移治阆中。",
   "source": "通行系年，见《三国志》《晋书·地理志》《华阳国志》；与CHGIS不一致时已写入note"
  },
  {
   "year": 201,
   "polity": "汉",
   "type": "改名",
   "name": "巴东郡",
   "from": [
    "固陵郡"
   ],
   "seat": "鱼复",
   "lng": 109.566,
   "lat": 31.049,
   "note": "建安六年。章武二年鱼复改名永安，治所仍在今奉节。",
   "source": "通行系年，见《三国志》《晋书·地理志》《华阳国志》；与CHGIS不一致时已写入note"
  },
  {
   "year": 208,
   "polity": "汉",
   "type": "新设",
   "name": "襄阳郡",
   "from": [
    "南郡"
   ],
   "seat": "襄阳",
   "lng": 112.159,
   "lat": 32.027,
   "note": "建安十三年。此后曹魏荆州北部的核心郡。",
   "source": "CHGIS时间片"
  },
  {
   "year": 208,
   "polity": "汉",
   "type": "新设",
   "name": "南乡郡",
   "from": [
    "南阳郡"
   ],
   "seat": "南乡",
   "lng": 111.501,
   "lat": 32.964,
   "note": "建安十三年。CHGIS另有208–582年点111.380, 32.982。",
   "source": "CHGIS时间片"
  },
  {
   "year": 208,
   "polity": "汉",
   "type": "新设",
   "name": "宜都郡",
   "from": [
    "南郡"
   ],
   "seat": "夷道",
   "lng": 111.458,
   "lat": 30.392,
   "note": "建安十三年先置临江郡，十五年改宜都，治夷道（今湖北宜都）。",
   "source": "通行系年，见《三国志》《晋书·地理志》《华阳国志》；与CHGIS不一致时已写入note"
  },
  {
   "year": 208,
   "polity": "汉",
   "type": "新设",
   "name": "新都郡",
   "from": [
    "丹阳郡"
   ],
   "seat": "始新",
   "lng": 118.965,
   "lat": 29.612,
   "note": "建安十三年孙权分丹阳。治始新，今浙江淳安。",
   "source": "《续汉书·郡国志》丹阳郡下：建安十三年孙权分新都郡"
  },
  {
   "year": 210,
   "polity": "吴",
   "type": "新设",
   "name": "鄱阳郡",
   "from": [
    "豫章郡"
   ],
   "seat": "鄱阳",
   "lng": 116.861,
   "lat": 29.088,
   "note": "建安十五年。CHGIS记245年治所改到116.664, 28.994。",
   "source": "CHGIS时间片"
  },
  {
   "year": 213,
   "polity": "汉",
   "type": "新设",
   "name": "江阳郡",
   "from": [
    "犍为郡"
   ],
   "seat": "江阳",
   "lng": null,
   "lat": null,
   "note": "建安十八年。治江阳，今四川泸州。无CHGIS县点。",
   "source": "《晋书·地理志》益州"
  },
  {
   "year": 213,
   "polity": "汉",
   "type": "新设",
   "name": "乐陵郡",
   "from": [
    "平原郡",
    "勃海郡"
   ],
   "seat": "乐陵",
   "lng": 117.216,
   "lat": 37.622,
   "note": "建安十八年前后。治乐陵，一说厌次。坐标是乐陵县点，不是北朝乐陵郡点。",
   "source": "通行系年，见《三国志》《晋书·地理志》《华阳国志》；与CHGIS不一致时已写入note"
  },
  {
   "year": 213,
   "polity": "汉",
   "type": "新设",
   "name": "西平郡",
   "from": [
    "金城郡"
   ],
   "seat": "西都",
   "lng": 101.784,
   "lat": 36.609,
   "note": "不迟于建安十八年。治西都，今青海西宁。",
   "source": "CHGIS时间片"
  },
  {
   "year": 213,
   "polity": "汉",
   "type": "撤并",
   "name": "省并州、幽州、司隶、凉州",
   "from": [
    "并州",
    "幽州",
    "司隶",
    "凉州"
   ],
   "seat": "",
   "lng": null,
   "lat": null,
   "note": "建安十八年曹操复九州：并、幽省入冀，司隶拆入豫、冀、雍，凉州并入雍州。黄初元年大体恢复。",
   "source": "《后汉书·献帝纪》建安十八年"
  },
  {
   "year": 214,
   "polity": "汉",
   "type": "改名",
   "name": "朱提郡",
   "from": [
    "犍为属国"
   ],
   "seat": "朱提",
   "lng": 103.715,
   "lat": 27.343,
   "note": "建安十九年。",
   "source": "《晋书·地理志》"
  },
  {
   "year": 214,
   "polity": "汉",
   "type": "新设",
   "name": "汶山郡",
   "from": [
    "蜀郡"
   ],
   "seat": "汶江",
   "lng": 103.849,
   "lat": 31.7,
   "note": "建安十九年复置。见188年条。",
   "source": "通行系年，见《三国志》《晋书·地理志》《华阳国志》；与CHGIS不一致时已写入note"
  },
  {
   "year": 214,
   "polity": "汉",
   "type": "新设",
   "name": "章武郡",
   "from": [
    "河间国"
   ],
   "seat": "章武",
   "lng": 116.622,
   "lat": 38.696,
   "note": "建安末。CHGIS另有213年起的点117.352, 38.366。嘉平中曾废。",
   "source": "CHGIS时间片"
  },
  {
   "year": 215,
   "polity": "汉",
   "type": "改名",
   "name": "阴平郡",
   "from": [
    "广汉属国"
   ],
   "seat": "阴平",
   "lng": 104.678,
   "lat": 32.948,
   "note": "建安二十年。",
   "source": "《晋书·地理志》"
  },
  {
   "year": 215,
   "polity": "汉",
   "type": "新设",
   "name": "西城郡",
   "from": [
    "汉中郡"
   ],
   "seat": "西城",
   "lng": 109.017,
   "lat": 32.705,
   "note": "建安二十年曹操分汉中。黄初二年改名魏兴，治所仍在西城。",
   "source": "通行系年，见《三国志》《晋书·地理志》《华阳国志》；与CHGIS不一致时已写入note"
  },
  {
   "year": 215,
   "polity": "汉",
   "type": "新设",
   "name": "上庸郡",
   "from": [
    "汉中郡"
   ],
   "seat": "上庸",
   "lng": 110.105,
   "lat": 32.074,
   "note": "建安二十年置，黄初元年并入新城；太和二年复置，约两年后又废；景初元年再置，嘉平中又省；甘露四年（259）再置。",
   "source": "通行系年，见《三国志》《晋书·地理志》《华阳国志》；与CHGIS不一致时已写入note"
  },
  {
   "year": 215,
   "polity": "汉",
   "type": "新设",
   "name": "新兴郡",
   "from": [
    "太原郡"
   ],
   "seat": "九原",
   "lng": 112.731,
   "lat": 38.399,
   "note": "建安二十年。侨置九原等县以处新弃北边四郡之民，治今山西忻州。同年弃云中、定襄、五原、朔方。",
   "source": "CHGIS时间片"
  },
  {
   "year": 215,
   "polity": "汉",
   "type": "撤并",
   "name": "弃北边四郡",
   "from": [
    "云中郡",
    "定襄郡",
    "五原郡",
    "朔方郡"
   ],
   "seat": "",
   "lng": null,
   "lat": null,
   "note": "建安二十年省并，地入鲜卑。上郡约在此前亦弃。",
   "source": "《三国志·魏书·武帝纪》"
  },
  {
   "year": 216,
   "polity": "汉",
   "type": "新设",
   "name": "乐平郡",
   "from": [
    "上党郡",
    "常山郡"
   ],
   "seat": "沾",
   "lng": 113.574,
   "lat": 37.596,
   "note": "建安二十一年前后。治沾，后改乐平。",
   "source": "CHGIS时间片"
  },
  {
   "year": 217,
   "polity": "汉",
   "type": "新设",
   "name": "梓潼郡",
   "from": [
    "广汉郡"
   ],
   "seat": "梓潼",
   "lng": 105.158,
   "lat": 31.638,
   "note": "建安二十二年。",
   "source": "《华阳国志》；《晋书·地理志》"
  },
  {
   "year": 218,
   "polity": "汉",
   "type": "新设",
   "name": "弋阳郡",
   "from": [
    "汝南郡",
    "江夏郡"
   ],
   "seat": "弋阳",
   "lng": 115.045,
   "lat": 32.13,
   "note": "建安二十三年。治弋阳，今河南潢川西。县点在114.997, 32.169，郡点略有差别。",
   "source": "CHGIS时间片"
  },
  {
   "year": 218,
   "polity": "汉",
   "type": "新设",
   "name": "宕渠郡",
   "from": [
    "巴西郡"
   ],
   "seat": "宕渠",
   "lng": null,
   "lat": null,
   "note": "建安二十三年刘备置，不久省，延熙中又短暂复置。治宕渠，今四川渠县。无坐标。",
   "source": "《华阳国志·巴志》"
  },
  {
   "year": 219,
   "polity": "汉",
   "type": "新设",
   "name": "房陵郡",
   "from": [
    "汉中郡"
   ],
   "seat": "房陵",
   "lng": 110.727,
   "lat": 32.059,
   "note": "建安二十四年。黄初元年与上庸合并为新城郡，治仍在房陵。",
   "source": "通行系年，见《三国志》《晋书·地理志》《华阳国志》；与CHGIS不一致时已写入note"
  },
  {
   "year": 220,
   "polity": "魏",
   "type": "新设",
   "name": "新城郡",
   "from": [
    "房陵郡",
    "上庸郡"
   ],
   "seat": "房陵",
   "lng": 110.727,
   "lat": 32.059,
   "note": "黄初元年。",
   "source": "CHGIS时间片"
  },
  {
   "year": 220,
   "polity": "魏",
   "type": "改名",
   "name": "魏兴郡",
   "from": [
    "西城郡"
   ],
   "seat": "西城",
   "lng": 109.017,
   "lat": 32.705,
   "note": "黄初二年改名。CHGIS郡对象从231年起，治所同西城县。",
   "source": "通行系年，见《三国志》《晋书·地理志》《华阳国志》；与CHGIS不一致时已写入note"
  },
  {
   "year": 220,
   "polity": "魏",
   "type": "新设",
   "name": "安丰郡",
   "from": [
    "庐江郡"
   ],
   "seat": "安丰",
   "lng": 116.168,
   "lat": 32.061,
   "note": "黄初初。今安徽霍邱西南。",
   "source": "CHGIS时间片"
  },
  {
   "year": 221,
   "polity": "魏",
   "type": "新设",
   "name": "广平郡",
   "from": [
    "魏郡"
   ],
   "seat": "广平",
   "lng": 114.723,
   "lat": 36.701,
   "note": "黄初二年。用CHGIS 82–264年广平郡点。一说治曲梁。",
   "source": "CHGIS时间片"
  },
  {
   "year": 221,
   "polity": "魏",
   "type": "新设",
   "name": "阳平郡",
   "from": [
    "魏郡"
   ],
   "seat": "元城",
   "lng": 115.358,
   "lat": 36.7,
   "note": "黄初二年。治元城，今河北大名一带。",
   "source": "CHGIS时间片"
  },
  {
   "year": 221,
   "polity": "蜀",
   "type": "改名",
   "name": "汉嘉郡",
   "from": [
    "蜀郡属国"
   ],
   "seat": "汉嘉",
   "lng": 102.927,
   "lat": 30.16,
   "note": "章武元年再次由属国改郡。",
   "source": "《晋书·地理志》益州"
  },
  {
   "year": 221,
   "polity": "蜀",
   "type": "改名",
   "name": "巴东郡",
   "from": [
    "固陵郡"
   ],
   "seat": "永安",
   "lng": 109.566,
   "lat": 31.049,
   "note": "章武元年定名巴东。鱼复同年或次年改永安。",
   "source": "《晋书·地理志》"
  },
  {
   "year": 221,
   "polity": "吴",
   "type": "改名",
   "name": "武昌郡",
   "from": [
    "江夏郡"
   ],
   "seat": "武昌",
   "lng": 114.88,
   "lat": 30.403,
   "note": "黄初二年/黄武元年改鄂县为武昌。置郡之年有异说，地图上此处从此是孙吴荆州重镇。",
   "source": "CHGIS时间片"
  },
  {
   "year": 224,
   "polity": "魏",
   "type": "新设",
   "name": "谯郡",
   "from": [
    "沛国"
   ],
   "seat": "谯",
   "lng": 115.771,
   "lat": 33.879,
   "note": "分沛置谯，不晚于建安十八年已有说法；CHGIS谯郡对象从224年起。治谯。",
   "source": "CHGIS时间片"
  },
  {
   "year": 225,
   "polity": "蜀",
   "type": "改名",
   "name": "建宁郡",
   "from": [
    "益州郡"
   ],
   "seat": "滇池",
   "lng": 102.743,
   "lat": 24.703,
   "note": "建兴三年改益州郡为建宁。治滇池，后或治味（103.732, 25.531）。",
   "source": "《三国志·蜀书·后主传》"
  },
  {
   "year": 225,
   "polity": "蜀",
   "type": "新设",
   "name": "云南郡",
   "from": [
    "建宁郡",
    "永昌郡",
    "越巂郡"
   ],
   "seat": "云南",
   "lng": 100.685,
   "lat": 25.425,
   "note": "建兴三年。治云南县（今云南祥云）。一说治楪榆（100.131, 25.855）。CHGIS郡点在101.290, 25.564，与县点不同。",
   "source": "《三国志·蜀书·后主传》"
  },
  {
   "year": 225,
   "polity": "蜀",
   "type": "新设",
   "name": "兴古郡",
   "from": [
    "建宁郡",
    "牂牁郡"
   ],
   "seat": "宛温",
   "lng": 104.25,
   "lat": 23.81,
   "note": "建兴三年。治宛温。一说治漏卧。",
   "source": "《三国志·蜀书·后主传》；《华阳国志·南中志》"
  },
  {
   "year": 226,
   "polity": "魏",
   "type": "改名",
   "name": "范阳郡",
   "from": [
    "涿郡"
   ],
   "seat": "涿",
   "lng": 115.968,
   "lat": 39.487,
   "note": "黄初七年改涿郡为范阳，治仍在涿。",
   "source": "通行系年，见《三国志》《晋书·地理志》《华阳国志》；与CHGIS不一致时已写入note"
  },
  {
   "year": 232,
   "polity": "魏",
   "type": "改名",
   "name": "燕国",
   "from": [
    "广阳郡"
   ],
   "seat": "蓟",
   "lng": 116.368,
   "lat": 39.931,
   "note": "太和六年。",
   "source": "通行系年，见《三国志》《晋书·地理志》《华阳国志》；与CHGIS不一致时已写入note"
  },
  {
   "year": 242,
   "polity": "魏",
   "type": "新设",
   "name": "荥阳郡",
   "from": [
    "河南尹"
   ],
   "seat": "荥阳",
   "lng": null,
   "lat": null,
   "note": "正始三年置，后废，县还河南尹。无单列坐标。",
   "source": "通行系年，见《三国志》《晋书·地理志》《华阳国志》；与CHGIS不一致时已写入note"
  },
  {
   "year": 244,
   "polity": "魏",
   "type": "改名",
   "name": "昌黎郡",
   "from": [
    "辽东属国"
   ],
   "seat": "昌黎",
   "lng": null,
   "lat": null,
   "note": "正始五年。治所沿昌辽，今辽宁义县一带，无可靠坐标。",
   "source": "通行系年，见《三国志》《晋书·地理志》《华阳国志》；与CHGIS不一致时已写入note"
  },
  {
   "year": 247,
   "polity": "魏",
   "type": "新设",
   "name": "平阳郡",
   "from": [
    "河东郡"
   ],
   "seat": "平阳",
   "lng": 111.415,
   "lat": 36.058,
   "note": "正始八年。治平阳，今山西临汾西南。",
   "source": "《三国志·魏书·三少帝纪》"
  },
  {
   "year": 257,
   "polity": "吴",
   "type": "新设",
   "name": "临海郡",
   "from": [
    "会稽郡"
   ],
   "seat": "临海",
   "lng": 121.121,
   "lat": 28.843,
   "note": "太平二年。CHGIS记次年（258）治所迁章安（121.419, 28.714）。",
   "source": "《三国志·吴书·孙亮传》；CHGIS时间片"
  },
  {
   "year": 257,
   "polity": "吴",
   "type": "新设",
   "name": "临川郡",
   "from": [
    "豫章郡"
   ],
   "seat": "南城",
   "lng": null,
   "lat": null,
   "note": "太平二年分豫章东部。治南城，今江西抚州。无CHGIS点，坐标留空。",
   "source": "《三国志·吴书·孙亮传》"
  },
  {
   "year": 257,
   "polity": "吴",
   "type": "新设",
   "name": "衡阳郡",
   "from": [
    "长沙郡"
   ],
   "seat": "湘南",
   "lng": null,
   "lat": null,
   "note": "约太平二年分长沙西部。治所或在湘南，今地有湘潭、衡山两说，坐标留空。",
   "source": "通行系年，见《三国志》《晋书·地理志》《华阳国志》；与CHGIS不一致时已写入note"
  },
  {
   "year": 257,
   "polity": "吴",
   "type": "新设",
   "name": "湘东郡",
   "from": [
    "长沙郡"
   ],
   "seat": "酃",
   "lng": 112.689,
   "lat": 26.945,
   "note": "约太平二年分长沙东部。治酃，今湖南衡阳。",
   "source": "通行系年，见《三国志》《晋书·地理志》《华阳国志》；与CHGIS不一致时已写入note"
  },
  {
   "year": 259,
   "polity": "魏",
   "type": "新设",
   "name": "上庸郡",
   "from": [
    "新城郡"
   ],
   "seat": "上庸",
   "lng": 110.105,
   "lat": 32.074,
   "note": "甘露四年再置，此前反复省并，见215年条。",
   "source": "通行系年，见《三国志》《晋书·地理志》《华阳国志》；与CHGIS不一致时已写入note"
  },
  {
   "year": 260,
   "polity": "吴",
   "type": "新设",
   "name": "建安郡",
   "from": [
    "会稽郡"
   ],
   "seat": "建安",
   "lng": 118.324,
   "lat": 27.039,
   "note": "永安三年。治建安，今福建建瓯。",
   "source": "CHGIS时间片"
  },
  {
   "year": 260,
   "polity": "吴",
   "type": "新设",
   "name": "建平郡",
   "from": [
    "宜都郡"
   ],
   "seat": "巫",
   "lng": 109.889,
   "lat": 31.095,
   "note": "永安三年分宜都。治巫，今重庆巫山。",
   "source": "通行系年，见《三国志》《晋书·地理志》《华阳国志》；与CHGIS不一致时已写入note"
  },
  {
   "year": 263,
   "polity": "吴",
   "type": "新设",
   "name": "天门郡",
   "from": [
    "武陵郡"
   ],
   "seat": "零阳",
   "lng": 111.143,
   "lat": 29.434,
   "note": "永安六年。治零阳，今湖南慈利。一说治溇中，年份或作永安中。",
   "source": "通行系年，见《三国志》《晋书·地理志》《华阳国志》；与CHGIS不一致时已写入note"
  },
  {
   "year": 264,
   "polity": "魏",
   "type": "新设",
   "name": "梁州",
   "from": [
    "益州"
   ],
   "seat": "南郑",
   "lng": 107.035,
   "lat": 33.076,
   "note": "景元五年/咸熙元年，灭蜀后分益州置梁州。一说治沔阳，CHGIS点在南郑。",
   "source": "CHGIS时间片"
  },
  {
   "year": 264,
   "polity": "魏",
   "type": "新设",
   "name": "原武郡",
   "from": [
    "河南尹"
   ],
   "seat": "原武",
   "lng": 113.963,
   "lat": 35.052,
   "note": "咸熙元年升原武典农为郡。存在时间很短。",
   "source": "通行系年，见《三国志》《晋书·地理志》《华阳国志》；与CHGIS不一致时已写入note"
  },
  {
   "year": 264,
   "polity": "吴",
   "type": "分置",
   "name": "广州",
   "from": [
    "交州"
   ],
   "seat": "番禺",
   "lng": 113.256,
   "lat": 23.135,
   "note": "永安七年分交州置广州。此前黄武五年（226）曾短置一年即废。交州治所则回到龙编一带。",
   "source": "CHGIS时间片"
  },
  {
   "year": 265,
   "polity": "吴",
   "type": "新设",
   "name": "始安郡",
   "from": [
    "苍梧郡"
   ],
   "seat": "始安",
   "lng": null,
   "lat": null,
   "note": "甘露元年分苍梧。治始安，今广西桂林。无可靠郡点，坐标留空。",
   "source": "《晋书·地理志》"
  },
  {
   "year": 265,
   "polity": "吴",
   "type": "新设",
   "name": "始兴郡",
   "from": [
    "桂阳郡"
   ],
   "seat": "曲江",
   "lng": null,
   "lat": null,
   "note": "甘露元年分桂阳。治曲江，今广东韶关。坐标留空。",
   "source": "《晋书·地理志》"
  },
  {
   "year": 266,
   "polity": "吴",
   "type": "新设",
   "name": "吴兴郡",
   "from": [
    "吴郡",
    "丹阳郡"
   ],
   "seat": "乌程",
   "lng": 120.109,
   "lat": 30.797,
   "note": "宝鼎元年。治乌程，今浙江湖州。",
   "source": "《三国志·吴书·孙皓传》"
  },
  {
   "year": 266,
   "polity": "吴",
   "type": "新设",
   "name": "东阳郡",
   "from": [
    "会稽郡"
   ],
   "seat": "长山",
   "lng": null,
   "lat": null,
   "note": "宝鼎元年。治长山，今浙江金华。坐标留空。",
   "source": "《三国志·吴书·孙皓传》"
  },
  {
   "year": 267,
   "polity": "吴",
   "type": "新设",
   "name": "安成郡",
   "from": [
    "长沙郡",
    "豫章郡",
    "庐陵郡"
   ],
   "seat": "安成",
   "lng": 114.275,
   "lat": 27.385,
   "note": "宝鼎二年。治平都或安成，今江西安福。坐标用长沙郡安成县点。",
   "source": "通行系年，见《三国志》《晋书·地理志》《华阳国志》；与CHGIS不一致时已写入note"
  },
  {
   "year": 269,
   "polity": "晋",
   "type": "新设",
   "name": "秦州",
   "from": [
    "雍州"
   ],
   "seat": "冀",
   "lng": 105.389,
   "lat": 34.738,
   "note": "泰始五年分雍州置，治冀。黄初年间曾短置旋废，与此不是同一次。太康三年前后又曾调整。",
   "source": "CHGIS时间片"
  },
  {
   "year": 280,
   "polity": "晋",
   "type": "撤并",
   "name": "平吴后郡国调整",
   "from": [
    "孙吴诸郡"
   ],
   "seat": "",
   "lng": null,
   "lat": null,
   "note": "太康元年灭吴。新郡如晋安、毗陵、宣城、南康、宁浦等主要写在《晋书·地理志》，其簿籍常系于太康三年前后，已越出280年当年。地图若停在280，不要把太康三年的全部新郡提前画上。",
   "source": "《晋书·地理志》"
  }
 ],
 "province_seats": [
  {
   "province": "司隶",
   "from_year": 184,
   "to_year": 212,
   "seat": "雒阳",
   "lng": 112.596,
   "lat": 34.732,
   "controller_note": "司隶校尉治雒阳。建安十八年（213）省司隶，至黄初元年前无此州治。"
  },
  {
   "province": "司隶",
   "from_year": 220,
   "to_year": 280,
   "seat": "雒阳",
   "lng": 112.596,
   "lat": 34.732,
   "controller_note": "魏复置司隶，也称司州，仍治雒阳。CHGIS司州点在112.383, 34.665，是辖区中心，不用。"
  },
  {
   "province": "豫州",
   "from_year": 184,
   "to_year": 229,
   "seat": "谯",
   "lng": 115.771,
   "lat": 33.879,
   "controller_note": "汉末至魏初治谯。"
  },
  {
   "province": "豫州",
   "from_year": 230,
   "to_year": 248,
   "seat": "项",
   "lng": 115.064,
   "lat": 33.397,
   "controller_note": "明帝年间徙治项。CHGIS作230–248。"
  },
  {
   "province": "豫州",
   "from_year": 249,
   "to_year": 264,
   "seat": "安城",
   "lng": 114.381,
   "lat": 32.609,
   "controller_note": "正始年间徙治安城。此为CHGIS州点。汝南安成县点在114.568, 32.806，两处不一致。"
  },
  {
   "province": "豫州",
   "from_year": 265,
   "to_year": 280,
   "seat": "陈",
   "lng": 114.882,
   "lat": 33.734,
   "controller_note": "西晋治陈。"
  },
  {
   "province": "冀州",
   "from_year": 184,
   "to_year": 223,
   "seat": "邺",
   "lng": 114.412,
   "lat": 36.272,
   "controller_note": "灵帝后治邺。由高邑徙邺的年份无明文。CHGIS州点在114.540, 36.257，离邺城约十余公里，这里用邺县点。"
  },
  {
   "province": "冀州",
   "from_year": 224,
   "to_year": 280,
   "seat": "信都",
   "lng": 115.564,
   "lat": 37.566,
   "controller_note": "黄初年间徙治信都。建安十八年至黄初元年，并、幽并入冀，州境更大，治所仍在邺然后信都。"
  },
  {
   "province": "兖州",
   "from_year": 184,
   "to_year": 195,
   "seat": "昌邑",
   "lng": 116.124,
   "lat": 35.143,
   "controller_note": "《郡国志》刺史治昌邑。"
  },
  {
   "province": "兖州",
   "from_year": 196,
   "to_year": 223,
   "seat": "鄄城",
   "lng": 115.504,
   "lat": 35.673,
   "controller_note": "兴平二年曹操徙治鄄城。"
  },
  {
   "province": "兖州",
   "from_year": 224,
   "to_year": 280,
   "seat": "廪丘",
   "lng": 115.726,
   "lat": 35.636,
   "controller_note": "魏初徙廪丘。"
  },
  {
   "province": "徐州",
   "from_year": 184,
   "to_year": 195,
   "seat": "郯",
   "lng": 118.335,
   "lat": 34.621,
   "controller_note": "《郡国志》刺史治郯。"
  },
  {
   "province": "徐州",
   "from_year": 196,
   "to_year": 264,
   "seat": "下邳",
   "lng": 117.887,
   "lat": 34.118,
   "controller_note": "汉末徙下邳。一说魏初已徙彭城。CHGIS州点在117.963, 34.471，这里用下邳县点。"
  },
  {
   "province": "徐州",
   "from_year": 265,
   "to_year": 280,
   "seat": "彭城",
   "lng": 117.188,
   "lat": 34.27,
   "controller_note": "西晋治彭城。"
  },
  {
   "province": "青州",
   "from_year": 184,
   "to_year": 280,
   "seat": "临菑",
   "lng": 118.37,
   "lat": 36.864,
   "controller_note": "《郡国志》刺史治临菑。战乱中或暂移，史无稳定的第二治所。CHGIS未返回可核对的州治时间片。"
  },
  {
   "province": "凉州",
   "from_year": 184,
   "to_year": 213,
   "seat": "冀",
   "lng": 105.389,
   "lat": 34.738,
   "controller_note": "《郡国志》凉州刺史治陇县。CHGIS将184–213的州治放在冀，与“灵帝时徙冀”相合。陇县本身无CHGIS点。"
  },
  {
   "province": "凉州",
   "from_year": 220,
   "to_year": 280,
   "seat": "姑臧",
   "lng": 102.635,
   "lat": 37.927,
   "controller_note": "黄初元年复置凉州，治武威姑臧。214–219年凉州并入雍州，无凉州治。"
  },
  {
   "province": "雍州",
   "from_year": 194,
   "to_year": 219,
   "seat": "姑臧",
   "lng": 102.635,
   "lat": 37.927,
   "controller_note": "河西雍州。建安十八年凉州并入后，220年起关中雍州改治长安。"
  },
  {
   "province": "雍州",
   "from_year": 220,
   "to_year": 280,
   "seat": "长安",
   "lng": 108.937,
   "lat": 34.318,
   "controller_note": "魏雍州治长安。CHGIS州点108.865, 34.287，这里用长安县点。"
  },
  {
   "province": "秦州",
   "from_year": 269,
   "to_year": 280,
   "seat": "冀",
   "lng": 105.389,
   "lat": 34.738,
   "controller_note": "泰始五年置。黄初中曾短置即废，不单列。"
  },
  {
   "province": "并州",
   "from_year": 184,
   "to_year": 213,
   "seat": "晋阳",
   "lng": 112.565,
   "lat": 37.874,
   "controller_note": "《郡国志》刺史治晋阳。214–219年并州省入冀。另有故城点112.388, 37.729。"
  },
  {
   "province": "并州",
   "from_year": 220,
   "to_year": 280,
   "seat": "晋阳",
   "lng": 112.565,
   "lat": 37.874,
   "controller_note": "黄初元年复置。"
  },
  {
   "province": "幽州",
   "from_year": 184,
   "to_year": 213,
   "seat": "蓟",
   "lng": 116.368,
   "lat": 39.931,
   "controller_note": "治蓟。214–219年省入冀。"
  },
  {
   "province": "幽州",
   "from_year": 220,
   "to_year": 264,
   "seat": "蓟",
   "lng": 116.368,
   "lat": 39.931,
   "controller_note": "黄初元年复置，仍治蓟。"
  },
  {
   "province": "幽州",
   "from_year": 265,
   "to_year": 280,
   "seat": "涿",
   "lng": 115.968,
   "lat": 39.487,
   "controller_note": "西晋徙治涿。"
  },
  {
   "province": "益州",
   "from_year": 184,
   "to_year": 187,
   "seat": "雒",
   "lng": 104.306,
   "lat": 30.995,
   "controller_note": "《郡国志》刺史治雒。CHGIS把184–263整段州点放在成都，抹平了迁治，这里不从。"
  },
  {
   "province": "益州",
   "from_year": 188,
   "to_year": 193,
   "seat": "绵竹",
   "lng": 104.418,
   "lat": 31.242,
   "controller_note": "中平五年刘焉为益州牧，移治绵竹。徙成都之年有初平、兴平两说，这里收到194年。"
  },
  {
   "province": "益州",
   "from_year": 194,
   "to_year": 280,
   "seat": "成都",
   "lng": 104.078,
   "lat": 30.65,
   "controller_note": "刘焉、刘璋、蜀汉、魏、晋初均治成都。"
  },
  {
   "province": "荆州",
   "from_year": 184,
   "to_year": 190,
   "seat": "汉寿",
   "lng": 111.896,
   "lat": 29.117,
   "controller_note": "《郡国志》刺史治汉寿。CHGIS另有184–190年州点111.870, 28.926，像辖区中心，不用。"
  },
  {
   "province": "荆州",
   "from_year": 191,
   "to_year": 208,
   "seat": "襄阳",
   "lng": 112.159,
   "lat": 32.027,
   "controller_note": "刘表徙治襄阳。精确年份或作初平三年前后。"
  },
  {
   "province": "荆州",
   "from_year": 209,
   "to_year": 244,
   "seat": "宛",
   "lng": 112.535,
   "lat": 33.002,
   "controller_note": "曹魏荆州。赤壁后南部属吴。正始以后或徙新野，CHGIS有一条始年写作0的新野点，不采用为整段。"
  },
  {
   "province": "荆州",
   "from_year": 245,
   "to_year": 280,
   "seat": "新野",
   "lng": 112.358,
   "lat": 32.525,
   "controller_note": "曹魏荆州徙新野，年份按正始年间估计，不是定论。"
  },
  {
   "province": "荆州",
   "from_year": 209,
   "to_year": 218,
   "seat": "江陵",
   "lng": 112.191,
   "lat": 30.35,
   "controller_note": "孙吴荆州。CHGIS 209–218年点在112.069, 30.056，略偏公安；219年后回到江陵点。这里209–218仍标江陵，note说明有公安异说。"
  },
  {
   "province": "荆州",
   "from_year": 219,
   "to_year": 257,
   "seat": "武昌",
   "lng": 114.88,
   "lat": 30.403,
   "controller_note": "孙吴荆州治武昌。"
  },
  {
   "province": "荆州",
   "from_year": 258,
   "to_year": 272,
   "seat": "巴丘",
   "lng": 113.098,
   "lat": 29.371,
   "controller_note": "CHGIS孙吴荆州点。巴丘在今湖南岳阳，是否即州治，史文不直接。"
  },
  {
   "province": "荆州",
   "from_year": 273,
   "to_year": 280,
   "seat": "江陵",
   "lng": 112.191,
   "lat": 30.35,
   "controller_note": "孙吴荆州后期。CHGIS点111.987, 30.411，近江陵、公安之间，这里用江陵县点。"
  },
  {
   "province": "扬州",
   "from_year": 184,
   "to_year": 189,
   "seat": "历阳",
   "lng": 118.361,
   "lat": 31.714,
   "controller_note": "《郡国志》刺史治历阳。"
  },
  {
   "province": "扬州",
   "from_year": 190,
   "to_year": 192,
   "seat": "寿春",
   "lng": 116.777,
   "lat": 32.576,
   "controller_note": "汉末徙寿春。"
  },
  {
   "province": "扬州",
   "from_year": 193,
   "to_year": 196,
   "seat": "曲阿",
   "lng": 119.57,
   "lat": 31.996,
   "controller_note": "袁术据寿春时，刘繇治曲阿。"
  },
  {
   "province": "扬州",
   "from_year": 197,
   "to_year": 199,
   "seat": "寿春",
   "lng": 116.777,
   "lat": 32.576,
   "controller_note": "袁术败后，曹氏扬州还治寿春。"
  },
  {
   "province": "扬州",
   "from_year": 200,
   "to_year": 223,
   "seat": "合肥",
   "lng": 117.276,
   "lat": 31.864,
   "controller_note": "曹氏扬州徙合肥。"
  },
  {
   "province": "扬州",
   "from_year": 224,
   "to_year": 280,
   "seat": "寿春",
   "lng": 116.777,
   "lat": 32.576,
   "controller_note": "曹魏扬州复治寿春。"
  },
  {
   "province": "扬州",
   "from_year": 211,
   "to_year": 280,
   "seat": "建业",
   "lng": 118.769,
   "lat": 32.053,
   "controller_note": "孙吴扬州。建安十六年（211）前后孙权徙治秣陵，次年改名建业。"
  },
  {
   "province": "交州",
   "from_year": 184,
   "to_year": 202,
   "seat": "龙编",
   "lng": 106.103,
   "lat": 21.123,
   "controller_note": "交趾刺史治龙编。"
  },
  {
   "province": "交州",
   "from_year": 203,
   "to_year": 209,
   "seat": "广信",
   "lng": 111.309,
   "lat": 23.487,
   "controller_note": "建安八年改交州，治广信。"
  },
  {
   "province": "交州",
   "from_year": 210,
   "to_year": 225,
   "seat": "番禺",
   "lng": 113.256,
   "lat": 23.135,
   "controller_note": "迁番禺。"
  },
  {
   "province": "交州",
   "from_year": 226,
   "to_year": 226,
   "seat": "龙编",
   "lng": 106.103,
   "lat": 21.123,
   "controller_note": "黄武五年分广州时，交州短暂回到交趾。同年广州即废。"
  },
  {
   "province": "交州",
   "from_year": 227,
   "to_year": 263,
   "seat": "番禺",
   "lng": 113.256,
   "lat": 23.135,
   "controller_note": "广州废后，交州仍治番禺。"
  },
  {
   "province": "交州",
   "from_year": 264,
   "to_year": 280,
   "seat": "龙编",
   "lng": 106.103,
   "lat": 21.123,
   "controller_note": "分广州后，交州治龙编，广州治番禺。"
  },
  {
   "province": "广州",
   "from_year": 226,
   "to_year": 226,
   "seat": "番禺",
   "lng": 113.256,
   "lat": 23.135,
   "controller_note": "当年置、当年废。"
  },
  {
   "province": "广州",
   "from_year": 264,
   "to_year": 280,
   "seat": "番禺",
   "lng": 113.256,
   "lat": 23.135,
   "controller_note": "永安七年再置。"
  },
  {
   "province": "梁州",
   "from_year": 264,
   "to_year": 280,
   "seat": "南郑",
   "lng": 107.035,
   "lat": 33.076,
   "controller_note": "一说治沔阳。"
  }
 ]
}
```

## 参考来源

- 司马彪《续汉书·郡国志》，今附于《后汉书》志十九至二十三。郡名、类型、领县数、首县治所，核对太玄书阁所录志文（http://www.xuge.org/ls/hhs/083.htm 起分卷）。用字以该志为准，如勃海、临菑、丹阳、福禄、昌辽、廮陶。
- 谭其骧主编《中国历史地图集》第二册东汉图组说明：永和五年簿；上郡、朔方于永和五年九月已内徙而志仍列故县；阜陵国不载则从志。第三册为三国、西晋对照。
- 《三国志》《晋书·地理志》《华阳国志》用于汉末分郡与蜀汉南中、巴郡改名。年份有异说的，不改写成唯一答案。
- 复旦大学、哈佛大学 CHGIS / TGAZ，http://tgaz.fudan.edu.cn ，检索日期 2026-09-25。坐标与一部分州治起讫年取自该库时间片。
- 李晓杰《东汉政区地理》、吴增仅《三国郡县表》（杨守敬补正）是应继续核对的专书。本文没有逐条复核二书全文，不能把其中的考订说成已经吸收。
- 维基百科“东汉行政区划”“三国行政区划”和百度百科“东汉行政区划”只用来找线索。与《郡国志》城数冲突时（如广陵、会稽、武威），从《郡国志》。

## 主要不确定点

- 梁国：志文首县是下邑，传统国都是睢阳。
- 张掖属国治候官、辽东属国治昌辽、东郡治濮阳：没有可用的 CHGIS 点。地名录使用与地图郡治相同的约定位，避免搜索飞到空坐标。
- 晋阳有两个太原郡点（112.565, 37.874 与 112.388, 37.729）。并州州治暂用前者。
- 武都郡 140 年点与更早的成县附近点不一致。北地富平在 141 年内徙。朔方临戎的经度在库里只有整数。
- 辽西阳乐：库中长时段点在今卢龙一带，另说在辽宁义县。
- 玄菟高句骊用的是内迁后的郡点，止年写作 0。日南西卷的郡点可能偏北。
- 云南郡治云南县或楪榆；建宁郡后来或改治味县；涪陵置郡之年有建安末与更晚两说。
- 冀州由高邑徙邺、益州由绵竹徙成都、曹魏荆州由宛徙新野，年份都没有一条能钉死的纪年。
- 孙吴临川、衡阳、始安、始兴、东阳等郡，置年按《三国志》《晋书·地理志》的通行系年，治所坐标多半留空。
- 太康元年（280）灭吴以后的郡，很多要到太康三年簿才写定，不宜全部提前画进 280 年。
