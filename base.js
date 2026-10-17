/* ═══════════════════════════════════════════════════════════════════════
   BASE.JS — shared behaviour for every inner page (about, work, services,
   testimonials, pricing, trust, legal, contact). Pulled from the same
   systems that power index.html so every page behaves identically.
═══════════════════════════════════════════════════════════════════════ */

/* ── SCROLL PROGRESS BAR ─────────────────────────────────────────────── */
(function(){
  var bar = document.getElementById('scrollProgress');
  if(!bar) return;
  function update(){
    var d   = document.documentElement;
    var pct = d.scrollHeight > d.clientHeight
              ? (d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100 : 0;
    bar.style.width = pct.toFixed(2) + '%';
    bar.setAttribute('aria-valuenow', Math.round(pct));
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
})();

/* ── REVEAL ON SCROLL — sections, cards, chips, anything .reveal ────── */
(function(){
  var targets = document.querySelectorAll(
    'section, .tech-item, .tl-item, .metric-chip, ' +
    '.testimonial-card, .timeline, .photo-frame, ' +
    'main section h2, main section:not(.hero) .eyebrow, .reveal'
  );

  if(!('IntersectionObserver' in window)){
    targets.forEach(function(el){ el.classList.add('is-visible'); });
    return;
  }

  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

  targets.forEach(function(el){ obs.observe(el); });

  setTimeout(function(){
    targets.forEach(function(el){
      if(!el.classList.contains('is-visible')) el.classList.add('is-visible');
    });
  }, 3500);
})();

/* ── FOOTER COLUMNS STAGGER REVEAL ───────────────────────────────────── */
(function(){
  var cols = document.querySelectorAll('.footer-col');
  if(!cols.length) return;
  cols.forEach(function(col, i){
    col.style.opacity = '0';
    col.style.transform = 'translateY(16px)';
    col.style.transition = 'opacity .5s ease ' + (i * 0.1 + 0.1) + 's, transform .5s cubic-bezier(.19,1,.22,1) ' + (i * 0.1 + 0.1) + 's';
  });

  if(!('IntersectionObserver' in window)){
    cols.forEach(function(col){ col.style.opacity = '1'; col.style.transform = 'none'; });
    return;
  }
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  cols.forEach(function(col){ obs.observe(col); });
})();

/* ── MOBILE MENU — full handler with focus trap + ARIA ───────────────── */
(function(){
  var toggle   = document.getElementById('hamburgerBtn');
  var menu     = document.getElementById('mobileMenu');
  var closeBtn = document.getElementById('mobileMenuClose');
  if(!toggle || !menu) return;

  var focusable = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function trapFocus(e){
    var els   = Array.prototype.slice.call(menu.querySelectorAll(focusable));
    var first = els[0], last = els[els.length - 1];
    if(e.key === 'Tab'){
      if(e.shiftKey){ if(document.activeElement === first){ e.preventDefault(); last.focus(); } }
      else           { if(document.activeElement === last) { e.preventDefault(); first.focus(); } }
    }
  }

  function openMenu(){
    menu.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
    document.body.style.overflow = 'hidden';
    menu.addEventListener('keydown', trapFocus);
    if(closeBtn) setTimeout(function(){ closeBtn.focus(); }, 50);
  }

  function closeMenu(){
    menu.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    document.body.style.overflow = '';
    menu.removeEventListener('keydown', trapFocus);
  }

  toggle.addEventListener('click', function(){
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });
  if(closeBtn) closeBtn.addEventListener('click', closeMenu);
  menu.addEventListener('click', function(e){ if(e.target === menu) closeMenu(); });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });
  menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeMenu); });
})();

/* ── BACK-TO-TOP SMOOTH SCROLL ───────────────────────────────────────── */
(function(){
  var btn = document.querySelector('.footer-back-top');
  if(!btn) return;
  btn.addEventListener('click', function(e){
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── ACTIVE NAV LINK — highlight current page in pill nav ───────────── */
(function(){
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navlink, .mobile-navlink').forEach(function(a){
    var href = a.getAttribute('href').split('#')[0];
    if(href === path) a.classList.add('active');
  });
})();

/* ── COUNT-UP STATS — any element with data-target ───────────────────── */
(function(){
  var nums = document.querySelectorAll('[data-target]');
  if(!nums.length || !('IntersectionObserver' in window)) return;
  var noMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  function animateNum(el){
    var target = parseFloat(el.getAttribute('data-target'));
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'), 10) : 0;
    if(noMotion){ el.textContent = target.toFixed(decimals) + suffix; return; }
    var start = null, dur = 1400;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        animateNum(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  nums.forEach(function(el){ obs.observe(el); });
})();
