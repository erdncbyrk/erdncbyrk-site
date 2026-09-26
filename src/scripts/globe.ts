import landPoints from '../data/land-points.json';

type Vec = [number, number, number];
type Mouse = { nx: number; ny: number };

const toVec = (lat: number, lon: number): Vec => {
  const la = (lat * Math.PI) / 180, lo = (lon * Math.PI) / 180;
  return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
};

const BURSA: Vec = toVec(40.18, 29.06);
// connection targets (mostly Türkiye, a few abroad)
const TARGETS: Vec[] = [
  [41.01, 28.98], [39.93, 32.86], [38.42, 27.14], [36.9, 30.7], [37.0, 35.32], [39.9, 41.27],
  [52.52, 13.4], [51.5, -0.12], [25.2, 55.27], [48.85, 2.35], [41.9, 12.5],
].map(([a, b]) => toVec(a, b));

const slerp = (a: Vec, b: Vec, s: number): Vec => {
  const d = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const om = Math.acos(d);
  if (om < 1e-4) return a;
  const sa = Math.sin((1 - s) * om) / Math.sin(om), sb = Math.sin(s * om) / Math.sin(om);
  return [a[0] * sa + b[0] * sb, a[1] * sa + b[1] * sb, a[2] * sa + b[2] * sb];
};

/**
 * Dotted-earth globe: land as lit dots, soft sphere body, bright rim,
 * and animated arcs out of Bursa. Returns a draw(t) function.
 */
