import FamilyWorksheet from '@/components/family-worksheet';
import Link from 'next/link';
import FamilyAdventure from '@/components/family-adventure';
export const metadata={title:'AK 動物都市｜3D 親子財商大富翁',description:'2–4 位家人合作探索 24 格立體城市，依幼兒、兒童及進階模式練習預算、儲蓄、公共建設與防詐。免登入。',alternates:{canonical:'/kids/city/'}};
export default function City(){return <div className="wrap section"><Link className="text-link" href="/kids/">← 返回親子遊戲</Link><h1>AK 動物都市</h1><p className="lead">全家一起做選擇，建造更好的城市。</p><FamilyAdventure/><section className="reader-surface"><h2>家長陪玩，讓孩子說說自己的想法</h2><p>先看共同目標，輪流讀情境。孩子選好後，問一句「你為什麼這樣想？」。最後選一個能帶回生活的小習慣。</p><FamilyWorksheet/></section></div>}

