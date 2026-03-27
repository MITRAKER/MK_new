// ==================== LOADER ====================
const loader = document.getElementById('loader');
document.body.classList.add('loading');

window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.classList.remove('loading');
    startHeroAnimations();
  }, 2200);
});

// ==================== GLOBAL MOUSE STATE ====================
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let smoothMouseX = mouseX;
let smoothMouseY = mouseY;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// ==================== CUSTOM CURSOR GLOW ====================
const cursorGlow = document.getElementById('cursorGlow');
let glowX = mouseX, glowY = mouseY;

document.addEventListener('mousemove', () => {
  cursorGlow.classList.add('active');
});
document.addEventListener('mouseleave', () => {
  cursorGlow.classList.remove('active');
});

// ==================== 3D HERO SCENE TILT ====================
const heroScene = document.getElementById('heroScene');
const heroOrb = document.getElementById('heroOrb');
const hero = document.getElementById('hero');

// Smooth interpolation values for the 3D tilt
let tiltX = 0, tiltY = 0;
let targetTiltX = 0, targetTiltY = 0;

// Parallax layer offsets (smoothed)
let layerOffsets = {};

function updateHero3D() {
  if (!hero) return;

  const rect = hero.getBoundingClientRect();
  // Only apply 3D if hero is visible
  if (rect.bottom < 0 || rect.top > window.innerHeight) return;

  // Normalise mouse position to -1...1 relative to viewport center
  const nx = (mouseX / window.innerWidth - 0.5) * 2;
  const ny = (mouseY / window.innerHeight - 0.5) * 2;

  // Target rotation angles (degrees) — subtle like the reference
  targetTiltX = -ny * 4;  // Rotate around X axis based on Y position
  targetTiltY = nx * 6;   // Rotate around Y axis based on X position

  // Smooth interpolation (lerp) for cinematic feel
  tiltX += (targetTiltX - tiltX) * 0.04;
  tiltY += (targetTiltY - tiltY) * 0.04;

  // Apply 3D rotation to the entire scene
  if (heroScene) {
    heroScene.style.transform =
      `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0)`;
  }

  // Parallax each [data-depth] layer at different speeds
  const depthElements = hero.querySelectorAll('[data-depth]');
  depthElements.forEach(el => {
    const depth = parseFloat(el.dataset.depth);
    const moveX = nx * depth * 80;
    const moveY = ny * depth * 50;

    // Store smooth values per element
    const id = el.className;
    if (!layerOffsets[id]) layerOffsets[id] = { x: 0, y: 0 };
    layerOffsets[id].x += (moveX - layerOffsets[id].x) * 0.05;
    layerOffsets[id].y += (moveY - layerOffsets[id].y) * 0.05;

    // Don't override orb's special transform
    if (el === heroOrb) return;

    el.style.transform = `translate(${layerOffsets[id].x}px, ${layerOffsets[id].y}px)`;
  });

  // Orb gets special treatment — moves more dramatically + scales
  if (heroOrb) {
    const orbDepth = 0.06;
    const orbId = 'hero-orb';
    if (!layerOffsets[orbId]) layerOffsets[orbId] = { x: 0, y: 0 };

    const orbMoveX = nx * orbDepth * 120;
    const orbMoveY = ny * orbDepth * 80;
    layerOffsets[orbId].x += (orbMoveX - layerOffsets[orbId].x) * 0.03;
    layerOffsets[orbId].y += (orbMoveY - layerOffsets[orbId].y) * 0.03;

    const orbScale = 1 + Math.abs(nx * ny) * 0.15;

    heroOrb.style.transform =
      `translate(calc(-50% + ${layerOffsets[orbId].x}px), calc(-50% + ${layerOffsets[orbId].y}px)) scale(${orbScale}) translateZ(20px)`;
  }
}

// ==================== MASTER ANIMATION LOOP ====================
function masterLoop() {
  // Smooth mouse for cursor glow
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top = glowY + 'px';

  // Smooth global mouse
  smoothMouseX += (mouseX - smoothMouseX) * 0.05;
  smoothMouseY += (mouseY - smoothMouseY) * 0.05;

  // 3D hero scene
  updateHero3D();

  requestAnimationFrame(masterLoop);
}
masterLoop();

// ==================== HEADER ====================
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// ==================== HAMBURGER ====================
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
  });
});

// ==================== ACTIVE NAV ON SCROLL ====================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const hbnLinks = document.querySelectorAll('.hbn-link');

function updateActiveNav() {
  const scrollY = window.scrollY + 200;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(l => l.classList.remove('active'));
      hbnLinks.forEach(l => l.classList.remove('active'));
      document.querySelectorAll(`.nav-link[href="#${id}"]`).forEach(l => l.classList.add('active'));
      document.querySelectorAll(`.hbn-link[href="#${id}"]`).forEach(l => l.classList.add('active'));
    }
  });
}
window.addEventListener('scroll', updateActiveNav);

// ==================== HERO ANIMATIONS (3D word reveal) ====================
function startHeroAnimations() {
  header.classList.add('visible');

  const heroElements = [
    { sel: '.hero-tag', delay: 200 },
    { sel: '.anim-word', delay: 400, stagger: 180 },
    { sel: '.hero-desc', delay: 1200 },
    { sel: '.btn-hero', delay: 1400 },
    { sel: '.scroll-hint', delay: 1600 },
    { sel: '.hero-bottom-nav', delay: 1700 },
  ];

  heroElements.forEach(({ sel, delay, stagger }) => {
    const elements = document.querySelectorAll(sel);
    elements.forEach((el, i) => {
      const d = delay + (stagger ? i * stagger : 0);
      setTimeout(() => el.classList.add('show'), d);
    });
  });
}

