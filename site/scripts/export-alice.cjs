const sharp=require('sharp');
const fs=require('node:fs');
const path=require('node:path');
async function main(){
 const src=process.argv[2];
 const dest=path.resolve('public/media/alice');fs.mkdirSync(dest,{recursive:true});
 const slug='alice-answers-with-sources';const m=await sharp(src).metadata();console.log({width:m.width,height:m.height});
 await sharp(src).webp({quality:82}).toFile(path.join(dest,slug+'.webp'));
 const boxes=[[6,4,502,460],[518,4,500,460],[6,472,502,440],[518,472,500,440],[6,922,502,556],[518,922,500,556]];
 for(let i=0;i<boxes.length;i++){const [x,y,w,h]=boxes[i];await sharp(src).extract({left:Math.round(x*m.width/1024),top:Math.round(y*m.height/1536),width:Math.round(w*m.width/1024),height:Math.round(h*m.height/1536)}).webp({quality:82}).toFile(path.join(dest,slug+'-'+(i+1)+'.webp'));}
 console.log('Exported full comic and six panels as WEBP at quality 82.');
}main().catch(e=>{console.error(e);process.exit(1)});
