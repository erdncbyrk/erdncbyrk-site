import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { createGlobe } from './globe';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- Nav state + scroll percentage (no motion involved) ---------- */
const nav = document.querySelector<HTMLElement>('[data-nav]');
const pct = document.querySelector<HTMLElement>('[data-progress]');
const bar = document.querySelector<HTMLElement>('[data-progress-bar]');
const onScroll = () => {
  nav?.classList.toggle('is-scrolled', window.scrollY > 24);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const p = max > 0 ? Math.round((window.scrollY / max) * 100) : 0;
  if (pct) pct.textContent = `${p}%`;
  if (bar) bar.style.height = `${p}%`;
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Canvas helpers ---------- */
type Loop = { draw: (t: number) => void; canvas: HTMLCanvasElement };
const loops: Loop[] = [];
const visible = new WeakMap<Element, boolean>();
const io = new IntersectionObserver((entries) => entries.forEach((e) => visible.set(e.target, e.isIntersecting)), { rootMargin: '100px' });

const fit = (c: HTMLCanvasElement) => {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const r = c.getBoundingClientRect();
  c.width = Math.max(1, Math.round(r.width * dpr));
  c.height = Math.max(1, Math.round(r.height * dpr));
  const ctx = c.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w: r.width, h: r.height };
};

const mouse = { x: -9999, y: -9999, nx: 0, ny: 0 };
window.addEventListener('pointermove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.nx = e.clientX / window.innerWidth - 0.5;
  mouse.ny = e.clientY / window.innerHeight - 0.5;
});

/* ---------- Dotted-earth globe ---------- */
const globe = document.querySelector<HTMLCanvasElement>('[data-globe]');
if (globe) {
  const draw = createGlobe(globe, document.querySelector<HTMLElement>('[data-globe-label]'), mouse);
  io.observe(globe);
  visible.set(globe, true);
  loops.push({ draw, canvas: globe });
}

/* ---------- Particle clouds (light sections) ---------- */
document.querySelectorAll<HTMLCanvasElement>('[data-particles]').forEach((c) => {
  let g = fit(c);
  const ring = c.dataset.variant === 'ring';
  const N = window.innerWidth < 768 ? 500 : 1100;
  type P = { bx: number; by: number; ph: number; sp: number; r: number; ox: number; oy: number };
  let pts: P[] = [];
  const seed = () => {
    const { w, h } = g;
    pts = Array.from({ length: N }, () => {
      let bx: number, by: number;
      if (ring) {
        const a = Math.random() * Math.PI * 2;
        const rad = Math.min(w, h) * (0.42 + (Math.random() - 0.5) * 0.18) + Math.random() ** 3 * 120;
        bx = w / 2 + Math.cos(a) * rad * 1.35;
        by = h / 2 + Math.sin(a) * rad * 0.8;
      } else {
        // a diagonal drift of dust from the top-right, thinning toward the centre
        const u = Math.random(), v = (Math.random() - 0.5) * 2;
        bx = w * (0.98 - u * 0.62) + v * w * 0.08 * (1 - u);
        by = h * (0.05 + u * 0.55) + v * h * 0.22 * (0.4 + u) + Math.sin(u * 6) * 30;
        if (Math.random() < u * 0.55) { bx = -999; by = -999; } // thin out the tail
      }
      return { bx, by, ph: Math.random() * Math.PI * 2, sp: 0.4 + Math.random(), r: Math.random() < 0.9 ? 1.2 : 2, ox: 0, oy: 0 };
    });
  };
  seed();
  window.addEventListener('resize', () => { g = fit(c); seed(); });
  const draw = (t: number) => {
    const { ctx, w, h } = g;
    ctx.clearRect(0, 0, w, h);
    const rect = c.getBoundingClientRect();
    const mx = mouse.x - rect.left, my = mouse.y - rect.top;
    ctx.fillStyle = 'rgba(23,23,23,0.72)';
    for (const p of pts) {
      if (p.bx < -900) continue;
      let x = p.bx + Math.sin(t * 0.0006 * p.sp + p.ph) * 10;
      let y = p.by + Math.cos(t * 0.0005 * p.sp + p.ph) * 8;
      if (ring) {
        const a = t * 0.00005;
        const dx = x - w / 2, dy = y - h / 2;
        x = w / 2 + dx * Math.cos(a) - dy * Math.sin(a) * 0.6;
        y = h / 2 + dx * Math.sin(a) * 0.6 + dy * Math.cos(a);
      }
      // push away from the cursor, then ease back
      const dx = x - mx, dy = y - my, d2 = dx * dx + dy * dy;
      if (finePointer && d2 < 130 * 130) {
        const d = Math.sqrt(d2) || 1;
        const f = (1 - d / 130) * 22;
        p.ox += ((dx / d) * f - p.ox) * 0.2;
        p.oy += ((dy / d) * f - p.oy) * 0.2;
      } else {
        p.ox *= 0.92;
        p.oy *= 0.92;
      }
      ctx.fillRect(x + p.ox, y + p.oy, p.r, p.r);
    }
    ctx.fillStyle = '#E4007C';
    for (let i = 0; i < pts.length; i += 97) {
      const p = pts[i];
      if (p.bx < -900 || ring) continue;
      ctx.fillRect(p.bx + p.ox + Math.sin(t * 0.0006 * p.sp + p.ph) * 10, p.by + p.oy + Math.cos(t * 0.0005 * p.sp + p.ph) * 8, 2.5, 2.5);
    }
  };
  io.observe(c);
  loops.push({ draw, canvas: c });
});

