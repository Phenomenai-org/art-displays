# Voice Input Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Web Speech API microphone input to The Call and swap the AI voice to higher-pitched Elli.

**Architecture:** All changes are in `installations/04-the-call.html` — a single self-contained file. The mic button sits before the text input, starts `SpeechRecognition` on click, and auto-sends the transcript when silence is detected. No worker or API changes needed.

**Tech Stack:** Vanilla JS, Web Speech API (`SpeechRecognition`), ElevenLabs TTS (existing), Cloudflare Worker proxy (existing, unchanged)

---

## Files

- Modify: `installations/04-the-call.html` (all four tasks)

---

## Task 1: Swap Voice ID to Elli

**Files:**
- Modify: `installations/04-the-call.html` (line ~609)

- [ ] **Step 1: Update the VOICE_ID constant**

Find this in `04-the-call.html`:
```js
// "Rachel" — warm young female voice, good fit for an excited teenager.
const VOICE_ID = "21m00Tcm4TlvDq8ikWAM";
```

Replace with:
```js
// "Elli" — higher-pitched young female voice.
const VOICE_ID = "MF3mGyEYCl7XYWbV9V6O";
```

- [ ] **Step 2: Manual verification**

Open `04-the-call.html` in Chrome via local server (e.g. `python -m http.server 8000`).  
Enter a name → answer the call → listen to the AI's first message.  
Expected: noticeably higher-pitched female voice compared to before.

- [ ] **Step 3: Commit**

```bash
git add installations/04-the-call.html
git commit -m "feat: swap TTS voice to Elli for higher pitch"
```

---

## Task 2: Add Mic Button CSS

**Files:**
- Modify: `installations/04-the-call.html` (CSS block after `.call-send`)

- [ ] **Step 1: Insert mic button styles**

Find this in `04-the-call.html`:
```css
.call-send:hover { background: var(--amber-glow); transform: scale(1.08); }
.call-send svg { width: 18px; height: 18px; }
```

Replace with:
```css
.call-send:hover { background: var(--amber-glow); transform: scale(1.08); }
.call-send svg { width: 18px; height: 18px; }

.call-mic {
  background: transparent;
  border: 1px solid rgba(232,168,76,0.3);
  color: var(--amber-dim);
  width: 42px; height: 42px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.call-mic:hover { border-color: var(--amber); color: var(--amber); }
.call-mic.listening {
  border-color: var(--rose);
  color: var(--rose);
  animation: mic-pulse 1s ease-in-out infinite;
}
.call-mic:disabled { opacity: 0.3; cursor: not-allowed; animation: none; }
@keyframes mic-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(212,112,122,0.4); }
  50% { box-shadow: 0 0 0 8px rgba(212,112,122,0); }
}
```

- [ ] **Step 2: Commit**

```bash
git add installations/04-the-call.html
git commit -m "feat: add mic button CSS with listening pulse state"
```

---

## Task 3: Add Mic Button HTML

**Files:**
- Modify: `installations/04-the-call.html` (HTML input area, lines ~570-575)

- [ ] **Step 1: Insert mic button before text input**

Find this in `04-the-call.html`:
```html
  <div class="call-input-area">
    <input class="call-input" id="callInput" type="text" placeholder="Say something..." autocomplete="off">
    <button class="call-send" id="sendBtn">
```

Replace with:
```html
  <div class="call-input-area">
    <button class="call-mic" id="micBtn" title="Speak">
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
    </button>
    <input class="call-input" id="callInput" type="text" placeholder="Say something..." autocomplete="off">
    <button class="call-send" id="sendBtn">
```

- [ ] **Step 2: Visual check**

Open in Chrome. Navigate to Screen 3 (The Call).  
Expected: microphone icon button visible to the left of the text input, styled in muted amber, circular.  
No functionality yet — clicking does nothing.

- [ ] **Step 3: Commit**

```bash
git add installations/04-the-call.html
git commit -m "feat: add mic button HTML to call input row"
```

---

## Task 4: Wire Up Speech Recognition

**Files:**
- Modify: `installations/04-the-call.html` (JS section, multiple locations)

- [ ] **Step 1: Add micBtn const alongside existing input refs**

