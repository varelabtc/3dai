(function() {
  'use strict';

  // --- Navbar scroll ---
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function() {
    nav.classList.toggle('scrolled', window.pageYOffset > 40);
  });

  // --- Mobile nav ---
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function() { links.classList.toggle('open'); });
    links.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() { links.classList.remove('open'); });
    });
  }

  // --- Scroll reveal with stagger ---
  var reveals = document.querySelectorAll('.reveal, .reveal-stagger');
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(function(el) { observer.observe(el); });

  // --- Smooth anchors ---
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.pageYOffset - (nav.offsetHeight + 20);
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // --- Cursor glow on hero ---
  var hero = document.querySelector('.hero');
  if (hero) {
    var glow = document.createElement('div');
    glow.style.cssText = 'position:absolute;width:600px;height:600px;border-radius:50%;pointer-events:none;z-index:1;' +
      'background:radial-gradient(circle,rgba(0,168,255,0.06) 0%,transparent 70%);transition:transform 0.3s ease-out,opacity 0.3s;opacity:0;';
    hero.appendChild(glow);

    hero.addEventListener('mousemove', function(e) {
      var rect = hero.getBoundingClientRect();
      glow.style.transform = 'translate(' + (e.clientX - rect.left - 300) + 'px,' + (e.clientY - rect.top - 300) + 'px)';
      glow.style.opacity = '1';
    });
    hero.addEventListener('mouseleave', function() {
      glow.style.opacity = '0';
    });
  }

})();
