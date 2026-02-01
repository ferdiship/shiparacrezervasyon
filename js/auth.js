// Emülatör ayarları - Sadece geliştirme ortamında çalışır
// Tarayıcı konsoluna `firebase.emulators.connect()` yazarak kontrol edilebilir
if (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") {
    console.log("Firebase Emulators kullanılıyor...");
    try {
        // Auth, Database ve Functions emülatörlerine bağlan
        auth.useEmulator("http://127.0.0.1:9099");
        db.useEmulator("127.0.0.1", 9012);
        // Functions emülatörüne bağlanmak için `firebase/functions` modülü gerekir,
        // ancak SDK üzerinden yapılan HTTP çağrıları (config.js'de olduğu gibi)
        // zaten localhost'a yönlendirildiği için burada ek bir ayar gerekmez.
        console.log("Auth ve Database emülatörlerine başarıyla bağlandı.");
    } catch (e) {
        console.error("Firebase emülatörlerine bağlanırken hata oluştu:", e);
        alert("Emülatörlere bağlanılamadı. Lütfen Firebase CLI'nin çalıştığından emin olun.");
    }
}

// Sadece auth.js'e özgü DOM elementleri
const adminControls = document.getElementById('admin-controls');
const showLoginLink = document.getElementById('showLogin');
const showRegisterLink = document.getElementById('showRegister');

// Form elementleri
const loginFormEl = document.getElementById('login-form');
const registerFormEl = document.getElementById('register-form');

// Hata mesajı elementleri
const loginEmailError = document.getElementById('loginEmailError');
const loginPasswordError = document.getElementById('loginPasswordError');
const registerNameError = document.getElementById('registerNameError');
const registerEmailError = document.getElementById('registerEmailError');
const registerPasswordError = document.getElementById('registerPasswordError');

// Input elementleri
const loginEmailInput = document.getElementById('loginEmail');
const loginPasswordInput = document.getElementById('loginPassword');
const registerNameInput = document.getElementById('registerName');
const registerEmailInput = document.getElementById('registerEmail');
const registerPasswordInput = document.getElementById('registerPassword');

// Oturum durumunu dinle
auth.onAuthStateChanged(user => {
    if (user) {
        // Kullanıcı giriş yapmış
        window.currentUser = user; // Global currentUser değişkenini güncelle
        document.getElementById('userInfo').classList.remove('hidden');
        document.getElementById('authButtons').classList.add('hidden');
        document.getElementById('userName').textContent = user.displayName || user.email;

        // Admin kontrolü
        console.log(`[Auth State] Kullanıcı: ${user.email}, isAdmin kontrolü yapılıyor...`);
        
        const isAdminUser = window.isAdmin(user.email);
        console.log(`[Auth State] isAdmin(${user.email}) sonucu: ${isAdminUser}`);
        
        if (isAdminUser && adminControls) {
            console.log("[Auth State] Admin olarak tanındı, admin kontrolleri gösteriliyor.");
            adminControls.classList.remove('hidden');
            
            // Rezervasyon yönetim butonunu da sadece admin görsün
            document.getElementById('manageReservationsBtn')?.classList.remove('hidden');
            // Test e-postası butonunu da sadece admin görsün
            document.getElementById('testEmailBtn')?.classList.remove('hidden');
        } else {
            console.log("[Auth State] Admin olarak tanınmadı, admin kontrolleri gizleniyor.");
            if (adminControls) {
                adminControls.classList.add('hidden');
            }
            
            // Normal kullanıcılar rezervasyon yönetim butonunu görmesin
            document.getElementById('manageReservationsBtn')?.classList.add('hidden');
            // Normal kullanıcılar test e-postası butonunu görmesin
            document.getElementById('testEmailBtn')?.classList.add('hidden');
        }

        // Görünümleri güncelle
        document.getElementById('welcome-section').classList.add('hidden');
        document.getElementById('auth-section').classList.add('hidden');
        document.getElementById('dashboard-section').classList.remove('hidden');
        
        // Eğer rezervasyon yönetim sayfası açıksa kapat
        const reservationManagementSection = document.getElementById('reservation-management-section');
        if (reservationManagementSection) {
            reservationManagementSection.classList.add('hidden');
        }

        // Araçları yükle ve istatistikleri güncelle (fonksiyon varsa)
        if (typeof window.loadCars === 'function') {
            window.loadCars();
        } else {
            console.warn('loadCars fonksiyonu tanımlı değil');
        }
        
        if (typeof window.updateStats === 'function') {
            window.updateStats();
        }
        
        // Kullanıcı rezervasyonlarını yükle
        if (typeof window.loadDashboardUserReservations === 'function') {
            console.log("[Auth State] Rezervasyonlar yükleniyor...");
            window.loadDashboardUserReservations();
        } else {
            console.warn('loadDashboardUserReservations fonksiyonu tanımlı değil');
        }
    } else {
        // Kullanıcı çıkış yapmış
        window.currentUser = null;
        document.getElementById('userInfo').classList.add('hidden');
        document.getElementById('authButtons').classList.remove('hidden');
        
        // Rezervasyon yönetim butonunu gizle
        document.getElementById('manageReservationsBtn')?.classList.add('hidden');
        // Test e-postası butonunu gizle
        document.getElementById('testEmailBtn')?.classList.add('hidden');
        
        // Görünümleri güncelle
        document.getElementById('welcome-section').classList.remove('hidden');
        document.getElementById('dashboard-section').classList.add('hidden');
        
        // Eğer rezervasyon yönetim sayfası açıksa kapat
        const reservationManagementSection = document.getElementById('reservation-management-section');
        if (reservationManagementSection) {
            reservationManagementSection.classList.add('hidden');
        }

        // Eğer modallar açıksa kapat
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
    }
});

