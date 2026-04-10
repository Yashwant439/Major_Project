// ============================================
// WanderLust — Main Script
// ============================================

// ── Bootstrap Form Validation ──
(() => {
  'use strict';
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
})();

// ── Dark Mode ──
const toggleBtn = document.getElementById('darkModeToggle');
const body = document.body;
const icon = toggleBtn?.querySelector('i');

if (localStorage.getItem('darkMode') === 'enabled') {
  enableDarkMode();
}

function enableDarkMode() {
  body.classList.add('dark-mode');
  localStorage.setItem('darkMode', 'enabled');
  if (icon) {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  }
}

function disableDarkMode() {
  body.classList.remove('dark-mode');
  localStorage.setItem('darkMode', 'disabled');
  if (icon) {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  }
}

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    body.classList.contains('dark-mode') ? disableDarkMode() : enableDarkMode();
  });
}

// ── Navbar Scroll Effect ──
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  if (window.scrollY > 10) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ── Close User Menu on Outside Click ──
document.addEventListener('click', (e) => {
  const menu = document.getElementById('userMenu');
  if (menu && !menu.contains(e.target)) {
    menu.classList.remove('open');
  }
});

// ── Scroll Reveal Animation (Intersection Observer) ──
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  // Observe cards for scroll animation
  document.querySelectorAll('.listing-card, .review-card, .stat-card, .dashboard-section').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Lazy load images
  const images = document.querySelectorAll('img[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          imgObserver.unobserve(img);
        }
      });
    });
    images.forEach(img => imgObserver.observe(img));
  }
});

// ── Button Ripple Effect ──
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;
  const ripple = document.createElement('span');
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.3);
    width: ${size}px;
    height: ${size}px;
    left: ${e.clientX - rect.left - size/2}px;
    top: ${e.clientY - rect.top - size/2}px;
    transform: scale(0);
    animation: ripple-anim 0.6s ease-out;
    pointer-events: none;
  `;
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});

// Add ripple keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-anim {
    to { transform: scale(2.5); opacity: 0; }
  }
`;
document.head.appendChild(style);