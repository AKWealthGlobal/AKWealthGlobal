const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

async function main() {
  const dir = path.resolve('public/media/prompt-examples');
  const legacy = fs.readdirSync(dir).filter(name => /\.(jpg|jpeg|png)$/i.test(name));
  for (const name of legacy) {
    const source = path.join(dir, name);
    const destination = path.join(dir, name.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
    await sharp(source).webp({ quality: 82 }).toFile(destination);
    fs.unlinkSync(source);
  }

  const examplesPath = path.resolve('lib/prompt-examples.json');
  const examples = JSON.parse(fs.readFileSync(examplesPath, 'utf8'));
  for (const example of examples) {
    if (!example.image) continue;
    example.image = example.image.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const imagePath = path.join('public', example.image.replace(/^\/+/, ''));
    if (!fs.existsSync(imagePath)) throw new Error(`Missing prompt example: ${imagePath}`);
    example.imageBytes = fs.statSync(imagePath).size;
  }
  fs.writeFileSync(examplesPath, `${JSON.stringify(examples, null, 2)}\n`);

  const fetchPath = path.resolve('docs/image-fetch.json');
  const fetchItems = JSON.parse(fs.readFileSync(fetchPath, 'utf8'));
  for (const item of fetchItems) item.out = item.out.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  fs.writeFileSync(fetchPath, `${JSON.stringify(fetchItems, null, 2)}\n`);
  console.log(JSON.stringify({ converted: legacy.length, examples: examples.length, quality: 82 }));
}

main().catch(error => { console.error(error); process.exit(1); });
