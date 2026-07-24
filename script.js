/* ========================================================
   BLICKFANG BY TONY — Interactive JavaScript
   Animations, scroll effects, language toggle, lightbox
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Loading Screen ----
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.querySelector('.hero').classList.add('in-view');
    }, 2200);
  });

  // Fallback: hide loader after 4s max
  setTimeout(() => {
    loader.classList.add('hidden');
    document.querySelector('.hero').classList.add('in-view');
  }, 4000);

  // ---- Scroll Progress Bar ----
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
  }

  // ---- Navbar Scroll Effect ----
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;

  function updateNavbar() {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = currentScrollY;
  }

  // ---- Parallax for Image Break ----
  const parallaxImages = document.querySelectorAll('.parallax-img img');
  function updateParallax() {
    parallaxImages.forEach(img => {
      const parent = img.closest('.parallax-img');
      const rect = parent.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight && rect.bottom > 0) {
        const scrollPercent = (windowHeight - rect.top) / (windowHeight + rect.height);
        const translateY = (scrollPercent - 0.5) * 60;
        img.style.transform = `translateY(${translateY}px)`;
      }
    });
  }

  // ---- Optimized Scroll Handler ----
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        updateNavbar();
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ---- Intersection Observer for Reveal Animations ----
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .sliding-divider');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Don't unobserve — keep watching for re-entry if desired
        // revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Mobile Menu Toggle ----
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile nav when clicking a link
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---- Language Toggle (EN/DE) ----
  let currentLang = 'en';

  function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    // Update all translatable elements
    document.querySelectorAll('[data-lang-en]').forEach(el => {
      const text = el.getAttribute(`data-lang-${lang}`);
      if (text) {
        // If the element has children that should not be replaced (e.g., spans inside),
        // only update text content if it's a simple element
        if (el.children.length === 0 || el.tagName === 'P' || el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3') {
          // For hero title, preserve the accent span
          if (el.classList.contains('hero-title')) {
            const accent = el.querySelector('.accent');
            if (accent) {
              const accentText = accent.getAttribute(`data-lang-${lang}`);
              if (accentText) accent.textContent = accentText;
            }
            // Don't change the brand name
            return;
          }
          el.textContent = text;
        } else {
          // For elements with children like btn-explore
          const textSpan = el.querySelector('span[data-lang-en]');
          if (textSpan) {
            textSpan.textContent = textSpan.getAttribute(`data-lang-${lang}`);
          } else {
            el.textContent = text;
          }
        }
      }
    });

    // Update language toggle UI
    updateLangToggleUI();
  }

  function updateLangToggleUI() {
    const enEls = [document.getElementById('langEn'), document.getElementById('langEnMobile')];
    const deEls = [document.getElementById('langDe'), document.getElementById('langDeMobile')];

    enEls.forEach(el => {
      if (el) {
        el.classList.toggle('active-lang', currentLang === 'en');
        el.style.color = currentLang === 'en' ? 'var(--color-gold)' : '';
      }
    });

    deEls.forEach(el => {
      if (el) {
        el.classList.toggle('active-lang', currentLang === 'de');
        el.style.color = currentLang === 'de' ? 'var(--color-gold)' : '';
      }
    });
  }

  // Language toggle event listeners
  document.getElementById('langToggle').addEventListener('click', () => {
    setLanguage(currentLang === 'en' ? 'de' : 'en');
  });

  const langToggleMobile = document.getElementById('langToggleMobile');
  if (langToggleMobile) {
    langToggleMobile.addEventListener('click', () => {
      setLanguage(currentLang === 'en' ? 'de' : 'en');
    });
  }

  // Auto-detect language from browser
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang.startsWith('de')) {
    setLanguage('de');
  }

  // ---- Lightbox ----
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxPrice = document.getElementById('lightboxPrice');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('[data-lightbox]').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.getAttribute('data-title');
      const category = item.getAttribute('data-category');
      const price = item.getAttribute('data-price');

      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxTitle.textContent = title;
      lightboxCategory.textContent = category;
      lightboxPrice.textContent = price;

      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });

  // ---- Gallery Item Tilt Effect (Desktop only) ----
  if (window.matchMedia('(min-width: 768px)').matches) {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateX = (y - 0.5) * -4;
        const rotateY = (x - 0.5) * 4;

        item.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      item.addEventListener('mouseleave', () => {
        item.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
        item.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => { item.style.transition = ''; }, 600);
      });
    });
  }

  // ---- Cursor Custom Glow on Gallery (Desktop) ----
  if (window.matchMedia('(min-width: 768px)').matches) {
    document.querySelectorAll('.gallery-item, .featured-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  // ---- Initial calls ----
  updateScrollProgress();
  updateNavbar();
});
