import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve('public/media/prompt-examples');
const generated = 'C:/Users/user/.codex/generated_images/01a14007-2baf-7b11-8868-b5827f71da5f';
const samples = [
  [1, `${generated}/exec-d1b0f50d-e079-4d04-8f6e-083e52d7fc23.png`],
  [51, `${generated}/exec-d75bd029-8860-4b7c-b281-207e9bd7d443.png`],
  [101, `${generated}/exec-fb422293-6823-4878-8757-8d1bfd1af0f5.png`],
  [151, `${generated}/exec-ef6976a0-4d40-433d-935a-a92283e7032f.png`],
  [201, `${generated}/exec-168001a1-47ac-4fda-839b-360bb0903d7c.png`],
  [251, `${generated}/exec-3e3e70fc-fbd3-4896-a8f2-a567755c5669.png`],
];
for (const [index, source] of samples) {
  if (!fs.existsSync(source)) throw new Error(`Missing GPT Image sample: ${source}`);
  const target = path.join(root, `alice-pestle-${String(index).padStart(3, '0')}.webp`);
  await sharp(source).webp({quality:82, effort:6}).toFile(target);
}
const promptsPath = path.resolve('lib/maslow-pestle-prompts.json');
const prompts = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));
for (const entry of prompts) {
  const absolute = path.resolve('public', entry.image.replace(/^\//, ''));
  if (fs.existsSync(absolute)) entry.imageBytes = fs.statSync(absolute).size;
}
fs.writeFileSync(promptsPath, `${JSON.stringify(prompts,null,2)}\n`);
console.log(JSON.stringify({uniqueGptWebpSamples:samples.length,bytes:samples.map(([i])=>fs.statSync(path.join(root,`alice-pestle-${String(i).padStart(3,'0')}.webp`)).size)}));
