# Speech-to-Text (Spracherkennung)

## Überblick

Nach der Aufnahme wird die Sprache in Text umgewandelt und automatisch ins Textarea eingefügt. Der Nutzer kann den Text noch bearbeiten und dann absenden.

**Flow:**
```
Mikrofon klicken → Aufnahme läuft → Stille erkannt / Stop → Text erscheint im Textarea → Nutzer sendet ab
```

---

## Zwei Modi

### Modus 1 — Browser Speech API (für lokales Testen)

```
NEXT_PUBLIC_STT_USE_BROWSER=true
```

- Kein Backend nötig
- Spracherkennung läuft direkt im Browser
- Sprache: Deutsch (`de-DE`)
- **Funktioniert nur in Chrome und Edge** (nicht Firefox)
- Automatischer Stop nach ca. 2–3 Sekunden Stille (vom Browser gesteuert)

### Modus 2 — FastWhisper Backend (für Produktion)

```
NEXT_PUBLIC_STT_USE_BROWSER=false
STT_URL=http://internal-emma-internal-....elb.amazonaws.com/v1/audio/transcriptions
STT_TOKEN=dein-token
```

- Audio wird als WebM-Datei an `POST /api/transcription` gesendet
- Next.js leitet die Anfrage an den FastWhisper-Service weiter
- Genaueste Ergebnisse, vollständig lokal, kein externer Dienst
- `STT_URL` leer lassen → Mock-Modus (gibt immer einen Testtext zurück)

---

## Konfiguration (.env.local)

```env
# true  = Browser Web Speech API (kein Backend, nur Chrome/Edge)
# false = FastWhisper über STT_URL
NEXT_PUBLIC_STT_USE_BROWSER=true

# Nur relevant wenn NEXT_PUBLIC_STT_USE_BROWSER=false:
STT_URL=
STT_TOKEN=
```

---

## Aufnahme-Parameter

| Parameter | Standard | Beschreibung |
|---|---|---|
| `maxDurationSeconds` | 60s | Max. Aufnahmedauer, dann automatischer Stop |
| `silenceTimeoutMs` | 2000ms | Stop nach 2 Sekunden Stille |
| `silenceThreshold` | 0.01 | RMS-Schwellenwert für Stille-Erkennung |

---

## Betroffene Dateien

| Datei | Beschreibung |
|---|---|
| `hooks/useAudioRecorder.ts` | Hook — wählt Browser oder Backend je nach Env-Variable |
| `app/api/transcription/route.ts` | API-Route — leitet Audio an FastWhisper weiter |
| `components/chat/ChatInputArea.tsx` | UI-Zustände: Aufnahme läuft / Spracherkennung läuft |
| `components/chat/ChatContent.tsx` | Verbindet Hook mit UI |
| `hooks/useChatMessages.ts` | `setTranscribedText` — setzt den erkannten Text ins Textarea |

---

## API-Route (`/api/transcription`)

**Request:** `POST` mit `multipart/form-data`, Feld `file` (Audio WebM)

**Response:** `{ "text": "erkannter Text" }`

Wenn `STT_URL` nicht gesetzt ist, gibt die Route einen festen Mock-Text zurück — kein Fehler.
