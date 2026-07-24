/* ========================================================
   BLICKFANG BY TONY — Atelier & Gallery Interactive JS
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const launchGate = document.getElementById('launchGate');
  const gateForm = document.getElementById('gateForm');
  const gatePasscode = document.getElementById('gatePasscode');
  const gateError = document.getElementById('gateError');
  const loader = document.getElementById('loader');

  // Mode Switcher Tabs inside Launch Gateway
  const tabNotifyBtn = document.getElementById('tabNotifyBtn');
  const tabPasscodeBtn = document.getElementById('tabPasscodeBtn');
  const viewRegister = document.getElementById('viewRegister');
  const viewPasscode = document.getElementById('viewPasscode');

  if (tabNotifyBtn && tabPasscodeBtn && viewRegister && viewPasscode) {
    tabNotifyBtn.addEventListener('click', () => {
      tabNotifyBtn.classList.add('active');
      tabPasscodeBtn.classList.remove('active');
      viewRegister.classList.add('active');
      viewPasscode.classList.remove('active');
    });

    tabPasscodeBtn.addEventListener('click', () => {
      tabPasscodeBtn.classList.add('active');
      tabNotifyBtn.classList.remove('active');
      viewPasscode.classList.add('active');
      viewRegister.classList.remove('active');
    });
  }

  // Launch Interest Registration Form Handler
  const registerForm = document.getElementById('registerForm');
  const clientLaunchEmail = document.getElementById('clientLaunchEmail');
  const registerSuccessMsg = document.getElementById('registerSuccessMsg');

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      const emailValue = clientLaunchEmail ? clientLaunchEmail.value.trim() : '';

      if (emailValue) {
        // Backup saved to localStorage
        try {
          const existingEmails = JSON.parse(localStorage.getItem('blickfang_registered_emails') || '[]');
          existingEmails.push({ email: emailValue, date: new Date().toISOString() });
          localStorage.setItem('blickfang_registered_emails', JSON.stringify(existingEmails));
        } catch (err) {
          console.log('Storage backup note:', err);
        }

        if (registerSuccessMsg) {
          registerSuccessMsg.style.display = 'block';
        }
      }
    });
  }

  // Acceptable passcodes (Primary: BBT26)
  const VALID_PASSCODES = ['bbt26', 'tony2026', 'blickfang'];

  function triggerBrandIntroAnimation() {
    if (loader) {
      loader.classList.remove('hidden');
      setTimeout(() => {
        loader.classList.add('hidden');
        const hero = document.querySelector('.hero');
        if (hero) hero.classList.add('in-view');
      }, 1800);
    } else {
      const hero = document.querySelector('.hero');
      if (hero) hero.classList.add('in-view');
    }
  }

  function checkGateState() {
    if (!launchGate) return;
    const isUnlocked = sessionStorage.getItem('blickfang_unlocked');

    if (isUnlocked === 'true') {
      launchGate.classList.add('unlocked');
      document.body.classList.remove('gate-locked');
      // Play brand intro animation on site load when unlocked
      triggerBrandIntroAnimation();
    } else {
      launchGate.classList.remove('unlocked');
      document.body.classList.add('gate-locked');
      // Keep main loader hidden while password gate is active
      if (loader) loader.classList.add('hidden');
    }
  }

  if (gateForm && launchGate) {
    gateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredInput = gatePasscode ? gatePasscode.value.trim().toLowerCase() : '';

      if (VALID_PASSCODES.includes(enteredInput)) {
        sessionStorage.setItem('blickfang_unlocked', 'true');
        launchGate.classList.add('unlocked');
        document.body.classList.remove('gate-locked');
        if (gateError) gateError.style.display = 'none';

        // Trigger cinematic brand intro animation immediately upon successful login
        triggerBrandIntroAnimation();
      } else {
        if (gateError) gateError.style.display = 'block';
        if (gatePasscode) {
          gatePasscode.style.borderColor = '#e57373';
          gatePasscode.focus();
        }
      }
    });
  }

  checkGateState();

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
