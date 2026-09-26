import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const root = document.documentElement;

/* ---------- Nav: condense on scroll (works even with reduced motion) ---------- */
const nav = document.querySelector<HTMLElement>('[data-nav]');
const onScrollNav = () => nav?.classList.toggle('is-scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScrollNav, { passive: true });
onScrollNav();

if (reduce) {
  root.classList.add('motion-off');
} else {
  root.classList.add('motion-on');

  /* ---------- Smooth scroll ---------- */
  const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -90 });
    });
  });

  /* ---------- Split headings into words ---------- */
  const split = (el: HTMLElement) => {
    const out: HTMLElement[] = [];
    const wrap = (node: Node) => {
      const mask = document.createElement('span');
      mask.className = 'w-mask';
      const inner = document.createElement('span');
      inner.className = 'w';
      mask.appendChild(inner);
      inner.appendChild(node);
      out.push(inner);
      return mask;
    };
    [...el.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const parts = (node.textContent ?? '').split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(' '));
          else frag.appendChild(wrap(document.createTextNode(p)));
        });
        el.replaceChild(frag, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        el.replaceChild(wrap(node.cloneNode(true)), node);
      }
    });
    return out;
  };

  /* ---------- Hero intro ---------- */
  const heroTitle = document.querySelector<HTMLElement>('[data-hero-title]');
  gsap.set('[data-stage-inner]', { rotateX: 16, transformOrigin: '50% 0%' });
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
  if (heroTitle) {
    const words = split(heroTitle);
    intro.from(words, { yPercent: 110, rotate: 4, filter: 'blur(8px)', opacity: 0, duration: 1.3, stagger: 0.06 }, 0.1);
  }
  intro
    .from('[data-hero-fade]', { y: 24, opacity: 0, filter: 'blur(6px)', duration: 1.1, stagger: 0.1 }, 0.35)
    .from('[data-stage-inner]', { y: 120, rotateX: 35, opacity: 0, duration: 1.8 }, 0.5)
    .from('[data-fan="left"]', { x: 160, opacity: 0, duration: 1.6 }, 0.9)
    .from('[data-fan="right"]', { x: -160, opacity: 0, duration: 1.6 }, 0.9)
    .from('[data-chip]', { scale: 0.7, rotate: -6, opacity: 0, duration: 1.1, stagger: 0.14, ease: 'back.out(1.7)' }, 1.3)
    .fromTo('[data-ring]', { '--p': 0 }, { '--p': 96, duration: 1.8, ease: 'power3.out' }, 1.4);

  // Gentle floating for the chips (y is free: intro uses scale, scroll uses yPercent)
  document.querySelectorAll<HTMLElement>('[data-float]').forEach((el, i) => {
    gsap.to(el, { y: -12, duration: el.dataset.float === 'slow' ? 4.2 : 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.6 });
  });

  /* ---------- Hero stage: scroll-linked 3D flatten + fan-out ---------- */
  const stage = document.querySelector<HTMLElement>('[data-stage]');
  if (stage) {
    gsap.to('[data-stage-inner]', {
      rotateX: 0, scale: 1.04, ease: 'none',
      scrollTrigger: { trigger: stage, start: 'top 75%', end: 'bottom 30%', scrub: 1 },
    });
    gsap.to('[data-fan="left"]', { xPercent: -14, rotateY: 26, ease: 'none', scrollTrigger: { trigger: stage, start: 'top 75%', end: 'bottom 20%', scrub: 1 } });
    gsap.to('[data-fan="right"]', { xPercent: 14, rotateY: -26, ease: 'none', scrollTrigger: { trigger: stage, start: 'top 75%', end: 'bottom 20%', scrub: 1 } });
    gsap.to('[data-chip]', { yPercent: -60, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: stage, start: 'top 60%', end: 'bottom top', scrub: 1.2 } });

    // Mouse parallax on the whole stage
    if (finePointer) {
      const tilt = stage.querySelector<HTMLElement>('[data-stage-tilt]');
      const rx = gsap.quickTo(tilt, 'rotationX', { duration: 0.9, ease: 'power3.out' });
      const ry = gsap.quickTo(tilt, 'rotationY', { duration: 0.9, ease: 'power3.out' });
      window.addEventListener('pointermove', (e) => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        rx(-y * 8);
        ry(x * 10);
      });
    }
  }

  /* ---------- Section headings: word reveal ---------- */
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((h) => {
    const words = split(h);
    gsap.from(words, {
      yPercent: 105, opacity: 0, rotate: 3, duration: 1.1, ease: 'expo.out', stagger: 0.045,
      scrollTrigger: { trigger: h, start: 'top 85%' },
    });
  });

  /* ---------- Staggered card entrances ---------- */
  document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
    gsap.from(group.children, {
      y: 60, opacity: 0, scale: 0.97, duration: 1.1, ease: 'expo.out', stagger: 0.09,
      scrollTrigger: { trigger: group, start: 'top 82%' },
    });
  });

  /* ---------- Bento: bars grow ---------- */
  gsap.from('[data-bar]', {
    scaleY: 0, transformOrigin: 'bottom', duration: 1.2, ease: 'expo.out', stagger: 0.07,
    scrollTrigger: { trigger: '[data-bars]', start: 'top 85%' },
  });

  /* ---------- Process: line draws with scroll ---------- */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 768px)', () => {
    gsap.fromTo('[data-line]', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left', ease: 'none', scrollTrigger: { trigger: '[data-steps]', start: 'top 80%', end: 'bottom 55%', scrub: 1 } });
  });
  mm.add('(max-width: 767px)', () => {
    gsap.fromTo('[data-line]', { scaleY: 0 }, { scaleY: 1, transformOrigin: 'top', ease: 'none', scrollTrigger: { trigger: '[data-steps]', start: 'top 80%', end: 'bottom 60%', scrub: 1 } });
  });
  gsap.from('[data-steps] li', {
    y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.15,
    scrollTrigger: { trigger: '[data-steps]', start: 'top 80%' },
  });

  /* ---------- Ambient glows drift with scroll ---------- */
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const speed = Number(el.dataset.parallax) || 0.2;
    gsap.to(el, { yPercent: speed * 100, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* ---------- Footer wordmark ---------- */
  gsap.from('[data-wordmark]', {
    yPercent: 60, letterSpacing: '0.02em', opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '[data-wordmark]', start: 'top bottom', end: 'bottom bottom', scrub: 1 },
  });

  /* ---------- Pointer effects (desktop only) ---------- */
  if (finePointer) {
    // Spotlight + 3D tilt cards
    document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
      const max = Number(card.dataset.tilt) || 6;
      const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3.out' });
      const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3.out' });
      gsap.set(card, { transformPerspective: 1000 });
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', `${x * 100}%`);
        card.style.setProperty('--my', `${y * 100}%`);
        rx((0.5 - y) * max);
        ry((x - 0.5) * max);
      });
      card.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });

    // Magnetic buttons
    document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((btn) => {
      const x = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
      const y = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        x((e.clientX - (r.left + r.width / 2)) * 0.25);
        y((e.clientY - (r.top + r.height / 2)) * 0.35);
      });
      btn.addEventListener('pointerleave', () => { x(0); y(0); });
    });

    // Cursor glow that follows the pointer
    const glow = document.querySelector<HTMLElement>('[data-cursor]');
    if (glow) {
      const gx = gsap.quickTo(glow, 'x', { duration: 0.8, ease: 'power3.out' });
      const gy = gsap.quickTo(glow, 'y', { duration: 0.8, ease: 'power3.out' });
      window.addEventListener('pointermove', (e) => { gx(e.clientX); gy(e.clientY); });
    }
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());
}
