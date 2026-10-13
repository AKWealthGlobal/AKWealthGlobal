import ExamplePromptLibrary from '@/components/example-prompt-library';
import './examples.css';
import entries from '@/lib/prompt-examples.json';
const categoryCount=new Set(entries.map(e=>e.category)).size;
const originalCount=entries.filter(e=>e.source==='AK Wealth Global 原創提示詞').length;
export const metadata={title:'提示詞資料庫',description:`${entries.length}組圖片生成提示詞與示範圖，涵蓋品牌行銷、古風歷史、世界傳統服飾、旅遊與台灣景點、年代造型、懷舊插畫、皮克斯 3D 故事插畫、熟齡人生影像、毛孩影像、東方神話與國漫奇幻、行銷海報、寫實人像、婚紗、穿搭與Q版貼圖。可搜尋、細分類及複製。`,alternates:{canonical:'/prompts/'}};
export default function Prompts(){return <div className="wrap section example-library"><p className="eyebrow gold">AK Wealth Global · AI 圖像創作</p><h1>提示詞資料庫</h1><p className="lead">先看示範，再選用途，複製提示詞開始創作。</p><p>{entries.length} 組提示詞 · {entries.length} 張示範圖片 · {categoryCount} 大分類</p><ExamplePromptLibrary/><aside className="example-note">其中 {originalCount} 組為 AK Wealth Global 原創提示詞，示範圖以 Alice、Ken 本人照片作為臉部參考生成；其餘示範圖來自原文件。示範並非每次生成的保證結果，參考照片、比例與文字請按你的用途調整。</aside></div>}
