# API Endpoints Reference

**Use this document when you want to understand the request/response format for all server-side API endpoints.**

## Overview

All API endpoints are server-side routes in `app/api/`. They accept HTTP requests from the client and either proxy to external services or return mock responses.

## Base URL

- **Development:** `http://localhost:3000`
- **Production:** `https://your-domain.com`

All endpoints are accessed via `[BASE_URL]/api/[ENDPOINT_PATH]`

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

**Response (Success):**
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

**Behavior:**

Priority order:
1. **Custom LLM** — if `LLM_URL` and `LLM_HEADER` are set
   - Proxies request to custom backend
   - Expected response format: `{ msg, response, language, context }`

2. **Mock/Echo** — fallback if neither above is configured
   - Returns: `{ msg, response: "Echo: [msg]", language, context }`
   - Special: If `msg` contains `*waittesting*`, delays 35 seconds

**Required fields:**
- `msg` — User message (string, non-empty)

**Optional fields:**
- `language` — Language code (default: `de`)
- `context` — Session/conversation context (optional)

**Environment Variables:**
- `LLM_URL` — Custom LLM endpoint
- `LLM_HEADER` — JSON-stringified headers for custom LLM

## Error Handling

### HTTP Status Codes

| Status | Meaning | Scenario |
|--------|---------|----------|
| `200` | Success | Request completed successfully |
| `400` | Bad Request | Missing required fields or invalid values |
| `500` | Internal Server Error | Backend error or service unavailable |

### Error Response Format

All errors return JSON with an `error` field:

```json
{
  "error": "Descriptive error message"
}
```

## Related Topics

- [Architecture Overview](../getting-started/architecture-overview.md)
- [Chat Interface Feature Guide](../understanding-features/chat-interface.md)
- [Environment Setup and Deployment](../deployment-operations/environment-setup.md)
