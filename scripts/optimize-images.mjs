// Crops individual panels out of the Gemini collage images (fractions: left, top, width, height)
// and writes web-ready WebP into public/images.  Usage: node scripts/optimize-images.mjs <folder-with-original-PNGs>
import sharp from 'sharp';
import fs from 'fs';

const src = process.argv[2];
if (!src) { console.error('Pass the folder containing the original PNGs'); process.exit(1); }
const T = 1 / 3, H = 1 / 2;
const jobs = [
  // [output, source file, [l,t,w,h], maxSide]
  ['hero-honey', 'Step 1 — Hero Banner.png', [0, 0, T, 1], 1400],
  ['hero-honey-wide', 'Step 1 — Hero Banner.png', [0, 0, 1, 1], 1800],
  ['honeysnap-pack', 'Step 2 — HoneySnap Product Shot.png', [0, 0, H, H], 1000],
  ['honeysnap-angle', 'Step 2 — HoneySnap Product Shot.png', [H, H, H, H], 1000],
  ['bottle-classic', 'Step 3 — Classic Honey Bottle.png', [0, 0, T, 1], 1200],
  ['qr-moment-wide', 'Step 6 — QR Scan Lifestyle Moment.png', [0, 0, 1, 1], 1800],
  ['qr-moment', 'Step 6 — QR Scan Lifestyle Moment.png', [T, 0, T, 1], 1100],
  ['family-pour', 'Step 7 — Lifestyle - Family Habit Builder Segment.png', [0, 0, T, 1], 1100],
  ['family-toast', 'Step 7 — Lifestyle - Family Habit Builder Segment.png', [T, 0, T, 1], 1100],
  ['family-bowl', 'Step 7 — Lifestyle - Family Habit Builder Segment.png', [2 * T, 0, T, 1], 1100],
  ['young-walk', 'Step 8 — Lifestyle - Mobile Young Adult Segment .png', [0, 0, T, 1], 1100],
  ['young-bus', 'Step 8 — Lifestyle - Mobile Young Adult Segment .png', [T, 0, T, 1], 1100],
  ['young-sit', 'Step 8 — Lifestyle - Mobile Young Adult Segment .png', [2 * T, 0, T, 1], 1100],
  ['raw-honey-wide', 'Step 9 — About Honey : Raw Honey Texture.png', [0, H, 1, H], 1800],
  ['raw-honey-drip', 'Step 9 — About Honey : Raw Honey Texture.png', [0, 0, H, H], 1000],
  ['cat-breakfast', '4.1 Breakfast .png', [0, 0, H, H], 900],
  ['cat-snacks', '4.2 Snacks_2.png', [0.12, 0.2, 0.8, 0.8], 900],
  ['cat-beverages', '4.3 Beverages.png', [0.34, 0.02, 0.33, 0.94], 900],
  ['cat-cooking', '4.4 Cooking.png', [0, 0, H, H], 900],
  ['cat-desserts', '4.5 Desserts.png', [0, 0, T, 1], 900],
  ['cat-onthego', '4.6 On-the-go.png', [0, 0, T, 1], 900],
  ['recipe-banana-toast', '4.6 On-the-go.png', [T, 0, T, 1], 1000],
  ['recipe-oat-bowl', '5.1 Honey Oat Bowl.png', [0, 0, H, H], 1000],
  ['recipe-banana-smoothie', '5.2 Honey Banana Smoothie.png', [T, 0, T, 1], 1000],
  ['recipe-apple-toast', '5.3 Honey Fruit Toast.png', [0, 0, T, 1], 1000],
  ['recipe-yogurt-bowl', '5.4 Honey Yogurt Bowl.png', [T, 0, T, 1], 1000],
  ['recipe-pancakes', '5.5 Honey Pancakes.png', [T, 0, T, 1], 1000],
  ['recipe-lemon-drink', '5.6 Honey Lemon Drink.png', [T, 0, T, 1], 1000],
  ['recipe-roasted-veg', '4.4 Cooking.png', [0, 0, H, H], 1000],
  ['recipe-chicken-skewers', '4.4 Cooking.png', [H, 0, H, H], 1000],
  ['recipe-glazed-tofu', '4.4 Cooking.png', [H, H, H, H], 1000],
  ['recipe-panna-cotta', '4.5 Desserts.png', [T, 0, T, 1], 1000],
  ['recipe-honey-cake', '4.5 Desserts.png', [2 * T, 0, T, 1], 1000],
];

fs.mkdirSync('public/images', { recursive: true });
for (const [out, file, [l, t, w, h], max] of jobs) {
  const path = `${src}/${file}`;
  const m = await sharp(path).metadata();
  const region = {
    left: Math.round(l * m.width), top: Math.round(t * m.height),
    width: Math.round(w * m.width), height: Math.round(h * m.height),
  };
  region.width = Math.min(region.width, m.width - region.left);
  region.height = Math.min(region.height, m.height - region.top);
  let img = sharp(path).extract(region);
  if (out === 'bottle-classic') {
    // brand the blank label (label centre ≈ x 50%, y 55% of the panel)
    const W = region.width, Hh = region.height;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${Hh}"><g text-anchor="middle" font-family="Georgia,serif">
      <rect x="${W * 0.34}" y="${Hh * 0.455}" width="${W * 0.32}" height="${Hh * 0.05}" rx="${Hh * 0.012}" fill="#B3121B"/>
      <text x="${W * 0.5}" y="${Hh * 0.4925}" font-size="${W * 0.085}" font-weight="700" font-style="italic" fill="#fff">Dabur</text>
      <text x="${W * 0.5}" y="${Hh * 0.575}" font-size="${W * 0.17}" font-style="italic" font-weight="700" fill="#8A0F14">Honey</text>
      <text x="${W * 0.5}" y="${Hh * 0.625}" font-size="${W * 0.05}" letter-spacing="2" fill="#6b4a12">100% PURITY GUARANTEED</text>
      <text x="${W * 0.5}" y="${Hh * 0.665}" font-size="${W * 0.045}" fill="#6b4a12">Squeezy · 400 g</text></g></svg>`;
    img = sharp(await img.toBuffer()).composite([{ input: Buffer.from(svg) }]);
  }
  await img.resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 }).toFile(`public/images/${out}.webp`);
  const o = await sharp(`public/images/${out}.webp`).metadata();
  console.log(out, `${o.width}x${o.height}`);
}
