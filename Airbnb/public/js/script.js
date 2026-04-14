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

// ── Navbar Scroll Effect & Reveal ──
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  const currentScroll = window.scrollY;
  
  if (currentScroll > 10) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
}, { passive: true });

// ── User Menu Toggle ──
const closeUserMenu = () => {
  const menu = document.getElementById('userMenu');
  const menuBtn = document.getElementById('userMenuBtn');
  if (menu) menu.classList.remove('open');
  if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
};

document.addEventListener('DOMContentLoaded', () => {
  const menu = document.getElementById('userMenu');
  const menuBtn = document.getElementById('userMenuBtn');
  if (!menu || !menuBtn) return;

  menuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const opened = menu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(opened));
  });
});

document.addEventListener('click', (e) => {
  const menu = document.getElementById('userMenu');
  if (menu && !menu.contains(e.target)) {
    closeUserMenu();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeUserMenu();
  }
});

// ── Professional Toast Notifications ──
function showToast(message, type = 'success', duration = 3000) {
  const container = document.querySelector('.toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast-msg toast-${type}`;
  
  const icons = {
    success: '<i class="fas fa-check-circle toast-icon"></i>',
    error: '<i class="fas fa-exclamation-circle toast-icon"></i>',
    info: '<i class="fas fa-info-circle toast-icon"></i>'
  };
  
  toast.innerHTML = `
    ${icons[type] || icons.info}
    <span>${message}</span>
    <button class="toast-close" onclick="this.parentElement.classList.add('toast-exit'); setTimeout(() => this.parentElement.remove(), 300)">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

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

// ── Enhanced Button Ripple Effect ──
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn, .btn-primary, .btn-success, .book-now-btn');
  if (!btn) return;
  
  const ripple = document.createElement('span');
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.4);
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

// ── Add ripple keyframes ──
if (!document.querySelector('style[data-ripple]')) {
  const style = document.createElement('style');
  style.setAttribute('data-ripple', 'true');
  style.textContent = `
    @keyframes ripple-anim {
      to { 
        transform: scale(2.5); 
        opacity: 0; 
      }
    }
  `;
  document.head.appendChild(style);
}

// ── Flash Message Auto-Dismiss ──
document.addEventListener('DOMContentLoaded', () => {
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.style.animation = 'fadeOut 0.3s ease-out forwards';
      setTimeout(() => alert.remove(), 300);
    }, 4000);
  });
});

// ── Smooth Scroll ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ── Add fade out animation ──
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-10px); }
  }
`;
document.head.appendChild(style);
