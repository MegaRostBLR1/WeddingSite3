export function initNavigation() {
  const nav = document.querySelector('#nav');
  const burger = document.querySelector('#burger');
  const navLinks = document.querySelector('#navLinks');
  const sections = ['story', 'timeline', 'location', 'dresscode', 'rsvp'];

  const updateNav = () => nav?.classList.toggle('scrolled', window.scrollY > 60);

  let savedScrollY = 0;

  const closeMenu = () => {
    nav?.classList.remove('open');
    document.body.classList.remove('menu-open');
    document.body.style.top = '';
    if (window.innerWidth <= 820) window.scrollTo(0, savedScrollY);
    burger?.setAttribute('aria-expanded', 'false');
    burger?.setAttribute('aria-label', 'Открыть меню');
  };

  const openMenu = () => {
    savedScrollY = window.scrollY;
    nav?.classList.add('open');
    document.body.classList.add('menu-open');
    document.body.style.top = `-${savedScrollY}px`;
    burger?.setAttribute('aria-expanded', 'true');
    burger?.setAttribute('aria-label', 'Закрыть меню');
  };

  burger?.addEventListener('click', () => {
    burger.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
  });

  navLinks?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  const updateActiveNav = (id) => {
    navLinks?.querySelectorAll('a').forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) updateActiveNav(visible[0].target.id);
    }, { rootMargin: '-20% 0px -65% 0px', threshold: [0.1, 0.25, 0.5, 0.75] });

    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}
