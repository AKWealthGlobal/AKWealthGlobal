const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const topicsPath=path.join(root,'lib/alice-topics.json');
const lessonsPath=path.join(root,'lib/alice-lessons.json');
const entries=[
{code:'E1',slug:'care-voice-reminder',title:'「媽，該吃藥囉」',focus:'用語音提醒與電話協助照護，但服藥仍由家人或照護者確認。',lesson:'手機可以設定語音提醒或電話提醒，協助家人記得照護安排。提醒不代表已服藥；是否服用仍由本人、家人或照護者依原有安排確認。',practice:'設定一個日常提醒，確認時間和接收對象正確，再與照護者約定如何確認完成。',caveat:'不要自行更改藥量或服藥時間；有疑問請詢問醫師或藥師。求助：長照服務 1966；家庭照顧者 0800-507-272；失智症 0800-474-580。'},
{code:'E2',slug:'care-voice-journal',title:'照顧日誌用說的',focus:'口述照護紀錄，整理成看診摘要與問題清單，由醫療人員判斷。',lesson:'照顧者可用口述記下睡眠、食慾或活動等觀察，再請 AI 整理成摘要和看診問題。AI 只協助整理，不診斷；摘要需由家人核對，醫療判斷交給醫療人員。',practice:'以不含姓名等識別資料的日常觀察做一份摘要，核對日期、頻率和原意後帶去看診。',caveat:'避免輸入可識別身分的健康資料；若出現急迫或嚴重症狀，直接尋求醫療協助。求助：長照服務 1966；家庭照顧者 0800-507-272；失智症 0800-474-580。'},
{code:'E4',slug:'care-memory-album',title:'阿嬤的回憶相簿',focus:'用照片與開放式問題整理回憶，不催促、不替本人補寫。',lesson:'AI 可以協助整理照片說明和口述故事。讓長輩決定想分享什麼，不確定的年份或人名先標記待確認，不讓 AI 自行補出細節。',practice:'挑一張已取得同意的家庭照片，問一個開放問題，再由本人核對整理後的文字。',caveat:'尊重本人意願與隱私；分享照片和故事前取得同意。求助：長照服務 1966；家庭照顧者 0800-507-272；失智症 0800-474-580。'},
{code:'E5',slug:'care-bilingual-cards',title:'跟 Siti 說說話',focus:'製作中、英、印尼文照護卡，請熟悉語言的人校對並確認理解。',lesson:'簡短的多語照護卡能協助日常溝通，但 AI 翻譯可能不自然或有誤。重要照護內容請熟悉該語言的人校對，再以尊重的方式確認彼此理解。',practice:'選一項日常需求，寫成短句並翻成對方熟悉的語言，請熟悉該語言的人校對後再試用。',caveat:'涉及藥物、過敏或緊急狀況時，不要只依賴機器翻譯；請由家人或專業人員確認。求助：長照服務 1966；家庭照顧者 0800-507-272；失智症 0800-474-580。'},
{code:'E6',slug:'care-shared-calendar',title:'全家共用一本行事曆',focus:'整理探訪、復健與領藥安排，分享前確認權限和資訊。',lesson:'共用行事曆可整理探訪、復健和領藥等事項，AI 可協助把口述安排整理成清單。家人需確認日期、負責人與提醒，並只向需要的人分享。',practice:'先建立一週照護行程，逐項確認日期、負責人和提醒，再與相關家人分享。',caveat:'行事曆含有個人健康與行程資訊，設定適當分享權限；不要把敏感資料公開。求助：長照服務 1966；家庭照顧者 0800-507-272；失智症 0800-474-580。'},
{code:'F2',slug:'fun-zodiac-astrology',title:'星座說我今天會發財？',focus:'把星座當娛樂，不依占星內容做投資或重大財務決定。',lesson:'星座與占星內容可以作為娛樂或聊天話題，但不能驗證個人財運，也不是投資依據。投資前要了解風險、查閱可靠資料，必要時尋求合格專業人士意見。',practice:'看到「今天一定會發財」的說法時，寫下有哪些可查證的事實，再決定是否忽略這項預測。',caveat:'不因占卜或星座建議匯款、借貸或購買投資商品；高報酬保證常是警訊。'},
{code:'F3',slug:'fun-iching',title:'易經卦辭，AI 會背錯？',focus:'核對易經原典版本，把 AI 解說視為文化討論而非預測。',lesson:'AI 可能把卦名、原文或出處說錯。閱讀易經時可對照可靠版本核對文字，再把解說當成文化與哲學討論，不當作確定的未來預測。',practice:'請 AI 解說一段卦辭，再用可靠原典核對字句與章節，標出不同處。',caveat:'不要以占卜結果取代醫療、法律、財務或安全方面的專業判斷。'},
{code:'F4',slug:'fun-name-strokes',title:'幫孫子取名字',focus:'AI 可提供命名靈感；字義、筆畫與家庭考量由家人核對。',lesson:'AI 能列出名字靈感和字義，但字典讀音、筆畫算法或文化含意可能有誤。請查可信字典與家族採用的規則，也讓家人共同決定名字是否合適。',practice:'請 AI 提供幾個名字靈感，再逐一查字典核對讀音、字義與筆畫來源。',caveat:'命名規則因家庭與資料來源而異；重要登記資訊請依主管機關規定確認。'},
{code:'F5',slug:'fun-tarot-scam',title:'塔羅牌與花錢改運',focus:'把塔羅當自我反思，不為恐嚇式改運服務付款。',lesson:'塔羅可以作為整理心情的提問方式，但不能證明未來。若有人以災禍、詛咒或限時消災恐嚇你付費，先停止付款、與可信任的人討論，並可撥打 165 諮詢。',practice:'把牌卡解讀改寫成一個自我反思問題，例如「我現在最在意什麼？」而不是預測結果。',caveat:'不要因占卜說法交出金錢、帳戶資料或驗證碼；遇到疑似詐騙可向警政署 165 諮詢。'}
];
const topics=JSON.parse(fs.readFileSync(topicsPath,'utf8'));
let lessons=JSON.parse(fs.readFileSync(lessonsPath,'utf8'));
for(const e of entries){const t=topics.find(x=>x.code===e.code&&x.source==='實用技能'&&x.group===(e.code.startsWith('E')?'長照照護':'文化遊樂園'));if(!t)throw Error('missing topic '+e.code);t.status='漫畫已完成';t.href='/learn/'+e.slug+'/';lessons=lessons.filter(x=>x.slug!==e.slug);lessons.push({slug:e.slug,code:e.code,title:e.title,group:t.group,focus:e.focus,lesson:e.lesson,practice:e.practice,caveat:e.caveat});}
fs.writeFileSync(topicsPath,JSON.stringify(topics,null,2)+'\n');
fs.writeFileSync(lessonsPath,JSON.stringify(lessons,null,2)+'\n');
console.log(JSON.stringify({updated:entries.length,slugs:entries.map(e=>e.slug)}));
