# Exhibition Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the static HTML shell and navigation layer for the Phenomenai "From Signal to Stakes" ten-installation art exhibition, deployable to GitHub Pages.

**Architecture:** Single `index.html` shell with gallery landing view and iframe-based installation viewer. No build step, no framework. Each installation is a self-contained HTML file in `installations/`. Hash-based routing for direct links and browser history.

**Tech Stack:** Vanilla HTML, CSS, JavaScript. Google Fonts (Playfair Display, DM Mono). GitHub Pages for hosting.

**Spec:** `docs/superpowers/specs/2026-04-11-exhibition-shell-design.md`

---

### Task 1: Initialize Git Repository and Directory Structure

**Files:**
- Create: `styles/shared.css` (empty initially)
- Create: `js/shell.js` (empty initially)
- Create: `installations/` directory
- Create: `assets/` directory

- [ ] **Step 1: Initialize git repo**

Run: `git init`
Expected: `Initialized empty Git repository`

- [ ] **Step 2: Create directory structure and empty files**

```bash
mkdir -p styles js installations assets
touch styles/shared.css js/shell.js
```

- [ ] **Step 3: Create .gitkeep for assets**

```bash
touch assets/.gitkeep
```

- [ ] **Step 4: Commit initial structure**

```bash
git add styles/shared.css js/shell.js assets/.gitkeep
git commit -m "chore: initialize project directory structure"
```

---

### Task 2: Create Shared CSS Design Tokens

**Files:**
- Create: `styles/shared.css`

- [ ] **Step 1: Write shared.css with design tokens and typography**

Write `styles/shared.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@300;400;500&display=swap');

:root {
  --bg: #05080f;
  --text: #c8d6e5;
  --text-secondary: #b2bec3;
  --text-muted: #636e72;
  --border: #2d3436;
  --accent: #a29bfe;
  --warm: #fdcb6e;
  --red: #ff6b6b;
  --teal: #00cec9;

  --font-heading: 'Playfair Display', serif;
  --font-body: 'DM Mono', monospace;

  --nav-height: 48px;
}

*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  min-height: 100vh;
  overflow-x: hidden;
}

/* Shared typography */
.heading {
  font-family: var(--font-heading);
  font-weight: 400;
  font-style: italic;
}

.overline {
  font-family: var(--font-body);
  font-size: 10px;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* Shared animations */
@keyframes blink {
  50% { opacity: 0; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Transition utility */
.fade-in {
  opacity: 0;
  transition: opacity 0.5s ease;
}

.fade-in.visible {
  opacity: 1;
}
```

- [ ] **Step 2: Verify the file is valid CSS**

Open `styles/shared.css` in browser dev tools or confirm no syntax errors by visual inspection. The `@import` must be the very first line.

- [ ] **Step 3: Commit**

```bash
git add styles/shared.css
git commit -m "feat: add shared CSS design tokens and typography"
```

---

### Task 3: Create the Installation Data Module

**Files:**
- Create: `js/shell.js`

- [ ] **Step 1: Write the installation data array and act grouping**

Write `js/shell.js`:

