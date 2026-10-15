# Juandre Art Portfolio

Interactive portfolio site built with React, Vite, MUI, and immersive visual layers.

Production runs on Vercel with the custom domain https://ee-ze.com.

## Table of Contents

- [Current Status](#current-status)
- [Running Locally](#running-locally)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Testing and Quality](#testing-and-quality)
- [Redesign Spec](#redesign-spec)
- [3D Asset Notes](#3d-asset-notes)
- [Deployment](#deployment)

## Current Status

The current app is centered on a single immersive Home route with:

- lazy-loaded route rendering
- shader-style glass background treatment
- downloadable CV access
- contact and profile content on the same page
- persisted dark mode via Zustand
- reduced-motion support
- render-level coverage with Vitest

The repository also contains a redesign specification for future work. That spec describes target-state changes that are not all implemented yet.

## Running Locally

Install dependencies:

```bash
pnpm install
```

Start the local dev server:

```bash
pnpm start
```

Expose the dev server on your local network:

```bash
pnpm start:host
```

Preview the production build locally:

```bash
pnpm preview
```

## Available Scripts

```bash
pnpm start
pnpm start:host
pnpm build
pnpm preview
pnpm test
pnpm test:watch
pnpm test:ui
pnpm lint
pnpm lint:fix
```

## Project Structure

- `src/main.tsx`: app bootstrap, theme provider, and router mounting
- `src/routes.tsx`: route definitions and lazy loading
- `src/pages/home-page/home-page.tsx`: main portfolio experience
- `src/pages/home-page/glass-background.tsx`: immersive background layer
- `src/shared/immersive-page-loader.tsx`: suspense loading experience
- `src/lib/zustand/theme-store.ts`: persisted theme state
- `src/tests/`: route, theme, and page render coverage

## Testing and Quality

The project uses Oxlint for linting and Vitest for render-level tests.

Run the main checks:

```bash
pnpm lint
pnpm test
pnpm build
```

## Redesign Spec

The redesign planning docs live in `specs/app-redesign/`.

- `specs/app-redesign/overview.md`
- `specs/app-redesign/requirements.md`
- `specs/app-redesign/acceptance-criteria.md`
- `specs/app-redesign/front-end-design.md`

Use these documents as target-state planning material, not as a description of the fully shipped app.

## 3D Asset Notes

Current asset/export assumptions:

- compressed assets
- joined geometries for fewer draw calls
- no textures

Draco decoder files are available under `public/draco/`.

## Deployment

The site is intended for Vercel deployment with SPA routing support configured in `vercel.json`.
