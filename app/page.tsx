<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Animated Center Square</title>
  <style>
    html, body {
      margin: 0;
      background: #ccc;
      height: 100vh;
      overflow: hidden;
      cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><circle cx="16" cy="16" r="4" fill="black"/></svg>') 16 16, auto;
    }

    body.dark {
      background: #111;
      cursor: auto;
    }

    #logo {
      position: absolute;
      top: 15px;
      left: 15px;
      height: 60px;
      z-index: 10;
      object-fit: contain;
    }

    #logoLine {
      position: absolute;
      top: 80px;
      left: 15px;
      width: 3cm;
      height: 2px;
      background: black;
      z-index: 9;
    }

    #logoText {
      position: absolute;
      top: 90px;
      left: 15px;
      font-family: 'Helvetica Neue', 'Roboto', sans-serif;
      font-weight: 300;
      font-size: 22px;
      color: black;
      z-index: 10;
    }

    /* --- MENU STYLES --- */
    #agentMenu {
      position: absolute;
      top: calc(90px + 2cm);
      left: 15px;
      width: 220px;
      font-family: 'Helvetica Neue', 'Roboto', sans-serif;
      font-weight: 300;
      font-size: 16px;
      z-index: 999;
      background: none;
      padding: 0;
      border-radius: 10px;
      user-select: none;
    }
    .category {
      margin-bottom: 4px;
      border-radius: 7px;
      background: transparent;
      box-shadow: none;
      overflow: hidden;
    }
    .category-header {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 7px 10px 7px 0;
      font-weight: 500;
      color: #2a2a2a;
      border: none;
      background: none;
      font-size: 16px;
      transition: background 0.2s;
      border-radius: 6px;
      margin-bottom: 1px;
      gap: 8px;
    }
    .category-header span.arrow {
      font-size: 13px;
      display: inline-block;
      transition: transform 0.2s;
    }
    .category.open .category-header span.arrow {
      transform: rotate(90deg);
    }
    .category.open .category-header {
      background: #e6e6e6;
    }
    .category-list {
      display: none;
      padding-left: 15px;
      margin-bottom: 7px;
    }
    .category.open .category-list {
      display: block;
    }
    .agent-btn {
      display: block;
      width: 100%;
      background: none;
      border: none;
      text-align: left;
      padding: 7px 0 7px 16px;
      font-size: 15px;
      color: #222;
      cursor: pointer;
      border-radius: 5px;
      margin-bottom: 2px;
      transition: background 0.12s;
    }
    .agent-btn.selected {
      background: #ffe599;
      color: #6a4107;
      font-weight: bold;
    }
    .agent-btn:not(.selected):hover {
      background: #f3f3f3;
    }

    body.dark .category-header { color: #ddd; }
    body.dark .category.open .category-header { background: #242424; }
    body.dark .agent-btn { color: #ddd; }
    body.dark .agent-btn.selected { background: #44432a; color: #ffe599; }
    body.dark .agent-btn:not(.selected):hover { background: #242424; }

    /* --- END MENU STYLES --- */

    #topRectangle {
      position: absolute;
      left: calc(50% - 705px);
      width: 1410px;
      top: 80px;
      bottom: calc(3cm + 480px);
      border: 1px dotted black;
      background: transparent;
      z-index: 1;
      /* So textboxes can fill 100% */
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;
      overflow: hidden;
      padding: 0;
    }

    /* Textareas and Inputs for Agents */
    .agent-panel {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      padding: 32px 50px 32px 50px;
      justify-content: flex-start;
      box-sizing: border-box;
      width: 100%;
      min-height: 100%;
    }
    .agent-panel label {
      margin-top: 15px;
      font-size: 17px;
      color: #444;
      font-weight: 500;
      margin-bottom: 3px;
      display: inline-block;
    }
    .agent-panel textarea,
    .agent-panel input[type="text"] {
      width: 100%;
      min-width: 0;
      border-radius: 7px;
      border: 1px solid #bbb;
      background: #e0e0e0;
      color: #2a2a2a;
      padding: 13px 12px;
      font-size: 17px;
      margin-bottom: 14px;
      resize: vertical;
      box-sizing: border-box;
      transition: border 0.2s;
      outline: none;
      max-width: 100%;
      font-family: inherit;
    }
    .agent-panel textarea:focus,
    .agent-panel input[type="text"]:focus {
      border-color: #bfa842;
    }
    .agent-panel .agent-run-btn {
      background: #ffc107;
      color: #5c3e06;
      border: none;
      border-radius: 6px;
      padding: 11px 32px;
      font-size: 17px;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 15px;
      margin-top: 4px;
      box-shadow: 0 2px 8px rgba(255,193,7,0.06);
      align-self: flex-start;
      transition: background 0.15s;
    }
    .agent-panel .agent-run-btn:hover {
      background: #ffd753;
    }
    .agent-panel .output-label {
      margin-top: 15px;
      font-size: 16px;
      font-weight: 500;
      color: #666;
    }
    .agent-panel .agent-output {
      width: 100%;
      min-height: 120px;
      background: #d0d0d0;
      color: #1a1a1a;
      border-radius: 7px;
      border: 1px solid #aaa;
      padding: 11px 12px;
      font-size: 16px;
      resize: vertical;
      margin-bottom: 10px;
      margin-top: 2px;
      box-sizing: border-box;
      font-family: inherit;
      white-space: pre-wrap;
      overflow-y: auto;
    }
    body.dark .agent-panel textarea,
    body.dark .agent-panel input[type="text"] {
      background: #292929;
      color: #f0f0f0;
      border: 1px solid #474747;
    }
    body.dark .agent-panel .agent-output {
      background: #181818;
      color: #ffe599;
      border: 1px solid #444;
    }
    body.dark .agent-panel label { color: #eee; }
    body.dark .agent-panel .output-label { color: #bbb; }
    body.dark .agent-panel .agent-run-btn { background: #bc9c19; color: #ffe599; }
    body.dark .agent-panel .agent-run-btn:hover { background: #a68a15; }
    /* --- END AGENT PANEL --- */

    .box {
      position: absolute;
      width: 450px;
      height: 450px;
      border: 1px dotted black;
      overflow: hidden;
      background: #ccc;
      bottom: 3cm;
    }

    #boxLeft {
      left: calc(50% - 705px);
    }

    #boxMiddle {
      left: calc(50% - 225px);
    }

    #boxRight {
      left: calc(50% + 255px);
    }

    canvas {
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
    }

    #pauseBtn {
      position: absolute;
      left: calc(50% - 705px - 80px);
      bottom: calc(3cm + 450px - 75px);
      width: 75px;
      height: 75px;
      background: transparent;
      border: none;
      cursor: pointer;
      z-index: 20;
      font-size: 75px;
      color: black;
      line-height: 1;
      padding: 0;
    }

    #themeToggleBtn {
      position: absolute;
      left: calc(50% - 705px - 80px);
      bottom: calc(3cm + 450px - 75px - 90px);
      width: 75px;
      height: 75px;
      transform: rotate(-90deg);
      cursor: pointer;
      z-index: 20;
      object-fit: contain;
    }

    #footerText {
      position: absolute;
      bottom: calc(3cm - 30px);
      left: calc(50% + 255px);
      width: 450px;
      text-align: center;
      font-family: 'Helvetica Neue', 'Roboto', sans-serif;
      font-size: 14px;
      font-weight: 300;
      z-index: 5;
    }

    #footerLinks {
      position: absolute;
      bottom: calc(3cm - 30px);
      left: calc(50% - 705px);
      font-family: 'Helvetica Neue', 'Roboto', sans-serif;
      font-size: 14px;
      z-index: 5;
    }

    #footerLinks a {
      color: black;
      text-decoration: none;
      margin-right: 20px;
    }

    /* Dark Mode Adjustments */
    body.dark .box,
    body.dark #topRectangle {
      border-color: #888;
    }

    body.dark .box {
      background: #111;
    }

    body.dark #logoText,
    body.dark #footerText,
    body.dark #footerLinks a {
      color: #eee;
    }

    body.dark #logoLine {
      background: #eee;
    }

    body.dark #pauseBtn {
      color: #eee;
    }
  </style>
