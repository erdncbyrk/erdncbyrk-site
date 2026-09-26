# erdncbyrk.com — proje notları (Claude Code için)

Erdinç Bayrak'ın (Bursa) küçük işletmelere sabit fiyatlı web sitesi sattığı tek sayfalık vitrin sitesi.
Hedef kitle: tadilat, nakliye, psikolog, klinik gibi yerel esnaf. Dil: Türkçe. Ton: sade, net, premium.

## Teknoloji
- Astro 7 (statik çıktı, `dist/`), Tailwind CSS v4 (`@tailwindcss/vite`), `@astrojs/sitemap`
- Fontlar npm'den self-host: Geist Variable (gövde), Geist Mono Variable (etiket/rakam), Instrument Serif (italik vurgular)
- JS minimum: yalnızca `Base.astro` içindeki IntersectionObserver ile `.reveal` animasyonu. Framework (React vb.) eklenmeyecek.

## Komutlar
- `npm run dev` → http://localhost:4321
- `npm run build` → `dist/`
- `npm run preview`

## Yapı
- `src/data/site.ts` — TÜM içerik (fiyatlar, paketler, SSS, süreç, iletişim). Metin değişiklikleri önce buradan.
- `src/styles/global.css` — renk/font token'ları (`@theme`), `.silk`, `.accent`, `.glass`, `.card`, `.btn-silk`, `.btn-ghost`, `.reveal`, animasyonlar.
- `src/layouts/Base.astro` — head, SEO meta, JSON-LD (ProfessionalService + FAQPage), reveal script.
- `src/components/` — Nav, Hero (perspektif vitrin), Marquee, Bento, Work (sektör örnekleri), Packages, Process, About, Faq, Footer (CTA + alt bilgi).

## Tasarım kuralları
- Zemin `ink #0A0C0B`; vurgu "ipek" şampanya-altın (`silk`, `silk-deep`, `gold`); ikincil `mint` (başarı/yayında), `bursa` yeşili ışık hüzmelerinde.
- Başlıklar Geist 500, sıkı harf aralığı; vurgu kelimeler `<span class="accent">` veya `<span class="silk">` (serif italik).
- Animasyonlar `prefers-reduced-motion` ile kapanır; `.reveal` JS yoksa görünür kalır. Bunu bozma.
- Mobilde yatay kaydırma olmamalı (390px'de kontrol et).

## Yapılacaklar (sırayla)
1. `src/data/site.ts` içindeki [KÖŞELİ PARANTEZ] yer tutucularını doldur: fiyatlar, şirket unvanı, e-posta, LinkedIn.
2. Gerçek fotoğrafı `public/` altına ekle, `About.astro` içindeki yer tutucuyu `<img>` (Astro `<Image>`) ile değiştir.
3. `public/cv.pdf` ekle.
4. Sipariş formu: Tally veya benzeri bir form kur, bağlantısını `site.orderFormUrl`'e yaz.
5. `/kvkk` sayfası (KVKK aydınlatma metni) oluştur.
6. Sektör demo siteleri: `tadilat-demo.erdncbyrk.com` vb.; `Work.astro` kartlarındaki `href="#"` bunlara bağlanacak.
7. OG görseli (`public/og.png`, 1200×630) ve `og:image` meta etiketi.
8. Yayın: Cloudflare Pages (build: `npm run build`, çıktı: `dist`), erdncbyrk.com alan adını bağla.
9. Yayından sonra PageSpeed Insights ile mobil 95+ doğrula.
