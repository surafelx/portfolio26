# portfolio26

Personal portfolio site with an admin dashboard for managing projects, articles, notes, and an about page, plus basic visit/view analytics.

## Stack

- **Next.js 14** (App Router) + React 18 + TypeScript
- **MongoDB** (`mongodb` driver) for content storage
- **Tailwind CSS** + **shadcn/ui** (Radix primitives) for UI
- **Framer Motion** for animation
- **Cloudinary** for image uploads
- **Vitest** + Testing Library for tests

## Getting started

```bash
npm install
cp .env.example .env   # then fill in the values
npm run dev            # http://localhost:3000
```

## Environment variables

See [`.env.example`](.env.example):

| Variable         | Description                                |
| ---------------- | ------------------------------------------ |
| `MONGODB_URI`    | MongoDB connection string (local or Atlas) |
| `VERCEL_URL`     | Public deployment URL (no protocol)        |
| `ADMIN_USERNAME` | Admin dashboard login                      |
| `ADMIN_PASSWORD` | Admin dashboard password                   |

## Scripts

| Command                  | Description                    |
| ------------------------ | ------------------------------ |
| `npm run dev`            | Start the dev server           |
| `npm run build`          | Production build               |
| `npm run start`          | Serve the production build     |
| `npm run lint`           | Lint with `eslint-config-next` |
| `npm run test`           | Run the Vitest suite once      |
| `npm run test:watch`     | Run Vitest in watch mode       |
| `npm run populate-about` | Seed the about page            |
| `npm run migrate-notes`  | One-off notes migration        |

Data-seeding and migration scripts live in [`scripts/`](scripts/) and read `MONGODB_URI` from your environment.
