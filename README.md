# portfolio26

Personal portfolio site — projects, articles, notes, and an about/resume page. All content is **static**: it lives in plain TypeScript files under [`src/data/`](src/data/), so there's no database to run or configure.

## Stack

- **Next.js 14** (App Router) + React 18 + TypeScript
- **Tailwind CSS** + **shadcn/ui** (Radix primitives) for UI
- **Framer Motion** for animation
- **Vitest** + Testing Library for tests

## Getting started

```bash
npm install
npm run dev   # http://localhost:3000
```

No environment variables are required. See [`.env.example`](.env.example) for notes on the optional contact-form integration.

## Editing content

All content is data — edit these files and the pages update:

| File | Powers |
| ---- | ------ |
| [`src/data/projects.ts`](src/data/projects.ts) | Home page project grid + modals |
| [`src/data/articles.ts`](src/data/articles.ts) | Articles list and detail pages |
| [`src/data/notes.ts`](src/data/notes.ts) | Notes list and detail pages |
| [`src/data/about.ts`](src/data/about.ts) | About / resume page and contact info |
| [`src/data/types.ts`](src/data/types.ts) | Shared content types |

## Scripts

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `npm run dev`        | Start the dev server           |
| `npm run build`      | Production build               |
| `npm run start`      | Serve the production build     |
| `npm run lint`       | Lint with `eslint-config-next` |
| `npm run test`       | Run the Vitest suite once      |
| `npm run test:watch` | Run Vitest in watch mode       |
