import FamilyWorksheet from '@/components/family-worksheet';
import FamilyAdventure from '@/components/family-adventure';
export const metadata={title:'AK 動物都市｜3D 親子財商大富翁',description:'探索四區原創動物都市，依幼兒、兒童及進階模式練習預算、儲蓄、創業與防詐。',alternates:{canonical:'/kids/'}};
export default function Kids(){return <div className="wrap section"><h1>3D 親子財商大富翁</h1><p className="lead">一起逛城市、做選擇，讓金錢成為實現共同計畫的工具。</p><FamilyAdventure/><section className="reader-surface kids-teaching"><h2>家長陪玩，讓孩子說說自己的想法</h2><p>先看共同目標，輪流讀情境。孩子選好後，問一句「你為什麼這樣想？」。最後選一個能帶回生活的小習慣。</p><FamilyWorksheet/></section></div>}

