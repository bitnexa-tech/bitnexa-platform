/**
 * BITNEXA TECHNOLOGIES - "CODE BEYOND LIMITS"
 * Award-Winning Cybernetic Scroll & Visual FX Engine:
 * 1. Momentum Inertia Scroll Engine with Elastic Velocity Skew
 * 2. Real-Time Heads-Up Display (Cyber HUD Telemetry & Laser Scanline)
 * 3. Kinetic Matrix Text Scramble Decoder on Viewport Intersection
 * 4. 3D Unfolding Portal Cards with Staggered Delays
 * 5. Holographic Specular Shine & 3D Tilt Card Physics
 * 6. Dual-Layer Laser Cursor with Lerp Dynamics
 * 7. Interactive Background Circuit Canvas
 * 8. Dynamic Portfolio Filtering & Direct Proposal Dispatch
 */

// ==========================================================================
// 1. DATASETS & GLOBAL STATE
// ==========================================================================
const portfolioProjects = [
  {
    id: 1,
    title: "NexusTrade – High-Volume Quick E-Commerce Engine",
    category: "web",
    categoryBadge: "Web & Full-Stack",
    categoryClass: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    description: "Next-gen storefront with instant search, sub-second product page loads, cart synchronization, Razorpay INR payment gateway, and real-time inventory management.",
    techStack: ["React 19", "Node.js", "Express", "Tailwind CSS", "PostgreSQL", "Razorpay"],
    metrics: "⚡ 99.8% Lighthouse Score • 0.4s Page Load • ₹12L+ monthly GMV capability",
    icon: "🛍️",
  },
  {
    id: 2,
    title: "DevFlow Studio – Real-Time Multi-Portal Agency Hub",
    category: "web",
    categoryBadge: "Enterprise SaaS",
    categoryClass: "bg-electric-500/15 text-electric-300 border-electric-500/30",
    description: "Full-stack client-worker-admin ecosystem with passwordless email OTP verification, 5-stage milestone tracking, developer Kanban sprint board, and executive revenue dashboard.",
    techStack: ["Node.js", "Express 5", "SQLite (WAL)", "JWT Auth", "Tailwind CSS", "Nodemailer"],
    metrics: "💼 3 Dedicated Portals • 8s Live Sync Polling • 100% Zero-Latency",
    icon: "⚙️",
  },
  {
    id: 3,
    title: "EstateSphere – Luxury Real Estate & Geo-Mapping Portal",
    category: "web",
    categoryBadge: "Web & Full-Stack",
    categoryClass: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    description: "High-converting property brokerage platform featuring 360° virtual video walkthroughs, interactive Leaflet/Google map pins, EMI loan calculators, and instant online client lead generation.",
    techStack: ["Next.js 14", "TypeScript", "Tailwind", "Cloudinary Video", "Leaflet Maps"],
    metrics: "📈 3.4x Lead Conversion Rate • 4K Video Integration • High-Converting Lead Hook",
    icon: "🏢",
  },
  {
    id: 4,
    title: "Custom Domain Zero-Downtime Live Deployer & SSL Pipeline",
    category: "cloud",
    categoryBadge: "DevOps & Cloud",
    categoryClass: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    description: "Automated production blueprint setup for automated git-push builds, environment secret encryption, automated custom domain DNS linkage with Cloudflare CDN, and free SSL certificates.",
    techStack: ["Custom Domain", "Docker", "Cloudflare DNS", "SSL/TLS", "GitHub Actions"],
    metrics: "🚀 100% Uptime SLA • Zero-Downtime Rolling Deploys • Free Auto-Renewing HTTPS",
    icon: "☁️",
  },
  {
    id: 5,
    title: "ReelPulse – Viral Instagram Reels & YouTube Shorts Engine",
    category: "media",
    categoryBadge: "Media & Video Editing",
    categoryClass: "bg-electric-500/15 text-electric-300 border-electric-500/30",
    description: "High-retention short-form video production package with kinetic typography, sound effects, motion graphics hooks, 4K color grading, and trend-focused script consultation.",
    techStack: ["Adobe Premiere Pro", "After Effects", "DaVinci Resolve", "Sound Design"],
    metrics: "🎬 2.8M+ Organic Impressions • 48% Average Watch Time • Viral Trend Curation",
    icon: "🎬",
  },
  {
    id: 6,
    title: "HealthSync – Multi-Doctor Clinic EHR & Telemedicine Portal",
    category: "web",
    categoryBadge: "Healthcare Web App",
    categoryClass: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    description: "Modern patient booking software with instant slot scheduling, digital prescription downloads, SMS & Email appointment reminders, and doctor consultation dashboard.",
    techStack: ["React", "Express", "MongoDB", "Twilio SMS & Nodemailer", "WebRTC"],
    metrics: "🩺 80% Reduction in No-Shows • HIPAA Aligned Security • Instant PDF Invoicing",
    icon: "🏥",
  },
  {
    id: 7,
    title: "Custom Domain, Cloudflare DNS & Business Email Architecture",
    category: "cloud",
    categoryBadge: "Domain & DNS Setup",
    categoryClass: "bg-electric-500/15 text-electric-300 border-electric-500/30",
    description: "Seamless domain purchase & configuration (GoDaddy / Namecheap / Hostinger) directly to dedicated cloud servers, Cloudflare DNS proxy for DDoS protection, and Zoho/Google Workspace business email inbox setup.",
    techStack: ["Cloudflare DNS", "Zoho Mail", "Google Workspace", "DKIM/SPF/DMARC", "GoDaddy"],
    metrics: "🌐 10/10 Email Deliverability • 0ms DNS Propagation • Bank-Grade DDoS Protection",
    icon: "🌐",
  },
  {
    id: 8,
    title: "Instagram Hyper-Growth & Targeted Paid Ads Lead Funnel",
    category: "media",
    categoryBadge: "Growth Marketing",
    categoryClass: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    description: "End-to-end Meta ad campaign management, custom creative ad creatives, audience targeting for high-ticket services, and landing page conversion optimization in Hindi & English.",
    techStack: ["Meta Ads Manager", "Google Analytics 4", "Canva Pro", "A/B Testing"],
    metrics: "📊 4.2x Return on Ad Spend (ROAS) • ₹14 Cost Per Lead • High-Converting Direct Lead Funnel",
    icon: "📈",
  }
];

// Global telemetry state
const telemetry = {
  scrollY: 0,
  lastScrollY: 0,
  velocity: 0,
  skew: 0,
  depth: 0,
  activeZone: 'HOME',
};

const mouse = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  targetX: window.innerWidth / 2,
  targetY: window.innerHeight / 2,
  outlineX: window.innerWidth / 2,
  outlineY: window.innerHeight / 2,
};

// 3D Quantum Atom Engine Global State
const interactiveAtomState = {
  mode: 'bohr',
  speed: 1,
  isReverse: false,
  burstActive: false,
  burstScale: 0.2,
  burstOpacity: 0,
};
window.interactiveAtomState = interactiveAtomState;

// ==========================================================================
// 2. DOM CONTENT LOADED INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  renderPortfolio('all');
  initStatsCounter();
  initCustomCursor();
  initCursorSparkles();
  initMomentumScrollEngine();
  initCircuitRails();
  init3DCardTilt();
  initMatrixTextScramble();
  init3DUnfoldObserver();
  initSplitRevealText();
  initCyberAudio();
  initCyberTerminal();
  initOrbitalParallax();
  initNavScrollState();
  // initProfessional3DBackground(); // Disabled per user request: Removed 3D Laptop and 3D Chip
  initInteractiveAtomScene();
  initWarpFieldSection();

  // Set permanent English language
  localStorage.setItem('bitnexa_lang', 'en');
  setLanguage('en', false);
});

// ==========================================================================
// 3. MOMENTUM INERTIA SCROLL ENGINE & VELOCITY SKEW DAMPING
// ==========================================================================
function initMomentumScrollEngine() {
  const content = document.getElementById('smooth-content');
  const progressBar = document.getElementById('scroll-progress-bar');
  const scanline = document.getElementById('scroll-scanline');
  const hudDepth = document.getElementById('hud-depth');
  const hudVelocity = document.getElementById('hud-velocity');
  const hudZone = document.getElementById('hud-zone');

  let scanlineTimeout = null;

  window.addEventListener('scroll', () => {
    telemetry.scrollY = window.scrollY;
  }, { passive: true });

  // 60-120 FPS Telemetry & Velocity Skew Loop
  function updateScrollPhysics() {
    // Calculate raw delta
    const delta = telemetry.scrollY - telemetry.lastScrollY;
    telemetry.velocity += (delta - telemetry.velocity) * 0.25;
    telemetry.lastScrollY = telemetry.scrollY;

    // Elastic Skew Physics completely disabled per user request (zero screen shake on scroll)
    telemetry.skew = 0;
    if (content) {
      content.style.transform = 'none';
    }

    // Top Progress Bar
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    telemetry.depth = totalScroll > 0 ? (telemetry.scrollY / totalScroll) * 100 : 0;
    if (progressBar) {
      progressBar.style.width = `${telemetry.depth.toFixed(1)}%`;
    }

    // Telemetry HUD updates
    if (hudDepth) {
      hudDepth.innerText = `${Math.round(telemetry.depth).toString().padStart(3, '0')}%`;
    }
    if (hudVelocity) {
      hudVelocity.innerText = `${Math.abs(Math.round(telemetry.velocity))} px/s`;
    }

    // Zone detection
    detectActiveZone();
    if (hudZone) {
      hudZone.innerText = telemetry.activeZone;
    }

    requestAnimationFrame(updateScrollPhysics);
  }
  requestAnimationFrame(updateScrollPhysics);
}

function detectActiveZone() {
  const sections = ['services', 'projects', 'why-us', 'process', 'packages', 'testimonials', 'faqs', 'founders', 'contact'];
  for (const id of sections) {
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.2) {
        telemetry.activeZone = id.toUpperCase();
        return;
      }
    }
  }
  telemetry.activeZone = 'HERO_HUB';
}

// ==========================================================================
// 4. KINETIC MATRIX TEXT SCRAMBLE DECODER
// ==========================================================================
function initMatrixTextScramble() {
  const scrambleElements = document.querySelectorAll('.cyber-scramble');
  const chars = '01#@!&%<>[]/X_+=*';

  const scrambleObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const originalText = el.getAttribute('data-text') || el.innerText.trim();
        el.setAttribute('data-text', originalText);
        observer.unobserve(el);

        let iteration = 0;
        const totalIterations = originalText.length * 2.5;

        const interval = setInterval(() => {
          el.innerText = originalText
            .split('')
            .map((char, index) => {
              if (index < iteration / 2.5) {
                return originalText[index];
              }
              if (char === ' ') return ' ';
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');

          iteration++;
          if (iteration >= totalIterations) {
            el.innerText = originalText;
            clearInterval(interval);
          }
        }, 22);
      }
    });
  }, { threshold: 0.2 });

  scrambleElements.forEach((el) => scrambleObserver.observe(el));
}

// ==========================================================================
// 5. 3D UNFOLDING PORTAL CARDS (INTERSECTION OBSERVER)
// ==========================================================================
function init3DUnfoldObserver() {
  const unfoldObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('unfold-active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.unfold-card').forEach((el) => {
    unfoldObserver.observe(el);
  });
}

// ==========================================================================
// 6. 3D TILT PHYSICS & DYNAMIC SPECULAR SHINE (CLEAN & NON-SHAKING)
// ==========================================================================
function init3DCardTilt() {
  const cards = document.querySelectorAll('.circuit-card');
  cards.forEach((card) => {
    card.style.transform = 'none';
  });
}

// ==========================================================================
// 7. CUSTOM DUAL-LAYER CYBER CURSOR (60 FPS LERP)
// ==========================================================================
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');
  if (!dot || !outline || window.innerWidth < 1024) return;

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;
  });

  window.addEventListener('mousedown', () => outline.classList.add('cursor-click'));
  window.addEventListener('mouseup', () => outline.classList.remove('cursor-click'));

  setupCursorHoverListeners();

  function renderCursor() {
    const ease = 0.18;
    mouse.outlineX += (mouse.targetX - mouse.outlineX) * ease;
    mouse.outlineY += (mouse.targetY - mouse.outlineY) * ease;

    outline.style.left = `${mouse.outlineX}px`;
    outline.style.top = `${mouse.outlineY}px`;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);
}

function setupCursorHoverListeners() {
  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');
  if (!dot || !outline) return;

  const targets = document.querySelectorAll('a, button, input, textarea, select, .circuit-card, .filter-btn');
  targets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      outline.classList.add('cursor-hover');
      dot.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      outline.classList.remove('cursor-hover');
      dot.classList.remove('cursor-hover');
    });
  });
}