export function createGlobe(canvas: HTMLCanvasElement, label: HTMLElement | null, mouse: Mouse) {
  const pts: Vec[] = [];
  const raw = landPoints as number[];
  for (let i = 0; i < raw.length; i += 2) pts.push(toVec(raw[i], raw[i + 1]));

  let ctx = canvas.getContext('2d')!;
  let w = 0, h = 0;
  const fit = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx = canvas.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  fit();
  window.addEventListener('resize', fit);


  // ---- rotation state: auto spin + drag with inertia + a little mouse parallax ----
  let yaw = -0.5, pitch = 0.42; // start with Türkiye facing us
  let vYaw = 0, vPitch = 0; // radians per ms, from dragging
  let offYaw = 0, offPitch = 0; // parallax offset (not accumulated)
  let dragging = false, lastX = 0, lastY = 0, lastMoveT = 0, lastT = 0;
  const AUTO = -0.00004; // gentle westward spin
  const SENS = 0.0055; // radians per pixel dragged (scaled by globe size below)
  let sens = SENS;

  let curR = 0;
  // only the sphere itself is draggable; the empty corners of the canvas belong to the background
  const onSphere = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)) <= curR * 1.04;
  };
  (canvas as HTMLCanvasElement & { onSphere?: (e: PointerEvent) => boolean }).onSphere = onSphere;
  canvas.style.touchAction = 'pan-y'; // vertical swipes still scroll the page on phones
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) canvas.style.cursor = onSphere(e) ? 'grab' : '';
  });
  canvas.addEventListener('pointerdown', (e) => {
    if (!onSphere(e)) return;
    dragging = true;
    lastX = e.clientX; lastY = e.clientY; lastMoveT = performance.now();
    vYaw = vPitch = 0;
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = 'grabbing';
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const now = performance.now();
    const dx = e.clientX - lastX, dy = e.clientY - lastY, dt = Math.max(1, now - lastMoveT);
    yaw += dx * sens;
    pitch = Math.max(-1.2, Math.min(1.2, pitch + dy * sens));
    vYaw = (dx * sens) / dt;
    vPitch = (dy * sens) / dt;
    lastX = e.clientX; lastY = e.clientY; lastMoveT = now;
  });
  const end = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    if (performance.now() - lastMoveT > 80) vYaw = vPitch = 0; // released without flicking
    canvas.style.cursor = 'grab';
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);

  return (t: number) => {
    const R = Math.min(w / 2.7, h / 2.6);
    curR = R;
    sens = 1.6 / Math.max(120, R); // same feel at any globe size
    const cx = w / 2, cy = h / 2;
    ctx.clearRect(0, 0, w, h);

    const dt = lastT ? Math.min(50, t - lastT) : 16;
    lastT = t;
    if (!dragging) {
      yaw += (AUTO + vYaw) * dt;
      pitch = Math.max(-1.2, Math.min(1.2, pitch + vPitch * dt));
      const decay = Math.pow(0.94, dt / 16);
      vYaw *= decay; vPitch *= decay;
      // ease pitch back toward a pleasant tilt once the flick has died down
      if (Math.abs(vPitch) < 1e-5) pitch += (0.42 - pitch) * 0.01;
      offYaw += (mouse.nx * 0.18 - offYaw) * 0.05;
      offPitch += (mouse.ny * 0.12 - offPitch) * 0.05;
    }
    const Y = yaw + offYaw, P = pitch + offPitch;
    const cyw = Math.cos(Y), syw = Math.sin(Y), cp = Math.cos(P), sp = Math.sin(P);
    const rot = (v: Vec): Vec => {
      const x = v[0] * cyw + v[2] * syw, z = -v[0] * syw + v[2] * cyw;
      return [x, v[1] * cp - z * sp, v[1] * sp + z * cp];
    };
    const px = (v: Vec, k = 1) => [cx + v[0] * R * k, cy - v[1] * R * k] as const;

    // outer glow
    const glow = ctx.createRadialGradient(cx, cy, R * 0.95, cx, cy, R * 1.3);
    glow.addColorStop(0, 'rgba(240,240,248,0.07)');
    glow.addColorStop(1, 'rgba(240,240,248,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(cx, cy, R * 1.3, 0, Math.PI * 2); ctx.fill();


    // sphere body
    const body = ctx.createRadialGradient(cx + R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
    body.addColorStop(0, '#1f1f1f');
    body.addColorStop(0.7, '#151515');
    body.addColorStop(1, '#111111');
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();

    // land dots: dim in the middle, bright toward the lit rim (top-right)
    for (const p of pts) {
      const v = rot(p);
      if (v[2] <= 0) continue;
      const rim = 1 - v[2];
      const light = Math.max(0, v[0] * 0.55 + v[1] * 0.65 + v[2] * 0.2);
      const a = 0.22 + Math.pow(rim, 1.8) * 0.78 * (0.3 + 0.7 * light) + light * 0.16;
      const s = 1 + rim * 0.6;
      ctx.fillStyle = `rgba(240,240,248,${Math.min(1, a).toFixed(3)})`;
      const [x, y] = px(v);
      ctx.fillRect(x, y, s, s);
    }

    // rim light
    const rimG = ctx.createLinearGradient(cx - R, cy + R, cx + R, cy - R);
    rimG.addColorStop(0, 'rgba(240,240,248,0.05)');
    rimG.addColorStop(1, 'rgba(240,240,248,0.55)');
    ctx.strokeStyle = rimG;
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();

    // arcs out of Bursa
    const b = rot(BURSA);
    TARGETS.forEach((tv, i) => {
      const cycle = ((t * 0.00025 + i * 0.37) % 1.6);
      const head = Math.min(1, cycle), tail = Math.max(0, cycle - 0.6);
      if (head <= tail) return;
      ctx.beginPath();
      let started = false;
      for (let s = tail; s <= head; s += 0.02) {
        const m = slerp(BURSA, tv, s);
        const lift = 1 + Math.sin(Math.PI * s) * (0.08 + 0.12 * (i % 3) / 2);
        const v = rot([m[0] * lift, m[1] * lift, m[2] * lift]);
        if (v[2] < -0.05 && Math.hypot(v[0], v[1]) < 1) { started = false; continue; }
        const [x, y] = px(v);
        if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(228,0,124,0.55)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });


    // Bursa marker + label
    if (b[2] > 0) {
      const [x, y] = px(b);
      const pulse = 4 + ((t * 0.004) % 8);
      ctx.strokeStyle = `rgba(228,0,124,${(1 - pulse / 12).toFixed(2)})`;
      ctx.beginPath(); ctx.arc(x, y, pulse, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#E4007C';
      ctx.beginPath(); ctx.arc(x, y, 2.6, 0, Math.PI * 2); ctx.fill();
      if (label) {
        label.style.opacity = '1';
        label.style.transform = `translate(${canvas.offsetLeft + x + 14}px, ${canvas.offsetTop + y - 34}px)`;
      }
    } else if (label) label.style.opacity = '0';
  };
}
