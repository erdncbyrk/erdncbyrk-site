import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Nav background once the page scrolls (no motion involved) */
const nav = document.querySelector<HTMLElement>('[data-nav]');
const onScroll = () => nav?.classList.toggle('is-scrolled', window.scrollY > 24);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (reduce) {
  root.classList.add('motion-off');
} else {
  root.classList.add('motion-on'); // also set early in <head>

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
      lenis.scrollTo(target, { offset: -80 });
    });
  });

  const ease = 'power3.out';

  /* ---------- Hero ---------- */
  const panel = document.querySelector<HTMLElement>('[data-hero-panel]');
  gsap.set(panel, { transformOrigin: '50% 0%', rotateX: 24 });
  const intro = gsap.timeline({ defaults: { ease } });
  intro
    .fromTo('[data-hero-line]', { y: 28, opacity: 0, filter: 'blur(8px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, stagger: 0.12 }, 0.1)
    .fromTo(panel, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4 }, 0.45);

  // Chart lines draw in, score rings and bars fill, once the panel is up
  document.querySelectorAll<SVGPathElement>('[data-draw]').forEach((p) => {
    const len = p.getTotalLength();
    const dash = p.getAttribute('stroke-dasharray');
    if (dash) {
      // dashed line: reveal with a clip instead of dash offset
      intro.from(p, { opacity: 0, duration: 1 }, 1.2);
    } else {
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      intro.to(p, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' }, 0.9);
    }
  });
  intro.from('[data-score]', { strokeDasharray: '0 97.4', duration: 1.4, stagger: 0.08 }, 1.1);
  intro.from('[data-bar]', { scaleX: 0, transformOrigin: 'left', duration: 1.2, stagger: 0.08 }, 1.2);

  // Panel flattens as it scrolls into view
  gsap.to(panel, {
    rotateX: 0,
    ease: 'none',
    scrollTrigger: { trigger: '[data-hero-stage]', start: 'top 85%', end: 'top 20%', scrub: 0.8 },
  });

  /* ---------- Problems: cards travel through depth past a pinned headline ---------- */
  const problems = document.querySelector<HTMLElement>('[data-problems]');
  if (problems && getComputedStyle(problems).display !== 'none') {
    const cards = gsap.utils.toArray<HTMLElement>('[data-card]', problems);
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: problems, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
    });
    cards.forEach((card) => {
      const depth = Number(card.dataset.depth) || 1;
      const start = (Number(card.dataset.start) || 0) / 280; // position along the pinned scroll (0–1)
      const travel = () => -(window.innerHeight + card.offsetHeight + 80);
      gsap.set(card, { scale: depth, filter: depth < 0.9 ? 'blur(1.5px)' : 'none', opacity: depth < 0.9 ? 0.75 : 1 });
      tl.fromTo(card, { y: 0 }, { y: travel, duration: 0.42 / depth }, start * 0.8);
    });
    tl.to(problems.querySelector('h2'), { opacity: 0.35, duration: 0.15 }, 0.85);
  }

  /* ---------- Generic fade-up on scroll ---------- */
  gsap.set('[data-fade]', { opacity: 0, y: 28 });
  ScrollTrigger.batch('[data-fade]', {
    start: 'top 88%',
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease, stagger: 0.08, overwrite: true }),
  });

  /* ---------- Numbers count up ---------- */
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count) || 0;
    const obj = { v: 0 };
    el.textContent = '0';
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.to(obj, { v: end, duration: 1.6, ease: 'power2.out', onUpdate: () => (el.textContent = String(Math.round(obj.v))) }),
    });
  });

  /* ---------- About: words light up with scroll ---------- */
  document.querySelectorAll<HTMLElement>('[data-fill]').forEach((p) => {
    const words = [...p.querySelectorAll<HTMLElement>('.fw')];
    ScrollTrigger.create({
      trigger: p,
      start: 'top 78%',
      end: 'bottom 45%',
      scrub: true,
      onUpdate: (self) => {
        const n = Math.round(self.progress * words.length);
        words.forEach((w, i) => w.classList.toggle('on', i < n));
      },
    });
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
}