// ==========================================================================
// 8. PORTFOLIO SHOWCASE RENDERING
// ==========================================================================
function renderPortfolio(category) {
  const container = document.getElementById('portfolio-grid');
  if (!container) return;

  const filtered = category === 'all' 
    ? portfolioProjects 
    : portfolioProjects.filter((p) => p.category === category);

  container.innerHTML = filtered.map((p, idx) => `
    <div class="circuit-card unfold-card p-6 flex flex-col justify-between group delay-${((idx % 4) + 1) * 100}">
      <div class="relative z-10">
        <div class="flex items-center justify-between gap-3 mb-4">
          <span class="text-3xl">${p.icon}</span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${p.categoryClass}">
            ${p.categoryBadge}
          </span>
        </div>

        <h3 class="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
          ${p.title}
        </h3>

        <p class="text-slate-300 text-sm mt-3 leading-relaxed">
          ${p.description}
        </p>

        <div class="mt-4 p-3 rounded-xl bg-void-950/90 border border-cyan-500/20 text-xs text-cyan-300 font-mono">
          ${p.metrics}
        </div>

        <div class="mt-4 flex flex-wrap gap-1.5">
          ${p.techStack.map((t) => `
            <span class="text-[11px] px-2.5 py-1 rounded-lg bg-void-900 border border-white/5 text-slate-300 font-medium">
              ${t}
            </span>
          `).join('')}
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-2 relative z-10">
        <button onclick="openDevicePreview(${p.id})" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-cyan-500/20 text-xs font-bold font-mono transition-all shadow-sm">
          <span>🔍 3D Preview</span>
        </button>
        <button onclick="requestProjectQuote('${escapeHtml(p.title)}')" class="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-white group-hover:translate-x-1 transition-all">
          <span data-i18n="btn_build_similar">Build Similar</span> &rarr;
        </button>
      </div>
    </div>
  `).join('');

  init3DCardTilt();
  setupCursorHoverListeners();

  requestAnimationFrame(() => {
    container.querySelectorAll('.unfold-card').forEach((el) => {
      el.classList.add('unfold-active');
    });
  });
}

function filterCategory(category, btnElement) {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach((b) => {
    b.className = 'filter-btn px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-void-900 border border-white/5 transition-all';
  });

  if (btnElement) {
    btnElement.className = 'filter-btn px-4 py-2 rounded-xl text-xs font-bold text-black bg-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all';
  }

  renderPortfolio(category);
}

// ==========================================================================
// 10. INQUIRY MODAL & DIRECT PROPOSAL DISPATCH
// ==========================================================================
function requestProjectQuote(projectTitle) {
  const modal = document.getElementById('inquiry-modal');
  const serviceInput = document.getElementById('modal-service') || document.getElementById('inquiry-service-input');
  if (serviceInput) {
    serviceInput.value = `Inquiry for Project: ${projectTitle}`;
  }
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function openInquiryModal(defaultService = '') {
  const modal = document.getElementById('inquiry-modal');
  const serviceInput = document.getElementById('modal-service') || document.getElementById('inquiry-service-input');
  if (serviceInput && defaultService) {
    serviceInput.value = defaultService;
  }
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function closeInquiryModal() {
  const modal = document.getElementById('inquiry-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function handleInquirySubmit(e) {
  e.preventDefault();
  const name = (document.getElementById('inquiry-name') || document.getElementById('modal-name')).value.trim();
  const email = (document.getElementById('inquiry-email') || document.getElementById('modal-email')).value.trim();
  const phone = (document.getElementById('inquiry-phone') || document.getElementById('modal-phone')).value.trim();
  const service = (document.getElementById('inquiry-service-input') || document.getElementById('modal-service')).value.trim();
  const message = (document.getElementById('inquiry-message') || document.getElementById('modal-details')).value.trim();

  const subject = encodeURIComponent(`Project Proposal Inquiry: ${service} - from ${name}`);
  const body = encodeURIComponent(
`Hello Aryan & Virendra (Bitnexa Technologies),

I would like to request a formal proposal and quote for a new project.

PROJECT DETAILS:
- Client Name: ${name}
- Email: ${email}
- Contact Phone: ${phone}
- Required Service: ${service}

PROJECT SCOPE & REQUIREMENTS:
${message}

Please review and reply with your estimated delivery timeline and quotation.

Best regards,
${name}`
  );

  const mailtoUrl = `mailto:bitnexa.technologies@gmail.com?cc=aryan.bitnexa@gmail.com,virendra.bitnexa@gmail.com&subject=${subject}&body=${body}`;

  // Automatically save inquiry to agency database
  fetch('/api/inquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, phone, service, message })
  }).catch(() => {});

  closeInquiryModal();
  if (window.showMissionPassedToast) {
    window.showMissionPassedToast('MISSION PASSED!', 'RESPECT + PROPOSAL DISPATCHED');
  } else {
    showWebsiteToast(`Thank you ${name}! Your proposal inquiry has been submitted. Opening email client...`, 'success');
  }

  setTimeout(() => {
    window.location.href = mailtoUrl;
  }, 700);
}

function openInquiryModalForPreview() {
  const project = portfolioProjects.find((p) => p.id === currentPreviewProjectId) || portfolioProjects[0];
  closeDevicePreview();
  requestProjectQuote(project.title);
}

function showWebsiteToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-void-900 border ${type === 'success' ? 'border-cyan-500/40 text-cyan-300' : 'border-rose-500/40 text-rose-300'} shadow-2xl flex items-center gap-3 text-sm max-w-md`;
  toast.innerHTML = `
    <span>${type === 'success' ? '⚡' : '⚠️'}</span>
    <span class="flex-1 font-medium text-slate-100">${message}</span>
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4500);
}

function initStatsCounter() {
  const stats = [
    { id: 'stat-projects', target: 35, suffix: '+' },
    { id: 'stat-uptime', target: 99.9, suffix: '%' },
    { id: 'stat-hours', target: 24, suffix: 'h Turnaround' },
    { id: 'stat-satisfaction', target: 100, suffix: '%' },
  ];

  stats.forEach((s) => {
    const el = document.getElementById(s.id);
    if (!el) return;
    el.innerText = `${s.target}${s.suffix}`;
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// ==========================================================================
// 11. CYBER AUDIO SYNTHESIZER (WEB AUDIO API)
// ==========================================================================
let audioCtx = null;
let soundEnabled = false;

function initCyberAudio() {
  try {
    soundEnabled = localStorage.getItem('bitnexa_sound') === 'true';
    updateSoundUI();
  } catch (e) {}

  document.querySelectorAll('a, button, .filter-btn, .circuit-card').forEach((el) => {
    el.addEventListener('mouseenter', () => playCyberChirp());
    el.addEventListener('click', () => playCyberClick());
  });
}

function toggleCyberAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  soundEnabled = !soundEnabled;
  try {
    localStorage.setItem('bitnexa_sound', soundEnabled);
  } catch (e) {}
  updateSoundUI();

  if (soundEnabled) {
    playCyberChirp(800, 1400);
    showWebsiteToast('Cyber Audio FX Enabled! Experience futuristic UI feedback.', 'success');
  }
}

function updateSoundUI() {
  const hudBadge = document.getElementById('sound-status-badge');
  const navBtn = document.getElementById('nav-sound-btn');
  if (hudBadge) {
    hudBadge.innerText = soundEnabled ? 'ON' : 'OFF';
    hudBadge.className = soundEnabled ? 'text-cyan-400 font-bold' : 'text-slate-400 font-bold';
  }
  if (navBtn) {
    navBtn.innerHTML = soundEnabled ? '🔊 SFX: <span class="text-cyan-400 font-bold">ON</span>' : '🔇 SFX: <span class="text-slate-400">OFF</span>';
  }
}

function playCyberChirp(startFreq = 1200, endFreq = 1900, duration = 0.04) {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, audioCtx.currentTime + duration);

    gain.gain.setValueAtTime(0.025, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

function playCyberClick() {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  } catch (e) {}
}

// ==========================================================================
// 12. CURSOR SPARKLE TRAIL ENGINE
// ==========================================================================
function initCursorSparkles() {
  if (window.innerWidth < 1024) return;
  let lastSparkleTime = 0;

  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSparkleTime < 32) return;
    lastSparkleTime = now;

    const sparkle = document.createElement('div');
    sparkle.className = 'cursor-sparkle';
    const size = Math.random() * 5 + 3;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.left = `${e.clientX + (Math.random() - 0.5) * 16}px`;
    sparkle.style.top = `${e.clientY + (Math.random() - 0.5) * 16}px`;

    document.body.appendChild(sparkle);

    requestAnimationFrame(() => {
      sparkle.style.transform = `translate(-50%, -50%) scale(0) translateY(${Math.random() * 20 + 10}px)`;
      sparkle.style.opacity = '0';
    });

    setTimeout(() => sparkle.remove(), 480);
  });
}

// ==========================================================================
// 13. DYNAMIC SCROLL CIRCUIT RAILS
// ==========================================================================
function initCircuitRails() {
  const leftRail = document.getElementById('circuit-rail-left-line');
  const rightRail = document.getElementById('circuit-rail-right-line');
  if (!leftRail && !rightRail) return;

  window.addEventListener('scroll', () => {
    const offset = (window.scrollY * 0.35) % 80;
    if (leftRail) leftRail.style.strokeDashoffset = `${offset}px`;
    if (rightRail) rightRail.style.strokeDashoffset = `-${offset}px`;
  }, { passive: true });
}

// ==========================================================================
// 14. 3D ORBITAL HERO LOGO PARALLAX (DISABLED TO PREVENT SHAKING)
// ==========================================================================
function initOrbitalParallax() {
  const stage = document.getElementById('hero-orbital-stage');
  if (stage) {
    stage.style.transform = 'none';
  }
}

// ==========================================================================
// 15. INTERACTIVE CYBER TERMINAL SANDBOX
// ==========================================================================
function initCyberTerminal() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  if (!input || !output) return;

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim().toLowerCase();
      input.value = '';
      if (!cmd) return; // Prevent empty command error
      executeTerminalCommand(cmd);
    }
  });
}

function executeTerminalCommand(cmd) {
  if (!cmd || typeof cmd !== 'string') return;
  cmd = cmd.trim().toLowerCase();
  if (!cmd) return; // Ignore blank input

  const output = document.getElementById('terminal-output');
  if (!output) return;

  playCyberClick();

  const cmdLine = document.createElement('div');
  cmdLine.className = 'text-amber-400 font-bold mt-2 font-mono text-xs';
  cmdLine.innerText = `bitnexa@guest:~$ ${cmd}`;
  output.appendChild(cmdLine);

  const respLine = document.createElement('div');
  respLine.className = 'text-slate-200 ml-2 mt-1 leading-relaxed font-mono';

  switch(cmd) {
    case 'help':
      respLine.innerHTML = `
        <div class="text-xs space-y-1.5 py-1">
          <div class="text-amber-300 font-bold">Available System Directives:</div>
          <div><span class="text-amber-400 font-bold">atom</span>     &bull; 3D Quantum Atom architecture details</div>
          <div><span class="text-amber-400 font-bold">services</span> &bull; Full-stack engineering &amp; media pricing</div>
          <div><span class="text-amber-400 font-bold">stack</span>    &bull; Core production technology stack</div>
          <div><span class="text-amber-400 font-bold">founders</span> &bull; Direct leadership dossiers</div>
          <div><span class="text-amber-400 font-bold">quote</span>    &bull; Open instant project quotation modal</div>
          <div><span class="text-amber-400 font-bold">contact</span>  &bull; Executive communication channels</div>
          <div><span class="text-amber-400 font-bold">clear</span>    &bull; Reset terminal display</div>
        </div>
      `;
      break;
    case 'atom':
      respLine.innerHTML = `
        <div class="text-xs space-y-1 py-1">
          <div>⚛️ <b class="text-amber-300">Bitnexa 3D Quantum Atom Core Active</b></div>
          <div class="text-slate-300">Architecture: WebGL / Three.js &bull; Shells: 4 (K, L, M, N) &bull; Core: 432.8 THz</div>
          <div class="text-amber-400 mt-1 cursor-pointer underline font-bold" onclick="document.getElementById('quantum-atom')?.scrollIntoView({ behavior: 'smooth' })">
            &rarr; Click here to jump to 3D Quantum Atom interactive model
          </div>
        </div>
      `;
      break;
    case 'services':
      respLine.innerHTML = `
        <div class="text-xs space-y-1 py-1">
          <div>⚡ 1. Modern Web Apps (React 19, Next.js, Tailwind) - Starts ₹4,999</div>
          <div>⚡ 2. Node.js Backend &amp; REST APIs (PostgreSQL, Razorpay) - Starts ₹7,999</div>
          <div>⚡ 3. Custom Domain Live Deployments &amp; SSL - Starts ₹2,499</div>
          <div>⚡ 4. Custom Domains &amp; Cloudflare DNS - Starts ₹1,999</div>
          <div>⚡ 5. Viral Instagram Reels Video Editing - Starts ₹4,999</div>
          <div>⚡ 6. Meta Ads &amp; Growth Marketing - Starts ₹9,999</div>
        </div>
      `;
      break;
    case 'stack':
      respLine.innerHTML = '<div class="text-xs text-slate-200 py-1"><b class="text-amber-300">Tech Stack:</b> React 19, Next.js, Node.js, Express, PostgreSQL, SQLite, Tailwind CSS, Cloudflare CDN, Three.js, Adobe Premiere Pro, After Effects.</div>';
      break;
    case 'founders':
      respLine.innerHTML = `
        <div class="text-xs space-y-1 py-1">
          <div>👑 <b class="text-amber-300">Aryan Jangir</b> — Co-Founder &amp; Head of Tech (<a href="mailto:aryan.bitnexa@gmail.com" class="text-amber-400 underline">aryan.bitnexa@gmail.com</a>)</div>
          <div>⚡ <b class="text-amber-300">Virendra</b> — Co-Founder &amp; Head of Operations (<a href="mailto:virendra.bitnexa@gmail.com" class="text-amber-400 underline">virendra.bitnexa@gmail.com</a>)</div>
        </div>
      `;
      break;
    case 'quote':
      respLine.innerHTML = '<div class="text-xs text-amber-300 py-1">Opening project proposal modal...</div>';
      setTimeout(() => openInquiryModal('Terminal Quick Inquiry'), 400);
      break;
    case 'contact':
      respLine.innerHTML = `
        <div class="text-xs space-y-1 py-1">
          <div>✉️ Agency: <a href="mailto:bitnexa.technologies@gmail.com" class="text-amber-400 underline font-bold">bitnexa.technologies@gmail.com</a></div>
          <div>👨‍💻 Aryan: <a href="mailto:aryan.bitnexa@gmail.com" class="text-amber-300 underline font-mono">aryan.bitnexa@gmail.com</a></div>
          <div>🎬 Virendra: <a href="mailto:virendra.bitnexa@gmail.com" class="text-amber-300 underline font-mono">virendra.bitnexa@gmail.com</a></div>
        </div>
      `;
      break;
    case 'clear':
      output.innerHTML = '';
      return;
    default:
      respLine.innerHTML = `<span class="text-rose-400 font-mono text-xs">Command not found: "${cmd}". Type <b class="text-amber-400 underline cursor-pointer" onclick="executeTerminalCommand('help')">help</b> for available directives.</span>`;
  }

  output.appendChild(respLine);
  output.scrollTop = output.scrollHeight;
}

