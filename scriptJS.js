// ===========================================================
// VERSI AI — site script
// Handles: mobile nav toggle, scroll-reveal animation,
//          contact form validation + submission (Formspree)
// ===========================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Footer year ----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Mobile nav toggle ----
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.classList.toggle('is-active', isOpen);
    });

    // close menu after tapping a link (mobile)
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Header background on scroll (subtle) ----
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.style.borderBottomColor = 'rgba(201,160,74,0.4)';
    } else {
      header.style.borderBottomColor = '';
    }
  });

  // ---- Scroll reveal ----
  // Tag the elements we want to animate in as they enter the viewport
  const revealTargets = document.querySelectorAll(
    '.service-card, .process-list li, .work-card, .about-copy, .about-stats, blockquote, .section-head'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => observer.observe(el));

  // ---- Contact form validation + submission ----
  const form = document.getElementById('contactForm');
  if (form) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const status = document.getElementById('formStatus');

    const errors = {
      name: document.getElementById('nameError'),
      email: document.getElementById('emailError'),
      message: document.getElementById('messageError'),
    };

    function validEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function setError(field, msg) {
      errors[field].textContent = msg;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault(); // always stop native submission — we control it manually below

      let valid = true;

      setError('name', '');
      setError('email', '');
      setError('message', '');
      status.textContent = '';

      if (!nameInput.value.trim()) {
        setError('name', 'Please enter your name.');
        valid = false;
      }
      if (!validEmail(emailInput.value.trim())) {
        setError('email', 'Please enter a valid email address.');
        valid = false;
      }
      if (!messageInput.value.trim()) {
        setError('message', 'Tell us a little about what you need.');
        valid = false;
      }

      if (!valid) return; // stop here — nothing gets sent

      // Send the real data to Formspree via fetch
      const formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(response => {
        if (response.ok) {
          status.textContent = "Thanks — we've received your message and will get back to you shortly.";
          form.reset(); // safe to reset now — data was already sent
        } else {
          status.textContent = "Something went wrong. Please try again or email us directly.";
        }
      })
      .catch(() => {
        status.textContent = "Something went wrong. Please check your connection and try again.";
      });
    });
  }

});