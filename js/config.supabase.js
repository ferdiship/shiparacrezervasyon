// Supabase Yapılandırması
// Bu dosyayı config.js olarak kaydedin ve Supabase bilgilerinizi ekleyin

const SUPABASE_URL = 'https://kvsazwyclhowatvqslsz.supabase.co'; // https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2c2F6d3ljbGhvd2F0dnFzbHN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NjM4NzMsImV4cCI6MjA4NTUzOTg3M30.36GsAh9BxrFz-ktEqrL2KQCo_Af19u2LEPYvZMYHxkA'; // public anon key

// Supabase client'ı başlat
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Yetkili admin kimlikleri
const ADMIN_EMAILS = [
    "frdipolat@gmail.com",
    "husnu@shipglobaltr.com",
    "ferdi@shipglobaltr.com",
    "muhasebe@shipglobaltr.com"
];

// Gmail SMTP konfigürasyonu (E-posta için)
// Not: Gmail App Password Vercel environment variables'da tutulur
const EMAIL_FROM = 'ferdi@shipglobaltr.com'; // Gmail hesabınız
const APPROVER_EMAIL = 'ferdi@shipglobaltr.com';
const APPROVER_NAME = 'Araç Rezervasyon Yöneticisi';

// E-posta gönderme fonksiyonu (Vercel Serverless Function üzerinden)
async function sendReservationEmail(type, reservation, car) {
    try {
        console.log('E-posta gönderiliyor...', { type, reservation: reservation.id });
        
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type,
                reservation,
                car
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('E-posta başarıyla gönderildi:', result.message);
        } else {
            console.error('E-posta gönderme hatası:', result.error);
        }
        
        return result;
        
    } catch (error) {
        console.error('E-posta gönderme hatası:', error);
        return { success: false, error: error.message };
    }
}

// Rezervasyon bildirimi gönder
async function sendReservationNotification(reservation, car, type = 'new') {
    return await sendReservationEmail(type, reservation, car);
}

// Rezervasyon durumu değişikliği bildirimi
async function notifyReservationStatusChange(reservationId, newStatus, rejectionReason = null) {
    try {
        console.log(`Rezervasyon durumu değişikliği: ${reservationId} -> ${newStatus}`);
        
        // Rezervasyon ve araç bilgilerini al
        const { data: reservation, error: resError } = await supabase
            .from('reservations')
            .select('*, cars(*)')
            .eq('id', reservationId)
            .single();
        
        if (resError) throw resError;
        
        const type = newStatus === 'approved' ? 'approved' : 'rejected';
        await sendReservationEmail(type, reservation, reservation.cars);
        
    } catch (error) {
        console.error('Rezervasyon durumu değişikliği bildirimi hatası:', error);
    }
}

// Test e-postası gönderme
async function sendTestEmail() {
    try {
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'test'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Test e-postası başarıyla gönderildi!');
            console.log('Test e-postası sonucu:', result);
        } else {
            alert('Test e-postası gönderilemedi: ' + result.error);
            console.error('Test e-postası hatası:', result);
        }
        
        return result;
        
    } catch (error) {
        console.error('Test e-postası gönderme hatası:', error);
        alert('Test e-postası gönderilirken hata oluştu: ' + error.message);
        return { success: false, error: error.message };
    }
}

// Kullanıcının admin olup olmadığını kontrol et
function isAdmin(email) {
    const emailToCheck = email ? String(email).trim() : null;
    
    if (!emailToCheck || !ADMIN_EMAILS || ADMIN_EMAILS.length === 0) {
        return false;
    }
    
    return ADMIN_EMAILS.includes(emailToCheck);
}

// Global window nesnesine ata
window.supabase = supabase;
window.isAdmin = isAdmin;
window.sendReservationNotification = sendReservationNotification;
window.notifyReservationStatusChange = notifyReservationStatusChange;
window.sendTestEmail = sendTestEmail;

// Yardımcı fonksiyonlar
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('tr-TR');
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

function isTimeOverlap(start1, end1, start2, end2) {
    return (start1 < end2 && end1 > start2);
}

// Export
window.formatDate = formatDate;
window.formatTime = formatTime;
window.isTimeOverlap = isTimeOverlap;
