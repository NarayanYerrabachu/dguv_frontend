# SSE Streaming Consumer — Technische Dokumentation

## Übersicht

Diese Implementierung ersetzt das bisherige einfache HTTP-Streaming durch **Server-Sent Events (SSE)** mit einem strukturierten Event-Protokoll. Der Benutzer sieht Tokens sofort beim Eintreffen, Quellenangaben erscheinen nach Abschluss der Antwort, und bei SSE-Fehlern greift ein automatischer Fallback auf den bisherigen `/api/chat` Endpunkt.

---

## Architektur

```
Browser (React)
    │
    │  POST /api/chat/stream
    ▼
Next.js API Route (app/api/chat/stream/route.ts)
    │
    │  Falls LLM_URL gesetzt:
    │    POST {LLM_URL}/chat/stream  ──► Backend SSE
    │
    │  Falls kein Backend:
    │    Echo-Mode (lokale SSE-Simulation)
    ▼
ReadableStream (text/event-stream)
    │
    ▼
useChatMessages Hook
    │
    ├── token events  ──► progressives Token-Rendering
    ├── done event   ──► Sources-Block anzeigen
    └── error event  ──► Error-State mit rotem Styling
```

---

## Neue Dateien

### `app/api/chat/stream/route.ts`

Next.js API Route die SSE-Responses erzeugt.

**Drei Modi:**

| Modus | Bedingung | Verhalten |
|---|---|---|
| Echo | `LLM_URL` nicht gesetzt | Simuliert Token-Streaming lokal |
| Backend SSE Pass-through | Backend antwortet mit `text/event-stream` | Stream wird direkt weitergeleitet |
| Backend Plain-Stream Wrap | Backend antwortet mit `text/plain` | Chunks werden als SSE `token` Events verpackt |

**SSE Event-Protokoll:**

```
event: token
data: {"token": "Hallo"}

event: token
data: {"token": " Welt"}

event: done
data: {"sources": [{"title": "DGUV Regel 101", "url": "https://..."}]}

event: error
data: {"message": "Beschreibung des Fehlers"}
```

**Response Headers:**
```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

---

## Geänderte Dateien

### `components/chat/ChatContent.tsx` — Message-Type erweitert

```typescript
export type Source = {
  title: string;
  url?: string;
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];   // Quellenangaben nach Antwort-Abschluss
  isError?: boolean;    // Fehler-State für rotes Styling
};
```

---

### `hooks/useChatMessages.ts` — Kern-Logik

**Ablauf beim Senden einer Nachricht:**

```
sendMessage()
    │
    ├─1─ User-Message in State hinzufügen
    ├─2─ isLoading = true
    ├─3─ Warte-Phasen starten (1s, 5s, 10s, 20s)
    │
    ├─4─ sendViaSSE() versuchen
    │       │
    │       ├── POST /api/chat/stream
    │       ├── ReadableStream öffnen
    │       ├── SSE-Buffer parsen (split auf \n\n)
    │       │
    │       ├── token  → content += token (progressiv)
    │       ├── done   → sources setzen
    │       ├── error  → isError = true, Meldung anhängen
    │       │
    │       └── Rückgabe: true (Erfolg) / false (Fehler)
    │
    ├─5─ Falls SSE fehlschlug → sendViaFallback()
    │       │
    │       └── POST /api/chat (bisheriger plain-stream)
    │
    └─6─ isLoading = false, Warte-Phasen stoppen
```

**SSE-Buffer Parsing:**

SSE-Frames sind durch `\n\n` getrennt. Jeder Frame hat das Format:
```
event: <typ>
data: <json>
```

Der Parser sammelt eingehende Chunks in einem Buffer, splittet auf `\n\n` und verarbeitet vollständige Frames. Unvollständige Frames bleiben im Buffer für den nächsten Chunk.

**Reader Cleanup:**

`readerRef` hält den aktiven `ReadableStreamDefaultReader`. Bei Komponenten-Unmount wird `reader.cancel()` aufgerufen um den Stream sauber zu schließen und Memory Leaks zu vermeiden.

---

### `components/chat/ChatMessage.tsx` — UI-Erweiterungen

**Error-State:**
```tsx
isError
  ? "border border-red-200 bg-red-50 text-red-700 shadow-sm"
  : "border border-gray-200 bg-white text-[#333333] shadow-sm"
```

**Sources-Block** (erscheint nur wenn `sources.length > 0`):
```tsx
<div className="mt-3 border-t border-gray-200 pt-3">
  <p>Quellen</p>
  <ul>
    {sources.map(source => (
      source.url
        ? <a href={source.url}>{source.title}</a>
        : <span>{source.title}</span>
    ))}
  </ul>
</div>
```

---

## Fallback-Mechanismus

```
SSE fehlgeschlagen?
    │
    ├── Netzwerkfehler beim Öffnen
    ├── response.ok === false
    ├── response.body === null
    │
    └── sendViaSSE() gibt false zurück
            │
            ▼
        sendViaFallback()
            │
            └── POST /api/chat (plain ReadableStream)
```

Der Fallback ist transparent — der Benutzer sieht keinen Unterschied außer dass Tokens möglicherweise in größeren Chunks ankommen.

---

## Browser-Kompatibilität

Diese Implementierung verwendet `fetch` + `ReadableStream` statt der nativen `EventSource` API. Das hat folgende Vorteile:

| Eigenschaft | `EventSource` | `fetch` + `ReadableStream` |
|---|---|---|
| POST-Requests | ✗ (nur GET) | ✓ |
| Custom Headers | ✗ | ✓ |
| Browser-Support | Chrome, Firefox, Safari, Edge | Chrome, Firefox, Safari, Edge |
| Abbruch möglich | Nur via `.close()` | Via `reader.cancel()` |

---

## Umgebungsvariablen

| Variable | Beschreibung |
|---|---|
| `LLM_URL` | Backend-URL. Stream-Endpunkt wird automatisch abgeleitet: `{LLM_URL}` → `{LLM_URL/chat/stream}` |
| `LLM_HEADER` | JSON-String mit Auth-Headers (z.B. `{"api_key": "..."}`) |

Kein `LLM_URL` gesetzt → Echo-Modus aktiv (lokales Testen ohne Backend).

---

## Testen

**Echo-Modus** (kein Backend nötig):
```bash
npm run dev
# Nachricht senden → Tokens erscheinen wortweise mit 80ms Delay
```

**Warte-Phasen testen** (nur development):
```
Nachricht: *waittesting*
→ 35 Sekunden Delay → alle 4 Warte-Phasen durchlaufen
```

**Fallback testen:**
- `LLM_URL` auf eine nicht-erreichbare URL setzen
- Nachricht senden → SSE schlägt fehl → automatisch Fallback auf `/api/chat`

---

## Bekannte Einschränkungen

- `field-sizing: content` für die Textarea wird in Safari < 17.4 nicht unterstützt — die Textarea wächst dort nicht automatisch
- SSE-Verbindungen werden von einigen Proxies/Load-Balancern bei langen Antwortzeiten getrennt (typisch: 60-120s Timeout)
