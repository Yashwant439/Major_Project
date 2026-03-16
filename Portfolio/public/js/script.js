/* ===========================================================
   YASHWANT LABS — PORTFOLIO SCRIPT
   Sections: Particles · Typed.js · Terminal · Chatbot
             Scroll Animations · Stats Counter · Contrib Graph
   =========================================================== */

/* ---------- 1. Particles Background ---------- */
particlesJS('particles-js', {
  particles: {
    number: { value: 60, density: { enable: true, value_area: 900 } },
    color: { value: '#6366f1' },
    shape: { type: 'circle' },
    opacity: { value: 0.4, random: true },
    size: { value: 2.5, random: true },
    line_linked: {
      enable: true, distance: 160,
      color: '#6366f1', opacity: 0.1, width: 1
    },
    move: {
      enable: true, speed: 0.8,
      direction: 'none', random: true,
      straight: false, out_mode: 'out', bounce: false
    }
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: { enable: true, mode: 'grab' },
      onclick: { enable: true, mode: 'push' },
      resize: true
    },
    modes: {
      grab: { distance: 140, line_linked: { opacity: 0.3 } },
      push: { particles_nb: 2 }
    }
  },
  retina_detect: true
});

/* ---------- 2. Cursor Glow ---------- */
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  if (cursorGlow) {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top  = e.clientY + 'px';
  }
});

/* ---------- 3. Typed.js ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const typingEl = document.getElementById('typing');
  if (typingEl && typeof Typed !== 'undefined') {
    new Typed('#typing', {
      strings: [
        'I build intelligent developer tools.',
        'I build AI-powered web applications.',
        'I turn ideas into shipped products.',
        'I love solving hard problems with code.',
        'I build things at the edge of web & AI.'
      ],
      typeSpeed: 45,
      backSpeed: 25,
      backDelay: 1800,
      loop: true,
      showCursor: false
    });
  }
});

/* ---------- 4. Nav — Hamburger + Active Link ---------- */
const hamburger    = document.getElementById('hamburger');
const mobileMenu   = document.getElementById('mobileMenu');
const navLinks     = document.querySelectorAll('.nav-links a');
const mobileLinks  = document.querySelectorAll('.mobile-menu a');

hamburger && hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// Smooth scroll for ALL anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Active nav on scroll
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.getAttribute('id');
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

/* ---------- 5. Scroll Reveal ---------- */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(
  (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.12 }
);
revealEls.forEach(el => revealObs.observe(el));

/* Timeline items */
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObs = new IntersectionObserver(
  (entries) => entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 120);
    }
  }),
  { threshold: 0.1 }
);
timelineItems.forEach(el => timelineObs.observe(el));

/* ---------- 6. Stats Counter ---------- */
const statNums = document.querySelectorAll('.stat-num[data-target]');
const statObs  = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting || e.target.dataset.counted) return;
    e.target.dataset.counted = true;
    const target = +e.target.dataset.target;
    const start  = Date.now();
    const dur    = 1600;
    const tick = () => {
      const pct = Math.min((Date.now() - start) / dur, 1);
      const ease = 1 - Math.pow(1 - pct, 3);
      e.target.textContent = Math.round(ease * target) + '+';
      if (pct < 1) requestAnimationFrame(tick);
      else e.target.textContent = target + '+';
    };
    requestAnimationFrame(tick);
  });
}, { threshold: 0.3 });
statNums.forEach(el => statObs.observe(el));

/* ---------- 7. Progress Bars ---------- */
const progFills = document.querySelectorAll('.progress-fill[data-width]');
const progObs   = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.width;
    }
  });
}, { threshold: 0.3 });
progFills.forEach(el => progObs.observe(el));

/* ---------- 8. GitHub Contribution Grid ---------- */
(function buildContribGrid() {
  const grid = document.getElementById('contribGrid');
  if (!grid) return;
  const levels = [0, 0, 0, 1, 1, 2, 2, 3, 4]; // weighted random
  const total  = 52 * 7;
  for (let i = 0; i < total; i++) {
    const cell = document.createElement('div');
    cell.className = 'contrib-cell';
    const lvl = levels[Math.floor(Math.random() * levels.length)];
    if (lvl > 0) cell.classList.add('l' + lvl);
    cell.style.animationDelay = (i * 4) + 'ms';
    grid.appendChild(cell);
  }
})();

