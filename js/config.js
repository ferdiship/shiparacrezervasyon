// Firebase Yapılandırması
const firebaseConfig = {
    apiKey: "AIzaSyCGP7ggy0bQvCqfTk_AWWYsRQzpkzDb_FM",
    authDomain: "arazrezervasyon.web.app",
    projectId: "arazrezervasyon",
    storageBucket: "arazrezervasyon.appspot.com",
    messagingSenderId: "996696075906",
    appId: "1:996696075906:web:624811025279caec840e9b",
    databaseURL: "https://arazrezervasyon-default-rtdb.firebaseio.com"
};

// Firebase'i başlat
let firebaseApp;
try {
    firebaseApp = firebase.app();
} catch (e) {
    firebaseApp = firebase.initializeApp(firebaseConfig);
}

// Firebase hizmetleri
const auth = firebase.auth();
const db = firebase.database();
const storage = firebase.storage();

// Yetkili admin kimliklerini belirle (e-posta adresleri)
const ADMIN_EMAILS = [
    "frdipolat@gmail.com",
    "husnu@shipglobaltr.com",
    "ferdi@shipglobaltr.com",
    "muhasebe@shipglobaltr.com"
];

// Firebase Functions URL'leri
// Yerel geliştirme için localhost, canlı ortam için cloud functions adresi kullanılır.
const FUNCTIONS_BASE_URL = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
  ? `http://127.0.0.1:5012/arazrezervasyon/us-central1`
  : 'https://us-central1-arazrezervasyon.cloudfunctions.net';

// E-posta bildirimi konfigürasyonu (Firebase Functions kullanıyor)
const EMAIL_CONFIG = {
    // Firebase Functions endpoints
    functionsBaseUrl: FUNCTIONS_BASE_URL,
    testEmailEndpoint: `${FUNCTIONS_BASE_URL}/sendTestEmail`,
    sendEmailEndpoint: `${FUNCTIONS_BASE_URL}/sendReservationEmail`,
    
    // Onay veren yönetici e-posta adresi
    approverEmail: 'ferdi@shipglobaltr.com',
    approverName: 'Araç Rezervasyon Yöneticisi'
};

// Firebase Functions ile e-posta gönderme fonksiyonu
async function sendReservationNotification(reservation, car, type = 'new') {
    try {
        console.log('Firebase Functions ile e-posta gönderiliyor...', { type, reservation: reservation.id });
        
        // Firebase Functions otomatik olarak tetikleniyor
        // Manuel gönderim gerekirse endpoint kullanılabilir
        const response = await fetch(EMAIL_CONFIG.sendEmailEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                reservationId: reservation.id,
                type: type
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
        // Hata durumunda da devam et, e-posta gönderimi kritik değil
        return { success: false, error: error.message };
    }
}

// Rezervasyon durumu değişikliği bildirimi (Firebase Functions otomatik yapıyor)
async function notifyReservationStatusChange(reservationId, newStatus, rejectionReason = null) {
    try {
        console.log(`Rezervasyon durumu değişikliği: ${reservationId} -> ${newStatus}`);
        
        // Firebase Functions otomatik olarak tetikleniyor
        // Bu fonksiyon artık sadece log için kullanılıyor
        console.log('Firebase Functions otomatik e-posta bildirimi gönderiyor...');
        
        // İsteğe bağlı: Manuel tetikleme gerekirse
        if (false) { // Manuel tetikleme kapalı
            const response = await fetch(EMAIL_CONFIG.sendEmailEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reservationId: reservationId,
                    type: newStatus
                })
            });
            
            const result = await response.json();
            console.log('Manuel e-posta gönderimi sonucu:', result);
        }
        
    } catch (error) {
        console.error('Rezervasyon durumu değişikliği bildirimi hatası:', error);
    }
}

// Test e-postası gönderme fonksiyonu
async function sendTestEmail() {
    try {
        const response = await fetch(EMAIL_CONFIG.testEmailEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
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
    const adminList = ADMIN_EMAILS;

    console.log(`[isAdmin] --- Başlangıç ---`);
    console.log(`[isAdmin] Kontrol Edilen Email (emailToCheck): '${emailToCheck}' (tip: ${typeof emailToCheck})`);
    console.log(`[isAdmin] Admin Listesi (adminList): ${JSON.stringify(adminList)} (tip: ${typeof adminList}, length: ${adminList ? adminList.length : 0})`);

    if (!emailToCheck || !adminList || adminList.length === 0) {
        console.log("[isAdmin] Email veya Admin Listesi boş/geçersiz.");
        return false;
    }

    const firstAdminEmail = adminList[0];
    console.log(`[isAdmin] Listedeki İlk Admin Email: '${firstAdminEmail}' (tip: ${typeof firstAdminEmail})`);

    // Karakter kodlarını karşılaştırma (Debug için)
    if (emailToCheck && firstAdminEmail) {
        let comparisonDetails = "Karakter Kodları:\n";
        comparisonDetails += `Email Gelen (${emailToCheck.length}): `;
        for(let i=0; i<emailToCheck.length; i++) { comparisonDetails += emailToCheck.charCodeAt(i) + " "; }
        comparisonDetails += "\n";
        comparisonDetails += `Listede Kayıtlı (${firstAdminEmail.length}): `;
        for(let i=0; i<firstAdminEmail.length; i++) { comparisonDetails += firstAdminEmail.charCodeAt(i) + " "; }
        console.log(comparisonDetails);
    }

    const directComparison = emailToCheck === firstAdminEmail;
    console.log(`[isAdmin] Doğrudan Karşılaştırma (emailToCheck === firstAdminEmail): ${directComparison}`);
    
    const includesResult = adminList.includes(emailToCheck);
    console.log(`[isAdmin] Includes Metodu Sonucu (adminList.includes(emailToCheck)): ${includesResult}`);
    console.log(`[isAdmin] --- Bitiş ---`);

    return includesResult; // Ya da test için return directComparison;
}

// isAdmin fonksiyonunu global window nesnesine ata
window.isAdmin = isAdmin;

// Yeni rezervasyon e-postası gönderme
async function sendNewReservationEmail(reservationData) {
    try {
        console.log('Yeni rezervasyon e-postası gönderiliyor...', reservationData);
        
        const response = await fetch(EMAIL_CONFIG.sendEmailEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                reservationId: reservationData.id,
                type: 'new'
            })
        });
        
        const result = await response.json();
        console.log('Yeni rezervasyon e-posta sonucu:', result);
        return result;
        
    } catch (error) {
        console.error('Yeni rezervasyon e-posta hatası:', error);
        return { success: false, error: error.message };
    }
}

