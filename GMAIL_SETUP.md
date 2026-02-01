# 📧 Gmail SMTP Kurulum Rehberi

Gmail üzerinden ücretsiz e-posta gönderimi için adım adım kurulum.

## Adım 1: Gmail App Password Oluştur (2 dakika)

### 1.1 Google Hesap Güvenliği
1. https://myaccount.google.com adresine git
2. Sol menüden **Güvenlik** seç

### 1.2 2 Adımlı Doğrulama (Gerekli)
**Eğer zaten aktifse bu adımı atla**

1. **Güvenlik** sayfasında **2 Adımlı Doğrulama** bul
2. **Başlayın** tıkla
3. Telefon numaranı doğrula
4. Aktif et

### 1.3 Uygulama Şifresi Oluştur
1. **Güvenlik** sayfasına geri dön
2. **Google'da oturum açma** bölümünde **Uygulama şifreleri** bul
   - Bulamıyorsan arama kutusuna "uygulama şifreleri" yaz
3. **Uygulama şifreleri** tıkla
4. Uygulama seç: **Mail**
5. Cihaz seç: **Diğer (Özel ad)** → `AraçRez` yaz
6. **Oluştur** tıkla
7. 16 haneli şifreyi kopyala

```
Örnek: abcd efgh ijkl mnop
```

⚠️ **ÖNEMLI:** Bu şifreyi bir yere kaydet, tekrar gösterilmeyecek!

---

## Adım 2: Vercel Environment Variables

### 2.1 Vercel Dashboard'a Git
1. https://vercel.com/dashboard
2. Projenizi seç (`aracrez`)
3. **Settings** > **Environment Variables** tıkla

### 2.2 Değişkenleri Ekle

**1. Gmail Kullanıcı Adı:**
- Key: `GMAIL_USER`
- Value: `ferdi@shipglobaltr.com` (kendi Gmail adresin)
- Environment: `Production` seç
- **Save** tıkla

**2. Gmail App Password:**
- Key: `GMAIL_APP_PASSWORD`
- Value: `abcdejghijklmnop` (boşluksuz, 16 hane)
- Environment: `Production` seç
- **Save** tıkla

### 2.3 Yeniden Deploy
```bash
vercel --prod
```

veya Vercel Dashboard'da **Deployments** > **Redeploy**

---

## Adım 3: Test Et

### 3.1 Sisteme Giriş Yap
1. Sitenize gidin
2. Admin olarak giriş yapın

### 3.2 Test E-postası Gönder
1. "Test E-postası" butonuna tıkla
2. Birkaç saniye bekle
3. Gmail hesabınızı kontrol edin

✅ **Başarılı!** E-posta geldi mi?

### 3.3 Rezervasyon Testi
1. Yeni rezervasyon oluştur
2. Admin hesabınıza bildirim gelecek
3. Rezervasyonu onayla/reddet
4. Kullanıcıya bildirim gidecek

---

## 📊 Gmail Limitleri

| Limit | Miktar |
|-------|--------|
| **Günlük gönderim** | 500 email/gün |
| **Dakikalık gönderim** | ~100 email/dakika |
| **Maliyet** | **$0 (ücretsiz)** |

**Not:** Normal kullanım için yeterli. 500+ email/gün gerekirse Google Workspace ($6/ay) alın.

---

## 🔧 Sorun Giderme

### E-posta Gitmiyor

**1. App Password Kontrolü**
```bash
# Vercel loglarını kontrol et
vercel logs
```

Hata: `Invalid login`
- ✅ App Password'u doğru kopyaladınız mı?
- ✅ Boşlukları kaldırdınız mı? (`abcdejghijklmnop`)
- ✅ 2FA aktif mi?

**2. Gmail Hesap Kontrolü**
- ✅ 2 Adımlı Doğrulama aktif mi?
- ✅ "Güvenli olmayan uygulamalara izin ver" kapalı mı? (App Password ile gerek yok)

**3. Vercel Environment Variables**
- ✅ `GMAIL_USER` doğru mu?
- ✅ `GMAIL_APP_PASSWORD` doğru mu?
- ✅ Production environment'ta var mı?

**4. Yeniden Deploy**
```bash
vercel --prod
```

---

## 🔐 Güvenlik

### App Password Güvenliği
- ✅ App Password sadece bu uygulama için
- ✅ Ana Gmail şifreniz değil
- ✅ İstediğiniz zaman iptal edebilirsiniz
- ✅ Ana hesabınıza erişim vermez

### App Password İptal Etmek
1. https://myaccount.google.com
2. **Güvenlik** > **Uygulama şifreleri**
3. `AraçRez` yanındaki **Kaldır** tıkla

---

## 💰 Maliyet Karşılaştırması

| Servis | Limit | Maliyet |
|--------|-------|---------|
| **Gmail SMTP** | 500/gün | **$0** ✅ |
| Resend | 3K/ay | $0 |
| SendGrid | 100/gün | $0 |
| Mailgun | 100/gün | $0 |
| Google Workspace | Sınırsız | $6/ay |

**Gmail SMTP en basit ve ücretsiz çözüm!**

---

## ✅ Kontrol Listesi

- [ ] Gmail'de 2FA aktif
- [ ] App Password oluşturuldu (16 hane)
- [ ] Vercel'de `GMAIL_USER` eklendi
- [ ] Vercel'de `GMAIL_APP_PASSWORD` eklendi
- [ ] `vercel --prod` ile deploy edildi
- [ ] Test e-postası başarılı
- [ ] Rezervasyon bildirimi çalışıyor

---

## 🎉 Tamamlandı!

Artık Gmail üzerinden tamamen **ücretsiz** e-posta gönderebilirsiniz!

**Avantajlar:**
- ✅ Ücretsiz (500 email/gün)
- ✅ DNS değişikliği yok
- ✅ Güvenilir (Google altyapısı)
- ✅ Kurulumu 5 dakika

**Sorularınız için:** README_SUPABASE.md
