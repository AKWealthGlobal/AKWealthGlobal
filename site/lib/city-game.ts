// 萬獸城財商大冒險：24 格多人棋盤的資料。角色、地名、店名皆為 AK 原創。
import type {Level} from './animal-city-quiz';
export type District='莽原中心區'|'金沙廣場'|'冰晶鎮'|'雨林樹屋區';
export type TileType='start'|'shop'|'quiz'|'chance'|'risk'|'bill'|'work'|'bank'|'insure'|'share'|'green';
export type Tile={type:TileType;name:string;district:District;price?:number;rent?:number;amount?:number};
export const districtColor:Record<District,number>={'莽原中心區':0xf0a35b,'金沙廣場':0xf0c276,'冰晶鎮':0x9fe3f5,'雨林樹屋區':0x7ed49a};
export const districtCss:Record<District,string>={'莽原中心區':'#f0a35b','金沙廣場':'#f0c276','冰晶鎮':'#9fe3f5','雨林樹屋區':'#7ed49a'};
// 7×7 外圈共 24 格：0 起點，6、12、18 是轉角
export const tiles:Tile[]=[
{type:'start',name:'萬獸中央車站',district:'莽原中心區'},
{type:'shop',name:'大象波波甜品店',district:'莽原中心區',price:150,rent:30},
{type:'quiz',name:'財商問答',district:'莽原中心區'},
{type:'bill',name:'水電費',district:'莽原中心區',amount:50},
{type:'shop',name:'倉鼠果汁站',district:'莽原中心區',price:120,rent:25},
{type:'chance',name:'機會卡',district:'莽原中心區'},
{type:'work',name:'萬獸城警局',district:'莽原中心區',amount:100},
{type:'shop',name:'仙人掌玻璃商場',district:'金沙廣場',price:250,rent:50},
{type:'risk',name:'市場風險卡',district:'金沙廣場'},
{type:'shop',name:'綠洲飯店',district:'金沙廣場',price:300,rent:60},
{type:'quiz',name:'財商問答',district:'金沙廣場'},
{type:'risk',name:'市場風險卡',district:'金沙廣場'},
{type:'bank',name:'冰晶銀行',district:'冰晶鎮'},
{type:'shop',name:'溜冰鞋出租店',district:'冰晶鎮',price:180,rent:35},
{type:'quiz',name:'財商問答',district:'冰晶鎮'},
{type:'insure',name:'冰晶保險公司',district:'冰晶鎮',amount:50},
{type:'shop',name:'冰屋民宿',district:'冰晶鎮',price:200,rent:40},
{type:'chance',name:'機會卡',district:'冰晶鎮'},
{type:'share',name:'雨林纜車站・愛心角',district:'雨林樹屋區',amount:50},
{type:'shop',name:'樹屋書店',district:'雨林樹屋區',price:160,rent:30},
{type:'quiz',name:'財商問答',district:'雨林樹屋區'},
{type:'green',name:'綠色小農場',district:'雨林樹屋區',price:100,amount:30},
{type:'shop',name:'纜車咖啡館',district:'雨林樹屋區',price:220,rent:45},
{type:'bill',name:'生活費',district:'雨林樹屋區',amount:50}];
export const typeLabel:Record<TileType,string>={start:'起點',shop:'店鋪',quiz:'問答',chance:'機會',risk:'風險',bill:'支出',work:'打工',bank:'銀行',insure:'保險',share:'分享',green:'綠能'};
export const typeShort:Record<TileType,string>={start:'站',shop:'店',quiz:'？',chance:'★',risk:'！',bill:'費',work:'工',bank:'銀',insure:'保',share:'愛',green:'綠'};
export type CharId='rabbit'|'fox'|'cheetah'|'sloth';
export const characters:Record<CharId,{name:string;animal:string;emoji:string;color:number;css:string;talent:string}>={
rabbit:{name:'小跳',animal:'兔子警員',emoji:'🐰',color:0xc9b8ff,css:'#c9b8ff',talent:'勤奮自律：經過中央車站時多領 50 金幣勤奮獎金。'},
fox:{name:'阿狸',animal:'狐狸商人',emoji:'🦊',color:0xf08a3c,css:'#f08a3c',talent:'談判高手：買店鋪打 8 折。'},
cheetah:{name:'豹豹',animal:'獵豹警員',emoji:'🐆',color:0xf2d24c,css:'#f2d24c',talent:'好人緣：分享時幸福點數多 1 點。'},
sloth:{name:'慢慢',animal:'樹懶職員',emoji:'🦥',color:0xb08d6b,css:'#b08d6b',talent:'長線思維：冰晶銀行利息 15%（其他人 10%）。'}};
export const SALARY=150,LIVING=80,START_CASH=500,QUIZ_REWARD=100;
export type Card={text:string;cash?:number;happy?:number;accident?:boolean;lesson?:string};
export const chanceCards:Card[]=[
{text:'奶奶來玩，給你 100 金幣紅包。',cash:100,lesson:'意外的收入，可以想想要存多少、花多少。'},
{text:'幫鄰居搬家，賺到 80 金幣。',cash:80,lesson:'付出時間和力氣，換到報酬。'},
{text:'腳踏車鏈條斷了，修理要 60 金幣。',cash:-60,accident:true,lesson:'生活中會有意外支出，所以要留一點預備金。'},
{text:'撿到別人的錢包，你交給了警局。失主好感謝你！',happy:2,lesson:'誠實比一時的錢更珍貴。'},
{text:'過生日，請好朋友吃蛋糕，花 50 金幣。',cash:-50,happy:1,lesson:'為重要的人花錢，也能帶來快樂。'},
{text:'跳蚤市場賣掉舊玩具，得到 50 金幣。',cash:50,lesson:'讓舊東西有新用途，也能賺錢。'}];
export const riskCards:Card[]=[
{text:'沙塵暴來襲！店門口的招牌被吹壞，修理要 80 金幣。',cash:-80,accident:true,lesson:'意外可以靠保險轉移風險。'},
{text:'金沙廣場的觀光客變多，市場大好，你多賺 120 金幣。',cash:120,lesson:'市場有好的時候，也會有不好的時候。'},
{text:'你買的商場股票下跌，虧了 100 金幣。',cash:-100,lesson:'投資會漲也會跌；保險不能保投資虧損。'},
{text:'熱門商品突然缺貨、價格上漲，你的商品多賣了 60 金幣。',cash:60,lesson:'東西少、想買的人多，價格就會上漲。'},
{text:'黃鼠狼滑頭說：「給我 150 金幣，下週還你 1,500！」你拒絕了，還告訴了警局。',happy:1,lesson:'「穩賺不賠、超高報酬」幾乎都是詐騙。'}];
export const defaultPlayers:{role:string;char:CharId;level:Level}[]=[{role:'媽媽',char:'rabbit',level:'master'},{role:'爸爸',char:'fox',level:'master'},{role:'孩子',char:'cheetah',level:'starter'}];
