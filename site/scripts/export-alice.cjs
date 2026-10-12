const sharp=require('sharp');
const fs=require('node:fs');
const path=require('node:path');
async function main(){
 const src=process.argv[2];
 const dest=path.resolve('public/media/alice');fs.mkdirSync(dest,{recursive:true});
 const slug='alice-answers-with-sources';const m=await sharp(src).metadata();console.log({width:m.width,height:m.height});
 await sharp(src).jpeg({quality:95}).toFile(path.join(dest,slug+'.jpg'));
 const boxes=[[6,4,502,460],[518,4,500,460],[6,472,502,440],[518,472,500,440],[6,922,502,556],[518,922,500,556]];
 for(let i=0;i<boxes.length;i++){const [x,y,w,h]=boxes[i];await sharp(src).extract({left:Math.round(x*m.width/1024),top:Math.round(y*m.height/1536),width:Math.round(w*m.width/1024),height:Math.round(h*m.height/1536)}).webp({quality:95}).toFile(path.join(dest,slug+'-'+(i+1)+'.webp'));}
 const archive=path.resolve('../../Alice-D1-20261008/output');fs.mkdirSync(archive,{recursive:true});for(const file of fs.readdirSync(dest))fs.copyFileSync(path.join(dest,file),path.join(archive,file));
 console.log('Exported JPG and six WEBP panels to '+archive);
}main().catch(e=>{console.error(e);process.exit(1)});
