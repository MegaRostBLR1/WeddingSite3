// ---------- CONFIG ----------
// rsvp.endpoint — URL Formspree / Getform / своего API (POST JSON).
// rsvp.email — если endpoint пуст, отправка через FormSubmit.co на этот email.
// Заполните хотя бы одно из полей, иначе форма честно покажет ошибку настройки.
const WEDDING_CONFIG = Object.freeze({
    targetDate: '2026-09-26T15:00:00+03:00',
    mapUrl: 'https://yandex.ru/maps/?ll=37.28%2C55.678&z=14&pt=37.28,55.678&l=map',
    rsvp: Object.freeze({
        endpoint: '',
        email: ''
    }),
    analytics: Object.freeze({
        enabled: false,
        endpoint: '',
        payload: Object.freeze({
            tournamentId: '85742c6d-0a4e-465f-aa53-f7722db1d5d7',
            modelId: '40beda00-4711-4830-a3fb-2f417ee0f485'
        })
    })
});

const ATTEND_LABELS = Object.freeze({
    yes: 'С радостью приду',
    pair: 'Придём вдвоём',
    no: 'Не смогу'
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

const mapFrame = document.getElementById('mapFrame');
if (mapFrame && WEDDING_CONFIG.mapUrl) {
    // Embed widget built from the same coordinates as mapUrl (lon,lat).
    mapFrame.src = 'https://yandex.ru/map-widget/v1/?ll=37.28%2C55.678&z=14&pt=37.28,55.678,pm2rdm&l=map';
}

// ---------- COUNTDOWN ----------
const target = Date.parse(WEDDING_CONFIG.targetDate);
const countdownTimerIds = ['cd-d', 'cd-h', 'cd-m', 'cd-s'];
const countdownLabelIds = ['cd-d-label', 'cd-h-label', 'cd-m-label', 'cd-s-label'];
const countdownUnits = [
    ['день', 'дня', 'дней'],
    ['час', 'часа', 'часов'],
    ['минута', 'минуты', 'минут'],
    ['секунда', 'секунды', 'секунд']
];
let countdownInterval = null;

function pad(value) {
    return String(value).padStart(2, '0');
}

function pluralRu(n, forms) {
    const abs = Math.abs(Number(n)) % 100;
    const n1 = abs % 10;
    if (abs > 10 && abs < 20) return forms[2];
    if (n1 > 1 && n1 < 5) return forms[1];
    if (n1 === 1) return forms[0];
    return forms[2];
}

function updateCountdown(values) {
    countdownTimerIds.forEach((id, index) => {
        const element = document.getElementById(id);
        if (element) element.textContent = values[index];

        const label = document.getElementById(countdownLabelIds[index]);
        if (label) {
            const numeric = Number(String(values[index]).replace(/^0+(?=\d)/, '')) || 0;
            label.textContent = pluralRu(numeric, countdownUnits[index]);
        }
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
        String(Math.floor(diff / 864e5)),
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

// ---------- RSVP FORM ----------
const form = document.getElementById('rsvpForm');
const success = document.getElementById('rsvpSuccess');
const formStatus = document.getElementById('formStatus');
const submitButton = document.getElementById('rsvpSubmit');

function setError(input, show) {
    if (!input) return;
    input.classList.toggle('error', show);
    input.setAttribute('aria-invalid', show ? 'true' : 'false');
    const field = input.closest('.field');
    const message = field?.querySelector('.err-msg');
    if (message) message.style.display = show ? 'block' : 'none';
}

function setFormStatus(message, isError) {
    if (!formStatus) return;
    if (!message) {
        formStatus.hidden = true;
        formStatus.textContent = '';
        formStatus.classList.remove('is-error');
        return;
    }
    formStatus.hidden = false;
    formStatus.textContent = message;
    formStatus.classList.toggle('is-error', Boolean(isError));
}

function normalizePhone(value) {
    const digits = String(value || '').replace(/\D/g, '');
    if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) {
        return `7${digits.slice(1)}`;
    }
    if (digits.length === 10) {
        return `7${digits}`;
    }
    return digits;
}

function isValidPhone(value) {
    return /^7\d{10}$/.test(normalizePhone(value));
}

function collectPayload() {
    const name = document.getElementById('fname')?.value.trim() || '';
    const phoneRaw = document.getElementById('fphone')?.value.trim() || '';
    const attend = form?.querySelector('input[name="attend"]:checked')?.value || '';
    const drink = document.getElementById('fdrink')?.value || '';
    const wish = document.getElementById('fwish')?.value.trim() || '';

    return {
        name,
        phone: phoneRaw,
        phoneNormalized: normalizePhone(phoneRaw),
        attend,
        attendLabel: ATTEND_LABELS[attend] || attend,
        drink,
        wish,
        submittedAt: new Date().toISOString(),
        source: 'WeddingSite3'
    };
}

function validateForm() {
    let isValid = true;
    let firstInvalid = null;

    const name = document.getElementById('fname');
    if (!name || name.value.trim().length < 2) {
        setError(name, true);
        isValid = false;
        firstInvalid = firstInvalid || name;
    } else {
        setError(name, false);
    }

    const phone = document.getElementById('fphone');
    if (!phone || !isValidPhone(phone.value)) {
        setError(phone, true);
        isValid = false;
        firstInvalid = firstInvalid || phone;
    } else {
        setError(phone, false);
    }

    const attend = form?.querySelector('input[name="attend"]:checked');
    const attendError = document.getElementById('attendErr');
    if (!attend) {
        if (attendError) attendError.style.display = 'block';
        isValid = false;
        firstInvalid = firstInvalid || form?.querySelector('input[name="attend"]');
    } else if (attendError) {
        attendError.style.display = 'none';
    }

    if (firstInvalid) firstInvalid.focus();
    return isValid;
}

async function sendRsvp(payload) {
    const endpoint = (WEDDING_CONFIG.rsvp.endpoint || '').trim();
    const email = (WEDDING_CONFIG.rsvp.email || '').trim();

    if (endpoint) {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`RSVP endpoint responded with ${response.status}`);
        }
        return 'endpoint';
    }

    if (email) {
        const body = new FormData();
        body.append('name', payload.name);
        body.append('phone', payload.phone);
        body.append('attend', payload.attendLabel);
        body.append('drink', payload.drink || '—');
        body.append('wish', payload.wish || '—');
        body.append('_subject', `RSVP: ${payload.name}`);
        body.append('_template', 'table');
        body.append('_captcha', 'false');

        const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
            method: 'POST',
            headers: {Accept: 'application/json'},
            body
        });

        if (!response.ok) {
            throw new Error(`FormSubmit responded with ${response.status}`);
        }
        return 'email';
    }

    throw new Error('RSVP is not configured');
}

