const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const basePath=path.resolve(__dirname,'../lib/prompt-examples.json');
const generatedPath=path.resolve(__dirname,'../lib/maslow-pestle-prompts.json');
const repoRoot=path.resolve(__dirname,'../..');
const base=JSON.parse(execFileSync('git',['show','HEAD:site/lib/prompt-examples.json'],{cwd:repoRoot,encoding:'utf8',maxBuffer:16*1024*1024}));
const generated=JSON.parse(fs.readFileSync(generatedPath,'utf8'));
const original=base.filter(e=>!e.slug.startsWith('alice-pestle-'));
const morning=original.filter(e=>e.subcategory==='早安圖');
const rest=original.filter(e=>e.subcategory!=='早安圖');
const result=[...generated,...morning,...rest];
const slugs=new Set();
for(const row of result){if(slugs.has(row.slug))throw new Error(`Duplicate prompt slug: ${row.slug}`);slugs.add(row.slug);}
fs.writeFileSync(basePath,`${JSON.stringify(result,null,2)}\n`);
console.log(JSON.stringify({total:result.length,originalBase:original.length,newPrompts:generated.length,morningPrompts:morning.length,categories:Object.fromEntries([...new Set(generated.map(e=>e.category))].map(c=>[c,generated.filter(e=>e.category===c).length])),earlyMorningNowAt:result.findIndex(e=>e.subcategory==='早安圖')}));
