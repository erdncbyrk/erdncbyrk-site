// Tek yerden düzenlenen içerik. [KÖŞELİ PARANTEZ] içindekiler doldurulacak yer tutuculardır.

export const site = {
  name: 'Erdinç Bayrak',
  url: 'https://erdncbyrk.com',
  city: 'Bursa',
  companyName: '[Şahıs şirketi unvanı]',
  email: '[e-posta adresiniz]',
  whatsappUrl: 'https://wa.me/90[telefon-numaraniz]',
  orderFormUrl: '#basla', // Sipariş formu hazır olunca (Tally, Google Forms vb.) buraya bağlantı gelecek
  linkedin: 'https://www.linkedin.com/in/[kullanici-adi]',
  github: 'https://github.com/erdncbyrk',
  cvUrl: '/cv.pdf',
  projectUrl: '#',
  title: 'Erdinç Bayrak · Küçük işletmeler için web siteleri · Bursa',
  description:
    'Bursa ve tüm Türkiye’deki küçük işletmeler için sabit fiyatlı, 7 günde yayında, hızlı ve mobil uyumlu web siteleri. Toplantı yok, pazarlık yok.',
};

/** Hero altındaki bilgi şeridi: hepsi gerçek, uydurma istatistik yok */
export const facts = [
  { value: '2018', label: 'den beri teknik işlerde' },
  { value: '7 gün', label: 'formdan yayına' },
  { value: '2 tur', label: 'düzeltme dahil' },
  { value: 'Sabit', label: 'fiyat, sayfada yazar' },
];

/**
 * Google / Trustindex yorumları (hero altı kayan kartlar + bilgi şeridindeki puan rozeti).
 * `ornek: true` olanlar SADECE `npm run dev` içinde "ÖRNEK" etiketiyle görünür; `npm run build` çıktısına girmez.
 * Gerçek yorumu girerken metni müşterinin yazdığı gibi aynen yapıştırın ve `ornek` satırını silin.
 * Puan rozeti de aynı kuralla çalışır: gerçek puanı yazıp `ornek: true` satırını silin.
 */
export type Review = { name: string; role: string; source: 'google' | 'trustindex'; stars: number; text: string; url?: string; ornek?: boolean };

export const reviews = {
  googleUrl: '', // Google İşletme Profili yorum bağlantısı
  trustindexUrl: '', // Trustindex sayfası (varsa)
  rating: { value: '5.0', ornek: true },
  items: [
    {
      name: 'Örnek Müşteri 1',
      role: 'Tadilat · Bursa',
      source: 'google',
      stars: 5,
      text: 'ÖRNEK METİN — gerçek yorumla değiştirilecek. Formu doldurduk, bir hafta sonra site yayındaydı. Süreç boyunca her adımı yazılı olarak bildirdi, toplantıya gerek kalmadı.',
      ornek: true,
    },
    {
      name: 'Örnek Müşteri 2',
      role: 'Psikolojik danışmanlık',
      source: 'google',
      stars: 5,
      text: 'ÖRNEK METİN — gerçek yorumla değiştirilecek. Randevu talepleri artık doğrudan siteden geliyor. Fiyat baştan belliydi, sonradan ek ücret çıkmadı.',
      ornek: true,
    },
    {
      name: 'Örnek Müşteri 3',
      role: 'Nakliye',
      source: 'trustindex',
      stars: 5,
      text: 'ÖRNEK METİN — gerçek yorumla değiştirilecek. Telefonda hızlı açılan, sade bir site istedik; tam olarak bu teslim edildi. İki düzeltme turu da hızlıca yapıldı.',
      ornek: true,
    },
    {
      name: 'Örnek Müşteri 4',
      role: 'Diş kliniği',
      source: 'google',
      stars: 5,
      text: 'ÖRNEK METİN — gerçek yorumla değiştirilecek. Google’da artık kliniğimiz çıkıyor. Alan adı ve giriş bilgileri bize teslim edildi, her şey bizim adımıza kayıtlı.',
      ornek: true,
    },
  ] as Review[],
};

/** Yayında gösterilecekler: dev ortamında hepsi, build'de yalnızca gerçek (ornek olmayan) yorumlar */
export const visibleReviews = reviews.items.filter((r) => import.meta.env.DEV || !r.ornek);
export const showRating = import.meta.env.DEV || !reviews.rating.ornek;

export const sectors = ['Tadilat', 'Nakliye', 'Psikolog', 'Diş kliniği', 'Avukat', 'Mali müşavir', 'Kafe', 'Oto servis', 'Güzellik salonu', 'Veteriner', 'Mimarlık', 'Özel ders'];

