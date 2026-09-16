# surafel-site

Surafel Yimam's personal site. Next.js 16, React 19, TypeScript.

- The public site is one page of full-screen sections, one screen each, with snap scrolling on desktop.
- It has light and dark mode, a subtle grain texture, stats in the header and a section rail.
- Everything on the site lives in `content/site.json`.
- A password-protected settings page at `/admin` edits that file.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000 for the site and http://localhost:3000/admin for settings.
The admin password is `ADMIN_PASSWORD` in `.env.local`.

## What you can change in /admin

| Tab | What it controls |
|---|---|
| Profile | Name, greeting, headline, intro, availability, links, search and share text |
| Appearance | Default theme, accent colours for light and dark, texture strength, snap scrolling, reveal animation, section rail, progress line |
| Stats and status | Header stats, the "Right now" roles, the four big numbers |
| Sections | Show, hide, rename and reorder the screens |
| Projects | Add, edit, reorder and hide projects; choose which screen each appears on; upload screenshots; add steps |
| Experience | Jobs, skill groups, education |
| Writing | Articles |
| Contact | Closing note and footer text |

Every save is checked before it's written, so a typo can't break the site.
Ctrl+S or ⌘S saves. **Download backup** and **Load a backup** export and import the whole content file.

## Where saves go

| Where it's running | What a save does |
|---|---|
| Your machine (`npm run dev`) | Writes `content/site.json` and `public/uploads/`. The page updates straight away. |
| Vercel, with `GITHUB_TOKEN` and `GITHUB_REPO` set | Commits the change to GitHub. Vercel rebuilds and the site updates in about a minute. |
| Vercel, without them | Saving is off, because Vercel's disk is read-only. The settings page says so. |

## Deploy to Vercel

1. Push this folder to a GitHub repo, for example `surafelx/surafel-site`.
2. Import the repo in Vercel.
3. Add these environment variables:
   - `ADMIN_PASSWORD`: a long random password.
   - `GITHUB_TOKEN`: a fine-grained token with **Contents: Read and write** on that one repo.
   - `GITHUB_REPO`: `surafelx/surafel-site`
   - `GITHUB_BRANCH`: `main`
4. Put your CV at `public/Surafel-Yimam-Kebede-CV.pdf`, or change the CV link in Profile.

## Project layout

```
content/site.json            all site content and settings
src/lib/schema.ts            the content model and validation
src/lib/content.ts           loads content, turns settings into theme CSS
src/lib/storage.ts           saves to disk locally, or to GitHub on Vercel
src/lib/auth.ts              admin password check and signed session cookie
src/app/page.tsx             the site, built from the section list
src/components/site/         header, section rail, the seven sections
src/app/admin/               settings page
src/components/admin/        editor and reusable form fields
src/app/api/admin/           login, logout, save, image upload
```