function showSuccess() {
    if (!form || !success) return;
    form.hidden = true;
    form.style.display = 'none';
    success.hidden = false;
    success.style.display = 'block';
    document.getElementById('rsvpSuccessTitle')?.focus();
}

function resetFormView() {
    if (!form || !success) return;
    form.reset();
    form.hidden = false;
    form.style.display = 'block';
    success.hidden = true;
    success.style.display = 'none';
    setFormStatus('');
    ['fname', 'fphone'].forEach((id) => setError(document.getElementById(id), false));
    const attendError = document.getElementById('attendErr');
    if (attendError) attendError.style.display = 'none';
}

if (form && success) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        setFormStatus('');

        if (!validateForm()) return;

        const payload = collectPayload();
        const originalLabel = submitButton?.textContent || 'Отправить ответ';

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Отправка…';
        }

        try {
            await sendRsvp(payload);
            showSuccess();
        } catch (error) {
            const notConfigured = error instanceof Error && error.message === 'RSVP is not configured';
            setFormStatus(
                notConfigured
                    ? 'Отправка пока не настроена. Укажите WEDDING_CONFIG.rsvp.email или rsvp.endpoint в scripts/script.js.'
                    : 'Не удалось отправить ответ. Проверьте соединение и попробуйте ещё раз.',
                true
            );
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalLabel;
            }
        }
    });

    ['fname', 'fphone'].forEach((id) => {
        const element = document.getElementById(id);
        element?.addEventListener('input', () => setError(element, false));
    });

    form.querySelectorAll('input[name="attend"]').forEach((radio) =>
        radio.addEventListener('change', () => {
            const attendError = document.getElementById('attendErr');
            if (attendError) attendError.style.display = 'none';
        })
    );

    const againButton = document.getElementById('againBtn');
    if (againButton) {
        againButton.addEventListener('click', () => {
            resetFormView();
            document.getElementById('fname')?.focus();
        });
    }
}

// ---------- ANALYTICS (opt-in, absolute URL only) ----------
function initializePageView() {
    const {enabled, endpoint, payload} = WEDDING_CONFIG.analytics;
    if (!enabled || !endpoint || !/^https?:\/\//i.test(endpoint)) return;

    try {
        const request = fetch(endpoint, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload),
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