// Onay e-postası gönderme
async function sendApprovalEmail(reservationData) {
    try {
        console.log('Onay e-postası gönderiliyor...', reservationData);
        
        const response = await fetch(EMAIL_CONFIG.sendEmailEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                reservationId: reservationData.id,
                type: 'approved'
            })
        });
        
        const result = await response.json();
        console.log('Onay e-posta sonucu:', result);
        return result;
        
    } catch (error) {
        console.error('Onay e-posta hatası:', error);
        return { success: false, error: error.message };
    }
}

// Red e-postası gönderme
async function sendRejectionEmail(reservationData, rejectionReason) {
    try {
        console.log('Red e-postası gönderiliyor...', reservationData, rejectionReason);
        
        const response = await fetch(EMAIL_CONFIG.sendEmailEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                reservationId: reservationData.id,
                type: 'rejected'
            })
        });
        
        const result = await response.json();
        console.log('Red e-posta sonucu:', result);
        return result;
        
    } catch (error) {
        console.error('Red e-posta hatası:', error);
        return { success: false, error: error.message };
    }
}

// E-posta fonksiyonlarını emailConfig objesi olarak grupla
window.emailConfig = {
    sendNewReservationEmail: sendNewReservationEmail,
    sendApprovalEmail: sendApprovalEmail,
    sendRejectionEmail: sendRejectionEmail
};

// E-posta fonksiyonlarını global window nesnesine ata
window.sendReservationNotification = sendReservationNotification;
window.notifyReservationStatusChange = notifyReservationStatusChange;
window.sendTestEmail = sendTestEmail;

// Manuel rezervasyon e-postası gönderme fonksiyonu (debug için)
async function sendManualReservationEmail(reservationId, type = 'new') {
    try {
        console.log('Manuel e-posta gönderiliyor...', { reservationId, type });
        
        const response = await fetch(EMAIL_CONFIG.sendEmailEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                reservationId: reservationId,
                type: type
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Manuel e-posta başarıyla gönderildi!');
            console.log('Manuel e-posta sonucu:', result);
        } else {
            alert('Manuel e-posta gönderilemedi: ' + result.error);
            console.error('Manuel e-posta hatası:', result);
        }
        
        return result;
        
    } catch (error) {
        console.error('Manuel e-posta gönderme hatası:', error);
        alert('Manuel e-posta gönderilirken hata oluştu: ' + error.message);
        return { success: false, error: error.message };
    }
}

// Manuel e-posta fonksiyonunu global window nesnesine ata
window.sendManualReservationEmail = sendManualReservationEmail;

// Zaman damgasını tarih formatına dönüştür
function formatDate(timestamp) {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('tr-TR');
}

// Zaman damgasını saat formatına dönüştür
function formatTime(timestamp) {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

// İki tarih arasındaki çakışmaları kontrol et
function isTimeOverlap(start1, end1, start2, end2) {
    return (start1 < end2 && end1 > start2);
}

// Firebase bağlantısını test et
function testFirebaseConnection() {
    console.log("Firebase test başlıyor...");
    
    // Auth durumunu kontrol et
    console.log("Auth servis durumu:", auth ? "Hazır" : "Başlatılmadı");
    
    // Database durumunu kontrol et
    console.log("Database servis durumu:", db ? "Hazır" : "Başlatılmadı");
    
    // Test verisi eklemeyi dene
    db.ref('test').push({
        message: "Firebase test",
        timestamp: firebase.database.ServerValue.TIMESTAMP
    })
    .then(ref => {
        console.log("Test verisi başarıyla eklendi. Referans:", ref.key);
        console.log("Firebase bağlantısı çalışıyor!");
    })
    .catch(error => {
        console.error("Firebase test hatası:", error);
    });
}

// Geliştirme modunda otomatik test yap
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    console.log("Geliştirme ortamında çalışıyor, Firebase test ediliyor...");
    setTimeout(testFirebaseConnection, 2000);
}

// testFirebaseConnection(); // Bu satırı yorum satırı yapıyoruz 