// ==========================================================================
// 16. GLASS NAV SCROLL STATE CONTROLLER
// ==========================================================================
function initNavScrollState() {
  const header = document.querySelector('header');
  if (!header) return;
  header.classList.add('nav-glass');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 120) {
      header.classList.add('scrolled-deep');
      header.classList.remove('scrolled');
    } else if (window.scrollY > 40) {
      header.classList.add('scrolled');
      header.classList.remove('scrolled-deep');
    } else {
      header.classList.remove('scrolled', 'scrolled-deep');
    }
  }, { passive: true });
}

// ==========================================================================
// 17. MASTER PROFESSIONAL 3D QUANTUM WAVE & AURORA SCENE (THREE.JS)
// ==========================================================================
function initProfessional3DBackground() {
  const canvas = document.getElementById('neon-webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07010f, 0.012);

  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 120);
  camera.position.set(0, 1.8, 11.5);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
  } catch (err) {
    console.warn('Background WebGL initialization failed:', err);
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Texture Loader for Official Logo
  const textureLoader = new THREE.TextureLoader();
  const logoTexture = textureLoader.load('assets/logo.jpg');
  logoTexture.generateMipmaps = true;
  logoTexture.minFilter = THREE.LinearMipmapLinearFilter;

  // Soft Glow Texture for particles & lights (Luxury Ambient Embers)
  function createGlowTexture() {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.25, 'rgba(245, 158, 11, 0.85)');
    grad.addColorStop(0.6, 'rgba(217, 119, 6, 0.35)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }
  const glowTexture = createGlowTexture();

  // ==========================================================================
  // LIGHTING SETUP (STUDIO AMBIENT & DIRECTIONAL LIGHTING)
  // ==========================================================================
  const ambientLight = new THREE.AmbientLight(0x160528, 2.6);
  scene.add(ambientLight);

  const mainSun = new THREE.DirectionalLight(0xfff8ee, 3.2);
  mainSun.position.set(8, 12, 10);
  scene.add(mainSun);

  const rimLight = new THREE.DirectionalLight(0xff007f, 2.8);
  rimLight.position.set(-8, 6, -6);
  scene.add(rimLight);

  const neonFillCyan = new THREE.PointLight(0x00f0ff, 4.0, 30);
  neonFillCyan.position.set(-7, 4, 6);
  scene.add(neonFillCyan);

  const neonFillPurple = new THREE.PointLight(0xff007f, 3.8, 30);
  neonFillPurple.position.set(7, -2, 5);
  scene.add(neonFillPurple);

  // Dedicated spotlight for Processor Logo
  const cpuSpotLight = new THREE.PointLight(0x00f0ff, 3.5, 10);
  cpuSpotLight.position.set(0, 2.5, -0.6);
  scene.add(cpuSpotLight);

  // ==========================================================================
  // AMBIENT STARFIELD PARTICLES
  // ==========================================================================
  const starCount = 450;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    starPos[i3] = (Math.random() - 0.5) * 65;
    starPos[i3 + 1] = (Math.random() - 0.5) * 50;
    starPos[i3 + 2] = (Math.random() - 0.5) * 55 - 12;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    size: 0.28,
    map: glowTexture,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const starField = new THREE.Points(starGeo, starMat);
  scene.add(starField);

  // ==========================================================================
  // MASTER ROOT RIG GROUP
  // ==========================================================================
  const masterRig = new THREE.Group();
  masterRig.position.set(0, -0.4, 0);
  scene.add(masterRig);

  const macbookModelGroup = new THREE.Group();
  const interiorLogicBoard = new THREE.Group();
  masterRig.add(macbookModelGroup);
  masterRig.add(interiorLogicBoard);

  // Array to track materials of loaded GLB for X-Ray opacity
  const glbMaterials = [];

  // ==========================================================================
  // LOAD THE AUTHENTIC MACBOOK PRO MODEL (EXACT MODEL FROM USER VIDEO)
  // ==========================================================================
  let isGlbLoaded = false;
  if (typeof THREE.GLTFLoader !== 'undefined') {
    const loader = new THREE.GLTFLoader();
    loader.load(
      'assets/macbook-standard.glb',
      (gltf) => {
        const root = gltf.scene;

        // Auto-compute bounding box to normalize scale & position
        const box = new THREE.Box3().setFromObject(root);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const targetWidth = 9.8;
        const scale = targetWidth / Math.max(size.x, 0.001);
        root.scale.set(scale, scale, scale);

        // Center the model so hinge is at back, keyboard is centered
        root.position.x = -center.x * scale;
        root.position.y = -center.y * scale + 0.1;
        root.position.z = -center.z * scale;

        // Collect all mesh materials for smooth X-Ray dissolve
        root.traverse((child) => {
          if (child.isMesh && child.material) {
            child.castShadow = true;
            child.receiveShadow = true;
            // Ensure material supports opacity fading
            child.material.transparent = true;
            glbMaterials.push(child.material);
          }
        });

        macbookModelGroup.add(root);
        isGlbLoaded = true;
        console.log('✅ Official MacBook Pro 16" GLB Loaded successfully!');
      },
      undefined,
      (err) => {
        console.warn('GLB load failed, falling back to procedural:', err);
      }
    );
  }

  // ==========================================================================
  // PROCEDURAL HIGH-END BACKUP CHASSIS (IF GLB IS STILL LOADING OR OFFLINE)
  // ==========================================================================
  const backupGroup = new THREE.Group();
  macbookModelGroup.add(backupGroup);

  function createRoundedRectShape(w, h, r) {
    const s = new THREE.Shape();
    const x = -w / 2;
    const y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }

  // Authentic procedural M3 Space Black Wallpaper texture
  function createM3WallpaperTexture() {
    const c = document.createElement('canvas');
    c.width = 1920;
    c.height = 1200;
    const ctx = c.getContext('2d');

    ctx.fillStyle = '#05070c';
    ctx.fillRect(0, 0, 1920, 1200);

    // Glowing 3D M3 Liquid Chrome Tubes
    ctx.save();
    ctx.lineWidth = 140;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const tubeGrad = ctx.createLinearGradient(300, 200, 1600, 1000);
    tubeGrad.addColorStop(0, '#1e293b');
    tubeGrad.addColorStop(0.3, '#cbd5e1');
    tubeGrad.addColorStop(0.6, '#38bdf8');
    tubeGrad.addColorStop(1, '#0f172a');

    ctx.strokeStyle = tubeGrad;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 45;

    ctx.beginPath();
    ctx.moveTo(350, 250);
    ctx.bezierCurveTo(900, 150, 1600, 350, 1550, 750);
    ctx.bezierCurveTo(1500, 1100, 800, 950, 500, 800);
    ctx.stroke();

    // Inner bright specular core
    ctx.lineWidth = 40;
    ctx.strokeStyle = '#ffffff';
    ctx.shadowBlur = 20;
    ctx.stroke();
    ctx.restore();

    // Top Notch
    ctx.fillStyle = '#020306';
    ctx.beginPath();
    ctx.roundRect(1920 / 2 - 120, 0, 240, 42, [0, 0, 12, 12]);
    ctx.fill();

    return new THREE.CanvasTexture(c);
  }
  const m3Texture = createM3WallpaperTexture();

  // Procedural MacBook Pro (active until GLB loads, or as flawless fallback)
  const procBaseMat = new THREE.MeshStandardMaterial({ color: 0x14151a, metalness: 0.92, roughness: 0.2, transparent: true, opacity: 1.0 });
  const procBaseShape = createRoundedRectShape(9.4, 6.0, 0.42);
  const procBaseGeo = new THREE.ExtrudeGeometry(procBaseShape, { depth: 0.32, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.06, bevelThickness: 0.05 });
  procBaseGeo.center();
  const procBaseMesh = new THREE.Mesh(procBaseGeo, procBaseMat);
  procBaseMesh.rotation.x = Math.PI / 2;
  backupGroup.add(procBaseMesh);

  // Force Touch Trackpad
  const procTrackpad = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 1.9),
    new THREE.MeshStandardMaterial({ color: 0x0e0f13, metalness: 0.94, roughness: 0.16, transparent: true, opacity: 1.0 })
  );
  procTrackpad.rotation.x = -Math.PI / 2;
  procTrackpad.position.set(0, 0.2, 1.68);
  backupGroup.add(procTrackpad);

  // Upright Screen Lid with M3 Wallpaper
  const procScreenHinge = new THREE.Group();
  procScreenHinge.position.set(0, 0.16, -2.9);
  procScreenHinge.rotation.x = -0.22;
  backupGroup.add(procScreenHinge);

  const procLidGeo = new THREE.ExtrudeGeometry(createRoundedRectShape(9.4, 5.6, 0.42), { depth: 0.18, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.04, bevelThickness: 0.04 });
  procLidGeo.center();
  const procLid = new THREE.Mesh(procLidGeo, procBaseMat);
  procLid.position.set(0, 2.8, 0);
  procScreenHinge.add(procLid);

  const procDisplay = new THREE.Mesh(
    new THREE.PlaneGeometry(9.0, 5.2),
    new THREE.MeshBasicMaterial({ map: m3Texture, transparent: true, opacity: 1.0 })
  );
  procDisplay.position.set(0, 2.8, 0.11);
  procScreenHinge.add(procDisplay);

  // ==========================================================================
  // 4. THE INTERIOR LOGIC BOARD (UNDER KEYBOARD REVEALED ON SCROLL)
  // ==========================================================================
  interiorLogicBoard.position.set(0, 0, -0.6);

  // Multi-layer Matte Black Logic Board PCB
  const mbMat = new THREE.MeshStandardMaterial({
    color: 0x050c18,
    metalness: 0.6,
    roughness: 0.5,
    transparent: true,
    opacity: 0.0,
  });
  const mbMesh = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.08, 4.4), mbMat);
  interiorLogicBoard.add(mbMesh);

  // Dual Centrifugal Blower Fans
  const fanGroup = new THREE.Group();
  interiorLogicBoard.add(fanGroup);
  const fanItems = [];

  [-2.6, 2.6].forEach((fx) => {
    const fRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.85, 0.06, 12, 36),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending })
    );
    fRing.rotation.x = -Math.PI / 2;
    fRing.position.set(fx, 0.08, 0);
    fanGroup.add(fRing);

    const rotor = new THREE.Group();
    rotor.position.set(fx, 0.08, 0);
    fanGroup.add(rotor);

    const bMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.0 });
    for (let b = 0; b < 11; b++) {
      const bAngle = (b / 11) * Math.PI * 2;
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.02, 0.52), bMat);
      blade.position.set(Math.cos(bAngle) * 0.4, 0, Math.sin(bAngle) * 0.4);
      blade.rotation.y = -bAngle;
      rotor.add(blade);
    }
    fanItems.push({ ring: fRing, rotor, bMat });
  });

  // Black Vapor Chamber & Liquid Heatpipes
  const pipeMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
  });
  const pipe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.6, 12), pipeMat);
  pipe1.rotation.z = Math.PI / 2.3;
  pipe1.position.set(-1.3, 0.08, 0);
  interiorLogicBoard.add(pipe1);

  const pipe2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.6, 12), pipeMat);
  pipe2.rotation.z = -Math.PI / 2.3;
  pipe2.position.set(1.3, 0.08, 0);
  interiorLogicBoard.add(pipe2);

  // Micro-Circuit Traces on Logic Board
  const traceCoords = [];
  for (let i = 0; i < 48; i++) {
    const angle = (i / 48) * Math.PI * 2;
    const r1 = 1.35;
    const r2 = 2.4 + (i % 4) * 0.35;
    traceCoords.push(
      Math.cos(angle) * r1, 0.05, Math.sin(angle) * r1,
      Math.cos(angle) * r2, 0.05, Math.sin(angle) * r2
    );
  }
  const traceGeo = new THREE.BufferGeometry();
  traceGeo.setAttribute('position', new THREE.Float32BufferAttribute(traceCoords, 3));
  const traceMat = new THREE.LineBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
  });
  const traceLines = new THREE.LineSegments(traceGeo, traceMat);
  interiorLogicBoard.add(traceLines);

  // ==========================================================================
  // 5. THE APPLE SILICON / M-SERIES PROCESSOR WITH BITNEXA WEBSITE LOGO DIE
  // ==========================================================================
  const cpuGroup = new THREE.Group();
  cpuGroup.position.set(0, 0.08, 0);
  interiorLogicBoard.add(cpuGroup);

  // Chip Carrier Substrate
  const socketMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    metalness: 0.92,
    roughness: 0.18,
    transparent: true,
    opacity: 0.0,
  });
  const socketBase = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.08, 2.7), socketMat);
  socketBase.position.y = 0.04;
  cpuGroup.add(socketBase);

  // Golden Substrate Contact Pins Perimeter
  const pinMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.0,
  });
  const pinRing = new THREE.Mesh(new THREE.RingGeometry(1.22, 1.3, 4), pinMat);
  pinRing.rotation.x = -Math.PI / 2;
  pinRing.position.y = 0.09;
  cpuGroup.add(pinRing);

  // Mirror-Polished Titanium Integrated Heat Spreader (IHS)
  const ihsMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.92,
    roughness: 0.18,
    transparent: true,
    opacity: 0.0,
  });
  const ihsMesh = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.08, 2.3), ihsMat);
  ihsMesh.position.y = 0.11;
  cpuGroup.add(ihsMesh);

  // Laser-Cut Metallic Cyan Rim
  const rimMat = new THREE.LineBasicMaterial({
    color: 0x00f0ff,
    linewidth: 2,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
  });
  const rimMesh = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(2.05, 0.03, 2.05)),
    rimMat
  );
  rimMesh.position.y = 0.16;
  cpuGroup.add(rimMesh);

  // *** THE OFFICIAL WEBSITE LOGO ON THE PROCESSOR DIE ***
  const logoGeo = new THREE.PlaneGeometry(2.0, 2.0);
  const logoMat = new THREE.MeshBasicMaterial({
    map: logoTexture,
    transparent: true,
    opacity: 0.0,
  });
  const logoMesh = new THREE.Mesh(logoGeo, logoMat);
  logoMesh.rotation.x = -Math.PI / 2;
  logoMesh.position.y = 0.17;
  cpuGroup.add(logoMesh);

  // Holographic Gyroscopes around the CPU
  const gyroMat1 = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.0,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
  const gyroRing1 = new THREE.Mesh(new THREE.RingGeometry(1.42, 1.45, 64), gyroMat1);
  gyroRing1.rotation.x = -Math.PI / 2;
  gyroRing1.position.y = 0.19;
  cpuGroup.add(gyroRing1);

  const gyroMat2 = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    transparent: true,
    opacity: 0.0,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
  const gyroRing2 = new THREE.Mesh(new THREE.RingGeometry(1.62, 1.65, 64), gyroMat2);
  gyroRing2.rotation.x = -Math.PI / 2;
  gyroRing2.position.y = 0.2;
  cpuGroup.add(gyroRing2);

  // Corner Reticle Brackets
  const bracketMat = new THREE.LineBasicMaterial({
    color: 0x00f0ff,
    linewidth: 2,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
  });
  const bSize = 0.35;
  const bDist = 1.15;
  const bCoords = [
    -bDist, 0, bDist - bSize, -bDist, 0, bDist, -bDist, 0, bDist, -bDist + bSize, 0, bDist,
    bDist - bSize, 0, bDist, bDist, 0, bDist, bDist, 0, bDist, bDist, 0, bDist - bSize,
    -bDist, 0, -bDist + bSize, -bDist, 0, -bDist, -bDist, 0, -bDist, -bDist + bSize, 0, -bDist,
    bDist - bSize, 0, -bDist, bDist, 0, -bDist, bDist, 0, -bDist, bDist, 0, -bDist + bSize,
  ];
  const bGeo = new THREE.BufferGeometry();
  bGeo.setAttribute('position', new THREE.Float32BufferAttribute(bCoords, 3));
  const brackets = new THREE.LineSegments(bGeo, bracketMat);
  brackets.position.y = 0.21;
  cpuGroup.add(brackets);

  // Micro-bus data packets pulsing out from CPU
  const packetCount = 28;
  const packetGeo = new THREE.BufferGeometry();
  const packetPos = new Float32Array(packetCount * 3);
  const packetAngles = [];
  const packetSpeeds = [];
  for (let p = 0; p < packetCount; p++) {
    const angle = (p / packetCount) * Math.PI * 2;
    packetAngles.push(angle);
    packetSpeeds.push(0.8 + Math.random() * 1.4);
    packetPos[p * 3] = Math.cos(angle) * 1.1;
    packetPos[p * 3 + 1] = 0.12;
    packetPos[p * 3 + 2] = Math.sin(angle) * 1.1;
  }
  packetGeo.setAttribute('position', new THREE.BufferAttribute(packetPos, 3));
  const packetMat = new THREE.PointsMaterial({
    size: 0.18,
    map: glowTexture,
    transparent: true,
    opacity: 0.0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const dataPackets = new THREE.Points(packetGeo, packetMat);
  cpuGroup.add(dataPackets);

  // ==========================================================================
  // CONTINUOUS CINEMATIC SCROLL & ZOOM INERTIA ENGINE
  // ==========================================================================
  const state = {
    mouseNormX: 0,
    mouseNormY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    camX: 0,
    camY: 2.5,
    camZ: 11.5,
    lookX: 0,
    lookY: 1.4,
    lookZ: 0,
    rigRotX: 0.16,
    rigRotY: -0.22,
    rigRotZ: 0.0,
  };

  window.addEventListener('mousemove', (e) => {
    state.targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    state.targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Hide procedural backup once GLB is loaded
    if (isGlbLoaded && backupGroup.visible) {
      backupGroup.visible = false;
    }

    // Mouse coordinates damping
    state.mouseNormX += (state.targetMouseX - state.mouseNormX) * 0.06;
    state.mouseNormY += (state.targetMouseY - state.mouseNormY) * 0.06;

    // Scroll progress (0 to 1)
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;

    // Cubic easing curve
    const easeProgress = progress * progress * (3 - 2 * progress);

    // Camera trajectory
    const targetCamX = state.mouseNormX * 0.5 * (1 - easeProgress * 0.85);
    const targetCamY = THREE.MathUtils.lerp(2.5, 1.75, easeProgress) + state.mouseNormY * 0.2 * (1 - easeProgress * 0.7);
    const targetCamZ = THREE.MathUtils.lerp(11.5, -0.6, easeProgress);

    // Camera LookAt tracks smoothly from screen center to CPU die
    const targetLookX = 0;
    const targetLookY = THREE.MathUtils.lerp(1.4, 0.18, easeProgress);
    const targetLookZ = THREE.MathUtils.lerp(0, -0.6, easeProgress);

    // Rotation levels to 0 on deep zoom
    const targetRotX = THREE.MathUtils.lerp(0.16, 0.0, easeProgress) - state.mouseNormY * 0.06 * (1 - easeProgress);
    const targetRotY = THREE.MathUtils.lerp(-0.22, 0.0, easeProgress) + state.mouseNormX * 0.1 * (1 - easeProgress);
    const targetRotZ = 0.0;

    // Inertia damping
    state.camX += (targetCamX - state.camX) * 0.065;
    state.camY += (targetCamY - state.camY) * 0.065;
    state.camZ += (targetCamZ - state.camZ) * 0.065;

    state.lookX += (targetLookX - state.lookX) * 0.065;
    state.lookY += (targetLookY - state.lookY) * 0.065;
    state.lookZ += (targetLookZ - state.lookZ) * 0.065;

    state.rigRotX += (targetRotX - state.rigRotX) * 0.065;
    state.rigRotY += (targetRotY - state.rigRotY) * 0.065;
    state.rigRotZ += (targetRotZ - state.rigRotZ) * 0.065;

    camera.position.set(state.camX, state.camY, state.camZ);
    camera.lookAt(state.lookX, state.lookY, state.lookZ);

    masterRig.rotation.set(state.rigRotX, state.rigRotY, state.rigRotZ);

    // X-RAY TEARDOWN TRANSITION:
    let extOpacity = 1.0;
    let intOpacity = 0.0;

    if (progress < 0.22) {
      extOpacity = 1.0;
      intOpacity = 0.0;
    } else if (progress <= 0.58) {
      const dissolveT = (progress - 0.22) / 0.36;
      extOpacity = Math.max(0, 1.0 - dissolveT);
      intOpacity = Math.min(1, dissolveT);
    } else {
      extOpacity = 0.0;
      intOpacity = 1.0;
    }

    // Apply opacity to GLB materials
    glbMaterials.forEach((mat) => {
      mat.opacity = extOpacity;
    });

    // Apply opacity to procedural backup
    procBaseMat.opacity = extOpacity;
    procDisplay.material.opacity = extOpacity;

    // Apply interior opacity
    mbMat.opacity = intOpacity;
    pipeMat.opacity = 0.75 * intOpacity;
    traceMat.opacity = 0.5 * intOpacity;
    socketMat.opacity = intOpacity;
    pinMat.opacity = 0.85 * intOpacity;
    ihsMat.opacity = intOpacity;
    rimMat.opacity = 0.9 * intOpacity;
    logoMat.opacity = 0.98 * intOpacity;
    gyroMat1.opacity = 0.55 * intOpacity;
    gyroMat2.opacity = 0.45 * intOpacity;
    bracketMat.opacity = 0.85 * intOpacity;
    packetMat.opacity = 0.85 * intOpacity;

    fanItems.forEach(({ ring, rotor, bMat }) => {
      ring.material.opacity = 0.65 * intOpacity;
      bMat.opacity = 0.75 * intOpacity;
      rotor.rotation.y = elapsed * 4.5;
    });

    // Holographic Gyroscopes rotation
    gyroRing1.rotation.z = elapsed * 0.6;
    gyroRing2.rotation.z = -elapsed * 0.45;

    // Laser corner brackets pulse
    const bPulse = 1 + Math.sin(elapsed * 2.5) * 0.035;
    brackets.scale.set(bPulse, 1, bPulse);

    // Dedicated Processor Spotlight intensifies when zoomed in
    cpuSpotLight.intensity = 1.5 + intOpacity * 4.5;
    cpuSpotLight.position.set(
      Math.sin(elapsed * 1.5) * 0.35,
      THREE.MathUtils.lerp(3.2, 1.8, easeProgress),
      -0.6 + Math.cos(elapsed * 1.5) * 0.35
    );

    // Data packets streaming outward along logic board traces
    const packetPositions = dataPackets.geometry.attributes.position.array;
    for (let p = 0; p < packetCount; p++) {
      const pIdx = p * 3;
      const angle = packetAngles[p];
      const speed = packetSpeeds[p];
      const dist = 1.0 + ((elapsed * speed + p * 0.25) % 2.0);
      packetPositions[pIdx] = Math.cos(angle) * dist;
      packetPositions[pIdx + 2] = Math.sin(angle) * dist;
    }
    dataPackets.geometry.attributes.position.needsUpdate = true;

    // Ambient starfield warp stream motion
    starField.rotation.y = elapsed * 0.012;
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3 + 2;
      starPos[i3] += 0.22 + (progress * 0.45);
      if (starPos[i3] > 15) {
        starPos[i3] = -45;
      }
    }
    starGeo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  requestAnimationFrame(animate);
}
function initInteractiveAtomScene() {
  const canvas = document.getElementById('interactive-atom-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / 480, 0.1, 100);
  camera.position.set(0, 0, 10.5);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
  } catch (err) {
    console.warn('Atom WebGL initialization failed:', err);
    return;
  }

  function resizeCanvas() {
    const parent = canvas.parentElement;
    const width = (parent && parent.clientWidth > 0) ? parent.clientWidth : (canvas.clientWidth > 0 ? canvas.clientWidth : (window.innerWidth || 800));
    const height = width < 640 ? Math.min(380, Math.max(260, Math.round(width * 0.8))) : 480;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  }
  resizeCanvas();
  setTimeout(resizeCanvas, 100);
  setTimeout(resizeCanvas, 300);
  setTimeout(resizeCanvas, 800);
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('orientationchange', () => {
    setTimeout(resizeCanvas, 150);
  });

  // Ambient & Core Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  // Atom Main Container Group (Rotated on Drag / Inertia)
  const atomGroup = new THREE.Group();
  scene.add(atomGroup);

  // 1. NUCLEUS (CENTRAL PLASMA CORE)
  const nucleusGroup = new THREE.Group();

  const coreLight = new THREE.PointLight(0xffd700, 3, 25);
  nucleusGroup.add(coreLight);

  // Central Core Plasma Sphere (Luminous Gold Core)
  const coreGeo = new THREE.SphereGeometry(0.72, 32, 32);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    transparent: true,
    opacity: 0.92,
  });
  const coreSphere = new THREE.Mesh(coreGeo, coreMat);
  nucleusGroup.add(coreSphere);

  // Corona Wireframe Shell (Golden Geometric Cage)
  const coronaGeo = new THREE.IcosahedronGeometry(1.02, 2);
  const coronaMat = new THREE.MeshBasicMaterial({
    color: 0xfde047,
    wireframe: true,
    transparent: true,
    opacity: 0.45,
  });
  const coronaSphere = new THREE.Mesh(coronaGeo, coronaMat);
  nucleusGroup.add(coronaSphere);

  // 12 Nucleons (Protons & Neutrons - Gold, Amber, White, Bronze)
  const nucleons = [];
  const nucleonColors = [0xffd700, 0xf59e0b, 0xffffff, 0xfde047];
  for (let i = 0; i < 12; i++) {
    const phi = Math.acos(-1 + (2 * i) / 12);
    const theta = Math.sqrt(12 * Math.PI) * phi;
    const r = 0.62;
    const nGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const nMat = new THREE.MeshBasicMaterial({
      color: nucleonColors[i % nucleonColors.length],
    });
    const nMesh = new THREE.Mesh(nGeo, nMat);
    const nx = r * Math.sin(phi) * Math.cos(theta);
    const ny = r * Math.sin(phi) * Math.sin(theta);
    const nz = r * Math.cos(phi);
    nMesh.position.set(nx, ny, nz);
    nucleusGroup.add(nMesh);
    nucleons.push({
      mesh: nMesh,
      basePos: new THREE.Vector3(nx, ny, nz),
      offset: i * 0.7,
    });
  }
  atomGroup.add(nucleusGroup);

  // Quantum Pulse Burst Ring Mesh (Gold Shockwave)
  const burstGeo = new THREE.RingGeometry(0.1, 0.25, 64);
  const burstMat = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
  });
  const burstMesh = new THREE.Mesh(burstGeo, burstMat);
  atomGroup.add(burstMesh);

  // ==========================================================================
  // MODE 1: BOHR SHELLS & ORBITAL ELECTRONS (bohrGroup)
  // ==========================================================================
  const bohrGroup = new THREE.Group();
  atomGroup.add(bohrGroup);

  const shellConfigs = [
    { a: 3.4, b: 2.0, rot: [Math.PI / 3, 0, Math.PI / 8], color: 0xffd700, speed: 2.0, count: 2, label: 'K' },
    { a: 3.8, b: 2.3, rot: [-Math.PI / 3, Math.PI / 3.8, -Math.PI / 5], color: 0xf59e0b, speed: 1.6, count: 2, label: 'L' },
    { a: 4.2, b: 2.6, rot: [Math.PI / 5, -Math.PI / 2.8, Math.PI / 3.2], color: 0xfde047, speed: 1.3, count: 3, label: 'M' },
    { a: 4.6, b: 2.9, rot: [-Math.PI / 4.2, -Math.PI / 3.5, -Math.PI / 2.2], color: 0xffffff, speed: 1.0, count: 3, label: 'N' },
  ];

  const electrons = [];

  shellConfigs.forEach((cfg) => {
    // Generate 3D Elliptical Orbit Path
    const curve = new THREE.EllipseCurve(0, 0, cfg.a, cfg.b, 0, 2 * Math.PI, false, 0);
    const pts2D = curve.getPoints(120);
    const pts3D = pts2D.map((p) => new THREE.Vector3(p.x, p.y, 0));
    const ringGeo = new THREE.BufferGeometry().setFromPoints(pts3D);
    const ringMat = new THREE.LineBasicMaterial({
      color: cfg.color,
      transparent: true,
      opacity: 0.8,
    });
    const ringLine = new THREE.Line(ringGeo, ringMat);
    ringLine.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);
    bohrGroup.add(ringLine);

    // Orbiting Electrons on this Shell
    for (let eIdx = 0; eIdx < cfg.count; eIdx++) {
      const eGeo = new THREE.SphereGeometry(0.15, 16, 16);
      const eMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const eMesh = new THREE.Mesh(eGeo, eMat);

      // Glowing Halo around Electron
      const haloGeo = new THREE.SphereGeometry(0.28, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.55,
      });
      const eHalo = new THREE.Mesh(haloGeo, haloMat);
      eMesh.add(eHalo);

      // 4 Kinetic Fading Trail Spheres
      const trails = [];
      for (let t = 0; t < 4; t++) {
        const tMesh = new THREE.Mesh(
          new THREE.SphereGeometry(Math.max(0.04, 0.1 - t * 0.02), 12, 12),
          new THREE.MeshBasicMaterial({
            color: cfg.color,
            transparent: true,
            opacity: 0.55 - t * 0.12,
          })
        );
        bohrGroup.add(tMesh);
        trails.push(tMesh);
      }

      bohrGroup.add(eMesh);
      electrons.push({
        mesh: eMesh,
        shell: cfg,
        phase: (eIdx / cfg.count) * Math.PI * 2,
        history: [],
        trails: trails,
      });
    }
  });

  // ==========================================================================
  // MODE 2: SCHRÖDINGER QUANTUM PROBABILITY CLOUD (cloudGroup)
  // ==========================================================================
  const cloudCount = 1800;
  const cloudGeo = new THREE.BufferGeometry();
  const cloudPositions = new Float32Array(cloudCount * 3);
  const cloudBasePos = new Float32Array(cloudCount * 3);
  const cloudBaseDist = new Float32Array(cloudCount);
  const cloudColors = new Float32Array(cloudCount * 3);

  for (let i = 0; i < cloudCount; i++) {
    const i3 = i * 3;
    const u1 = Math.random();
    const u2 = Math.random();
    const r = Math.sqrt(-2.0 * Math.log(u1 + 0.0001)) * 1.7 + 0.8;
    const theta = 2.0 * Math.PI * u2;
    const phi = Math.acos(2.0 * Math.random() - 1.0);

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    cloudPositions[i3] = x;
    cloudPositions[i3 + 1] = y;
    cloudPositions[i3 + 2] = z;

    cloudBasePos[i3] = x;
    cloudBasePos[i3 + 1] = y;
    cloudBasePos[i3 + 2] = z;
    cloudBaseDist[i] = r;

    // Color gradient: Radiant Gold core to Amber & White outer cloud
    const t = Math.min(1, r / 4.5);
    cloudColors[i3] = 1.0 * (1 - t) + 0.96 * t;
    cloudColors[i3 + 1] = 0.84 * (1 - t) + 0.62 * t;
    cloudColors[i3 + 2] = 0.0 * (1 - t) + 0.4 * t;
  }

  cloudGeo.setAttribute('position', new THREE.BufferAttribute(cloudPositions, 3));
  cloudGeo.setAttribute('color', new THREE.BufferAttribute(cloudColors, 3));

  const cloudMat = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    transparent: true,
    opacity: 0.88,
    blending: THREE.AdditiveBlending,
  });
  const cloudGroup = new THREE.Points(cloudGeo, cloudMat);
  cloudGroup.visible = false;
  atomGroup.add(cloudGroup);

  // ==========================================================================
  // MODE 3: RELATIVISTIC PLASMA FUSION VORTEX (vortexGroup)
  // ==========================================================================
  const vortexCount = 2400;
  const vortexGeo = new THREE.BufferGeometry();
  const vortexPositions = new Float32Array(vortexCount * 3);
  const vortexTheta = new Float32Array(vortexCount);
  const vortexZ = new Float32Array(vortexCount);
  const vortexArm = new Float32Array(vortexCount);
  const vortexColors = new Float32Array(vortexCount * 3);

  for (let i = 0; i < vortexCount; i++) {
    const i3 = i * 3;
    const arm = i % 2;
    const z = (Math.random() * 8) - 4;
    const theta = (z * 1.8) + (arm * Math.PI) + (Math.random() * 0.35);
    const r = 0.45 + Math.abs(z) * 0.72 + (Math.random() * 0.25);

    vortexTheta[i] = theta;
    vortexZ[i] = z;
    vortexArm[i] = arm;

    vortexPositions[i3] = r * Math.cos(theta);
    vortexPositions[i3 + 1] = r * Math.sin(theta);
    vortexPositions[i3 + 2] = z;

    // Gold and Amber Arms
    const armColor = arm === 0 ? [1.0, 0.84, 0.0] : [0.96, 0.62, 0.04];
    vortexColors[i3] = armColor[0];
    vortexColors[i3 + 1] = armColor[1];
    vortexColors[i3 + 2] = armColor[2];
  }

  vortexGeo.setAttribute('position', new THREE.BufferAttribute(vortexPositions, 3));
  vortexGeo.setAttribute('color', new THREE.BufferAttribute(vortexColors, 3));

  const vortexMat = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    transparent: true,
    opacity: 0.92,
    blending: THREE.AdditiveBlending,
  });
  const vortexGroup = new THREE.Points(vortexGeo, vortexMat);
  vortexGroup.visible = false;
  atomGroup.add(vortexGroup);

  // ==========================================================================
  // MODE 4: GLOBAL EDGE CLOUD GLOBE (globeGroup)
  // ==========================================================================
  const globeGroup = new THREE.Group();
  atomGroup.add(globeGroup);
  globeGroup.visible = false;

  const globeMesh = new THREE.Mesh(
    new THREE.SphereGeometry(2.35, 26, 22),
    new THREE.MeshBasicMaterial({ color: 0xffd700, wireframe: true, transparent: true, opacity: 0.25 })
  );
  globeGroup.add(globeMesh);

  const innerAtm = new THREE.Mesh(
    new THREE.SphereGeometry(2.2, 24, 20),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.12 })
  );
  globeGroup.add(innerAtm);

  function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -(radius * Math.sin(phi) * Math.cos(theta)),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  const majorCities = [
    [37.77, -122.41], [40.71, -74.00], [51.50, -0.12], [50.11, 8.68],
    [19.07, 72.87], [28.61, 77.20], [1.35, 103.81], [35.67, 139.65],
    [-33.86, 151.20], [25.20, 55.27]
  ];

  const globeNodes = [];
  majorCities.forEach((city, idx) => {
    const pos = latLonToVector3(city[0], city[1], 2.37);
    const nodeMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    nodeMesh.position.copy(pos);
    globeGroup.add(nodeMesh);

    const ringMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.12, 0.18, 20),
      new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
    );
    ringMesh.position.copy(pos);
    ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
    globeGroup.add(ringMesh);

    globeNodes.push({ mesh: nodeMesh, ring: ringMesh, phase: idx * 0.7 });
  });

  // Connecting Data Arcs
  const arcCurves = [
    [latLonToVector3(37.77, -122.41, 2.37), latLonToVector3(51.50, -0.12, 2.37)],
    [latLonToVector3(51.50, -0.12, 2.37), latLonToVector3(19.07, 72.87, 2.37)],
    [latLonToVector3(19.07, 72.87, 2.37), latLonToVector3(1.35, 103.81, 2.37)],
    [latLonToVector3(1.35, 103.81, 2.37), latLonToVector3(35.67, 139.65, 2.37)],
    [latLonToVector3(35.67, 139.65, 2.37), latLonToVector3(37.77, -122.41, 2.37)],
    [latLonToVector3(51.50, -0.12, 2.37), latLonToVector3(25.20, 55.27, 2.37)],
  ];

  arcCurves.forEach(pts => {
    const mid = pts[0].clone().add(pts[1]).multiplyScalar(0.5).normalize().multiplyScalar(3.1);
    const curve = new THREE.QuadraticBezierCurve3(pts[0], mid, pts[1]);
    const arcGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(36));
    const arcLine = new THREE.Line(arcGeo, new THREE.LineBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.7 }));
    globeGroup.add(arcLine);
  });

  const satelliteRing = new THREE.Group();
  satelliteRing.rotation.x = Math.PI / 4;
  for (let s = 0; s < 3; s++) {
    const sat = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.09, 0.2),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    const satAngle = (s / 3) * Math.PI * 2;
    sat.position.set(Math.cos(satAngle) * 3.3, Math.sin(satAngle) * 3.3, 0);
    satelliteRing.add(sat);
  }
  globeGroup.add(satelliteRing);

  // ==========================================================================
  // MODE 5: CYBER PRISM CRYSTAL MATRIX (prismGroup)
  // ==========================================================================
  const prismGroup = new THREE.Group();
  atomGroup.add(prismGroup);
  prismGroup.visible = false;

  const prismMesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.1, 0),
    new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.38, wireframe: false, depthWrite: false })
  );
  prismGroup.add(prismMesh);

  const wireMesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.14, 0),
    new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.75 })
  );
  prismGroup.add(wireMesh);

  const cubeMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 1.2, 1.2),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true, transparent: true, opacity: 0.85 })
  );
  prismGroup.add(cubeMesh);

  const gemCore = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.68, 0),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })
  );
  prismGroup.add(gemCore);

  const shards = [];
  for (let i = 0; i < 8; i++) {
    const shardMesh = new THREE.Mesh(
      new THREE.TetrahedronGeometry(0.22, 0),
      new THREE.MeshBasicMaterial({ color: 0xfde047, wireframe: true, transparent: true, opacity: 0.85 })
    );
    prismGroup.add(shardMesh);
    shards.push({ mesh: shardMesh, r: 3.1 + (i % 2) * 0.4, offset: (i / 8) * Math.PI * 2 });
  }

  // ==========================================================================
  // MODE 6: NEURAL AI SYNAPSE NETWORK (neuralGroup)
  // ==========================================================================
  const neuralGroup = new THREE.Group();
  atomGroup.add(neuralGroup);
  neuralGroup.visible = false;

  const neuralNodesGroup = new THREE.Group();
  neuralGroup.add(neuralNodesGroup);

  const nodeCount = 42;
  const nodePositions = [];
  for (let i = 0; i < nodeCount; i++) {
    const r = 1.0 + Math.random() * 1.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const p = new THREE.Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );
    nodePositions.push(p);

    const nMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 12, 12),
      new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? 0xffffff : 0xffd700 })
    );
    nMesh.position.copy(p);
    neuralNodesGroup.add(nMesh);
  }

  const synapseLines = [];
  const pulsePairs = [];
  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      const d = nodePositions[i].distanceTo(nodePositions[j]);
      if (d < 1.45) {
        synapseLines.push(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z);
        synapseLines.push(nodePositions[j].x, nodePositions[j].y, nodePositions[j].z);
        if (pulsePairs.length < 14) {
          pulsePairs.push({ from: nodePositions[i], to: nodePositions[j] });
        }
      }
    }
  }

  const synapseGeo = new THREE.BufferGeometry();
  synapseGeo.setAttribute('position', new THREE.Float32BufferAttribute(synapseLines, 3));
  const synapsesLine = new THREE.LineSegments(
    synapseGeo,
    new THREE.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.45 })
  );
  neuralGroup.add(synapsesLine);

  const synapsePulses = [];
  pulsePairs.forEach((pair, idx) => {
    const pulseMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    neuralGroup.add(pulseMesh);
    synapsePulses.push({
      mesh: pulseMesh,
      from: pair.from,
      to: pair.to,
      progress: (idx / pulsePairs.length),
    });
  });

  // 4. AMBIENT FIELD PARTICLES (GOLD QUANTUM DUST)
  const dustCount = 350;
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount * 3; i += 3) {
    dustPos[i] = (Math.random() - 0.5) * 22;
    dustPos[i + 1] = (Math.random() - 0.5) * 22;
    dustPos[i + 2] = (Math.random() - 0.5) * 22;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    size: 0.1,
    color: 0xffd700,
    transparent: true,
    opacity: 0.6,
  });
  const dustField = new THREE.Points(dustGeo, dustMat);
  atomGroup.add(dustField);

  // 5. MOUSE DRAG & TOUCH 3D ROTATION CONTROLS
  let isDragging = false;
  let prevMouseX = 0;
  let prevMouseY = 0;
  let velX = 0;
  let velY = 0;

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
    velX = 0;
    velY = 0;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - prevMouseX;
    const deltaY = e.clientY - prevMouseY;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;

    velY = deltaX * 0.006;
    velX = deltaY * 0.006;

    atomGroup.rotation.y += velY;
    atomGroup.rotation.x += velX;
  });

  // Touch Support for Mobile
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
      velX = 0;
      velY = 0;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - prevMouseX;
    const deltaY = e.touches[0].clientY - prevMouseY;
    prevMouseX = e.touches[0].clientX;
    prevMouseY = e.touches[0].clientY;

    atomGroup.rotation.y += deltaX * 0.008;
    atomGroup.rotation.x += deltaY * 0.008;
  }, { passive: true });

  // 6. MASTER ANIMATION LOOP
  const clock = new THREE.Clock();

  function animateAtom() {
    requestAnimationFrame(animateAtom);
    const elapsed = clock.getElapsedTime();

    // Inertia Momentum Rotation
    if (!isDragging) {
      velX *= 0.94;
      velY *= 0.94;
      atomGroup.rotation.x += velX;
      atomGroup.rotation.y += velY;
      atomGroup.rotation.y += 0.006 * interactiveAtomState.speed;
    }

    // Central Nucleus Pulsation
    const pulse = 1 + Math.sin(elapsed * 4.5) * 0.07;
    coreSphere.scale.set(pulse, pulse, pulse);
    coronaSphere.rotation.y = elapsed * 0.4;
    coronaSphere.rotation.x = elapsed * 0.25;

    // Nucleon Micro-vibrations
    nucleons.forEach((n) => {
      const vib = 1 + Math.sin(elapsed * 7 + n.offset) * 0.06;
      n.mesh.position.set(
        n.basePos.x * vib,
        n.basePos.y * vib,
        n.basePos.z * vib
      );
    });

    // Quantum Pulse Burst Expansion
    if (interactiveAtomState.burstActive) {
      interactiveAtomState.burstScale += 0.28;
      interactiveAtomState.burstOpacity -= 0.024;
      burstMesh.scale.set(interactiveAtomState.burstScale, interactiveAtomState.burstScale, 1);
      burstMat.opacity = Math.max(0, interactiveAtomState.burstOpacity);
      burstMesh.rotation.z += 0.05;

      if (interactiveAtomState.burstOpacity <= 0) {
        interactiveAtomState.burstActive = false;
        burstMat.opacity = 0;
      }
    }

    const dir = interactiveAtomState.isReverse ? -1 : 1;

    // 5-IN-1 MODE EXECUTION LOGIC
    if (interactiveAtomState.mode === 'bohr') {
      nucleusGroup.visible = true;
      bohrGroup.visible = true;
      cloudGroup.visible = false;
      vortexGroup.visible = false;
      globeGroup.visible = false;
      prismGroup.visible = false;
      neuralGroup.visible = false;

      electrons.forEach((el) => {
        const t = (elapsed * el.shell.speed * interactiveAtomState.speed * dir) + el.phase;
        const localX = el.shell.a * Math.cos(t);
        const localY = el.shell.b * Math.sin(t);
        const pos = new THREE.Vector3(localX, localY, 0);

        const euler = new THREE.Euler(el.shell.rot[0], el.shell.rot[1], el.shell.rot[2]);
        pos.applyEuler(euler);

        el.mesh.position.copy(pos);

        el.history.unshift(pos.clone());
        if (el.history.length > 16) el.history.pop();

        el.trails.forEach((tr, idx) => {
          const histPos = el.history[(idx + 1) * 3] || pos;
          tr.position.copy(histPos);
        });
      });
    } else if (interactiveAtomState.mode === 'cloud') {
      nucleusGroup.visible = true;
      bohrGroup.visible = false;
      cloudGroup.visible = true;
      vortexGroup.visible = false;
      globeGroup.visible = false;
      prismGroup.visible = false;
      neuralGroup.visible = false;

      const cPos = cloudGeo.attributes.position.array;
      for (let i = 0; i < cloudCount; i++) {
        const i3 = i * 3;
        const r = cloudBaseDist[i];
        const wave = Math.sin(elapsed * 3.5 * interactiveAtomState.speed + r * 2.2) * 0.12;
        cPos[i3] = cloudBasePos[i3] * (1 + wave);
        cPos[i3 + 1] = cloudBasePos[i3 + 1] * (1 + wave);
        cPos[i3 + 2] = cloudBasePos[i3 + 2] * (1 + wave);
      }
      cloudGeo.attributes.position.needsUpdate = true;
      cloudGroup.rotation.y = elapsed * 0.25 * interactiveAtomState.speed;
      cloudGroup.rotation.x = elapsed * 0.18 * interactiveAtomState.speed;
    } else if (interactiveAtomState.mode === 'vortex') {
      nucleusGroup.visible = false;
      bohrGroup.visible = false;
      cloudGroup.visible = false;
      vortexGroup.visible = true;
      globeGroup.visible = false;
      prismGroup.visible = false;
      neuralGroup.visible = false;

      const vPos = vortexGeo.attributes.position.array;
      for (let i = 0; i < vortexCount; i++) {
        const i3 = i * 3;
        const arm = vortexArm[i];
        let z = vortexZ[i] - (elapsed * 1.6 * interactiveAtomState.speed * dir);
        z = ((((z + 4) % 8) + 8) % 8) - 4;
        const theta = (z * 1.8) + (arm * Math.PI) + (elapsed * 2.5 * interactiveAtomState.speed * dir);
        const r = 0.45 + Math.abs(z) * 0.72;

        vPos[i3] = r * Math.cos(theta);
        vPos[i3 + 1] = r * Math.sin(theta);
        vPos[i3 + 2] = z;
      }
      vortexGeo.attributes.position.needsUpdate = true;
      vortexGroup.rotation.z = elapsed * 0.4 * interactiveAtomState.speed;
    } else if (interactiveAtomState.mode === 'globe') {
      nucleusGroup.visible = false;
      bohrGroup.visible = false;
      cloudGroup.visible = false;
      vortexGroup.visible = false;
      globeGroup.visible = true;
      prismGroup.visible = false;
      neuralGroup.visible = false;

      globeGroup.rotation.y += 0.008 * interactiveAtomState.speed * dir;
      satelliteRing.rotation.z += 0.015 * interactiveAtomState.speed * dir;
      globeNodes.forEach(node => {
        const s = 1 + Math.sin(elapsed * 4 + node.phase) * 0.25;
        node.ring.scale.set(s, s, s);
      });
    } else if (interactiveAtomState.mode === 'prism') {
      nucleusGroup.visible = false;
      bohrGroup.visible = false;
      cloudGroup.visible = false;
      vortexGroup.visible = false;
      globeGroup.visible = false;
      prismGroup.visible = true;
      neuralGroup.visible = false;

      prismMesh.rotation.y += 0.007 * interactiveAtomState.speed * dir;
      prismMesh.rotation.x += 0.005 * interactiveAtomState.speed * dir;
      wireMesh.rotation.copy(prismMesh.rotation);

      cubeMesh.rotation.x -= 0.016 * interactiveAtomState.speed * dir;
      cubeMesh.rotation.y += 0.013 * interactiveAtomState.speed * dir;
      gemCore.scale.setScalar(1 + Math.sin(elapsed * 5) * 0.15);

      shards.forEach((shard) => {
        const angle = elapsed * 0.8 * interactiveAtomState.speed * dir + shard.offset;
        shard.mesh.position.set(Math.cos(angle) * shard.r, Math.sin(angle * 0.7) * 1.2, Math.sin(angle) * shard.r);
        shard.mesh.rotation.x += 0.03;
        shard.mesh.rotation.y += 0.02;
      });
    } else if (interactiveAtomState.mode === 'neural') {
      nucleusGroup.visible = false;
      bohrGroup.visible = false;
      cloudGroup.visible = false;
      vortexGroup.visible = false;
      globeGroup.visible = false;
      prismGroup.visible = false;
      neuralGroup.visible = true;

      neuralGroup.rotation.y += 0.006 * interactiveAtomState.speed * dir;
      neuralGroup.rotation.z = Math.sin(elapsed * 0.5) * 0.15;

      const breathe = 1 + Math.sin(elapsed * 2.2) * 0.04;
      neuralNodesGroup.scale.set(breathe, breathe, breathe);
      synapsesLine.scale.set(breathe, breathe, breathe);

      synapsePulses.forEach((pulse) => {
        pulse.progress += 0.025 * interactiveAtomState.speed * dir;
        if (pulse.progress > 1) pulse.progress = 0;
        if (pulse.progress < 0) pulse.progress = 1;
        pulse.mesh.position.lerpVectors(pulse.from, pulse.to, pulse.progress);
      });
    }

    // Ambient dust drift
    dustField.rotation.y = elapsed * 0.03;

    renderer.render(scene, camera);
  }

  requestAnimationFrame(animateAtom);
}

