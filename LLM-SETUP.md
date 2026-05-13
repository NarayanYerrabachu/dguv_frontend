# LLM Integration einrichten

Die App unterstützt **2 Modi** für Chat-Antworten:

---

## Option 1: Eigenes LLM Backend (Production)

Bearbeite `.env.local`:

```bash
LLM_URL=http://your-llm-backend:8088/chat
LLM_HEADER={"api_key": "YOUR_KEY", "Content-Type": "application/json"}
```

Die App sendet POST-Requests mit:
```json
{
  "msg": "User message",
  "language": "de",
  "context": "session-id"
}
```

Erwartete Antwort:
```json
{
  "msg": "User message",
  "response": "LLM response",
  "language": "de"
}
```

Restart:
```bash
npm stop
npm start
```

---

## Option 2: Echo/Mock Mode (Development)

Lasse `LLM_URL` leer in `.env.local`:

```bash
LLM_URL=
LLM_HEADER=
```

Alle Nachrichten werden zurückgespiegelt (z.B. "Hallo" → "Echo: Hallo").

**Spezial-Trigger:** Nachricht mit `*waittesting*` simuliert 35 Sekunden Wartezeit.

---

## Testen

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"msg":"Hallo","language":"de"}'
```
