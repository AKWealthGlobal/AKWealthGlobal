import Image from 'next/image';

export default function AiBuddyNote({compact=false}:{compact?:boolean}){
  return <aside className={`ai-buddy-note${compact?' compact':''}`} aria-label="AI 使用提醒">
    <Image src="/media/characters/ai-buddy.webp" alt="可愛的 AI 小夥伴" width={compact?78:96} height={compact?78:96} />
    <p><strong>AI 小夥伴提醒</strong><span>AI 可以協助整理想法，重要資訊記得核對來源。</span></p>
  </aside>;
}
