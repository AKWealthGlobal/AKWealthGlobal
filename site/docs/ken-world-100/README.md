# Ken 看世界 100 篇｜腳本總覽（第 39–138 篇）

> 由 Claude 構思、2026-10-14 撰寫。`scripts.json` 為成品腳本（格式對齊 `lib/ken-episodes.json`，每筆含 `episode` 與 `meta`）；`new-sources.json` 為本批新增、已逐一打開核實的來源。
> **資料原則**：腳本與圖面皆不含具體數字（金額、百分比、排名）；只有第 40 篇引用已核實的 BLS 官方日期。法律／稅務題只講「要查哪些官方單位」，不給法律結論。
> **來源整理結果**：原列 16 篇「來源待補」中，15 篇已補官方法規或主管機關入口；第 119 篇因水價依城市及供水區而異，保留應查的水務主管機關、地方水務部門及供水業者。其餘 `meta.pendingSources` 是逐題需核實的主管機關、地點或原始文件清單，不得把機構首頁當成個案結論。

## 已核對的新來源入口（2026-10-14）

> 官方入口提供查核起點，不代表各地個案規則相同；涉及法律、稅務、資格或價格者，以適用地主管機關最新文件為準。世界黃金協會屬產業組織，非政府機關。

- `blsCpi`：[美國勞工統計局：消費者物價指數（CPI）首頁](https://www.bls.gov/cpi/)
- `blsSchedule`：[美國勞工統計局：2026年10月發布時程](https://www.bls.gov/schedule/2026/10_sched_list.htm)
- `investorDiversification`：[SEC Investor.gov：分散投資（Diversification）](https://www.investor.gov/introduction-investing/investing-basics/glossary/diversification)
- `whoAgeing`：[世界衛生組織：高齡化與健康（Ageing and health）](https://www.who.int/news-room/fact-sheets/detail/ageing-and-health)
- `wgcGoldhub`：[世界黃金協會：Goldhub 黃金數據與研究（產業組織資料）](https://www.gold.org/goldhub)
- `cbcTw`：[臺灣中央銀行](https://www.cbc.gov.tw/tw/mp-1.html)
- `fscTw`：[臺灣金融監督管理委員會](https://www.fsc.gov.tw/)
- `bnm`：[馬來西亞國家銀行（Bank Negara Malaysia）](https://www.bnm.gov.my/)
- `dosm`：[馬來西亞統計局（DOSM）](https://www.dosm.gov.my/)
- `ilo`：[國際勞工組織（ILO）](https://www.ilo.org/)
- `iea`：[國際能源署（IEA）](https://www.iea.org/)
- `ipcc`：[政府間氣候變遷專門委員會（IPCC）](https://www.ipcc.ch/)
- `wipo`：[世界智慧財產權組織（WIPO）](https://www.wipo.int/)
- `fao`：[聯合國糧食及農業組織（FAO）](https://www.fao.org/)
- `bis`：[國際清算銀行（BIS）](https://www.bis.org/)
- `fsb`：[金融穩定委員會（FSB）](https://www.fsb.org/)
- `wto`：[世界貿易組織（WTO）](https://www.wto.org/)
- `scMy`：[馬來西亞證券委員會（SC）](https://www.sc.com.my/)
- `unWpp`：[聯合國：世界人口展望（World Population Prospects）](https://population.un.org/wpp/)
- `fedFomc`：[美國聯準會：FOMC 貨幣政策與公開聲明](https://www.federalreserve.gov/monetarypolicy/fomc.htm)
- `twBliRetirement`：[臺灣勞保局：老年給付與退休金個人專戶](https://www.bli.gov.tw/0004857.html)
- `myEpfRetirement`：[馬來西亞公積金局：退休儲蓄與提繳](https://www.kwsp.gov.my/en/member/savings)
- `twRentalLaw`：[臺灣全國法規資料庫：租賃住宅市場發展及管理條例](https://law.moj.gov.tw/LawClass/LawAll.aspx?PCode=D0060125)
- `myTenancyGuide`：[馬來西亞司法機關：民事審判指引（房東與租客）](https://ekss-portal.kehakiman.gov.my/portals/media/others/Civil_Trials_Guidebook.pdf)
- `twCivilCode`：[臺灣全國法規資料庫：民法共有規定](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000001)
- `myLandGuide`：[馬來西亞土地及礦產局：土地移轉與土地權利指引](https://www.jkptg.gov.my/en/pemilik-tanah)
- `myIncomeTax`：[馬來西亞內陸稅收局：個人所得稅說明](https://www.hasil.gov.my/en/individu/pengenalan-cukai-pendapatan-individu/)
- `oecdTaxTreaty2025`：[OECD：2025 所得與資本稅約範本（2026 完整版）](https://www.oecd.org/en/publications/model-tax-convention-on-income-and-on-capital-2025-full-version_db32e18b-en.html)
- `oecdDigitalConsumer`：[OECD：消費者政策與數位科技](https://www.oecd.org/en/topics/sub-issues/consumer-policy-and-digital-technologies.html)
- `myPropertyGuide`：[馬來西亞經濟部：房產取得指引](https://ekonomi.gov.my/en/resources/guidelines-and-procedures/guideline-acquisition-properties)
- `twLandAct`：[臺灣全國法規資料庫：土地法（含外國人取得土地規定）](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0060001)
- `oecdCrs`：[OECD：稅務金融帳戶資訊自動交換與 CRS](https://www.oecd.org/en/topics/sub-issues/international-standards-on-tax-transparency/tax-transparency-resource-centre.html)
- `myCrs`：[馬來西亞內陸稅收局：共同申報準則 CRS](https://www.hasil.gov.my/antarabangsa/automatic-exchange-of-information-aeoi/common-reporting-standard-crs/)
- `twRentalIncomeTax`：[臺灣財政部稅務入口網：個人出租房屋與土地所得](https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/individual-income-tax/taxation-scope/which-income/B9Z0L2W)
- `myInheritance`：[馬來西亞政府入口網：遺產管理與繼承](https://www.malaysia.gov.my/en/categories/death--inheritance)
- `twInheritanceLaw`：[臺灣全國法規資料庫：遺產及贈與稅法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=G0340072)
- `twRentalTemplate`：[臺灣行政院：住宅租賃定型化契約應記載及不得記載事項](https://www.ey.gov.tw/Page/2285E9A14973DE75?Cate=1b3e6417-0767-47e5-adb8-192b16674889&M=S&page=1)
- `myEstateAgents`：[馬來西亞估價師、評估師、房地產代理與物業管理局：註冊](https://lpeph.gov.my/registration)
- `twPersonalDataLaw`：[臺灣全國法規資料庫：個人資料保護法](https://law.moj.gov.tw/LawClass/LawAll.aspx?PCode=I0050021)
- `myPersonalDataLaw`：[馬來西亞個人資料保護局：個資法與官方指引](https://www.pdp.gov.my/ppdpv1/en/akta/pdp-act-2010-en/)
- `twCarbonFee`：[臺灣全國法規資料庫：碳費收費辦法（2026-09 修正）](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=O0020139)
- `twSustainabilityDisclosure`：[臺灣金管會：IFRS 永續揭露準則適用規定](https://law.fsc.gov.tw/LawContent.aspx?id=GL004194)
- `mySustainabilityDisclosure`：[馬來西亞證券交易所：IFRS 永續揭露準則規範公告](https://www.bursamalaysia.com/sites/5bb54be15f36ca0af339077a/content_entry5c11a9db758f8d31544574c6/6768e229e6414a4ba0eb9f4d/files/23122024__MEDIA_RELEASE_BURSA_MALAYSIA_REQUIRES_SUSTAINABILITY_REPORTING_USING_THE_IFRS_SUSTAINABILITY_DISCLOSURE_STANDARDS.pdf)
- `twTaxPortal`：[臺灣財政部稅務入口網](https://www.etax.nat.gov.tw/etwmain/)
- `twLabour`：[臺灣勞動部](https://www.mol.gov.tw/)
- `myLabour`：[馬來西亞半島勞工局（JTKSM）：服務與勞動規則](https://jtksm.mohr.gov.my/en/services)
- `fscTwSustainability`：[臺灣金管會：永續揭露接軌最新公告](https://esg.fsc.gov.tw/News/Detail/-%E6%8E%A5%E8%BB%8C%E5%9C%8B%E9%9A%9B-%E8%A1%8C%E7%A9%A9%E8%87%B4%E9%81%A0-%E7%92%B0%E5%A2%83%E9%83%A8-%E9%87%91%E7%AE%A1%E6%9C%83%E5%85%B1%E5%90%8C%E5%84%AA%E5%8C%96%E6%B0%B8%E7%BA%8C%E6%8F%AD%E9%9C%B2%E6%8E%A5%E8%BB%8C%E8%B7%AF-%E5%85%BC%E9%A1%A7%E8%B3%87%E8%A8%8A%E5%93%81%E8%B3%AA%E8%88%87%E7%94%A2%E6%A5%AD%E7%AB%B6%E7%88%AD%E5%8A%9B/)

## 追加素材盤點

依 PR #9 分支 `origin/codex/added-comics-publication-prep` 的 `site/lib/added-comics.json` 與 `site/public/media/comics/added/` 盤點，共 11 個追加主題、每題 6 張舊版分鏡圖（66 張）。逐題比對合併後 `origin/main` 的漫畫資料，11 題都已用同題目收錄：Ken KA01／KA02／KB09 對應第 36–38 篇；Alice Q1、O01、O05、O11、O12、O02、O03、O04 對應 Alice 主題 106–113。這批舊圖只保留作場景參考，不沿用裁格加字的版式；Ken 新作使用 Ken IP 圖和 comic-13 作角色／畫風參考。追加素材仍是校稿稿件，原審閱記錄列出 O11/O02 的氣泡與肖像確認事項，不能視為已核准發布。

同分支另有 `comics/1929`、`2008`、`asia`、`dotcom`、`ftx`、`hongyuan`、`imb`、`japan`、`jpex`、`luna` 共 10 組既有六格分鏡圖（60 張，另有 10 張合成預覽）；它們是其他已編排漫畫素材，不屬於 `added-comics.json` 的 11 題追加清單，本批不沿用。

## 分類與編輯判斷

前台採七個白話主題分類（黃金與總體經濟、世界政策與市場、家庭世代與生活成本、科技工作與收入、跨境資產與法律、氣候能源與生活風險、資產配置與風險基礎）；PESTLE 留作後台選題標籤，避免讀者只看到學術代碼。系列名稱作第二層導讀，例如「Ken 看世界」「下一個10年」「第二個選擇」。100 篇清單保留每篇分類、系列、PESTLE 與時效。

腳本審閱重點：將第 39 篇改成預期、數據、利率／美元／風險情緒共同影響的框架，不把單一數據與單日金價反應寫成因果；第 40–41 篇改用整體／核心、月比／年比、原始報告等可驗證讀法，不說 BLS 發布市場預期；跨境法律題避免作全球概括並標明查核司法管轄區。其餘腳本保留情境式教學，不補無來源數字、不做價格預測或買賣建議。

## 100 篇清單

| 漫畫編號 | 標題 | 分類 | 系列 | PESTLE | 時效 | 來源 |
|---:|---|---|---|---|---|---|
| 39 | 一個數字，為什麼能讓黃金一天大震盪？ | 黃金與總體經濟 | 這跟你的錢有什麼關係？ | E | 中 | `blsCpi`、`goldDollar`、`fedFomc` |
| 40 | CPI 公布前，黃金投資人該先看哪三件事？ | 黃金與總體經濟 | 這跟你的錢有什麼關係？ | E | 高 | `blsCpi`、`blsSchedule` |
| 41 | CPI 出來了，市場到底看懂了什麼？（讀法篇） | 黃金與總體經濟 | 這跟你的錢有什麼關係？ | E | 高 | `blsCpi`、`blsSchedule`、`policy` |
| 42 | 黃金基金有人賣，央行卻在買，誰看錯了？ | 黃金與總體經濟 | 這跟你的錢有什麼關係？ | E | 中 | `centralBankGold`、`wgcGoldhub`、`imfReserves` |
| 43 | 黃金沒有信用風險，等於沒有風險嗎？ | 黃金與總體經濟 | 這跟你的錢有什麼關係？ | E | 低 | `gold`、`wgcGoldhub`；待查機構：查所在地消費者保護機關與金融監管機關，確認實物黃金交易、平台及投資商品的保障範圍。 |
| 44 | 如果明天突然要用錢，黃金還算好資產嗎？ | 黃金與總體經濟 | 如果真的發生了？ | E | 低 | `emergencyFund`、`gold` |
| 45 | 黃金 vs 現金：真正該留哪一個？ | 黃金與總體經濟 | 世界變了，你的資產呢？ | E | 中 | `inflation`、`gold`、`allocation` |
| 46 | 黃金跟美股比較，為什麼起點和期間會改變答案？ | 黃金與總體經濟 | 世界變了，你的資產呢？ | E | 中 | `index`、`goldPrice`、`stocks` |
| 47 | 黃金不配息，報酬的來源跟股票、債券有什麼不同？ | 黃金與總體經濟 | 這跟你的錢有什麼關係？ | E | 低 | `gold`、`stocks`、`allocation` |
| 48 | 買黃金有三種方式，風險各不一樣 | 黃金與總體經濟 | 這跟你的錢有什麼關係？ | E | 中 | `gold`、`funds`、`wgcGoldhub`；待查機構：各地銀行公告／各地金融監管機關 |
| 49 | 美國政策改變，普通家庭的錢會經過哪些路徑？ | 世界政策與市場 | Ken 看世界 | P | 高 | `policy`；待查機構：聯準會／台灣中央銀行／馬來西亞國家銀行 |
| 50 | 中美關係升溫，亞洲家庭會在哪裡感受到？ | 世界政策與市場 | Ken 看世界 | P | 高 | `policy`、`wto`；待查機構：美國貿易代表署／世界貿易組織／各地統計機關 |
| 51 | 戰爭離家庭資產有多遠？先看能源、航運還是情緒？ | 世界政策與市場 | 如果真的發生了？ | P | 高 | `oil1970s`、`policy`、`iea`；待查機構：美國能源資訊署／國際能源署／聯合國貿易和發展會議 |
| 52 | 為什麼企業和投資人會看別的國家的政策？ | 世界政策與市場 | Ken 看世界 | P | 中 | `policy`、`wto`；待查機構：世界貿易組織／經濟合作暨發展組織 |
| 53 | 關稅由誰付？出口商、進口商和消費者怎麼分擔？ | 世界政策與市場 | 這跟你的錢有什麼關係？ | P | 高 | `policy`、`wto`；待查機構：世界貿易組織／各地海關 |
| 54 | 制裁名單改變，跨境付款可能遇到什麼？ | 世界政策與市場 | 如果真的發生了？ | L | 高 | `fscTw`、`bnm`；待查機構：美國財政部海外資產控制辦公室／防制洗錢金融行動工作組織 |
| 55 | 選舉承諾變成政策，要經過哪些關卡？ | 世界政策與市場 | Ken 看世界 | P | 中 | `policy`；待查機構：各地立法與財政機關 |
| 56 | 政府預算赤字，和家庭欠卡債是一回事嗎？ | 世界政策與市場 | 這跟你的錢有什麼關係？ | P | 中 | `policy`；待查機構：國際貨幣基金組織財政監測報告／各地財政部 |
| 57 | 國債拍賣在做什麼？利率如何傳到生活？ | 世界政策與市場 | 這跟你的錢有什麼關係？ | E | 高 | `policy`；待查機構：美國財政部／各地央行與財政部 |
| 58 | 央行升息或降息，為什麼不會人人同時有感？ | 世界政策與市場 | 這跟你的錢有什麼關係？ | E | 高 | `policy`、`cbcTw`、`bnm` |
| 59 | 降息就代表股票一定漲嗎？ | 世界政策與市場 | 這跟你的錢有什麼關係？ | E | 高 | `policy`、`stocks` |
| 60 | 通膨怎麼吃掉購買力？薪水也要一起比 | 世界政策與市場 | 這跟你的錢有什麼關係？ | E | 中 | `inflation`、`blsCpi`、`dosm`；待查機構：台灣行政院主計總處 |
| 61 | 美元升值，亞洲家庭的旅費與進口品會怎樣？ | 世界政策與市場 | 這跟你的錢有什麼關係？ | E | 高 | `policy`、`cbcTw`、`bnm` |
| 62 | 景氣轉弱時，家庭先盤點哪幾種現金流？ | 世界政策與市場 | 如果真的發生了？ | E | 中 | `emergencyFund` |
| 63 | 供應鏈改道，為什麼商品價格不會立刻回到原點？ | 世界政策與市場 | Ken 看世界 | E | 中 | `policy`、`wto`；待查機構：世界貿易組織／聯合國貿易和發展會議 |
| 64 | 石油變貴，交通、食品和電費怎麼連動？ | 世界政策與市場 | 這跟你的錢有什麼關係？ | E | 高 | `oil1970s`、`policy`、`iea`；待查機構：美國能源資訊署／國際能源署 |
| 65 | 匯率變動，海外收入換回家用錢要注意什麼？ | 世界政策與市場 | 世界變了，你的資產呢？ | L | 中 | `cbcTw`、`bnm` |
| 66 | 外匯存底是什麼？它是國家的存款嗎？ | 世界政策與市場 | Ken 看世界 | P | 中 | `imfReserves`、`cbcTw`、`bnm` |
| 67 | 貿易逆差等於國家正在虧錢嗎？ | 世界政策與市場 | Ken 看世界 | E | 中 | `policy`、`imfReserves`、`wto`；待查機構：美國經濟分析局／世界貿易組織 |
| 68 | 市場每天都在變，哪些消息值得家庭追蹤？ | 世界政策與市場 | Ken 看世界 | E | 高 | `blsSchedule` |
| 69 | 少子化會怎麼改變工作、照護和家庭分工？ | 家庭世代與生活成本 | 下一個10年 | S | 中 | `unWpp`、`dosm`；待查機構：台灣內政部與國家發展委員會人口推估 |
| 70 | 人口變少，房價就一定下跌嗎？ | 家庭世代與生活成本 | 下一個10年 | S | 中 | `unWpp`、`dosm`、`cbcTw` |
| 71 | 年輕人為什麼延後買房？房價只是其中一個因素嗎？ | 家庭世代與生活成本 | 下一個10年 | S | 中 | `cbcTw`、`dosm` |
| 72 | 一個人生活，預算要多看哪幾類支出？ | 家庭世代與生活成本 | 下一個10年 | S | 中 | `emergencyFund`、`dosm`；待查機構：台灣行政院主計總處家庭收支調查 |
| 73 | 退休人口增加，哪些服務需求會跟著變？ | 家庭世代與生活成本 | 下一個10年 | S | 中 | `whoAgeing`、`unWpp` |
| 74 | 長照費用如何成為全家的共同規劃？ | 家庭世代與生活成本 | 下一個10年 | S | 中 | `whoAgeing`、`insuranceBasics`；待查機構：各地衛生與長照主管機關 |
| 75 | 退休金從哪裡來？公共制度、雇主與個人怎麼分工？ | 家庭世代與生活成本 | 下一個10年 | S | 中 | `twBliRetirement`、`myEpfRetirement` |
| 76 | 平均壽命變長，退休準備的時間尺度怎麼想？ | 家庭世代與生活成本 | 下一個10年 | S | 中 | `whoAgeing`、`unWpp` |
| 77 | 租屋、買屋各自承擔哪些成本和責任？ | 家庭世代與生活成本 | 這跟你的錢有什麼關係？ | S | 中 | `twRentalLaw`、`myTenancyGuide` |
| 78 | 房貸利率變動，月付金為什麼跟著變？ | 家庭世代與生活成本 | 這跟你的錢有什麼關係？ | E | 高 | `policy`、`cbcTw`、`bnm` |
| 79 | 房價之外，買房還有哪些一次性與持有成本？ | 家庭世代與生活成本 | 這跟你的錢有什麼關係？ | E | 中 | `insuranceBasics`；待查機構：各地稅務與地政機關 |
| 80 | 家庭收入不固定，怎麼安排必要支出與緩衝？ | 家庭世代與生活成本 | 世界變了，你的資產呢？ | S | 低 | `emergencyFund` |
| 81 | 家人合資買房，事前要談清楚哪些事？ | 家庭世代與生活成本 | 第二個選擇 | L | 中 | `twCivilCode`、`myLandGuide` |
| 82 | 失業保險和緊急預備金，各自能做什麼？ | 家庭世代與生活成本 | 如果真的發生了？ | S | 中 | `emergencyFund`；待查機構：各地勞動主管機關 |
| 83 | 物價指數是平均數，為什麼每個家庭感受不同？ | 家庭世代與生活成本 | 這跟你的錢有什麼關係？ | S | 中 | `blsCpi`、`inflation`、`dosm` |
| 84 | AI 最先改變哪些工作任務？先拆任務再談職業 | 科技工作與收入 | 下一個10年 | T | 中 | `ilo`；待查機構：國際勞工組織／經濟合作暨發展組織 |
| 85 | AI 時代，只靠一份薪水有哪些風險與選擇？ | 科技工作與收入 | 如果真的發生了？ | T | 中 | `emergencyFund`、`ilo`；待查機構：國際勞工組織 |
| 86 | 用 AI 放大收入，先算工具成本與交付責任 | 科技工作與收入 | 下一個10年 | T | 中 | `wipo`；待查機構：世界智慧財產權組織／各地消費者保護機關 |
| 87 | 自動化提高效率，成果由誰分享？ | 科技工作與收入 | 下一個10年 | T | 中 | `ilo`；待查機構：經濟合作暨發展組織／國際勞工組織 |
| 88 | 遠距工作跨國領薪，稅務和勞動規則看哪裡？ | 科技工作與收入 | 第二個選擇 | L | 高 | `oecdTaxTreaty2025`、`myIncomeTax`、`twTaxPortal`、`myLabour`；待查機構：臺灣：財政部、勞動部；馬來西亞：內陸稅收局（HASiL）、人力資源部／半島馬來西亞勞工局（JTKSM）。依稅務居住地、工作地與雇主所在地查現行規則。 |
| 89 | 平台接案的收入不穩，如何看懂現金流？ | 科技工作與收入 | 世界變了，你的資產呢？ | T | 中 | `emergencyFund` |
| 90 | 演算法排班，工作者要了解哪些權利？ | 科技工作與收入 | Ken 看世界 | L | 中 | `ilo`；待查機構：各地勞動主管機關 |
| 91 | AI 生成內容可以拿去商用嗎？先查哪些權利？ | 科技工作與收入 | Ken 看世界 | L | 高 | `wipo`；待查機構：世界智慧財產權組織／各地著作權主管機關 |
| 92 | AI 整理投資資料，哪些地方仍要回到原始文件？ | 科技工作與收入 | 世界變了，你的資產呢？ | T | 高 | `stocks`、`funds`；待查機構：美國證券交易委員會 EDGAR／美國金融業監管局 |
| 93 | 加密貨幣和區塊鏈分別是什麼？ | 科技工作與收入 | 下一個10年 | T | 中 | `fscTw`、`bis`；待查機構：國際清算銀行／美國國家標準暨技術研究院 |
| 94 | 穩定幣的「穩」靠什麼安排？ | 科技工作與收入 | 如果真的發生了？ | T | 高 | `terra`、`fsb`、`bis`；待查機構：金融穩定委員會／國際清算銀行 |
| 95 | 區塊鏈能解決什麼問題？哪些問題它解決不了？ | 科技工作與收入 | 下一個10年 | T | 低 | `bis`；待查機構：美國國家標準暨技術研究院／國際清算銀行 |
| 96 | 數位錢包遺失手機，資產和帳戶怎麼分別處理？ | 科技工作與收入 | 如果真的發生了？ | T | 中 | `fscTw`；待查機構：各金融機構官方說明 |
| 97 | 資料中心需要電和水，成本由哪些人承擔？ | 科技工作與收入 | 下一個10年 | T | 高 | `iea`；待查機構：國際能源署／各地能源與水務主管機關 |
| 98 | AI 讓公司更有效率，消費者會感受到什麼改變？ | 科技工作與收入 | 下一個10年 | T | 中 | `oecdDigitalConsumer`；待查機構：臺灣公平交易委員會、消費者保護處；馬來西亞國內貿易及生活成本部（KPDN）與個人資料保護局（JPDP）。按實際服務與所在地核對算法定價、個資和消費者權益。 |
| 99 | 海外買房不能只看房價，還要問哪六件事？ | 跨境資產與法律 | 第二個選擇 | L | 高 | `myPropertyGuide`、`twLandAct`；待查機構：購屋成本與取得資格因國家、州省與城市而異；查目標地土地登記／地政、稅務、移民、住宅管理及不動產監管機關。 |
| 100 | 外國人買房，土地權利和居留權是兩回事嗎？ | 跨境資產與法律 | 第二個選擇 | L | 高 | `twLandAct`、`myLandGuide`、`myPropertyGuide`；待查機構：土地所有權及居留資格分屬不同制度；查目標地土地／地政機關與移民機關的現行規則。 |
| 101 | 海外房租收入要在哪裡申報？ | 跨境資產與法律 | 第二個選擇 | L | 高 | `twRentalIncomeTax`、`myIncomeTax`、`oecdTaxTreaty2025`；待查機構：查資產所在地與稅務居住地的稅務機關，以及兩地適用的租稅協定主管機關；OECD 範本不是個案裁定。 |
| 102 | 跨境匯款有哪些費用、匯率與身分查核？ | 跨境資產與法律 | 第二個選擇 | L | 中 | `fscTw`、`bnm`、`cbcTw` |
| 103 | 海外帳戶和資產，哪些資料申報規則可能適用？ | 跨境資產與法律 | 第二個選擇 | L | 高 | `oecdCrs`、`myCrs`；待查機構：查稅務居住地稅務機關、金融監管機關與 OECD CRS 主管機關的參與及交換規則。 |
| 104 | 遺產在不同國家，法律會怎麼交會？ | 跨境資產與法律 | 第二個選擇 | L | 高 | `twInheritanceLaw`、`myInheritance`；待查機構：查遺產所在地法院／遺囑認證機關、地政及稅務機關；跨境情況需按資產及當事人身分確認。 |
| 105 | 租約看不懂，哪些條款要先釐清？ | 跨境資產與法律 | 第二個選擇 | L | 中 | `twRentalTemplate`、`myTenancyGuide` |
| 106 | 海外房產的仲介、代管和空置責任怎麼查？ | 跨境資產與法律 | 第二個選擇 | L | 中 | `myEstateAgents` |
| 107 | Crypto 法規改變時，平台、資產和用戶義務有何差異？ | 跨境資產與法律 | Ken 看世界 | L | 高 | `fscTw`、`fsb`；待查機構：金融穩定委員會 |
| 108 | 投資平台受哪個監管機關管？怎麼查登記資料？ | 跨境資產與法律 | Ken 看世界 | L | 高 | `fscTw`、`imb`、`jpex`、`scMy`；待查機構：馬來西亞證券委員會投資人警示名單 |
| 109 | 存款保障、投資人補償和平台承諾有何不同？ | 跨境資產與法律 | Ken 看世界 | L | 中 | `fscTw`、`bnm`；待查機構：存款保險機構 |
| 110 | 跨境買保險，保障範圍跟理賠地點怎麼確認？ | 跨境資產與法律 | 第二個選擇 | L | 中 | `insuranceBasics`；待查機構：各地保險監理機關 |
| 111 | 海外投資廣告說「保證收益」，要先查什麼？ | 跨境資產與法律 | Ken 看世界 | L | 高 | `hongyuan`、`madoff`、`fscTw` |
| 112 | 制裁、反洗錢規則會如何影響交易流程？ | 跨境資產與法律 | Ken 看世界 | L | 高 | `fscTw`、`bnm`；待查機構：防制洗錢金融行動工作組織 |
| 113 | 跨境家庭如何保存重要合約、稅單和帳戶紀錄？ | 跨境資產與法律 | 第二個選擇 | L | 中 | `twPersonalDataLaw`、`myPersonalDataLaw`；待查機構：臺灣個人資料保護主管機關與法務部；馬來西亞個人資料保護局（JPDP）。另查雲端服務商與金融機構的安全及保留政策。 |
| 114 | 極端高溫會如何影響電費、工作和健康支出？ | 氣候能源與生活風險 | 下一個10年 | Env | 中 | `ipcc`、`whoAgeing`；待查機構：所在地即時預警和健康指引應再查氣象與衛生主管機關；IPCC 是全球評估，不是地方即時預警。 |
| 115 | 看房時，水災風險要查哪些官方地圖？ | 氣候能源與生活風險 | 下一個10年 | Env | 中 | `insuranceBasics`；待查機構：所在地水利、地理資訊與災害防救機關；需核對圖資更新日期、解析度與淹水情境。 |
| 116 | 房屋保險有保到水災嗎？ | 氣候能源與生活風險 | 如果真的發生了？ | Env | 中 | `insuranceBasics` |
| 117 | 災後申請理賠，要先準備哪些紀錄？ | 氣候能源與生活風險 | 如果真的發生了？ | Env | 中 | `insuranceBasics` |
| 118 | 乾旱會如何影響農作、食品價格與家庭採買？ | 氣候能源與生活風險 | 下一個10年 | Env | 中 | `fao`；待查機構：所在地農業主管機關、統計機關與市場價格資料；全球資料不代表當地作物和價格。 |
| 119 | 缺水地區的城市，家庭用水成本可能如何改變？ | 氣候能源與生活風險 | 下一個10年 | Env | 中 | 待查機構：查所在地水務監管機關、地方政府水務部門與實際供水業者；水價依供水區而異。 |
| 120 | 熱浪時電力需求上升，電網如何因應？ | 氣候能源與生活風險 | 下一個10年 | Env | 高 | `iea`；待查機構：所在地電力系統營運者與能源主管機關；實際措施依當地電網公告。 |
| 121 | 電價為什麼不一定跟著燃料價格同步調整？ | 氣候能源與生活風險 | Ken 看世界 | Env | 高 | `iea`；待查機構：所在地電力主管機關、監管機構與公用事業費率公告；IEA 僅作背景，須指定地區查現行費率。 |
| 122 | 能源轉型需要哪些設備與原料？供應鏈風險在哪？ | 氣候能源與生活風險 | 下一個10年 | Env | 中 | `iea`；待查機構：IEA、USGS 與所在地能源／礦業主管機關；供應鏈結論須對照當期資料。 |
| 123 | 碳費或碳稅怎麼影響企業成本與消費者？ | 氣候能源與生活風險 | Ken 看世界 | Env | 高 | `twCarbonFee` |
| 124 | 碳排揭露是什麼？和公司的財務表現如何區分？ | 氣候能源與生活風險 | Ken 看世界 | Env | 高 | `twSustainabilityDisclosure`、`mySustainabilityDisclosure`、`fscTwSustainability` |
| 125 | 氣候風險如何進入銀行和保險公司的風險管理？ | 氣候能源與生活風險 | 下一個10年 | Env | 中 | `bnm`、`cbcTw`；待查機構：央行與監理機構綠色金融網絡 |
| 126 | 森林火災風險，會影響住房、保險與地方工作嗎？ | 氣候能源與生活風險 | 下一個10年 | Env | 中 | `insuranceBasics`；待查機構：各地消防與林業機關 |
| 127 | 海平面上升是長期議題，地方規劃資料怎麼看？ | 氣候能源與生活風險 | 下一個10年 | Env | 中 | `ipcc`；待查機構：所在地海岸管理、地理資訊與地方規劃機關；核對本地情境、地圖版本與尺度。 |
| 128 | 氣候災害讓供應中斷，家庭有哪些非投資型準備？ | 氣候能源與生活風險 | 如果真的發生了？ | Env | 中 | `emergencyFund`；待查機構：各地災害防救機關 |
| 129 | 股票、黃金、現金和房產，分別承擔什麼風險？ | 資產配置與風險基礎 | 世界變了，你的資產呢？ | E | 低 | `stocks`、`gold`、`inflation`、`allocation` |
| 130 | 資產配置先看目標和期限，為什麼沒有人人通用的比例？ | 資產配置與風險基礎 | 世界變了，你的資產呢？ | E | 低 | `allocation`、`investorDiversification` |
| 131 | 借錢投資會放大什麼？利息、追繳與流動性風險 | 資產配置與風險基礎 | 如果真的發生了？ | E | 中 | `stocks`、`allocation`；待查機構：美國金融業監管局／各地證券監管機關 |
| 132 | 賣出時，價差、手續費和稅怎麼讓你實際拿到的比想像少？ | 資產配置與風險基礎 | 這跟你的錢有什麼關係？ | E | 低 | `funds`、`allocation` |
| 133 | 投資費用看起來很小，長期比較要看哪些項目？ | 資產配置與風險基礎 | 這跟你的錢有什麼關係？ | E | 中 | `funds`；待查機構：美國金融業監管局／基金公開說明書 |
| 134 | 報酬率、波動和最大跌幅，各自回答什麼問題？ | 資產配置與風險基礎 | 這跟你的錢有什麼關係？ | E | 低 | `index`、`stocks`；待查機構：基金公開說明書 |
| 135 | 分散投資能降低哪些風險？哪些風險還在？ | 資產配置與風險基礎 | 世界變了，你的資產呢？ | E | 低 | `investorDiversification`、`allocation` |
| 136 | 為什麼同一個市場消息，不同資產反應不一樣？ | 資產配置與風險基礎 | Ken 看世界 | P | 高 | `policy`、`gold` |
| 137 | 新聞出現一個漂亮數字，怎麼找它的原始定義？ | 資產配置與風險基礎 | Ken 看世界 | T | 高 | `blsCpi`、`blsSchedule` |
| 138 | 家庭面對世界變化，怎麼把新聞變成可檢查的問題？ | 資產配置與風險基礎 | Ken 看世界 | P | 中 | `blsSchedule`、`policy` |
