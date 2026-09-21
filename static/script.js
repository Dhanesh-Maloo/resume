document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');

  function closeNav() {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    var navLinkEls = navLinks.querySelectorAll('a');
    for (var i = 0; i < navLinkEls.length; i++) {
      navLinkEls[i].addEventListener('click', closeNav);
    }
  }

  /* ---------- Active nav link highlighting ---------- */
  if (navLinks) {
    var currentPath = window.location.pathname;
    var links = navLinks.querySelectorAll('a[data-path]');
    for (var j = 0; j < links.length; j++) {
      var linkPath = links[j].getAttribute('data-path');
      var isMatch = linkPath === '/' ? currentPath === '/' : currentPath === linkPath;
      if (isMatch) {
        links[j].classList.add('active');
      }
    }
  }

  /* ---------- Subtle tilt-on-hover for small tiles ---------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover)').matches;

  if (!reduceMotion && canHover) {
    // Scoped to small, self-contained tiles only — large blocks like
    // .card (timeline, contact form, pull-quote) felt gimmicky tilting.
    var tiltEls = document.querySelectorAll('.skill-card, .project-card, .stat-card');
    var maxTilt = 4; // degrees — kept subtle rather than showy

    tiltEls.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = this.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        // map cursor position (0..1) to a -maxTilt..maxTilt rotation
        var px = x / rect.width;
        var py = y / rect.height;
        var rotateY = (px - 0.5) * 2 * maxTilt;
        var rotateX = (0.5 - py) * 2 * maxTilt;

        this.style.transition = '';
        this.style.transform =
          'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateZ(4px)';
      });

      el.addEventListener('mouseleave', function () {
        this.style.transition = 'transform 0.4s ease';
        this.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
      });
    });
  }

  /* ---------- Theme toggle ---------- */
  var themeToggle = document.getElementById('theme-toggle');
  var themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;
  var THEME_KEY = 'theme-preference';
  var prefersDarkMq = window.matchMedia('(prefers-color-scheme: dark)');

  function isDarkActive() {
    var attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'dark') return true;
    if (attr === 'light') return false;
    return prefersDarkMq.matches;
  }

  function syncThemeUI() {
    var dark = isDarkActive();
    if (themeIcon) {
      themeIcon.textContent = dark ? '☀️' : '🌙';
    }
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', dark ? 'true' : 'false');
    }
  }

  syncThemeUI();

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = isDarkActive() ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      syncThemeUI();
    });
  }

  /* ---------- Scroll-reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ---------- Contact form ---------- */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = contactForm.elements['name'].value.trim();
      var email = contactForm.elements['email'].value.trim();
      var message = contactForm.elements['message'].value.trim();

      var subject = 'Portfolio contact from ' + (name || 'website visitor');
      var body = message + '\n\n— ' + (name || 'Anonymous') + (email ? ' (' + email + ')' : '');
      var mailto = 'mailto:dhaneshmaloo09@gmail.com' +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      window.location.href = mailto;
    });
  }

  /* ---------- Hero terminal typing effect ---------- */
  var typingEl = document.querySelector('.typing-text');
  if (typingEl) {
    var text = typingEl.getAttribute('data-text') || '';
    typingEl.textContent = '';
    var charIndex = 0;

    setTimeout(function typeChar() {
      if (charIndex < text.length) {
        typingEl.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, 45);
      }
    }, 400);
  }

});
