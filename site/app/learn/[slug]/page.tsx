import {notFound} from 'next/navigation';
import lessons from '@/lib/alice-lessons.json';
import AiBuddyNote from '@/components/ai-buddy-note';
import {AliceBackToTopics, AliceStoryNavigation} from '../AliceStoryNavigation';
import '../../money/ken.css';

export function generateStaticParams(){return lessons.map(({slug})=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const lesson=lessons.find(item=>item.slug===slug);return lesson?{title:`${lesson.title}｜Alice AI學院`,description:lesson.focus,alternates:{canonical:`/learn/${lesson.slug}/`}}:{title:'Alice AI學院'};}
export default async function Lesson({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const lesson=lessons.find(item=>item.slug===slug);if(!lesson)notFound();return <article className="wrap section ken-detail"><AliceBackToTopics/><p className="eyebrow gold">{lesson.code} · {lesson.group} · 六格漫畫</p><h1>{lesson.title}</h1><p className="lead">{lesson.focus}</p><AiBuddyNote/><section className="ken-original" aria-label={`${lesson.title}完整六格漫畫`}><img src={`/media/alice/alice-${lesson.slug}.webp`} alt={`${lesson.title}：Alice 與學習者透過六格故事練習 AI。`}/></section><section className="ken-learning"><h2>學習重點</h2><p>{lesson.lesson}</p><h2>一起練習</h2><p>{lesson.practice}</p><p>{lesson.caveat}</p>{lesson.supports&&<><h2>參考來源與求助資源</h2><p>來源與專線資訊以官方或原始資料頁面為準：</p><ul>{lesson.supports.map(source=><li key={source.label}><a href={source.href} target="_blank" rel="noreferrer">{source.label} ↗</a></li>)}</ul></>}</section><AliceStoryNavigation href={`/learn/${lesson.slug}/`}/></article>}
