/**
 * Ink-splash section edges. Each [data-splash] band is painted with its `from`
 * colour; a noise field decides where the `to` colour bleeds in: a ragged,
 * splattered edge plus loose droplets on both sides of it. Scrolling pushes
 * the edge through the band. Noise is computed once per resize, so a scroll
 * frame is only a threshold pass over a cached field.
 */
const hash = (x: number, y: number, s: number) => {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};
const smooth = (t: number) => t * t * (3 - 2 * t);
const noise = (x: number, y: number, s: number) => {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = smooth(x - xi), yf = smooth(y - yi);
  const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
};
// large lobes + ragged detail
const edgeNoise = (x: number, y: number, s: number) =>
  noise(x, y, s) * 0.5 + noise(x * 2.3, y * 2.3, s + 7) * 0.24 + noise(x * 5.1, y * 5.1, s + 13) * 0.16 +
  noise(x * 11, y * 11, s + 19) * 0.1;

const hex = (c: string) => {
  const n = parseInt(c.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export function initSplashes(reduce: boolean) {
  const bands = [...document.querySelectorAll<HTMLElement>('[data-splash]')];
  bands.forEach((band, idx) => {
    const canvas = band.querySelector('canvas')!;
    const ctx = canvas.getContext('2d')!;
    const [r, g, b] = hex(band.dataset.to || '#F6F6F8');
    const seed = idx * 31 + 5;
    let w = 0, h = 0, img: ImageData | null = null, last = -1, aa = 0.02;
    let base = new Float32Array(0), dropUp = new Float32Array(0), dropDown = new Float32Array(0);

    const fit = () => {
      const cw = band.clientWidth || 1000;
      const scale = Math.min(1, 1600 / cw); // full resolution, capped on very wide screens
      w = Math.max(1, Math.round(cw * scale));
      h = Math.max(1, Math.round(band.clientHeight * scale));
      canvas.width = w;
      canvas.height = h;
      img = ctx.createImageData(w, h);
      const n = w * h;
      base = new Float32Array(n);
      dropUp = new Float32Array(n);
      dropDown = new Float32Array(n);
      // lobe size tied to CSS pixels so mobile keeps chunky shapes
      const f1 = 5.5 / Math.max(700, cw);
      const fd = 1 / 26; // droplet cell ≈ 26 css px
      for (let y = 0; y < h; y++) {
        const cy = y / scale, v = y / h;
        for (let x = 0; x < w; x++) {
          const cx = x / scale, i = y * w + x;
          base[i] = v * 1.6 - 0.8 + (edgeNoise(cx * f1, cy * f1 * 1.3, seed) - 0.5) * 1.25;
          // droplets: sharp peaks of a fine noise, a little wobble so they aren't round
          const wob = noise(cx * fd * 3, cy * fd * 3, seed + 41) * 0.25;
          dropUp[i] = Math.max(0, noise(cx * fd, cy * fd, seed + 29) + wob - 0.875) * 8;
          dropDown[i] = Math.max(0, noise(cx * fd, cy * fd, seed + 53) + wob - 0.875) * 8;
        }
      }
      aa = (1.6 / h) * 0.9; // ≈ one pixel of anti-aliasing
      last = -1;
      render(progress());
    };

    // 0 when the band enters from the bottom of the viewport, 1 when it leaves the top
    const progress = () => {
      if (reduce) return 0.5;
      const rect = band.getBoundingClientRect();
      const p = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      return Math.min(1, Math.max(0, p));
    };

    const render = (p: number) => {
      if (!img || Math.abs(p - last) < 0.002) return;
      last = p;
      const data = img.data;
      const shift = (p - 0.5) * 0.9; // scroll pushes the edge upward
      for (let i = 0, n = w * h; i < n; i++) {
        const f = base[i] + shift;
        const near = Math.exp(-f * f * 9); // droplets live in a band around the edge
        let gv = f;
        if (f < 0) gv = f + dropUp[i] * near; // `to` droplets flung into the `from` side
        else gv = f - dropDown[i] * near; // `from` droplets left inside the `to` side
        let a = gv / aa + 0.5;
        a = a < 0 ? 0 : a > 1 ? 1 : a;
        const j = i * 4;
        data[j] = r; data[j + 1] = g; data[j + 2] = b;
        data[j + 3] = (a * 255) | 0;
      }
      ctx.putImageData(img, 0, 0);
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const rect = band.getBoundingClientRect();
        if (rect.bottom < -50 || rect.top > window.innerHeight + 50) return;
        render(progress());
      });
    };
    if (!reduce) window.addEventListener('scroll', onScroll, { passive: true });
    let rw = 0;
    new ResizeObserver(() => {
      if (band.clientWidth === rw && img) return; // ignore height-only jitter
      rw = band.clientWidth;
      fit();
    }).observe(band);
  });
}
