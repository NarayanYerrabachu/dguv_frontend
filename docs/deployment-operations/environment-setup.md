# Environment Setup and Deployment

**Use this document when you want to set up your development or production environment, configure all necessary environment variables, enable/disable features via mock modes, and deploy the application.**

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Basic understanding of environment variables and `.env` files
- (For production) Docker and deployment infrastructure access

## Overview

The avatar-dguv-nextjs application uses environment variables to configure backends, authentication, and feature flags. The system supports flexible "mock modes" for local development without external service dependencies.

> **Warning:** Never commit `.env.local` or `.env.production` files to version control. These may contain secrets like API keys and authentication tokens.

## Before You Begin

### Required Access

- [ ] Source code repository access
- [ ] `.env.example` file (reference for all possible variables)
- [ ] API keys (if using real backends):
  - OpenAI API key (for LLM)
  - HeyGen API key (for avatar)
  - Custom LLM backend credentials
  - STT service credentials

### Environment Variable Categories

Environment variables fall into these categories:

| Category | Purpose | Modes |
|----------|---------|-------|
| **Server** | Port and Node environment | `PORT`, `NODE_ENV` |
| **Auth** | User authentication | `AUTH_URL`, `AUTH_HEADER`, `JWT_SECRET`, `JWT_EXPIRES_IN` |
| **LLM** | Language model backend | `OPENAI_API_KEY`, `LLM_URL`, `LLM_HEADER` |
| **STT** | Speech-to-text service | `STT_FORWARD_URL`, `STT_FORWARD_TOKEN`, `TRANSCRIPTION_URL`, `TRANSCRIPTION_HEADER` |
| **HeyGen** | Avatar configuration | `HEYGEN_API_KEY`, `HEYGEN_AVATAR_ID`, `HEYGEN_VOICE_ID`, etc. |
| **Security** | CORS and rate limiting | `ALLOWED_DOMAINS`, `ALLOW_HTTP`, `ALLOW_LOCALHOST`, `THROTTLE_*` |
| **Branding** | Theme and UI customization | `THEME_*` variables |

## Step-by-Step Setup

### Step 1: Clone Repository and Install Dependencies

**What you're doing**: Get the source code and install npm packages

**Commands:**
```bash
# Clone the repository
git clone <repository-url>
cd avatar-dguv-nextjs

# Install dependencies
npm install
# or
yarn install
```

**Expected output:**
```
added 400+ packages in 45s
```

**Verification:**
- [ ] No errors during `npm install`
- [ ] `node_modules/` directory created
- [ ] `package-lock.json` (or `yarn.lock`) generated

### Step 2: Create Environment Configuration File

**What you're doing**: Set up `.env.local` with your specific configuration

**Commands:**
```bash
# Copy the example to create your local env file
cp .env.example .env.local

# Edit with your editor
nano .env.local
# or use your preferred editor
```

**Configuration template:**

Use this checklist when setting up `.env.local`:

- [ ] `PORT` — Server port (default: 3000)
- [ ] `NODE_ENV` — Set to `development` for dev, `production` for prod
- [ ] `ALLOWED_DOMAINS` — Your domain(s), comma-separated
- [ ] `ALLOW_HTTP` — `true` for local dev, `false` for production
- [ ] `ALLOW_LOCALHOST` — `true` for local dev, `false` for production

### Step 3: Configure Authentication (Choose One Mode)

**What you're doing**: Select how users authenticate

**Option A: Simulation Mode (Local Development)**

Leave these empty for testing without external auth:

```bash
AUTH_URL=
AUTH_HEADER=
JWT_SECRET=avatar-webcomp-jwt-secret
JWT_EXPIRES_IN=8h
```

**Test credentials:**
```
emmaId: 1234
email: test@test.com
```

**Commands to test:**
```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"emmaId":"1234","email":"test@test.com"}'
```

**Expected response:**
```json
{
  "hey_gen_allowed": true,
  "idle_time": 1000000,
  "accessToken": "eyJhbGc..."
}
```

**Option B: External Auth Service**

Point to your real authentication backend:

```bash
AUTH_URL=https://your-auth-service.com/api/auth
AUTH_HEADER='{"Authorization":"Bearer your-token"}'
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=8h
```

**Verification:**
- [ ] `AUTH_URL` is accessible
- [ ] `AUTH_HEADER` is valid JSON string
- [ ] Service responds with expected format: `{ hey_gen_allowed: boolean, idle_time: number, ...user data }`

### Step 4: Configure LLM Backend (Choose One Priority)

**What you're doing**: Select which LLM service to use

**Priority order:** OpenAI → Custom LLM → Mock echo mode

**Option A: OpenAI (Recommended for Production)**

```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxx
# Leave these empty to skip custom LLM
LLM_URL=
LLM_HEADER=
```

