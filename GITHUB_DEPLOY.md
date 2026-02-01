# 🚀 GitHub + Vercel Deployment Rehberi

## Adım 1: Proje Hazırlığı (1 dk)

### .gitignore Kontrolü
`.gitignore` dosyası zaten hazır. Şu dosyalar GitHub'a **GİTMEYECEK**:
- ✅ `node_modules/`
- ✅ `.env` (şifreler)
- ✅ `.firebase/` (eski)

---

## Adım 2: GitHub Repository Oluştur (2 dk)

### 2.1 GitHub'da Yeni Repo
1. https://github.com → Giriş yap
2. Sağ üst köşe **+** > **New repository**
3. Repository bilgileri:
   ```
   Repository name: aracrez
   Description: Araç Rezervasyon Sistemi - Supabase + Vercel
   ✓ Private (önerilir)
   ✗ Initialize with README (hayır, zaten var)
   ```
4. **Create repository** tıkla

### 2.2 GitHub URL'sini Kopyala
```
https://github.com/KULLANICI_ADIN/aracrez.git
```

---

## Adım 3: Git Başlat ve Push (3 dk)

### 3.1 Terminal'i Aç
Proje klasöründe:
```bash
d:\yazilim\aracrez_yedek
```

### 3.2 Git Komutları

```bash
# 1. Git'i başlat
git init

# 2. Tüm dosyaları ekle
git add .

# 3. İlk commit
git commit -m "Initial commit - Supabase + Vercel migration"

# 4. Main branch'e geç (eğer master ise)
git branch -M main

# 5. GitHub'a bağla (kendi URL'nizi kullanın)
git remote add origin https://github.com/KULLANICI_ADIN/aracrez.git

# 6. GitHub'a yükle
git push -u origin main
```

### ⚠️ İlk Push'ta Kimlik Doğrulama

**Windows'ta:**
- GitHub kullanıcı adı sor
- Şifre yerine **Personal Access Token** kullan

**Token Yoksa Oluştur:**
1. GitHub > Settings > Developer settings
2. Personal access tokens > Tokens (classic)
3. Generate new token (classic)
4. Seç: `repo` (tüm izinler)
5. Generate token → Kopyala ve sakla

---

## Adım 4: Vercel'e GitHub'dan Deploy (2 dk)

### 4.1 Vercel Dashboard
1. https://vercel.com → Giriş yap (GitHub ile)

### 4.2 Yeni Proje
1. **Add New...** > **Project**
2. **Import Git Repository** seç
3. GitHub'dan `aracrez` reposunu seç
4. **Import** tıkla

### 4.3 Proje Ayarları
```
Framework Preset: Other
Root Directory: ./
Build Command: (boş bırak)
Output Directory: (boş bırak)
Install Command: npm install
```

### 4.4 Environment Variables Ekle
**Henüz Deploy etmeyin!** Önce şunları ekleyin:

| Key | Value |
|-----|-------|
| `GMAIL_USER` | `ferdi@shipglobaltr.com` |
| `GMAIL_APP_PASSWORD` | `abcdejghijklmnop` |

**Deploy** tıkla!

⏰ 1-2 dakika bekle...

✅ **Live URL:** `https://aracrez.vercel.app`

---

## Adım 5: Otomatik Deployment (Bonus)

### 🎯 Artık Her Git Push Otomatik Deploy!

```bash
# Kod değişikliği yap
nano js/config.supabase.js

# Commit et
git add .
git commit -m "Config güncellendi"

# Push et
git push

# Vercel otomatik deploy eder! 🚀
```

**Deployment durumunu izle:**
- Vercel Dashboard > Deployments
- Veya GitHub'da commit yanında ✅ işareti

---

## 📋 Hızlı Komutlar

### İlk Kurulum
```bash
cd d:\yazilim\aracrez_yedek
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADIN/aracrez.git
git push -u origin main
```

### Sonraki Güncellemeler
```bash
# Değişiklikleri ekle
git add .

# Commit yap
git commit -m "Açıklama buraya"

# Push et (otomatik deploy!)
git push
```

---

## 🔧 Sorun Giderme

### Git'te Kimlik Sorunu
```bash
# Git config ayarla
git config --global user.name "Adınız"
git config --global user.email "email@example.com"
```

### Remote Already Exists
```bash
# Mevcut remote'u sil
git remote remove origin

# Yeniden ekle
git remote add origin https://github.com/KULLANICI_ADIN/aracrez.git
```

### Push Permission Denied
- GitHub Personal Access Token kullan (şifre yerine)
- Token oluştur: GitHub > Settings > Developer settings > Tokens

### Vercel Deploy Başarısız
```bash
# Loglara bak
https://vercel.com/KULLANICI_ADIN/aracrez/deployments

# Environment variables kontrol et
Settings > Environment Variables
```

---

## ✅ Kontrol Listesi

### GitHub
- [ ] Repository oluşturuldu
- [ ] `.gitignore` kontrol edildi
- [ ] İlk commit yapıldı
- [ ] GitHub'a push edildi
- [ ] Repository private mi? (güvenlik için)

### Vercel
- [ ] GitHub reposu import edildi
- [ ] `GMAIL_USER` eklendi
- [ ] `GMAIL_APP_PASSWORD` eklendi
- [ ] İlk deployment başarılı
- [ ] Live URL çalışıyor

### Test
- [ ] Siteye erişim var
- [ ] Kayıt/Giriş çalışıyor
- [ ] Supabase bağlantısı OK
- [ ] E-posta gönderimi çalışıyor

---

## 🎉 Tamamlandı!

**Artık:**
- ✅ Kod GitHub'da güvende
- ✅ Her push otomatik deploy
- ✅ Vercel CDN ile hızlı
- ✅ HTTPS otomatik

**Bir sonraki adım:**
- Custom domain ekle (isteğe bağlı)
- Supabase veritabanını doldur
- Kullanıcıları davet et!

---

## 📚 Faydalı Komutlar

```bash
# Repository durumu
git status

# Commit geçmişi
git log --oneline

# Branch listesi
git branch -a

# Son commit'i geri al (dikkatli!)
git reset --soft HEAD~1

# Değişiklikleri gör
git diff

# GitHub URL'sini gör
git remote -v
```

---

## 💡 İpuçları

### 1. Commit Mesajları
```bash
# İyi örnekler:
git commit -m "Gmail SMTP eklendi"
git commit -m "Supabase schema güncellendi"
git commit -m "Bug fix: rezervasyon tarihi"

# Kötü örnekler:
git commit -m "update"
git commit -m "fix"
git commit -m "asdasd"
```

### 2. Sık Push Yapın
```bash
# Her küçük değişiklikten sonra push edin
# Vercel otomatik deploy eder, geri almak kolay
```

### 3. Preview Deployments
- Her branch ayrı URL alır
- Production etkilenmeden test edin
- `git checkout -b test-feature`

---

## 🔗 Faydalı Linkler

- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Vercel Docs](https://vercel.com/docs)
- [GitHub Docs](https://docs.github.com)
