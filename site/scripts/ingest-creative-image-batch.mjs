import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const manifestPath = path.resolve(process.argv[2] ?? 'scripts/creative-image-batch.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const publicRoot = path.resolve('public');
const generatedPath = path.resolve('lib/maslow-pestle-prompts.json');
const libraryPath = path.resolve('lib/prompt-examples.json');
const generated = JSON.parse(fs.readFileSync(generatedPath, 'utf8'));
const library = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

for (const {slug, source} of manifest) {
  if (!/^alice-pestle-\d{3}$/.test(slug)) throw new Error(`Invalid creative prompt slug: ${slug}`);
  if (!fs.existsSync(source)) throw new Error(`Missing GPT image source: ${source}`);
  const generatedEntry = generated.find(entry => entry.slug === slug);
  const libraryEntry = library.find(entry => entry.slug === slug);
  if (!generatedEntry || !libraryEntry) throw new Error(`Unknown creative prompt: ${slug}`);
  const target = path.resolve(publicRoot, generatedEntry.image.replace(/^\//, ''));
  if (!target.startsWith(publicRoot + path.sep)) throw new Error(`Image path escapes public directory: ${target}`);
  fs.mkdirSync(path.dirname(target), {recursive: true});
  await sharp(source).webp({quality: 82, effort: 6}).toFile(target);
  const bytes = fs.statSync(target).size;
  generatedEntry.imageBytes = bytes;
  libraryEntry.imageBytes = bytes;
}

fs.writeFileSync(generatedPath, `${JSON.stringify(generated, null, 2)}\n`);
fs.writeFileSync(libraryPath, `${JSON.stringify(library, null, 2)}\n`);
const outputs = manifest.map(({slug}) => {
  const entry = generated.find(item => item.slug === slug);
  const target = path.resolve(publicRoot, entry.image.replace(/^\//, ''));
  const bytes = fs.readFileSync(target);
  if (bytes.subarray(0, 4).toString() !== 'RIFF' || bytes.subarray(8, 12).toString() !== 'WEBP') throw new Error(`Invalid WebP: ${slug}`);
  return {slug, image: entry.image, bytes: bytes.length};
});
console.log(JSON.stringify({converted: outputs.length, outputs}));
