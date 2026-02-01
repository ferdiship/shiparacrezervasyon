# ⚡ Hızlı Başlangıç (5 Dakika)

## 🎯 En Hızlı Yöntem

### 1. Hesapları Hazırla (2 dk)
```bash
# Tarayıcıda aç:
- https://supabase.com → Kayıt ol
- https://resend.com → Kayıt ol  
- https://vercel.com → GitHub ile giriş yap
```

### 2. Supabase Kur (1 dk)
1. Supabase > New Project → İsim: `aracrez`
2. SQL Editor > New Query
3. `supabase/schema.sql` içeriğini yapıştır → RUN
4. Settings > API > Kopyala:
   - `Project URL`
   - `anon public key`

### 3. Kodu Güncelle (1 dk)
`js/config.supabase.js` dosyasını düzenle:
```javascript
const SUPABASE_URL = 'BURAYA_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'BURAYA_ANON_KEY';

const ADMIN_EMAILS = [
    "senin@emailin.com"  // Buraya kendi emailini yaz
];
```

### 4. Deploy Et (1 dk)
```bash
npm install -g vercel
vercel login
vercel
```

Vercel Dashboard:
- Settings > Environment Variables
- `RESEND_API_KEY` = `re_xxxxx` (Resend'den al)
- `FROM_EMAIL` = `onboarding@resend.dev`

```bash
vercel --prod
```

### 5. Test Et ✅
1. Siteye git: `https://your-app.vercel.app`
2. Kayıt ol
3. Supabase Table Editor > users > role = `admin` yap
4. Sayfayı yenile
5. Araç ekle ve rezervasyon yap

## 🎉 Tamamdır!

**Firebase'e göre kazanç:**
- ✅ $0/ay (Firebase $35+/ay)
- ⚡ Daha hızlı
- 🔒 Daha güvenli

## Sonraki Adımlar

1. **Custom Domain**: Vercel > Settings > Domains
2. **Email Domain**: Resend > Domains > Add Domain
3. **Backup**: Supabase > Database > Backups

## Sorun mu var?

| Hata | Çözüm |
|------|-------|
| E-posta gitmiyor | Resend API key Vercel'de mi? |
| RLS hataları | schema.sql tam çalıştı mı? |
| Vercel deploy başarısız | `vercel --debug` çalıştır |

Detaylı bilgi: `DEPLOYMENT.md`