</head>
<body>

<!-- Logo Section -->
<img src="GB3.png" alt="Golden Box Logo" id="logo">
<div id="logoLine"></div>
<div id="logoText">Golden Box</div>

<!-- Agent Sidebar Menu (will be filled by JS) -->
<div id="agentMenu"></div>

<!-- Rectangle -->
<div id="topRectangle"></div>

<!-- Control Buttons -->
<button id="pauseBtn" title="Pause or Resume">⏸</button>
<img id="themeToggleBtn" src="light.jpg" title="Toggle Theme" />

<!-- Squares -->
<div id="boxLeft" class="box"><canvas id="canvasBars"></canvas></div>
<div id="boxMiddle" class="box"><canvas id="canvasMiddle"></canvas></div>
<div id="boxRight" class="box"><canvas id="canvasDots"></canvas></div>

<!-- Footer Text -->
<div id="footerText">
  <span style="color: goldenrod; font-weight: bold;">The one and only </span>
  <span style="font-weight: bold;">Golden.Box</span>
  <span> in the world </span>
  <span style="font-weight: bold;">forever.</span>
</div>

<!-- Footer Links -->
<div id="footerLinks">
  <a href="#">Info</a>
  <a href="#">Contact</a>
</div>

<script>
// ----- ANIMATION (UNCHANGED) -----
function noise(x, y) {
  return Math.sin(x * 0.01 + y * 0.01 + Date.now() * 0.0003);
}
const boxSize = 450;
const canvasDots = document.getElementById("canvasDots");
const ctxDots = canvasDots.getContext("2d");
const canvasBars = document.getElementById("canvasBars");
const ctxBars = canvasBars.getContext("2d");
const canvasMiddle = document.getElementById("canvasMiddle");
const ctxMiddle = canvasMiddle.getContext("2d");
canvasDots.width = canvasBars.width = canvasMiddle.width = boxSize;
canvasDots.height = canvasBars.height = canvasMiddle.height = boxSize;
const numDots = 3000;
const numBars = 600;
let isAnimating = true;
let isDark = false;
let animFrameId = null;
const dots = [], bars = [];
for (let i = 0; i < numDots; i++) {
  const speed = 0.1 + Math.random() * 0.15;
  const offsetX = 5 * speed * 60;
  dots.push({
    x: Math.random() * boxSize + boxSize * 2 - offsetX,
    y: Math.random() * boxSize,
    speed,
    size: Math.random() * (1.8 - 1.08) + 1.08,
    phase: Math.random() * Math.PI * 2
  });
}
for (let i = 0; i < numBars; i++) {
  const baseSpeed = 0.15 + Math.random() * 0.2;
  const speed = baseSpeed * 0.7;
  const offsetX = 5 * speed * 60;
  bars.push({
    x: -Math.random() * boxSize + offsetX,
    y: Math.random() * boxSize,
    speed,
    width: Math.random() * (11.2 - 6.4) + 6.4,
    height: Math.random() * (2.0 - 1.2) + 1.2,
    offset: Math.random() * 1000,
    phase: Math.random() * Math.PI * 2,
    rotation: Math.random() * Math.PI * 2
  });
}
function animate(t) {
  if (!isAnimating) return;
  ctxDots.clearRect(0, 0, boxSize, boxSize);
  ctxBars.clearRect(0, 0, boxSize, boxSize);
  ctxMiddle.clearRect(0, 0, boxSize, boxSize);
  ctxDots.fillStyle = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)";
  ctxBars.fillStyle = isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)";
  ctxMiddle.fillStyle = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)";
  let centerDotsDrawn = 0;
  let centerBarsDrawn = 0;
  for (let p of dots) {
    const n = noise(p.x * 0.2, p.y * 0.2);
    const wave = Math.sin(t * 0.001 + p.phase + n * 2);
    p.x -= (p.speed * 2) + wave * 0.8;
    p.y += wave * 1.2;
    if (p.x >= 0 && p.x <= boxSize) {
      ctxDots.beginPath();
      ctxDots.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
      ctxDots.fill();
    }
    if (p.x >= -boxSize && p.x < 0 && centerDotsDrawn < 100) {
      ctxMiddle.beginPath();
      ctxMiddle.arc(p.x + boxSize, p.y, p.size, 0, 2 * Math.PI);
      ctxMiddle.fill();
      centerDotsDrawn++;
    }
    if (p.x < -boxSize - 20 || p.y < -20 || p.y > boxSize + 20) {
      const speed = 0.1 + Math.random() * 0.15;
      const offsetX = 5 * speed * 60;
      p.x = boxSize + Math.random() * boxSize - offsetX;
      p.y = Math.random() * boxSize;
      p.speed = speed;
      p.phase = Math.random() * Math.PI * 2;
    }
  }
  for (let b of bars) {
    const n = noise(b.x * 0.2, b.y * 0.2);
    const wave = Math.sin(t * 0.001 + b.phase + n * 2);
    b.x += (b.speed * 2) + wave * 0.8;
    b.y += wave * 1.2;
    if (b.x >= 0 && b.x <= boxSize) {
      ctxBars.save();
      ctxBars.translate(b.x + b.width / 2, b.y + b.height / 2);
      ctxBars.rotate((t * 0.001 + b.rotation) % (Math.PI * 2));
      ctxBars.fillRect(-b.width / 2, -b.height / 2, b.width, b.height);
      ctxBars.restore();
    }
    if (b.x > boxSize && b.x < boxSize * 2 && centerBarsDrawn < 100) {
      ctxMiddle.save();
      ctxMiddle.translate(b.x - boxSize + b.width / 2, b.y + b.height / 2);
      ctxMiddle.rotate((t * 0.001 + b.rotation) % (Math.PI * 2));
      ctxMiddle.fillRect(-b.width / 2, -b.height / 2, b.width, b.height);
      ctxMiddle.restore();
      centerBarsDrawn++;
    }
    if (b.x > boxSize * 2 + 20 || b.y < -20 || b.y > boxSize + 20) {
      const baseSpeed = 0.15 + Math.random() * 0.2;
      const speed = baseSpeed * 0.7;
      const offsetX = 5 * speed * 60;
      b.x = -Math.random() * boxSize + offsetX;
      b.y = Math.random() * boxSize;
      b.speed = speed;
      b.phase = Math.random() * Math.PI * 2;
      b.rotation = Math.random() * Math.PI * 2;
    }
  }
  animFrameId = requestAnimationFrame(animate);
}
animFrameId = requestAnimationFrame(animate);
// Control Buttons
document.getElementById("pauseBtn").onclick = () => {
  isAnimating = !isAnimating;
  if (isAnimating) animFrameId = requestAnimationFrame(animate);
  else cancelAnimationFrame(animFrameId);
};
const themeBtn = document.getElementById("themeToggleBtn");
themeBtn.onclick = () => {
  isDark = !isDark;
  document.body.classList.toggle("dark", isDark);
  themeBtn.src = isDark ? "dark2.jpg" : "light.jpg";
};
// ----- END ANIMATION -----

