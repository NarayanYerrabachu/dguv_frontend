# Fix Broken Session Persistence in DGUV Chat Frontend - Implementation Plan

**Status**: 🔄 In Progress

**Last Updated**: 2026-08-27

**Use this document to track this simple, single-file bug fix.**

## Requirements & Context

### Core Requirements
- **What:** Make the chat client send a stable `context` (session/conversation) identifier with every `/chat` request so the middleware keeps one conversation session across turns.
- **Why:** Today the client never sends `context`, so the API proxy substitutes the literal string `"noSession"` on every turn, and the middleware starts a fresh session per user turn. This is the reported "new session per user turn" bug.
- **Who requested:** Product/user (root cause investigation already completed and approved).
- **Success metric:** Every request in one conversation carries the same non-`"noSession"` `context` value; the middleware maintains a single session for the lifetime of the page.

### Root Cause (already investigated)
The middleware persists a conversation via a `context` identifier (context_id / session_id) sent with every `/chat` request. The frontend API routes are already wired to forward it:
- `src/app/api/chat/stream/route.ts` — reads `context` from the request body and forwards it as `context: context ?? 'noSession'` to the LLM backend.
- `src/app/api/chat/route.ts` — same pattern.

The gap is in the client hook `src/hooks/useChatMessages.ts`, which never sends a `context`. Both fetch calls send only `{ msg, language: "de" }`:
- `sendViaSSE` → `fetch("/api/chat/stream", ...)` (body built around line 90)
- `sendViaFallback` → `fetch("/api/chat", ...)` (body built around line 175)

Because `context` is always `undefined`, the proxy substitutes `"noSession"` on every turn. A grep for `context` in `src/` hits only the two API routes; there is no localStorage/sessionStorage/session-init anywhere.

### Feature Specifications

**Behavior:**
- The CLIENT generates a session id (a UUID via `crypto.randomUUID()`).
- The id is generated once and stays stable for the lifetime of one conversation.
- The id RESETS ON PAGE RELOAD (confirmed acceptable). It is held in a `useRef` in `useChatMessages.ts`, initialized once — it is NOT persisted to localStorage or sessionStorage.
- The id is sent as `context` in the JSON body of BOTH fetch calls (`sendViaSSE` and `sendViaFallback`), alongside the existing `msg` and `language` fields.

**System behavior after fix:**
1. User opens `/chat` — a session id is generated once.
2. Each user turn (SSE or fallback path) sends `{ msg, language: "de", context: <sessionId> }`.
3. The API route forwards the real `context` (no longer `"noSession"`), so the middleware keeps one session.
4. On page reload, a new session id is generated (new conversation).

### Out of Scope
- No server-side / API route changes — `src/app/api/chat/route.ts` and `src/app/api/chat/stream/route.ts` already forward `context` unchanged.
- No persistence across reloads (localStorage/sessionStorage). Reset-on-reload is intentional.
- No new runtime dependencies.

### Related Decisions
- Persist the session id to localStorage/sessionStorage → rejected: reset-on-reload is acceptable and simpler; avoids stale-session and privacy concerns.
- Generate the id server-side → rejected: the routes are stateless proxies and already forward whatever the client sends; client-owned id is the smaller, correct change.

## Overview

### What We Want to Do
Add a client-generated, per-conversation session id in `useChatMessages.ts` and include it as `context` in both outbound chat requests.

### Why We Need This
Without a `context`, the proxy sends `"noSession"` and the middleware cannot maintain conversation state, breaking multi-turn context.

### Approach
Initialize a `useRef` once with `crypto.randomUUID()` and add `context: <ref value>` to the JSON bodies of both `sendViaSSE` and `sendViaFallback`.

### Architectural Note: Two Distinct UUID Uses (do not conflate)
`useChatMessages.ts` already calls `crypto.randomUUID()` in several places — `appendAssistantMessage` (line 68) and the user/error message pushes (lines 210, 225). Those are **React list keys** (`Message.id`) and are regenerated per message on purpose. The NEW session id is a **separate, conversation-scoped value** that must be generated exactly once (in a ref) and must NOT reuse or be merged with the per-message ids. Executor must keep these two concepts clearly separate.

## Task Breakdown

### Phase 1: Core Implementation (System Functional) ✅

**Executor:** `frontend-simple`

**What this phase delivers:**
The chat client sends a stable, per-conversation `context` on every turn via both the SSE and fallback paths.

**End-of-phase system state:**
- Both `/api/chat/stream` and `/api/chat` requests include `context: <sessionId>`.
- Session id is stable within a page lifetime and regenerated on reload.
- Per-message `Message.id` UUIDs are unchanged.
- **System runs without errors.**

**Reviewable outcome:**
In the browser Network tab, both chat request payloads show the same `context` UUID across turns; reloading the page yields a new `context`.

