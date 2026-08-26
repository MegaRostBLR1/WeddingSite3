(() => {
  'use strict';

  const nav = document.querySelector('#nav');
  const burger = document.querySelector('#burger');
  const navLinks = document.querySelector('#navLinks');
  const sections = ['story', 'timeline', 'location', 'dresscode', 'rsvp'];

  const updateNav = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };

  const closeMenu = () => {
    nav?.classList.remove('open');
    document.body.classList.remove('menu-open');
    burger?.setAttribute('aria-expanded', 'false');
    burger?.setAttribute('aria-label', 'Открыть меню');
  };

  const openMenu = () => {
    nav?.classList.add('open');
    document.body.classList.add('menu-open');
    burger?.setAttribute('aria-expanded', 'true');
    burger?.setAttribute('aria-label', 'Закрыть меню');
  };

  burger?.addEventListener('click', () => {
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    if (isOpen) closeMenu();
    else openMenu();
  });

  navLinks?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  const updateActiveNav = (id) => {
    navLinks?.querySelectorAll('a').forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible[0]) updateActiveNav(visible[0].target.id);
    }, {
      rootMargin: '-20% 0px -65% 0px',
      threshold: [0.1, 0.25, 0.5, 0.75],
    });

    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) navObserver.observe(section);
    });
  } else {
    const updateActiveNavFallback = () => {
      let current = sections[0];
      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section && window.scrollY + window.innerHeight * 0.3 >= section.offsetTop) current = id;
      });
      updateActiveNav(current);
    };

    window.addEventListener('scroll', updateActiveNavFallback, { passive: true });
    updateActiveNavFallback();
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // Countdown
  const target = new Date('2026-09-26T15:00:00+03:00').getTime();
  const countdownIds = { days: 'cd-d', hours: 'cd-h', minutes: 'cd-m', seconds: 'cd-s' };
  const countdown = document.querySelector('.countdown');
  let countdownTimer = null;

  const pad = (value) => String(value).padStart(2, '0');

  const updateCountdown = () => {
    const diff = target - Date.now();
    const expired = diff <= 0;
    const values = expired
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

    if (expired) {
      countdown?.setAttribute('aria-label', 'Свадебный день уже наступил');
      if (countdownTimer !== null) {
        window.clearInterval(countdownTimer);
        countdownTimer = null;
      }
    }
  };

  updateCountdown();
  if (target > Date.now()) countdownTimer = window.setInterval(updateCountdown, 1000);

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

  window.addEventListener('pagehide', () => {
    if (countdownTimer !== null) window.clearInterval(countdownTimer);
  });
})();
