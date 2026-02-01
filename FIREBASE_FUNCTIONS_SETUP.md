# Firebase Functions + Nodemailer Kurulum Talimatları

## 🚀 Kurulum Adımları

### 1. Gmail App Password Oluşturma

Firebase Functions'ın Gmail üzerinden e-posta gönderebilmesi için App Password gereklidir:

1. **Google Hesabınıza gidin**: https://myaccount.google.com/
2. **Güvenlik** sekmesine tıklayın
3. **2 Adımlı Doğrulama**'yı etkinleştirin (gerekli)
4. **Uygulama şifreleri** bölümüne gidin
5. **Uygulama seçin** → **Diğer (özel ad)**
6. "Araç Rezervasyon Sistemi" yazın
7. **Oluştur** butonuna tıklayın
8. Oluşturulan 16 haneli şifreyi kopyalayın

### 2. Firebase Functions Konfigürasyonu

`functions/src/index.ts` dosyasındaki EMAIL_CONFIG bölümünü güncelleyin:

```typescript
const EMAIL_CONFIG = {
  service: "gmail",
  user: "frdipolat@gmail.com", // Gönderen e-posta adresi
  pass: "YOUR_16_DIGIT_APP_PASSWORD", // Gmail App Password'ü buraya yazın
  approverEmail: "frdipolat@gmail.com",
  approverName: "Araç Rezervasyon Yöneticisi",
};
```

### 3. Firebase Functions Deploy

Terminal'de functions klasörüne gidin ve deploy edin:

```bash
cd functions
npm run build
firebase deploy --only functions
```

### 4. Firebase Functions URL'lerini Güncelleme

Deploy işlemi tamamlandıktan sonra, `js/config.js` dosyasındaki URL'leri güncelleyin:

```javascript
const FUNCTIONS_BASE_URL =
  "https://us-central1-arazrezervasyon.cloudfunctions.net";
```

## 📧 E-posta Sistemi Nasıl Çalışır?

### Otomatik Tetiklenmeler

1. **Yeni Rezervasyon**:

   - Kullanıcı rezervasyon oluşturur
   - Firebase Database'e kayıt eklenir
   - `onReservationCreated` fonksiyonu otomatik tetiklenir
   - Yöneticiye e-posta gönderilir

2. **Rezervasyon Onay/Red**:
   - Yönetici rezervasyonu onaylar/reddeder
   - Firebase Database'de durum güncellenir
   - `onReservationUpdated` fonksiyonu otomatik tetiklenir
   - Kullanıcıya e-posta gönderilir

### Manuel E-posta Gönderimi

Test amaçlı manuel e-posta gönderebilirsiniz:

```javascript
// Test e-postası
window.sendTestEmail();

// Manuel rezervasyon e-postası
fetch(
  "https://us-central1-arazrezervasyon.cloudfunctions.net/sendReservationEmail",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reservationId: "RESERVATION_ID",
      type: "new", // 'new', 'approved', 'rejected'
    }),
  }
);
```

## 🔧 Geliştirme ve Test

### Local Test

Functions'ı local olarak test etmek için:

```bash
cd functions
npm run serve
```

### Logs Görüntüleme

Firebase Functions loglarını görüntülemek için:

```bash
firebase functions:log
```

### Debug

Konsol loglarını kontrol edin:

- Browser Console (client-side)
- Firebase Console → Functions → Logs (server-side)

## 📋 E-posta Şablonları

### Yeni Rezervasyon (Yöneticiye)

- **Konu**: Yeni Araç Rezervasyon Talebi
- **İçerik**: Kullanıcı bilgileri, araç detayları, rezervasyon saatleri

### Onay Bildirimi (Kullanıcıya)

- **Konu**: Araç Rezervasyonunuz Onaylandı ✅
- **İçerik**: Onaylanan rezervasyon detayları

### Red Bildirimi (Kullanıcıya)

- **Konu**: Araç Rezervasyonunuz Reddedildi ❌
- **İçerik**: Red sebebi ve rezervasyon detayları

## 🛡️ Güvenlik

### Firebase Security Rules

Database kurallarınızı kontrol edin:

```json
{
  "rules": {
    "reservations": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "cars": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

### CORS Ayarları

Functions'lar otomatik olarak CORS'u destekler, ek ayar gerekmez.

## 🚨 Sorun Giderme

### E-posta Gönderilmiyor

1. **Gmail App Password**: Doğru şifre kullanıldığından emin olun
2. **2FA**: Gmail hesabında 2 adımlı doğrulama aktif olmalı
3. **Functions Deploy**: Functions'ların başarıyla deploy edildiğini kontrol edin
4. **Logs**: Firebase Console'da hata loglarını kontrol edin

### Functions Çalışmıyor

1. **Build Hatası**: `npm run build` komutunu çalıştırın
2. **Deploy Hatası**: `firebase deploy --only functions` tekrar deneyin
3. **Permissions**: Firebase projesinde Functions API'sinin aktif olduğunu kontrol edin

### Database Triggers Çalışmıyor

1. **Path**: Trigger path'lerinin doğru olduğunu kontrol edin
2. **Data Structure**: Rezervasyon verilerinin beklenen formatta olduğunu kontrol edin
3. **Permissions**: Functions'ın database'e erişim yetkisi olduğunu kontrol edin

## 💰 Maliyet

### Firebase Functions Fiyatlandırması

- **Ücretsiz Katman**: Aylık 2M çağrı, 400.000 GB-saniye
- **Ücretli**: Çağrı başına $0.0000004, GB-saniye başına $0.0000025

### Gmail Limitleri

- **Günlük Limit**: 500 e-posta (ücretsiz Gmail hesabı)
- **Saatlik Limit**: 100 e-posta

## 🔄 Alternatif E-posta Servisleri

Gmail yerine başka servisler de kullanabilirsiniz:

### SendGrid

```typescript
const transporter = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: "apikey",
    pass: "YOUR_SENDGRID_API_KEY",
  },
});
```

### Mailgun

```typescript
const transporter = nodemailer.createTransport({
  service: "Mailgun",
  auth: {
    user: "YOUR_MAILGUN_USERNAME",
    pass: "YOUR_MAILGUN_PASSWORD",
  },
});
```

### AWS SES

```typescript
const transporter = nodemailer.createTransport({
  SES: new AWS.SES({
    apiVersion: "2010-12-01",
    region: "us-east-1",
  }),
});
```

## 📞 Destek

Sorun yaşarsanız:

1. Firebase Console → Functions → Logs kontrol edin
2. Browser Console'da hata mesajlarını kontrol edin
3. Gmail hesabınızın güvenlik ayarlarını kontrol edin
4. Functions'ların doğru deploy edildiğini kontrol edin
