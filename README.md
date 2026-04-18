# Paul Shen — 3D & Motion Portfolio

A personal film / motion portfolio built with Next.js 14. Dark, editorial,
cinema-inspired. Designed to showcase selected works across 3D & CG Arts,
Directing & Post, and Visual Narrative.

**Live site:** _(add URL after deploying)_

---

## Tech Stack

- **Framework** — Next.js 14 (App Router, TypeScript strict mode)
- **Styling** — Tailwind CSS with a custom dark theme
  (`#0A0A0A` / `#EAEAEA` / `#FF4500`)
- **Fonts** — Inter, loaded via Google Fonts CSS
- **Smooth scroll** — `@studio-freight/lenis`
- **Scroll animations** — GSAP + ScrollTrigger
- **Layout animations** — Framer Motion
- **Media processing** — FFmpeg (for thumbnails + WebM previews)

---

## Features

- Full-bleed Hero Showreel with YouTube background video
- Selected Works grid with filter pills and Framer Motion reshuffle
- Hover preview (WebM, 2-7s, muted loop) on motion works
- Ken Burns slow zoom on static works
- Lightbox modal supporting YouTube, local MP4, and image carousel
- About section with bio, skills, and resume download
- Contact section with click-to-copy email and social links
- Custom cursor (dot + ring, "PLAY" state on work cards)
- Responsive 1 / 2 / 3 column grid

---

## Local Development

Requires Node.js 18.17+ and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other commands:

```bash
npm run build   # production build
npm run start   # run production build locally
npm run lint    # ESLint
```

---

## Adding a New Work

Source footage lives in `../raw_works/` (outside the repo, not tracked).
Folder layout per category:

```
raw_works/
  3d_cg_arts/
    <work-name>/
      hero.mp4           # optional — first mp4/mov is used as preview source
      still_01.jpg
      still_02.jpg
      ...
  directing_post/
    ...
  visual_narrative/
    ...
```

Then run the processing script:

```bash
node scripts/process-works.mjs
```

This will, for each sub-folder:

1. Pick the first video file (alphabetical) as the preview source, or the
   first image if no video.
2. Generate a 1280px-wide JPG thumbnail at 3s into the video (or the image
   itself for static works) → `public/works/thumbs/<id>.jpg`.
3. Generate a WebM preview (VP9, CRF 35, 2-7s, no audio, 1280px wide) for
   video sources → `public/works/previews/<id>.webm`.
4. Copy a compressed MP4 fallback → `public/works/videos/<id>.mp4`.
5. Copy additional images into a Lightbox gallery →
   `public/works/gallery/<id>_NN.jpg`.
6. Regenerate `src/data/works.ts` with every work discovered.

> **Warning:** re-running the script **overwrites** `src/data/works.ts`.
> Any manual edits (titles, roles, software, year, youtubeId) will be lost.
> Commit your edits before re-running, or use the `--only=<id>` flag to
> target a single work.

Useful flags:

- `--force` — regenerate even if output exists
- `--only=<work_id>` — process only the specified work(s), comma-separated

---

## Editing Content

Reference — where to change what:

| To change…                                    | Edit file                                 |
| --------------------------------------------- | ----------------------------------------- |
| Browser tab title / SEO / OG preview          | `src/app/layout.tsx`                      |
| Hero big name + tagline                       | `src/app/page.tsx` (`<HeroShowreel />` props) |
| Hero background Showreel YouTube video        | `src/components/HeroShowreel.tsx` (`SHOWREEL_YT_ID`) |
| Work title / role / software / year / youtubeId | `src/data/works.ts`                     |
| About bio, headline, skill tags               | `src/components/About.tsx`                |
| Contact email + social links                  | `src/components/Contact.tsx` (top `const`s) |
| Footer copyright                              | `src/components/Footer.tsx`               |
| Resume PDF                                    | replace `public/resume.pdf`               |
| Theme colors                                  | `tailwind.config.ts`                      |
| Custom cursor behavior                        | `src/components/CustomCursor.tsx`         |

**Lightbox media priority per work:** `youtubeId` → `localVideo` → `gallery`.

---

## Project Structure

```
paul-portfolio/
├── public/
│   ├── works/
│   │   ├── thumbs/        # 1280w JPG thumbnails
│   │   ├── previews/      # WebM hover previews (VP9)
│   │   ├── videos/        # MP4 Lightbox fallback
│   │   └── gallery/       # Lightbox image carousel stills
│   └── resume.pdf         # download target for About CTA
├── scripts/
│   └── process-works.mjs  # raw_works → thumbs/previews/works.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx     # HTML shell, metadata, providers
│   │   ├── page.tsx       # home page composition
│   │   └── globals.css    # Tailwind + CSS vars + keyframes
│   ├── components/
│   │   ├── HeroShowreel.tsx
│   │   ├── WorksGrid.tsx
│   │   ├── WorkCard.tsx
│   │   ├── Lightbox.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   ├── CustomCursor.tsx
│   │   ├── SmoothScroll.tsx
│   │   └── Reveal.tsx
│   └── data/
│       └── works.ts       # auto-generated; manual edits preserved if not re-run
├── tailwind.config.ts
├── tsconfig.json
└── next.config.mjs
```

---

## Deployment

Deployed via **Vercel** with GitHub integration. Every push to `main`
triggers an automatic production deployment (~60s build).

Branch pushes get their own preview URL — use them for testing layout
changes before merging.

### First-time setup

1. Push the repo to GitHub.
2. Sign in at [vercel.com](https://vercel.com) with GitHub.
3. Import the repo. Next.js is auto-detected — no config needed.
4. Click **Deploy**.
5. To add a custom domain: Project → Settings → Domains → add your domain
   and follow the DNS instructions.

---

## Credits

- Inter typeface by Rasmus Andersson
- Smooth scroll by [Lenis](https://lenis.studiofreight.com/)
- Scroll animations by [GSAP](https://gsap.com/)
- Layout animations by [Framer Motion](https://www.framer.com/motion/)
- Social icons by [Simple Icons](https://simpleicons.org/)

© Paul Shen. All rights reserved.
