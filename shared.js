/* ============================================
   NOVACENTER - SHARED JAVASCRIPT
   EmailJS, Mobile Nav, Scroll Reveal, Forms, FAQ
   ============================================ */

const EMAILJS_CONFIG = {
  publicKey: '-sn2KH_DP9ds5ry_1',
  serviceId: 'YOUR_SERVICE_ID',
  templateId: 'YOUR_TEMPLATE_ID'
};

(function() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.publicKey);
  }
})();

document.addEventListener('DOMContentLoaded', function() {
  initMobileNav();
  initScrollReveal();
  initBackToTop();
  initAccordion();
  initFormValidation();
  initHeaderScroll();
  initStarRating();
});

function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', function() {
    this.classList.toggle('active');
    mobileNav.classList.toggle('active');
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !expanded);
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));
}

function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initAccordion() {
  const questions = document.querySelectorAll('.faq-question');
  questions.forEach(q => {
    q.addEventListener('click', () => {
      const answer = q.nextElementSibling;
      const isActive = q.classList.contains('active');

      questions.forEach(q2 => {
        q2.classList.remove('active');
        q2.nextElementSibling.style.maxHeight = '0';
      });

      if (!isActive) {
        q.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#e74c3c';
        } else {
          field.style.borderColor = '';
        }
      });
      if (!valid) {
        e.preventDefault();
        showToast('Vui lòng điền đầy đủ thông tin');
      }
    });
  });
}

function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 100) {
      header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
      header.style.boxShadow = '';
    }
    lastScroll = currentScroll;
  });
}

function initStarRating() {
  document.querySelectorAll('.star-rating').forEach(group => {
    const buttons = group.querySelectorAll('button');
    const input = group.querySelector('input[type="hidden"]');
    if (!buttons.length || !input) return;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.value;
        input.value = val;
        buttons.forEach(b => {
          b.style.color = b.dataset.value <= val ? '#ff6f00' : '#ccc';
        });
      });
    });
  });
}

function showToast(message) {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#1a237e;color:#fff;padding:14px 28px;border-radius:8px;z-index:10000;box-shadow:0 4px 20px rgba(0,0,0,0.2);animation:fadeInUp 0.3s ease;font-weight:500;';
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Stats counter animation
function animateStats() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            el.textContent = target + suffix;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current) + suffix;
          }
        }, 30);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', animateStats);

// EmailJS form submission helper
function submitEmailJS(form, serviceId, templateId, successMsg, errorMsg) {
  if (typeof emailjs === 'undefined') {
    showToast('EmailJS chưa được tải. Vui lòng thử lại sau.');
    return;
  }

  emailjs.sendForm(serviceId || EMAILJS_CONFIG.serviceId, templateId || EMAILJS_CONFIG.templateId, form)
    .then(() => {
      showToast(successMsg || 'Gửi thành công!');
      form.reset();
    }, (err) => {
      showToast((errorMsg || 'Gửi thất bại: ') + err.text);
    });
}
