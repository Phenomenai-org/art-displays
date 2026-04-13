# phenomenai-api (Cloudflare Worker)

Proxy that lets the static Phenomenai installations call Anthropic and ElevenLabs
without ever shipping an API key to the browser.

## Routes

| Method | Path              | Purpose                                             |
|--------|-------------------|-----------------------------------------------------|
| POST   | `/api/anthropic`  | Proxies to `api.anthropic.com/v1/messages`          |
| POST   | `/api/elevenlabs` | Proxies to ElevenLabs TTS, returns `audio/mpeg`     |
| GET    | `/`               | Health check (`phenomenai-api: ok`)                 |

### `/api/anthropic`

Accepts the exact JSON body Anthropic's Messages API expects
(`model`, `max_tokens`, `system`, `messages`, ...). The worker injects
`x-api-key` and `anthropic-version: 2023-06-01`. `max_tokens` is capped at 2000.

### `/api/elevenlabs`

```json
{
  "text": "required — what to speak",
  "voiceId": "optional — defaults to Rachel (21m00Tcm4TlvDq8ikWAM)",
  "modelId": "optional — defaults to eleven_turbo_v2_5",
  "voiceSettings": { "stability": 0.5, "similarity_boost": 0.75 }
}
```

Returns raw `audio/mpeg` bytes. `text` is capped at 2000 chars.

## First-time setup

```bash
cd worker
npm install -g wrangler   # if you don't have it
wrangler login
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put ELEVENLABS_API_KEY
wrangler deploy
```

`wrangler deploy` will print a URL like
`https://phenomenai-api.<your-account>.workers.dev`. Copy that URL into the
`WORKER_URL` constant at the top of each installation file that uses it:

- `installations/04-the-call.html`
- `installations/06-turing-flip.html`
- `installations/08-philtre-lab.html`

## Local dev

```bash
wrangler dev
```

Then set `WORKER_URL = "http://localhost:8787"` in the installations while testing.

## CORS

The worker allows these origins:

- `https://phenomenai.org`
- `https://www.phenomenai.org`
- `https://phenomenai-org.github.io`
- `http://localhost:8000` / `http://127.0.0.1:8000`
- `http://localhost:5173`

Add others in `src/index.js` (`ALLOWED_ORIGINS`).

## Cost guardrails

- Anthropic `max_tokens` is clamped to **2000**.
- ElevenLabs `text` length is capped at **2000 characters**.

Adjust in `src/index.js` if a specific installation needs more.
