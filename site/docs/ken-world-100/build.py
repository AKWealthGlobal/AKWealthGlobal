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
"fedFomc":("美國聯準會：FOMC 貨幣政策與公開聲明","https://www.federalreserve.gov/monetarypolicy/fomc.htm"),
"twBliRetirement":("臺灣勞保局：老年給付與退休金個人專戶","https://www.bli.gov.tw/0004857.html"),
"myEpfRetirement":("馬來西亞公積金局：退休儲蓄與提繳","https://www.kwsp.gov.my/en/member/savings"),
"twRentalLaw":("臺灣全國法規資料庫：租賃住宅市場發展及管理條例","https://law.moj.gov.tw/LawClass/LawAll.aspx?PCode=D0060125"),
"myTenancyGuide":("馬來西亞司法機關：民事審判指引（房東與租客）","https://ekss-portal.kehakiman.gov.my/portals/media/others/Civil_Trials_Guidebook.pdf"),
"twCivilCode":("臺灣全國法規資料庫：民法共有規定","https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000001"),
"myLandGuide":("馬來西亞土地及礦產局：土地移轉與土地權利指引","https://www.jkptg.gov.my/en/pemilik-tanah"),
"myIncomeTax":("馬來西亞內陸稅收局：個人所得稅說明","https://www.hasil.gov.my/en/individu/pengenalan-cukai-pendapatan-individu/"),
"oecdTaxTreaty2025":("OECD：2025 所得與資本稅約範本（2026 完整版）","https://www.oecd.org/en/publications/model-tax-convention-on-income-and-on-capital-2025-full-version_db32e18b-en.html"),
"oecdDigitalConsumer":("OECD：消費者政策與數位科技","https://www.oecd.org/en/topics/sub-issues/consumer-policy-and-digital-technologies.html"),
"myPropertyGuide":("馬來西亞經濟部：房產取得指引","https://ekonomi.gov.my/en/resources/guidelines-and-procedures/guideline-acquisition-properties"),
"twLandAct":("臺灣全國法規資料庫：土地法（含外國人取得土地規定）","https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0060001"),
"oecdCrs":("OECD：稅務金融帳戶資訊自動交換與 CRS","https://www.oecd.org/en/topics/sub-issues/international-standards-on-tax-transparency/tax-transparency-resource-centre.html"),
"myCrs":("馬來西亞內陸稅收局：共同申報準則 CRS","https://www.hasil.gov.my/antarabangsa/automatic-exchange-of-information-aeoi/common-reporting-standard-crs/"),
"twRentalIncomeTax":("臺灣財政部稅務入口網：個人出租房屋與土地所得","https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/individual-income-tax/taxation-scope/which-income/B9Z0L2W"),
"myInheritance":("馬來西亞政府入口網：遺產管理與繼承","https://www.malaysia.gov.my/en/categories/death--inheritance"),
"twInheritanceLaw":("臺灣全國法規資料庫：遺產及贈與稅法","https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=G0340072"),
"twRentalTemplate":("臺灣行政院：住宅租賃定型化契約應記載及不得記載事項","https://www.ey.gov.tw/Page/2285E9A14973DE75?Cate=1b3e6417-0767-47e5-adb8-192b16674889&M=S&page=1"),
"myEstateAgents":("馬來西亞估價師、評估師、房地產代理與物業管理局：註冊","https://lpeph.gov.my/registration"),
"twPersonalDataLaw":("臺灣全國法規資料庫：個人資料保護法","https://law.moj.gov.tw/LawClass/LawAll.aspx?PCode=I0050021"),
"myPersonalDataLaw":("馬來西亞個人資料保護局：個資法與官方指引","https://www.pdp.gov.my/ppdpv1/en/akta/pdp-act-2010-en/"),
"twCarbonFee":("臺灣全國法規資料庫：碳費收費辦法（2026-09 修正）","https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=O0020139"),
"twSustainabilityDisclosure":("臺灣金管會：IFRS 永續揭露準則適用規定","https://law.fsc.gov.tw/LawContent.aspx?id=GL004194"),
"mySustainabilityDisclosure":("馬來西亞證券交易所：IFRS 永續揭露準則規範公告","https://www.bursamalaysia.com/sites/5bb54be15f36ca0af339077a/content_entry5c11a9db758f8d31544574c6/6768e229e6414a4ba0eb9f4d/files/23122024__MEDIA_RELEASE_BURSA_MALAYSIA_REQUIRES_SUSTAINABILITY_REPORTING_USING_THE_IFRS_SUSTAINABILITY_DISCLOSURE_STANDARDS.pdf"),
"twTaxPortal":("臺灣財政部稅務入口網","https://www.etax.nat.gov.tw/etwmain/"),
"twLabour":("臺灣勞動部","https://www.mol.gov.tw/"),
"myLabour":("馬來西亞半島勞工局（JTKSM）：服務與勞動規則","https://jtksm.mohr.gov.my/en/services"),
"fscTwSustainability":("臺灣金管會：永續揭露接軌最新公告","https://esg.fsc.gov.tw/News/Detail/-%E6%8E%A5%E8%BB%8C%E5%9C%8B%E9%9A%9B-%E8%A1%8C%E7%A9%A9%E8%87%B4%E9%81%A0-%E7%92%B0%E5%A2%83%E9%83%A8-%E9%87%91%E7%AE%A1%E6%9C%83%E5%85%B1%E5%90%8C%E5%84%AA%E5%8C%96%E6%B0%B8%E7%BA%8C%E6%8F%AD%E9%9C%B2%E6%8E%A5%E8%BB%8C%E8%B7%AF-%E5%85%BC%E9%A1%A7%E8%B3%87%E8%A8%8A%E5%93%81%E8%B3%AA%E8%88%87%E7%94%A2%E6%A5%AD%E7%AB%B6%E7%88%AD%E5%8A%9B/"),
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
82:['iea'],83:['iea'],84:['iea'],89:['ipcc'],
1:['fedFomc'],37:['twBliRetirement','myEpfRetirement'],39:['twRentalLaw','myTenancyGuide'],43:['twCivilCode','myLandGuide'],
50:['oecdTaxTreaty2025','myIncomeTax','twTaxPortal','myLabour'],60:['oecdDigitalConsumer'],61:['myPropertyGuide','twLandAct'],62:['twLandAct','myLandGuide'],
63:['twRentalIncomeTax','myIncomeTax','oecdTaxTreaty2025'],65:['oecdCrs','myCrs'],66:['twInheritanceLaw','myInheritance'],
67:['twRentalTemplate','myTenancyGuide'],68:['myEstateAgents'],75:['twPersonalDataLaw','myPersonalDataLaw'],
85:['twCarbonFee'],86:['twSustainabilityDisclosure','mySustainabilityDisclosure']}
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
PENDING_OVERRIDES={
1:[],5:['查所在地消費者保護機關與金融監管機關，確認實物黃金交易、平台及投資商品的保障範圍。'],
37:[],39:[],43:[],
50:['臺灣：財政部、勞動部；馬來西亞：內陸稅收局（HASiL）、人力資源部／半島馬來西亞勞工局（JTKSM）。依稅務居住地、工作地與雇主所在地查現行規則。'],
60:['臺灣公平交易委員會、消費者保護處；馬來西亞國內貿易及生活成本部（KPDN）與個人資料保護局（JPDP）。按實際服務與所在地核對算法定價、個資和消費者權益。'],
61:['購屋成本與取得資格因國家、州省與城市而異；查目標地土地登記／地政、稅務、移民、住宅管理及不動產監管機關。'],
62:['土地所有權及居留資格分屬不同制度；查目標地土地／地政機關與移民機關的現行規則。'],
63:['查資產所在地與稅務居住地的稅務機關，以及兩地適用的租稅協定主管機關；OECD 範本不是個案裁定。'],
65:['查稅務居住地稅務機關、金融監管機關與 OECD CRS 主管機關的參與及交換規則。'],
66:['查遺產所在地法院／遺囑認證機關、地政及稅務機關；跨境情況需按資產及當事人身分確認。'],
67:[],68:[],75:['臺灣個人資料保護主管機關與法務部；馬來西亞個人資料保護局（JPDP）。另查雲端服務商與金融機構的安全及保留政策。'],
81:['查所在地水務監管機關、地方政府水務部門與實際供水業者；水價依供水區而異。'],
85:[],86:[]}

for row in out:
    n=row['meta']['comicNumber']-38
    if n in PENDING_OVERRIDES:
        row['meta']['pendingSources']=PENDING_OVERRIDES[n]
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
