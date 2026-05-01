# API Endpoints Reference

**Use this document when you want to understand the request/response format for all server-side API endpoints.**

## Overview

All API endpoints are server-side routes in `app/api/`. They accept HTTP requests from the client and either proxy to external services, generate tokens, or return mock responses.

## Base URL

- **Development:** `http://localhost:3000`
- **Production:** `https://your-domain.com`

All endpoints are accessed via `[BASE_URL]/api/[ENDPOINT_PATH]`

## Authentication

### POST /api/auth

Authenticates a user and returns a JWT access token.

**Request:**
```http
POST /api/auth
Content-Type: application/json

{
  "emmaId": "1234",
  "email": "test@test.com"
}
```

**Response (Success):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "hey_gen_allowed": true,
  "idle_time": 1000000
}
```

**Response (Error - Simulation Mode):**
```json
{
  "error": "Invalid credentials"
}
```
HTTP Status: `401`

**Response (Error - Auth Service Down):**
```json
{
  "error": "Authentication service error"
}
```
HTTP Status: `500`

**Behavior:**

- **Simulation mode** (if `AUTH_URL` or `AUTH_HEADER` empty): Only accepts `emmaId=1234` and `email=test@test.com`
- **Real auth mode** (both set): Proxies to external auth service at `AUTH_URL`, forwards `emmaId` and `email`
- **Response includes:** JWT token valid for duration specified in `JWT_EXPIRES_IN` (default: 8 hours)

**Environment Variables:**
- `AUTH_URL` — External auth service endpoint (empty = simulation)
- `AUTH_HEADER` — JSON-stringified headers for auth service
- `JWT_SECRET` — Secret key for JWT signing (default: `avatar-webcomp-jwt-secret`)
- `JWT_EXPIRES_IN` — Token expiration (default: `8h`)

## Chat / LLM

### POST /api/chat

Sends a message to the LLM backend and returns the response.

**Request:**
```http
POST /api/chat
Content-Type: application/json

{
  "msg": "Wie funktioniert die DGUV Unfallversicherung?",
  "language": "de",
  "context": "optional-session-id"
}
```

**Response (Success with OpenAI):**
```json
{
  "msg": "Wie funktioniert die DGUV Unfallversicherung?",
  "response": "Die DGUV Unfallversicherung ist eine gesetzliche Versicherung...",
  "language": "de",
  "context": "optional-session-id"
}
```

**Response (Success with Custom LLM):**
```json
{
  "msg": "Wie funktioniert die DGUV Unfallversicherung?",
  "response": "Die DGUV Unfallversicherung ist eine gesetzliche Versicherung...",
  "language": "de",
  "context": "optional-session-id"
}
```

**Response (Error - Missing msg):**
```json
{
  "error": "msg is required and must be a string"
}
```
HTTP Status: `400`

**Response (Error - OpenAI API Error):**
```json
{
  "error": "OpenAI API error",
  "msg": "User message",
  "response": "Fehler bei der Kommunikation mit OpenAI."
}
```
HTTP Status: `500`

**Behavior:**

Priority order:
1. **OpenAI** — if `OPENAI_API_KEY` is set
   - Uses GPT-4o-mini model
   - System prompt: German DGUV assistant
   - Temperature: 0.7, Max tokens: 1000

2. **Custom LLM** — if `LLM_URL` and `LLM_HEADER` are set
   - Proxies request to custom backend
   - Expected response format: `{ msg, response, language, context }`

3. **Mock/Echo** — fallback if neither above is configured
   - Returns: `{ msg, response: "Echo: [msg]", language, context }`
   - Special: If `msg` contains `*waittesting*`, delays 35 seconds

**Required fields:**
- `msg` — User message (string, non-empty)

**Optional fields:**
- `language` — Language code (default: `de`)
- `context` — Session/conversation context (optional)

**Environment Variables:**
- `OPENAI_API_KEY` — OpenAI API key (if set, takes priority)
- `LLM_URL` — Custom LLM endpoint
- `LLM_HEADER` — JSON-stringified headers for custom LLM

## Speech-to-Text

### POST /api/transcription

Transcribes audio file to text.

**Request:**
```http
POST /api/transcription
Content-Type: multipart/form-data

[binary audio file in 'file' field]
```

**Example with curl:**
```bash
curl -X POST http://localhost:3000/api/transcription \
  -F "file=@recording.webm"
```

**Response (Success):**
```json
{
  "text": "Dies ist ein Test der Spracherkennungsfunktion"
}
```

**Response (Error - No File):**
```json
{
  "error": "File is required"
}
```
HTTP Status: `400`

**Response (Error - Transcription Service Down):**
```json
{
  "error": "Internal server error"
}
```
HTTP Status: `500`

**Behavior:**

Priority order:
1. **STT Forward** — if `STT_FORWARD_URL` is set (v3 preferred)
   - Sends file to `STT_FORWARD_URL`
   - Includes token in `x-token` header if `STT_FORWARD_TOKEN` set

2. **Legacy Transcription** — if `TRANSCRIPTION_URL` is set (v2)
   - Sends file to `TRANSCRIPTION_URL`
   - Includes headers from `TRANSCRIPTION_HEADER` if set

3. **Mock** — if neither is configured
   - Returns: `{ text: "This is a transcription for the audio." }`

**Audio format:** Multipart form data with file in `file` field (WebM format from browser MediaRecorder)

**Environment Variables:**
- `STT_FORWARD_URL` — Speech-to-text service endpoint (v3)
- `STT_FORWARD_TOKEN` — Token for STT service
- `TRANSCRIPTION_URL` — Legacy transcription endpoint (v2)
- `TRANSCRIPTION_HEADER` — JSON-stringified headers for legacy service

## HeyGen Avatar

### POST /api/get-access-token

Requests a session token from HeyGen Live Avatar API.

**Request:**
```http
POST /api/get-access-token
Content-Type: application/json

