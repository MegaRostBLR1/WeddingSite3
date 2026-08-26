import { initNavigation } from './navigation.js';
import { initCountdown } from './countdown.js';
import { initReveal } from './reveal.js';

(() => {
  'use strict';

  const config = window.WEDDING_CONFIG;
  initNavigation();
  initCountdown(config?.weddingDate ?? '2026-09-26T15:00:00+03:00');
  initReveal();

  // RSVP demo interaction intentionally unchanged: no backend submission is added here.
  const form = document.querySelector('#rsvpForm');
  const success = document.querySelector('#rsvpSuccess');
  const again = document.querySelector('#againBtn');

  const clearErrors = () => {
    form?.querySelectorAll('.field').forEach((field) => field.classList.remove('has-error'));
    form?.querySelectorAll('.error').forEach((input) => {
      input.classList.remove('error');
      input.setAttribute('aria-invalid', 'false');
    });
  };

  const showFieldError = (field, input) => {
    field?.classList.add('has-error');
    input?.classList.add('error');
    input?.setAttribute('aria-invalid', 'true');
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
    if (form) form.hidden = false;
    success?.classList.remove('is-visible');
    document.querySelector('#fname')?.focus();
  });
})();