**Definition of Done:**
- [x] A session id is generated exactly once per page load via `crypto.randomUUID()` held in a `useRef`.
- [x] `sendViaSSE` sends `context: <sessionId>` alongside `msg` and `language`.
- [x] `sendViaFallback` sends `context: <sessionId>` alongside `msg` and `language`.
- [x] The session id is NOT written to localStorage/sessionStorage.
- [x] Existing per-message `crypto.randomUUID()` calls (list keys) are untouched.
- [x] No new dependencies added.

**Tasks:**

| Task | Files | Complexity | Status | Description |
|------|-------|------------|--------|-------------|
| 1.1 | `src/hooks/useChatMessages.ts` | Low | ✅ | Add conversation-scoped session id ref and include it as `context` in both fetch bodies |

---

### Phase 2: Implementation Review ✅

**Review Type:** Post-Implementation

**Definition of Done:**
- [x] Session id is generated once (ref-based), not per render or per message.
- [x] `context` is present in BOTH fetch bodies with the same value across turns.
- [x] Per-message list-key UUIDs are not conflated with the session id.
- [x] No persistence added; no new dependencies; no server-side changes.
- [x] No scope creep beyond the single-file change.

**Process:**
- code-reviewer reviews Phase 1.
- If findings: create Review Findings phase, executor fixes, re-review.
- If clean: proceed to testing.

---

### Phase 3: Testing ✅

**Focus:** Frontend tests.

**Note — no test framework currently configured.** The project has no test runner (`package.json` has no test script). This phase may introduce **Vitest + React Testing Library** (and any minimal config/setup they require) to enable hook testing. Introducing the test tooling is in scope for this phase only if needed to test the fix.

**Definition of Done:**
- [x] Test tooling (Vitest + React Testing Library) is installed and a `test` script exists, if not already present.
- [x] Test verifies both fetch calls (`/api/chat/stream` and `/api/chat`) receive a `context` field.
- [x] Test verifies the `context` value is identical across multiple sends within one hook instance (stability).
- [x] Test verifies a fresh hook instance (simulated reload) produces a different `context`.
- [x] Test verifies `context` is never the literal `"noSession"` from the client.
- [x] All tests pass.
- [x] Git commit contains only test/config files (plus dependency manifest changes for the test tooling).

**Tasks:**

| Task | Files | Complexity | Status | Description |
|------|-------|------------|--------|-------------|
| 3.1 | `vitest.config.ts`, `vitest.setup.ts`, `package.json` | Medium | ✅ | Introduce Vitest + React Testing Library (+ jsdom); add `test` script |
| 3.2 | `src/hooks/__tests__/useChatMessages.test.ts` | Medium | ✅ | Tests for session-id presence (SSE + fallback), stability, per-instance uniqueness, and non-`noSession` |

**Bug Discovery Protocol:**
- If tests reveal implementation bugs: create Bug Findings phase.
- `frontend-simple` executor fixes bugs (test executor cannot modify implementation files).
- Re-run tests after fixes.

**Git Commit:** `[test] Phase 3: Test coverage for session persistence`

---

### Phase 4: Test Review ⏸️

**Review Type:** Post-Test

**Definition of Done:**
- [ ] `src/hooks/useChatMessages.ts` is unchanged from its post-implementation state.
- [ ] Tests validate actual behavior (context presence/stability/uniqueness), not just "pass".
- [ ] Test coverage matches Phase 3 DoD.
- [ ] No implementation regressions.

**Process:**
- code-reviewer verifies the test phase did not modify implementation.
- If regression detected: create Review Findings phase, executor fixes.
- If clean: proceed to quality gate.

---

### Phase 5: Frontend Quality Gate ⏸️

**Definition of Done:**
- [ ] `npm run lint` passes (ESLint, next/core-web-vitals + typescript).
- [ ] TypeScript type-check passes (`tsc --noEmit`).
- [ ] All tests pass (`npm test` / Vitest).
- [ ] No console errors when running the app through a multi-turn chat.

---

### Phase 6: Documentation

**Handled by:** `doc-writer` agent (follows `~/.claude/documentation-standard/`).

Do not detail documentation tasks here. The doc-writer determines what needs updating based on the documentation standard and the code changes made.

**Areas affected by this implementation** (context for doc-writer):
- `CLAUDE.md` — the **Architecture** section (Key patterns: chat state in `useChatMessages.ts`) and the **Environment** section should reflect the new client-generated, per-conversation session id sent as `context`, and that it resets on page reload (no persistence).
- Session/context behavior of the chat flow (client generates id → forwarded by API routes → consumed by middleware).
- New dev tooling if Vitest + React Testing Library are introduced (the "No test framework is configured" note in `CLAUDE.md` Commands would become outdated).

**Git Commit:** `[docs] Phase 6: Documentation for session persistence`

---

### Complexity Legend
- **Low**: Straightforward implementation, well-understood patterns.
- **Medium**: Some complexity, requires design decisions or new patterns.

