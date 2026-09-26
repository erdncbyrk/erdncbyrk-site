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

/** Pinned "neden" bölümünde derinlikten geçen kartlar */
export const problems = [
  { icon: 'search', title: 'Google’da çıkmıyorsunuz', text: '“Bursa tadilat” yazan müşteri rakibinizin sitesine gidiyor. Siz listede yoksunuz.' },
  { icon: 'phone', title: 'Eski site telefonda açılmıyor', text: 'Ziyaretçilerin çoğu telefondan geliyor. Yavaş ve dağınık bir sayfa ilk 3 saniyede kaybettiriyor.' },
  { icon: 'insta', title: 'Instagram sayfası yetmiyor', text: 'Fiyat, hizmet bölgesi, referans… Müşteri aradığını bulamayınca başka yere soruyor.' },
  { icon: 'map', title: 'Haritada rakip önde', text: 'Google İşletme Profili eksik ya da siteye bağlı değil. Yol tarifi ve arama rakibe gidiyor.' },
  { icon: 'clock', title: 'Siteyi yapan ulaşılamıyor', text: 'Küçük bir değişiklik için haftalarca beklemek. Şifreler, alan adı, hosting başkasının elinde.' },
  { icon: 'tag', title: 'Fiyat belirsiz, süreç uzun', text: 'Ajanslarda toplantı, teklif, revizyon derken aylar geçiyor. Esnafın buna vakti yok.' },
];

/** Büyük rakamlar bölümü: hepsi sözleşmeye yazılan sözler, istatistik değil */
export const numbers = [
  { value: 7, suffix: ' gün', label: 'Formdan yayına', note: 'Bilgileriniz tamamlandıktan sonra' },
  { value: 2, suffix: ' tur', label: 'Düzeltme dahil', note: 'Değişiklikler tek listede' },
  { value: 95, suffix: '+', label: 'PageSpeed hedefi', note: 'Mobil ölçüm, teslimde raporla' },
  { value: 0, suffix: '', label: 'Toplantı', note: 'Tüm süreç form ve mesajla' },
];

export const audiences = [
  { icon: 'hammer', title: 'Tadilat ve inşaat' },
  { icon: 'truck', title: 'Nakliye' },
  { icon: 'heart', title: 'Psikolog ve danışman' },
  { icon: 'tooth', title: 'Klinik ve sağlık' },
  { icon: 'scale', title: 'Avukat ve mali müşavir' },
  { icon: 'cup', title: 'Kafe ve restoran' },
  { icon: 'wrench', title: 'Oto servis' },
  { icon: 'scissors', title: 'Güzellik ve bakım' },
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
    features: ['Ayda 2 içerik güncellemesi', 'Yedekleme ve güvenlik takibi', 'Barındırma yenilemesi dahil', 'Aylık ziyaret ve talep raporu'],
    cta: 'Bakım ekle',
  },
];

export const steps = [
  { day: 'Gün 0', title: 'Sipariş formunu doldurun', text: 'İşletme bilgileri, logo, fotoğraflar ve hizmetler tek formda. Yaklaşık 10 dakika.' },
  { day: 'Gün 3', title: 'Canlı önizlemeyi açın', text: 'Çalışan sitenizin bağlantısı telefonunuza gelir. Gerçek cihazda, gerçek hızda görürsünüz.' },
  { day: 'Gün 4–6', title: 'Düzeltmeleri iletin', text: 'Değişiklikleri tek listede yazarsınız. İki tur düzeltme pakete dahildir.' },
  { day: 'Gün 7', title: 'Yayına alın', text: 'Site alan adınızda açılır. Hız raporu, giriş bilgileri ve Google kaydı size teslim edilir.' },
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
