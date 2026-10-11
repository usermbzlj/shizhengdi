# 原始数据清单

`data/raw/` 与 `data/derived/` 不进版本库。重建地图数据前，按下表把原始数据放回 `data/raw/`。

| 目录 | 内容 | 来源 |
| --- | --- | --- |
| `raw/chgis/v6/` | CHGIS V6 时间序列（县治点 `time_cnty_pts`、郡/府治所点 `time_pref_pts`、郡/府多边形 `time_pref_pgn`） | https://dataverse.harvard.edu/dataverse/chgis_v6 |
| `raw/chgis/v4/` | CHGIS V4 政权、省级时间序列多边形与点（含复旦 `fudan_ts_regime_*`） | https://chgis.fas.harvard.edu/data/chgis/v4/ |
| `raw/chgis/docs/` | 数据字典、README、EULA | 同上 |
| `raw/naturalearth/` | 海岸线、陆地、河湖、城市点、铁路 | https://www.naturalearthdata.com/ |
| `raw/fonts/` | 宋体子集的源字体 | 见 `prototype/scripts/subset_fonts.py` |

地形瓦片由 `prototype/scripts/fetch-terrain.mjs` 下载生成。

## Python 环境

- `data/.venv`：主环境（地图构建、配音、字体子集），依赖见 `requirements.txt`。
- `data/.venv-geo`：早期几何试验环境，依赖见 `requirements-geo.txt`。

脚本运行前设 `PYTHONUTF8=1`。
