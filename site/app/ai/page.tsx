import Link from 'next/link';
import Image from 'next/image';
import topics from '@/lib/alice-topics.json';
import AiBuddyNote from '@/components/ai-buddy-note';
import './ai.css';

export const metadata={title:'Alice AI學院',description:`瀏覽 ${topics.length} 個 AI 入門、創作與生活實作主題，閱讀 Alice 六格漫畫。`,alternates:{canonical:'/ai/'}};
export default function AI(){return <section className="wrap section ai-academy-hero"><div className="ai-academy-copy"><p className="eyebrow gold">Alice · 漫畫學 AI</p><h1>Alice AI學院</h1><p className="lead">從 AI 入門、創作到生活應用，依年齡與需求找到適合自己的學習主題。</p><p className="ai-academy-count">完整收錄 <strong>{topics.length}</strong> 個學習主題，持續上架漫畫與實作內容。</p><Link className="button primary" href="/learn/">瀏覽全部主題 <span aria-hidden="true">→</span></Link><AiBuddyNote compact/></div><div className="ai-academy-art"><Image src="/media/characters/alice-ip.webp" alt="Alice AI學院角色形象" width={620} height={700} priority/></div></section>}