// ==========================================================================
// 19. ATOM INTERACTIVE CONTROLS & TELEMETRY DISPATCH
// ==========================================================================
function setAtomSpeed(multiplier, btnElement) {
  interactiveAtomState.speed = multiplier;
  playCyberClick();

  document.querySelectorAll('.atom-speed-btn').forEach((btn) => {
    btn.className = 'atom-speed-btn px-3 py-1.5 rounded-xl border border-amber-500/20 text-slate-300 hover:text-white hover:border-amber-400 text-xs font-mono transition-all';
  });

  if (btnElement) {
    btnElement.className = 'atom-speed-btn atom-btn-active px-3 py-1.5 rounded-xl border border-amber-500/50 text-xs font-mono transition-all font-bold';
  }

  const speedVal = document.getElementById('atom-telemetry-speed');
  const stateVal = document.getElementById('atom-telemetry-state');
  if (speedVal) {
    speedVal.innerText = `${Math.round(2187 * multiplier).toLocaleString()} km/s`;
  }
  if (stateVal) {
    stateVal.innerText = multiplier > 4 ? 'QUANTUM WARP' : multiplier > 2 ? 'HYPER-ORBIT' : 'SUPERCONDUCTING';
    stateVal.className = multiplier > 4 ? 'text-yellow-300 font-mono font-bold animate-pulse' : 'text-amber-400 font-mono font-bold';
  }
}

