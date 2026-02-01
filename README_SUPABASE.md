# AraçRez - Supabase + Vercel Versiyonu

Firebase'den Supabase + Vercel'e taşınmış modern araç rezervasyon sistemi.

## 🎯 Yeni Özellikler

- ✅ **Tamamen Ücretsiz**: Supabase ve Vercel free tier
- ⚡ **Daha Hızlı**: PostgreSQL performansı
- 🔒 **Row Level Security**: Gelişmiş güvenlik
- 📧 **Resend Email**: Profesyonel e-posta servisi
- 🚀 **Vercel Edge**: Hızlı deployment

## 📋 Kurulum Adımları

### 1. Supabase Projesi Oluştur

1. [Supabase](https://supabase.com) hesabı oluştur
2. Yeni proje oluştur
3. SQL Editor'de `supabase/schema.sql` dosyasını çalıştır
4. Settings > API'den URL ve ANON KEY'i kopyala

### 2. Resend Hesabı Oluştur

1. [Resend](https://resend.com) hesabı oluştur (ücretsiz)
2. API Key oluştur
3. Domain doğrulama yap (veya test için `onboarding@resend.dev` kullan)

### 3. Proje Ayarları

`.env` dosyası oluştur (.env.example'dan kopyala):

```env
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Resend
RESEND_API_KEY=re_xxxxx
FROM_EMAIL=noreply@yourdomain.com
```

`js/config.supabase.js` dosyasını düzenle:
```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

### 4. Vercel Deployment

```bash
# Vercel CLI kur
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

Vercel Dashboard'da Environment Variables ekle:
- `RESEND_API_KEY`
- `FROM_EMAIL`

### 5. Admin Kullanıcıları

`js/config.supabase.js` dosyasında `ADMIN_EMAILS` dizisini güncelle:

```javascript
const ADMIN_EMAILS = [
    "admin@yourdomain.com"
];
```

## 🗄️ Veritabanı Yapısı

### Users Tablosu
```sql
- id (UUID, PK)
- name (TEXT)
- email (TEXT, UNIQUE)
- role (TEXT: 'admin' | 'employee')
- created_at (TIMESTAMPTZ)
```

### Cars Tablosu
```sql
- id (UUID, PK)
- plate (TEXT, UNIQUE)
- brand (TEXT)
- model (TEXT)
- year (INTEGER)
- color (TEXT)
- image_url (TEXT)
- added_by (UUID, FK)
- created_at (TIMESTAMPTZ)
```

### Reservations Tablosu
```sql
- id (UUID, PK)
- car_id (UUID, FK)
- user_id (UUID, FK)
- user_name (TEXT)
- user_email (TEXT)
- date (DATE)
- start_time (TIME)
- end_time (TIME)
- note (TEXT)
- status (TEXT: 'pending' | 'approved' | 'rejected' | 'canceled')
- rejection_reason (TEXT)
- created_at (TIMESTAMPTZ)
```

## 📧 E-posta Servisi

E-postalar Vercel Serverless Function (`api/send-email.js`) üzerinden Resend API ile gönderilir.

**Tetiklenen Durumlar:**
- Yeni rezervasyon talebi (Admin'e)
- Rezervasyon onayı (Kullanıcıya)
- Rezervasyon reddi (Kullanıcıya)

## 🔒 Güvenlik (RLS)

Supabase Row Level Security politikaları:

- **Cars**: 
  - Herkes okuyabilir
  - Sadece adminler ekleyebilir/güncelleyebilir/silebilir

- **Reservations**:
  - Herkes okuyabilir
  - Kullanıcılar kendi rezervasyonlarını oluşturabilir
  - Kullanıcılar sadece pending rezervasyonlarını güncelleyebilir
  - Adminler tüm rezervasyonları yönetebilir

## 🚀 Yerel Geliştirme

```bash
# Bağımlılıkları kur
npm install

# Vercel dev server başlat
vercel dev
```

http://localhost:3000 adresinde çalışacaktır.

## 📁 Dosya Yapısı

```
aracrez_yedek/
├── api/
│   └── send-email.js          # Vercel serverless function
├── css/
│   └── style.css              # Stil dosyası
├── js/
│   ├── config.supabase.js     # Supabase config
│   ├── auth.supabase.js       # Auth işlemleri
│   └── app.supabase.js        # Ana uygulama
├── supabase/
│   └── schema.sql             # Veritabanı şeması
├── index.html                 # Ana sayfa
├── vercel.json                # Vercel config
├── package.json               # NPM config
└── .env                       # Environment variables
```

## 🔄 Firebase'den Geçiş

### Veri Taşıma

1. Firebase'den verileri export et:
```bash
firebase firestore:export backup/
```

2. Supabase'e import et (manuel):
- Users: Auth kullanıcılarını manuel oluştur
- Cars: SQL INSERT komutları ile ekle
- Reservations: SQL INSERT komutları ile ekle

### Eski Dosyaları Temizle

```bash
# Firebase dosyalarını sil
rm -rf .firebase/
rm -rf functions/
rm firebase.json
rm .firebaserc

# Eski JS dosyalarını sil
rm js/config.js
rm js/auth.js
rm js/app.js
```

## 💰 Maliyet Karşılaştırması

| Servis | Firebase | Supabase + Vercel |
|--------|----------|-------------------|
| Database | $25/ay | **$0** (500MB) |
| Auth | $0 | **$0** (50K users) |
| Functions | $0.40/milyon | **$0** (100K req) |
| Hosting | $0 | **$0** (100GB) |
| Email | - | **$0** (3K/ay Resend) |
| **TOPLAM** | **~$25+/ay** | **$0/ay** |

## 🐛 Sorun Giderme

### E-postalar gitmiyor
- Resend API key'i doğru mu?
- Vercel environment variables ayarlandı mı?
- Domain doğrulaması yapıldı mı?

### RLS hataları
- Kullanıcı giriş yaptı mı?
- `supabase/schema.sql` tam çalıştırıldı mı?

### Vercel deployment başarısız
```bash
vercel --debug
```

## 📞 Destek

Sorun yaşarsanız:
1. [Supabase Docs](https://supabase.com/docs)
2. [Vercel Docs](https://vercel.com/docs)
3. [Resend Docs](https://resend.com/docs)

## 📄 Lisans

MIT License
