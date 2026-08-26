(() => {
  'use strict';

  const nav = document.querySelector('#nav');
  const burger = document.querySelector('#burger');
  const navLinks = document.querySelector('#navLinks');
  const sections = ['story', 'timeline', 'location', 'dresscode', 'rsvp'];

  const updateNav = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 60);

    let current = '';
    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section && window.scrollY + 200 >= section.offsetTop) current = id;
    });

    navLinks?.querySelectorAll('a').forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };

  const closeMenu = () => {
    nav?.classList.remove('open');
    document.body.classList.remove('menu-open');
    burger?.setAttribute('aria-expanded', 'false');
  };

  burger?.addEventListener('click', () => {
    const isOpen = nav?.classList.toggle('open') ?? false;
    document.body.classList.toggle('menu-open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // Countdown
  const target = new Date('2026-09-26T15:00:00+03:00').getTime();
  const countdownIds = { days: 'cd-d', hours: 'cd-h', minutes: 'cd-m', seconds: 'cd-s' };

  const pad = (value) => String(value).padStart(2, '0');

  const updateCountdown = () => {
    const diff = target - Date.now();
    const values = diff <= 0
      ? { days: 0, hours: 0, minutes: 0, seconds: 0 }
      : {
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff / 3600000) % 24),
          minutes: Math.floor((diff / 60000) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        };

    Object.entries(countdownIds).forEach(([key, id]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = key === 'days' ? String(values[key]) : pad(values[key]);
    });
  };

  updateCountdown();
  const countdownTimer = window.setInterval(updateCountdown, 1000);

  // Scroll reveal
  const revealItems = document.querySelectorAll('.reveal, .tl-item');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        instance.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }

  // RSVP demo interaction. Replace this handler with an API request when backend is connected.
  const form = document.querySelector('#rsvpForm');
  const success = document.querySelector('#rsvpSuccess');
  const again = document.querySelector('#againBtn');

  const clearErrors = () => {
    form?.querySelectorAll('.field').forEach((field) => field.classList.remove('has-error'));
    form?.querySelectorAll('.error').forEach((input) => input.classList.remove('error'));
  };

  const showFieldError = (field, input) => {
    field?.classList.add('has-error');
    input?.classList.add('error');
  };

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors();

    const name = document.querySelector('#fname');
    const phone = document.querySelector('#fphone');
    const attendance = document.querySelector('input[name="attend"]:checked');
    let valid = true;

    if (!name?.value.trim()) {
      showFieldError(name?.closest('.field'), name);
      valid = false;
    }

    if (!phone?.value.trim() || phone.value.replace(/\D/g, '').length < 9) {
      showFieldError(phone?.closest('.field'), phone);
      valid = false;
    }

    if (!attendance) {
      document.querySelector('#attendErr')?.closest('.field')?.classList.add('has-error');
      valid = false;
    }

    if (!valid) return;

    form.hidden = true;
    success?.classList.add('is-visible');
    success?.setAttribute('aria-live', 'polite');
  });

  again?.addEventListener('click', () => {
    form?.reset();
    clearErrors();
    form.hidden = false;
    success?.classList.remove('is-visible');
    document.querySelector('#fname')?.focus();
  });

  window.addEventListener('pagehide', () => window.clearInterval(countdownTimer));
})();
