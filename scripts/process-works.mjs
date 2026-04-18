#!/usr/bin/env node
/**
 * process-works.mjs
 *
 * Recursively scans ../raw_works/ (relative to project root) for media files,
 * grouped by sub-folder (one work = one folder).
 *
 * For each work folder:
 *   - Collects all media files recursively, sorted alphabetically.
 *   - If the folder contains video(s), the first video is the cover:
 *       - thumbs/[id].jpg     – frame at 3s, 1280w, q:v 3
 *       - previews/[id].webm  – 2–7s clip, VP9, CRF 35, no audio, 1280w
 *       - videos/[id].mp4     – compressed full clip, H.264 CRF 28, 1280w, no audio
 *                               (used by Lightbox until you supply a youtubeId)
 *   - If the folder is image-only, the first image is the cover:
 *       - thumbs/[id].jpg     – resized to 1280w
 *       (no preview, isStatic = true)
 *   - Remaining images in the folder become a gallery:
 *       - gallery/[id]_01.jpg, [id]_02.jpg, …
 *
 * Generates src/data/works.ts at the end.
 *
 * Usage:  node scripts/process-works.mjs
 *         node scripts/process-works.mjs --force   (re-process even if outputs exist)
 *         node scripts/process-works.mjs --only=ruin_sentinel   (subset)
 */

import { promises as fs } from 'node:fs';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// ───────────── config ─────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const RAW_DIR = process.env.RAW_WORKS_DIR
  ? path.resolve(process.env.RAW_WORKS_DIR)
  : path.resolve(PROJECT_ROOT, '..', 'raw_works');
const PUB = path.join(PROJECT_ROOT, 'public', 'works');
const OUT_THUMBS = path.join(PUB, 'thumbs');
const OUT_PREVIEWS = path.join(PUB, 'previews');
const OUT_VIDEOS = path.join(PUB, 'videos');
const OUT_GALLERY = path.join(PUB, 'gallery');
const OUT_DATA = path.join(PROJECT_ROOT, 'src', 'data', 'works.ts');

const CATEGORY_MAP = {
  '3d_cg_arts': '3d',
  'directing_post': 'directing',
  'visual_narrative': 'narrative',
};

const args = new Set(process.argv.slice(2));
const FORCE = args.has('--force');
const ONLY = [...args].find((a) => a.startsWith('--only='))?.split('=')[1];

// ───────────── helpers ─────────────
const isVideo = (f) => /\.(mp4|mov)$/i.test(f);
const isImage = (f) => /\.(jpe?g|png)$/i.test(f);
const isMedia = (f) => isVideo(f) || isImage(f);

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const ent of entries) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...(await walk(p)));
    else if (ent.isFile()) out.push(p);
  }
  return out;
}

function toTitle(slug) {
  return slug
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function run(cmd, cmdArgs) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, cmdArgs, { stdio: ['ignore', 'ignore', 'pipe'] });
    let err = '';
    p.stderr.on('data', (d) => (err += d));
    p.on('error', reject);
    p.on('exit', (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`${cmd} exit ${code}: ${err.slice(-400)}`)),
    );
  });
}

function ffprobeDuration(file) {
  return new Promise((resolve) => {
    const p = spawn('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      file,
    ]);
    let out = '';
    p.stdout.on('data', (d) => (out += d));
    p.on('exit', () => resolve(parseFloat(out) || 0));
    p.on('error', () => resolve(0));
  });
}

async function genThumbFromVideo(input, output, duration) {
  const ss = duration > 3 ? 3 : Math.max(0, duration / 2);
  await run('ffmpeg', [
    '-y',
    '-ss', String(ss),
    '-i', input,
    '-frames:v', '1',
    '-q:v', '3',
    '-vf', 'scale=min(1280\\,iw):-2',
    output,
  ]);
}

async function genPreviewFromVideo(input, output, duration) {
  // Spec: 2–7s window. If clip is shorter, fit.
  const ss = duration > 7 ? 2 : Math.max(0, Math.min(2, duration - 1));
  const remain = Math.max(1, duration - ss);
  const t = Math.min(5, remain);
  await run('ffmpeg', [
    '-y',
    '-ss', String(ss),
    '-i', input,
    '-t', String(t),
    '-c:v', 'libvpx-vp9',
    '-crf', '35',
    '-b:v', '0',
    '-an',
    '-vf', 'scale=min(1280\\,iw):-2',
    '-row-mt', '1',
    '-deadline', 'good',
    '-cpu-used', '4',
    output,
  ]);
}

async function genLocalMp4(input, output) {
  await run('ffmpeg', [
    '-y',
    '-i', input,
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '28',
    '-vf', 'scale=min(1280\\,iw):-2',
    '-an',
    '-movflags', '+faststart',
    '-pix_fmt', 'yuv420p',
    output,
  ]);
}

async function resizeImage(input, output) {
  await run('ffmpeg', [
    '-y',
    '-i', input,
    '-vf', 'scale=min(1280\\,iw):-2',
    '-q:v', '3',
    output,
  ]);
}

async function ensureDirs() {
  for (const d of [OUT_THUMBS, OUT_PREVIEWS, OUT_VIDEOS, OUT_GALLERY]) {
    await fs.mkdir(d, { recursive: true });
  }
  await fs.mkdir(path.dirname(OUT_DATA), { recursive: true });
}