function triggerQuantumBurst() {
  interactiveAtomState.burstActive = true;
  interactiveAtomState.burstScale = 0.2;
  interactiveAtomState.burstOpacity = 0.95;
  playCyberChirp(600, 2200, 0.08);

  showWebsiteToast('Quantum Superposition Pulse Triggered! 3D frequency synced.', 'success');
}

function toggleAtomReverse() {
  interactiveAtomState.isReverse = !interactiveAtomState.isReverse;
  playCyberClick();
}

// ==========================================================================
// 20. 3D QUANTUM ATOM MODE SWITCHER (BOHR, CLOUD, VORTEX, GLOBE, PRISM, NEURAL)
// ==========================================================================
function switchAtomMode(mode, btnElement) {
  interactiveAtomState.mode = mode;
  playCyberClick();

  document.querySelectorAll('.atom-mode-btn').forEach((b) => {
    b.className = 'atom-mode-btn px-3 py-1.5 rounded-xl border border-amber-500/20 text-slate-300 hover:text-white hover:border-amber-400 text-xs font-mono transition-all';
  });
  if (btnElement) {
    btnElement.className = 'atom-mode-btn atom-btn-active px-3 py-1.5 rounded-xl border border-amber-500/50 text-xs font-mono transition-all font-bold';
  }

  const speedVal = document.getElementById('atom-telemetry-speed');
  const stateVal = document.getElementById('atom-telemetry-state');
  const topTitle = document.getElementById('atom-stage-title');

  if (mode === 'bohr') {
    if (speedVal) speedVal.innerText = `${Math.round(2187 * interactiveAtomState.speed).toLocaleString()} km/s`;
    if (stateVal) {
      stateVal.innerText = 'BOHR ATOMIC ORBITALS';
      stateVal.className = 'text-amber-400 font-mono font-bold';
    }
    if (topTitle) topTitle.innerText = 'BITNEXA 3D QUANTUM ATOM CORE • RUTHERFORD-BOHR v3.0';
    showWebsiteToast('Loaded Bohr Atomic Orbital 3D Model', 'info');
  } else if (mode === 'globe') {
    if (speedVal) speedVal.innerText = '310+ Edge PoP Nodes';
    if (stateVal) {
      stateVal.innerText = 'GLOBAL CLOUDFLARE EDGE';
      stateVal.className = 'text-amber-300 font-mono font-bold';
    }
    if (topTitle) topTitle.innerText = 'BITNEXA 3D GLOBAL EDGE NETWORK • DISTRIBUTED CLOUD';
    showWebsiteToast('Loaded Global Cloud Edge 3D Globe', 'info');
  } else if (mode === 'prism') {
    if (speedVal) speedVal.innerText = '1.54 Refractive Index';
    if (stateVal) {
      stateVal.innerText = 'HOLOGRAPHIC SPECULAR MATRIX';
      stateVal.className = 'text-yellow-300 font-mono font-bold';
    }
    if (topTitle) topTitle.innerText = 'BITNEXA 3D CYBER PRISM • SPECULAR CRYSTAL MATRIX';
    showWebsiteToast('Loaded Cyber Prism Crystal 3D Model', 'info');
  } else if (mode === 'neural') {
    if (speedVal) speedVal.innerText = '1,024 GigaFLOPs';
    if (stateVal) {
      stateVal.innerText = 'NEURAL AI INFERENCE CORE';
      stateVal.className = 'text-amber-400 font-mono font-bold animate-pulse';
    }
    if (topTitle) topTitle.innerText = 'BITNEXA 3D NEURAL AI CORE • SYNAPSE MAPPING';
    showWebsiteToast('Loaded Neural AI Network 3D Model', 'info');
  } else if (mode === 'vortex') {
    if (speedVal) speedVal.innerText = `${Math.round(7450 * interactiveAtomState.speed).toLocaleString()} km/s`;
    if (stateVal) {
      stateVal.innerText = 'RELATIVISTIC PLASMA VORTEX';
      stateVal.className = 'text-amber-300 font-mono font-bold animate-pulse';
    }
    if (topTitle) topTitle.innerText = 'BITNEXA 3D PLASMA FUSION VORTEX • QUANTUM ACCELERATOR';
    showWebsiteToast('Loaded Relativistic Plasma Fusion Vortex', 'info');
  }
}

