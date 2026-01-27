// ==============================
// NEURAVOX — Site Interactions
// ==============================

(function() {
  'use strict';

  // --- Navbar scroll effect ---
  var nav = document.getElementById('nav');
  var lastScroll = 0;

  window.addEventListener('scroll', function() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  });

  // --- Mobile nav toggle ---
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');

  if (toggle && links) {
    toggle.addEventListener('click', function() {
      links.classList.toggle('open');
    });

    // Close on link click
    links.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        links.classList.remove('open');
      });
    });
  }

  // --- Scroll reveal ---
  var reveals = document.querySelectorAll('.reveal');

  function checkReveal() {
    var trigger = window.innerHeight * 0.88;
    reveals.forEach(function(el) {
      var top = el.getBoundingClientRect().top;
      if (top < trigger) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', checkReveal);
  window.addEventListener('load', checkReveal);
  checkReveal();

  // --- Smooth anchor scrolling ---
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = nav.offsetHeight + 20;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

})();
