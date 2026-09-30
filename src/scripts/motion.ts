import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { createGlobe } from './globe';
import { initRipples } from './ripple';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

initRipples(reduce);

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

/* ---------- Header menu: the link of the section in view stays lit ---------- */
{
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-menu-link]')];
  const sections = links.map((a) => document.querySelector<HTMLElement>(a.hash));
  let active: HTMLAnchorElement | null = null;
  const spy = () => {
    const mid = window.innerHeight * 0.45;
    let hit: HTMLAnchorElement | null = null;
    sections.forEach((sec, i) => {
      const r = sec?.getBoundingClientRect();
      if (r && r.top <= mid && r.bottom > mid) hit = links[i];
    });
    if (hit === active) return;
    active = hit;
    links.forEach((l) => {
      l.classList.toggle('is-active', l === hit);
      if (l === hit) l.setAttribute('aria-current', 'true');
      else l.removeAttribute('aria-current');
    });
  };
  if (links.length) {
    window.addEventListener('scroll', spy, { passive: true });
    spy();
  }
}

/* ---------- Fill buttons: a circle grows from where the cursor enters, shrinks toward where it leaves ---------- */
document.querySelectorAll<HTMLElement>('[data-fill-btn]').forEach((btn) => {
  const fill = btn.querySelector<HTMLElement>('[data-fill]');
  if (!fill) return;
  const place = (e: PointerEvent) => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    // big enough to cover the button from any corner
    const d = 2 * Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y));
    fill.style.width = fill.style.height = `${d}px`;
    fill.style.left = `${x - d / 2}px`;
    fill.style.top = `${y - d / 2}px`;
  };
  const dur = reduce ? 0 : 0.5;
  btn.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'touch') return;
    place(e);
    gsap.fromTo(fill, { scale: 0 }, { scale: 1, duration: dur, ease: 'power3.out', overwrite: true });
  });
  btn.addEventListener('pointerleave', (e) => {
    if (e.pointerType === 'touch') return;
    place(e);
    gsap.to(fill, { scale: 0, duration: dur * 0.8, ease: 'power3.out', overwrite: true });
  });
});

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

/* ---------- Particle clouds (light sections) ----------
 * default: a wide, slowly turning dust vortex behind the heading. It gathers in
 * from a loose scatter as the section scrolls in, and scrolling turns it faster.
 * ring (CTA): a tilted ring of dust. */
