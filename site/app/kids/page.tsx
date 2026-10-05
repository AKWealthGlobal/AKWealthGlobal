import KidsGame from '@/components/kids-game';import Link from 'next/link';export const metadata={title:'存存夢想島｜親子財商',description:'三個任務、10 枚虛擬金幣，在 3D 夢想島練習儲蓄、花費與分享。免登入的親子財商小遊戲。',alternates:{canonical:'/kids/'}};
const steps=[['開啟夢想島','按下「開啟 3D 夢想島」，看看島上的三個小罐子。'],['選一個任務','從自由分配開始，再挑戰存錢買故事書、好朋友的生日。'],['分配 10 枚金幣','把金幣放進罐子，說說你為什麼這樣分。']];
const talks=[['任務 1：自由分配','先不給建議，讓孩子自己分。','「你最想先完成哪一件事？為什麼？」'],['任務 2：存錢買故事書','練習「等一等」：今天少花一點，下星期就能得到想要的東西。','「如果今天先花掉，下星期會怎樣？」'],['任務 3：好朋友的生日','同時照顧自己和別人，學會在不同需要之間取捨。','「還有哪些不用花錢的心意？」']];
export default function Kids(){return <div className="wrap section"><p className="eyebrow gold">陪孩子一起，把錢弄懂</p><h1>歡迎來到<br/><span className="gold">存存夢想島。</span></h1><p className="lead">三個小任務，一次小小的選擇，也是一堂財商課。</p>
<section aria-labelledby="how"><h2 id="how">怎麼玩</h2><ol className="how-steps">{steps.map(([t,d],i)=><li key={t}><span className="article-num">{i+1}</span><h3>{t}</h3><p>{d}</p></li>)}</ol><p className="small muted">建議 5–10 歲，和家人一起玩，每個任務約 5 分鐘。</p></section>
<KidsGame/>
<section className="reader-surface"><h2>給一起玩的家人</h2><p>先讓孩子自己分配，再問他原因。沒有唯一的標準答案，重點是說出理由。</p>{talks.map(([t,goal,q])=><div key={t} className="talk"><h3>{t}</h3><p>{goal}</p><p><b>可以問：</b>{q}</p></div>)}<Link className="button primary" href="/resources/kids-sheet/">下載親子學習單</Link><p className="small">免登入、不收集孩子的個人資料、不放商品廣告。</p></section></div>}
