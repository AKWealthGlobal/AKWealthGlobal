"""把提示詞風格從 9 類整併成 4 類，並依「每組提示詞實際要求的畫面」把不寫實的移出寫實攝影。

舊 9 類 → 新 4 類：
  寫實攝影、復古懷舊                                         → 寫實攝影與復古懷舊
  電影感與概念美術、3D 動畫與公仔、插畫與繪本、動漫與動畫、東方傳統藝術 → 電影感、插畫與動畫藝術
  海報與圖文設計                                             → 海報與圖文設計
  純文字（無圖像風格）                                        → AI工具提示詞（不存檔，由 prompt-taxonomy.ts 依分類決定）

再依提示詞內容與示範圖，把下列「原本被放在寫實攝影」但畫面並不寫實的移走（規則寫在 RULES）。
可重複執行：已是新名稱的紀錄不會被改壞。

用法：python3 scripts/regroup-prompt-styles.py
"""
import json
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STYLES_FILE = ROOT / 'lib' / 'prompt-styles.json'
EXAMPLES_FILE = ROOT / 'lib' / 'prompt-examples.json'

REAL = '寫實攝影與復古懷舊'
ART = '電影感、插畫與動畫藝術'
DESIGN = '海報與圖文設計'

OLD_TO_NEW = {
    '寫實攝影': REAL, '復古懷舊': REAL,
    '電影感與概念美術': ART, '3D 動畫與公仔': ART, '插畫與繪本': ART, '動漫與動畫': ART, '東方傳統藝術': ART,
    '海報與圖文設計': DESIGN,
}

# 標題「｜」前的格式名稱（alice-pestle 系列）→ 新風格。這些提示詞要求的畫面本來就不是單張寫實照片。
PESTLE_FORMAT = {
    '原創 3D 角色': ART,        # 角色四視圖、柔和 3D 材質
    'Q版暖心故事': ART,         # Q 版 12 格分鏡
    '水墨扁平插畫': ART,        # 水墨留白與扁平形體
    '實景與插畫融合': ART,      # 在實景加入手繪角色
    '賣點功能圖': DESIGN,       # 圖示、連線與圖文區
    '尺寸規格圖': DESIGN,       # 標線與尺寸文字
}

# 分類整組：電影式故事分鏡／廣告製作板（含 CAM、SFX、MUSIC 製作筆記）屬電影感。
CATEGORY = {'分鏡與廣告腳本': ART}

# 個別提示詞（逐張看過示範圖與提示詞後判定）。
SLUGS = {
    'prompt-124': ART, 'prompt-125': ART, 'prompt-126': ART,  # 90 年代課本插畫：手繪插畫
    'prompt-1094': ART,                                       # Q 版 3D 小人風：迷你分身
    'prompt-623': ART,                                        # 星空下的思念：發光的狗，屬數位繪畫
    'prompt-889': ART,   # 捷運上的哪吒：火輪特效
    'prompt-892': ART,   # 電競館的大聖：猴臉角色
    'prompt-895': ART,   # 雷公電力行：雷電特效
    'prompt-899': ART,   # 老君實驗室：發光煉丹爐
    'prompt-901': ART,   # 夸父跑馬拉松：史詩特效
}


def fmt(entry):
    return entry['title'].split('｜')[0] if entry['slug'].startswith('alice-pestle') else ''


def main():
    try:
        styles = json.loads(STYLES_FILE.read_text(encoding='utf-8'))
        entries = json.loads(EXAMPLES_FILE.read_text(encoding='utf-8'))
    except (OSError, ValueError) as e:
        sys.exit(f'讀取資料失敗：{e}')
    known = {e['slug']: e for e in entries}
    before = Counter(styles.values())
    out = {}
    for slug, style in styles.items():
        new = OLD_TO_NEW.get(style, style)
        e = known.get(slug)
        if e is not None:
            new = SLUGS.get(slug) or PESTLE_FORMAT.get(fmt(e)) or CATEGORY.get(e['category']) or new
        out[slug] = new
    unknown = sorted(set(out.values()) - {REAL, ART, DESIGN})
    if unknown:
        sys.exit(f'出現未知風格：{unknown}')
    try:
        STYLES_FILE.write_text(json.dumps(out, ensure_ascii=False, indent=0), encoding='utf-8')
    except OSError as e:
        sys.exit(f'寫入 {STYLES_FILE} 失敗：{e}')
    print('整併前', dict(before))
    print('整併後', dict(Counter(out.values())), '共', len(out), '筆')


if __name__ == '__main__':
    main()
