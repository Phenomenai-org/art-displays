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