// Giriş/Kayıt bölümünü göster
document.getElementById('loginBtn').addEventListener('click', () => {
    document.getElementById('welcome-section').classList.add('hidden');
    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
});

document.getElementById('registerBtn').addEventListener('click', () => {
    document.getElementById('welcome-section').classList.add('hidden');
    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
});

// Giriş/Kayıt formları arası geçiş
if (showLoginLink) {
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('registerForm').classList.add('hidden');
    });
}

if (showRegisterLink) {
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('registerForm').classList.remove('hidden');
    });
}

// --- Doğrulama Fonksiyonları ---
function validateEmail(email) {
    if (!email) return "E-posta alanı zorunludur.";
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(String(email).toLowerCase())) return "Geçerli bir e-posta adresi girin.";
    return ""; // Hata yok
}

function validatePassword(password, minLength = 6) {
    if (!password) return "Şifre alanı zorunludur.";
    if (password.length < minLength) return `Şifre en az ${minLength} karakter olmalıdır.`;
    return ""; // Hata yok
}

function validateName(name) {
    if (!name) return "Ad Soyad alanı zorunludur.";
    if (name.trim().length < 2) return "Ad Soyad en az 2 karakter olmalıdır.";
    return ""; // Hata yok
}

// --- Hata Gösterme Fonksiyonu ---
function displayError(element, message) {
    if (element) {
        element.textContent = message;
    }
}

// --- Alan Bazlı Doğrulama ve Olay Dinleyicileri ---
function setupInputValidation(inputEl, errorEl, validationFn, ...args) {
    if (!inputEl || !errorEl) return;

    inputEl.addEventListener('blur', () => {
        const errorMessage = validationFn(inputEl.value, ...args);
        displayError(errorEl, errorMessage);
    });
    inputEl.addEventListener('input', () => { // Kullanıcı yazarken hatayı temizle veya anlık doğrula
        if (errorEl.textContent !== "") { // Sadece hata varken temizle
             const errorMessage = validationFn(inputEl.value, ...args);
             displayError(errorEl, errorMessage); // Veya anlık olarak tekrar doğrula
        }
    });
}

// Giriş formu için doğrulamalar
if (loginEmailInput && loginEmailError) setupInputValidation(loginEmailInput, loginEmailError, validateEmail);
if (loginPasswordInput && loginPasswordError) setupInputValidation(loginPasswordInput, loginPasswordError, validatePassword);

// Kayıt formu için doğrulamalar
if (registerNameInput && registerNameError) setupInputValidation(registerNameInput, registerNameError, validateName);
if (registerEmailInput && registerEmailError) setupInputValidation(registerEmailInput, registerEmailError, validateEmail);
if (registerPasswordInput && registerPasswordError) setupInputValidation(registerPasswordInput, registerPasswordError, validatePassword);

// Giriş Formu
if (loginFormEl) {
    loginFormEl.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;

        // Göndermeden önce son bir doğrulama
        const emailErrorMsg = validateEmail(email);
        const passwordErrorMsg = validatePassword(password);

        displayError(loginEmailError, emailErrorMsg);
        displayError(loginPasswordError, passwordErrorMsg);

        if (emailErrorMsg || passwordErrorMsg) {
            return; // Hata varsa gönderme
        }
        
        // Firebase ile giriş yap
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Başarılı giriş
                document.getElementById('login-form').reset();
            })
            .catch((error) => {
                alert(`Giriş hatası: ${error.message}`);
            });
    });
}

// Kayıt Formu
if (registerFormEl) {
    registerFormEl.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = registerNameInput.value;
        const email = registerEmailInput.value;
        const password = registerPasswordInput.value;

        // Göndermeden önce son bir doğrulama
        const nameErrorMsg = validateName(name);
        const emailErrorMsg = validateEmail(email);
        const passwordErrorMsg = validatePassword(password);

        displayError(registerNameError, nameErrorMsg);
        displayError(registerEmailError, emailErrorMsg);
        displayError(registerPasswordError, passwordErrorMsg);

        if (nameErrorMsg || emailErrorMsg || passwordErrorMsg) {
            return; // Hata varsa gönderme
        }
        
        // Firebase ile kayıt ol
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Kullanıcı adını güncelle
                return userCredential.user.updateProfile({
                    displayName: name
                });
            })
            .then(() => {
                // Kullanıcı bilgilerini veritabanına kaydet
                return db.ref('users/' + auth.currentUser.uid).set({
                    name: name,
                    email: email,
                    role: window.isAdmin(email) ? 'admin' : 'employee',
                    createdAt: firebase.database.ServerValue.TIMESTAMP
                });
            })
            .then(() => {
                // Başarılı kayıt
                document.getElementById('register-form').reset();
            })
            .catch((error) => {
                alert(`Kayıt hatası: ${error.message}`);
            });
    });
}

// Çıkış Yap
document.getElementById('logoutBtn').addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            // Başarılı çıkış
        })
        .catch((error) => {
            alert(`Çıkış hatası: ${error.message}`);
        });
}); 