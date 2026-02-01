# 🔄 Firebase → Supabase Migrasyon Rehberi

## Geçiş Özeti

| Özellik | Firebase | Supabase | Değişiklik |
|---------|----------|----------|------------|
| **Auth** | Firebase Auth | Supabase Auth | ✅ API farklı |
| **Database** | Realtime Database | PostgreSQL | ✅ SQL tabanlı |
| **Functions** | Cloud Functions | Vercel Functions | ✅ Node.js aynı |
| **Email** | Nodemailer | Resend API | ✅ Daha basit |
| **Hosting** | Firebase Hosting | Vercel | ✅ Otomatik |

## Kod Değişiklikleri

### 1. Authentication

**Firebase:**
```javascript
// Kayıt
firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(userCredential => {
    return userCredential.user.updateProfile({ displayName: name });
  });

// Giriş
firebase.auth().signInWithEmailAndPassword(email, password);

// Çıkış
firebase.auth().signOut();

// Oturum dinleme
firebase.auth().onAuthStateChanged(user => {
  // ...
});
```

**Supabase:**
```javascript
// Kayıt
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { name }
  }
});

// Giriş
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
});

// Çıkış
await supabase.auth.signOut();

// Oturum dinleme
supabase.auth.onAuthStateChange((event, session) => {
  const user = session?.user;
  // ...
});
```

### 2. Database Operations

**Firebase Realtime Database:**
```javascript
// Veri ekleme
db.ref('cars/' + carId).set({
  plate: '34ABC123',
  brand: 'Toyota'
});

// Veri okuma
db.ref('cars').once('value').then(snapshot => {
  const cars = snapshot.val();
});

// Veri güncelleme
db.ref('cars/' + carId).update({
  status: 'available'
});

// Veri silme
db.ref('cars/' + carId).remove();
```

**Supabase (PostgreSQL):**
```javascript
// Veri ekleme
const { data, error } = await supabase
  .from('cars')
  .insert({
    plate: '34ABC123',
    brand: 'Toyota'
  });

// Veri okuma
const { data, error } = await supabase
  .from('cars')
  .select('*');

// Veri güncelleme
const { data, error } = await supabase
  .from('cars')
  .update({ status: 'available' })
  .eq('id', carId);

// Veri silme
const { data, error } = await supabase
  .from('cars')
  .delete()
  .eq('id', carId);
```

### 3. Realtime Subscriptions

**Firebase:**
```javascript
db.ref('reservations').on('value', snapshot => {
  const reservations = snapshot.val();
  updateUI(reservations);
});
```

**Supabase:**
```javascript
const subscription = supabase
  .channel('reservations')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'reservations' },
    payload => {
      console.log('Change:', payload);
      loadReservations();
    }
  )
  .subscribe();
```

### 4. Filters & Queries

**Firebase:**
```javascript
// Tarihe göre filtreleme
db.ref('reservations')
  .orderByChild('date')
  .equalTo('2024-02-01')
  .once('value');
```

**Supabase (SQL benzeri):**
```javascript
// Tarihe göre filtreleme
const { data } = await supabase
  .from('reservations')
  .select('*')
  .eq('date', '2024-02-01')
  .order('created_at', { ascending: false });

// Çoklu filtre
const { data } = await supabase
  .from('reservations')
  .select('*')
  .eq('status', 'pending')
  .gte('date', '2024-02-01')
  .lte('date', '2024-02-28');
```

### 5. Joins (İlişkiler)

**Firebase:**
```javascript
// Manuel join (her tablo ayrı)
const reservation = snapshot.val();
db.ref('cars/' + reservation.carId).once('value', carSnapshot => {
  const car = carSnapshot.val();
});
```

**Supabase:**
```javascript
// Otomatik join (foreign key)
const { data } = await supabase
  .from('reservations')
  .select(`
    *,
    cars (
      brand,
      model,
      plate
    )
  `)
  .eq('id', reservationId)
  .single();

// reservation.cars.brand
```

## Veritabanı Yapısı Farkları

### Firebase Structure
```
users/
  uid1/
    name: "Ali"
    email: "ali@example.com"
    
cars/
  car1/
    plate: "34ABC123"
    brand: "Toyota"
    
reservations/
  res1/
    carId: "car1"
    userId: "uid1"
```

### Supabase Structure (SQL Tables)
```sql
-- users table
id | name | email | role | created_at

-- cars table  
id | plate | brand | model | added_by (FK) | created_at

-- reservations table
id | car_id (FK) | user_id (FK) | date | status | created_at
```

## Güvenlik Kuralları

### Firebase Rules
```json
{
  "rules": {
    "cars": {
      ".read": "auth != null",
      ".write": "root.child('users').child(auth.uid).child('role').val() == 'admin'"
    }
  }
}
```

### Supabase RLS (Row Level Security)
```sql
-- READ: Herkes okuyabilir
CREATE POLICY "Anyone can view cars" ON public.cars
  FOR SELECT USING (true);

-- WRITE: Sadece adminler yazabilir
CREATE POLICY "Admins can insert cars" ON public.cars
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

## Environment Variables

### Firebase (.firebaserc)
```json
{
  "projects": {
    "default": "arazrezervasyon"
  }
}
```

### Supabase + Vercel (.env)
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
RESEND_API_KEY=re_xxxxx
FROM_EMAIL=noreply@domain.com
```

## E-posta Servisi

### Firebase (Cloud Functions + Nodemailer)
```javascript
// functions/index.ts
exports.sendEmail = functions.firestore
  .document('reservations/{id}')
  .onCreate(async (snap, context) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });
    
    await transporter.sendMail({
      from: user,
      to: adminEmail,
      subject: 'Yeni Rezervasyon',
      html: template
    });
  });
```

### Supabase + Vercel (Serverless + Resend)
```javascript
// api/send-email.js
export default async function handler(req, res) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: process.env.FROM_EMAIL,
      to: adminEmail,
      subject: 'Yeni Rezervasyon',
      html: template
    })
  });
  
  res.json({ success: true });
}
```

## Deployment

### Firebase
```bash
firebase deploy
```

### Vercel
```bash
vercel --prod
```

Veya GitHub'a push → Otomatik deploy

## Maliyet Karşılaştırması

| | Firebase | Supabase + Vercel |
|-|----------|-------------------|
| Database | $25/ay (1GB) | **$0** (500MB) |
| Auth | $0 (Blaze plan) | **$0** (50K users) |
| Functions | $0.40/1M | **$0** (100K requests) |
| Hosting | $0 | **$0** (100GB bandwidth) |
| Email | ~$10/ay | **$0** (3K/ay Resend) |
| **TOPLAM** | **$35+/ay** | **$0/ay** |

## Kontrol Listesi

- [ ] Supabase projesi oluştur
- [ ] `schema.sql` çalıştır
- [ ] Resend hesabı aç
- [ ] `.env` dosyası oluştur
- [ ] `config.supabase.js` güncelle
- [ ] Firebase scriptlerini kaldır
- [ ] Supabase scriptlerini ekle
- [ ] Vercel'e deploy et
- [ ] Environment variables ekle
- [ ] Test et
- [ ] Eski Firebase projesini durdur

## 🎯 Sonuç

**Firebase → Supabase geçişi:**
- ✅ Maliyet: $35/ay → $0/ay
- ✅ Performans: Realtime DB → PostgreSQL (daha hızlı)
- ✅ SQL: Güçlü sorgular, JOIN'ler
- ✅ RLS: Gelişmiş güvenlik
- ✅ Vercel: Otomatik deployment
