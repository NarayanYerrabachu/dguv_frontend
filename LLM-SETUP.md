# 🤖 LLM Integration - Echte Chat-Antworten einrichten

Die App unterstützt **3 Modi** für Chat-Antworten:

---

## ✅ **Option 1: OpenAI (ChatGPT)** ⭐ **EMPFOHLEN**

### **Vorteile:**
- ✅ Sehr einfach
- ✅ Beste Qualität
- ✅ Schnell integriert
- ✅ Günstig für Tests (~$0.002 pro 1000 Wörter)

### **Setup in 3 Schritten:**

#### **1. API Key holen:**
```bash
1. Gehe zu: https://platform.openai.com
2. Registriere dich / Login
3. Klick auf "API Keys" (links im Menü)
4. Klick "Create new secret key"
5. Kopiere den Key (sk-proj-...)
```

#### **2. In .env.local einfügen:**
```bash
# Öffne Datei:
nano /home/emad-almousa/src/avatar-dguv-nextjs/.env.local

# Füge deinen Key ein:
OPENAI_API_KEY=sk-proj-DEIN_KEY_HIER
```

#### **3. App neu starten:**
```bash
npm stop
npm start
```

**Fertig!** 🎉 Die App nutzt jetzt ChatGPT!

---

## **Model-Optionen:**

In `app/api/chat/route.ts` kannst du das Model ändern:

```typescript
model: 'gpt-4o-mini'  // ← Schnell & günstig ($0.15/1M tokens)
model: 'gpt-4o'       // ← Besser, teurer ($2.50/1M tokens)
model: 'gpt-4-turbo'  // ← Beste Qualität ($10/1M tokens)
```

---

## ✅ **Option 2: Anthropic Claude API**

### **Setup:**

```bash
# 1. API Key von: https://console.anthropic.com
# 2. SDK installieren:
npm install @anthropic-ai/sdk

# 3. In .env.local:
ANTHROPIC_API_KEY=sk-ant-...
```

**Code in `app/api/chat/route.ts` anpassen:**
```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const message = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  messages: [
    { role: 'user', content: msg }
  ]
});
```

---

## ✅ **Option 3: Lokales LLM (Ollama)**

### **Vorteile:**
- ✅ Komplett kostenlos
- ✅ Keine API Keys nötig
- ✅ Datenschutz (läuft lokal)

### **Setup:**

#### **1. Ollama installieren:**
```bash
# Ubuntu/Linux:
curl -fsSL https://ollama.com/install.sh | sh

# Start Ollama:
ollama serve

# Model herunterladen:
ollama pull llama3.2
```

#### **2. In .env.local:**
```bash
LLM_URL=http://localhost:11434/api/chat
LLM_HEADER={"Content-Type":"application/json"}
```

#### **3. Code anpassen:**
In `app/api/chat/route.ts` die Ollama-API aufrufen.

---

## ✅ **Option 4: Eigenes Backend**

Falls du bereits ein LLM Backend hast:

```bash
# In .env.local:
LLM_URL=http://your-backend:8088/chat
LLM_HEADER={"api_key":"your-key","Content-Type":"application/json"}
```

Die App sendet dann POST Requests mit:
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

---

## 🎯 **Welche Option wählen?**

| Option | Kosten | Qualität | Setup-Zeit |
|--------|--------|----------|------------|
| **OpenAI** ⭐ | ~$5-10/Monat | ⭐⭐⭐⭐⭐ | 5 Minuten |
| **Claude** | ~$5-10/Monat | ⭐⭐⭐⭐⭐ | 10 Minuten |
| **Ollama** | Kostenlos | ⭐⭐⭐⭐ | 30 Minuten |
| **Eigenes Backend** | Variiert | Variiert | Abhängig |

---

## 🧪 **Testen:**

Nach dem Setup:

1. **Starte App:** `npm start`
2. **Öffne:** http://localhost:3000
3. **Chatte:** "Was ist die DIN EN ISO 12100?"
4. **Ergebnis:** Echte KI-Antwort! ✅

---

## 💰 **Kosten-Übersicht (OpenAI):**

```
10.000 Nachrichten × 100 Wörter = ~$2-5
100 Nutzer × 50 Nachrichten/Tag = ~$10-20/Monat
```

**Tipp:** Starte mit `gpt-4o-mini` für Tests (sehr günstig!)

---

## 🐛 **Troubleshooting:**

### **"Invalid API key"**
```bash
# Prüfe ob Key richtig ist:
cat .env.local | grep OPENAI

# Key muss mit sk-proj- oder sk- starten
```

### **"Rate limit exceeded"**
```bash
# Du hast zu viele Requests gemacht
# Warte 1 Minute oder lade mehr Credit auf
```

### **"App nutzt immer noch Echo Mode"**
```bash
# App neu starten:
npm stop
npm start

# .env.local neu laden dauert einen Restart!
```

---

## 📚 **Weiterführende Links:**

- OpenAI Docs: https://platform.openai.com/docs
- Claude Docs: https://docs.anthropic.com
- Ollama Docs: https://ollama.com/docs
- Model Preise: https://openai.com/pricing

---

**Viel Erfolg mit echten KI-Antworten!** 🚀
