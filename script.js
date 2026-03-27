// ==================== HEADER SCROLL ====================
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// ==================== HAMBURGER TOGGLE ====================
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
});

// Close mobile nav on link click
document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
  });
});

// ==================== ACTIVE NAV LINK ON SCROLL ====================
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

// ==================== SCROLL ANIMATIONS ====================
function initFadeIn() {
  const elements = document.querySelectorAll(
    '.about-text, .glow-card, .timeline-item, .skill-card, .edu-card, .contact-info, .contact-form'
  );
  elements.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}
initFadeIn();

// ==================== ANIMATED COUNTERS ====================
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.dataset.target;
        let current = 0;
        const step = Math.max(1, Math.floor(target / 40));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current;
        }, 30);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}
animateCounters();

// ==================== PARTICLES ====================
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = Math.random() * 100 + '%';
    p.style.top = 40 + Math.random() * 60 + '%';
    p.style.animationDelay = Math.random() * 6 + 's';
    p.style.animationDuration = 4 + Math.random() * 4 + 's';
    container.appendChild(p);
  }
}
createParticles();

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

  // Build mailto link and open it
  const mailtoSubject = encodeURIComponent(subject);
  const mailtoBody = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
  window.location.href = `mailto:mitrakermanian1989@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

  formStatus.textContent = 'Opening your email client...';
  formStatus.style.color = '#22c55e';

  form.reset();
});

// ==================== SMOOTH SCROLL FOR ALL ANCHORS ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
