// Builds src/data/land-points.json: evenly spread points (Fibonacci sphere) that fall on land.
// Run: node scripts/land-points.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { feature } from 'topojson-client';
import { geoContains } from 'd3-geo';

const topo = JSON.parse(readFileSync(new URL('../node_modules/world-atlas/land-110m.json', import.meta.url)));
const land = feature(topo, topo.objects.land);
const N = 46000;
const out = [];
const golden = Math.PI * (3 - Math.sqrt(5));
for (let i = 0; i < N; i++) {
  const y = 1 - (i / (N - 1)) * 2;
  const r = Math.sqrt(1 - y * y);
  const th = golden * i;
  const lat = (Math.asin(y) * 180) / Math.PI;
  const lon = ((((Math.atan2(Math.sin(th) * r, Math.cos(th) * r) * 180) / Math.PI) + 540) % 360) - 180;
  if (lat < -60) continue; // skip Antarctica for a cleaner silhouette
  if (geoContains(land, [lon, lat])) out.push(Math.round(lat * 10) / 10, Math.round(lon * 10) / 10);
}
writeFileSync(new URL('../src/data/land-points.json', import.meta.url), JSON.stringify(out));
console.log('points', out.length / 2);
