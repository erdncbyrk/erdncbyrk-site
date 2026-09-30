# bayrakdijital.com.tr — proje notları (Claude Code için)

Alan adı: **bayrakdijital.com.tr** (`site.url`, `astro.config.mjs`, `public/robots.txt`). Eski erdncbyrk.com buraya 301 ile yönlendirilecek. Depo adı `erdncbyrk-site` olarak kaldı.

Marka: **Bayrak Dijital** (`site.brand`; logo `bayrak` + soluk `dijital` + pembe nokta, favicon "b"). Kurucu Erdinç Bayrak (`site.name`, Hakkımda bölümü kişisel kalır). Bursa'da küçük işletmelere sabit fiyatlı web sitesi satan tek sayfalık vitrin sitesi.
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
- `npm run dev:vpn` / `npm run preview:vpn` → tüm ağ arayüzlerinde dinler (WireGuard üzerinden `http://<PC-wg-IP>:4321`); Windows Güvenlik Duvarı'nda 4321 için gelen kuralı gerekir.

## Yapı
- `src/data/site.ts` — TÜM içerik (bilgi şeridi, sektörler, yöntem adımları, teşhis soruları, paketler, SSS, iletişim). Metin değişiklikleri önce buradan.
- `src/styles/global.css` — token'lar (`@theme`: coal, snow, paper, pink), `.display`, `.label`, `.btn-pink`, `.btn-line`, `.dotgrid`, `.marquee`, `.caret`.
- `src/layouts/Base.astro` — head, SEO meta, JSON-LD, `<head>` içinde `motion-on`/`motion-off` sınıfı, motion.ts yüklemesi.
- `src/components/` — Nav (tek hap: logo, ortada düz bağlantılar — üzerine gelince ince alt çizgi, görünen bölüm parlak + çizgili; sağda kaydırma yüzdesi), Hero (küre + bilgi şeridi — kenarında dönen iki ışık çizgisi `.spark` + ★ puan rozeti + `Reviews.astro` kayan Google/Trustindex yorum kartları + sektör kayan yazısı), Method (tam ekran giriş: başlığın etrafında dönen parçacık girdabı — bölüm girerken dağınıktan toplanır, kaydırınca hızlanır, fareyle itilir; + yatay kayan 4 adım), Audit (sorun seç → çözüm yazılsın), Packages, About, Faq, Footer (CTA halkası + alt bilgi).
- `src/scripts/motion.ts` data öznitelikleri: `data-globe`, `data-particles` (`data-variant="ring"`), `data-hero-line`, `data-scramble` (başlık harf karıştırma), `data-type` (yazılan satır), `data-fade`, `data-hscroll`/`-pin`/`-track`, `data-step-dot`, `data-progress`/`-bar`, `data-nav`, `data-fill-btn` + `data-fill` (imleçten dolan buton). `canvas[data-ripple]` (`src/scripts/ripple.ts`): bölümün noktalı zeminini çizer, boş yere tıklanınca su dalgası yayar.
- Bölüm geçişleri: `src/components/Splash.astro` (`to` = sonraki bölümün rengi), iki bölüm arasına konan sıfır yükseklikli işaretçi. Üstteki bölümün son ekranını kaplayan katmanda `to` rengi, `Base.astro` içindeki `#ink-edge` SVG filtresiyle (feTurbulence + feDisplacementMap + alfa eşiği) mürekkep gibi yırtık kenarla alttan yükselir; ScrollTrigger (`motion.ts`) ile 'top 40%'tan başlayıp 1,5 ekranlık kaydırmada 0→1; Hero altında pb-[30vh] boşluk bu yüzden var. Animasyon kapalıyken gizlenir. Renk değişen her sınıra bir `<Splash>` koy.

## Tasarım kuralları
- Koyu bölümler `coal #171717` + `paper #F0F0F8`; açık bölümler `snow #F6F6F8` + `coal`. Tek vurgu `pink #E4007C`, başlık sonundaki nokta `<span class="dot">.</span>`.
- Bölüm etiketleri `[ ETİKET ]` biçiminde `.label`. Başlıklar `.display` (Geist Mono 800, sıkı).
- Uydurma istatistik, müşteri yorumu veya logo KULLANILMAZ. Sadece gerçek bilgiler (8+ yıl deneyim — 2018'den beri, 7 gün, sabit fiyat garantisi, 1 yıl ücretsiz destek — kapsamı SSS'de: hata giderme, alan adı/e-posta/barındırma sorunları, sorular; içerik değişikliği Bakım paketinde).
- Yorumlar `site.ts → reviews`: `ornek: true` kayıtlar ve puan yalnızca `npm run dev`de "ÖRNEK" etiketiyle görünür, build çıktısına girmez. Gerçek yorum girilince metin aynen yapıştırılır ve `ornek` satırı silinir; bu korumayı kaldırma.
- Animasyonlar `prefers-reduced-motion` ile kapanır: yatay kaydırma dikey listeye döner, canvas'lar tek kare çizilir. Bunu bozma.
- Tailwind yardımcılarını ezmesi gereken kurallar `@layer` dışında yazılır.
- Mobilde yatay kaydırma olmamalı (390px'de kontrol et).

## Yapılacaklar (sırayla)
1. `src/data/site.ts` içindeki [KÖŞELİ PARANTEZ] yer tutucularını doldur: fiyatlar, şirket unvanı (KVKK için), LinkedIn. E-posta: info@bayrakdijital.com.tr — alan adı tanımlanınca Cloudflare Email Routing ile Gmail'e yönlendir.
2. Gerçek fotoğrafı `public/` altına ekle, `About.astro` içindeki yer tutucuyu `<img>` (Astro `<Image>`) ile değiştir.
3. `public/cv.pdf` ekle.
4. Sipariş formu: Tally veya benzeri bir form kur, bağlantısını `site.orderFormUrl`'e yaz.
5. `/kvkk` sayfası (KVKK aydınlatma metni) oluştur.
6. Gerçek Google/Trustindex yorumlarını ve puanı `site.ts → reviews` içine gir (`googleUrl` dahil).
7. `site.whatsappUrl` içine gerçek numarayı yaz. Sektör demo siteleri (`tadilat-demo.bayrakdijital.com.tr` vb.) hazır olunca ana sayfaya bir çalışmalar bölümü eklenecek.
8. OG görseli (`public/og.png`, 1200×630) ve `og:image` meta etiketi.
9. Yayın: Cloudflare Pages (build: `npm run build`, çıktı: `dist`). bayrakdijital.com.tr'yi Cloudflare'e ekle (kayıt firmasında nameserver'ları Cloudflare'inkilerle değiştir), Pages → Custom domains'e `bayrakdijital.com.tr` ve `www` ekle. erdncbyrk.com'u da Cloudflare'e alıp Redirect Rule ile 301 yönlendir. İstenirse bayrakdijital.com da alınıp yönlendirilsin.
10. Yayından sonra PageSpeed Insights ile mobil 95+ doğrula.
