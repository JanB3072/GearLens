/**
 * Progressive motion. Nothing here is required to read the site: the HTML
 * already contains every number and every heading, and the CSS only hides
 * elements once `html.motion-on` is present. That class is added here, so a
 * failed bundle, a blocked script or a crawler without JS sees the plain page.
 */

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let initialized = false;

function reveal(): void {
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.setAttribute('data-reveal', 'done'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target as HTMLElement;
      el.setAttribute('data-reveal', 'done');
      observer.unobserve(el);
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

  for (const el of items) {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      el.setAttribute('data-reveal', 'done');
    } else {
      el.setAttribute('data-reveal', 'pending');
      observer.observe(el);
    }
  }
}

function counters(): void {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'));
  if (!targets.length || !('IntersectionObserver' in window)) return;
  const formatter = new Intl.NumberFormat(document.documentElement.lang || 'en');

  const run = (el: HTMLElement): void => {
    const target = Number(el.dataset.count);
    if (!Number.isFinite(target)) return;
    const suffix = el.dataset.suffix ?? '';
    const started = performance.now();
    const duration = 1100;
    const tick = (now: number): void => {
      const p = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = `${formatter.format(Math.round(target * eased))}${suffix}`;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      run(entry.target as HTMLElement);
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.45 });
  targets.forEach((el) => observer.observe(el));
}

function cookieBar(): void {
  const bar = document.querySelector<HTMLElement>('[data-cookie-bar]');
  if (!bar) return;
  const KEY = 'gl-cookie-dismissed';
  try {
    if (localStorage.getItem(KEY) === '1') { bar.hidden = true; return; }
  } catch { /* ignore */ }
  const btn = bar.querySelector<HTMLButtonElement>('[data-cookie-dismiss]');
  btn?.addEventListener('click', () => {
    bar.hidden = true;
    try { localStorage.setItem(KEY, '1'); } catch { /* ignore */ }
  });
}

function scrollChrome(): void {
  const bar = document.querySelector<HTMLElement>('.scroll-progress-bar');
  const header = document.querySelector<HTMLElement>('.site-header');
  let queued = false;
  const update = (): void => {
    queued = false;
    const max = root.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    if (bar) bar.style.transform = `scaleX(${progress})`;
    header?.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  const onScroll = (): void => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}

function enable(): void {
  root.classList.add('motion-on');
  if (initialized) return;
  initialized = true;
  reveal();
  counters();
}

function disable(): void {
  root.classList.remove('motion-on');
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => el.setAttribute('data-reveal', 'done'));
}

scrollChrome();
cookieBar();
if (reduceMotion.matches) disable();
else enable();

reduceMotion.addEventListener('change', (event) => {
  if (event.matches) disable();
  else enable();
});