document.querySelectorAll<HTMLCanvasElement>('[data-particles]').forEach((c) => {
  let g = fit(c);
  const ring = c.dataset.variant === 'ring';
  const small = window.innerWidth < 768;
  const N = ring ? (small ? 500 : 1100) : small ? 700 : 1600;
  type P = { r: number; a: number; w: number; ph: number; sp: number; s: number; pink: boolean; scat: number; ox: number; oy: number; bx: number; by: number };
  let pts: P[] = [];
  const seed = () => {
    const { w, h } = g;
    pts = Array.from({ length: N }, (_, i) => {
      const pink = i % 41 === 0;
      if (ring) {
        const a = Math.random() * Math.PI * 2;
        const rad = Math.min(w, h) * (0.42 + (Math.random() - 0.5) * 0.18) + Math.random() ** 3 * 120;
        return { r: 0, a: 0, w: 0, ph: Math.random() * Math.PI * 2, sp: 0.4 + Math.random(), s: Math.random() < 0.9 ? 1.2 : 2, pink: false, scat: 0, ox: 0, oy: 0, bx: w / 2 + Math.cos(a) * rad * 1.35, by: h / 2 + Math.sin(a) * rad * 0.8 };
      }
      // radius in units of half the width: sparse in the middle (heading), thick in a wide band, thin tail outward
      // most dust in a band around r≈0.78 (gaussian), the rest scattered wider
      const gauss = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
      const r = Math.random() < 0.8 ? 0.78 + gauss * 0.3 : 0.35 + Math.random() * 1.0;
      return {
        r,
        a: Math.random() * Math.PI * 2,
        w: (0.9 + Math.random() * 0.5) / Math.pow(r, 1.4), // inner dust turns faster
        ph: Math.random() * Math.PI * 2,
        sp: 0.4 + Math.random(),
        s: pink ? 2.4 : Math.random() < 0.88 ? 1.2 : 2,
        pink,
        scat: 0.6 + Math.random() * 1.4, // how far it starts from its orbit
        ox: 0, oy: 0, bx: 0, by: 0,
      };
    });
  };
  seed();
  window.addEventListener('resize', () => { g = fit(c); seed(); });

  // scroll progress through the section: 0 as it enters, 1 once its top reaches the top of the screen
  const host = c.parentElement!;
  const progress = () => {
    const r = host.getBoundingClientRect();
    return Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight + r.height * 0.25)));
  };
  let spin = 0, lastScroll = window.scrollY;

  const draw = (t: number) => {
    const { ctx, w, h } = g;
    ctx.clearRect(0, 0, w, h);
    const rect = c.getBoundingClientRect();
    const mx = mouse.x - rect.left, my = mouse.y - rect.top;

    const q = reduce ? 1 : progress();
    const gather = 1 - Math.pow(1 - q, 3); // ease-out
    // scrolling adds a little extra turn, which then settles
    const sy = window.scrollY;
    spin += (sy - lastScroll) * 0.0009;
    lastScroll = sy;
    // centre the vortex on the text block, ellipse fills the whole box
    const txt = host.querySelector<HTMLElement>(':scope > div');
    const cy = txt ? txt.getBoundingClientRect().top - rect.top + txt.offsetHeight / 2 : h * 0.5;
    const cx = w / 2, R = w / 2, flat = (h * 0.5) / R;
    const time = reduce ? 0 : t * 0.00005;

    for (const p of pts) {
      let x: number, y: number;
      if (ring) {
        x = p.bx + Math.sin(t * 0.0006 * p.sp + p.ph) * 10;
        y = p.by + Math.cos(t * 0.0005 * p.sp + p.ph) * 8;
        const a = t * 0.00005;
        const dx = x - cx, dy = y - h / 2;
        x = cx + dx * Math.cos(a) - dy * Math.sin(a) * 0.6;
        y = h / 2 + dx * Math.sin(a) * 0.6 + dy * Math.cos(a);
      } else {
        const ang = p.a + (time + spin) * p.w;
        const rr = p.r * (1 + (1 - gather) * p.scat) * R;
        x = cx + Math.cos(ang) * rr + Math.sin(t * 0.0007 * p.sp + p.ph) * 6;
        y = cy + Math.sin(ang) * rr * flat + Math.cos(t * 0.0006 * p.sp + p.ph) * 6;
        if (x < -10 || x > w + 10 || y < -10 || y > h + 10) continue;
      }
      // push away from the cursor, then ease back
      const dx = x - mx, dy = y - my, d2 = dx * dx + dy * dy;
      if (finePointer && d2 < 140 * 140) {
        const d = Math.sqrt(d2) || 1;
        const f = (1 - d / 140) * 26;
        p.ox += ((dx / d) * f - p.ox) * 0.2;
        p.oy += ((dy / d) * f - p.oy) * 0.2;
      } else {
        p.ox *= 0.92;
        p.oy *= 0.92;
      }
      // fade dust that sits right behind the heading
      const ndx = (x - cx) / R, ndy = (y - cy) / (R * flat);
      const core = ring ? 1 : Math.min(1, Math.max(0.15, (Math.hypot(ndx, ndy) - 0.3) / 0.25));
      ctx.globalAlpha = (ring ? 0.72 : 0.62) * core * (ring ? 1 : 0.35 + gather * 0.65);
      ctx.fillStyle = p.pink ? '#E4007C' : '#171717';
      ctx.fillRect(x + p.ox, y + p.oy, p.s, p.s);
    }
    ctx.globalAlpha = 1;
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

  // ink wipes between sections: the next section's colour floods up over the last screen
  gsap.utils.toArray<HTMLElement>('[data-splash]').forEach((el) => {
    const clip = el.querySelector('[data-splash-clip]')!;
    gsap.fromTo(
      el.querySelector('[data-splash-fill]'),
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: clip,
          start: 'top 40%', // ink shows up just before the next section reaches the screen
          // 1.5 screens of scroll; the last wipe ends where the page does
          end: (self: ScrollTrigger) => Math.min(ScrollTrigger.maxScroll(window), self.start + window.innerHeight * 1.5),
          scrub: 0.3,
        },
      },
    );
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
}
