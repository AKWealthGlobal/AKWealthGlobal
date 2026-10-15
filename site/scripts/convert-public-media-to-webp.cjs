const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(file) : [file];
  });
}

async function main() {
  const media = path.resolve('public/media');
  const legacy = listFiles(media).filter(file => /\.(jpg|jpeg|png)$/i.test(file));
  const replacements = new Map();
  for (const source of legacy) {
    const destination = source.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    await sharp(source).webp({ quality: 82 }).toFile(destination);
    const oldPublic = `/media/${path.relative(media, source).replace(/\\/g, '/')}`;
    const newPublic = oldPublic.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    replacements.set(oldPublic, newPublic);
    replacements.set(`public${oldPublic}`, `public${newPublic}`);
    fs.unlinkSync(source);
  }

  const root = path.resolve('.');
  for (const file of listFiles(root).filter(file => !file.startsWith(media + path.sep))) {
    if (/\\(node_modules|\.next|\.git)\\/.test(file)) continue;
    let text;
    try { text = fs.readFileSync(file, 'utf8'); } catch { continue; }
    if (text.includes('\u0000')) continue;
    let updated = text;
    for (const [oldPath, newPath] of replacements) updated = updated.split(oldPath).join(newPath);
    if (updated !== text) fs.writeFileSync(file, updated);
  }
  console.log(JSON.stringify({ converted: legacy.length, updatedReferences: replacements.size, quality: 82 }));
}

main().catch(error => { console.error(error); process.exit(1); });
