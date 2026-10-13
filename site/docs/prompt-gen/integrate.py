"""把 100 張生成圖轉成 webp 並併入 lib/prompt-examples.json。
用法（在 site/ 下）：python3 docs/prompt-gen/integrate.py <原始圖資料夾>
原始圖檔名需為 NN.png / NN.jpg / NN.webp（NN = 23..122）。"""
import json, sys, os, glob
from PIL import Image
src = sys.argv[1]
lib = json.load(open('lib/prompt-examples.json', encoding='utf8'))
new = json.load(open('docs/prompt-library-100.json', encoding='utf8'))
have = {e['slug'] for e in lib}
missing = []
for e in new:
    n = int(e['slug'][7:])
    files = [f for f in glob.glob(f'{src}/{n}.*') + glob.glob(f'{src}/{n:02d}.*')]
    if not files: missing.append(n); continue
    out = f'public/media/prompt-examples/example-{n:02d}.webp'
    im = Image.open(files[0]).convert('RGB')
    im.thumbnail((720, 960))
    im.save(out, 'WEBP', quality=78, method=6)
    e['imageBytes'] = os.path.getsize(out)
    if e['slug'] not in have: lib.append(e)
    else: lib[[x['slug'] for x in lib].index(e['slug'])] = e
if missing: print('缺少圖片：', missing)
json.dump(lib, open('lib/prompt-examples.json', 'w', encoding='utf8'), ensure_ascii=False, indent=2)
print('total entries', len(lib), 'webp bytes', sum(e.get('imageBytes', 0) for e in new))
