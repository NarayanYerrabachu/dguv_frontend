# DGUV Chat - Next.js Application

Vollständige Migration der Angular/NestJS DGUV Chat Anwendung zu Next.js 15.

## ✅ Implementierte Features

### Frontend
- **Welcome Page** (`/`) - Landing page mit DGUV Branding
- **Chat Interface** (`/chat`) - Vollständige Chat-UI mit:
  - Message Bubbles (User/Assistant)
  - Real-time typing indicators
  - Speech-to-text (Mikrofonaufnahme)
  - Textarea mit Enter-to-send
  - Responsive Design

### Backend APIs

#### `/api/health`
- **Method:** GET
- **Description:** Health check endpoint
- **Response:** `{status: 'ok'}`

#### `/api/auth`
- **Method:** POST
- **Description:** JWT-basierte Authentifizierung
- **Request:** `{emmaId: string, email: string}`
- **Response:** `{hey_gen_allowed: boolean, idle_time: number, accessToken: string}`
- **Simulation Mode:** Wenn `AUTH_URL` leer, akzeptiert nur `emmaId="1234"` und `email="test@test.com"`

#### `/api/chat`
- **Method:** POST
- **Description:** LLM Chat endpoint
- **Request:** `{msg: string, context?: string, language?: string}`
- **Response:** LLM response (format depends on backend)
- **Mock Mode:** Wenn `LLM_URL` leer, echoed request zurück

#### `/api/transcription`
- **Method:** POST
- **Description:** Speech-to-text transcription
- **Request:** Multipart form-data mit `file` field
- **Response:** `{text: string}`
- **Mock Mode:** Wenn `STT_FORWARD_URL` leer, gibt Mock-Text zurück

#### `/api/get-access-token`
- **Method:** POST
- **Description:** HeyGen Live Avatar session token
- **Response:** `{token: string}`
- **Requires:** HEYGEN_API_KEY, HEYGEN_AVATAR_ID, HEYGEN_VOICE_ID

#### `/api/theme`
- **Method:** GET
- **Description:** Theme configuration mit Umgebungsvariablen-Overrides
- **Response:** JSON mit theme config

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

## 🔧 Konfiguration

Alle Konfigurationen in `.env.local`:

### Simulation/Mock Modes
- **Auth:** Lasse `AUTH_URL` leer → verwendet test@test.com / 1234
- **LLM:** Lasse `LLM_URL` leer → echo mode
- **Transcription:** Lasse `STT_FORWARD_URL` leer → mock text

### Production Setup
Fülle die entsprechenden URLs und Tokens für:
- External Auth Service (`AUTH_URL`, `AUTH_HEADER`)
- LLM Backend (`LLM_URL`, `LLM_HEADER`)
- Transcription Service (`STT_FORWARD_URL`, `STT_FORWARD_TOKEN`)
- HeyGen Integration (`HEYGEN_API_KEY`, etc.)

## 📁 Projektstruktur

```
avatar-dguv-nextjs/
├── app/
│   ├── api/              # Backend API routes
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── transcription/
│   │   ├── get-access-token/
│   │   ├── health/
│   │   └── theme/
│   ├── chat/             # Chat page
│   ├── layout.tsx        # Root layout (Header/Footer)
│   ├── page.tsx          # Welcome page
│   └── globals.css       # Global styles + DGUV theme
├── public/
│   ├── assets/
│   │   └── theme.json
│   └── *.svg             # Icons und Logos
└── .env.local            # Environment configuration
```

## 🎨 Theme

DGUV Farben:
- Primary Blue: `#004994`
- Light Blue: `#d4edfc`
- Text Color: `#003366`

Font: Source Sans 3 (400, 500, 600, 700)

## 🔄 Migration von alter App

Alle Features der alten Angular/NestJS App wurden 1:1 portiert:
- ✅ Alle API Endpoints
- ✅ JWT Authentication
- ✅ LLM Integration
- ✅ Speech-to-Text
- ✅ HeyGen Video Avatar
- ✅ Theme System
- ✅ Mock/Simulation Modes
- ✅ UI/UX Design

## 📝 Dependencies

- **next**: 16.x (App Router)
- **react**: 19.x
- **tailwindcss**: 4.x
- **typescript**: 5.x
- **jsonwebtoken**: JWT signing

## 🐛 Troubleshooting

### Port bereits belegt
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### LLM antwortet nicht
Prüfe `LLM_URL` und `LLM_HEADER` in `.env.local`

### Mikrofonaufnahme funktioniert nicht
- Browser benötigt HTTPS oder localhost
- Mikrofonberechtigung muss erteilt werden