// ==========================================================================
// 21. KINETIC STAGGERED TEXT SPLIT REVEAL
// ==========================================================================
function initSplitRevealText() {
  const targets = document.querySelectorAll('.split-reveal-text');
  targets.forEach((el) => {
    const rawText = el.getAttribute('data-text') || el.innerText.trim();
    if (!rawText) return;

    const words = rawText.split(' ');
    el.innerHTML = words.map((word) => {
      const letters = word.split('').map((char, cIdx) => `
        <span class="split-reveal-line">
          <span class="split-char" style="transition-delay: ${cIdx * 25}ms">${char}</span>
        </span>
      `).join('');
      return `<span class="inline-block whitespace-nowrap mr-2">${letters}</span>`;
    }).join('');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('split-reveal-active');
      }
    });
  }, { threshold: 0.15 });

  targets.forEach((el) => observer.observe(el));
}

// ==========================================================================
// 22. HORIZONTAL PROJECT TRACK SLIDER & VIEW SWITCHER
// ==========================================================================
let currentProjectView = 'grid';

function switchProjectView(view) {
  currentProjectView = view;
  playCyberClick();

  const gridContainer = document.getElementById('portfolio-grid');
  const sliderContainer = document.getElementById('portfolio-slider-container');
  const gridBtn = document.getElementById('view-mode-grid');
  const sliderBtn = document.getElementById('view-mode-slider');

  if (view === 'grid') {
    if (gridContainer) gridContainer.classList.remove('hidden');
    if (sliderContainer) sliderContainer.classList.add('hidden');
    if (gridBtn) {
      gridBtn.className = 'px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-cyan-400 text-black shadow-[0_0_12px_rgba(0,240,255,0.4)] transition-all';
    }
    if (sliderBtn) {
      sliderBtn.className = 'px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white transition-all';
    }
  } else {
    if (gridContainer) gridContainer.classList.add('hidden');
    if (sliderContainer) sliderContainer.classList.remove('hidden');
    if (gridBtn) {
      gridBtn.className = 'px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white transition-all';
    }
    if (sliderBtn) {
      sliderBtn.className = 'px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-cyan-400 text-black shadow-[0_0_12px_rgba(0,240,255,0.4)] transition-all';
    }
    renderSliderTrack();
  }
}

