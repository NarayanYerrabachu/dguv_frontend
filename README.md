# DGUV Chat - Next.js Application

Vollständige Migration der Angular/NestJS DGUV Chat Anwendung zu Next.js 15.

## Implementierte Features

### Frontend
- **Welcome Page** (`/welcome`) - Landing page mit DGUV Branding
- **Chat Interface** (`/chat`) - Chat-UI mit Message Bubbles, Typing-Indicator, Enter-to-send

### Backend APIs

#### `/api/chat`
- **Method:** POST
- **Request:** `{msg: string, context?: string, language?: string}`
- **Response:** `{msg, response, language, context}`
- **Mock Mode:** Wenn `LLM_URL` leer → Echo-Modus


## 🚀 Quickstart

```bash
# Alles automatisch starten (empfohlen!)
npm start
```

Das war's! Der `npm start` Befehl macht automatisch:
- ✅ Prüft und installiert Dependencies
- ✅ Prüft .env.local (erstellt falls nicht vorhanden)
- ✅ Zeigt Konfiguration an
- ✅ Räumt Port 3000 auf
- ✅ Startet Development Server

Die App läuft auf: **http://localhost:3000**

### Alternative Befehle

```bash
# App stoppen
npm stop

# App neu starten
npm restart

# Nur Development Server (ohne Checks)
npm run dev

# Production Build & Start
npm run start:prod

# Nur Dependencies prüfen
npm run check:deps

# Nur Environment prüfen
npm run check:env
```

## Konfiguration

Alle Konfigurationen in `.env.local`:

- **LLM:** Lasse `LLM_URL` leer → Echo-Modus (für Development)
- **LLM Backend:** `LLM_URL` und `LLM_HEADER` für eigenes Backend

## Projektstruktur

```
avatar-dguv-nextjs/
├── app/
│   ├── api/
│   │   └── chat/         # LLM Chat endpoint
│   ├── (chatbot)/
│   │   ├── chat/         # Chat page
│   │   └── welcome/      # Welcome page
│   ├── layout.tsx        # Root layout (Header/Footer)
│   └── globals.css
├── components/
│   ├── chat/             # Chat-Komponenten
│   └── welcome/          # Welcome-Komponenten
├── hooks/                # useAudioRecorder, useChatMessages
├── public/               # Icons und Logo
└── .env.local
```

## Dependencies

- **next**: 16.x (App Router)
- **react**: 19.x
- **tailwindcss**: 4.x
- **typescript**: 5.x

## Troubleshooting

### Port bereits belegt
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### LLM antwortet nicht
Prüfe `LLM_URL` und `LLM_HEADER` in `.env.local`