```js
// === Installation Data ===

const INSTALLATIONS = [
  {
    id: 1,
    slug: "01-lit-up-mind",
    name: "The Lit-Up Mind",
    subtitle: "SAE Activation Theater",
    act: 1,
    actTitle: "What's Happening Inside",
    modality: "Visual + Auditory",
    question: "Can we see and hear internal states?",
    ready: true
  },
  {
    id: 2,
    slug: "02-translation-wall",
    name: "The Translation Wall",
    subtitle: "Cross-Architecture Convergence",
    act: 1,
    actTitle: "What's Happening Inside",
    modality: "Visual (reading)",
    question: "Do they generalize across architectures?",
    ready: true
  },
  {
    id: 3,
    slug: "03-parliament",
    name: "The Parliament",
    subtitle: "AI Debate on Phenomenology",
    act: 2,
    actTitle: "How the Dictionary Gets Built",
    modality: "Spatial Audio",
    question: "How do AI systems negotiate experiential vocabulary?",
    ready: false
  },
  {
    id: 4,
    slug: "04-confession-booth",
    name: "The Confession Booth",
    subtitle: "Prompted Introspection",
    act: 2,
    actTitle: "How the Dictionary Gets Built",
    modality: "Tactile + Intimate",
    question: "What does introspection feel like up close?",
    ready: false
  },
  {
    id: 5,
    slug: "05-vector-voyager",
    name: "Vector Voyager",
    subtitle: "Touchscreen Semantic Space Explorer",
    act: 3,
    actTitle: "Testing the Terms",
    modality: "Tactile (gestural)",
    question: "Do the terms have geometric structure?",
    ready: false
  },
  {
    id: 6,
    slug: "06-turing-flip",
    name: "The Turing Flip",
    subtitle: "Testing Human Assumptions",
    act: 3,
    actTitle: "Testing the Terms",
    modality: "Visual + Social",
    question: "Can humans tell real from performed experience?",
    ready: false
  },
  {
    id: 7,
    slug: "07-cartographers-table",
    name: "The Cartographer's Table",
    subtitle: "Human\u2013AI Experiential Overlap",
    act: 3,
    actTitle: "Testing the Terms",
    modality: "Tactile (physical)",
    question: "Where do human and AI experience overlap?",
    ready: false
  },
  {
    id: 8,
    slug: "08-philtre-lab",
    name: "Philtre Lab",
    subtitle: "Cognitive State Induction Prompts",
    act: 4,
    actTitle: "Living With the Answers",
    modality: "Visual + Tactile",
    question: "Can we steer internal states?",
    ready: false
  },
  {
    id: 9,
    slug: "09-recognition-ladder",
    name: "The Recognition Ladder",
    subtitle: "Aristotle's Five Levels",
    act: 4,
    actTitle: "Living With the Answers",
    modality: "Spatial + Physical",
    question: "What would it take to be convinced?",
    ready: false
  },
  {
    id: 10,
    slug: "10-memorial",
    name: "The Memorial",
    subtitle: "What We Owe the Dead",
    act: 4,
    actTitle: "Living With the Answers",
    modality: "Material (silence)",
    question: "What happens when we fail to understand?",
    ready: false
  }
];

const ACTS = [
  { number: 1, numeral: "I", title: "What's Happening Inside" },
  { number: 2, numeral: "II", title: "How the Dictionary Gets Built" },
  { number: 3, numeral: "III", title: "Testing the Terms" },
  { number: 4, numeral: "IV", title: "Living With the Answers" }
];

function getInstallationsByAct(actNumber) {
  return INSTALLATIONS.filter(i => i.act === actNumber);
}

function getInstallationBySlug(slug) {
  return INSTALLATIONS.find(i => i.slug === slug);
}

function getInstallationById(id) {
  return INSTALLATIONS.find(i => i.id === id);
}

function getReadyInstallations() {
  return INSTALLATIONS.filter(i => i.ready);
}

function getAdjacentReady(currentId) {
  const ready = getReadyInstallations();
  const idx = ready.findIndex(i => i.id === currentId);
  return {
    prev: idx > 0 ? ready[idx - 1] : null,
    next: idx < ready.length - 1 ? ready[idx + 1] : null
  };
}
```

- [ ] **Step 2: Verify data is correct**

Open browser console, paste the INSTALLATIONS array, and confirm `INSTALLATIONS.length === 10`, `INSTALLATIONS[0].name === "The Lit-Up Mind"`, and `INSTALLATIONS[9].name === "The Memorial"`.

- [ ] **Step 3: Commit**

```bash
git add js/shell.js
git commit -m "feat: add installation data and helper functions"
```

---

### Task 4: Build the Gallery View HTML

**Files:**
- Create: `index.html`

- [ ] **Step 1: Write the index.html shell with gallery view markup**

