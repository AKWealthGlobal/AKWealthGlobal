const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

async function main() {
  const dir = path.resolve('public/media/alice');
  const legacy = fs.readdirSync(dir).filter(name => /\.jpe?g$/i.test(name));
  for (const name of legacy) {
    const source = path.join(dir, name);
    const destination = path.join(dir, name.replace(/\.jpe?g$/i, '.webp'));
    await sharp(source).webp({ quality: 82 }).toFile(destination);
    fs.unlinkSync(source);
    console.log(`${name} -> ${path.basename(destination)}`);
  }
  console.log(JSON.stringify({ converted: legacy.length, quality: 82 }));
}

main().catch(error => { console.error(error); process.exit(1); });
