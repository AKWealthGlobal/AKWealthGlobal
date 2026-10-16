import ExamplePromptLibrary from '@/components/example-prompt-library';
import './examples.css';
import entries from '@/lib/prompt-examples.json';
import {STYLES} from '@/lib/prompt-taxonomy';
const originalCount=entries.filter(e=>e.source==='AK Wealth Global 原創提示詞').length;
const imageCount=entries.filter(e=>e.imageBytes>0).length;
export const metadata={title:'提示詞資料庫',description:`${entries.length} 組圖片生成提示詞與示範圖，新增 300 組海報、資訊圖表與教育卡、分鏡廣告、風格場景及電商產品創作提示詞；每組依 Maslow 需求與 PESTLE 主題構思。`,alternates:{canonical:'/prompts/'}};
export default function Prompts(){return <div className="wrap section example-library"><p className="eyebrow gold">AK Wealth Global · AI 圖像創作</p><h1>提示詞資料庫</h1><p className="lead">先看示範，再選用途，複製提示詞開始創作。</p><p>{entries.length} 組提示詞 · {imageCount} 張示範圖片 · {STYLES.length} 種風格</p><ExamplePromptLibrary/><aside className="example-note">其中 {originalCount} 組為 AK Wealth Global 原創提示詞。每組新系列依 Maslow 需求層次與 PESTLE 主題構思；圖像內不生成文字，繁體中文標題、字幕與資訊以後製方式排版，避免亂碼。涉及數據、法規、健康、財務或商品規格的內容，請按正式來源核對後發布。</aside></div>}
