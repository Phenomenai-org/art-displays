# Voice Input & Higher-Pitched Voice — The Call

**Date:** 2026-04-13  
**Installation:** `installations/04-the-call.html`  
**Status:** Approved

---

## Goal

Add microphone input to The Call so visitors can speak their side of the conversation instead of typing. Also swap the AI voice to a higher-pitched ElevenLabs option.

---

## Approach

Web Speech API (browser-native). No new services, no worker changes, no API keys. Everything stays in a single HTML file.

---

## Architecture & Data Flow

```
User taps mic
    ↓
SpeechRecognition starts (continuous: false, interimResults: false)
    ↓
User speaks → silence detected → recognition fires onresult
    ↓
Transcript injected → sendToAI(transcript) called immediately
    ↓
Mic button resets to idle
```

The text input and send button remain unchanged. Voice and text are independent — either works.

---

## UI Components

Input row changes from:
```
[ text input ] [ send button ]
```
to:
```
[ mic button ] [ text input ] [ send button ]
```

**Mic button states:**
- **Idle** — mic icon, muted amber (matches existing palette)
- **Listening** — pulsing glow (same style as ringtone pulse animation)
- **Disabled** — greyed out while AI is responding (mirrors send button behavior)

If `SpeechRecognition` is unavailable (Firefox, Safari), the mic button is hidden entirely — text input remains the only option.

No transcript preview. Text briefly flashes in the input field then clears as it auto-sends.

**Error handling (via existing toast system):**
- Mic permission denied → toast: "Microphone access needed"
- No speech detected → silent reset to idle
- Unsupported browser → button hidden

---

## Implementation

Single file: `installations/04-the-call.html`

**1. Voice ID swap**
```js
const VOICE_ID = "MF3mGyEYCl7XYWbV9V6O"; // Elli — higher pitched (was Rachel)
```

**2. `initSpeechRecognition()` — called once on page load**
```js
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = 'en-US';

recognition.onresult = (e) => {
  const transcript = e.results[0][0].transcript.trim();
  if (transcript) sendToAI(transcript);
};
recognition.onerror = (e) => {
  if (e.error === 'not-allowed') showToast("Microphone access needed");
  resetMicButton();
};
recognition.onend = () => resetMicButton();
```

**3. Mic button HTML** — inserted before text input in `#screen-call` input row

**4. Disabled guard** — mic button disabled in `showTyping()`, re-enabled in response handler (same pattern as send button)

---

## Out of Scope

- ElevenLabs STT / Deepgram (not needed)
- Worker changes (none required)
- Real-time interim transcript display
- Language detection / multilingual support

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Edge | ✅ Full |
| Firefox | ❌ Hidden (text only) |
| Safari | ❌ Hidden (text only) |

For a controlled installation device (kiosk, iPad/Chrome), this is a non-issue.
