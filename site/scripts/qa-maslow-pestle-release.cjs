const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const entries=require('../lib/maslow-pestle-prompts.json');
assert.equal(entries.length,200,'expected exactly 200 prompts');
assert.equal(new Set(entries.map(e=>e.slug)).size,200,'slugs must be unique');
assert.equal(entries.filter(e=>e.subcategory==='早安圖').length,25,'expected 25 morning greetings');
assert.equal(entries.filter(e=>e.subcategory==='節日祝福圖').length,25,'expected 25 distinct festivals');
assert.equal(entries.filter(e=>e.category==='原創奇幻故事系列').length,150,'expected 150 original story prompts');
assert.equal(entries.filter(e=>e.verbatimText).length,50,'all greeting cards need exact Chinese copy');
const expected=entries.map(e=>path.resolve('public',e.image.replace(/^\//,'')));
for(const [i,file] of expected.entries()){
  const e=entries[i];
  assert(fs.existsSync(file),`missing image: ${e.slug}`);
  const b=fs.readFileSync(file);
  assert(b.length>20000,`image too small: ${e.slug}`);
  assert(b.subarray(0,4).toString()==='RIFF'&&b.subarray(8,12).toString()==='WEBP',`not real WebP: ${e.slug}`);
  assert.equal(b.length,e.imageBytes,`byte count mismatch: ${e.slug}`);
  assert(e.prompt.length>80&&e.script.length>10,`prompt/script missing: ${e.slug}`);
  assert(e.maslow&&e.pestle,`Maslow/PESTLE tag missing: ${e.slug}`);
}
const files=fs.readdirSync(path.resolve('public/media/prompt-examples')).filter(f=>/^maslow-pestle-\d+\.(png|jpe?g)$/i.test(f));
assert.equal(files.length,0,'new prompt assets must not include PNG/JPG');
console.log('PASS: 200 prompts, 25 morning cards, 25 festival cards, 150 original story scenes, valid WebP files, no PNG/JPG.');