// --- AGENT MENU LOGIC ----
const AGENTS = [
  {
    category: 'Text Tools',
    name: 'Word Counter',
    description: 'Counts the total number of words in the input text.',
    inputLabel: 'Enter or paste your text',
    outputPlaceholder: 'Word count will appear here...'
  },
  {
    category: 'Text Tools',
    name: 'Capitalize',
    description: 'Converts all letters in the input text to uppercase.',
    inputLabel: 'Enter text to capitalize',
    outputPlaceholder: 'Capitalized text will appear here...'
  },
  {
    category: 'Text Tools',
    name: 'TXT Compare',
    description: 'Compares two text blocks for differences.',
    inputLabel: 'Enter two texts below to compare',
    outputPlaceholder: 'Comparison result will appear here...'
  },
  {
    category: 'Crypto Tools',
    name: 'Position Suggestion',
    description: 'Suggests crypto entry/exit positions based on trends.',
    inputLabel: 'N/A',
    outputPlaceholder: 'Coming soon...'
  },
  {
    category: 'Crypto Tools',
    name: 'Top Gainer/Looser',
    description: 'Shows top performing and worst performing tokens.',
    inputLabel: 'N/A',
    outputPlaceholder: 'Coming soon...'
  }
];
// Categorize
const agentCategories = Array.from(new Set(AGENTS.map(a => a.category)));

