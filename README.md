# erdncbyrk.com

Küçük işletmeler için sabit fiyatlı web sitesi hizmetinin tanıtım sitesi. Astro + Tailwind CSS.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ klasörüne statik çıktı
```

İçerik (fiyatlar, paketler, SSS, iletişim) tek dosyada: `src/data/site.ts`.
Proje yapısı, tasarım kuralları ve yapılacaklar listesi: `CLAUDE.md`.

## Yayın (Cloudflare Pages)
1. Cloudflare Pages → Create project → bu GitHub deposunu bağla
2. Framework preset: Astro · Build command: `npm run build` · Output: `dist`
3. Custom domains → `erdncbyrk.com`
