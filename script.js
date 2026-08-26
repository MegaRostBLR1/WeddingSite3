// ---------- NAV ----------
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
const sections = ['story', 'timeline', 'location', 'dresscode', 'rsvp'];

function setMenuState(isOpen) {
    nav.classList.toggle('open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
}

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveLink();
}, {passive: true});

burger.setAttribute('aria-controls', 'navLinks');
setMenuState(false);

burger.addEventListener('click', () => {
    setMenuState(!nav.classList.contains('open'));
});

navLinks.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => setMenuState(false))
);

// Close the mobile menu with Escape.
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
        setMenuState(false);
        burger.focus();
    }
});

function updateActiveLink() {
    let current = '';

    sections.forEach((id) => {
        const element = document.getElementById(id);
        if (element && window.scrollY + 200 >= element.offsetTop) {
            current = id;
        }
    });

    navLinks.querySelectorAll('a').forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}

const navLogo = nav.querySelector('.nav-logo');
if (navLogo) {
    navLogo.href = '#hero';
    navLogo.removeAttribute('onclick');
}

const mapButton = document.querySelector('.loc-info .btn');
if (mapButton) {
    mapButton.href = 'https://www.openstreetmap.org/?mlat=55.678&mlon=37.28#map=14/55.678/37.28';
    mapButton.target = '_blank';
    mapButton.rel = 'noopener noreferrer';
    mapButton.removeAttribute('onclick');
}

updateActiveLink();

// ---------- COUNTDOWN ----------
// Wedding time is explicitly treated as Europe/Moscow (UTC+3), independent of visitor timezone.
const target = Date.parse('2026-09-26T15:00:00+03:00');
const countdownTimerIds = ['cd-d', 'cd-h', 'cd-m', 'cd-s'];
let countdownInterval = null;

function pad(value) {
    return String(value).padStart(2, '0');
}

function tick() {
    const diff = target - Date.now();

    if (diff <= 0) {
        countdownTimerIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) element.textContent = '0';
        });
        if (countdownInterval) clearInterval(countdownInterval);
        return;
    }

    const values = [
        Math.floor(diff / 864e5),
        pad(Math.floor(diff / 36e5) % 24),
        pad(Math.floor(diff / 6e4) % 60),
        pad(Math.floor(diff / 1e3) % 60)
    ];

    countdownTimerIds.forEach((id, index) => {
        const element = document.getElementById(id);
        if (element) element.textContent = values[index];
    });
}

tick();
countdownInterval = setInterval(tick, 1000);

// ---------- SCROLL REVEAL ----------
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {threshold: 0.15});

document.querySelectorAll('.reveal, .tl-item').forEach((element) => observer.observe(element));

function triggerReveals() {
    document.querySelectorAll('.reveal, .tl-item').forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            element.classList.add('visible');
        }
    });
}

if (document.readyState === 'complete') {
    triggerReveals();
    setTimeout(triggerReveals, 100);
} else {
    window.addEventListener('load', () => {
        triggerReveals();
        setTimeout(triggerReveals, 100);
    });
}

// ---------- ACCESSIBILITY ----------
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const reducedMotionStyle = document.createElement('style');
    reducedMotionStyle.textContent = `
        html { scroll-behavior: auto !important; }
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
    `;
    document.head.appendChild(reducedMotionStyle);
}

// ---------- RSVP FORM ----------
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
(function initializePageView() {
    try {
        fetch('/api/page-views', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                tournamentId: '85742c6d-0a4e-465f-aa53-f7722db1d5d7',
                modelId: '40beda00-4711-4830-a3fb-2f417ee0f485'
            }),
            keepalive: true
        });
    } catch (error) {
        // Analytics must never break the invitation page.
    }
})();