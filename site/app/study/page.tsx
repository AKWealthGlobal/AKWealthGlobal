import Image from 'next/image';
import Link from 'next/link';
import './study.css';

export const metadata={title:'選擇學習教室',description:'進入 Alice AI學院或 Ken 財商教室。',alternates:{canonical:'/study/'}};

export default function StudyPage(){return <section className="wrap section study-entry">
  <p className="eyebrow">AK Wealth Global · 學習入口</p>
  <h1>今天想學什麼？</h1>
  <p className="lead">選擇一間教室，從漫畫與實作開始。</p>
  <div className="study-entry-grid">
    <Link href="/learn/" className="study-entry-card alice-entry">
      <Image src="/media/characters/alice-ip.webp" width={128} height={140} alt="Alice AI學院形象"/>
      <div><span className="eyebrow">AI・漫畫學習</span><h2>Alice AI學院</h2><p>從 AI 入門、創作到生活應用。</p><strong>進入 Alice AI學院 →</strong></div>
    </Link>
    <Link href="/money/" className="study-entry-card ken-entry">
      <Image src="/media/characters/ken-ip.webp" width={128} height={140} alt="Ken 財商教室形象"/>
      <div><span className="eyebrow">財商・漫畫學習</span><h2>Ken 財商教室</h2><p>透過生活故事，練習看懂金錢與風險。</p><strong>進入 Ken 財商教室 →</strong></div>
    </Link>
  </div>
</section>}
