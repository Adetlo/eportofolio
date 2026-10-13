/* =============================================================
   Portfolio · shared interactions
   - Theme toggle (light / dark, persisted)
   - Header scroll state
   - Accessible mobile menu
   - Active navigation link
   - Opt-in scroll reveal (content is visible without JS)
   - Footer year
   ============================================================= */
(() => {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // -----------------------------------------------------------
  // 1. Theme
  // -----------------------------------------------------------
  const root = document.documentElement;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const currentTheme = () => root.getAttribute('data-theme') || (systemDark.matches ? 'dark' : 'light');
  const applyTheme = (theme, persist) => {
    root.setAttribute('data-theme', theme);
    if (persist) {
      try { localStorage.setItem('theme', theme); } catch (e) { /* storage unavailable */ }
    }
    $$('.theme-toggle').forEach(btn => {
      const next = theme === 'dark' ? 'light' : 'dark';
      btn.setAttribute('aria-label', `Switch to ${next} theme`);
      btn.setAttribute('title', `Switch to ${next} theme`);
    });
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0b0f17' : '#fbfbfc');
  };
  // Initial attribute is set by the inline head script; sync labels here.
  applyTheme(currentTheme(), false);
  $$('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => applyTheme(currentTheme() === 'dark' ? 'light' : 'dark', true));
  });

  // -----------------------------------------------------------
  // 2. Header scroll state
  // -----------------------------------------------------------
  const header = $('#navbar') || $('.site-header');
  if (header) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 8);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // -----------------------------------------------------------
  // 3. Mobile menu
  // -----------------------------------------------------------
  const navToggle = $('#navToggle');
  const mobileMenu = $('#mobileMenu');
  const desktop = window.matchMedia('(min-width: 1024px)');
  const setMenu = (open) => {
    if (!mobileMenu || !navToggle) return;
    mobileMenu.classList.toggle('active', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
    if (open) {
      const first = $('a, button', mobileMenu);
      if (first) first.focus({ preventScroll: true });
    }
  };
  const closeMenu = () => { if (mobileMenu?.classList.contains('active')) { setMenu(false); navToggle?.focus({ preventScroll: true }); } };
  if (navToggle && mobileMenu) {
    mobileMenu.setAttribute('aria-hidden', 'true');
    navToggle.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('active')));
    $$('a', mobileMenu).forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    document.addEventListener('click', e => {
      if (!mobileMenu.classList.contains('active')) return;
      if (mobileMenu.contains(e.target) || navToggle.contains(e.target)) return;
      setMenu(false);
    });
    desktop.addEventListener('change', e => { if (e.matches) setMenu(false); });
  }

  // -----------------------------------------------------------
  // 4. Active navigation link
  // -----------------------------------------------------------
  const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const dataScienceFamily = new Set([
    'data-science.html', 'big-data.html', 'big-data-reflection.html',
    'machine-learning.html', 'machine-learning-reflection.html',
    'research-methods.html', 'rmpp_final_reflection.html'
  ]);
  $$('.nav-link, .mobile-link').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    const isMatch = href === file || (href === 'data-science.html' && dataScienceFamily.has(file));
    a.classList.toggle('active', isMatch);
    if (isMatch) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  $$('.subnav a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    a.classList.toggle('active', href === file);
    if (href === file) a.setAttribute('aria-current', 'page');
  });

  // -----------------------------------------------------------
  // 5. Scroll reveal (progressive enhancement)
  // -----------------------------------------------------------
  const revealEls = $$('[data-reveal]');
  if (revealEls.length) {
    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      revealEls.forEach(el => el.classList.add('visible'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
      revealEls.forEach(el => io.observe(el));
      // Safety net: never leave content hidden.
      setTimeout(() => revealEls.forEach(el => el.classList.add('visible')), 2500);
    }
  }

  // -----------------------------------------------------------
  // 7. Footer year
  // -----------------------------------------------------------
  $$('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });

  // -----------------------------------------------------------
  // 8. Close the mobile menu when an in-page anchor is followed
  // -----------------------------------------------------------
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', () => setMenu(false)));
})();
