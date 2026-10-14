import json,re,collections,sys
from pathlib import Path
HERE=Path(__file__).resolve().parent
LIB=HERE.parent.parent/'lib'
sys.path.insert(0,str(HERE))
from part3 import SCRIPTS as R
SER={"KW":"Ken 看世界","MM":"這跟你的錢有什麼關係？","IF":"如果真的發生了？","AS":"世界變了，你的資產呢？","NT":"下一個10年","SC":"第二個選擇"}
CAT={"G":"黃金與總體經濟","W":"世界政策與市場","F":"家庭世代與生活成本","T":"科技工作與收入","X":"跨境資產與法律","C":"氣候能源與生活風險","B":"資產配置與風險基礎"}
newsrc={
"blsCpi":("美國勞工統計局：消費者物價指數（CPI）首頁","https://www.bls.gov/cpi/"),
"blsSchedule":("美國勞工統計局：2026年10月發布時程","https://www.bls.gov/schedule/2026/10_sched_list.htm"),
"investorDiversification":("SEC Investor.gov：分散投資（Diversification）","https://www.investor.gov/introduction-investing/investing-basics/glossary/diversification"),
"whoAgeing":("世界衛生組織：高齡化與健康（Ageing and health）","https://www.who.int/news-room/fact-sheets/detail/ageing-and-health"),
"wgcGoldhub":("世界黃金協會：Goldhub 黃金數據與研究（產業組織資料）","https://www.gold.org/goldhub"),
"cbcTw":("臺灣中央銀行","https://www.cbc.gov.tw/tw/mp-1.html"),
"fscTw":("臺灣金融監督管理委員會","https://www.fsc.gov.tw/"),
"bnm":("馬來西亞國家銀行（Bank Negara Malaysia）","https://www.bnm.gov.my/"),
"dosm":("馬來西亞統計局（DOSM）","https://www.dosm.gov.my/"),
"ilo":("國際勞工組織（ILO）","https://www.ilo.org/"),
"iea":("國際能源署（IEA）","https://www.iea.org/"),
"ipcc":("政府間氣候變遷專門委員會（IPCC）","https://www.ipcc.ch/"),
"wipo":("世界智慧財產權組織（WIPO）","https://www.wipo.int/"),
"fao":("聯合國糧食及農業組織（FAO）","https://www.fao.org/"),
"bis":("國際清算銀行（BIS）","https://www.bis.org/"),
"fsb":("金融穩定委員會（FSB）","https://www.fsb.org/"),
"wto":("世界貿易組織（WTO）","https://www.wto.org/"),
"scMy":("馬來西亞證券委員會（SC）","https://www.sc.com.my/"),
"unWpp":("聯合國：世界人口展望（World Population Prospects）","https://population.un.org/wpp/"),
}
def read_json(path):
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except (OSError, json.JSONDecodeError) as err:
        sys.exit(f'cannot read {path}: {err}')

def write_json(path, data):
    try:
        path.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding='utf-8')
    except OSError as err:
        sys.exit(f'cannot write {path}: {err}')

ex=read_json(LIB/'ken-episodes.json')
exsrc=read_json(LIB/'ken-sources.json')
known=set(exsrc)|set(newsrc)
extitles={e['title'] for e in ex}
errs=[]
ADD={12:['wto'],14:['wto'],15:['wto'],25:['wto'],29:['wto'],13:['iea'],26:['iea'],46:['ilo'],47:['ilo'],49:['ilo'],52:['ilo'],
48:['wipo'],53:['wipo'],55:['bis'],56:['fsb','bis'],57:['bis'],59:['iea'],69:['fsb'],70:['scMy'],76:['ipcc'],80:['fao'],
82:['iea'],83:['iea'],84:['iea'],89:['ipcc']}
for r in R:
    for k in ADD.get(r['n'],[]):
        if k not in r['source']: r['source'].append(k)
out=[]
for r in sorted(R,key=lambda x:x['n']):
    n=r['n']
    if len(r['scenes'])!=4: errs.append((n,'scenes'))
    if len(r['lines'])!=4: errs.append((n,'lines'))
    for l in r['lines']:
        if not re.match(r'^[^：]{1,6}：.+',l): errs.append((n,'fmt',l))
        if len(l)>24: errs.append((n,'long',l,len(l)))
        if re.search(r'\d',l): errs.append((n,'digit-line',l))
    for s in r['scenes']:
        if re.search(r'\d',s): errs.append((n,'digit-scene',s))
    for k in r['source']:
        if k not in known: errs.append((n,'badsrc',k))
    if r['title'] in extitles: errs.append((n,'dup-existing',r['title']))
    e=dict(title=r['title'],age="18歲＋",concept=r['concept'],category=CAT[r['category']],
           scenes=r['scenes'],lines=r['lines'],lesson=r['lesson'],question=r['question'],source=r['source'])
    if r['editorialNote']: e['editorialNote']=r['editorialNote']
    meta=dict(comicNumber=38+n,series=SER[r['series']],pestle=r['pestle'],timeliness=r['timeliness'],pendingSources=r['pendingSources'])
    out.append(dict(episode=e,meta=meta))
ns=[r['n'] for r in R]
if ns!=list(range(1,101)): errs.append(('n-seq',len(ns)))
t=[r['title'] for r in R]
dups=[k for k,v in collections.Counter(t).items() if v>1]
if dups: errs.append(('dups',dups))
print('entries',len(R),'errors',errs)
print(collections.Counter(CAT[r['category']] for r in R))
print(collections.Counter(SER[r['series']] for r in R))
print(collections.Counter(r['timeliness'] for r in R))
print('no verified source:',[r['n'] for r in R if not r['source']])
write_json(HERE/'scripts.json',out)
write_json(HERE/'new-sources.json',{k:dict(name=v[0],url=v[1]) for k,v in newsrc.items()})
