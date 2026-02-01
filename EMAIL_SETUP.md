# E-posta Bildirimi Kurulum Talimatları

## EmailJS Kurulumu

Rezervasyon onay sistemi ve e-posta bildirimleri için EmailJS servisi kullanılmaktadır. Aşağıdaki adımları takip ederek kurulumu tamamlayabilirsiniz:

### 1. EmailJS Hesabı Oluşturma

1. [EmailJS](https://www.emailjs.com/) sitesine gidin
2. Ücretsiz hesap oluşturun
3. Dashboard'a giriş yapın

### 2. E-posta Servisi Ekleme

1. Dashboard'da "Email Services" bölümüne gidin
2. "Add New Service" butonuna tıklayın
3. Gmail, Outlook veya başka bir e-posta sağlayıcısı seçin
4. E-posta hesabınızı bağlayın
5. Service ID'yi not alın (örn: `service_gmail_123`)

### 3. E-posta Şablonu Oluşturma

#### Yeni Rezervasyon Şablonu

```
Konu: Yeni Araç Rezervasyon Talebi

Merhaba {{to_name}},

Yeni bir araç rezervasyon talebi alındı:

Kullanıcı: {{user_name}}
E-posta: {{user_email}}
Araç: {{car_info}}
Tarih: {{reservation_date}}
Saat: {{start_time}} - {{end_time}}
Not: {{note}}

Rezervasyon ID: {{reservation_id}}

Lütfen sisteme giriş yaparak rezervasyonu onaylayın veya reddedin.

İyi çalışmalar,
Araç Rezervasyon Sistemi
```

#### Onay Bildirimi Şablonu

```
Konu: Araç Rezervasyonunuz Onaylandı

Merhaba {{to_name}},

Araç rezervasyonunuz onaylanmıştır:

Araç: {{car_info}}
Tarih: {{reservation_date}}
Saat: {{start_time}} - {{end_time}}

Onaylayan: {{approver_name}}

İyi yolculuklar!
```

#### Red Bildirimi Şablonu

```
Konu: Araç Rezervasyonunuz Reddedildi

Merhaba {{to_name}},

Maalesef araç rezervasyonunuz reddedilmiştir:

Araç: {{car_info}}
Tarih: {{reservation_date}}
Saat: {{start_time}} - {{end_time}}

Red Sebebi: {{rejection_reason}}

Başka bir tarih için yeni rezervasyon yapabilirsiniz.

Saygılarımızla,
{{approver_name}}
```

### 4. Konfigürasyon Güncelleme

`js/config.js` dosyasındaki EMAIL_CONFIG bölümünü güncelleyin:

```javascript
const EMAIL_CONFIG = {
  serviceId: "your_service_id_here", // EmailJS'den aldığınız Service ID
  templateId: "your_template_id_here", // EmailJS'den aldığınız Template ID
  publicKey: "your_public_key_here", // EmailJS'den aldığınız Public Key

  // Onay veren yönetici e-posta adresi
  approverEmail: "frdipolat@gmail.com",
  approverName: "Araç Rezervasyon Yöneticisi",
};
```

### 5. Public Key Alma

1. EmailJS Dashboard'da "Account" bölümüne gidin
2. "API Keys" sekmesine tıklayın
3. Public Key'i kopyalayın

### 6. Test Etme

1. Uygulamayı çalıştırın
2. Yeni bir rezervasyon oluşturun
3. Konsol loglarını kontrol edin
4. E-posta gönderimini test edin

## Önemli Notlar

- EmailJS ücretsiz planında aylık 200 e-posta limiti vardır
- Daha fazla e-posta için ücretli plana geçebilirsiniz
- E-posta şablonlarında HTML formatı da kullanabilirsiniz
- Spam klasörünü kontrol etmeyi unutmayın

## Sorun Giderme

### E-posta Gönderilmiyor

1. Service ID, Template ID ve Public Key'in doğru olduğunu kontrol edin
2. E-posta servisinin aktif olduğunu kontrol edin
3. Konsol hatalarını kontrol edin
4. EmailJS dashboard'da usage limitlerini kontrol edin

### E-posta Spam'e Düşüyor

1. E-posta içeriğini gözden geçirin
2. Gönderen e-posta adresini güvenilir listesine ekleyin
3. SPF/DKIM ayarlarını kontrol edin

## Alternatif Çözümler

EmailJS yerine aşağıdaki alternatifleri de kullanabilirsiniz:

1. **Firebase Functions + Nodemailer**: Sunucu tarafında e-posta gönderimi
2. **SendGrid**: Profesyonel e-posta servisi
3. **Mailgun**: Geliştiriciler için e-posta API'si
4. **AWS SES**: Amazon'un e-posta servisi

Bu alternatiflerin kurulumu daha karmaşık olabilir ancak daha fazla özellik sunar.