if (reduce) {
  root.classList.add('motion-off');
  // draw each canvas once so the page still has its imagery
  requestAnimationFrame(() => loops.forEach((l) => l.draw(0)));
} else {
  root.classList.add('motion-on');

  const tick = (t: number) => {
    for (const l of loops) if (visible.get(l.canvas)) l.draw(t);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  /* ---------- Smooth scroll ---------- */
  const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = id && id !== '#' ? document.querySelector<HTMLElement>(id) : null;
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -70 });
    });
  });

  const ease = 'power3.out';

  /* ---------- Hero ---------- */
  gsap.fromTo('[data-hero-line]', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease, stagger: 0.12, delay: 0.15 });
  gsap.fromTo('[data-globe]', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 2, ease });

  /* ---------- Scramble-in headings ---------- */
  const GLYPHS = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ0123456789#%&*/<>+=';
  document.querySelectorAll<HTMLElement>('[data-scramble]').forEach((el) => {
    const node = [...el.childNodes].find((n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim());
    if (!node) return;
    const final = node.textContent || '';
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const state = { p: 0 };
        gsap.to(state, {
          p: 1,
          duration: 1.1,
          ease: 'power2.out',
          onUpdate: () => {
            const n = Math.floor(state.p * final.length);
            let out = final.slice(0, n);
            for (let i = n; i < final.length; i++) out += final[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
            node.textContent = out;
          },
          onComplete: () => { node.textContent = final; },
        });
      },
    });
  });

  /* ---------- Typed lines ---------- */
  document.querySelectorAll<HTMLElement>('[data-type]').forEach((el) => {
    const text = el.dataset.type || '';
    el.textContent = '';
    el.classList.add('caret');
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        const s = { i: 0 };
        gsap.to(s, { i: text.length, duration: text.length * 0.035, ease: 'none', delay: 0.6, onUpdate: () => (el.textContent = text.slice(0, Math.round(s.i))) });
      },
    });
  });

  /* ---------- Fade-up ---------- */
  gsap.set('[data-fade]', { opacity: 0, y: 30 });
  ScrollTrigger.batch('[data-fade]', {
    start: 'top 88%',
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease, stagger: 0.08, overwrite: true }),
  });

  /* ---------- Method: horizontal pinned track ---------- */
  const pin = document.querySelector<HTMLElement>('[data-hscroll-pin]');
  const track = document.querySelector<HTMLElement>('[data-hscroll-track]');
  if (pin && track && getComputedStyle(pin.parentElement!).display !== 'none') {
    const dots = [...document.querySelectorAll<HTMLElement>('[data-step-dot]')];
    const dist = () => track.scrollWidth - window.innerWidth;
    const horizontal = gsap.to(track, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        pin: true,
        scrub: 0.8,
        end: () => `+=${dist()}`,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const i = Math.min(dots.length - 1, Math.round(self.progress * (dots.length - 1)));
          dots.forEach((d, j) => d.classList.toggle('on', j <= i));
        },
      },
    });
    dots[0]?.classList.add('on');
    // each panel's content slides in as it crosses the viewport
    gsap.utils.toArray<HTMLElement>('[data-hscroll-track] article').forEach((art, i) => {
      if (i === 0) return;
      gsap.from(art.querySelectorAll('h3, p, li'), {
        x: 140,
        opacity: 0,
        stagger: 0.05,
        ease: 'none',
        scrollTrigger: { trigger: art, containerAnimation: horizontal, start: 'left 90%', end: 'left 30%', scrub: true },
      });
    });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());
}