/* ---------- 9. Interactive Terminal ---------- */
const termOutput = document.getElementById('termOutput');
const termInput  = document.getElementById('termInput');

const COMMANDS = {
  help: () => `<div class="term-out-result">Available commands:</div>
    <div class="term-out-result">&nbsp;whoami &nbsp;· &nbsp;skills &nbsp;· &nbsp;projects &nbsp;· &nbsp;contact &nbsp;· &nbsp;github</div>
    <div class="term-out-result">&nbsp;now &nbsp;&nbsp;&nbsp;&nbsp;· &nbsp;tech &nbsp;&nbsp;&nbsp;&nbsp;· &nbsp;about &nbsp;&nbsp;&nbsp;&nbsp;· &nbsp;education · &nbsp;location</div>
    <div class="term-out-result">&nbsp;clear &nbsp;&nbsp;·  hello</div>`,

  whoami: () => `<div class="term-out-result">Name    : Yashwant Kumar Singh</div>
    <div class="term-out-result">Role    : AI Builder &amp; Full-Stack Web Developer</div>
    <div class="term-out-result">Status  : <span class="term-out-success">Open to work &amp; collaborations</span></div>
    <div class="term-out-result">Based in: New Delhi, India 🇮🇳</div>`,

  skills: () => `<div class="term-out-result">⚡ AI &amp; Intelligence:</div>
    <div class="term-out-result">&nbsp; OpenAI APIs · Prompt Engineering · LLM Apps · AI Integration</div>
    <div class="term-out-result">💻 Web Engineering:</div>
    <div class="term-out-result">&nbsp; JavaScript · React · Node.js · Express · HTML5 · CSS3 · Tailwind</div>
    <div class="term-out-result">🛠 Toolkit:</div>
    <div class="term-out-result">&nbsp; MongoDB · MySQL · REST APIs · Git · Vercel · Render</div>`,

  projects: () => `<div class="term-out-result">🧠 Advanced Diabetes Patient Management System — AI/ML · React · Python</div>
    <div class="term-out-result">🌍 Wanderlust Travel Explorer — Node.js · MongoDB · Express</div>
    <div class="term-out-result">📄 CVWizaard Resume Builder — React · Tailwind · Framer Motion</div>
    <div class="term-out-result">🌤 SkyCast Weather App — React · OpenWeatherMap API</div>
    <div class="term-out-result">🛒 E-commerce Clone — HTML5 · CSS3</div>`,

  contact: () => `<div class="term-out-result">📧 Email    : yashwantkumarsingh439@gmail.com</div>
    <div class="term-out-result">💼 LinkedIn : linkedin.com/in/yashwantkumarsingh</div>
    <div class="term-out-result">🐙 GitHub   : github.com/Yashwant439</div>`,

  github: () => {
    window.open('https://github.com/Yashwant439', '_blank');
    return `<div class="term-out-success">✓ Opening GitHub profile in new tab...</div>`;
  },

  now: () => `<div class="term-out-result">🔄 Currently building:</div>
    <div class="term-out-result">&nbsp; 🤖 AI Developer Assistant [65% complete]</div>
    <div class="term-out-result">&nbsp; 🌐 SaaS Developer Tools Platform [30% complete]</div>`,

  tech: () => `<div class="term-out-result">Primary: JavaScript, React, Node.js, Python</div>
    <div class="term-out-result">DB: MongoDB, MySQL</div>
    <div class="term-out-result">AI: OpenAI API, LLM integration, Prompt Engineering</div>
    <div class="term-out-result">DevOps: Git, Vercel, Render, Netlify</div>`,

  about: () => `<div class="term-out-result">2nd year CS student · passionate builder · hackathon participant</div>
    <div class="term-out-result">Intern @ GB Pant Institute — building ERP portal with React.js</div>
    <div class="term-out-result">JEE: 94th percentile · WBJEE Rank: 3060</div>`,

  education: () => `<div class="term-out-result">2020-21 : CBSE 10th — 88.16%</div>
    <div class="term-out-result">2021-23 : CBSE 12th — 75.3%</div>
    <div class="term-out-result">2023-24 : JEE Prep — 94th %ile, WBJEE 3060</div>
    <div class="term-out-result">2024-28 : B.Tech Computer Science (ongoing)</div>`,

  location: () => `<div class="term-out-result">📍 New Delhi, India</div>
    <div class="term-out-result">🌐 Available for remote opportunities globally</div>`,

  hello: () => `<div class="term-out-success">Hey! 👋 Thanks for visiting my portfolio terminal!</div>
    <div class="term-out-result">I hope you like what you see. Let's build something together!</div>`,

  clear: () => null
};

