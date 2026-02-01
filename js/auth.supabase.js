// Supabase Authentication

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
supabase.auth.onAuthStateChange(async (event, session) => {
    if (session) {
        // Kullanıcı giriş yapmış
        const user = session.user;
        window.currentUser = user;
        
        document.getElementById('userInfo').classList.remove('hidden');
        document.getElementById('authButtons').classList.add('hidden');
        
        // Kullanıcı adını göster
        const { data: userData } = await supabase
            .from('users')
            .select('name')
            .eq('id', user.id)
            .single();
        
        document.getElementById('userName').textContent = userData?.name || user.email;

        // Admin kontrolü
        console.log(`[Auth State] Kullanıcı: ${user.email}, isAdmin kontrolü yapılıyor...`);
        
        const isAdminUser = window.isAdmin(user.email);
        console.log(`[Auth State] isAdmin(${user.email}) sonucu: ${isAdminUser}`);
        
        if (isAdminUser && adminControls) {
            console.log("[Auth State] Admin olarak tanındı, admin kontrolleri gösteriliyor.");
            adminControls.classList.remove('hidden');
            document.getElementById('manageReservationsBtn')?.classList.remove('hidden');
            document.getElementById('testEmailBtn')?.classList.remove('hidden');
        } else {
            console.log("[Auth State] Admin olarak tanınmadı, admin kontrolleri gizleniyor.");
            if (adminControls) {
                adminControls.classList.add('hidden');
            }
            document.getElementById('manageReservationsBtn')?.classList.add('hidden');
            document.getElementById('testEmailBtn')?.classList.add('hidden');
        }

        // Görünümleri güncelle
        document.getElementById('welcome-section').classList.add('hidden');
        document.getElementById('auth-section').classList.add('hidden');
        document.getElementById('dashboard-section').classList.remove('hidden');
        
        // Rezervasyon yönetim sayfası açıksa kapat
        const reservationManagementSection = document.getElementById('reservation-management-section');
        if (reservationManagementSection) {
            reservationManagementSection.classList.add('hidden');
        }

        // Araçları yükle ve istatistikleri güncelle
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
        
        document.getElementById('manageReservationsBtn')?.classList.add('hidden');
        document.getElementById('testEmailBtn')?.classList.add('hidden');
        
        // Görünümleri güncelle
        document.getElementById('welcome-section').classList.remove('hidden');
        document.getElementById('dashboard-section').classList.add('hidden');
        
        const reservationManagementSection = document.getElementById('reservation-management-section');
        if (reservationManagementSection) {
            reservationManagementSection.classList.add('hidden');
        }

        // Modalları kapat
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

// Doğrulama Fonksiyonları
function validateEmail(email) {
    if (!email) return "E-posta alanı zorunludur.";
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(String(email).toLowerCase())) return "Geçerli bir e-posta adresi girin.";
    return "";
}

function validatePassword(password, minLength = 6) {
    if (!password) return "Şifre alanı zorunludur.";
    if (password.length < minLength) return `Şifre en az ${minLength} karakter olmalıdır.`;
    return "";
}

function validateName(name) {
    if (!name) return "Ad Soyad alanı zorunludur.";
    if (name.trim().length < 2) return "Ad Soyad en az 2 karakter olmalıdır.";
    return "";
}

// Hata Gösterme Fonksiyonu
function displayError(element, message) {
    if (element) {
        element.textContent = message;
    }
}

// Alan Bazlı Doğrulama
function setupInputValidation(inputEl, errorEl, validationFn, ...args) {
    if (!inputEl || !errorEl) return;

    inputEl.addEventListener('blur', () => {
        const errorMessage = validationFn(inputEl.value, ...args);
        displayError(errorEl, errorMessage);
    });
    
    inputEl.addEventListener('input', () => {
        if (errorEl.textContent !== "") {
            const errorMessage = validationFn(inputEl.value, ...args);
            displayError(errorEl, errorMessage);
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
    loginFormEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;

        // Son doğrulama
        const emailErrorMsg = validateEmail(email);
        const passwordErrorMsg = validatePassword(password);

        displayError(loginEmailError, emailErrorMsg);
        displayError(loginPasswordError, passwordErrorMsg);

        if (emailErrorMsg || passwordErrorMsg) {
            return;
        }
        
        // Supabase ile giriş yap
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) {
            alert(`Giriş hatası: ${error.message}`);
        } else {
            document.getElementById('login-form').reset();
        }
    });
}

// Kayıt Formu
if (registerFormEl) {
    registerFormEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = registerNameInput.value;
        const email = registerEmailInput.value;
        const password = registerPasswordInput.value;

        // Son doğrulama
        const nameErrorMsg = validateName(name);
        const emailErrorMsg = validateEmail(email);
        const passwordErrorMsg = validatePassword(password);

        displayError(registerNameError, nameErrorMsg);
        displayError(registerEmailError, emailErrorMsg);
        displayError(registerPasswordError, passwordErrorMsg);

        if (nameErrorMsg || emailErrorMsg || passwordErrorMsg) {
            return;
        }
        
        // Supabase ile kayıt ol
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name
                }
            }
        });
        
        if (error) {
            alert(`Kayıt hatası: ${error.message}`);
        } else {
            alert('Kayıt başarılı! Giriş yapabilirsiniz.');
            document.getElementById('register-form').reset();
            document.getElementById('loginForm').classList.remove('hidden');
            document.getElementById('registerForm').classList.add('hidden');
        }
    });
}

// Çıkış Yap
document.getElementById('logoutBtn').addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        alert(`Çıkış hatası: ${error.message}`);
    }
});
