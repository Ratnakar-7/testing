# Secure Random Web Project

Minimal Node.js web project with safe API endpoints and no credential exposure.

## Setup

1. Copy `/home/runner/work/testing/testing/.env.example` to `.env`.
2. Set local values in `.env` (never commit real secrets).
3. Start the app:

```bash
npm start
```

## API Endpoints

- `GET /api/health` → service status.
- `GET /api/public/projects/random` → random sample web-project idea.
- `GET /api/config` → only reports whether `API_KEY` exists, never the key value.

## Test

```bash
npm test
```
