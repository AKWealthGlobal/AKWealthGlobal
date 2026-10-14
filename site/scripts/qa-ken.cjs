const fs=require('node:fs'),assert=require('node:assert/strict');
const episodes=require('../lib/ken-episodes.json'),sources=require('../lib/ken-sources.json');
assert.equal(episodes.length,138);assert.equal(new Set(episodes.map(e=>e.title)).size,138);
const index=fs.readFileSync('out/money/index.html','utf8');
const decoded=text=>text.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#x27;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>');
episodes.forEach((e,i)=>{const slug=`ken-${String(i+1).padStart(2,'0')}`;const html=decoded(fs.readFileSync(`out/money/${slug}/index.html`,'utf8'));assert.equal(e.lines.length,4);assert(index.includes(e.title));assert(html.includes(e.lesson),e.title);assert(html.includes(e.question));e.lines.forEach(line=>assert(html.includes(line)));e.source.forEach(key=>assert(html.includes(sources[key].url)));assert(fs.existsSync(`out/media/ken/comic-${String(i+1).padStart(2,'0')}.png`));assert(fs.readFileSync('out/sitemap.xml','utf8').includes(`/money/${slug}/`));});
for(const route of ['','kids','kids/city','learn','prompts','resources'])assert(fs.existsSync(`out/${route?route+'/':''}index.html`));
console.log('PASS: 138 comics, 552 dialogues, readable lessons/questions, source links, image paths, sitemap and existing main routes');


