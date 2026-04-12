// One-shot tool: wrap a JSX file into a self-contained HTML installation.
// Usage: node tools/wrap-jsx.mjs <source.jsx> <dest.html> <pageTitle> <rootBg>
// Strips `import ... from "react"`, removes `export default`, detects root
// component name, injects CDN React + Babel standalone, mounts to #root.

import { readFileSync, writeFileSync } from "fs";

const [, , src, dest, title, bg = "#05080f"] = process.argv;
if (!src || !dest || !title) {
  console.error("usage: wrap-jsx.mjs <src.jsx> <dest.html> <title> [bg]");
  process.exit(1);
}

let code = readFileSync(src, "utf8");

// Drop the React import line.
code = code.replace(/^\s*import\s*{[^}]*}\s*from\s*["']react["'];?\s*\n/m, "");

// Strip `export default` keyword — the function/class declaration stays.
code = code.replace(/\bexport\s+default\s+/g, "");

// Detect the root component name (the one that had `export default`).
const originalSrc = readFileSync(src, "utf8");
const match = originalSrc.match(
  /export\s+default\s+(?:function\s+([A-Z]\w*)|([A-Z]\w*))/
);
const componentName = match ? (match[1] || match[2]) : null;
if (!componentName) {
  console.error("could not find `export default` component in " + src);
  process.exit(1);
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — Phenomenai Exhibition</title>
<style>
  html, body { margin: 0; padding: 0; background: ${bg}; }
  #root { min-height: 100vh; }
</style>
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
<div id="root"></div>
<script type="text/babel" data-presets="env,react">
const { useState, useEffect, useRef, useCallback, useMemo, useLayoutEffect, useContext, useReducer, createContext, Fragment } = React;

${code}

ReactDOM.createRoot(document.getElementById('root')).render(<${componentName} />);
</script>
</body>
</html>
`;

writeFileSync(dest, html);
console.log(`wrote ${dest} (component: ${componentName})`);
