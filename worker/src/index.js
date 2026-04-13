// Phenomenai API proxy — Cloudflare Worker
//
// Routes:
//   POST /api/anthropic   → proxies to api.anthropic.com/v1/messages
//   POST /api/elevenlabs  → proxies to api.elevenlabs.io text-to-speech, returns audio/mpeg
//
// Secrets (set via `wrangler secret put`):
//   ANTHROPIC_API_KEY
//   ELEVENLABS_API_KEY

const ALLOWED_ORIGINS = [
  "https://phenomenai.org",
  "https://www.phenomenai.org",
  "https://phenomenai-org.github.io",
  "http://localhost:8000",
  "http://127.0.0.1:8000",
  "http://localhost:5173",
];

// Cost guardrails
const MAX_ANTHROPIC_TOKENS = 2000;
const MAX_TTS_CHARS = 2000;

// Default ElevenLabs voice if client omits voiceId. "Rachel" — warm young female.
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";
const DEFAULT_TTS_MODEL = "eleven_turbo_v2_5";

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/api/anthropic") {
      return handleAnthropic(request, env, cors);
    }

    if (request.method === "POST" && url.pathname === "/api/elevenlabs") {
      return handleElevenLabs(request, env, cors);
    }

    if (request.method === "GET" && url.pathname === "/") {
      return new Response("phenomenai-api: ok", { status: 200, headers: cors });
    }

    return json({ error: "not_found" }, 404, cors);
  },
};

async function handleAnthropic(request, env, cors) {
  if (!env.ANTHROPIC_API_KEY) {
    return json({ error: "ANTHROPIC_API_KEY not configured" }, 500, cors);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400, cors);
  }

  // Cap tokens to limit runaway cost.
  if (typeof payload.max_tokens !== "number" || payload.max_tokens > MAX_ANTHROPIC_TOKENS) {
    payload.max_tokens = Math.min(payload.max_tokens || 1000, MAX_ANTHROPIC_TOKENS);
  }

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(payload),
  });

  const bodyText = await upstream.text();
  return new Response(bodyText, {
    status: upstream.status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

async function handleElevenLabs(request, env, cors) {
  if (!env.ELEVENLABS_API_KEY) {
    return json({ error: "ELEVENLABS_API_KEY not configured" }, 500, cors);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400, cors);
  }

  const text = (payload.text || "").toString();
  if (!text.trim()) {
    return json({ error: "text_required" }, 400, cors);
  }
  if (text.length > MAX_TTS_CHARS) {
    return json({ error: "text_too_long", max: MAX_TTS_CHARS }, 400, cors);
  }

  const voiceId = payload.voiceId || DEFAULT_VOICE_ID;
  const modelId = payload.modelId || DEFAULT_TTS_MODEL;
  const voiceSettings = payload.voiceSettings || {
    stability: 0.5,
    similarity_boost: 0.75,
  };

  const upstream = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": env.ELEVENLABS_API_KEY,
        "Accept": "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: voiceSettings,
      }),
    }
  );

  if (!upstream.ok) {
    const errText = await upstream.text();
    return json({ error: "elevenlabs_error", status: upstream.status, detail: errText }, upstream.status, cors);
  }

  return new Response(upstream.body, {
    status: 200,
    headers: { ...cors, "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
  });
}
