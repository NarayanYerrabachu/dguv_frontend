# Environment Setup and Deployment

**Use this document when you want to set up your development or production environment, configure all necessary environment variables, enable/disable features via mock modes, and deploy the application.**

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Basic understanding of environment variables and `.env` files
- (For production) Docker and deployment infrastructure access

## Overview

The avatar-dguv-nextjs application uses environment variables to configure backends and feature flags. The system supports flexible "mock modes" for local development without external service dependencies.

> **Warning:** Never commit `.env.local` or `.env.production` files to version control. These may contain secrets like API keys and authentication tokens.

## Before You Begin

### Required Access

- [ ] Source code repository access
- [ ] Custom LLM backend credentials (if using real LLM)

### Environment Variable Categories

| Category | Purpose |
|----------|---------|
| **Server** | Port and Node environment: `PORT`, `NODE_ENV` |
| **LLM** | Language model backend: `LLM_URL`, `LLM_HEADER` |

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

### Step 3: Configure LLM Backend

**What you're doing**: Select which LLM service to use

**Option A: Custom LLM Backend (Production)**

```bash
LLM_URL=http://your-llm-service:8000/chat
LLM_HEADER='{"Authorization":"Bearer your-token"}'
```

**Backend contract — Request:**
```json
{
  "msg": "user message",
  "language": "de",
  "context": "optional-session-id"
}
```

**Backend contract — Response:**
```json
{
  "msg": "user message",
  "response": "assistant response",
  "language": "de",
  "context": "optional-session-id"
}
```

**Option B: Mock Echo Mode (Development)**

Leave both empty:

```bash
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
  -e LLM_URL=$LLM_URL \
  -e NODE_ENV=production \
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
- [ ] `LLM_URL` and `LLM_HEADER` configured with real backend
- [ ] `.env` files not committed to repository

- [ ] Monitoring and logging configured

### Monitoring

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

**Symptoms:** `LLM_URL` or other vars are undefined in code

**Cause:** `.env.local` file not found or malformed

**Solution:**
```bash
# Verify file exists
ls -la .env.local

# Check if Next.js is reading it
npm run check:env
```

## Related Topics

- [Architecture Overview](../getting-started/architecture-overview.md)
- [Chat Interface Feature Guide](../understanding-features/chat-interface.md)
- [API Reference: Endpoints](../api-reference/endpoints.md)
