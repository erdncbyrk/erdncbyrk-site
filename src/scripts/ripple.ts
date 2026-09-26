/**
 * Water-ripple dot grid. Replaces a section's CSS dot background with a canvas
 * and sends a wave through the dots wherever the visitor clicks empty space.
 */
type Ripple = { x: number; y: number; t0: number };

const SPACING = 26;
const SPEED = 0.55; // px per ms
const LIFE = 2600; // ms
const WAVELENGTH = 70; // px
const AMP = 9; // px of displacement at the wave front

const INTERACTIVE = 'a, button, input, textarea, select, summary, label, [role="button"], [data-no-ripple]';

export function initRipples(reduce: boolean) {
  document.querySelectorAll<HTMLCanvasElement>('canvas[data-ripple]').forEach((canvas) => {
    const host = canvas.parentElement!;
    host.classList.remove('dotgrid'); // the canvas takes over the dots
    const ctx = canvas.getContext('2d')!;
    const ripples: Ripple[] = [];
    let w = 0, h = 0, raf = 0;

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = host.clientWidth;
      h = host.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(performance.now());
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      for (let i = ripples.length - 1; i >= 0; i--) if (now - ripples[i].t0 > LIFE) ripples.splice(i, 1);

      // faint rings on the water surface
      for (const r of ripples) {
        const age = now - r.t0;
        for (let k = 0; k < 3; k++) {
          const rad = age * SPEED - k * WAVELENGTH * 0.9;
          if (rad <= 0) continue;
          const a = (1 - age / LIFE) * (0.16 - k * 0.045);
          if (a <= 0) continue;
          ctx.strokeStyle = `rgba(240,240,248,${a.toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(r.x, r.y, rad, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // the dot grid, pushed along each wave
      const off = SPACING / 2;
      for (let gy = off; gy < h; gy += SPACING) {
        for (let gx = off; gx < w; gx += SPACING) {
          let dx = 0, dy = 0, lift = 0;
          for (const r of ripples) {
            const age = now - r.t0;
            const vx = gx - r.x, vy = gy - r.y;
            const d = Math.hypot(vx, vy) || 1;
            const front = age * SPEED;
            const behind = front - d; // >0 once the wave has passed this dot
            if (behind < -WAVELENGTH || behind > WAVELENGTH * 3) continue;
            const env = Math.exp(-(behind * behind) / (2 * WAVELENGTH * WAVELENGTH)) * (1 - age / LIFE);
            const s = Math.sin((behind / WAVELENGTH) * Math.PI * 2) * AMP * env * Math.min(1, 60 / Math.sqrt(d + 1) / 4 + 0.35);
            dx += (vx / d) * s;
            dy += (vy / d) * s;
            lift += Math.max(0, s) / AMP;
          }
          const a = Math.min(0.55, 0.085 + lift * 0.35);
          ctx.fillStyle = `rgba(240,240,248,${a.toFixed(3)})`;
          const size = 1.3 + lift * 1.2;
          ctx.fillRect(gx + dx - size / 2, gy + dy - size / 2, size, size);
        }
      }
    };

    const loop = (now: number) => {
      draw(now);
      raf = ripples.length ? requestAnimationFrame(loop) : 0;
    };

    host.addEventListener('pointerdown', (e) => {
      if (reduce || e.button !== 0) return;
      const target = e.target as Element;
      if (target.closest(INTERACTIVE)) return;
      const globe = target.closest('[data-globe]') as (Element & { onSphere?: (e: PointerEvent) => boolean }) | null;
      if (globe?.onSphere?.(e)) return; // that click is a globe drag
      if (window.getSelection()?.toString()) return;
      const rect = host.getBoundingClientRect();
      ripples.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, t0: performance.now() });
      if (ripples.length > 6) ripples.shift();
      if (!raf) raf = requestAnimationFrame(loop);
    });

    new ResizeObserver(fit).observe(host);
    fit();
  });
}
