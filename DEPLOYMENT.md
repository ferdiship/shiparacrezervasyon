# 🚀 Deployment Rehberi - Adım Adım

## Hazırlık (5 dakika)

### 1. Gerekli Hesaplar
- [ ] [Supabase](https://supabase.com) hesabı
- [ ] [Vercel](https://vercel.com) hesabı
- [ ] [Resend](https://resend.com) hesabı
- [ ] [GitHub](https://github.com) hesabı (isteğe bağlı ama önerilir)

## Adım 1: Supabase Kurulumu (10 dakika)

### 1.1 Proje Oluştur
1. Supabase'e giriş yap
2. "New Project" tıkla
3. İsim: `aracrez` (veya istediğin isim)
4. Database Password: Güçlü bir şifre oluştur (kaydet!)
5. Region: `Europe (Frankfurt)` (Türkiye'ye en yakın)
6. "Create new project" tıkla
7. ⏰ 2-3 dakika bekle (proje hazırlanıyor)

### 1.2 Veritabanı Şemasını Kur
1. Sol menüden **SQL Editor** tıkla
2. "+ New query" tıkla
3. `supabase/schema.sql` dosyasının içeriğini kopyala
4. SQL Editor'e yapıştır
5. ▶️ **RUN** butonuna bas
6. ✅ "Success. No rows returned" görmelisin

### 1.3 API Bilgilerini Al
1. Sol menüden **Settings** > **API** tıkla
2. Şu bilgileri kopyala ve kaydet:
   - `Project URL` (https://xxxxx.supabase.co)
   - `anon public` key (başı `eyJ` ile başlar, çok uzun)

## Adım 2: Resend Kurulumu (5 dakika)

### 2.1 API Key Al
1. [Resend](https://resend.com) giriş yap
2. **API Keys** tıkla
3. "+ Create API Key" tıkla
4. İsim: `aracrez-production`
5. Permission: `Full Access`
6. "Create" tıkla
7. API Key'i kopyala ve kaydet (tekrar gösterilmeyecek!)
   - Başı `re_` ile başlar

### 2.2 Test E-postası (İsteğe Bağlı)
İlk başta test için: `onboarding@resend.dev` kullanabilirsin
Kendi domain'ini eklemek için:
1. **Domains** > **Add Domain** tıkla
2. Domain'ini ekle (örn: `yourdomain.com`)
3. DNS kayıtlarını ekle
4. Doğrulanmasını bekle

## Adım 3: Kod Güncellemeleri (5 dakika)

### 3.1 Config Dosyasını Güncelle

`js/config.supabase.js` dosyasını aç ve değiştir:

```javascript
// ÖNCEKİ (Değiştir):
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// SONRA (Supabase'den aldığın bilgiler):
const SUPABASE_URL = 'https://xxxxxxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

Admin e-postalarını güncelle:
```javascript
const ADMIN_EMAILS = [
    "senin@emailin.com"  // Buraya kendi email'ini yaz
];
```

### 3.2 Eski Firebase Dosyalarını Sil

```bash
# Terminalde çalıştır:
rm -rf .firebase
rm -rf functions
rm firebase.json
rm .firebaserc

# Eski JS dosyalarını yedekle (ihtiyaç olursa)
mkdir backup_firebase
mv js/config.js backup_firebase/
mv js/auth.js backup_firebase/
mv js/app.js backup_firebase/
```

## Adım 4: Git Repository (5 dakika)

### 4.1 GitHub Repo Oluştur
1. [GitHub](https://github.com) giriş yap
2. "+" > "New repository" tıkla
3. İsim: `aracrez`
4. Private seç
5. "Create repository" tıkla

### 4.2 Kodu Yükle

```bash
# Terminalde proje klasöründe çalıştır:

# Git başlat
git init

# Dosyaları ekle
git add .

# Commit yap
git commit -m "Supabase + Vercel migration"

# GitHub'a bağla (GitHub'dan aldığın URL)
git remote add origin https://github.com/KULLANICI_ADIN/aracrez.git

# Yükle
git push -u origin main
```

## Adım 5: Vercel Deployment (10 dakika)

### 5.1 Vercel CLI Kur

```bash
npm install -g vercel
```

### 5.2 Vercel'e Login

```bash
vercel login
```
- Email'ini gir
- Email'ine gelen linke tıkla

### 5.3 İlk Deploy

```bash
# Proje klasöründe:
vercel
```

Sorulan sorulara cevaplar:
- `Set up and deploy?` → **Y**
- `Which scope?` → Hesabını seç
- `Link to existing project?` → **N**
- `Project name?` → **aracrez** (veya istediğin)
- `In which directory is your code?` → **./** (Enter)
- `Want to override?` → **N**

⏰ Deploy bitiyor... URL verecek (örn: `https://aracrez.vercel.app`)

### 5.4 Environment Variables Ekle

1. [Vercel Dashboard](https://vercel.com/dashboard) aç
2. Projeyi seç (`aracrez`)
3. **Settings** > **Environment Variables** tıkla
4. Şu değişkenleri ekle:

| Key | Value | Environment |
|-----|-------|-------------|
| `RESEND_API_KEY` | `re_xxxxxxxx` | Production |
| `FROM_EMAIL` | `noreply@domain.com` | Production |

5. Her birini ekledikten sonra **Save** bas

### 5.5 Production Deploy

```bash
vercel --prod
```

✅ Canlı URL: `https://aracrez.vercel.app` (veya custom domain)

## Adım 6: Test Et (5 dakika)

### 6.1 Kayıt Ol
1. Siteyi aç (`https://aracrez.vercel.app`)
2. "Kayıt Ol" tıkla
3. Bilgilerini gir
4. Kayıt ol

### 6.2 Supabase'de Kontrol
1. Supabase Dashboard > **Table Editor**
2. `users` tablosunu aç
3. Kullanıcının eklendiğini gör

### 6.3 Rol Değiştir (Admin Yap)
1. Supabase'de `users` tablosunda kendini bul
2. `role` kolonunu `employee` → `admin` yap
3. Sayfayı yenile (F5)
4. ✅ "Yeni Araç Ekle" butonu görünmeli

### 6.4 Araç Ekle
1. "Yeni Araç Ekle" tıkla
2. Araç bilgilerini gir
3. Ekle
4. ✅ Araç listesinde görmeli

### 6.5 Rezervasyon Yap
1. Takvimden tarih seç
2. Araç seç
3. Saat ve not gir
4. Rezervasyon Yap
5. ✅ "Rezervasyonlarım" bölümünde görmeli

### 6.6 E-posta Testi
1. Admin olarak giriş yap
2. "Test E-postası" butonuna tıkla
3. Resend Dashboard'da kontrol et
4. ✅ E-posta gönderilmeli

## Adım 7: Custom Domain (İsteğe Bağlı)

### 7.1 Vercel'de Domain Ekle
1. Vercel Dashboard > Proje > **Settings** > **Domains**
2. "+ Add" tıkla
3. Domain'ini gir (örn: `aracrez.com`)
4. DNS kayıtlarını gösterecek

### 7.2 DNS Ayarları
Domain sağlayıcında (GoDaddy, Namecheap, vs.):
1. A Record ekle:
   - Name: `@`
   - Value: `76.76.21.21`
2. CNAME Record ekle:
   - Name: `www`
   - Value: `cname.vercel-dns.com`

⏰ 5-60 dakika bekle (DNS yayılması)

✅ Artık `https://yourdomain.com` üzerinden çalışıyor!

## 🎉 Tamamlandı!

Sistemin artık canlı! Firebase'e göre avantajlar:
- ✅ $0 aylık maliyet
- ⚡ Daha hızlı
- 🔒 Daha güvenli (RLS)
- 📧 Profesyonel e-posta

## 📊 Sonraki Adımlar

1. **Verileri Taşı**: Firebase'deki eski verileri manuel olarak Supabase'e taşı
2. **Backup**: Supabase'de otomatik backup ayarla
3. **Monitoring**: Vercel Analytics aktif et
4. **Custom Email**: Resend'de kendi domain'ini doğrula

## 🆘 Sorun mu var?

- Supabase çalışmıyor → API URL ve Key'leri kontrol et
- E-posta gitmiyor → Resend API Key Vercel'de var mı?
- Vercel deploy başarısız → `vercel --debug` çalıştır
- RLS hataları → Schema.sql tam çalıştırıldı mı?

**Takılırsan:** README_SUPABASE.md dosyasındaki "Sorun Giderme" bölümüne bak.