function renderSliderTrack() {
  const track = document.getElementById('portfolio-horizontal-track');
  if (!track) return;

  const currentLang = localStorage.getItem('bitnexa_lang') || 'en';

  track.innerHTML = portfolioProjects.map((p) => `
    <div class="circuit-card horizontal-slide-card p-6 flex flex-col justify-between group">
      <div class="relative z-10">
        <div class="flex items-center justify-between gap-3 mb-4">
          <span class="text-3xl">${p.icon}</span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${p.categoryClass}">
            ${p.categoryBadge}
          </span>
        </div>

        <h3 class="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
          ${p.title}
        </h3>

        <p class="text-slate-300 text-xs mt-3 leading-relaxed">
          ${p.description}
        </p>

        <div class="mt-4 p-3 rounded-xl bg-void-950/90 border border-cyan-500/20 text-[11px] text-cyan-300 font-mono">
          ${p.metrics}
        </div>

        <div class="mt-4 flex flex-wrap gap-1.5">
          ${p.techStack.map((t) => `
            <span class="text-[10px] px-2 py-0.5 rounded-lg bg-void-900 border border-white/5 text-slate-300 font-medium">
              ${t}
            </span>
          `).join('')}
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-2 relative z-10">
        <button onclick="openDevicePreview(${p.id})" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-bold font-mono transition-all">
          <span>🔍 3D Preview</span>
        </button>
        <button onclick="requestProjectQuote('${escapeHtml(p.title)}')" class="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-white transition-all">
          <span>Build This Project</span> &rarr;
        </button>
      </div>
    </div>
  `).join('');

  init3DCardTilt();
}

function scrollProjectTrack(dir) {
  const track = document.getElementById('portfolio-horizontal-track');
  if (!track) return;

  const cardWidth = 444;
  track.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
  playCyberClick();

  setTimeout(() => {
    const idx = Math.round(track.scrollLeft / cardWidth) + 1;
    const counter = document.getElementById('slider-current-index');
    if (counter) counter.innerText = Math.max(1, Math.min(8, idx));
  }, 250);
}

// ==========================================================================
// 23. 3D INTERACTIVE DEVICE PREVIEW MODAL (MACBOOK PRO & IPHONE 16 PRO)
// ==========================================================================
let currentPreviewProjectId = 1;
let currentPreviewDevice = 'laptop';

function openDevicePreview(projectId) {
  const project = portfolioProjects.find((p) => p.id === projectId) || portfolioProjects[0];
  currentPreviewProjectId = project.id;

  const modal = document.getElementById('device-preview-modal');
  const title = document.getElementById('preview-modal-title');
  const metrics = document.getElementById('preview-modal-metrics');
  if (title) title.innerText = project.title;
  if (metrics) metrics.innerText = project.metrics;

  renderDeviceScreen(project, currentPreviewDevice);

  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  playCyberChirp(400, 1200, 0.08);
}

