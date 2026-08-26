export function initCountdown(targetDate) {
  const target = new Date(targetDate).getTime();
  const countdown = document.querySelector('.countdown');
  const status = document.querySelector('#countdownStatus');
  const ids = { days: 'cd-d', hours: 'cd-h', minutes: 'cd-m', seconds: 'cd-s' };
  let timer = null;

  if (!Number.isFinite(target)) return;

  const pad = (value) => String(value).padStart(2, '0');

  const update = () => {
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

    Object.entries(ids).forEach(([key, id]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = key === 'days' ? String(values[key]) : pad(values[key]);
    });

    if (expired) {
      countdown?.setAttribute('aria-label', 'Свадебный день уже наступил');
      if (status) status.textContent = 'Свадебный день уже наступил.';
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
      }
    }
  };

  update();
  if (target > Date.now()) timer = window.setInterval(update, 1000);
  window.addEventListener('pagehide', () => timer !== null && clearInterval(timer), { once: true });
}
