import fs from "fs";
import path from "path";
import sharp from "sharp";

const PUBLIC_DIR = path.resolve("public");
const ICONS_DIR = path.join(PUBLIC_DIR, "icons");
const SCREENSHOTS_DIR = path.join(PUBLIC_DIR, "screenshots");

if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// SVG with ₹ symbol inside a shield
const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#0f172a" rx="100"/>
  <path d="M256 64L112 112V240C112 344 172 438 256 480C340 438 400 344 400 240V112L256 64Z" fill="none" stroke="#3b82f6" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M208 192H304M208 240H304M256 192V336M224 288L288 336" stroke="#ffffff" stroke-width="32" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>
`;

const maskableSvgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#0f172a" />
  <g transform="scale(0.8) translate(64, 64)">
    <path d="M256 64L112 112V240C112 344 172 438 256 480C340 438 400 344 400 240V112L256 64Z" fill="none" stroke="#3b82f6" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M208 192H304M208 240H304M256 192V336M224 288L288 336" stroke="#ffffff" stroke-width="32" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>
</svg>
`;

// Simple mock dashboard for screenshot (optional, you can replace with a real one)
const mockDashboardSvg = `
<svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
  <rect width="1080" height="1920" fill="#0f172a" />
  <text x="540" y="960" font-family="sans-serif" font-size="64" fill="#ffffff" text-anchor="middle">KataCut Dashboard Screenshot Placeholder</text>
</svg>
`;

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generate() {
  console.log("Generating standard icons...");
  for (const size of sizes) {
    await sharp(Buffer.from(svgIcon))
      .resize(size, size)
      .toFile(path.join(ICONS_DIR, `icon-${size}x${size}.png`));
    console.log(`Generated icon-${size}x${size}.png`);
  }

  console.log("Generating maskable icon...");
  await sharp(Buffer.from(maskableSvgIcon))
    .resize(512, 512)
    .toFile(path.join(ICONS_DIR, "icon-maskable-512x512.png"));
  console.log("Generated icon-maskable-512x512.png");

  console.log("Generating favicon.ico (32x32)...");
  // Just generate a 32x32 png for favicon instead of true .ico for simplicity, browser accepts png renamed
  await sharp(Buffer.from(svgIcon))
    .resize(32, 32)
    .toFile(path.join(PUBLIC_DIR, "favicon.ico"));

  console.log("Generating screenshot...");
  await sharp(Buffer.from(mockDashboardSvg))
    .resize(1080, 1920)
    .toFile(path.join(SCREENSHOTS_DIR, "dashboard.png"));

  console.log("Done!");
}

generate().catch(console.error);
