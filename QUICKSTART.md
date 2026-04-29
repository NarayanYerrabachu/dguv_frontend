# 🚀 Quick Start Guide

## Installation & Start (3 Schritte)

### 1️⃣ Projekt klonen/öffnen
```bash
cd /home/emad-almousa/src/avatar-dguv-nextjs
```

### 2️⃣ App starten
```bash
npm start
```

### 3️⃣ Browser öffnen
Öffne: **http://localhost:3000**

**Das war's!** 🎉

---

## Was macht `npm start`?

Der Befehl führt automatisch alle notwendigen Schritte aus:

```
🚀 Starting DGUV Chat (Next.js)...

🧹 Cleaning up port 3000...           ← Räumt Port auf
🔍 Checking dependencies...            ← Installiert fehlende Packages
✅ All dependencies are installed!

🔍 Checking environment configuration... ← Prüft .env.local
📋 Current Configuration:              ← Zeigt Konfiguration
   🔐 Authentication: (mock mode)
   🤖 LLM Backend: (echo mode)
   🎤 Transcription: (mock mode)
   🎬 HeyGen: not set

✅ Environment check complete!

🎯 Starting development server...      ← Startet Next.js
▲ Next.js 16.2.4 (Turbopack)
- Local: http://localhost:3000        ← FERTIG!
```

---

## 🎮 Features testen

### Chat ausprobieren
1. Öffne http://localhost:3000
2. Klicke auf "Chat starten"
3. Schreibe eine Nachricht
4. **Echo Mode:** Da `LLM_URL` leer ist, wird die Nachricht zurück gesendet

### Authentifizierung (Simulation Mode)
```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"emmaId":"1234","email":"test@test.com"}'

# ✅ Gibt JWT Token zurück
```

### Sprachaufnahme
1. Im Chat auf Mikrofon-Button klicken
2. Erlauben
3. Sprechen
4. **Mock Mode:** Da `STT_FORWARD_URL` leer ist, wird Mock-Text zurückgegeben

---

## 🔧 Konfiguration anpassen

### Production LLM Backend aktivieren

Bearbeite `.env.local`:

```bash
# LLM Backend aktivieren
LLM_URL=http://your-llm-backend:8088/chat
LLM_HEADER={"api_key": "YOUR_KEY", "Content-Type": "application/json"}
```

Restart:
```bash
npm start
```

### Transcription Service aktivieren

```bash
# In .env.local
STT_FORWARD_URL=http://your-stt-service/v1/audio/transcriptions
STT_FORWARD_TOKEN=your-token-here
```

### HeyGen Video Avatar aktivieren

```bash
# In .env.local
HEYGEN_API_KEY=your-api-key
HEYGEN_AVATAR_ID=avatar-uuid
HEYGEN_VOICE_ID=voice-uuid
```

---

## 🐛 Probleme beheben

### Port bereits belegt
```bash
# Automatisch von npm start behoben!
# Oder manuell:
lsof -ti:3000 | xargs kill -9
npm start
```

### Dependencies fehlen
```bash
# Automatisch installiert von npm start!
# Oder manuell:
npm run check:deps
```

### .env.local fehlt
```bash
# Automatisch erstellt von npm start!
# Oder manuell:
npm run check:env
```

---

## 📚 Weitere Befehle

```bash
# Production Build
npm run build
npm run start:prod

# Nur Linting
npm run lint

# Dependencies aktualisieren
npm update
```

---

## 🎯 Nächste Schritte

1. **Chat testen:** http://localhost:3000
2. **API testen:** http://localhost:3000/api/health
3. **Konfiguration anpassen:** Bearbeite `.env.local`
4. **Code anpassen:** Dateien in `app/` bearbeiten
5. **Production deployen:** `npm run build && npm run start:prod`

---

## 💡 Tipps

- **Mock Modes:** Alle externen Services haben Mock-Modes für Development
- **Hot Reload:** Code-Änderungen werden automatisch übernommen
- **TypeScript:** Vollständige Type-Safety
- **API First:** Alle Endpoints unter `/api/*`

Viel Erfolg! 🚀