{}
```

**Response (Success):**
```json
{
  "token": "eyJhbGc..."
}
```

**Response (Error - Missing Config):**
```json
{
  "error": "HeyGen configuration is missing"
}
```
HTTP Status: `400`

**Response (Error - Invalid Quality):**
```json
{
  "error": "Invalid HEYGEN_QUALITY value"
}
```
HTTP Status: `400`

**Response (Error - HeyGen API Error):**
```json
{
  "error": "HeyGen API error: Unauthorized"
}
```
HTTP Status: `500`

**Behavior:**

- Validates all required configuration is present:
  - `HEYGEN_API_KEY` (required)
  - `HEYGEN_AVATAR_ID` (required)
  - `HEYGEN_VOICE_ID` (required)

- Validates `HEYGEN_QUALITY` is one of: `low`, `medium`, `high`, `very_high`

- Constructs HeyGen session request with:
  - Avatar ID
  - Voice ID and language
  - Video quality setting
  - Optional context ID

- Makes POST request to `https://api.liveavatar.com/v1/sessions/token`

- Extracts and returns session token from response

**Environment Variables:**
- `HEYGEN_API_KEY` — HeyGen API key (required if endpoint is called)
- `HEYGEN_AVATAR_ID` — Avatar character ID (required)
- `HEYGEN_VOICE_ID` — Voice persona ID (required)
- `HEYGEN_QUALITY` — Video quality: `low`, `medium`, `high`, `very_high` (default: `high`)
- `AVATAR_LANGUAGE` — Speech language (default: `de`)
- `AVATAR_CONTEXT_ID` — Optional conversation context

## Utility

### GET /api/health

Health check endpoint.

**Request:**
```http
GET /api/health
```

**Response (Success):**
```json
{
  "status": "ok"
}
```
HTTP Status: `200`

**Behavior:** Always returns success if server is running. Used for monitoring and load balancer health checks.

### GET /api/theme

Retrieves application theme configuration.

**Request:**
```http
GET /api/theme
```

**Response (Success):**
```json
{
  "tenantId": "dguv",
  "primaryColor": "#004994",
  "lightBlue": "#d4edfc",
  "feedbackUrl": "https://example.com/feedback",
  "_buildTime": "2024-04-30",
  "_overrides": ["primaryColor", "feedbackUrl"]
}
```

**Response (Error - theme.json not found):**
```json
{
  "tenantId": "dguv",
  "_buildTime": "unknown",
  "_overrides": []
}
```
HTTP Status: `200` (graceful fallback)

**Behavior:**

- Loads base theme from `public/assets/theme.json` (if exists)
- Merges with environment variable overrides (any `THEME_*` var)
- Attempts to parse `THEME_*` values as JSON; falls back to string if invalid
- Returns merged result with:
  - `_buildTime` — Value of `BUILD_TIME` env var (for cache busting)
  - `_overrides` — Array of theme keys that were overridden from environment

**Environment Variables:**
- Any variable starting with `THEME_` (e.g., `THEME_tenantId`, `THEME_feedbackUrl`)
- `BUILD_TIME` — Build timestamp (included in response)

**Example configuration:**
```bash
THEME_tenantId=dguv
THEME_primaryColor=#004994
THEME_feedbackUrl=https://example.com
BUILD_TIME=2024-04-30
```

## Error Handling

### HTTP Status Codes

| Status | Meaning | Scenario |
|--------|---------|----------|
| `200` | Success | Request completed successfully |
| `400` | Bad Request | Missing required fields or invalid values |
| `401` | Unauthorized | Authentication failed |
| `500` | Internal Server Error | Backend error or service unavailable |

### Error Response Format

All errors return JSON with an `error` field:

```json
{
  "error": "Descriptive error message"
}
```

Some endpoints include additional fields in error responses (e.g., chat returns `msg` and `response`).

## Rate Limiting

Rate limiting is configurable via environment variables:

| Endpoint | TTL Variable | Limit Variable | Default TTL | Default Limit |
|----------|--------------|-----------------|-------------|---------------|
| Most endpoints | `THROTTLE_TTL` | `THROTTLE_LIMIT` | 60000 ms (1 min) | 100 requests |
| `/api/auth` | `THROTTLE_AUTH_TTL` | `THROTTLE_AUTH_LIMIT` | 60000 ms (1 min) | 100 requests |

**Example configuration:**
```bash
THROTTLE_TTL=60000          # Window: 1 minute
THROTTLE_LIMIT=100          # Max 100 requests per minute
THROTTLE_AUTH_TTL=60000     # Auth window: 1 minute
THROTTLE_AUTH_LIMIT=50      # Max 50 auth attempts per minute
```

## CORS and Security Headers

Controlled by environment variables:

- `ALLOWED_DOMAINS` — Comma-separated list of allowed origins
- `ALLOWED_METHODS` — Allowed HTTP methods (e.g., `GET,POST,OPTIONS`)
- `ALLOW_HTTP` — Allow non-HTTPS (set to `false` in production)
- `ALLOW_LOCALHOST` — Allow localhost (set to `false` in production)

## Related Topics

- [Architecture Overview](../getting-started/architecture-overview.md)
- [Chat Interface Feature Guide](../understanding-features/chat-interface.md)
- [HeyGen Avatar Integration Guide](../understanding-features/heygen-avatar-integration.md)
- [Environment Setup and Deployment](../deployment-operations/environment-setup.md)
