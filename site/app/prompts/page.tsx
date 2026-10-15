import ExamplePromptLibrary from '@/components/example-prompt-library';
import './examples.css';
import entries from '@/lib/prompt-examples.json';
import {STYLES, THEMES} from '@/lib/prompt-taxonomy';
const originalCount=entries.filter(e=>e.source==='AK Wealth Global 原創提示詞').length;
export const metadata={title:'提示詞資料庫',description:`${entries.length}組圖片生成提示詞與示範圖，涵蓋早安與節日祝福、原創奇幻故事、品牌行銷、世界文化、旅遊、熟齡生活、毛孩、實用設計與AI文字提示。可依主題與風格篩選，每組都能查看與複製。`,alternates:{canonical:'/prompts/'}};
export default function Prompts(){return <div className="wrap section example-library"><p className="eyebrow gold">AK Wealth Global · AI 圖像創作</p><h1>提示詞資料庫</h1><p className="lead">先看示範，再選用途，複製提示詞開始創作。</p><p>{entries.length} 組提示詞 · {entries.length} 張示範圖片 · {THEMES.length} 個主題 · {STYLES.length} 種風格</p><p>先選<strong>主題</strong>（畫面在講什麼、拿來做什麼），再用<strong>風格</strong>（寫實攝影、3D、插畫、東方傳統藝術⋯⋯）縮小範圍。</p><ExamplePromptLibrary/><aside className="example-note">其中 {originalCount} 組為 AK Wealth Global 原創提示詞。早安、節日祝福與原創故事系列依 Maslow 需求層次和 PESTLE 主題構思；祝福圖含繁體中文短句，奇幻故事採原創人物與世界觀。示範並非每次生成的保證結果，參考照片、比例與文字請按你的用途調整。</aside></div>}