// ==================== HERO CANVAS (PARTICLE NETWORK) ====================
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class CanvasParticle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.4 + 0.1;
    this.fadeDir = Math.random() > 0.5 ? 1 : -1;
    this.fadeSpeed = Math.random() * 0.003 + 0.001;
    this.baseSize = this.size;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity += this.fadeDir * this.fadeSpeed;
    if (this.opacity > 0.5) this.fadeDir = -1;
    if (this.opacity < 0.05) this.fadeDir = 1;

    // Mouse attraction with distance falloff
    const dx = smoothMouseX - this.x;
    const dy = smoothMouseY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 250) {
      const force = (1 - dist / 250) * 0.008;
      this.x += dx * force;
      this.y += dy * force;
      // Grow near cursor
      this.size = this.baseSize + (1 - dist / 250) * 2;
    } else {
      this.size += (this.baseSize - this.size) * 0.05;
    }

    if (this.x < -10 || this.x > canvas.width + 10 || this.y < -10 || this.y > canvas.height + 10) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(34, 197, 94, ${this.opacity})`;
    ctx.fill();
  }
}

const canvasParticles = [];
for (let i = 0; i < 100; i++) {
  canvasParticles.push(new CanvasParticle());
}

function drawConnections() {
  for (let i = 0; i < canvasParticles.length; i++) {
    for (let j = i + 1; j < canvasParticles.length; j++) {
      const dx = canvasParticles[i].x - canvasParticles[j].x;
      const dy = canvasParticles[i].y - canvasParticles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        ctx.beginPath();
        ctx.moveTo(canvasParticles[i].x, canvasParticles[i].y);
        ctx.lineTo(canvasParticles[j].x, canvasParticles[j].y);
        ctx.strokeStyle = `rgba(34, 197, 94, ${0.08 * (1 - dist / 140)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }

  // Draw connections from cursor to nearby particles
  for (let i = 0; i < canvasParticles.length; i++) {
    const dx = smoothMouseX - canvasParticles[i].x;
    const dy = smoothMouseY - canvasParticles[i].y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 200) {
      ctx.beginPath();
      ctx.moveTo(smoothMouseX, smoothMouseY);
      ctx.lineTo(canvasParticles[i].x, canvasParticles[i].y);
      ctx.strokeStyle = `rgba(34, 197, 94, ${0.15 * (1 - dist / 200)})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvasParticles.forEach(p => {
    p.update();
    p.draw();
  });
  drawConnections();
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

// ==================== DOM PARTICLES ====================
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.classList.add('particle', 'float');
    p.style.width = (Math.random() * 3 + 1) + 'px';
    p.style.height = p.style.width;
    p.style.left = Math.random() * 100 + '%';
    p.style.top = 50 + Math.random() * 50 + '%';
    p.style.setProperty('--delay', Math.random() * 6 + 's');
    p.style.setProperty('--duration', (4 + Math.random() * 5) + 's');
    container.appendChild(p);
  }

  for (let i = 0; i < 15; i++) {
    const p = document.createElement('div');
    p.classList.add('particle', 'drift');
    p.style.width = (Math.random() * 2 + 1) + 'px';
    p.style.height = p.style.width;
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.setProperty('--delay', Math.random() * 8 + 's');
    p.style.setProperty('--duration', (8 + Math.random() * 6) + 's');
    p.style.setProperty('--dx', (Math.random() * 200 - 100) + 'px');
    p.style.setProperty('--dy', (Math.random() * -300 - 50) + 'px');
    container.appendChild(p);
  }
}
createParticles();

// ==================== SCROLL REVEAL ====================
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
}
initScrollReveal();

// ==================== ANIMATED COUNTERS ====================
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.dataset.target;
        let current = 0;
        const duration = 1500;
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = target / steps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.round(current);
        }, stepTime);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}
animateCounters();

// ==================== 3D TILT EFFECT ON ALL CARDS ====================
document.querySelectorAll('.tilt-card').forEach(card => {
  // Add shine overlay element
  const shine = document.createElement('div');
  shine.classList.add('tilt-shine');
  card.appendChild(shine);

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const cx = x - 0.5;
    const cy = y - 0.5;

    // 3D rotation
    card.style.transform =
      `perspective(800px) rotateY(${cx * 12}deg) rotateX(${-cy * 12}deg) translateZ(10px) scale(1.02)`;

    // Move shine
    shine.style.setProperty('--shine-x', `${x * 100}%`);
    shine.style.setProperty('--shine-y', `${y * 100}%`);
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    setTimeout(() => { card.style.transition = ''; }, 600);
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'none';
  });
});

// ==================== CONTACT FORM ====================
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !subject || !message) {
    formStatus.textContent = 'Please fill in all fields.';
    formStatus.style.color = '#ef4444';
    return;
  }

  const mailtoSubject = encodeURIComponent(subject);
  const mailtoBody = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
  window.location.href = `mailto:mitrakermanian1989@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

  formStatus.textContent = 'Opening your email client...';
  formStatus.style.color = '#22c55e';
  form.reset();
});

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ==================== PARALLAX ON SCROLL ====================
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (heroOrb) {
    heroOrb.style.marginTop = scrollY * 0.25 + 'px';
  }

  // Fade hero scene slightly on scroll for depth
  if (heroScene) {
    const opacity = Math.max(0, 1 - scrollY / (window.innerHeight * 0.8));
    heroScene.style.opacity = opacity;
  }
});
