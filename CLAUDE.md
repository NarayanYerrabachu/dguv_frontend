# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DGUV Chat frontend — a Next.js 16 web chat application for DGUV (German Social Accident Insurance). Migrated from Angular/NestJS. German-language UI for public service users.

## Commands

```bash
npm run dev          # Dev server (hot reload, port 3000)
npm start            # Full start with dependency/env checks (finds free port)
npm stop             # Stop running server
npm run build        # Production build
npm run lint         # ESLint (flat config, next/core-web-vitals + typescript)
```

No test framework is configured.

## Architecture

**Stack**: Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript 5

**Route structure** uses a `(chatbot)` route group:
- `/` redirects to `/welcome` (configured in `next.config.ts`)
- `/welcome` — landing page with DGUV branding
- `/chat` — chat interface with streaming responses and STT

**API routes** (server-side, no external dependencies required for dev):
- `POST /api/chat` — proxies to LLM backend (`LLM_URL`), falls back to echo mode when unconfigured
- `POST /api/chat/stream` — SSE streaming endpoint, uses `LLM_STREAM_URL` directly; falls back to deriving URL from `LLM_URL` if `LLM_STREAM_URL` is unset
- `POST /api/transcription` — proxies audio to STT backend (`STT_URL`), returns mock text when unconfigured

**Key patterns**:
- Chat state lives in `hooks/useChatMessages.ts` — streaming reader pattern with word-by-word append
- STT has dual mode in `hooks/useAudioRecorder.ts`: browser SpeechRecognition API (`NEXT_PUBLIC_STT_USE_BROWSER=true`) or MediaRecorder → backend FastWhisper transcription with silence detection
- `components/chat/ChatContent.tsx` exports the `Message` type used across chat components
- Layout nesting: root layout (Header/Footer) → `(chatbot)` layout (BlueBox + FeedbackButton) → page

**Styling**: Tailwind 4 with `@import "tailwindcss"` in `globals.css`. Custom animations (slide-up-fade, recordingBox, recordingDot) defined in globals.css.

## Environment

All config in `.env.local` (auto-created by `npm start` if missing):
- `LLM_URL` / `LLM_HEADER` — LLM backend for plain chat (empty = echo mode for dev)
- `LLM_STREAM_URL` — SSE streaming endpoint (e.g. `http://host/chat/stream`); if unset, derived from `LLM_URL` by replacing `/chat` → `/chat/stream`
- `STT_URL` / `STT_TOKEN` — speech-to-text backend (empty = mock mode)
- `NEXT_PUBLIC_STT_USE_BROWSER` — `"true"` to use browser Speech API instead of backend

## Path Alias

`@/*` maps to project root (configured in `tsconfig.json`).