**Test:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"msg":"Hallo, wer bist du?","language":"de"}'
```

**Expected response:**
```json
{
  "msg": "Hallo, wer bist du?",
  "response": "Ich bin ein KI-Assistent...",
  "language": "de",
  "context": null
}
```

**Option B: Custom LLM Backend**

```bash
# Leave OPENAI_API_KEY empty
OPENAI_API_KEY=
LLM_URL=http://your-llm-service:8000/chat
LLM_HEADER='{"Authorization":"Bearer your-token"}'
```

**Backend contract:** Request format must be:
```json
{
  "msg": "user message",
  "language": "de",
  "context": "optional-session-id"
}
```

Response format must be:
```json
{
  "msg": "user message",
  "response": "assistant response",
  "language": "de",
  "context": "optional-session-id"
}
```

**Option C: Mock Echo Mode (Testing)**

Leave both empty:

```bash
OPENAI_API_KEY=
LLM_URL=
LLM_HEADER=
```

**Behavior:** All messages echo back (e.g., "Hallo" → "Echo: Hallo")

**Special trigger for testing:** Include `*waittesting*` in message to simulate 35-second wait:
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"msg":"*waittesting*","language":"de"}'
```

### Step 5: Configure Speech-to-Text (Optional)

**What you're doing**: Set up voice transcription service

**Option A: Use STT Service (Preferred)**

```bash
STT_FORWARD_URL=https://stt-service.example.com/transcribe
STT_FORWARD_TOKEN=your-api-token
# Leave v2 legacy vars empty
TRANSCRIPTION_URL=
TRANSCRIPTION_HEADER=
```

**Option B: Legacy STT Configuration**

```bash
STT_FORWARD_URL=
STT_FORWARD_TOKEN=
TRANSCRIPTION_URL=https://legacy-stt.example.com/transcribe
TRANSCRIPTION_HEADER='{"Authorization":"Bearer token"}'
```

**Option C: Mock Mode**

Leave both empty:

```bash
STT_FORWARD_URL=
STT_FORWARD_TOKEN=
TRANSCRIPTION_URL=
TRANSCRIPTION_HEADER=
```

**Behavior:** All audio transcribes to "This is a transcription for the audio."

### Step 6: Configure HeyGen Avatar (Optional)

**What you're doing**: Set up animated avatar for chat

**Prerequisite:** HeyGen Live Avatar account with API key

**Configuration:**

```bash
HEYGEN_API_KEY=sk-xxxxxxxxxxxxxxxx
HEYGEN_AVATAR_ID=alice-b52be46e
HEYGEN_VOICE_ID=de_male_voice_001
HEYGEN_QUALITY=high
AVATAR_LANGUAGE=de
AVATAR_CONTEXT_ID=
```

**How to get these values:**
1. Log in to HeyGen Studio: https://app.heygen.com
2. Navigate to Avatars section → copy Avatar ID
3. Navigate to Voices section → copy Voice ID
4. Settings → API Keys → copy API Key

**Test:**
```bash
curl -X POST http://localhost:3000/api/get-access-token \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected response:**
```json
{
  "token": "eyJhbGc..."
}
```

**If you see "HeyGen configuration is missing":** One or more of the three required variables (`HEYGEN_API_KEY`, `HEYGEN_AVATAR_ID`, `HEYGEN_VOICE_ID`) is not set.

### Step 7: Configure Security Settings

**What you're doing**: Set CORS, rate limiting, and SSL options

```bash
# === CORS / Security ===
ALLOWED_DOMAINS=localhost,example.com
ALLOW_HTTP=true          # false in production
ALLOW_LOCALHOST=true     # false in production
ALLOWED_METHODS=GET,POST,OPTIONS

# === Rate Limiting ===
THROTTLE_TTL=60000              # TTL in milliseconds
THROTTLE_LIMIT=100              # Max requests per TTL
THROTTLE_AUTH_TTL=60000         # TTL for auth endpoint
THROTTLE_AUTH_LIMIT=100         # Max auth requests per TTL
```

**For local development:**
```bash
ALLOWED_DOMAINS=localhost
ALLOW_HTTP=true
ALLOW_LOCALHOST=true
THROTTLE_LIMIT=1000  # Generous for testing
```

**For production:**
```bash
ALLOWED_DOMAINS=app.example.com,app.example.de
ALLOW_HTTP=false
ALLOW_LOCALHOST=false
THROTTLE_LIMIT=100  # Stricter
```

### Step 8: Configure Optional Theme Overrides

**What you're doing**: Customize branding without changing code

The app loads base theme from `public/assets/theme.json` and allows runtime overrides via `THEME_*` variables.

**Example:**

```bash
# Override specific theme values
THEME_tenantId=dguv
THEME_feedbackUrl=https://your-domain.com/feedback
THEME_primaryColor=#004994
THEME_lightBlue=#d4edfc

# Build metadata
BUILD_TIME=2024-04-30
```

**How it works:**
- Client calls `GET /api/theme`
- Server merges `public/assets/theme.json` with environment overrides
- Response includes `_overrides` array showing which keys were overridden

**Test:**
```bash
curl http://localhost:3000/api/theme
```

## Development Workflow

### Running Locally

**Start development server:**
```bash
npm run dev
```

**Expected output:**
```
> next dev
  ▲ Next.js 16.2.4
  - Local:        http://localhost:3000
  - Environments: .env.local
