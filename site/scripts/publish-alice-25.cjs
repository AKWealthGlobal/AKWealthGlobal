const fs = require('node:fs');
const path = require('node:path');

const topicsPath = path.resolve('lib/alice-topics.json');
const lessonsPath = path.resolve('lib/alice-lessons.json');
const newTopics = require('../docs/alice-ai-academy-25-topics.json');
const newLessons = require('../docs/alice-ai-academy-25-scripts.json');
const topics = JSON.parse(fs.readFileSync(topicsPath, 'utf8'));
const lessons = JSON.parse(fs.readFileSync(lessonsPath, 'utf8'));

for (const lesson of newLessons) {
  const image = path.resolve(`public/media/alice/alice-${lesson.slug}.webp`);
  if (!fs.existsSync(image)) throw new Error(`Missing WebP comic: ${image}`);
  if (!topics.some(item => item.key === `added-${lesson.code.toLowerCase()}`)) {
    const topic = newTopics.find(item => item.code === lesson.code);
    if (!topic) throw new Error(`Missing topic metadata: ${lesson.code}`);
    topics.push({ ...topic, status: '漫畫已完成' });
  }
  const index = lessons.findIndex(item => item.slug === lesson.slug);
  const publishedLesson = { ...lesson };
  delete publishedLesson.storyboard;
  if (index < 0) lessons.push(publishedLesson);
  else lessons[index] = publishedLesson;
}

fs.writeFileSync(topicsPath, `${JSON.stringify(topics, null, 2)}\n`);
fs.writeFileSync(lessonsPath, `${JSON.stringify(lessons, null, 2)}\n`);
console.log(JSON.stringify({ addedLessons: newLessons.length, totalLessons: lessons.length, totalTopics: topics.length }));
