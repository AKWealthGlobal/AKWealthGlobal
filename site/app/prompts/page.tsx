import ExamplePromptLibrary from '@/components/example-prompt-library';
import './examples.css';
export const metadata={title:'提示詞資料庫',description:'22組圖片生成提示詞與示範圖，涵蓋商業社群、寫實人像、古風歷史、婚紗情感、旅遊、穿搭與Q版貼圖。可搜尋、細分類及複製。',alternates:{canonical:'/prompts/'}};
export default function Prompts(){return <div className="wrap section example-library"><p className="eyebrow gold">AK Wealth Global · AI 圖像創作</p><h1>提示詞資料庫</h1><p className="lead">先看示範，再選用途，複製提示詞開始創作。</p><p>22 組提示詞 · 22 張示範圖片 · 7 大分類</p><ExamplePromptLibrary/><aside className="example-note">圖片為原文件提供的示範，並非每次生成的保證結果。模型名稱依原文件標註；參考照片、比例與文字請按你的用途調整。</aside></div>}