function closeDevicePreview() {
  const modal = document.getElementById('device-preview-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
  playCyberClick();
}

function setPreviewDevice(device) {
  currentPreviewDevice = device;
  playCyberClick();

  const laptopBtn = document.getElementById('dev-btn-laptop');
  const phoneBtn = document.getElementById('dev-btn-phone');

  if (device === 'laptop') {
    if (laptopBtn) laptopBtn.className = 'px-3 py-1.5 rounded-lg lang-btn-active';
    if (phoneBtn) phoneBtn.className = 'px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all';
  } else {
    if (laptopBtn) laptopBtn.className = 'px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all';
    if (phoneBtn) phoneBtn.className = 'px-3 py-1.5 rounded-lg lang-btn-active';
  }

  const project = portfolioProjects.find((p) => p.id === currentPreviewProjectId) || portfolioProjects[0];
  renderDeviceScreen(project, device);
}

function renderDeviceScreen(project, device) {
  const container = document.getElementById('device-screen-container');
  if (!container) return;

  if (device === 'laptop') {
    container.innerHTML = `
      <div class="w-full max-w-2xl mx-auto transition-all duration-500">
        <!-- Laptop Top Lid -->
        <div class="device-frame-laptop p-3.5 space-y-2">
          <!-- Browser Top Window Bar -->
          <div class="flex items-center justify-between pb-2 border-b border-white/10 text-[10px] font-mono">
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
            </div>
            <div class="px-4 py-0.5 rounded-md bg-void-950 border border-cyan-500/25 text-cyan-300 flex items-center gap-1">
              <span>🔒 https://preview.bitnexa.tech/projects/${project.category}/${project.id}</span>
            </div>
            <div class="text-slate-400">99.8% Perf</div>
          </div>

          <!-- Screen UI Content Mockup -->
          <div class="bg-void-950 rounded-xl p-4 sm:p-6 space-y-4 border border-white/5 min-h-[220px]">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-2xl">${project.icon}</span>
                <span class="font-cyber font-bold text-white text-sm tracking-wider">${project.title.split('–')[0]}</span>
              </div>
              <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">LIVE CLOUD</span>
            </div>

            <p class="text-slate-300 text-xs leading-relaxed">
              ${project.description}
            </p>

            <!-- Interactive UI Simulation Tiles -->
            <div class="grid grid-cols-3 gap-2.5 pt-2">
              <div class="p-2.5 rounded-lg bg-void-900 border border-cyan-500/20 text-center space-y-1">
                <span class="text-[10px] text-slate-400 font-mono">Latency</span>
                <div class="text-cyan-400 font-mono font-bold text-xs">12 ms</div>
              </div>
              <div class="p-2.5 rounded-lg bg-void-900 border border-cyan-500/20 text-center space-y-1">
                <span class="text-[10px] text-slate-400 font-mono">Status</span>
                <div class="text-emerald-400 font-mono font-bold text-xs">200 OK</div>
              </div>
              <div class="p-2.5 rounded-lg bg-void-900 border border-cyan-500/20 text-center space-y-1">
                <span class="text-[10px] text-slate-400 font-mono">SSL Tier</span>
                <div class="text-purple-400 font-mono font-bold text-xs">TLS 1.3</div>
              </div>
            </div>

            <div class="flex flex-wrap gap-1.5 pt-1">
              ${project.techStack.map((t) => `<span class="text-[9px] font-mono px-2 py-0.5 rounded bg-void-900 border border-white/10 text-cyan-300">${t}</span>`).join('')}
            </div>
          </div>
        </div>

        <!-- Laptop Bottom Keyboard Base -->
        <div class="device-laptop-base flex items-center justify-center">
          <div class="device-laptop-notch"></div>
        </div>
      </div>
    `;
  } else {
    // Phone view
    container.innerHTML = `
      <div class="device-frame-phone p-4 space-y-3 transition-all duration-500">
        <!-- Dynamic Island -->
        <div class="phone-dynamic-island">
          <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span class="text-[8px] font-mono text-cyan-300">BITNEXA</span>
          <span class="w-2 h-2 rounded-full bg-slate-800"></span>
        </div>

        <!-- Phone Top Status Bar -->
        <div class="pt-6 flex items-center justify-between text-[10px] font-mono text-slate-400 px-2">
          <span>9:41</span>
          <div class="flex items-center gap-1.5">
            <span>5G</span>
            <span>100% 🔋</span>
          </div>
        </div>

        <!-- Screen Content for Phone -->
        <div class="bg-void-950 rounded-2xl p-4 space-y-3 border border-white/5 min-h-[260px]">
          <div class="flex items-center gap-2 pb-2 border-b border-white/10">
            <span class="text-xl">${project.icon}</span>
            <div class="text-xs font-bold text-white leading-tight">${project.title.split('–')[0]}</div>
          </div>

          <p class="text-slate-300 text-[11px] leading-relaxed">
            ${project.description}
          </p>

          <div class="p-2.5 rounded-xl bg-void-900 border border-cyan-500/20 text-[10px] text-cyan-300 font-mono">
            ${project.metrics}
          </div>

          <div class="flex flex-wrap gap-1 pt-1">
            ${project.techStack.map((t) => `<span class="text-[8px] font-mono px-1.5 py-0.5 rounded bg-void-900 border border-white/10 text-slate-300">${t}</span>`).join('')}
          </div>

          <button onclick="requestProjectQuote('${escapeHtml(project.title)}')" class="w-full py-2.5 rounded-xl btn-neon-primary text-white text-[10px] font-bold font-mono">
            Inquire About This Project &rarr;
          </button>
        </div>
      </div>
    `;
  }
}

// ==========================================================================
// 24. MULTI-LANGUAGE ENGINE (EN & HI) & REACTIVE DICTIONARY
// ==========================================================================
const i18n = {
  en: {
    nav_services: "Services",
    nav_projects: "Showcase Work",
    nav_atom: "⚛️ 3D Atom Core",
    nav_why: "Why Choose Us",
    nav_pricing: "Packages & Pricing",
    nav_founders: "Founders",
    nav_faqs: "FAQs",
    nav_email: "✉️ Email Us",
    nav_proposal: "Get Free Proposal →",
    hero_badge: "NOW ACCEPTING NEW CLIENT PROJECTS // INDIA & GLOBAL",
    hero_tagline: "CODE BEYOND LIMITS",
    hero_h1_1: "We Build High-Speed",
    hero_h1_2: "Websites, Cloud & Viral Media",
    hero_sub: "Bitnexa Technologies is your dedicated tech & creative growth partner. From custom modern web development and bulletproof Node.js backends to 24/7 Custom Domain live deployments, custom domains, and viral Instagram Reels editing.",
    hero_cta_proposal: "Start Your Project (Free Quote) →",
    hero_cta_portfolio: "⚡ Explore Showcase Work",
    hero_pill_turnaround: "⚡ 7–14 Days Fast Turnaround",
    hero_pill_ssl: "🔒 Free SSL & High-Speed CDN",
    hero_pill_support: "👥 Direct Aryan & Virendra Support",
    services_subtitle: "What We Do Best",
    services_title: "Full-Stack Digital & Creative Services",
    services_desc: "We don't just build websites; we engineer revenue-generating digital assets for your brand.",
    projects_subtitle: "Our Work Portfolio",
    projects_title: "Proof of Work: What We Build",
    projects_desc: "Explore live production builds, e-commerce engines, real estate portals, and viral media created by Bitnexa Technologies.",
    filter_all: "All Projects (8)",
    filter_web: "💻 Web & Apps",
    filter_cloud: "🚀 Cloud & Domains",
    filter_media: "🎬 Reels & Marketing",
    view_grid: "⊞ Grid View",
    view_slider: "↔ Horizontal Track",
    btn_build_similar: "Build Similar",
    atom_badge: "⚛️ QUANTUM ARCHITECTURE // 3D ATOM CORE",
    atom_title: "The Atomic Engine of Bitnexa",
    atom_desc: "Drag to rotate, accelerate electron velocity, and experience our real-time 3D Quantum Atom model. We engineer digital products with the mathematical precision of atomic orbital physics.",
    atom_model_label: "Quantum Model:",
    atom_mode_bohr: "⚛️ Bohr Shells",
    atom_mode_cloud: "🌌 Quantum Cloud",
    atom_mode_vortex: "🌀 Fusion Vortex",
    atom_speed_label: "Orbital Speed:",
    atom_btn_burst: "💥 Pulse Burst",
    atom_btn_reverse: "🔄 Reverse",
    why_subtitle: "Why Bitnexa?",
    why_title: "Why Businesses Trust Bitnexa Technologies",
    why_desc: "We combine high-level technical mastery with transparent communication and rapid delivery.",
    packages_subtitle: "Transparent Packages",
    packages_title: "Affordable Agency Packages in ₹ INR",
    packages_desc: "Choose the tier that matches your current goal, or talk to us for a custom package.",
    founders_subtitle: "Leadership & Ownership",
    founders_title: "Meet the Founders",
    founders_desc: "Direct access to the technical and creative minds steering Bitnexa Technologies.",
    faqs_subtitle: "Common Questions",
    faqs_title: "Frequently Asked Questions",
    device_modal_badge: "3D INTERACTIVE DEVICE SIMULATOR",
  }
};
i18n.hi = i18n.en;

function setLanguage(lang = 'en', announce = false) {
  const dictionary = i18n.en;
  localStorage.setItem('bitnexa_lang', 'en');

  // Update all [data-i18n] text nodes
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dictionary[key]) {
      el.innerHTML = dictionary[key];
    }
  });

  // Re-render sliders and active views with updated language
  if (currentProjectView === 'slider') {
    renderSliderTrack();
  }

  if (announce) {
    playCyberClick();
    showWebsiteToast('Language set to English', 'success');
  }
}

// ==========================================================================
// 19. THREEUI WARP FIELD BACKGROUND INTEGRATION (<WarpFieldBackground />)
// ==========================================================================
let sectionWarpInstance = null;
const sectionWarpOptions = {
  variant: 'streaks',
  speed: 15.0,
  streakOpacity: 0.60,
  tileOpacity: 0.90,
  fov: 75,
  hue: 0,
  saturation: 1.00,
  brightness: 1.00,
};

function initWarpFieldSection() {
  const host = document.getElementById('warp-field-section-host');
  if (!host || typeof window.mountWarpFieldBackground === 'undefined') return;

  if (sectionWarpInstance) {
    sectionWarpInstance.destroy();
  }

  sectionWarpInstance = window.mountWarpFieldBackground(host, sectionWarpOptions);

  // Live FPS counter
  let lastTime = performance.now();
  let frameCount = 0;
  const fpsEl = document.getElementById('section-warp-fps');

  function trackSectionWarpFPS() {
    frameCount++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      if (fpsEl) fpsEl.textContent = frameCount + ' FPS';
      frameCount = 0;
      lastTime = now;
    }
    requestAnimationFrame(trackSectionWarpFPS);
  }
  requestAnimationFrame(trackSectionWarpFPS);
}

function setSectionWarpVariant(variant) {
  sectionWarpOptions.variant = variant;
  const variantEl = document.getElementById('section-warp-variant');
  if (variantEl) variantEl.textContent = variant;

  ['streaks', 'letters', 'keycaps', 'hyperspace'].forEach((v) => {
    const btn = document.getElementById('sec-btn-' + v);
    if (!btn) return;
    if (v === variant) {
      btn.className = 'px-3 py-1 rounded-lg border border-emerald-400 bg-emerald-500/25 text-emerald-200 font-bold transition-all shadow-[0_0_10px_rgba(16,185,129,0.3)]';
    } else {
      btn.className = 'px-3 py-1 rounded-lg border border-white/10 hover:border-emerald-500/40 text-slate-300 hover:text-white transition-all';
    }
  });

  initWarpFieldSection();
}

window.initWarpFieldSection = initWarpFieldSection;
window.setSectionWarpVariant = setSectionWarpVariant;

// ==========================================================================
// 26. MOBILE NAVIGATION DRAWER & TOUCH OPTIMIZATIONS (iOS & Android)
// ==========================================================================
window.toggleMobileMenu = function() {
  const drawer = document.getElementById('mobile-nav-drawer');
  const hamIcon = document.getElementById('mobile-hamburger-icon');
  const closeIcon = document.getElementById('mobile-close-icon');
  if (!drawer) return;
  const isHidden = drawer.classList.contains('hidden');
  if (isHidden) {
    drawer.classList.remove('hidden');
    if (hamIcon) hamIcon.classList.add('hidden');
    if (closeIcon) closeIcon.classList.remove('hidden');
  } else {
    drawer.classList.add('hidden');
    if (hamIcon) hamIcon.classList.remove('hidden');
    if (closeIcon) closeIcon.classList.add('hidden');
  }
};

window.closeMobileMenu = function() {
  const drawer = document.getElementById('mobile-nav-drawer');
  const hamIcon = document.getElementById('mobile-hamburger-icon');
  const closeIcon = document.getElementById('mobile-close-icon');
  if (drawer && !drawer.classList.contains('hidden')) {
    drawer.classList.add('hidden');
    if (hamIcon) hamIcon.classList.remove('hidden');
    if (closeIcon) closeIcon.classList.add('hidden');
  }
};

// Close mobile menu on Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.closeMobileMenu();
    if (typeof window.closeInquiryModal === 'function') window.closeInquiryModal();
  }
});

// Close mobile menu when resizing up to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth >= 1024) {
    window.closeMobileMenu();
  }
});

// ==========================================================================
// 24. PROJECT SCOPE & INVESTMENT CALCULATOR (EXECUTIVE EDITION)
// ==========================================================================
window.selectedQuoteItems = [
  { title: 'High-Performance Modern Website', price: 14999 },
  { title: '24/7 Custom Domain Live Hosting & SSL', price: 4999 }
];

window.toggleQuoteItem = function (itemEl, title, price) {
  if (!window.selectedQuoteItems) window.selectedQuoteItems = [];
  const index = window.selectedQuoteItems.findIndex(i => i.title === title);
  if (index > -1) {
    window.selectedQuoteItems.splice(index, 1);
    itemEl.classList.remove('selected');
    const box = itemEl.querySelector('.quote-check-icon');
    if (box) box.innerText = '⬜';
  } else {
    window.selectedQuoteItems.push({ title, price });
    itemEl.classList.add('selected');
    const box = itemEl.querySelector('.quote-check-icon');
    if (box) box.innerText = '✅';
  }
  window.calculateQuoteTotal();
};

window.calculateQuoteTotal = function () {
  const totalEl = document.getElementById('quote-total-price');
  const itemsCountEl = document.getElementById('quote-items-count');
  if (!totalEl || !itemsCountEl) return;
  const total = (window.selectedQuoteItems || []).reduce((sum, item) => sum + item.price, 0);
  totalEl.innerText = `₹${total.toLocaleString('en-IN')}`;
  itemsCountEl.innerText = `${window.selectedQuoteItems.length} DELIVERABLES SELECTED`;
};

window.launchQuoteProposal = function () {
  const count = (window.selectedQuoteItems || []).length;
  const total = (window.selectedQuoteItems || []).reduce((sum, item) => sum + item.price, 0);
  const titles = (window.selectedQuoteItems || []).map(i => i.title).join(', ');
  const serviceName = `Custom Project: ${count} Deliverables [${titles}] (₹${total.toLocaleString('en-IN')})`;

  if (window.openInquiryModal) {
    window.openInquiryModal(serviceName);
  }
};

// Auto-run calculator on init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.calculateQuoteTotal());
} else {
  setTimeout(() => window.calculateQuoteTotal(), 100);
}