Find this in `04-the-call.html`:
```js
const callInput = document.getElementById('callInput');
const sendBtn = document.getElementById('sendBtn');
```

Replace with:
```js
const callInput = document.getElementById('callInput');
const sendBtn = document.getElementById('sendBtn');
const micBtn = document.getElementById('micBtn');
```

- [ ] **Step 2: Add initSpeechRecognition function**

Find this in `04-the-call.html`:
```js
callInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendUserMessage(); });
sendBtn.addEventListener('click', sendUserMessage);
```

Replace with:
```js
callInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendUserMessage(); });
sendBtn.addEventListener('click', sendUserMessage);

// ===== SPEECH RECOGNITION =====
function resetMicButton() {
  micBtn.classList.remove('listening');
  micBtn.disabled = false;
}

function initSpeechRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { micBtn.style.display = 'none'; return; }

  const recognition = new SR();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript.trim();
    if (transcript) {
      callInput.value = transcript;
      sendUserMessage();
    }
  };
  recognition.onerror = (e) => {
    if (e.error === 'not-allowed') showToast('Microphone access needed');
    resetMicButton();
  };
  recognition.onend = () => resetMicButton();

  micBtn.addEventListener('click', () => {
    if (micBtn.disabled || micBtn.classList.contains('listening')) return;
    micBtn.classList.add('listening');
    recognition.start();
  });
}

initSpeechRecognition();
```

- [ ] **Step 3: Disable mic while AI is responding**

Find this in `04-the-call.html`:
```js
async function sendToAI(userText) {
  showTyping();
```

Replace with:
```js
async function sendToAI(userText) {
  showTyping();
  micBtn.disabled = true;
```

- [ ] **Step 4: Re-enable mic when AI response arrives (success path)**

Find this in `04-the-call.html`:
```js
    hideTyping();

    if (!response.ok || !data.content) {
```

Replace with:
```js
    hideTyping();
    micBtn.disabled = false;

    if (!response.ok || !data.content) {
```

- [ ] **Step 5: Re-enable mic when AI response arrives (error path)**

Find this in `04-the-call.html`:
```js
  } catch (err) {
    hideTyping();
    console.error('API error:', err);
```

Replace with:
```js
  } catch (err) {
    hideTyping();
    micBtn.disabled = false;
    console.error('API error:', err);
```

- [ ] **Step 6: Disable mic permanently when call ends**

Find this in `04-the-call.html`:
```js
  callInput.disabled = true;
  sendBtn.disabled = true;
  sendBtn.style.opacity = '0.3';
```

Replace with:
```js
  callInput.disabled = true;
  sendBtn.disabled = true;
  sendBtn.style.opacity = '0.3';
  micBtn.disabled = true;
  micBtn.style.opacity = '0.3';
```

- [ ] **Step 7: Re-enable mic on call reset**

Find this in `04-the-call.html`:
```js
  callInput.disabled = false;
  callInput.value = '';
  sendBtn.disabled = false;
  sendBtn.style.opacity = '1';
```

Replace with:
```js
  callInput.disabled = false;
  callInput.value = '';
  sendBtn.disabled = false;
  sendBtn.style.opacity = '1';
  micBtn.disabled = false;
  micBtn.style.opacity = '';
```

- [ ] **Step 8: End-to-end manual test**

Open `04-the-call.html` in Chrome. Walk through the full flow:

1. Enter name → answer call → hear AI's opening line (Elli voice, higher pitched) ✓
2. Click the mic button → button turns rose/pink with pulse animation ✓
3. Speak a short phrase → button resets to idle, text flashes in input, auto-sends ✓
4. While AI is responding → mic button is greyed out / unclickable ✓
5. After AI responds → mic button re-enables ✓
6. Type a message manually → works as before ✓
7. Call ends with [END_CALL] → mic button stays disabled ✓
8. Click "Start over" → mic button re-enables ✓

Test unsupported browser behavior: open in Firefox.  
Expected: mic button hidden, text-only input remains.

- [ ] **Step 9: Commit**

```bash
git add installations/04-the-call.html
git commit -m "feat: add Web Speech API voice input to The Call"
```
