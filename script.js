/* ========================================================
   BLICKFANG BY TONY — Atelier & Gallery Interactive JS
   ======================================================== */

// Ensure mobile and desktop viewports always start at the very top on load
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);

  // ---- Loading Screen (Cinematic Brand Intro) & Hero Reveal ----
  const loader = document.getElementById('loader');
  const hero = document.querySelector('.hero');

  let siteRevealed = false;
  function revealSite() {
    if (siteRevealed) return;
    siteRevealed = true;

    if (loader) {
      loader.classList.add('hidden');
    }
    if (hero) {
      hero.classList.add('in-view');
    }
  }

  if (loader) {
    // Click to skip intro animation immediately
    loader.addEventListener('click', revealSite);

    // Smooth reveal once page assets load
    window.addEventListener('load', () => {
      setTimeout(revealSite, 800);
    });

    // Safety fallback: ensure site reveals within 1.8s regardless of network conditions
    setTimeout(revealSite, 1800);
  } else {
    revealSite();
  }

  // ---- Scroll Progress Bar ----
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = scrollPercent + '%';
  }

  // ---- Navbar Scroll Backdrop ----
  const navbar = document.getElementById('navbar');
  function updateNavbar() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      if (!document.body.classList.contains('legal-page')) {
        navbar.classList.remove('scrolled');
      }
    }
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        updateNavbar();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ---- Intersection Observer for Scroll Reveals ----
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .sliding-divider');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Mobile Menu ----
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Smooth Anchor Scroll ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---- Gallery Subject Category Filtering (Supports Space-Separated Multi-Categories e.g. "souls earth") ----
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemSubjects = (item.getAttribute('data-subject') || '').split(' ');
        if (filterValue === 'all' || itemSubjects.includes(filterValue)) {
          item.classList.remove('hidden-by-filter');
          item.style.opacity = '1';
        } else {
          item.classList.add('hidden-by-filter');
          item.style.opacity = '0';
        }
      });
    });
  });

  // ---- Lightbox Modal ----
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightbox) {
    document.querySelectorAll('[data-lightbox]').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.classList.contains('open-inquire-modal')) return;

        const img = item.querySelector('img');
        const title = item.getAttribute('data-title') || '';
        const category = item.getAttribute('data-category') || '';

        if (img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
        }
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxCategory) lightboxCategory.textContent = category;

        const lightboxInquireBtn = document.getElementById('lightboxInquireBtn');
        if (lightboxInquireBtn) {
          lightboxInquireBtn.setAttribute('data-title', title);
        }

        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (lightboxClose) {
      lightboxClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
      });
    }

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
  }

  // ---- Private Acquisition Request Modal Workflow ----
  const acquisitionModal = document.getElementById('acquisitionModal');
  const acquisitionModalClose = document.getElementById('acquisitionModalClose');
  const modalArtworkTitle = document.getElementById('modalArtworkTitle');
  const modalSeriesSelect = document.getElementById('modalSeriesSelect');
  const acquisitionForm = document.getElementById('acquisitionForm');

  function openAcquisitionModal(title = '', series = '') {
    if (lightbox && lightbox.classList.contains('open')) {
      lightbox.classList.remove('open');
    }

    if (modalArtworkTitle) {
      modalArtworkTitle.value = title ? title : 'General Portfolio Inquiry';
    }

    if (modalSeriesSelect && series) {
      for (let i = 0; i < modalSeriesSelect.options.length; i++) {
        if (modalSeriesSelect.options[i].value.includes(series)) {
          modalSeriesSelect.selectedIndex = i;
          break;
        }
      }
    }

    if (acquisitionModal) {
      acquisitionModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeAcquisitionModal() {
    if (acquisitionModal) {
      acquisitionModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.open-inquire-modal');
    if (btn) {
      e.stopPropagation();
      const artworkTitle = btn.getAttribute('data-title') || '';
      const seriesName = btn.getAttribute('data-series') || '';
      openAcquisitionModal(artworkTitle, seriesName);
    }
  });

  if (acquisitionModalClose) {
    acquisitionModalClose.addEventListener('click', closeAcquisitionModal);
  }

  if (acquisitionModal) {
    acquisitionModal.addEventListener('click', (e) => {
      if (e.target === acquisitionModal) {
        closeAcquisitionModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && acquisitionModal && acquisitionModal.classList.contains('open')) {
      closeAcquisitionModal();
    }
  });

  // Acquisition Form Submit -> Mailto Link
  if (acquisitionForm) {
    acquisitionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const artwork = modalArtworkTitle ? modalArtworkTitle.value : 'General Inquiry';
      const series = modalSeriesSelect ? modalSeriesSelect.value : 'Unspecified';
      const clientName = document.getElementById('clientName') ? document.getElementById('clientName').value : '';
      const clientEmail = document.getElementById('clientEmail') ? document.getElementById('clientEmail').value : '';
      const clientWishes = document.getElementById('clientWishes') ? document.getElementById('clientWishes').value : '';

      const emailSubject = encodeURIComponent(`Acquisition Request: ${artwork} (${series})`);
      const emailBody = encodeURIComponent(
        `Blickfang by Tony Atelier Acquisition Inquiry\n` +
        `-----------------------------------------\n` +
        `Artwork: ${artwork}\n` +
        `Series Preferred: ${series}\n` +
        `Client Name: ${clientName}\n` +
        `Client Email: ${clientEmail}\n\n` +
        `Personal Wishes / Custom Sizing & Framing:\n${clientWishes}\n`
      );

      window.location.href = `mailto:blickfangbytony@gmail.com?subject=${emailSubject}&body=${emailBody}`;
      closeAcquisitionModal();
    });
  }

  // ---- Language Switcher (EN / DE) ----
  let currentLang = 'en';

  function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-lang-en]').forEach(el => {
      const translation = el.getAttribute(`data-lang-${lang}`);
      if (!translation) return;

      if (el.children.length === 0) {
        el.textContent = translation;
      } else {
        const childTranslations = el.querySelectorAll('[data-lang-en]');
        if (childTranslations.length > 0) {
          childTranslations.forEach(child => {
            const childText = child.getAttribute(`data-lang-${lang}`);
            if (childText) child.textContent = childText;
          });
        }
      }
    });

    updateLangToggleUI();
  }

  function updateLangToggleUI() {
    const enEls = [document.getElementById('langEn'), document.getElementById('langEnMobile')];
    const deEls = [document.getElementById('langDe'), document.getElementById('langDeMobile')];

    enEls.forEach(el => {
      if (el) el.classList.toggle('active-lang', currentLang === 'en');
    });

    deEls.forEach(el => {
      if (el) el.classList.toggle('active-lang', currentLang === 'de');
    });
  }

  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      setLanguage(currentLang === 'en' ? 'de' : 'en');
    });
  }

  const langToggleMobile = document.getElementById('langToggleMobile');
  if (langToggleMobile) {
    langToggleMobile.addEventListener('click', () => {
      setLanguage(currentLang === 'en' ? 'de' : 'en');
    });
  }

  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang && browserLang.startsWith('de')) {
    setLanguage('de');
  }

  // ---- Subtle Desktop Tilt Effect ----
  if (window.matchMedia('(min-width: 992px)').matches) {
    document.querySelectorAll('.gallery-item, .series-card').forEach(item => {
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateX = (y - 0.5) * -3;
        const rotateY = (x - 0.5) * 3;

        item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      item.addEventListener('mouseleave', () => {
        item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      });
    });
  }

  updateScrollProgress();
  updateNavbar();
});