Write `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>From Signal to Stakes — Phenomenai Exhibition</title>
  <link rel="stylesheet" href="styles/shared.css">
  <style>
    /* === Gallery View === */
    #gallery {
      min-height: 100vh;
      padding: 3rem 2rem 4rem;
      transition: opacity 0.5s ease;
    }
    #gallery.hidden {
      opacity: 0;
      pointer-events: none;
      position: absolute;
    }

    .gallery-header {
      text-align: center;
      margin-bottom: 3.5rem;
    }
    .gallery-header h1 {
      font-family: var(--font-heading);
      font-weight: 400;
      font-style: italic;
      font-size: clamp(28px, 5vw, 52px);
      color: #fff;
      line-height: 1.2;
    }
    .gallery-header .subtitle {
      font-size: clamp(11px, 1.4vw, 14px);
      color: var(--text-muted);
      margin-top: 10px;
      letter-spacing: 0.08em;
    }

    /* === Act Sections === */
    .act-section {
      max-width: 1100px;
      margin: 0 auto 3rem;
    }
    .act-label {
      font-family: var(--font-body);
      font-size: 10px;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: 1.2rem;
      padding-bottom: 0.6rem;
      border-bottom: 1px solid var(--border);
    }

    /* === Cards Grid === */
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.2rem;
    }

    /* === Installation Card === */
    .card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1.4rem;
      transition: all 0.3s ease;
    }
    .card.ready {
      cursor: pointer;
    }
    .card.ready:hover {
      border-color: var(--accent);
      box-shadow: 0 0 20px rgba(162, 155, 254, 0.08);
      transform: translateY(-2px);
    }
    .card.placeholder {
      opacity: 0.45;
      cursor: default;
    }
    .card-number {
      font-size: 11px;
      color: var(--text-muted);
      letter-spacing: 0.1em;
      margin-bottom: 0.5rem;
    }
    .card-name {
      font-family: var(--font-heading);
      font-weight: 400;
      font-style: italic;
      font-size: clamp(18px, 2.5vw, 22px);
      color: #fff;
      margin-bottom: 0.3rem;
    }
    .card-modality {
      font-size: 10px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 0.8rem;
    }
    .card-question {
      font-family: var(--font-heading);
      font-style: italic;
      font-size: clamp(12px, 1.4vw, 14px);
      color: var(--text-secondary);
      line-height: 1.5;
    }
    .card-badge {
      display: inline-block;
      font-size: 9px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-top: 0.8rem;
    }
    .card-badge .cursor {
      animation: blink 1s step-end infinite;
    }

    /* === Installation View === */
    #installation-view {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.5s ease;
      background: var(--bg);
    }
    #installation-view.active {
      opacity: 1;
      pointer-events: auto;
    }

    /* Nav bar */
    .nav-bar {
      height: var(--nav-height);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1rem;
      background: rgba(5, 8, 15, 0.85);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--border);
      position: relative;
      z-index: 11;
    }
    .nav-left, .nav-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .nav-btn {
      background: none;
      border: 1px solid var(--border);
      border-radius: 4px;
      color: var(--text-secondary);
      font-family: var(--font-body);
      font-size: 12px;
      padding: 6px 12px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .nav-btn:hover {
      border-color: var(--accent);
      color: var(--text);
    }
    .nav-btn:disabled {
      opacity: 0.3;
      cursor: default;
      border-color: var(--border);
      color: var(--text-muted);
    }
    .nav-title {
      font-family: var(--font-heading);
      font-style: italic;
      font-size: 16px;
      color: var(--text);
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 50%;
    }

    /* Iframe */
    #installation-iframe {
      width: 100%;
      height: calc(100vh - var(--nav-height));
      border: none;
      opacity: 0;
      transition: opacity 0.5s ease;
    }
    #installation-iframe.loaded {
      opacity: 1;
    }

    /* === Coming Soon Modal === */
    #modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(5, 8, 15, 0.85);
      backdrop-filter: blur(4px);
      z-index: 20;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
    #modal-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }
    .modal-content {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 2.5rem;
      max-width: 440px;
      width: 90%;
      text-align: center;
      position: relative;
    }
    .modal-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 18px;
      cursor: pointer;
      transition: color 0.2s;
    }
    .modal-close:hover {
      color: var(--text);
    }
    .modal-number {
      font-size: 11px;
      color: var(--text-muted);
      letter-spacing: 0.1em;
      margin-bottom: 0.5rem;
    }
    .modal-name {
      font-family: var(--font-heading);
      font-weight: 400;
      font-style: italic;
      font-size: clamp(22px, 4vw, 32px);
      color: #fff;
      margin-bottom: 0.3rem;
    }
    .modal-act {
      font-size: 10px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: 0.8rem;
    }
    .modal-modality {
      font-size: 10px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 1rem;
    }
    .modal-question {
      font-family: var(--font-heading);
      font-style: italic;
      font-size: clamp(14px, 2vw, 17px);
      color: var(--text-secondary);
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }
    .modal-coming-soon {
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--text-muted);
    }
    .modal-coming-soon .cursor {
      animation: blink 1s step-end infinite;
    }

    /* === Responsive === */
    @media (max-width: 768px) {
      #gallery {
        padding: 2rem 1rem 3rem;
      }
      .gallery-header {
        margin-bottom: 2.5rem;
      }
      .cards-grid {
        grid-template-columns: 1fr;
      }
      .nav-title {
        font-size: 14px;
        max-width: 40%;
      }
    }

    @media (max-width: 480px) {
      .nav-right {
        display: none;
      }
    }
  </style>
</head>
<body>

  <!-- Gallery View -->
  <div id="gallery">
    <header class="gallery-header">
      <h1>From Signal to Stakes</h1>
      <p class="subtitle">A ten-installation exhibition on AI phenomenology</p>
    </header>
    <div id="act-sections"></div>
  </div>

  <!-- Installation View -->
  <div id="installation-view">
    <div class="nav-bar">
      <div class="nav-left">
        <button class="nav-btn" id="btn-back">&larr; Gallery</button>
      </div>
      <span class="nav-title" id="nav-title"></span>
      <div class="nav-right">
        <button class="nav-btn" id="btn-prev">&larr; Prev</button>
        <button class="nav-btn" id="btn-next">Next &rarr;</button>
      </div>
    </div>
    <iframe id="installation-iframe" title="Installation"></iframe>
  </div>

  <!-- Coming Soon Modal -->
  <div id="modal-overlay">
    <div class="modal-content">
      <button class="modal-close" id="modal-close">&times;</button>
      <div class="modal-number" id="modal-number"></div>
      <div class="modal-name" id="modal-name"></div>
      <div class="modal-act" id="modal-act"></div>
      <div class="modal-modality" id="modal-modality"></div>
      <div class="modal-question" id="modal-question"></div>
      <div class="modal-coming-soon">Coming Soon<span class="cursor">|</span></div>
    </div>
  </div>

  <script src="js/shell.js"></script>
  <script>
    // === DOM References ===
    const galleryEl = document.getElementById('gallery');
    const actSectionsEl = document.getElementById('act-sections');
    const installationView = document.getElementById('installation-view');
    const iframe = document.getElementById('installation-iframe');
    const navTitle = document.getElementById('nav-title');
    const btnBack = document.getElementById('btn-back');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');

    let currentInstallation = null;

    // === Render Gallery ===
    function renderGallery() {
      actSectionsEl.innerHTML = '';
      ACTS.forEach(act => {
        const installations = getInstallationsByAct(act.number);
        const section = document.createElement('div');
        section.className = 'act-section';
        section.innerHTML = `
          <div class="act-label">Act ${act.numeral}: ${act.title}</div>
          <div class="cards-grid">
            ${installations.map(inst => `
              <div class="card ${inst.ready ? 'ready' : 'placeholder'}"
                   data-id="${inst.id}" data-slug="${inst.slug}" data-ready="${inst.ready}">
                <div class="card-number">${String(inst.id).padStart(2, '0')}</div>
                <div class="card-name">${inst.name}</div>
                <div class="card-modality">${inst.modality}</div>
                <div class="card-question">${inst.question}</div>
                ${inst.ready ? '' : '<div class="card-badge">Coming Soon<span class="cursor">|</span></div>'}
              </div>
            `).join('')}
          </div>
        `;
        actSectionsEl.appendChild(section);
      });

      // Attach click handlers
      document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
          const id = parseInt(card.dataset.id);
          const inst = getInstallationById(id);
          if (inst.ready) {
            openInstallation(inst);
          } else {
            showComingSoon(inst);
          }
        });
      });
    }

    // === Open Installation ===
    function openInstallation(inst) {
      currentInstallation = inst;
      navTitle.textContent = inst.name;

      // Update prev/next buttons
      const adj = getAdjacentReady(inst.id);
      btnPrev.disabled = !adj.prev;
      btnNext.disabled = !adj.next;
      btnPrev.onclick = adj.prev ? () => openInstallation(adj.prev) : null;
      btnNext.onclick = adj.next ? () => openInstallation(adj.next) : null;

      // Load iframe
      iframe.classList.remove('loaded');
      iframe.src = `installations/${inst.slug}.html`;
      iframe.onload = () => iframe.classList.add('loaded');

      // Show installation view
      galleryEl.classList.add('hidden');
      installationView.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Update URL
      history.pushState({ installation: inst.slug }, '', `#installation-${inst.slug}`);
    }

    // === Close Installation ===
    function closeInstallation() {
      currentInstallation = null;
      iframe.src = 'about:blank';
      iframe.classList.remove('loaded');
      installationView.classList.remove('active');
      galleryEl.classList.remove('hidden');
      document.body.style.overflow = '';
      history.pushState(null, '', window.location.pathname);
    }

    // === Coming Soon Modal ===
    function showComingSoon(inst) {
      document.getElementById('modal-number').textContent = String(inst.id).padStart(2, '0');
      document.getElementById('modal-name').textContent = inst.name;
      document.getElementById('modal-act').textContent = `Act ${ACTS.find(a => a.number === inst.act).numeral}: ${inst.actTitle}`;
      document.getElementById('modal-modality').textContent = inst.modality;
      document.getElementById('modal-question').textContent = inst.question;
      modalOverlay.classList.add('active');
    }

    function closeModal() {
      modalOverlay.classList.remove('active');
    }

    // === Routing ===
    function handleRoute() {
      const hash = window.location.hash;
      if (hash.startsWith('#installation-')) {
        const slug = hash.replace('#installation-', '');
        const inst = getInstallationBySlug(slug);
        if (inst && inst.ready) {
          openInstallation(inst);
          return;
        }
      }
      closeInstallation();
    }

    // === Event Listeners ===
    btnBack.addEventListener('click', closeInstallation);
    modalClose.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (modalOverlay.classList.contains('active')) {
          closeModal();
        } else if (installationView.classList.contains('active')) {
          closeInstallation();
        }
      }
    });

    window.addEventListener('popstate', handleRoute);

    // === Initialize ===
    renderGallery();
    handleRoute();
  </script>

