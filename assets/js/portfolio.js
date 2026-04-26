/* =============================================================
   Portfolio · Shared Interactions
   - Navbar scroll state + scroll-progress bar
   - Mobile menu (with body lock + ESC + outside click)
   - IntersectionObserver scroll reveal
   - Magnetic buttons
   - Card spotlight
   - Count-up animation
   - Marquee duplication
   - Skill bar fill on view
   - Active nav link auto-detect
   - Year stamp in footer
   - Smooth in-page anchor scroll
   - Respects prefers-reduced-motion
   ============================================================= */
(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // -----------------------------------------------------------
  // 1. Navbar scroll + progress bar
  // -----------------------------------------------------------
  const navbar = $('#navbar');
  const ensureProgress = () => {
    let p = $('#scrollProgress');
    if (!p) {
      p = document.createElement('div');
      p.id = 'scrollProgress';
      p.className = 'scroll-progress';
      document.body.appendChild(p);
    }
    return p;
  };
  const progress = ensureProgress();

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (navbar) navbar.classList.toggle('scrolled', y > 40);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = h > 0 ? (y / h * 100) + '%' : '0%';
      ticking = false;
    });
    ticking = true;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // -----------------------------------------------------------
  // 2. Mobile menu
  // -----------------------------------------------------------
  const navToggle = $('#navToggle');
  const mobileMenu = $('#mobileMenu');
  const closeMobile = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('active');
    navToggle?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  const openMobile = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.add('active');
    navToggle?.classList.add('open');
    navToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  navToggle?.addEventListener('click', () => {
    mobileMenu?.classList.contains('active') ? closeMobile() : openMobile();
  });
  $$('.mobile-link').forEach(a => a.addEventListener('click', closeMobile));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobile(); });
  mobileMenu?.addEventListener('click', e => { if (e.target === mobileMenu) closeMobile(); });

  // -----------------------------------------------------------
  // 3. Active nav link auto-highlight (matches current file)
  // -----------------------------------------------------------
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  $$('.nav-link, .mobile-link, .subnav a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href && href === path) a.classList.add('active');
  });

  // -----------------------------------------------------------
  // 4. Scroll reveal via IntersectionObserver
  // -----------------------------------------------------------
  const revealEls = $$('[data-reveal]');
  if (revealEls.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      revealEls.forEach(el => el.classList.add('visible'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(el => io.observe(el));
    }
  }

  // -----------------------------------------------------------
  // 5. Magnetic buttons (subtle pull toward cursor)
  // -----------------------------------------------------------
  if (!reduced) {
    $$('[data-magnetic]').forEach(el => {
      const strength = Number(el.dataset.magnetic) || 12;
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x / r.width * strength}px, ${y / r.height * strength}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  // -----------------------------------------------------------
  // 6. Card spotlight (mouse-following gradient)
  // -----------------------------------------------------------
  if (!reduced) {
    $$('.card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      });
    });
  }

  // -----------------------------------------------------------
  // 7. Count-up for [data-count="N"] (or .stat-value with data-count)
  // -----------------------------------------------------------
  const countEls = $$('[data-count]');
  if (countEls.length) {
    const animateCount = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const duration = parseInt(el.dataset.duration) || 1600;
      if (reduced) { el.textContent = `${prefix}${target}${suffix}`; return; }
      const isInt = Number.isInteger(target) && !el.dataset.decimals;
      const decimals = parseInt(el.dataset.decimals) || (isInt ? 0 : 1);
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const value = target * eased;
        el.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      countEls.forEach(el => io.observe(el));
    } else {
      countEls.forEach(animateCount);
    }
  }

  // -----------------------------------------------------------
  // 8. Skill bars
  // -----------------------------------------------------------
  const skillBars = $$('.skill-bar');
  if (skillBars.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    skillBars.forEach(el => io.observe(el));
  }

  // -----------------------------------------------------------
  // 9. Marquee — duplicate track for seamless loop
  // -----------------------------------------------------------
  $$('.marquee').forEach(m => {
    const track = m.querySelector('.marquee-track');
    if (!track || track.dataset.duplicated) return;
    track.dataset.duplicated = '1';
    track.appendChild(track.cloneNode(true).firstElementChild
      ? track.cloneNode(true)
      : track.cloneNode(true));
    // simpler & robust: clone inner children once
  });
  // robust marquee duplication
  $$('.marquee').forEach(m => {
    const track = m.querySelector('.marquee-track');
    if (!track || track.dataset.cloned === '1') return;
    const html = track.innerHTML;
    track.innerHTML = html + html;
    track.dataset.cloned = '1';
  });

  // -----------------------------------------------------------
  // 10. Smooth in-page anchor scroll (respects nav offset)
  // -----------------------------------------------------------
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = (navbar?.offsetHeight || 80) + 12;
      const y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
      closeMobile();
    });
  });

  // -----------------------------------------------------------
  // 11. Footer year
  // -----------------------------------------------------------
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  // -----------------------------------------------------------
  // 12. Tilt-on-hover (opt-in via data-tilt)
  // -----------------------------------------------------------
  if (!reduced) {
    $$('[data-tilt]').forEach(el => {
      const max = Number(el.dataset.tilt) || 8;
      el.style.transformStyle = 'preserve-3d';
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width  - 0.5;
        const py = (e.clientY - r.top)  / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }
})();