let openCategory = null; // By default, all collapsed
let selectedAgentName = null;

function renderAgentMenu() {
  const el = document.getElementById('agentMenu');
  el.innerHTML = '';
  agentCategories.forEach(cat => {
    const isOpen = openCategory === cat;
    const catDiv = document.createElement('div');
    catDiv.className = 'category' + (isOpen ? ' open' : '');
    // Header
    const header = document.createElement('div');
    header.className = 'category-header';
    header.innerHTML = `<span class="arrow">${isOpen ? '▶' : '▶'}</span>${cat}`;
    header.onclick = () => {
      openCategory = openCategory === cat ? null : cat;
      renderAgentMenu();
    };
    catDiv.appendChild(header);
    // List
    const agentList = document.createElement('div');
    agentList.className = 'category-list';
    AGENTS.filter(a => a.category === cat).forEach(agent => {
      const btn = document.createElement('button');
      btn.className = 'agent-btn' + (selectedAgentName === agent.name ? ' selected' : '');
      btn.textContent = agent.name;
      btn.onclick = () => {
        selectedAgentName = agent.name;
        renderAgentMenu();
        showAgentPanel(agent);
      };
      agentList.appendChild(btn);
    });
    if (isOpen) catDiv.appendChild(agentList);
    el.appendChild(catDiv);
  });
}
renderAgentMenu();

