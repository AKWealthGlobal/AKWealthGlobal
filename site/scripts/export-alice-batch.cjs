const sharp=require('sharp');
const fs=require('node:fs');
const path=require('node:path');
async function main(){
 const [src,slug,geometry]=process.argv.slice(2);
 if(!src||!slug||!geometry)throw new Error('usage: node scripts/export-alice-batch.cjs image.png slug geometry.json');
 const boxes=JSON.parse(fs.readFileSync(geometry,'utf8'));
 if(boxes.length!==6)throw new Error('expected six panel crops');
 const dest=path.resolve('public/media/alice');fs.mkdirSync(dest,{recursive:true});
 const meta=await sharp(src).metadata();
 await sharp(src).webp({quality:82}).toFile(path.join(dest,'alice-'+slug+'.webp'));
 for(let i=0;i<6;i++){const [x,y,w,h]=boxes[i];await sharp(src).extract({left:Math.round(x*meta.width/1024),top:Math.round(y*meta.height/1536),width:Math.round(w*meta.width/1024),height:Math.round(h*meta.height/1536)}).webp({quality:82}).toFile(path.join(dest,'alice-'+slug+'-'+(i+1)+'.webp'));}
 console.log(JSON.stringify({slug,width:meta.width,height:meta.height,files:7,format:'webp',quality:82}));
}main().catch(e=>{console.error(e);process.exit(1)});
