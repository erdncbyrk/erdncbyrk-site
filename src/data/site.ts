// Tek yerden düzenlenen içerik. [KÖŞELİ PARANTEZ] içindekiler doldurulacak yer tutuculardır.

export const site = {
  name: 'Erdinç Bayrak',
  url: 'https://erdncbyrk.com',
  city: 'Bursa',
  companyName: '[Şahıs şirketi unvanı]',
  email: '[e-posta adresiniz]',
  orderFormUrl: '#basla', // Sipariş formu hazır olunca (Tally, Google Forms vb.) buraya bağlantı gelecek
  linkedin: 'https://www.linkedin.com/in/[kullanici-adi]',
  github: 'https://github.com/erdncbyrk',
  cvUrl: '/cv.pdf',
  projectUrl: '#',
  title: 'Erdinç Bayrak · Küçük işletmeler için web siteleri · Bursa',
  description:
    'Bursa ve tüm Türkiye’deki küçük işletmeler için sabit fiyatlı, 7 günde yayında, hızlı ve mobil uyumlu web siteleri. Toplantı yok, pazarlık yok.',
};

export const sectors = ['Tadilat', 'Nakliye', 'Psikolog', 'Diş kliniği', 'Avukat', 'Kafe', 'Oto servis', 'Güzellik salonu', 'Veteriner', 'Mimarlık'];

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
    features: ['Tek sayfa, 5 bölüm', 'Arama ve WhatsApp butonu', 'Alan adı ve 1 yıl barındırma', '2 tur düzeltme'],
    cta: 'Tanıtım ile başla',
  },
  {
    name: 'İşletme',
    blurb: 'Hizmetlerinizi tek tek anlatan, Google için kurulmuş site.',
    price: '[FİYAT]',
    unit: 'TL + KDV',
    features: [
      '5 sayfaya kadar',
      'Teklif veya randevu formu',
      'Google İşletme Profili kurulumu',
      'SEO ve yapay zekâ aramaları için yapı',
      'Alan adı ve 1 yıl barındırma',
      '2 tur düzeltme',
    ],
    cta: 'İşletme ile başla',
    featured: true,
  },
  {
    name: 'Bakım',
    blurb: 'Site yayındayken güncel, güvenli ve hızlı kalsın.',
    price: '[FİYAT]',
    unit: 'TL + KDV / ay',
    features: ['Ayda 2 içerik güncellemesi', 'Yedekleme ve güvenlik takibi', 'Barındırma yenilemesi dahil', 'Aylık hız ve ziyaret raporu'],
    cta: 'Bakım ekle',
  },
];

export const steps = [
  { day: 'GÜN 0', title: 'Sipariş formu', text: 'İşletme bilgileri, logo, fotoğraflar ve hizmetler tek formda.' },
  { day: 'GÜN 3', title: 'Canlı önizleme', text: 'Çalışan sitenizin bağlantısı telefonunuza gelir.' },
  { day: 'GÜN 4–6', title: 'Düzeltmeler', text: 'Değişiklikleri tek listede iletirsiniz. İki tur dahil.' },
  { day: 'GÜN 7', title: 'Yayında', text: 'Alan adınızda açılır, hız raporu ve giriş bilgileri teslim edilir.' },
];

export const faqs = [
  {
    q: 'Alan adı ve site kime ait olur?',
    a: 'Size. Alan adı sizin adınıza kaydedilir, tüm yönetim bilgileri teslimde verilir.',
  },
  {
    q: 'Sonradan değişiklik isterseniz ne olur?',
    a: 'Bakım paketinde aylık güncellemeler dahildir. Paket yoksa her değişiklik önceden yazılı olarak fiyatlandırılır.',
  },
  {
    q: 'Fotoğraf ve metinleri kim hazırlar?',
    a: 'Siz formdan temel bilgileri verirsiniz, metinleri ben düzenlerim. Fotoğrafınız yoksa işinize uygun görseller seçilir.',
  },
  {
    q: 'Fatura kesiyor musunuz?',
    a: 'Evet. Tüm hizmetler şahıs şirketim üzerinden faturalandırılır.',
  },
  {
    q: 'Sadece Bursa’ya mı hizmet veriyorsunuz?',
    a: 'Hayır. Süreç tamamen online yürüdüğü için Türkiye’nin her yerinden işletmelerle çalışıyorum.',
  },
];