```

**Verification:**
- [ ] Server starts without errors
- [ ] http://localhost:3000 redirects to /welcome
- [ ] http://localhost:3000/chat loads chat interface

### Testing API Endpoints

**Health check:**
```bash
curl http://localhost:3000/api/health
```

**Expected response:**
```json
{ "status": "ok" }
```

**Test authentication:**
```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"emmaId":"1234","email":"test@test.com"}'
```

**Test chat (uses mock if no LLM configured):**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"msg":"Hallo","language":"de"}'
```

### Debugging

**Server logs:**
```bash
# Logs appear in the terminal running `npm run dev`
# Shows startup messages, API errors, and warnings
```

**Client console:**
```bash
# Open http://localhost:3000/chat
# Press F12 to open DevTools
# Check Console tab for JavaScript errors
# Check Network tab for failed API requests
```

**Environment verification script:**
```bash
# Check which env vars are actually loaded
npm run check:env
```

## Production Deployment

### Build for Production

**What you're doing**: Compile Next.js app for optimal performance

**Commands:**
```bash
# Build the app
npm run build

# Expected output:
# ✓ Compiled successfully
# ✓ Linting and type checking
# ✓ Creating optimized production build
# Build complete!
```

**Artifacts:**
- `.next/` directory contains compiled app
- Ready to deploy to server

### Deploy with Docker

**Dockerfile example** (if not already in repo):

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

**Build and run:**
```bash
docker build -t avatar-dguv-nextjs:latest .
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  -e ALLOWED_DOMAINS=app.example.com \
  avatar-dguv-nextjs:latest
```

### Deploy to Node.js Server

**What you're doing**: Start production server

**Commands:**
```bash
# Build
npm run build

# Start using built-in server
npm run start:prod

# Or use process manager
pm2 start "npm run start:prod" --name avatar-dguv-nextjs
```

**Expected output:**
```
> avatar-dguv-nextjs@0.1.0 start:prod
> next build && next start

ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

**Verification:**
- [ ] Server starts without errors
- [ ] Port 3000 (or configured PORT) is listening
- [ ] http://localhost:3000 is accessible
- [ ] All environment variables loaded correctly

### Production Environment Checklist

Before deploying to production, verify:

- [ ] `NODE_ENV=production`
- [ ] `ALLOW_HTTP=false` (enforce HTTPS)
- [ ] `ALLOW_LOCALHOST=false`
- [ ] `ALLOWED_DOMAINS` set to your actual domain(s)
- [ ] `OPENAI_API_KEY` or `LLM_URL` configured with real backend
- [ ] `AUTH_URL` and `AUTH_HEADER` configured if using real auth
- [ ] `JWT_SECRET` is a strong random value (not default)
- [ ] HeyGen variables configured if avatar enabled
- [ ] `.env` files not committed to repository
- [ ] Database and external service connectivity verified
- [ ] SSL certificate installed and valid
- [ ] Rate limiting configured appropriately
- [ ] Monitoring and logging configured
- [ ] Backup and recovery procedures in place

### Monitoring and Health Checks

**Health endpoint:**
```bash
curl https://app.example.com/api/health
```

**Continuous monitoring:**
```bash
# Check health every 30 seconds
while true; do
  curl -f http://localhost:3000/api/health || echo "FAILED"
  sleep 30
done
```

**Log monitoring** (if using Docker/systemd):
```bash
# Docker
docker logs -f avatar-dguv-nextjs

# Systemd
journalctl -u avatar-dguv-nextjs -f
```

## Troubleshooting

### Issue 1: "Cannot find module 'next'"

**Symptoms:** `Error: Cannot find module 'next'` when running npm run dev

**Cause:** Dependencies not installed

**Solution:**
```bash
npm install
# Verify node_modules exists
ls -la node_modules/ | head -5
```

### Issue 2: "EADDRINUSE: address already in use :::3000"

**Symptoms:** Port 3000 is already in use

**Cause:** Another process is running on port 3000

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill it or use different port
kill -9 <PID>
# OR
PORT=3001 npm run dev
```

### Issue 3: Environment variables not loading

**Symptoms:** `OPENAI_API_KEY` or other vars are undefined in code

**Cause:** `.env.local` file not found or malformed

**Solution:**
```bash
# Verify file exists
ls -la .env.local

# Verify format (KEY=value, one per line)
cat .env.local

# Check if Next.js is reading it
npm run check:env
```

### Issue 4: "Invalid HEYGEN_QUALITY value"

**Symptoms:** POST /api/get-access-token returns HTTP 400

**Cause:** `HEYGEN_QUALITY` is set to invalid value

**Solution:**
```bash
# Valid values only
HEYGEN_QUALITY=high  # or low, medium, very_high
```

## Related Topics

- [Architecture Overview](../getting-started/architecture-overview.md)
- [Chat Interface Feature Guide](../understanding-features/chat-interface.md)
- [HeyGen Avatar Integration Guide](../understanding-features/heygen-avatar-integration.md)
- [API Reference: Endpoints](../api-reference/endpoints.md)
