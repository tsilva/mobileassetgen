# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `npm run dev` — Start Next.js dev server (http://localhost:3000)
- `npm run build` — Production build
- `npm run start` — Serve production build
- `npm run lint` — Run ESLint

## Architecture

Mobile Asset Generator is a **purely client-side** Next.js 16 app that generates Android app assets (icons, feature graphics) from a text prompt using AI image generation via OpenRouter.

### Flow

1. User provides an OpenRouter API key (stored in localStorage) and an app description
2. App calls OpenRouter API (`google/gemini-3.1-flash-image-preview`) to generate a logo
3. Logo is processed client-side via Canvas API into 14+ Android icon variants (launcher, round, notification silhouettes) across density buckets (mdpi through xxxhdpi)
4. A second OpenRouter call generates a 16:9 feature graphic
5. All assets are downloadable individually or as a ZIP with Android resource directory structure (`mipmap-*/`, `drawable-*/`)

### Key Modules

- **`src/app/page.tsx`** — Main page; owns all state via `useReducer` with a 7-phase generation state machine (idle → generating-logo → processing-assets → generating-feature → processing-feature → complete/error)
- **`src/lib/openrouter.ts`** — OpenRouter API integration; generates images with crafted prompts for icons and feature graphics
- **`src/lib/imageProcessor.ts`** — Canvas-based image transforms: resize (center-crop), circle-crop (circular mask), silhouette (background removal + white foreground for notification icons)
- **`src/config/assetConfig.ts`** — Asset specifications defining all 20 generated assets with dimensions, transforms, categories, and ZIP paths
- **`src/lib/zipBuilder.ts`** — ZIP packaging with jszip; data URL conversion utilities
- **`src/types/index.ts`** — All TypeScript interfaces and type unions

### Important Patterns

- **No API routes or backend** — all communication goes directly from browser to OpenRouter
- **No external state management** — React `useReducer` only
- **Path alias** — `@/*` maps to `./src/*`
- **Tailwind CSS v4** with dark theme variables defined in `src/app/globals.css`
- **Image processing** uses Canvas API with careful anti-aliasing (silhouette transform uses corner-based background detection and graduated alpha blending to avoid halo artifacts)

## Project Maintenance

- README.md must be kept up to date with any significant project changes
