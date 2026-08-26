// thumbs.mjs — render each tools/*.html with Playwright and save a card thumbnail
// to thumbs/<slug>.jpg. Runs locally against the system Chrome (no browser download).
// Skips tools whose thumbnail is already newer than the source; --force redoes all.
// Run: node thumbs.mjs   (or: npm run thumbs / npm run thumbs:force)

import { chromium } from 'playwright-core';
import {
  readdirSync, mkdirSync, existsSync, statSync,
} from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'tools');
const THUMBS = join(ROOT, 'thumbs');

const FORCE = process.argv.includes('--force');
const WIDTH = 1000;
const HEIGHT = 625;          // 16:10, matches the card thumbnail aspect ratio
const SETTLE_MS = 800;       // let fonts / canvas paint before the shot

mkdirSync(THUMBS, { recursive: true });

const files = readdirSync(SRC).filter((f) => f.toLowerCase().endsWith('.html')).sort();
if (files.length === 0) {
  console.error('No .html files in tools/. Nothing to capture.');
  process.exit(1);
}

let browser;
try {
  browser = await chromium.launch({ channel: 'chrome' });
} catch (err) {
  console.error('\nCould not launch the system Chrome via Playwright.');
  console.error('Fix: install Chrome, or switch to bundled Chromium with');
  console.error('  npm i -D playwright && npx playwright install chromium');
  console.error('then remove { channel: "chrome" } from thumbs.mjs.\n');
  throw err;
}

const ctx = await browser.newContext({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 1.5,   // sharper thumbnail when downscaled on the card
});

let made = 0; let skipped = 0; let failed = 0;
for (const file of files) {
  const slug = basename(file, '.html');
  const src = join(SRC, file);
  const out = join(THUMBS, `${slug}.jpg`);

  if (!FORCE && existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs) {
    skipped += 1;
    continue;
  }

  const page = await ctx.newPage();
  try {
    await page.goto(pathToFileURL(src).href, { waitUntil: 'networkidle', timeout: 20000 });
  } catch {
    // Animated pages may never reach networkidle; fall back to a plain wait.
    await page.waitForTimeout(1500);
  }
  await page.waitForTimeout(SETTLE_MS);
  try {
    await page.screenshot({
      path: out, type: 'jpeg', quality: 82,
      clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
    });
    made += 1;
    console.log(`  captured ${slug}.jpg`);
  } catch (err) {
    failed += 1;
    console.error(`  FAILED ${slug}: ${err.message}`);
  }
  await page.close();
}

await browser.close();
console.log(`\nthumbs: ${made} captured, ${skipped} up-to-date` +
  (failed ? `, ${failed} failed` : '') + ' -> thumbs/');
