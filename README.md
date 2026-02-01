# 🚗 AraçRez - Araç Rezervasyon Sistemi

> Firebase'den Supabase + Vercel'e taşınmış modern, ücretsiz araç rezervasyon sistemi

[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Resend](https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=minutemailer&logoColor=white)](https://resend.com)

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Hızlı Başlangıç](#-hızlı-başlangıç)
- [Kurulum](#-kurulum)
- [Deployment](#-deployment)
- [Maliyet](#-maliyet)
- [Belgeler](#-belgeler)

## ✨ Özellikler

### Kullanıcı Özellikleri
- ✅ Kullanıcı kayıt ve giriş
- ✅ Araç listesi görüntüleme
- ✅ Takvim üzerinde rezervasyon
- ✅ Kendi rezervasyonlarını görüntüleme
- ✅ E-posta bildirimleri

### Admin Özellikleri
- ✅ Araç ekleme/düzenleme/silme
- ✅ Rezervasyon onaylama/reddetme
- ✅ Tüm rezervasyonları yönetme
- ✅ İstatistikler ve raporlar

### Teknik Özellikler
- ⚡ **Supabase**: PostgreSQL veritabanı + Auth
- 🚀 **Vercel**: Otomatik deployment + CDN
- 📧 **Resend**: Profesyonel e-posta servisi
- 🔒 **Row Level Security**: Gelişmiş güvenlik
- 📱 **Responsive**: Mobil uyumlu tasarım
- 🌐 **Real-time**: Anlık güncelleme desteği

## ⚡ Hızlı Başlangıç

**5 dakikada çalıştır!**

```bash
# 1. Kodu indir
git clone https://github.com/yourusername/aracrez.git
cd aracrez

# 2. Config dosyasını düzenle
# js/config.supabase.js içinde:
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - ADMIN_EMAILS

# 3. Deploy et
npm install -g vercel
vercel login
vercel --prod
```

Detaylı adımlar: [`QUICKSTART.md`](QUICKSTART.md)

## 📦 Kurulum

### Gereksinimler
- Supabase hesabı (ücretsiz)
- Vercel hesabı (ücretsiz)
- Resend hesabı (ücretsiz - 3K email/ay)
- Node.js 18+ (sadece deployment için)

### Adım Adım

1. **Supabase Projesi**
   ```bash
   # SQL Editor'de çalıştır:
   supabase/schema.sql
   ```

2. **Environment Variables**
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbG...
   RESEND_API_KEY=re_xxxxx
   FROM_EMAIL=noreply@domain.com
   ```

3. **Vercel Deploy**
   ```bash
   vercel --prod
   ```

Tüm adımlar: [`DEPLOYMENT.md`](DEPLOYMENT.md)

## 🚀 Deployment

### Vercel (Önerilen)

```bash
# İlk deployment
vercel

# Production deployment
vercel --prod
```

### Manuel Hosting

Statik dosyalar olarak herhangi bir host'a yüklenebilir:
- Netlify
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront

**Not:** Serverless function (`api/send-email.js`) için Vercel veya benzeri gerekli.

## 💰 Maliyet

| Servis | Limit | Maliyet |
|--------|-------|---------|
| **Supabase** | 500MB DB, 50K users | **$0/ay** |
| **Vercel** | 100GB bandwidth, 100K requests | **$0/ay** |
| **Resend** | 3K email/ay | **$0/ay** |
| **Domain** (opsiyonel) | - | ~$10/yıl |
| **TOPLAM** | | **$0/ay** ✅ |

### Firebase Karşılaştırması

| | Firebase | Supabase + Vercel |
|-|----------|-------------------|
| Database | $25/ay | **$0** |
| Auth | $0 | **$0** |
| Functions | $0.40/1M | **$0** (100K) |
| Hosting | $0 | **$0** |
| Email | ~$10/ay | **$0** (3K/ay) |
| **TOPLAM** | **$35+/ay** | **$0/ay** |

**Tasarruf:** $420/yıl 💰

## 📚 Belgeler

| Dosya | Açıklama |
|-------|----------|
| [`QUICKSTART.md`](QUICKSTART.md) | 5 dakikalık hızlı başlangıç |
| [`DEPLOYMENT.md`](DEPLOYMENT.md) | Adım adım deployment rehberi |
| [`README_SUPABASE.md`](README_SUPABASE.md) | Detaylı Supabase dokümantasyonu |
| [`MIGRATION_GUIDE.md`](MIGRATION_GUIDE.md) | Firebase → Supabase geçiş rehberi |

## 🗂️ Dosya Yapısı

```
aracrez/
├── api/
│   └── send-email.js          # Vercel serverless function (Email)
├── css/
│   └── style.css              # Stil dosyası
├── js/
│   ├── config.supabase.js     # Supabase konfigürasyonu
│   ├── auth.supabase.js       # Authentication
│   └── app.supabase.js        # Ana uygulama mantığı
├── supabase/
│   └── schema.sql             # Veritabanı şeması
├── index.html                 # Ana sayfa
├── vercel.json                # Vercel konfigürasyonu
├── package.json               # NPM dependencies
├── .env.example               # Environment variables örneği
└── README.md                  # Bu dosya
```

## 🔒 Güvenlik

### Row Level Security (RLS)

Supabase RLS politikaları ile güvenlik sağlanır:

- **Cars**: Herkes okuyabilir, sadece adminler yazabilir
- **Reservations**: Kullanıcılar kendi rezervasyonlarını yönetir
- **Users**: Kullanıcılar sadece kendi profilini düzenleyebilir

### Environment Variables

Hassas bilgiler environment variables'da saklanır:
- Supabase keys
- Resend API key
- Email addresses

## 🐛 Sorun Giderme

### E-postalar Gitmiyor
- [ ] Resend API key doğru mu?
- [ ] Vercel environment variables var mı?
- [ ] Domain doğrulandı mı?

### RLS Hataları
- [ ] Kullanıcı giriş yaptı mı?
- [ ] Schema.sql tam çalıştırıldı mı?
- [ ] Doğru role sahip mi?

### Vercel Deploy Başarısız
```bash
# Debug mode
vercel --debug

# Logları kontrol et
vercel logs
```

Daha fazla: [`DEPLOYMENT.md`](DEPLOYMENT.md#sorun-giderme)

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing`)
5. Pull Request açın

## 📞 Destek

- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Resend Docs](https://resend.com/docs)

## 📄 Lisans

MIT License - Detaylar için [`LICENSE`](LICENSE) dosyasına bakın.

## 🙏 Teşekkürler

- [Supabase](https://supabase.com) - Açık kaynak Firebase alternatifi
- [Vercel](https://vercel.com) - Frontend deployment platformu
- [Resend](https://resend.com) - Modern email API

---

**⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!**

Made with ❤️ for Ship Global Lojistik
