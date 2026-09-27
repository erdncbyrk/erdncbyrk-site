# erdncbyrk.com — proje notları (Claude Code için)

Erdinç Bayrak'ın (Bursa) küçük işletmelere sabit fiyatlı web sitesi sattığı tek sayfalık vitrin sitesi.
Hedef kitle: tadilat, nakliye, psikolog, klinik gibi yerel esnaf. Dil: Türkçe. Ton: sade, net, premium.

## Teknoloji
- Astro 7 (statik çıktı, `dist/`), Tailwind CSS v4 (`@tailwindcss/vite`), `@astrojs/sitemap`
- Fontlar npm'den self-host: Geist Mono Variable (başlıklar, 800), JetBrains Mono Variable (gövde). Tüm site monospace.
- Hareket: GSAP 3 + ScrollTrigger, Lenis ve iki canvas: noktalı dünya (`src/scripts/globe.ts`, kara noktaları `src/data/land-points.json`, üretmek için `node scripts/land-points.mjs`) ve parçacık bulutu; bağlantılar `src/scripts/motion.ts` içinde. Framework (React vb.) eklenmeyecek.
- Tasarım referansı: weevolveit.com (monospace, kömür/kırık beyaz bölümler, fuşya vurgu). Önceki Orchid referanslı sürüm `yon-orchid` dalında.

## Komutlar
- `npm run dev` → http://localhost:4321
- `npm run build` → `dist/`
- `npm run preview`

## Yapı
- `src/data/site.ts` — TÜM içerik (bilgi şeridi, sektörler, yöntem adımları, teşhis soruları, paketler, SSS, iletişim). Metin değişiklikleri önce buradan.
- `src/styles/global.css` — token'lar (`@theme`: coal, snow, paper, pink), `.display`, `.label`, `.btn-pink`, `.btn-line`, `.dotgrid`, `.marquee`, `.caret`.
- `src/layouts/Base.astro` — head, SEO meta, JSON-LD, `<head>` içinde `motion-on`/`motion-off` sınıfı, motion.ts yüklemesi.
- `src/components/` — Nav (hap menü: ortada kapsül, fareyle kayan vurgu `data-menu-glow`, görünen bölüm pembe noktayla işaretlenir; sağda kaydırma yüzdesi), Hero (küre + bilgi şeridi + sektör kayan yazısı), Method (parçacıklı giriş + yatay kayan 4 adım), Audit (sorun seç → çözüm yazılsın), Packages, About, Faq, Footer (CTA halkası + alt bilgi).
- `src/scripts/motion.ts` data öznitelikleri: `data-globe`, `data-particles` (`data-variant="ring"`), `data-hero-line`, `data-scramble` (başlık harf karıştırma), `data-type` (yazılan satır), `data-fade`, `data-hscroll`/`-pin`/`-track`, `data-step-dot`, `data-progress`/`-bar`, `data-nav`, `data-fill-btn` + `data-fill` (imleçten dolan buton). `canvas[data-ripple]` (`src/scripts/ripple.ts`): bölümün noktalı zeminini çizer, boş yere tıklanınca su dalgası yayar.
- Bölüm geçişleri: `src/components/Splash.astro` (`to` = sonraki bölümün rengi), iki bölüm arasına konan sıfır yükseklikli işaretçi. Üstteki bölümün son ekranını kaplayan katmanda `to` rengi, `Base.astro` içindeki `#ink-edge` SVG filtresiyle (feTurbulence + feDisplacementMap + alfa eşiği) mürekkep gibi yırtık kenarla alttan yükselir; ScrollTrigger (`motion.ts`) ile 1,5 ekranlık kaydırmada 0→1. Animasyon kapalıyken gizlenir. Renk değişen her sınıra bir `<Splash>` koy.

## Tasarım kuralları
- Koyu bölümler `coal #171717` + `paper #F0F0F8`; açık bölümler `snow #F6F6F8` + `coal`. Tek vurgu `pink #E4007C`, başlık sonundaki nokta `<span class="dot">.</span>`.
- Bölüm etiketleri `[ ETİKET ]` biçiminde `.label`. Başlıklar `.display` (Geist Mono 800, sıkı).
- Uydurma istatistik, müşteri yorumu veya logo KULLANILMAZ. Sadece gerçek bilgiler (2018'den beri, 7 gün, sabit fiyat).
- Animasyonlar `prefers-reduced-motion` ile kapanır: yatay kaydırma dikey listeye döner, canvas'lar tek kare çizilir. Bunu bozma.
- Tailwind yardımcılarını ezmesi gereken kurallar `@layer` dışında yazılır.
- Mobilde yatay kaydırma olmamalı (390px'de kontrol et).

## Yapılacaklar (sırayla)
1. `src/data/site.ts` içindeki [KÖŞELİ PARANTEZ] yer tutucularını doldur: fiyatlar, şirket unvanı, e-posta, LinkedIn.
2. Gerçek fotoğrafı `public/` altına ekle, `About.astro` içindeki yer tutucuyu `<img>` (Astro `<Image>`) ile değiştir.
3. `public/cv.pdf` ekle.
4. Sipariş formu: Tally veya benzeri bir form kur, bağlantısını `site.orderFormUrl`'e yaz.
5. `/kvkk` sayfası (KVKK aydınlatma metni) oluştur.
6. `site.whatsappUrl` içine gerçek numarayı yaz. Sektör demo siteleri (`tadilat-demo.erdncbyrk.com` vb.) hazır olunca ana sayfaya bir çalışmalar bölümü eklenecek.
7. OG görseli (`public/og.png`, 1200×630) ve `og:image` meta etiketi.
8. Yayın: Cloudflare Pages (build: `npm run build`, çıktı: `dist`), erdncbyrk.com alan adını bağla.
9. Yayından sonra PageSpeed Insights ile mobil 95+ doğrula.
