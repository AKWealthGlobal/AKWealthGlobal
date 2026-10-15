const fs = require('node:fs');
const path = require('node:path');

const topicsPath = path.resolve('lib/alice-topics.json');
const lessonsPath = path.resolve('lib/alice-lessons.json');
function fail(action, file, error) {
  console.error(`Could not ${action} ${path.relative(process.cwd(), file)}: ${error.message}`);
  process.exit(1);
}
function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (error) { fail('read', file, error); }
}
function writeJson(file, data) {
  try { fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`); } catch (error) { fail('write', file, error); }
}

const newTopics = readJson(path.resolve(__dirname, '../docs/alice-ai-academy-25-topics.json'));
const newLessons = readJson(path.resolve(__dirname, '../docs/alice-ai-academy-25-scripts.json'));
const topics = readJson(topicsPath);
const lessons = readJson(lessonsPath);

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

writeJson(topicsPath, topics);
writeJson(lessonsPath, lessons);
console.log(JSON.stringify({ addedLessons: newLessons.length, totalLessons: lessons.length, totalTopics: topics.length }));
