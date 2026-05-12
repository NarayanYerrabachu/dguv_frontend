# Feature Gap Analysis: avatar-dguv-nextjs vs avatar_frontend

Vergleich zwischen dem extrahierten Next.js-Projekt (`avatar-dguv-nextjs`) und dem Original (`avatar_frontend`).

---

## Fehlende Features — Wo gehören sie hin?

| Fehlendes Feature | Next.js | FastAPI Backend | Begründung |
|---|---|---|---|
| **HeyGen Avatar Streaming** (WebRTC Video, `@heygen/streaming-avatar` SDK) | ✅ | — | WebRTC läuft im Browser, SDK ist client-seitig |
| **AvatarPanel** (Video-Komponente, speak() Integration) | ✅ | — | Reine UI-Komponente |
| **Avatar State Management** (sessionId, sessionStarted, sessionLoading) | ✅ | — | UI-State, kein Server-Concern |
| **Markdown Rendering** (Bot-Antworten formatieren) | ✅ | — | Display-Logik im Client |
| **ErrorNotification** (Toast-System, critical/non-critical) | ✅ | — | UI-Feedback |
| **Idle-Detection** (Auto-Logout nach Timeout) | ✅ | — | Überwacht Browser-Interaktion |
| **Chat-only Modus Toggle** (Avatar optional) | ✅ | — | UI-State-Flag |
| **Login-Flow UI** (Email + EMMA ID Formular) | ✅ | — | UI-Komponente |
| **CORS Middleware** (`middleware.ts`) | ✅ | — | Schützt die `/api/*` Routes in Next.js |
| **Sprach-Umschaltung UI** (DE/EN Toggle) | ✅ | — | User-Präferenz, wird als Parameter mitgeschickt |
| **Auth-Logik** (Token-Validierung, Session-Management) | — | ✅ | Sicherheit gehört nicht in Next.js als finale Lösung |
| **Language-Parameter Verarbeitung** (Prompts DE/EN) | — | ✅ | LLM-Prompt-Logik ist Backend-Concern |
| **Avatar-Konfiguration** (Quality, Voice Rate, Avatar Name) | — | ✅ | Config-Werte kommen per `/api/theme` oder eigenem Config-Endpoint |
| **Swagger Dokumentation** | — | ✅ | FastAPI hat Swagger eingebaut (`/docs`) |

> **Faustregel:** Alles was der Browser sieht oder steuert → Next.js. Alles was Daten verarbeitet, sichert oder konfiguriert → FastAPI.

---

## Vollständiger Feature-Vergleich

| Feature | `avatar_frontend` (Original) | `avatar-dguv-nextjs` (Neu) |
|---|---|---|
| **Next.js Version** | 14.2.35 | 16.2.4 |
| **React Version** | 18.3.1 | 19.2.4 |
| **State Management** | Redux Toolkit | React Hooks (useState) |
| **HeyGen Avatar Streaming** | ✅ WebRTC + SDK | ❌ Fehlt (Token-Endpoint vorhanden) |
| **AvatarPanel** | ✅ | ❌ |
| **Chat Streaming** | ❌ (JSON responses) | ✅ ReadableStream |
| **Audio Recording** | Redux-basiert + MicButton | Hook-basiert (useAudioRecorder) |
| **Login-Flow** | ✅ Email + EMMA ID | ❌ |
| **Authentication** | API Key Validierung | JWT Tokens |
| **Idle-Detection** | ✅ Auto-Logout | ❌ |
| **Markdown Rendering** | ✅ remark-gfm | ❌ |
| **CORS Middleware** | ✅ Domain-Whitelist | ❌ |
| **Sprach-Umschaltung** | ✅ DE/EN via Redux | ❌ |
| **Chat-only Modus** | ✅ Toggle | ❌ (fest eingebaut) |
| **ErrorNotification** | ✅ Toast (critical/non-critical) | ⚠️ Inline Strings |
| **Theme API** | ❌ | ✅ `/api/theme` |
| **Health Check** | ❌ | ✅ `/api/health` |
| **Welcome-Seite + Routing** | ❌ | ✅ |
| **DGUV Corporate Branding** | ❌ | ✅ |
| **Dual STT Backend Support** | ❌ | ✅ STT_FORWARD + TRANSCRIPTION |
| **Swagger Dokumentation** | ✅ `/api/swagger` | ❌ (gehört in FastAPI) |
| **Avatar-Konfiguration** | ✅ Quality, Voice Rate, Name | ⚠️ Basis (avatar_id, voice_id) |