### Status Legend
- ⏸️ Not Started | 🔄 In Progress | ✅ Completed | ❌ Blocked

## Detailed Task Specifications

### Task 1.1: Add per-conversation session id and send as `context` ✅

**What needs to exist:**
A single, conversation-scoped session identifier, generated once per page load, that is attached as `context` to every outbound chat request from `useChatMessages.ts`.

**System behavior:**
1. On first render of the hook, a session id is created via `crypto.randomUUID()` and stored in a `useRef` (initialized once).
2. `sendViaSSE` includes that id as `context` in its JSON body: `{ msg, language: "de", context: <sessionId> }`.
3. `sendViaFallback` includes the same id as `context` in its JSON body.
4. On page reload, the hook re-mounts and a new id is generated (new conversation).

**Definition of Done:**
- [ ] Session id generated exactly once (ref-based initialization), not on every render or send.
- [ ] Both fetch bodies include `context` with the identical id within one page lifetime.
- [ ] No localStorage/sessionStorage usage.
- [ ] Existing per-message `crypto.randomUUID()` list keys (lines ~68, ~210, ~225) remain unchanged and separate.
- [ ] No new imports/dependencies beyond what's already available (`useRef` is already imported).

**Integration points:**
- API routes `src/app/api/chat/stream/route.ts` and `src/app/api/chat/route.ts` already read `context` from the body and forward it (`context ?? 'noSession'`). No changes there — this task makes `context` defined so the fallback is no longer triggered.

**Files likely affected:**
- `src/hooks/useChatMessages.ts` (only)

## Testing Strategy

### Unit / Hook Testing
- Session id present as `context` in `/api/chat/stream` request body.
- Session id present as `context` in `/api/chat` request body.
- Stability: same `context` across multiple sends in one hook instance.
- Uniqueness: different `context` across separate hook instances (reload simulation).
- Client never emits the literal `"noSession"`.

### Manual Testing
- [ ] Open `/chat`, send several messages, confirm identical `context` UUID in Network tab across turns (both SSE and, if triggered, fallback).
- [ ] Reload the page, send a message, confirm a new `context` UUID.
- [ ] Confirm no console errors and chat streaming still works.

## Success Criteria

1. Every chat request in one conversation carries the same client-generated `context` UUID.
2. The client never sends `"noSession"`; the middleware maintains one session per page lifetime.
3. Reload produces a new session; existing streaming, sources, and error handling behavior is unchanged.

## Implementation Updates

**2026-08-27**: Phase 1 implemented as planned — single-file change, no deviations.
- Added `const sessionIdRef = useRef(crypto.randomUUID())` after the existing refs in `useChatMessages.ts`.
- Added `context: sessionIdRef.current` to the `JSON.stringify` body in both `sendViaSSE` (line ~91) and `sendViaFallback` (line ~176).
- Pre-existing per-message `crypto.randomUUID()` calls (lines 68, 210, 225) are untouched.
- `npm run lint` passes with 0 errors (4 pre-existing warnings in API routes, unrelated).

**2026-08-27**: Phase 2 review finding resolved (Task 2.1) — replaced `useRef` session id with lazy `useState` initializer.
- `useRef(crypto.randomUUID())` evaluates `crypto.randomUUID()` on every render (React discards subsequent values but the call still occurs). Replaced with `const [sessionId] = useState(() => crypto.randomUUID())` which calls the initializer exactly once.
- Removed `sessionIdRef` ref; replaced both `sessionIdRef.current` usages in `sendViaSSE` and `sendViaFallback` with the bare `sessionId` variable.
- `useState` was already imported; no new dependencies introduced.
- `npm run lint` passes with 0 errors.

**2026-08-27**: Phase 3 (Testing) completed.
- Introduced Vitest + React Testing Library + jsdom (dev dependencies); added `test: "vitest run"` script and `vitest.config.ts` (with `@` → `src` alias) plus `vitest.setup.ts` (jest-dom matchers + `crypto.randomUUID` polyfill guard).
- Added `src/hooks/__tests__/useChatMessages.test.ts` with 5 tests driving the hook via its public API (`handleInputChange` + `handleSubmit`) and a URL-keyed `global.fetch` mock:
  - `context` present on the SSE path (`/api/chat/stream`).
  - `context` present on the fallback path (`/api/chat`, triggered by `ok: false` SSE response) and equal to the SSE `context`.
  - Stability: identical `context` across 3 sends in one hook instance.
  - Uniqueness: a fresh hook instance (reload simulation) yields a different `context`.
  - Client never emits the literal `"noSession"`.
- All 5 tests pass. No implementation files modified; no bugs found.

---

## Related Documentation
- `CLAUDE.md` — Architecture (Key patterns) and Environment sections.
- `src/app/api/chat/stream/route.ts`, `src/app/api/chat/route.ts` — existing `context` forwarding.
</content>
</invoke>