/** 7 günlük yöntem: yatay kayan adımlar */
export const method = [
  {
    key: 'F', name: 'Form', no: '01',
    lead: 'Her site 10 dakikalık bir formla başlar.',
    points: ['toplantı yok, telefon trafiği yok', 'logo, fotoğraf ve hizmetler tek yerde', 'eksik bilgi varsa ben sorarım'],
  },
  {
    key: 'Ö', name: 'Önizleme', no: '02',
    lead: '3. gün sitenizi kendi telefonunuzda açarsınız.',
    points: ['taslak görsel değil, çalışan site', 'gerçek cihazda, gerçek hızda', 'bağlantıyı dilediğinize gösterin'],
  },
  {
    key: 'D', name: 'Düzeltme', no: '03',
    lead: 'İki tur düzeltme. Sınırlar baştan net.',
    points: ['değişiklikler tek listede', 'her madde tek tek işaretlenir', 'paket dışı istek yazılı fiyatlanır'],
  },
  {
    key: 'Y', name: 'Yayın', no: '04',
    lead: '7. gün alan adınızda yayında.',
    points: ['Google İşletme Profili bağlanır', 'hız raporu ve giriş bilgileri teslim', 'site ve alan adı sizin'],
  },
];

/** Teşhis bölümü: sorun seçilir, çözüm yazılır */
export const frictions = [
  { q: 'Google’da çıkmıyorum', a: 'Site Google için kurulur, İşletme Profili bağlanır. Aramada da haritada da görünürsünüz.' },
  { q: 'Eski sitem telefonda bozuk', a: 'Önce telefon için tasarlanır. Mobil PageSpeed hedefi 95+, teslimde raporuyla.' },
  { q: 'Instagram yeter sanıyordum', a: 'Instagram vitrindir, site dükkândır. Fiyat, bölge, referans ve arama butonu tek sayfada.' },
  { q: 'Siteyi yapan kayboldu', a: 'Alan adı ve tüm şifreler sizin adınıza. Bakım paketiyle muhatabınız hep belli.' },
  { q: 'Ajanslar çok pahalı', a: 'Fiyat sabit ve sayfada yazar. Toplantı yok, teklif turu yok, sürpriz fatura yok.' },
  { q: 'Hiç vaktim yok', a: '10 dakikalık form yeterli. Gerisini ben hallederim, 7 gün sonra yayındasınız.' },
];

export type Plan = {
  name: string;
  blurb: string;
  price: string;
  unit: string;
  features: string[];
  cta: string;
  featured?: boolean;
};

export const plans: Plan[] = [
  {
    name: 'Tanıtım',
    blurb: 'Tek sayfada kim olduğunuz, ne yaptığınız, nasıl ulaşılacağı.',
    price: '[FİYAT]',
    unit: 'TL + KDV',
    features: ['tek sayfa, 5 bölüm', 'arama ve WhatsApp butonu', 'alan adı ve 1 yıl barındırma', '2 tur düzeltme'],
    cta: 'Tanıtım ile başla',
  },
  {
    name: 'İşletme',
    blurb: 'Hizmetlerinizi tek tek anlatan, Google için kurulmuş site.',
    price: '[FİYAT]',
    unit: 'TL + KDV',
    features: ['5 sayfaya kadar', 'teklif veya randevu formu', 'Google İşletme Profili kurulumu', 'SEO ve yapay zekâ aramaları için yapı', 'alan adı ve 1 yıl barındırma', '2 tur düzeltme'],
    cta: 'İşletme ile başla',
    featured: true,
  },
  {
    name: 'Bakım',
    blurb: 'Site yayındayken güncel, güvenli ve hızlı kalsın.',
    price: '[FİYAT]',
    unit: 'TL + KDV / ay',
    features: ['ayda 2 içerik güncellemesi', 'yedekleme ve güvenlik takibi', 'barındırma yenilemesi dahil', 'aylık ziyaret ve talep raporu'],
    cta: 'Bakım ekle',
  },
];

export const faqs = [
  { q: 'Alan adı ve site kime ait olur?', a: 'Size. Alan adı sizin adınıza kaydedilir, tüm yönetim bilgileri teslimde verilir.' },
  { q: 'Sonradan değişiklik isterseniz ne olur?', a: 'Bakım paketinde aylık güncellemeler dahildir. Paket yoksa her değişiklik önceden yazılı olarak fiyatlandırılır.' },
  { q: 'Fotoğraf ve metinleri kim hazırlar?', a: 'Siz formdan temel bilgileri verirsiniz, metinleri ben düzenlerim. Fotoğrafınız yoksa işinize uygun görseller seçilir.' },
  { q: 'Fatura kesiyor musunuz?', a: 'Evet. Tüm hizmetler şahıs şirketim üzerinden faturalandırılır.' },
  { q: 'Sadece Bursa’ya mı hizmet veriyorsunuz?', a: 'Hayır. Süreç tamamen online yürüdüğü için Türkiye’nin her yerinden işletmelerle çalışıyorum.' },
];
