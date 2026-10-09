import type {Metadata} from 'next';
import {Header,BottomNav,Footer} from '@/components/ui';
import './globals.css';
import './added-comics.css';
const site=process.env.NEXT_PUBLIC_SITE_URL||'https://ak-wealth-global.vercel.app';
export const metadata:Metadata={...(site?{metadataBase:new URL(site)}:{}),title:{default:'AK Wealth Global｜學 AI，懂金錢',template:'%s｜AK Wealth Global'},description:'Alice AI 學院、Ken 財商漫畫與親子財商探索。繁體中文教學、免費工具包，從一個小練習開始。',openGraph:{title:'AK Wealth Global｜學 AI，懂金錢',description:'從一個小練習開始，免費探索 AI 與財商。',locale:'zh_TW',type:'website'},robots:{index:true,follow:true}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-Hant"><body><a href="#main" className="skip-link">跳到主要內容</a><Header/><main id="main">{children}</main><Footer/><BottomNav/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'Organization',name:'AK Wealth Global',description:'繁體中文 AI 與財商教育',...(site?{url:site}:{} )})}}/></body></html>}