function appendLine(html) {
  termOutput.insertAdjacentHTML('beforeend', html + '<br>');
  termOutput.scrollTop = termOutput.scrollHeight;
}

function runCommand(cmd) {
  cmd = cmd.trim().toLowerCase();
  appendLine(
    `<span class="term-out-prompt">yashwant@labs</span><span style="color:var(--text-faint)">:~$</span> <span class="term-out-cmd">${cmd}</span>`
  );
  if (!cmd) return;
  const fn = COMMANDS[cmd];
  if (fn) {
    if (cmd === 'clear') {
      termOutput.innerHTML = '';
    } else {
      const result = fn();
      if (result) appendLine(result);
    }
  } else {
    appendLine(`<span class="term-out-error">bash: ${cmd}: command not found. Type <span style="color:var(--accent)">help</span> for commands.</span>`);
  }
  appendLine('');
}

termInput && termInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    runCommand(termInput.value);
    termInput.value = '';
  }
});

// Focus terminal on click anywhere in its area
document.querySelector('.terminal-interactive') && 
  document.querySelector('.terminal-interactive').addEventListener('click', () => termInput.focus());

/* ---------- 10. AI Chatbot ---------- */
const chatbotFab    = document.getElementById('chatbotFab');
const chatbotPanel  = document.getElementById('chatbotPanel');
const chatbotClose  = document.getElementById('chatbotClose');
const chatbotInput  = document.getElementById('chatbotInput');
const chatbotSend   = document.getElementById('chatbotSend');
const chatbotMsgs   = document.getElementById('chatbotMessages');

chatbotFab   && chatbotFab.addEventListener('click', () => chatbotPanel.classList.toggle('open'));
chatbotClose && chatbotClose.addEventListener('click', () => chatbotPanel.classList.remove('open'));

function appendChatMsg(text, role) {
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  div.textContent = text;
  chatbotMsgs.appendChild(div);
  chatbotMsgs.scrollTop = chatbotMsgs.scrollHeight;
}

function showTypingIndicator() {
  const div = document.createElement('div');
  div.className = 'chat-typing';
  div.id = 'typingIndicator';
  div.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  chatbotMsgs.appendChild(div);
  chatbotMsgs.scrollTop = chatbotMsgs.scrollHeight;
}
function removeTypingIndicator() {
  const ind = document.getElementById('typingIndicator');
  if (ind) ind.remove();
}

// Call the real Groq API backend endpoint
async function sendChatMessage() {
  const msg = chatbotInput.value.trim();
  if (!msg) return;
  
  // Add user message to UI
  appendChatMsg(msg, 'user');
  chatbotInput.value = '';
  
  // Show typing indicator
  showTypingIndicator();
  
  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });
    
    const data = await response.json();
    removeTypingIndicator();
    
    if (data.reply) {
      appendChatMsg(data.reply, 'bot');
    } else {
      appendChatMsg("Oops, I couldn't process that response. Please try again.", 'bot');
    }
  } catch (error) {
    console.error("Chat error:", error);
    removeTypingIndicator();
    appendChatMsg("I'm having trouble connecting to my brain right now. Please try again later!", 'bot');
  }
}

chatbotSend  && chatbotSend.addEventListener('click', sendChatMessage);
chatbotInput && chatbotInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendChatMessage(); });

/* ---------- 11. Flash Alert Auto-hide ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.alert').forEach(alert => {
    alert.style.display = 'block';
    setTimeout(() => {
      alert.style.opacity = '0';
      alert.style.transition = 'opacity 0.5s ease';
      setTimeout(() => alert.remove(), 500);
    }, 5000);
  });
});