// Show/Hide agent panel
function showAgentPanel(agent) {
  const topRect = document.getElementById('topRectangle');
  topRect.innerHTML = ''; // Clear

  const panel = document.createElement('div');
  panel.className = 'agent-panel';

  // Header
  const h2 = document.createElement('h2');
  h2.textContent = agent.name;
  h2.style.fontSize = '1.7em';
  h2.style.marginBottom = '4px';
  h2.style.marginTop = '2px';
  h2.style.fontWeight = '700';
  panel.appendChild(h2);

  const desc = document.createElement('div');
  desc.textContent = agent.description;
  desc.style.color = 'gray';
  desc.style.fontSize = '1.04em';
  desc.style.marginBottom = '17px';
  panel.appendChild(desc);

  let textarea1, textarea2, output, btn;

  // TXT Compare
  if (agent.name === 'TXT Compare') {
    // First
    let label1 = document.createElement('label');
    label1.textContent = 'First Text';
    panel.appendChild(label1);
    textarea1 = document.createElement('textarea');
    textarea1.rows = 8;
    textarea1.style.marginBottom = '10px';
    panel.appendChild(textarea1);
    // Second
    let label2 = document.createElement('label');
    label2.textContent = 'Second Text';
    panel.appendChild(label2);
    textarea2 = document.createElement('textarea');
    textarea2.rows = 8;
    textarea2.style.marginBottom = '10px';
    panel.appendChild(textarea2);

    btn = document.createElement('button');
    btn.textContent = 'Run Agent';
    btn.className = 'agent-run-btn';
    panel.appendChild(btn);

    let outLabel = document.createElement('div');
    outLabel.textContent = 'Output';
    outLabel.className = 'output-label';
    panel.appendChild(outLabel);

    output = document.createElement('div');
    output.className = 'agent-output';
    output.textContent = agent.outputPlaceholder;
    panel.appendChild(output);

    btn.onclick = () => {
      const text1 = textarea1.value.replace(/\r\n/g, '\n').split('\n');
      const text2 = textarea2.value.replace(/\r\n/g, '\n').split('\n');
      let result = '';
      let maxLines = Math.max(text1.length, text2.length);
      let hasDiff = false;
      for (let i = 0; i < maxLines; ++i) {
        const line1 = (text1[i] || '');
        const line2 = (text2[i] || '');
        if (line1 !== line2) {
          hasDiff = true;
          // Count char difference
          let diffCount = 0;
          for (let j = 0; j < Math.max(line1.length, line2.length); ++j) {
            if ((line1[j] || '') !== (line2[j] || '')) diffCount++;
          }
          result += `Line ${i + 1}: ${diffCount} characters are different.\n`;
          result += `Text 1: ${line1}\nText 2: ${line2}\n\n`;
        }
      }
      if (!hasDiff) result = "No differences found.";
      output.textContent = result;
    };
  }
  // Word Counter, Capitalize
  else if (agent.name === 'Word Counter' || agent.name === 'Capitalize') {
    let label = document.createElement('label');
    label.textContent = agent.inputLabel;
    panel.appendChild(label);
    textarea1 = document.createElement('textarea');
    textarea1.rows = 10;
    panel.appendChild(textarea1);

    btn = document.createElement('button');
    btn.textContent = 'Run Agent';
    btn.className = 'agent-run-btn';
    panel.appendChild(btn);

    let outLabel = document.createElement('div');
    outLabel.textContent = 'Output';
    outLabel.className = 'output-label';
    panel.appendChild(outLabel);

    output = document.createElement('div');
    output.className = 'agent-output';
    output.textContent = agent.outputPlaceholder;
    panel.appendChild(output);

    btn.onclick = () => {
      let val = textarea1.value || '';
      if (agent.name === 'Word Counter') {
        const count = val.trim().split(/\s+/).filter(Boolean).length;
        output.textContent = `There are ${count} word(s).`;
      } else if (agent.name === 'Capitalize') {
        output.textContent = val.toUpperCase();
      }
    };
  }
  // Crypto tools (coming soon)
  else {
    let outLabel = document.createElement('div');
    outLabel.textContent = 'Output';
    outLabel.className = 'output-label';
    outLabel.style.marginTop = '25px';
    panel.appendChild(outLabel);

    output = document.createElement('div');
    output.className = 'agent-output';
    output.textContent = agent.outputPlaceholder;
    panel.appendChild(output);
  }

  topRect.appendChild(panel);
}

// Clear panel on start
document.getElementById('topRectangle').innerHTML = '';

</script>
</body>
</html>
