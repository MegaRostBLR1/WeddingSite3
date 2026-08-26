// ---------- NAV ----------
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
const sections = ['story', 'timeline', 'location', 'dresscode', 'rsvp'];

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveLink();
});

burger.addEventListener('click', () => nav.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => nav.classList.remove('open'))
);

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

// ---------- COUNTDOWN ----------
const target = new Date('2026-09-26T15:00:00');

function pad(value) {
    return String(value).padStart(2, '0');
}

function tick() {
    const diff = target - new Date();

    if (diff <= 0) {
        ['cd-d', 'cd-h', 'cd-m', 'cd-s'].forEach((id) => {
            document.getElementById(id).textContent = '0';
        });
        return;
    }

    document.getElementById('cd-d').textContent = Math.floor(diff / 864e5);
    document.getElementById('cd-h').textContent = pad(Math.floor(diff / 36e5) % 24);
    document.getElementById('cd-m').textContent = pad(Math.floor(diff / 6e4) % 60);
    document.getElementById('cd-s').textContent = pad(Math.floor(diff / 1e3) % 60);
}

tick();
setInterval(tick, 1000);

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

// Fallback for elements that are already visible when the page finishes loading.
function triggerReveals() {
    document.querySelectorAll('.reveal').forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            element.classList.add('in', 'is-visible', 'visible');
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

// ---------- RRWEB / INTERACTION TRACKING ----------
(function initializeTracking() {
    const meta = {
        generationId: '40beda00-4711-4830-a3fb-2f417ee0f485',
        tournamentId: '85742c6d-0a4e-465f-aa53-f7722db1d5d7'
    };

    const startTime = Date.now();
    const interactions = [];
    const cursorPath = [];
    let lastCursorSample = 0;
    let lastScrollSample = 0;
    let pageHeight = document.documentElement.scrollHeight;
    let viewport = {width: window.innerWidth, height: window.innerHeight};

    const MAX_RECORDING_MS = 600000;
    const MAX_INTERACTIONS = 5000;
    const MAX_CURSOR_POINTS = 10000;
    let recordingStopped = false;

    function isCapped() {
        if (recordingStopped) return true;

        if (Date.now() - startTime >= MAX_RECORDING_MS) {
            recordingStopped = true;
            return true;
        }

        return false;
    }

    try {
        fetch('/api/page-views', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                tournamentId: meta.tournamentId,
                modelId: meta.generationId
            }),
            keepalive: true
        });
    } catch (error) {
        // Analytics must never break the invitation page.
    }

    window.addEventListener('resize', () => {
        viewport = {width: window.innerWidth, height: window.innerHeight};
        pageHeight = document.documentElement.scrollHeight;
    });

    document.addEventListener('click', (event) => {
        if (isCapped() || interactions.length >= MAX_INTERACTIONS) return;

        const element = event.target;
        const tag = element.tagName ? element.tagName.toLowerCase() : '';
        const text = (element.textContent || '').trim().substring(0, 80);
        const classes = element.className && typeof element.className === 'string'
            ? element.className.substring(0, 120)
            : '';

        interactions.push({
            type: 'click',
            t: Date.now() - startTime,
            x: Math.round(event.clientX),
            y: Math.round(event.clientY),
            element: {tag, text, classes}
        });
    }, true);

    window.addEventListener('scroll', () => {
        if (isCapped() || interactions.length >= MAX_INTERACTIONS) return;

        const now = Date.now();
        if (now - lastScrollSample < 200) return;
        lastScrollSample = now;

        const scrollY = Math.round(window.scrollY || window.pageYOffset || 0);
        const depthPct = pageHeight > viewport.height
            ? Math.min(100, Math.round(((scrollY + viewport.height) / pageHeight) * 100))
            : 100;

        interactions.push({
            type: 'scroll',
            t: now - startTime,
            y: scrollY,
            depth_pct: depthPct
        });
    }, {passive: true});

    document.addEventListener('mousemove', (event) => {
        if (isCapped() || cursorPath.length >= MAX_CURSOR_POINTS) return;

        const now = Date.now();
        if (now - lastCursorSample < 250) return;
        lastCursorSample = now;

        cursorPath.push([
            Math.round(event.clientX),
            Math.round(event.clientY),
            now - startTime
        ]);
    }, {passive: true});

    document.addEventListener('keydown', (event) => {
        if (isCapped() || interactions.length >= MAX_INTERACTIONS) return;
        if (event.target && ['INPUT', 'TEXTAREA'].includes(event.target.tagName)) return;

        interactions.push({
            type: 'keydown',
            t: Date.now() - startTime,
            key: event.key
        });
    }, true);

    window.__getInteractionData = function getInteractionData() {
        const pageHeightNow = document.documentElement.scrollHeight;
        let maxScroll = 0;
        const clickedElements = {};
        let firstClick = null;
        let firstScroll = null;
        let totalDistance = 0;

        interactions.forEach((event) => {
            if (event.type === 'scroll') {
                if (event.depth_pct > maxScroll) maxScroll = event.depth_pct;
                if (!firstScroll) firstScroll = event.t;
            }

            if (event.type === 'click') {
                if (!firstClick) firstClick = event.t;
                const key = `${event.element.tag}:${event.element.text.substring(0, 30)}`;
                clickedElements[key] = true;
            }
        });

        for (let index = 1; index < cursorPath.length; index += 1) {
            const dx = cursorPath[index][0] - cursorPath[index - 1][0];
            const dy = cursorPath[index][1] - cursorPath[index - 1][1];
            totalDistance += Math.sqrt(dx * dx + dy * dy);
        }

        const duration = Date.now() - startTime;
        const clickHeatmap = interactions
            .filter((event) => event.type === 'click')
            .map((event) => [event.x, event.y]);

        return {
            generation_id: meta.generationId,
            tournament_id: meta.tournamentId,
            started_at: new Date(startTime).toISOString(),
            ended_at: new Date().toISOString(),
            duration_ms: duration,
            viewport,
            page_height: pageHeightNow,
            interactions,
            cursor_path: cursorPath,
            click_heatmap: clickHeatmap,
            summary: {
                total_clicks: clickHeatmap.length,
                total_scrolls: interactions.filter((event) => event.type === 'scroll').length,
                max_scroll_depth_pct: maxScroll,
                unique_elements_clicked: Object.keys(clickedElements).length,
                time_to_first_click_ms: firstClick,
                time_to_first_scroll_ms: firstScroll,
                cursor_distance_px: Math.round(totalDistance),
                active_time_ms: duration
            }
        };
    };
})();

// rrweb is loaded only once, after the main page logic is initialized.
(function loadRrweb() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/rrweb@2.0.0-alpha.4/dist/rrweb.min.js';
    script.onload = () => {
        const record = (window.rrweb && window.rrweb.record) || window.rrwebRecord;
        if (!record) {
            console.warn('[rrweb] Loaded but no record function found.');
            return;
        }

        const meta = {
            generationId: '40beda00-4711-4830-a3fb-2f417ee0f485',
            tournamentId: '85742c6d-0a4e-465f-aa53-f7722db1d5d7'
        };
        const MAX_RECORDING_MS = 600000;
        const MAX_RRWEB_EVENTS = 30000;
        const startTs = Date.now();
        const events = [];

        record({
            emit(event) {
                if (events.length >= MAX_RRWEB_EVENTS || Date.now() - startTs >= MAX_RECORDING_MS) return;
                events.push(event);
            }
        });

        window.__getRrwebEvents = () => ({
            generationId: meta.generationId,
            events
        });

        console.log('[rrweb] Recording started for', meta.generationId);
    };

    script.onerror = () => {
        console.warn('[rrweb] Failed to load CDN script.');
    };

    document.head.appendChild(script);
})();
