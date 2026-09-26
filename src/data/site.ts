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