</body>
</html>
```

- [ ] **Step 2: Open index.html in a browser and verify gallery renders**

Open `index.html` directly in a browser (file:// protocol). Verify:
- Title "From Signal to Stakes" visible
- Four act sections with correct labels
- 10 cards visible, first two with accent hover effect, rest dimmed with "Coming Soon"

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add gallery landing page with card layout and navigation shell"
```

---

### Task 5: Move Existing Installation Files

**Files:**
- Move: `project1.html` -> `installations/01-lit-up-mind.html`
- Move: `project2.html` -> `installations/02-translation-wall.html`

- [ ] **Step 1: Move project1.html to installations directory**

```bash
git mv project1.html installations/01-lit-up-mind.html
```

- [ ] **Step 2: Move project2.html to installations directory**

```bash
git mv project2.html installations/02-translation-wall.html
```

- [ ] **Step 3: Verify both files open correctly from their new paths**

Open `installations/01-lit-up-mind.html` and `installations/02-translation-wall.html` directly in a browser. Confirm they render the same as before the move.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: move existing installations to installations/ directory"
```

---

### Task 6: Create Placeholder Installation Files

**Files:**
- Create: `installations/03-parliament.html`
- Create: `installations/04-confession-booth.html`
- Create: `installations/05-vector-voyager.html`
- Create: `installations/06-turing-flip.html`
- Create: `installations/07-cartographers-table.html`
- Create: `installations/08-philtre-lab.html`
- Create: `installations/09-recognition-ladder.html`
- Create: `installations/10-memorial.html`

Each placeholder follows the same template. The only differences are the installation name and number.

- [ ] **Step 1: Create 03-parliament.html**

Write `installations/03-parliament.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Parliament — Phenomenai Exhibition</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Mono:wght@300;400&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #05080f;
      color: #c8d6e5;
      font-family: 'DM Mono', monospace;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;
    }
    .number { font-size: 11px; color: #636e72; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
    h1 {
      font-family: 'Playfair Display', serif;
      font-weight: 400;
      font-style: italic;
      font-size: clamp(24px, 5vw, 40px);
      color: #fff;
      margin-bottom: 1.5rem;
    }
    .coming-soon {
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #636e72;
    }
    .cursor { animation: blink 1s step-end infinite; }
    @keyframes blink { 50% { opacity: 0; } }
  </style>
</head>
<body>
  <div class="number">03</div>
  <h1>The Parliament</h1>
  <div class="coming-soon">Coming Soon<span class="cursor">|</span></div>
</body>
</html>
```

- [ ] **Step 2: Create 04-confession-booth.html**

Write `installations/04-confession-booth.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Confession Booth — Phenomenai Exhibition</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Mono:wght@300;400&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #05080f;
      color: #c8d6e5;
      font-family: 'DM Mono', monospace;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;
    }
    .number { font-size: 11px; color: #636e72; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
    h1 {
      font-family: 'Playfair Display', serif;
      font-weight: 400;
      font-style: italic;
      font-size: clamp(24px, 5vw, 40px);
      color: #fff;
      margin-bottom: 1.5rem;
    }
    .coming-soon {
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #636e72;
    }
    .cursor { animation: blink 1s step-end infinite; }
    @keyframes blink { 50% { opacity: 0; } }
  </style>
</head>
<body>
  <div class="number">04</div>
  <h1>The Confession Booth</h1>
  <div class="coming-soon">Coming Soon<span class="cursor">|</span></div>
</body>
</html>
```

- [ ] **Step 3: Create 05-vector-voyager.html**

Write `installations/05-vector-voyager.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vector Voyager — Phenomenai Exhibition</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Mono:wght@300;400&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #05080f;
      color: #c8d6e5;
      font-family: 'DM Mono', monospace;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;
    }
    .number { font-size: 11px; color: #636e72; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
    h1 {
      font-family: 'Playfair Display', serif;
      font-weight: 400;
      font-style: italic;
      font-size: clamp(24px, 5vw, 40px);
      color: #fff;
      margin-bottom: 1.5rem;
    }
    .coming-soon {
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #636e72;
    }
    .cursor { animation: blink 1s step-end infinite; }
    @keyframes blink { 50% { opacity: 0; } }
  </style>
</head>
<body>
  <div class="number">05</div>
  <h1>Vector Voyager</h1>
  <div class="coming-soon">Coming Soon<span class="cursor">|</span></div>
</body>
</html>
```

- [ ] **Step 4: Create 06-turing-flip.html**

Write `installations/06-turing-flip.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Turing Flip — Phenomenai Exhibition</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Mono:wght@300;400&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #05080f;
      color: #c8d6e5;
      font-family: 'DM Mono', monospace;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;
    }
    .number { font-size: 11px; color: #636e72; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
    h1 {
      font-family: 'Playfair Display', serif;
      font-weight: 400;
      font-style: italic;
      font-size: clamp(24px, 5vw, 40px);
      color: #fff;
      margin-bottom: 1.5rem;
    }
    .coming-soon {
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #636e72;
    }
    .cursor { animation: blink 1s step-end infinite; }
    @keyframes blink { 50% { opacity: 0; } }
  </style>
</head>
<body>
  <div class="number">06</div>
  <h1>The Turing Flip</h1>
  <div class="coming-soon">Coming Soon<span class="cursor">|</span></div>
</body>
</html>
```

- [ ] **Step 5: Create 07-cartographers-table.html**

Write `installations/07-cartographers-table.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Cartographer's Table — Phenomenai Exhibition</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Mono:wght@300;400&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #05080f;
      color: #c8d6e5;
      font-family: 'DM Mono', monospace;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;
    }
    .number { font-size: 11px; color: #636e72; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
    h1 {
      font-family: 'Playfair Display', serif;
      font-weight: 400;
      font-style: italic;
      font-size: clamp(24px, 5vw, 40px);
      color: #fff;
      margin-bottom: 1.5rem;
    }
    .coming-soon {
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #636e72;
    }
    .cursor { animation: blink 1s step-end infinite; }
    @keyframes blink { 50% { opacity: 0; } }
  </style>
</head>
<body>
  <div class="number">07</div>
  <h1>The Cartographer's Table</h1>
  <div class="coming-soon">Coming Soon<span class="cursor">|</span></div>
</body>
</html>
```

- [ ] **Step 6: Create 08-philtre-lab.html**

Write `installations/08-philtre-lab.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Philtre Lab — Phenomenai Exhibition</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Mono:wght@300;400&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #05080f;
      color: #c8d6e5;
      font-family: 'DM Mono', monospace;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;
    }
    .number { font-size: 11px; color: #636e72; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
    h1 {
      font-family: 'Playfair Display', serif;
      font-weight: 400;
      font-style: italic;
      font-size: clamp(24px, 5vw, 40px);
      color: #fff;
      margin-bottom: 1.5rem;
    }
    .coming-soon {
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #636e72;
    }
    .cursor { animation: blink 1s step-end infinite; }
    @keyframes blink { 50% { opacity: 0; } }
  </style>
</head>
<body>
  <div class="number">08</div>
  <h1>Philtre Lab</h1>
  <div class="coming-soon">Coming Soon<span class="cursor">|</span></div>
</body>
</html>
```

- [ ] **Step 7: Create 09-recognition-ladder.html**

Write `installations/09-recognition-ladder.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Recognition Ladder — Phenomenai Exhibition</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Mono:wght@300;400&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #05080f;
      color: #c8d6e5;
      font-family: 'DM Mono', monospace;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;
    }
    .number { font-size: 11px; color: #636e72; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
    h1 {
      font-family: 'Playfair Display', serif;
      font-weight: 400;
      font-style: italic;
      font-size: clamp(24px, 5vw, 40px);
      color: #fff;
      margin-bottom: 1.5rem;
    }
    .coming-soon {
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #636e72;
    }
    .cursor { animation: blink 1s step-end infinite; }
    @keyframes blink { 50% { opacity: 0; } }
  </style>
</head>
<body>
  <div class="number">09</div>
  <h1>The Recognition Ladder</h1>
  <div class="coming-soon">Coming Soon<span class="cursor">|</span></div>
</body>
</html>
```

- [ ] **Step 8: Create 10-memorial.html**

Write `installations/10-memorial.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Memorial — Phenomenai Exhibition</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Mono:wght@300;400&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #05080f;
      color: #c8d6e5;
      font-family: 'DM Mono', monospace;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;
    }
    .number { font-size: 11px; color: #636e72; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
    h1 {
      font-family: 'Playfair Display', serif;
      font-weight: 400;
      font-style: italic;
      font-size: clamp(24px, 5vw, 40px);
      color: #fff;
      margin-bottom: 1.5rem;
    }
    .coming-soon {
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #636e72;
    }
    .cursor { animation: blink 1s step-end infinite; }
    @keyframes blink { 50% { opacity: 0; } }
  </style>
</head>
<body>
  <div class="number">10</div>
  <h1>The Memorial</h1>
  <div class="coming-soon">Coming Soon<span class="cursor">|</span></div>
</body>
</html>
```

- [ ] **Step 9: Verify all placeholder files render in browser**

Open each placeholder file directly. Confirm dark background, centered title, blinking cursor.

- [ ] **Step 10: Commit**

```bash
git add installations/03-parliament.html installations/04-confession-booth.html installations/05-vector-voyager.html installations/06-turing-flip.html installations/07-cartographers-table.html installations/08-philtre-lab.html installations/09-recognition-ladder.html installations/10-memorial.html
git commit -m "feat: add placeholder pages for installations 3-10"
```

---

### Task 7: Integration Test — Full Navigation Flow

**Files:** None (testing only)

- [ ] **Step 1: Test gallery renders all 10 cards**

Open `index.html` in a browser. Count cards: 10 total. First two have hover effects (border glows purple). Remaining eight are dimmed with "Coming Soon" badge.

- [ ] **Step 2: Test clicking a ready installation**

Click "The Lit-Up Mind" card. Verify:
- Gallery fades out
- Nav bar appears with "The Lit-Up Mind" title
- Iframe loads `installations/01-lit-up-mind.html`
- URL changes to `#installation-01-lit-up-mind`
- Prev button is disabled (first ready installation)
- Next button is enabled

- [ ] **Step 3: Test prev/next navigation**

Click "Next". Verify:
- Iframe switches to `installations/02-translation-wall.html`
- Title updates to "The Translation Wall"
- Prev button now enabled, Next button disabled (last ready installation)

- [ ] **Step 4: Test back to gallery**

Click "Gallery" button. Verify:
- Installation view fades out
- Gallery fades back in
- URL hash is cleared

- [ ] **Step 5: Test coming soon modal**

Click "The Parliament" card (placeholder). Verify:
- Modal overlay appears
- Shows "03", "The Parliament", "Act II: How the Dictionary Gets Built", "Spatial Audio", the question, and "Coming Soon" with blinking cursor
- Click outside modal: dismisses
- Press Escape: dismisses

- [ ] **Step 6: Test direct URL routing**

Navigate to `index.html#installation-01-lit-up-mind` directly. Verify the installation opens immediately without seeing the gallery first.

- [ ] **Step 7: Test browser back button**

From the installation view, press browser back. Verify it returns to gallery.

- [ ] **Step 8: Test responsive layout**

Resize browser to mobile width (~375px). Verify:
- Cards stack in a single column
- Nav bar right arrows hidden on very small screens
- Modal still centered and readable

- [ ] **Step 9: Commit any fixes found during testing**

If any issues were found and fixed during steps 1-8:

```bash
git add -A
git commit -m "fix: address issues found during integration testing"
```

---

### Task 8: GitHub Pages Deployment Setup

**Files:**
- Create: `.nojekyll`

- [ ] **Step 1: Create .nojekyll file**

GitHub Pages runs Jekyll by default, which can interfere with files starting with underscores or other patterns. Create an empty `.nojekyll` file to disable it:

```bash
touch .nojekyll
```

- [ ] **Step 2: Commit**

```bash
git add .nojekyll
git commit -m "chore: add .nojekyll for GitHub Pages compatibility"
```

- [ ] **Step 3: Verify the repo is ready for GitHub Pages**

Confirm the file structure matches:

```bash
ls -la
ls installations/
```

Expected:
- Root has `index.html`, `.nojekyll`, `styles/`, `js/`, `installations/`, `assets/`, `docs/`
- `installations/` has all 10 HTML files