// ───────────── main ─────────────
async function main() {
  if (!existsSync(RAW_DIR)) {
    console.error(`✗ raw_works not found at ${RAW_DIR}`);
    process.exit(1);
  }

  await ensureDirs();

  const works = [];
  const log = { processed: 0, skipped: 0, generated: { thumb: 0, preview: 0, mp4: 0, gallery: 0 } };
  const warnings = [];

  for (const [folderName, category] of Object.entries(CATEGORY_MAP)) {
    const catDir = path.join(RAW_DIR, folderName);
    if (!existsSync(catDir)) {
      warnings.push(`skip category: ${folderName} (not found)`);
      continue;
    }
    const subs = (await fs.readdir(catDir, { withFileTypes: true }))
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort();

    for (const id of subs) {
      if (ONLY && id !== ONLY) continue;

      const folder = path.join(catDir, id);
      const all = (await walk(folder)).filter(isMedia).sort();
      if (all.length === 0) {
        warnings.push(`empty folder, skipped: ${folderName}/${id}`);
        log.skipped++;
        continue;
      }

      const videos = all.filter(isVideo);
      const images = all.filter(isImage);
      const cover = videos[0] ?? images[0];
      const isStatic = !videos[0];

      console.log(`\n→ ${category}/${id}`);
      console.log(`  cover: ${path.basename(cover)} (${isStatic ? 'image' : 'video'})`);

      const thumbOut = path.join(OUT_THUMBS, `${id}.jpg`);
      const previewOut = path.join(OUT_PREVIEWS, `${id}.webm`);
      const localMp4Out = path.join(OUT_VIDEOS, `${id}.mp4`);

      try {
        if (isStatic) {
          if (FORCE || !existsSync(thumbOut)) {
            await resizeImage(cover, thumbOut);
            log.generated.thumb++;
            console.log(`  ✓ thumb`);
          }
        } else {
          const duration = await ffprobeDuration(cover);
          if (FORCE || !existsSync(thumbOut)) {
            await genThumbFromVideo(cover, thumbOut, duration);
            log.generated.thumb++;
            console.log(`  ✓ thumb (frame@${duration > 3 ? 3 : (duration / 2).toFixed(1)}s)`);
          }
          if (FORCE || !existsSync(previewOut)) {
            await genPreviewFromVideo(cover, previewOut, duration);
            log.generated.preview++;
            console.log(`  ✓ preview webm (${duration.toFixed(1)}s source)`);
          }
          if (FORCE || !existsSync(localMp4Out)) {
            await genLocalMp4(cover, localMp4Out);
            log.generated.mp4++;
            console.log(`  ✓ local mp4`);
          }
        }
      } catch (e) {
        warnings.push(`✗ ${id}: ${e.message}`);
        console.log(`  ✗ ${e.message}`);
        continue;
      }

      // Gallery: remaining images (skip cover, skip extra videos for now)
      const gallerySrc = images.filter((p) => p !== cover);
      const galleryRel = [];
      for (let i = 0; i < gallerySrc.length; i++) {
        const n = String(i + 1).padStart(2, '0');
        const out = path.join(OUT_GALLERY, `${id}_${n}.jpg`);
        if (FORCE || !existsSync(out)) {
          try {
            await resizeImage(gallerySrc[i], out);
            log.generated.gallery++;
          } catch (e) {
            warnings.push(`✗ gallery ${id}_${n}: ${e.message}`);
            continue;
          }
        }
        galleryRel.push(`/works/gallery/${id}_${n}.jpg`);
      }
      if (galleryRel.length) console.log(`  ✓ gallery (${galleryRel.length} imgs)`);

      const w = {
        id,
        title: toTitle(id),
        category,
        role: '',
        software: [],
        year: 2025,
        thumbnail: `/works/thumbs/${id}.jpg`,
        ...(isStatic ? {} : {
          preview: `/works/previews/${id}.webm`,
          localVideo: `/works/videos/${id}.mp4`,
        }),
        youtubeId: '',
        ...(galleryRel.length ? { gallery: galleryRel } : {}),
        isStatic,
      };
      works.push(w);
      log.processed++;
    }
  }

  // ───────────── emit works.ts ─────────────
  const ts = `// AUTO-GENERATED by scripts/process-works.mjs
// Edit titles, roles, software, years, and youtubeId values here as needed.
// Re-running the script will preserve manual edits ONLY if you remove the
// generated outputs first; otherwise it skips already-generated assets but
// will overwrite this file. Keep your edits in source control.

export type Category = '3d' | 'directing' | 'narrative';

export type Work = {
  id: string;
  title: string;
  category: Category;
  role: string;
  software: string[];
  year: number;
  thumbnail: string;
  preview?: string;
  localVideo?: string;
  youtubeId?: string;
  gallery?: string[];
  isStatic: boolean;
};

export const works: Work[] = ${JSON.stringify(works, null, 2)};
`;
  await fs.writeFile(OUT_DATA, ts, 'utf8');
  console.log(`\n✓ wrote ${path.relative(PROJECT_ROOT, OUT_DATA)} (${works.length} works)`);

  // ───────────── summary ─────────────
  console.log('\n──── summary ────');
  console.log(`works processed : ${log.processed}`);
  console.log(`folders skipped : ${log.skipped}`);
  console.log(`thumbs generated: ${log.generated.thumb}`);
  console.log(`previews        : ${log.generated.preview}`);
  console.log(`local mp4s      : ${log.generated.mp4}`);
  console.log(`gallery imgs    : ${log.generated.gallery}`);
  if (warnings.length) {
    console.log('\nwarnings:');
    for (const w of warnings) console.log('  ' + w);
  }
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
