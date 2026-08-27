// ---------- CONFIG ----------
const WEDDING_CONFIG = Object.freeze({
    targetDate: '2026-09-26T15:00:00+03:00',
    mapUrl: 'https://www.openstreetmap.org/?mlat=55.678&mlon=37.28#map=14/55.678/37.28',
    analytics: Object.freeze({
        tournamentId: '85742c6d-0a4e-465f-aa53-f7722db1d5d7',
        modelId: '40beda00-4711-4830-a3fb-2f417ee0f485'
    })
});

// ---------- NAV ----------
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
const sectionIds = ['story', 'timeline', 'location', 'dresscode', 'rsvp'];
const sectionElements = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);
const navLinkElements = navLinks ? [...navLinks.querySelectorAll('a')] : [];

function setMenuState(isOpen) {
    if (!nav || !burger) return;

    nav.classList.toggle('open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
}

function updateScrolledState() {
    nav?.classList.toggle('scrolled', window.scrollY > 60);
}

function setActiveLink(id) {
    navLinkElements.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active', isActive);
        if (isActive) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

function initializeNavigation() {
    if (!nav || !burger || !navLinks) return;

    setMenuState(false);
    updateScrolledState();

    burger.addEventListener('click', () => {
        setMenuState(!nav.classList.contains('open'));
    });

    navLinkElements.forEach((link) => {
        link.addEventListener('click', () => setMenuState(false));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && nav.classList.contains('open')) {
            setMenuState(false);
            burger.focus();
        }
    });

    window.addEventListener('scroll', updateScrolledState, {passive: true});

    if ('IntersectionObserver' in window && sectionElements.length > 0) {
        const activeSectionObserver = new IntersectionObserver((entries) => {
            const visibleEntry = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (visibleEntry) {
                setActiveLink(visibleEntry.target.id);
            }
        }, {
            rootMargin: '-20% 0px -65% 0px',
            threshold: [0, 0.25, 0.5, 0.75, 1]
        });

        sectionElements.forEach((section) => activeSectionObserver.observe(section));
    }
}

initializeNavigation();

const mapButton = document.getElementById('mapButton');
if (mapButton) {
    mapButton.href = WEDDING_CONFIG.mapUrl;
}

// ---------- COUNTDOWN ----------
// Wedding time is explicitly treated as Europe/Moscow (UTC+3), independent of visitor timezone.
const target = Date.parse(WEDDING_CONFIG.targetDate);
const countdownTimerIds = ['cd-d', 'cd-h', 'cd-m', 'cd-s'];
let countdownInterval = null;

function pad(value) {
    return String(value).padStart(2, '0');
}

function updateCountdown(values) {
    countdownTimerIds.forEach((id, index) => {
        const element = document.getElementById(id);
        if (element) element.textContent = values[index];
    });
}

function tick() {
    const diff = target - Date.now();

    if (diff <= 0 || Number.isNaN(target)) {
        updateCountdown(['0', '00', '00', '00']);
        if (countdownInterval) clearInterval(countdownInterval);
        return;
    }

    updateCountdown([
        Math.floor(diff / 864e5),
        pad(Math.floor(diff / 36e5) % 24),
        pad(Math.floor(diff / 6e4) % 60),
        pad(Math.floor(diff / 1e3) % 60)
    ]);
}

tick();
countdownInterval = setInterval(tick, 1000);

// ---------- SCROLL REVEAL ----------
function initializeReveal() {
    const elements = document.querySelectorAll('.reveal, .tl-item');

    if (!('IntersectionObserver' in window)) {
        elements.forEach((element) => element.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('visible');
            currentObserver.unobserve(entry.target);
        });
    }, {threshold: 0.15});

    elements.forEach((element) => observer.observe(element));
}

initializeReveal();

// ---------- ACCESSIBILITY ----------
function initializeReducedMotion() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const applyReducedMotion = (event) => {
        document.documentElement.classList.toggle('reduce-motion', event.matches);
    };

    applyReducedMotion(mediaQuery);

    if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', applyReducedMotion);
    }
}

initializeReducedMotion();

// ---------- RSVP FORM ----------
// Intentionally left unchanged: RSVP is excluded from this refactor.
const form = document.getElementById('rsvpForm');
const success = document.getElementById('rsvpSuccess');

function setError(input, show) {
    input.classList.toggle('error', show);
    const message = input.closest('.field').querySelector('.err-msg');
    if (message) message.style.display = show ? 'block' : 'none';
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    let isValid = true;

    const name = document.getElementById('fname');
    if (name.value.trim().length < 2) {
        setError(name, true);
        isValid = false;
    } else {
        setError(name, false);
    }

    const phone = document.getElementById('fphone');
    const digits = phone.value.replace(/\D/g, '');
    if (digits.length < 10) {
        setError(phone, true);
        isValid = false;
    } else {
        setError(phone, false);
    }

    const attend = form.querySelector('input[name="attend"]:checked');
    const attendError = document.getElementById('attendErr');
    if (!attend) {
        attendError.style.display = 'block';
        isValid = false;
    } else {
        attendError.style.display = 'none';
    }

    if (!isValid) return;

    form.style.display = 'none';
    success.style.display = 'block';
});

['fname', 'fphone'].forEach((id) => {
    const element = document.getElementById(id);
    element.addEventListener('input', () => setError(element, false));
});

form.querySelectorAll('input[name="attend"]').forEach((radio) =>
    radio.addEventListener('change', () => {
        document.getElementById('attendErr').style.display = 'none';
    })
);

document.getElementById('againBtn').addEventListener('click', () => {
    form.reset();
    form.style.display = 'block';
    success.style.display = 'none';
});

// ---------- PRIVACY-FRIENDLY PAGE VIEW ----------
function initializePageView() {
    try {
        const request = fetch('/api/page-views', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(WEDDING_CONFIG.analytics),
            keepalive: true
        });

        request.catch(() => {
            // Analytics must never break the invitation page.
        });
    } catch {
        // Analytics must never break the invitation page.
    }
}

initializePageView();