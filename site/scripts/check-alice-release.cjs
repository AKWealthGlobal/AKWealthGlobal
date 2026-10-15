const fs=require('node:fs');
const topics=require('../lib/alice-topics.json');
const lessons=require('../lib/alice-lessons.json');
const published=topics.filter(t=>t.href);
const missing=lessons.filter(l=>!fs.existsSync(`public/media/alice/alice-${l.slug}.webp`));
console.log(JSON.stringify({publishedTopics:published.length,lessonPages:lessons.length,missingComicImages:missing.map(l=>l.slug),p2toP8:lessons.filter(l=>/^P[2-8]$/.test(l.code)).map(l=>l.code),d1:published.find(t=>t.code==='D1')?.href},null,2));
if(missing.length) process.exit(1);
