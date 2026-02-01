// DOM Elementleri - Temel bölümler
const welcomeSection = document.getElementById('welcome-section');
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');

// DOM Elementleri - Kimlik doğrulama ve kullanıcı
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const showLoginBtn = document.getElementById('showLogin');
const showRegisterBtn = document.getElementById('showRegister');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('userInfo');
const userName = document.getElementById('userName');
const authButtons = document.getElementById('authButtons');
const profileBtn = document.getElementById('profileBtn');

// DOM Elementleri - Araçlar ve Araç Listesi
const carList = document.getElementById('carList');
if (carList) carList.classList.add('hidden'); // Araç listesini gizle
const dateFilter = document.getElementById('dateFilter');
const addCarBtn = document.getElementById('addCarBtn');

// DOM Elementleri - Dashboard rezervasyonları
const dashboardUserReservations = document.getElementById('dashboardUserReservations');

// DOM Elementleri - Modallar
const reservationModal = document.getElementById('reservationModal');
const addCarModal = document.getElementById('addCarModal');
const reservationDetailModal = document.getElementById('reservationDetailModal');
const profileModal = document.getElementById('profileModal');
const carDetails = document.getElementById('carDetails');
const dailyReservationsModal = document.getElementById('dailyReservationsModal');
const dailyReservationsList = document.getElementById('dailyReservationsList');
const selectedDateDisplay = document.getElementById('selectedDateDisplay');

// İstatistik elementleri
const totalCarsElement = document.getElementById('total-cars');
const todayReservationsElement = document.getElementById('today-reservations');
const availableCarsElement = document.getElementById('available-cars');
const totalReservationsElement = document.getElementById('total-reservations');

// Takvim elementleri
const calendarMonth = document.getElementById('calendar-month');
const calendarGrid = document.getElementById('calendar-grid');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

// Rezervasyon Yönetim Elementleri
const reservationManagementSection = document.getElementById('reservation-management-section');
const reservationsList = document.getElementById('reservationsList');
const reservationDetails = document.getElementById('reservationDetails');
const reservationStatusFilter = document.getElementById('reservationStatusFilter');
const reservationDateFilter = document.getElementById('reservationDateFilter');
const reservationFilterBtn = document.getElementById('reservationFilterBtn');
const approveReservationBtn = document.getElementById('approveReservationBtn');
const rejectReservationBtn = document.getElementById('rejectReservationBtn');
const deleteReservationModalBtn = document.getElementById('deleteReservationModalBtn'); 
const manageReservationsBtn = document.getElementById('manageReservationsBtn');
const backToDashboardBtn = document.getElementById('backToDashboardBtn');
const testEmailBtn = document.getElementById('testEmailBtn');

// Red Sebebi Modalı Elementleri
const rejectionReasonModal = document.getElementById('rejectionReasonModal');
const rejectionReasonForm = document.getElementById('rejection-reason-form');
const rejectionReservationId = document.getElementById('rejectionReservationId');
const rejectionReason = document.getElementById('rejectionReason');
const cancelRejectionBtn = document.getElementById('cancelRejectionBtn');

// Profil Elementleri
const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const profileRole = document.getElementById('profileRole');
const profileEditName = document.getElementById('profileEditName');
const profileEditPassword = document.getElementById('profileEditPassword');
const profileEditForm = document.getElementById('profile-edit-form');
const userReservationsList = document.getElementById('userReservationsList');
const profileTabs = document.querySelectorAll('.profile-tab');

// Düzenleme için global değişken
let currentEditCarId = null;

// Mevcut Takvim Tarihi
let currentDate = new Date();

// Mevcut rezervasyon ID'si (detay modalı için)
let currentReservationId = null;
let currentCarForDetail = null; // Rezervasyon detay modalındaki araç bilgisi
let currentReservationForDetail = null; // Rezervasyon detay modalındaki rezervasyon bilgisi

let isLoadingCars = false; // loadCars için bayrak

// Günlük Yeni Rezervasyon Modalı Elementleri
const dailyNewReservationForm = document.getElementById('daily-new-reservation-form');
const dailyReservationDateInput = document.getElementById('dailyReservationDate');
const dailySelectCar = document.getElementById('dailySelectCar');
const dailyStartTimeInput = document.getElementById('dailyStartTime');
const dailyEndTimeInput = document.getElementById('dailyEndTime');
const dailyReservationNote = document.getElementById('dailyReservationNote');
const dailyAvailabilityMessage = document.getElementById('dailyAvailabilityMessage');
const dailySelectCarError = document.getElementById('dailySelectCarError');
const dailyStartTimeError = document.getElementById('dailyStartTimeError');
const dailyEndTimeError = document.getElementById('dailyEndTimeError');
const dailyCarScheduleTimeline = document.getElementById('dailyCarScheduleTimeline'); // Zaman çizelgesi div'i

// Araç Ekleme/Düzenleme Modalı Form Elementleri
const addCarForm = document.getElementById('add-car-form');
const carPlateInput = document.getElementById('carPlate');
const carBrandInput = document.getElementById('carBrand');
const carModelInput = document.getElementById('carModel');
const carYearInput = document.getElementById('carYear');
const carColorInput = document.getElementById('carColor');
const carImageInput = document.getElementById('carImage');
const carPlateError = document.getElementById('carPlateError');
const carBrandError = document.getElementById('carBrandError');
const carModelError = document.getElementById('carModelError');
const carYearError = document.getElementById('carYearError');
const carColorError = document.getElementById('carColorError');
const carImageError = document.getElementById('carImageError');

// DOM Elementleri - Müsaitlik Paneli ekleyelim
const availabilityPanel = document.getElementById('availabilityPanel');
const availabilityDate = document.getElementById('availabilityDate');
const availabilityCarList = document.getElementById('availabilityCarList');

// Fonksiyonları window nesnesine ata
window.loadCars = loadCars;
window.updateStats = updateStats;
window.loadDashboardUserReservations = loadDashboardUserReservations;

// Yardımcı Fonksiyonlar
function getLocalDateString(dateObj) {
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDate(date) {
    return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatTime(time) {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
}

function isTimeOverlap(start1, end1, start2, end2) {
    return start1 <= end2 && end1 >= start2;
}

// Araç Formu Doğrulama Fonksiyonları
function validateRequired(value, fieldName) {
    if (!value || !value.trim()) return `${fieldName} alanı zorunludur.`;
    return "";
}

function validateYear(year) {
    const errRequired = validateRequired(year, "Yıl");
    if (errRequired) return errRequired;
    const yearNum = parseInt(year);
    const currentYear = new Date().getFullYear();
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear + 1) { // Gelecek yıldan sonrasını kabul etmeyelim
        return `Geçerli bir yıl girin (1900-${currentYear + 1}).`;
    }
    return "";
}

function validatePlate(plate) {
    const errRequired = validateRequired(plate, "Plaka");
    if (errRequired) return errRequired;
    // Basit bir format kontrolü (isteğe bağlı, daha detaylı regex eklenebilir)
    // Örnek: 34 ABC 123 veya 34 ABC 1234 gibi
    // const plateRegex = /^[0-9]{1,2}\s?[A-Z]{1,3}\s?[0-9]{1,4}$/i;
    // if (!plateRegex.test(plate.trim().toUpperCase())) return "Geçersiz plaka formatı.";
    return "";
}

function validateImageUrl(url) {
    if (!url || !url.trim()) return ""; // URL isteğe bağlı
    try {
        new URL(url);
        return "";
    } catch (_) {
        return "Geçerli bir URL girin (örn: https://...).";
    }
}

// Genel Hata Gösterme Fonksiyonu (auth.js'tekine benzer)
function displayFormError(element, message) {
    if (element) { // Elementin var olduğundan emin ol
        element.textContent = message;
    }
}

// Genel Alan Bazlı Doğrulama Ayarlama Fonksiyonu (auth.js'tekine benzer)
function setupFormFieldValidation(inputEl, errorEl, validationFn, ...args) {
    if (!inputEl || !errorEl) return; // Elementler yoksa işlem yapma

    const validateAndDisplay = () => {
        const errorMessage = validationFn(inputEl.value, ...args);
        displayFormError(errorEl, errorMessage);
        return !errorMessage; // Hata yoksa true döner
    };

    inputEl.addEventListener('blur', validateAndDisplay);
    inputEl.addEventListener('input', () => {
        if (errorEl.textContent !== "") { // Sadece hata varsa temizle veya anlık doğrula
             validateAndDisplay();
        }
    });
    return validateAndDisplay; // Submit için kullanılabilir
}

// Araç formu için olay dinleyicileri ve doğrulayıcıları ayarlama
const carFormValidators = {
    plate: setupFormFieldValidation(carPlateInput, carPlateError, validatePlate),
    brand: setupFormFieldValidation(carBrandInput, carBrandError, (val) => validateRequired(val, 'Marka')),
    model: setupFormFieldValidation(carModelInput, carModelError, (val) => validateRequired(val, 'Model')),
    year: setupFormFieldValidation(carYearInput, carYearError, validateYear),
    color: setupFormFieldValidation(carColorInput, carColorError, (val) => validateRequired(val, 'Renk')),
    image: setupFormFieldValidation(carImageInput, carImageError, validateImageUrl)
};

// Araç listesini yükle
function loadCars() {
    if (isLoadingCars) {
        console.log("loadCars zaten çalışıyor, tekrar çağrılmadı.");
        return;
    }
    isLoadingCars = true;
    console.log("[loadCars] Başladı. Tarih Filtresi Değeri:", dateFilter.value);
    
    // Tarih boş veya geçersizse bugünün tarihini kullan
    const selectedDate = dateFilter.value && !isNaN(new Date(dateFilter.value).getTime()) 
        ? new Date(dateFilter.value) 
        : new Date();
    
    selectedDate.setHours(0, 0, 0, 0);
    const dateStr = getLocalDateString(selectedDate);
    console.log(`[loadCars] Seçilen tarih: ${dateStr}`);
    
    // Önce tüm araçları çekelim
    db.ref('cars').once('value')
        .then(carsSnapshot => {
            if (!carsSnapshot.exists()) {
                console.log("[loadCars] Henüz araç eklenmemiş.");
                isLoadingCars = false;
                
                // İstatistikleri sıfırla
                if (totalCarsElement) {
                    totalCarsElement.textContent = "0";
                }
                if (availableCarsElement) {
                    availableCarsElement.textContent = "0";
                }
                
                return;
            }
            
            const cars = [];
            
            // Araçları diziye al
            carsSnapshot.forEach(childSnapshot => {
                cars.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            
            console.log(`[loadCars] Toplam ${cars.length} araç bulundu.`);
            
            // Şimdi o tarihteki rezervasyonları al
            return db.ref('reservations')
                .orderByChild('date')
                .equalTo(dateStr)
                .once('value')
                .then(reservationsSnapshot => {
                    const reservedCarIds = new Set();
                    
                    // Aktif rezervasyonları bul
                    if (reservationsSnapshot.exists()) {
                        reservationsSnapshot.forEach(childSnapshot => {
                            const reservation = childSnapshot.val();
                            // Sadece onaylanmış veya bekleyen rezervasyonları dikkate al
                            if (reservation.status !== 'rejected') {
                                // Geçmiş saatte biten rezervasyonları kontrol et
                                const now = new Date();
                                const currentTimeStr = now.getHours().toString().padStart(2, '0') + ":" + 
                                                     now.getMinutes().toString().padStart(2, '0');
                                const currentDateStr = getLocalDateString(now);
                                
                                // Eğer bugün ise ve bitiş saati geçmişse, bu araç artık müsait
                                if (!(dateStr === currentDateStr && reservation.endTime <= currentTimeStr)) {
                                    reservedCarIds.add(reservation.carId);
                                }
                            }
                        });
                    }
                    
                    // Müsait araçları filtrele
                    const availableCars = cars.filter(car => !reservedCarIds.has(car.id));
                    const availableCount = availableCars.length;
                    
                    console.log(`[loadCars] ${dateStr} tarihi için ${availableCount}/${cars.length} araç müsait.`);
                    
                    // İstatistikleri güncelle
                    if (totalCarsElement) {
                        totalCarsElement.textContent = cars.length;
                    }
                    if (availableCarsElement) {
                        availableCarsElement.textContent = availableCount;
                    }
                    
                    // Müsaitlik panelini güncelleyelim
                    updateAvailabilityPanel(selectedDate);
                    
                    // Eğer araç listesi görünür durumda ise, araçları render et
                    if (!carList.classList.contains('hidden')) {
                        carList.innerHTML = '';
                        
                        if (cars.length === 0) {
                            carList.innerHTML = '<div class="no-cars">Henüz araç eklenmemiş.</div>';
                        } else {
                            // Her araç için müsait mi değil mi kontrol edip öyle render et
                            cars.forEach(car => {
                                const isAvailable = !reservedCarIds.has(car.id);
                                renderCarCard(car, isAvailable);
                            });
                        }
                    }
                    
                    return { 
                        cars, 
                        availableCount,
                        reservedCarIds: Array.from(reservedCarIds)
                    };
                });
        })
        .catch(error => {
            console.error("[loadCars] Araçlar yüklenirken hata:", error);
            isLoadingCars = false;
        })
        .finally(() => {
            isLoadingCars = false;
        });
}

// Rezervasyon kontrol et
function checkReservations(carId, date) {
    // Tarih boş veya geçersizse bugünün tarihini kullan
    const startOfDay = date && !isNaN(new Date(date).getTime()) 
        ? new Date(date) 
        : new Date();
    
    startOfDay.setHours(0, 0, 0, 0);
    const dateStr = getLocalDateString(startOfDay);
    console.log(`[checkReservations] Araç ID: ${carId}, Kontrol Edilen Tarih: ${dateStr}`);

    return db.ref('reservations')
        .orderByChild('carId')
        .equalTo(carId)
        .once('value')
        .then(snapshot => {
            // Eğer hiç rezervasyon yoksa, araç müsait
            if (!snapshot.exists()) {
                return true;
            }
            
            // Şu anki zamanı al
            const now = new Date();
            const currentTimeStr = now.getHours().toString().padStart(2, '0') + ":" + 
                                 now.getMinutes().toString().padStart(2, '0');
            const currentDateStr = getLocalDateString(now);
            
            // Rezervasyonlar varsa, tüm gün boyunca müsait mi kontrol et
            let isBookedForSelectedDate = false;
            snapshot.forEach(childSnapshot => {
                const res = childSnapshot.val();
                console.log(`[checkReservations] Bulunan Rez: Araç ID: ${res.carId}, Rez Tarihi: ${res.date}, Durum: ${res.status}`);
                
                // Rezervasyon seçilen tarihte mi ve iptal edilmemiş mi
                if (res.date === dateStr && res.status !== 'rejected') {
                    // Aynı gün içinde ve bitiş saati geçmişse bu rezervasyonu dikkate alma
                    if (dateStr === currentDateStr && res.endTime <= currentTimeStr) {
                        console.log(`[checkReservations] Araç ID: ${carId} için ${dateStr} tarihinde rezervasyon bulundu, ancak süresi geçti.`);
                    } else {
                        // Geçerli rezervasyon bulundu
                        isBookedForSelectedDate = true;
                        console.log(`[checkReservations] Araç ID: ${carId} için ${dateStr} tarihinde geçerli rezervasyon bulundu.`);
                    }
                }
            });
            
            console.log(`[checkReservations] Araç ID: ${carId}, Tarih: ${dateStr}, Müsait mi?: ${!isBookedForSelectedDate}`);
            return !isBookedForSelectedDate;
        })
        .catch(error => {
            console.error("Rezervasyon kontrolü sırasında hata:", error);
            return false; // Hata durumunda müsait değil olarak işaretle
        });
}

// Araç kartını oluştur
function renderCarCard(car, isAvailable) {
    const card = document.createElement('div');
    card.className = 'car-card';
    
    // Görseli oluştur ve çalışan bir placeholder kullan
    const imageUrl = car.imageUrl || 'https://placehold.co/300x180?text=Arac+Gorseli';
    
    card.innerHTML = `
        <div class="car-image" style="background-image: url('${imageUrl}')"></div>
        <div class="car-info">
            <div class="car-title">${car.brand} ${car.model}</div>
            <div class="car-plate">${car.plate}</div>
            <div class="car-details">
                <div>Yıl: ${car.year || 'Belirtilmemiş'}</div>
                <div>Renk: ${car.color || 'Belirtilmemiş'}</div>
            </div>
            <div class="car-status ${isAvailable ? 'status-available' : 'status-unavailable'}">
                ${isAvailable ? 'Müsait' : 'Rezerve Edilmiş'}
            </div>
            ${isAvailable ? `<button class="reserve-btn" data-car-id="${car.id}">Rezervasyon Yap</button>` : ''}
            
            <div class="car-admin-buttons ${window.currentUser && window.isAdmin(window.currentUser.email) ? '' : 'hidden'}">
                <button class="edit-car-btn" data-car-id="${car.id}"><i class="fas fa-edit"></i> Düzenle</button>
                <button class="delete-car-btn" data-car-id="${car.id}"><i class="fas fa-trash-alt"></i> Sil</button>
            </div>
        </div>
    `;
    
    carList.appendChild(card);
    
    // Rezervasyon butonu için olay dinleyicisi
    if (isAvailable) {
        card.querySelector('.reserve-btn').addEventListener('click', () => {
            openReservationModal(car);
        });
    }
    
    // Admin ise düzenleme ve silme butonları görünür
    if (window.currentUser && window.isAdmin(window.currentUser.email)) {
        // Düzenleme butonu için olay dinleyicisi
        const editBtn = card.querySelector('.edit-car-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                openEditCarModal(car);
            });
        }
        
        // Silme butonu için olay dinleyicisi
        const deleteBtn = card.querySelector('.delete-car-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                confirmDeleteCar(car);
            });
        }
    }
}

// Rezervasyon modalını aç
function openReservationModal(car) {
    console.log("[openReservationModal] Çağrıldı, araç bilgisi:", car);
    console.log("[openReservationModal] dateFilter.value başlangıçta:", dateFilter.value);
    
    // Araç nesnesinin geçerli olup olmadığını kontrol et
    if (!car || !car.id) {
        console.error("[openReservationModal] Geçersiz araç nesnesi:", car);
        alert("Rezervasyon oluşturulamadı: Araç bilgisi eksik.");
        return;
    }
    
    carDetails.innerHTML = `
        <div class="selected-car-details">
            <h4>${car.brand} ${car.model}</h4>
            <div>Plaka: ${car.plate}</div>
            <div>Yıl: ${car.year}</div>
            <div>Renk: ${car.color}</div>
        </div>
    `;
    
    // Geçmiş tarihlere rezervasyon yapılamaması için minimum tarihi bugün olarak ayarla
    const today = new Date().toISOString().split('T')[0];
    const reservationDateInput = document.getElementById('reservationDate');
    reservationDateInput.min = today;
    
    // Eğer müsaitlik panelinden seçilmiş bir tarih varsa, onu kullanalım
    const selectedDate = availabilityPanel.getAttribute('data-selected-date');
    let dateToUse = selectedDate || dateFilter.value;
    
    // Seçilen tarih bugünden önceyse, bugünün tarihini seç
    if (dateToUse < today) {
        dateToUse = today;
    }
    
    console.log("[openReservationModal] Kullanılacak rezervasyon tarihi:", dateToUse);
    document.getElementById('reservationDate').value = dateToUse;
    document.getElementById('carId').value = car.id;
    
    // Başlık ve buton içeriğini sıfırla (düzenleme yapıldıysa değişmiş olabilir)
    document.querySelector('#reservationModal h3').textContent = 'Araç Rezervasyonu';
    const submitBtn = document.querySelector('#reservation-form button[type="submit"]');
    submitBtn.textContent = 'Rezervasyon Yap';
    
    // Eğer varsa, rezervasyon ID alanını kaldır (düzenleme modundan sonra olabilir)
    const reservationIdInput = document.getElementById('reservationId');
    if (reservationIdInput) {
        reservationIdInput.remove();
    }
    
    // Form içeriğini temizle ama girdiğimiz değerleri koruyalım
    document.getElementById('reservation-form').reset();
    document.getElementById('reservationDate').value = dateToUse;
    document.getElementById('carId').value = car.id;
    
    reservationModal.classList.remove('hidden');
}

// Araç düzenleme modalını aç
function openEditCarModal(car) {
    currentEditCarId = car.id;
    addCarForm.reset();
    
    carPlateInput.value = car.plate;
    carBrandInput.value = car.brand;
    carModelInput.value = car.model;
    carYearInput.value = car.year;
    carColorInput.value = car.color;
    carImageInput.value = car.imageUrl || '';
    
    // Hata mesajlarını daha güvenli temizle
    if(carPlateError) carPlateError.textContent = '';
    if(carBrandError) carBrandError.textContent = '';
    if(carModelError) carModelError.textContent = '';
    if(carYearError) carYearError.textContent = '';
    if(carColorError) carColorError.textContent = '';
    if(carImageError) carImageError.textContent = '';
    
    document.querySelector('#addCarModal h3').textContent = 'Araç Düzenle';
    document.querySelector('#add-car-form button[type="submit"]').textContent = 'Güncelle';
    
    addCarModal.classList.remove('hidden');
}

// Araç silmeyi onayla
function confirmDeleteCar(car) {
    if (confirm(`"${car.brand} ${car.model}" (${car.plate}) aracını silmek istediğinize emin misiniz?`)) {
        deleteCar(car.id);
    }
}

// Aracı sil
function deleteCar(carId) {
    db.ref(`cars/${carId}`).remove()
        .then(() => {
            alert("Araç başarıyla silindi.");
            loadCars();
            updateStats();
        })
        .catch(error => {
            alert(`Araç silinirken hata oluştu: ${error.message}`);
        });
}

// Araç ekleme modalını aç
function openAddCarModal() {
    currentEditCarId = null;
    addCarForm.reset();
    // Hata mesajlarını daha güvenli temizle
    if(carPlateError) carPlateError.textContent = '';
    if(carBrandError) carBrandError.textContent = '';
    if(carModelError) carModelError.textContent = '';
    if(carYearError) carYearError.textContent = '';
    if(carColorError) carColorError.textContent = '';
    if(carImageError) carImageError.textContent = '';

    document.querySelector('#addCarModal h3').textContent = 'Yeni Araç Ekle';
    document.querySelector('#add-car-form button[type="submit"]').textContent = 'Ekle';
    
    addCarModal.classList.remove('hidden');
}

// Modalları kapat
document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', () => {
        // Daha genel bir modal kapatma
        const modal = button.closest('.modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    });
});

// İstatistikleri güncelle
function updateStats() {
    // Bugünkü rezervasyonlar
    const today = new Date().toISOString().split('T')[0];
    
    db.ref('reservations').once('value')
        .then(snapshot => {
            let todayCount = 0;
            let totalCount = 0;
            
            snapshot.forEach(childSnapshot => {
                const reservation = childSnapshot.val();
                // Sadece onaylanmış veya bekleyen rezervasyonları sayalım
                if (reservation.status !== 'rejected') {
                    totalCount++;
                    
                    if (reservation.date === today) {
                        todayCount++;
                    }
                }
            });
            
            if (todayReservationsElement) {
                todayReservationsElement.textContent = todayCount;
            }
            
            if (totalReservationsElement) {
                totalReservationsElement.textContent = totalCount;
            }
        })
        .catch(error => {
            console.error("Rezervasyon istatistikleri yüklenirken hata oluştu:", error);
        });
}

// Marka filtresini doldur
function loadBrandFilter() {
    db.ref('cars').once('value')
        .then(snapshot => {
            const brands = new Set();
            
            snapshot.forEach(childSnapshot => {
                const car = childSnapshot.val();
                if (car.brand) {
                    brands.add(car.brand);
                }
            });
            
            // Select'i temizle
            brandFilter.innerHTML = '<option value="">Tümü</option>';
            
            // Markaları ekle
            brands.forEach(brand => {
                const option = document.createElement('option');
                option.value = brand;
                option.textContent = brand;
                brandFilter.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Markalar yüklenirken hata oluştu:", error);
        });
}

// Takvim görünümünü oluştur
function renderCalendar() {
    const today = new Date();
    const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Takvim başlığını güncelle
    calendarMonth.textContent = currentDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
    
    // Grid'i temizle
    calendarGrid.innerHTML = '';
    
    // Haftanın günlerini ekle
    const weekdays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    weekdays.forEach(day => {
        const weekdayCell = document.createElement('div');
        weekdayCell.className = 'calendar-weekday';
        weekdayCell.textContent = day;
        calendarGrid.appendChild(weekdayCell);
    });
    
    // Ayın ilk gününü hesapla
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    // İlk günün haftanın hangi günü olduğunu bul (0: Pazar, 1: Pazartesi, ...)
    // JavaScript'te haftanın ilk günü Pazar (0), ama takvimde Pazartesi (1) olacak
    let dayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    
    // Önceki ayın son günlerini ekle
    const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    
    for (let i = 0; i < dayOfWeek; i++) {
        const prevMonthDay = document.createElement('div');
        prevMonthDay.className = 'calendar-date';
        prevMonthDay.style.opacity = '0.5';
        prevMonthDay.innerHTML = `<div class="date-number">${prevMonthLastDay - dayOfWeek + i + 1}</div>`;
        calendarGrid.appendChild(prevMonthDay);
    }
    
    // Bu ayın günlerini ekle
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    
    const dateCreationPromises = [];
    
    for (let i = 1; i <= lastDay; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        const dateCell = document.createElement('div');
        dateCell.className = 'calendar-date';
        
        // Bugünün tarihi ise özel stil uygula
        if (date.getDate() === today.getDate() && 
            date.getMonth() === today.getMonth() && 
            date.getFullYear() === today.getFullYear()) {
            dateCell.style.backgroundColor = 'rgba(37, 99, 235, 0.05)';
            dateCell.style.fontWeight = 'bold';
        }
        
        // Geçmiş tarih ise stili değiştir
        if (date < todayWithoutTime) {
            dateCell.classList.add('past-date');
            dateCell.title = 'Geçmiş tarihe rezervasyon yapılamaz';
        }
        
        // Seçilen tarihi kontrol et ve seçili gün stilini uygula
        if (dateFilter.value) {
            const selectedDate = new Date(dateFilter.value);
            if (date.getDate() === selectedDate.getDate() && 
                date.getMonth() === selectedDate.getMonth() && 
                date.getFullYear() === selectedDate.getFullYear()) {
                dateCell.classList.add('selected-date');
            }
        }
        
        dateCell.innerHTML = `<div class="date-number">${i}</div>`;
        
        // Rezervasyon sayısı göstergesi ekleme
        const eventIndicator = document.createElement('div');
        eventIndicator.className = 'event-indicator';
        eventIndicator.style.display = 'none'; // Başlangıçta gizli
        dateCell.appendChild(eventIndicator);
        
        // Gün için müsaitlik rengi ve bilgisi ekle
        if (!(date < todayWithoutTime)) {
            // Her hücre için özel bir yükleniyor göstergesi ekle
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'availability-loading';
            loadingIndicator.textContent = '...';
            dateCell.appendChild(loadingIndicator);
            
            const availabilityPromise = checkCarAvailabilityForDate(date).then(availabilityData => {
                // Yükleniyor göstergesini kaldır
                if (loadingIndicator && loadingIndicator.parentNode) {
                    loadingIndicator.remove();
                }
                
                if (availabilityData.totalCount > 0) {
                    // Müsaitlik oranına göre renk sınıfı ekle
                    if (availabilityData.percentage === 100) {
                        dateCell.classList.add('all-available');
                        dateCell.title = 'Tüm araçlar müsait';
                    } else if (availabilityData.percentage >= 60) {
                        dateCell.classList.add('mostly-available');
                        dateCell.title = `Araçların ${availabilityData.percentage}% müsait (${availabilityData.availableCount}/${availabilityData.totalCount})`;
                    } else if (availabilityData.percentage > 0) {
                        dateCell.classList.add('limited-available');
                        dateCell.title = `Araçların ${availabilityData.percentage}% müsait (${availabilityData.availableCount}/${availabilityData.totalCount})`;
                    } else {
                        dateCell.classList.add('no-available');
                        dateCell.title = 'Müsait araç yok';
                    }
                    
                    // Eğer zaten bir müsaitlik rozeti (badge) varsa, kaldır
                    const existingBadge = dateCell.querySelector('.availability-badge');
                    if (existingBadge) {
                        existingBadge.remove();
                    }
                    
                    // Müsaitlik durumunu göstermek için hücre içinde bir gösterge oluştur
                    const availabilityBadge = document.createElement('div');
                    availabilityBadge.className = 'availability-badge';
                    availabilityBadge.textContent = `${availabilityData.availableCount}/${availabilityData.totalCount}`;
                    dateCell.appendChild(availabilityBadge);
                    
                    // Konsola her tarih için müsaitlik verilerini yazdır (hata ayıklama için)
                    console.log(`Takvim hücresi güncellendi - ${getLocalDateString(date)}: ${availabilityData.availableCount}/${availabilityData.totalCount}`);
                } else {
                    console.log(`Takvim hücresi - ${getLocalDateString(date)}: Araç bulunamadı`);
                }
            }).catch(error => {
                console.error(`Tarih için müsaitlik kontrolü yapılırken hata: ${date}`, error);
                if (loadingIndicator && loadingIndicator.parentNode) {
                    loadingIndicator.remove();
                }
            });
            
            dateCreationPromises.push(availabilityPromise);
        }
        
        // Günün rezervasyon durumunu kontrol et ve göstergelerini ekle
        checkDateReservations(date)
            .then(reservationCount => {
                showReservationCountForDate(date, eventIndicator);
            });
        
        // Gün hücresine tıklama olayı ekle
        dateCell.addEventListener('click', () => {
            // Tüm seçili tarihlerin sınıfını kaldır
            document.querySelectorAll('.calendar-date').forEach(cell => {
                cell.classList.remove('selected-date');
            });
            
            // Bu tarihi seçili olarak işaretle
            dateCell.classList.add('selected-date');
            
            const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
            dateFilter.value = dateStr;
            
            // Seçilen günün günlük rezervasyon modalını aç
            openDailyReservationsModal(new Date(dateStr));
        });
        
        calendarGrid.appendChild(dateCell);
    }
    
    // Tüm müsaitlik kontrolleri tamamlandığında işlem yap
    Promise.all(dateCreationPromises).then(() => {
        console.log("Takvimde tüm günler için müsaitlik kontrolleri tamamlandı");
        
        // Müsait araç sayısını da kontrol et ve güncelle
        if (availableCarsElement) {
            const today = new Date();
            checkCarAvailabilityForDate(today).then(availabilityData => {
                console.log(`Bugün için müsait araç sayısı: ${availabilityData.availableCount}/${availabilityData.totalCount}`);
                availableCarsElement.textContent = availabilityData.availableCount;
            });
        }
    }).catch(error => {
        console.error("Takvim günleri oluşturulurken hata:", error);
    });
    
    // Sonraki ayın ilk günlerini ekle
    const totalCells = weekdays.length * 6; // 6 satır, 7 sütun
    const remainingCells = totalCells - (dayOfWeek + lastDay);
    
    for (let i = 1; i <= remainingCells; i++) {
        const nextMonthDay = document.createElement('div');
        nextMonthDay.className = 'calendar-date';
        nextMonthDay.style.opacity = '0.5';
        nextMonthDay.innerHTML = `<div class="date-number">${i}</div>`;
        calendarGrid.appendChild(nextMonthDay);
    }
}

// Belirli bir tarihteki rezervasyon sayısını ve tooltip'i gösterir
function showReservationCountForDate(date, indicatorElement) {
    const dateStr = getLocalDateString(date);
    
    db.ref('reservations').orderByChild('date').equalTo(dateStr).once('value')
        .then(snapshot => {
            if (snapshot.exists()) {
                let count = 0;
                snapshot.forEach(() => count++);
                
                // Göstergeyi görünür yap
                indicatorElement.style.display = 'block';
                
                // Tooltip ekle
                indicatorElement.setAttribute('title', `${count} rezervasyon`);
                
                // Rezervasyon sayısına göre renk değiştir (opsiyonel)
                if (count > 3) {
                    indicatorElement.style.backgroundColor = 'var(--danger-color)';
                } else if (count > 1) {
                    indicatorElement.style.backgroundColor = 'var(--warning-color)';
                }
            }
        });
}

// Takvim ay değiştirme
prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// Filtre fonksiyonunu güncelle
// ... existing code ...

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    // Bugünün tarihini dateFilter'a ata
    if (dateFilter) {
        dateFilter.value = getLocalDateString(new Date());
    }
    
    // Araçları yükle ve istatistikleri güncelle
    loadCars(); // Bu fonksiyon araç sayısı ve müsait araç sayısını hesaplayacak
    updateStats(); // Bu fonksiyon bugünkü ve toplam rezervasyon sayısını hesaplayacak
    renderCalendar(); // Takvimi render et
    
    // Kullanıcı giriş yapmışsa rezervasyonları yükle
    if (window.currentUser) {
        loadDashboardUserReservations();
    }
    
    // Rezervasyon formunun submit olayını dinle
    const reservationForm = document.getElementById('reservation-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', handleReservationSubmit);
    }
    
    // Tarih değiştiğinde araç durumu panelini göster/güncelle
    dateFilter.addEventListener('change', () => {
        console.log("Tarih değişti:", dateFilter.value);
        handleDateFilterChange();
    });
    
    // İleri-geri butonları için takvim navigasyonu
    document.getElementById('prev-month').addEventListener('click', () => {
        handleMonthChange(-1);
    });
    
    document.getElementById('next-month').addEventListener('click', () => {
        handleMonthChange(1);
    });
    
    console.log("[DOMContentLoaded] Sayfa yüklendi, tüm işlevler çağrıldı");
});

// Yeni rezervasyon gönderim işleyicisi
function handleReservationSubmit(e) {
    e.preventDefault();
    
    // Rezervasyon ID'si varsa düzenleme modu, yoksa yeni rezervasyon modu
    const reservationId = document.getElementById('reservationId') ? document.getElementById('reservationId').value : null;
    
    const carId = document.getElementById('carId').value;
    const date = document.getElementById('reservationDate').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const note = document.getElementById('reservationNote').value;

    console.log("[Reservation Submit] Formdan alınan tarih:", date);
    
    // Geçmiş tarih kontrolü
    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
        alert("Geçmiş tarihe rezervasyon yapılamaz. Lütfen bugün veya daha sonraki bir tarih seçin.");
        return;
    }
    
    // Bitiş saatinin başlangıç saatinden sonra olduğunu kontrol et
    if (startTime >= endTime) {
        alert("Bitiş saati başlangıç saatinden sonra olmalıdır.");
        return;
    }
    
    // Çakışan rezervasyonları kontrol et
    db.ref('reservations')
        .orderByChild('carId')
        .equalTo(carId)
        .once('value')
        .then(snapshot => {
            let conflict = false;
            let conflictDetails = [];
            
            snapshot.forEach(childSnapshot => {
                const res = childSnapshot.val();
                
                // Düzenleme modunda ise kendi rezervasyonunu atla
                if (reservationId && childSnapshot.key === reservationId) return;
                
                // Sadece aynı tarihteki rezervasyonları kontrol et
                if (res.date === date) {
                    if (isTimeOverlap(
                        startTime, 
                        endTime, 
                        res.startTime, 
                        res.endTime
                    )) {
                        conflict = true;
                        conflictDetails.push({
                            startTime: res.startTime,
                            endTime: res.endTime,
                            user: res.userName || "Bilinmeyen Kullanıcı"
                        });
                    }
                }
            });
            
            if (conflict) {
                let conflictMessage = "Bu saat aralığında araç için zaten rezervasyon var:\n\n";
                conflictDetails.forEach(conflict => {
                    conflictMessage += `- ${conflict.startTime} - ${conflict.endTime} (${conflict.user})\n`;
                });
                conflictMessage += "\nLütfen başka bir saat aralığı seçin.";
                alert(conflictMessage);
                return;
            }
            
            if (reservationId) {
                // DÜZENLEME MODU: Rezervasyonu güncelle
                const updatedData = {
                    date: date,
                    startTime: startTime,
                    endTime: endTime,
                    note: note,
                    updatedAt: firebase.database.ServerValue.TIMESTAMP
                };

                return db.ref(`reservations/${reservationId}`).update(updatedData)
                    .then(() => {
                        // Modalı kapat ve formu sıfırla
                        reservationModal.classList.add('hidden');
                        document.getElementById('reservation-form').reset();
                        
                        // Hidden rezervasyon ID alanını kaldır
                        const reservationIdInput = document.getElementById('reservationId');
                        if (reservationIdInput) {
                            reservationIdInput.remove();
                        }
                        
                        // Başlık ve butonu sıfırla
                        document.querySelector('#reservationModal h3').textContent = 'Araç Rezervasyonu';
                        document.querySelector('#reservation-form button[type="submit"]').textContent = 'Rezervasyon Yap';
                        
                        // Başarı mesajı
                        alert("Rezervasyon başarıyla güncellendi!");
                        
                        // Gerekli güncelleme fonksiyonlarını çağır
                        loadCars(); 
                        updateStats(); 
                        loadUserReservations();
                        loadDashboardUserReservations();
                        renderCalendar();
                    });
            } else {
                // YENİ REZERVASYON MODU: Rezervasyonu kaydet
                const newReservationData = {
                    carId: carId,
                    userId: auth.currentUser.uid,
                    userName: auth.currentUser.displayName || auth.currentUser.email,
                    userEmail: auth.currentUser.email,
                    date: date,
                    startTime: startTime,
                    endTime: endTime,
                    note: note,
                    status: 'pending', // Onay bekleyen durum
                    createdAt: firebase.database.ServerValue.TIMESTAMP
                };

                return db.ref('reservations').push(newReservationData)
                    .then((ref) => {
                        // Rezervasyon ID'sini al
                        const reservationId = ref.key;
                        console.log('🎯 Yeni rezervasyon veritabanına eklendi. ID:', reservationId);
                        console.log('☁️ Sunucu tarafı fonksiyon (onReservationCreated) e-postayı gönderecek.');
                        
                        // Modalı kapat ve formu sıfırla
                        reservationModal.classList.add('hidden');
                        document.getElementById('reservation-form').reset();
                        
                        // Başarı mesajı
                        alert("Rezervasyon talebiniz alındı ve yönetici onayına gönderildi.");
                        
                        // Gerekli güncelleme fonksiyonlarını çağır
                        loadCars(); 
                        updateStats(); 
                        loadDashboardUserReservations();
                        
                        // Takvimi küçük bir gecikmeyle yenile
                        setTimeout(() => {
                            renderCalendar(); 
                        }, 500);
                    });
            }
        })
        .catch(error => {
            alert(`Rezervasyon işlemi sırasında hata oluştu: ${error.message}`);
        });
}

// Araç ekleme butonu
addCarBtn.addEventListener('click', () => {
    openAddCarModal();
});

// Yeni araç ekle veya düzenle
addCarForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Formu gönderim öncesi doğrula
    let isFormValid = true;
    Object.values(carFormValidators).forEach(validatorFn => {
        if (validatorFn && !validatorFn()) { // validatorFn varsa ve false dönerse (hata varsa)
            isFormValid = false;
        }
    });

    if (!isFormValid) {
        alert("Lütfen formdaki hataları düzeltin.");
        return;
    }
    
    const carData = {
        plate: carPlateInput.value.trim().toUpperCase(),
        brand: carBrandInput.value.trim(),
        model: carModelInput.value.trim(),
        year: parseInt(carYearInput.value),
        color: carColorInput.value.trim(),
        imageUrl: carImageInput.value.trim() || null,
        updatedAt: firebase.database.ServerValue.TIMESTAMP
    };
    
    let savePromise;
    
    if (currentEditCarId) {
        // Varolan aracı güncelle
        savePromise = db.ref(`cars/${currentEditCarId}`).update(carData);
    } else {
        // Yeni araç ekle
        carData.addedBy = auth.currentUser.uid;
        carData.createdAt = firebase.database.ServerValue.TIMESTAMP;
        savePromise = db.ref('cars').push(carData);
    }
    
    savePromise
        .then(() => {
            addCarModal.classList.add('hidden');
            loadCars();
            updateStats();
            loadBrandFilter();
            alert(currentEditCarId ? "Araç başarıyla güncellendi!" : "Araç başarıyla eklendi!");
        })
        .catch(error => {
            alert(`${currentEditCarId ? 'Araç güncellenirken' : 'Araç eklenirken'} hata oluştu: ${error.message}`);
        });
});

// Rezervasyonları yönet
manageReservationsBtn.addEventListener('click', () => {
    reservationDateFilter.valueAsDate = new Date();
    openReservationManagement();
});

// Panele dön butonuna tıklama
backToDashboardBtn.addEventListener('click', () => {
    reservationManagementSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
});

// Test e-postası butonu
testEmailBtn.addEventListener('click', async () => {
    try {
        console.log('Test e-postası gönderiliyor...');
        await window.sendTestEmail();
    } catch (error) {
        console.error('Test e-postası hatası:', error);
        alert('Test e-postası gönderilirken hata oluştu: ' + error.message);
    }
});

// Rezervasyon yönetim ekranını aç
function openReservationManagement() {
    dashboardSection.classList.add('hidden');
    reservationManagementSection.classList.remove('hidden');
    
    loadReservations();
}

// Rezervasyonları yükle
function loadReservations() {
    reservationsList.innerHTML = '<div class="loading">Rezervasyonlar yükleniyor...</div>';
    
    const statusFilter = reservationStatusFilter.value;
    const dateFilter = reservationDateFilter.value ? reservationDateFilter.value : null;
    
    db.ref('reservations').once('value')
        .then(snapshot => {
            if (!snapshot.exists()) {
                reservationsList.innerHTML = '<div class="no-reservations">Henüz rezervasyon bulunmuyor.</div>';
                return;
            }
            
            reservationsList.innerHTML = '';
            
            // Rezervasyonları filtrele ve sırala
            const reservations = [];
            
            snapshot.forEach(childSnapshot => {
                const reservation = {
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                };
                
                // Durum filtreleme
                if (statusFilter !== 'all' && reservation.status !== statusFilter) {
                    return;
                }
                
                // Tarih filtreleme
                if (dateFilter && reservation.date !== dateFilter) {
                    return;
                }
                
                reservations.push(reservation);
            });
            
            if (reservations.length === 0) {
                reservationsList.innerHTML = '<div class="no-reservations">Seçilen kriterlerde rezervasyon bulunamadı.</div>';
                return;
            }
            
            // En yakın tarihli rezervasyonlar önce
            reservations.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            // Her rezervasyon için araç bilgilerini al ve kartı oluştur
            reservations.forEach(reservation => {
                db.ref(`cars/${reservation.carId}`).once('value')
                    .then(carSnapshot => {
                        const car = carSnapshot.val() || { brand: 'Bilinmeyen', model: 'Araç', plate: '' };
                        renderReservationCard(reservation, car);
                    });
            });
        })
        .catch(error => {
            console.error("Rezervasyonlar yüklenirken hata oluştu:", error);
            reservationsList.innerHTML = '<div class="error">Rezervasyonlar yüklenirken bir hata oluştu.</div>';
        });
}

// Duruma göre etiket döndür
function getStatusLabel(status) {
    switch (status) {
        case 'pending': return 'Beklemede';
        case 'approved': return 'Onaylandı';
        case 'rejected': return 'Reddedildi';
        default: return status;
    }
}

// Rezervasyon kartını oluştur
function renderReservationCard(reservation, car) {
    const statusLabel = getStatusLabel(reservation.status);
    const statusClass = `status-${reservation.status}`;
    
    const reservationCard = document.createElement('div');
    reservationCard.className = 'reservation-card';
    
    let adminButtonsHTML = '';
    if (window.currentUser && window.isAdmin(window.currentUser.email)) {
        adminButtonsHTML = `
            <button class="approve-btn" data-id="${reservation.id}" style="display: ${reservation.status === 'pending' ? 'inline-block' : 'none'};"><i class="fas fa-check"></i> Onayla</button>
            <button class="reject-btn" data-id="${reservation.id}" style="display: ${reservation.status === 'pending' ? 'inline-block' : 'none'};"><i class="fas fa-times"></i> Reddet</button>
            <button class="delete-reservation-btn" data-id="${reservation.id}"><i class="fas fa-trash-alt"></i> Sil</button>
        `;
    }

    reservationCard.innerHTML = `
        <div class="reservation-header">
            <div class="reservation-title">
                ${car.brand} ${car.model}
                <span class="car-plate">(${car.plate || 'Plaka Yok'})</span>
            </div>
            <div class="reservation-status ${statusClass}">${statusLabel}</div>
        </div>
        <div class="reservation-content">
            <div class="reservation-info">
                <ul>
                    <li><i class="fas fa-user"></i> ${reservation.userName || 'İsimsiz Kullanıcı'}</li>
                    <li><i class="fas fa-calendar"></i> Tarih: ${formatDate(new Date(reservation.date))}</li>
                    <li><i class="fas fa-clock"></i> Saat: ${reservation.startTime} - ${reservation.endTime}</li>
                </ul>
            </div>
            <div class="reservation-actions">
                <button class="view-btn" data-id="${reservation.id}"><i class="fas fa-eye"></i> Detay</button>
                ${adminButtonsHTML}
            </div>
        </div>
    `;
    
    reservationsList.appendChild(reservationCard);
    
    // Butonlar için olay dinleyicileri
    const viewBtn = reservationCard.querySelector('.view-btn');
    viewBtn.addEventListener('click', () => {
        openReservationDetail(reservation, car);
    });
    
    if (window.currentUser && window.isAdmin(window.currentUser.email)) {
        // Onaylama butonu (listeden)
        const approveBtnList = reservationCard.querySelector('.approve-btn');
        if (approveBtnList) {
            approveBtnList.addEventListener('click', (e) => {
                e.stopPropagation(); // Detay modalının açılmasını engelle
                updateReservationStatus(reservation.id, 'approved');
            });
        }
        
        // Reddetme butonu (listeden)
        const rejectBtnList = reservationCard.querySelector('.reject-btn');
        if (rejectBtnList) {
            rejectBtnList.addEventListener('click', (e) => {
                e.stopPropagation();
                openRejectionReasonModal(reservation.id);
            });
        }

        // Silme butonu (listeden)
        const deleteBtnList = reservationCard.querySelector('.delete-reservation-btn');
        if (deleteBtnList) {
            deleteBtnList.addEventListener('click', (e) => {
                e.stopPropagation();
                confirmDeleteReservation(reservation.id, `${car.brand} ${car.model} (${formatDate(new Date(reservation.date))} ${reservation.startTime}-${reservation.endTime})`);
            });
        }
    }
}

// Rezervasyon detaylarını aç
function openReservationDetail(reservation, car) {
    currentReservationId = reservation.id;
    currentCarForDetail = car; 
    currentReservationForDetail = reservation; // Rezervasyonu da sakla
    
    const statusLabel = getStatusLabel(reservation.status);
    const statusClass = `status-${reservation.status}`;
    
    // Detay içeriğini doldur
    reservationDetails.innerHTML = `
        <div class="reservation-detail-header">
            <h4>${car.brand} ${car.model} <span class="car-plate">${car.plate}</span></h4>
            <div class="reservation-status ${statusClass}">${statusLabel}</div>
        </div>
        <div class="reservation-detail-info">
            <ul>
                <li><i class="fas fa-user"></i> <strong>Kullanıcı:</strong> ${reservation.userName || 'İsimsiz Kullanıcı'}</li>
                <li><i class="fas fa-envelope"></i> <strong>E-posta:</strong> <a href="mailto:${reservation.userEmail || '#'}">${reservation.userEmail || 'Bilinmiyor'}</a></li>
                <li><i class="fas fa-calendar"></i> <strong>Tarih:</strong> ${formatDate(new Date(reservation.date))}</li>
                <li><i class="fas fa-clock"></i> <strong>Saat:</strong> ${reservation.startTime} - ${reservation.endTime}</li>
                ${reservation.note ? `<li><i class="fas fa-sticky-note"></i> <strong>Not:</strong> ${reservation.note}</li>` : ''}
                <li><i class="fas fa-info-circle"></i> <strong>Durum:</strong> <span class="${statusClass}">${statusLabel}</span></li>
                <li><i class="fas fa-clock"></i> <strong>Oluşturulma:</strong> ${reservation.createdAt ? formatDate(new Date(reservation.createdAt)) : 'Bilinmiyor'}</li>
            </ul>
        </div>
    `;
    
    // Onay/red/sil butonlarını göster/gizle (admin için)
    const adminActionsDiv = document.getElementById('adminActions');
    if (window.currentUser && window.isAdmin(window.currentUser.email)) {
        adminActionsDiv.classList.remove('hidden');
        approveReservationBtn.style.display = reservation.status === 'pending' ? 'block' : 'none';
        rejectReservationBtn.style.display = reservation.status === 'pending' ? 'block' : 'none';
        deleteReservationModalBtn.style.display = 'block';
    } else {
        adminActionsDiv.classList.add('hidden');
    }
    
    // Modalı göster
    reservationDetailModal.classList.remove('hidden');
}

// Rezervasyon durumunu güncelle
async function updateReservationStatus(reservationId, status, rejectionReason = null) {
    try {
        // Rezervasyon durumunu güncelle
        const updateData = {
            status: status,
            updatedAt: firebase.database.ServerValue.TIMESTAMP
        };
        
        // Red sebebini ekle
        if (status === 'rejected' && rejectionReason) {
            updateData.rejectionReason = rejectionReason;
            updateData.rejectedAt = firebase.database.ServerValue.TIMESTAMP;
        }
        
        // Onay tarihini ekle
        if (status === 'approved') {
            updateData.approvedAt = firebase.database.ServerValue.TIMESTAMP;
            updateData.approvedBy = auth.currentUser.email;
        }
        
        await db.ref(`reservations/${reservationId}`).update(updateData);
        
        // Manuel e-posta gönderimi (geçici çözüm)
        console.log(`Rezervasyon durumu güncellendi: ${status}. Kullanıcıya e-posta gönderiliyor...`);
        try {
            // Rezervasyon verilerini al
            const reservationSnapshot = await db.ref(`reservations/${reservationId}`).once('value');
            const reservationData = reservationSnapshot.val();
            
            // Araç verilerini al
            const carSnapshot = await db.ref(`cars/${reservationData.carId}`).once('value');
            const carData = carSnapshot.val();
            
            // E-posta verilerini hazırla
            const emailData = {
                ...reservationData,
                id: reservationId,
                carName: `${carData.brand} ${carData.model}`,
                totalCost: reservationData.totalCost || 0
            };
            
            if (status === 'approved') {
                await window.emailConfig.sendApprovalEmail(emailData);
            } else if (status === 'rejected') {
                await window.emailConfig.sendRejectionEmail(emailData, rejectionReason);
            }
            
            console.log('E-posta başarıyla gönderildi');
        } catch (error) {
            console.error('E-posta gönderim hatası:', error);
        }
        
        alert(`Rezervasyon ${status === 'approved' ? 'onaylandı' : 'reddedildi'}. Kullanıcıya e-posta bildirimi gönderildi.`);
        loadReservations();
        
        // Eğer detay modalı açıksa kapat
        if (!reservationDetailModal.classList.contains('hidden')) {
            reservationDetailModal.classList.add('hidden');
        }
        
    } catch (error) {
        console.error('Rezervasyon durumu güncellenirken hata:', error);
        alert(`Durum güncellenirken hata oluştu: ${error.message}`);
    }
}

// Rezervasyon detay modalındaki sil butonu
deleteReservationModalBtn.addEventListener('click', () => {
    if (currentReservationId && currentReservationForDetail && currentCarForDetail) {
        const res = currentReservationForDetail;
        const car = currentCarForDetail;
        confirmDeleteReservation(res.id, `${car.brand} ${car.model} (${formatDate(new Date(res.date))} ${res.startTime}-${res.endTime})`);
    }
});

// Rezervasyon filtrelerini uygula
reservationFilterBtn.addEventListener('click', () => {
    loadReservations();
});

// Profil butonuna tıklama olayı
profileBtn.addEventListener('click', () => {
    openProfileModal();
});

// Profil modalını aç
function openProfileModal() {
    // Kullanıcı bilgilerini doldur
    profileName.textContent = window.currentUser.displayName || 'İsimsiz Kullanıcı';
    profileEmail.textContent = window.currentUser.email;
    
    // Kullanıcı rolünü al
    db.ref(`users/${window.currentUser.uid}`).once('value')
        .then(snapshot => {
            const userData = snapshot.val() || {};
            const role = userData.role || 'employee';
            
            profileRole.textContent = role === 'admin' ? 'Yönetici' : 'Çalışan';
            profileRole.className = role === 'admin' ? 'profile-role admin-role' : 'profile-role employee-role';
            
            // Form alanlarını doldur
            profileEditName.value = window.currentUser.displayName || '';
        })
        .catch(error => {
            console.error("Kullanıcı bilgileri alınırken hata:", error);
        });
    
    // Kullanıcının rezervasyonlarını yükle
    loadUserReservations();
    
    // İlk sekmeyi aktif yap
    activateProfileTab('user-info');
    
    // Modalı göster
    profileModal.classList.remove('hidden');
}

// Profil sekmelerini aktifleştir
profileTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        activateProfileTab(tabId);
    });
});

// Profil sekmesini aktifleştirme
function activateProfileTab(tabId) {
    // Tüm sekmeleri pasif yap
    profileTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Tüm içerikleri gizle
    document.querySelectorAll('.profile-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // İlgili sekmeyi ve içeriği aktif yap
    document.querySelector(`.profile-tab[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(`${tabId}-content`).classList.add('active');
}

// Kullanıcının rezervasyonlarını yükle
function loadUserReservations() {
    userReservationsList.innerHTML = '<div class="loading">Rezervasyonlar yükleniyor...</div>';
    
    db.ref('reservations')
        .orderByChild('userId')
        .equalTo(window.currentUser.uid)
        .once('value')
        .then(snapshot => {
            if (!snapshot.exists()) {
                userReservationsList.innerHTML = '<div class="no-reservations">Henüz rezervasyonunuz bulunmuyor.</div>';
                return;
            }
            
            userReservationsList.innerHTML = '';
            
            // Rezervasyonları tarih sırasına göre sırala
            const reservations = [];
            
            snapshot.forEach(childSnapshot => {
                const reservation = {
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                };
                reservations.push(reservation);
            });
            
            // En yakın tarihli rezervasyonlar önce
            reservations.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            // Her rezervasyon için araç bilgilerini al ve kartı oluştur
            reservations.forEach(reservation => {
                db.ref(`cars/${reservation.carId}`).once('value')
                    .then(carSnapshot => {
                        const car = carSnapshot.val() || { brand: 'Bilinmeyen', model: 'Araç', plate: '' };
                        renderUserReservationCard(reservation, car);
                    });
            });
        })
        .catch(error => {
            console.error("Rezervasyonlar yüklenirken hata oluştu:", error);
            userReservationsList.innerHTML = '<div class="error">Rezervasyonlar yüklenirken bir hata oluştu.</div>';
        });
}

// Kullanıcının rezervasyon kartını oluştur
function renderUserReservationCard(reservation, car) {
    // Tarih karşılaştırması için önce ISO formatında tarih oluşturalım
    const reservationDate = new Date(`${reservation.date}T${reservation.startTime}`);
    const today = new Date();
    
    // Eğer rezervasyon geçmiş tarihte ise ve saat olarak da geçmişse
    const isPast = reservationDate < today;
    
    console.log(`Rezervasyon ${reservation.id} - Tarih: ${reservation.date}, Saat: ${reservation.startTime} - Geçmiş mi: ${isPast}`);
    
    const statusLabel = getStatusLabel(reservation.status);
    const statusClass = `status-${reservation.status}`;
    
    // Değerlendirme durumunu kontrol et
    let hasReview = false;
    let reviewContent = '';
    
    // İlk önce değerlendirme var mı diye kontrol et, asenkron olarak daha sonra güncellenecek
    if (isPast && reservation.status === 'approved') {
        db.ref(`reviews/${reservation.id}`).once('value')
            .then(snapshot => {
                if (snapshot.exists()) {
                    hasReview = true;
                    const review = snapshot.val();
                    const reviewCard = userReservationsList.querySelector(`[data-id="${reservation.id}"]`);
                    if (reviewCard) {
                        const reviewSection = reviewCard.querySelector('.review-section');
                        if (reviewSection) {
                            reviewSection.innerHTML = `
                                <div class="reservation-rating">
                                    <i class="fas fa-star"></i>
                                    <span>${review.rating}/5</span>
                                </div>
                                <p class="review-comment">${review.comment || 'Yorum yapılmadı'}</p>
                            `;
                        }
                    }
                }
            });
    }
    
    const reservationCard = document.createElement('div');
    reservationCard.className = 'reservation-card';
    reservationCard.setAttribute('data-id', reservation.id);
    
    reservationCard.innerHTML = `
        <div class="reservation-header">
            <div class="reservation-title">
                ${car.brand} ${car.model}
                <span class="car-plate">${car.plate}</span>
            </div>
            <div class="reservation-status ${statusClass}">${statusLabel}</div>
        </div>
        <div class="reservation-content">
            <div class="reservation-info">
                <ul>
                    <li><i class="fas fa-calendar"></i> Tarih: ${formatDate(new Date(reservation.date))}</li>
                    <li><i class="fas fa-clock"></i> Saat: ${reservation.startTime} - ${reservation.endTime}</li>
                    ${reservation.note ? `<li><i class="fas fa-sticky-note"></i> Not: ${reservation.note}</li>` : ''}
                </ul>
                <div class="review-section">
                    ${isPast && reservation.status === 'approved' ? 
                        (hasReview ? 
                            reviewContent : 
                            `<button class="review-btn" data-id="${reservation.id}"><i class="fas fa-star"></i> Değerlendir</button>`) : 
                        ''}
                </div>
            </div>
            <div class="reservation-actions" style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
                ${!isPast || reservation.status !== 'approved' ? 
                    `<button class="edit-reservation-btn" data-id="${reservation.id}" style="background-color: #2563eb; color: white; padding: 8px; border-radius: 4px; border: none;"><i class="fas fa-edit"></i> Düzenle</button>` : 
                    ''}
                <button class="delete-reservation-btn" data-id="${reservation.id}" style="background-color: #ef4444; color: white; padding: 8px; border-radius: 4px; border: none;"><i class="fas fa-trash"></i> Sil</button>
            </div>
        </div>
    `;
    
    userReservationsList.appendChild(reservationCard);
    
    // Düzenleme butonu için olay dinleyicisi
    const editBtn = reservationCard.querySelector('.edit-reservation-btn');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            openEditReservationModal(reservation, car);
        });
    }
    
    // Silme butonu için olay dinleyicisi
    const deleteBtn = reservationCard.querySelector('.delete-reservation-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (confirm(`${car.brand} ${car.model} (${formatDate(new Date(reservation.date))}, ${reservation.startTime}-${reservation.endTime}) rezervasyonunu silmek istediğinize emin misiniz?`)) {
                deleteReservation(reservation.id);
            }
        });
    }
    
    // Değerlendirme butonu için olay dinleyicisi
    const reviewBtn = reservationCard.querySelector('.review-btn');
    if (reviewBtn) {
        reviewBtn.addEventListener('click', () => {
            openReviewModal(reservation, car);
        });
    }
}

// Rezervasyon iptal etme
function cancelReservation(reservationId) {
    db.ref(`reservations/${reservationId}`).remove()
        .then(() => {
            alert('Rezervasyon başarıyla iptal edildi.');
            loadUserReservations();
        })
        .catch(error => {
            alert(`Rezervasyon iptal edilirken hata oluştu: ${error.message}`);
        });
}

// Profil bilgilerini güncelleme
profileEditForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newName = profileEditName.value.trim();
    const newPassword = profileEditPassword.value.trim();
    
    let updatePromises = [];
    
    // İsmi güncelle
    if (newName && newName !== window.currentUser.displayName) {
        updatePromises.push(
            window.currentUser.updateProfile({
                displayName: newName
            })
        );
        
        // Veritabanındaki kullanıcı adını da güncelle
        updatePromises.push(
            db.ref(`users/${window.currentUser.uid}`).update({
                name: newName
            })
        );
    }
    
    // Şifreyi güncelle
    if (newPassword) {
        updatePromises.push(
            window.currentUser.updatePassword(newPassword)
        );
    }
    
    if (updatePromises.length > 0) {
        Promise.all(updatePromises)
            .then(() => {
                alert('Profil bilgileriniz başarıyla güncellendi.');
                profileEditPassword.value = '';
                
                // Başlığı güncelle
                profileName.textContent = newName || 'İsimsiz Kullanıcı';
                
                // Giriş yapılı kullanıcı adını güncelle
                document.getElementById('userName').textContent = newName || window.currentUser.email;
            })
            .catch(error => {
                alert(`Profil güncellenirken hata oluştu: ${error.message}`);
            });
    }
});

// Yeni Fonksiyon: Belirli bir tarihteki rezervasyonları modalda göster ve yeni rezervasyon için formu hazırla
function openDailyReservationsModal(clickedDate) {
    selectedDateDisplay.textContent = formatDate(clickedDate); 
    dailyNewReservationForm.reset(); 
    dailyAvailabilityMessage.textContent = '';
    dailyAvailabilityMessage.className = 'availability-message'; 
    dailySelectCarError.textContent = '';
    dailyStartTimeError.textContent = '';
    dailyEndTimeError.textContent = '';
    dailyCarScheduleTimeline.innerHTML = ''; // Zaman çizelgesini temizle

    const dateStr = getLocalDateString(clickedDate); 
    dailyReservationDateInput.value = dateStr;
    
    // Geçmiş tarihe rezervasyon yapılamaması için minimum tarihi bugün olarak ayarla
    const today = new Date().toISOString().split('T')[0];
    dailyReservationDateInput.min = today;
    
    // Seçilen tarih bugünden önceyse bile göstermeye devam et, ancak yeni reservasyon yapmayı engelle
    const isPastDate = dateStr < today;
    if (isPastDate) {
        dailyAvailabilityMessage.textContent = 'Bu tarih geçmiş bir tarih olduğu için yeni rezervasyon yapılamaz.';
        dailyAvailabilityMessage.className = 'availability-message unavailable';
        dailyNewReservationForm.style.display = 'none'; // Formu gizle
    } else {
        dailyNewReservationForm.style.display = 'block'; // Formu göster
    }

    dailyReservationsList.innerHTML = '<div class="loading">Mevcut rezervasyonlar yükleniyor...</div>';
    dailyReservationsModal.classList.remove('hidden');

    // 1. Mevcut rezervasyonları yükle (o gün için)
    db.ref('reservations').orderByChild('date').equalTo(dateStr).once('value')
        .then(snapshot => {
            if (!snapshot.exists()) {
                dailyReservationsList.innerHTML = '<div class="no-reservations">Bu tarihte mevcut rezervasyon bulunmuyor.</div>';
            } else {
                dailyReservationsList.innerHTML = ''; // Temizle
                const reservations = [];
                snapshot.forEach(childSnapshot => {
                    const reservation = { id: childSnapshot.key, ...childSnapshot.val() };
                    // Sadece aktif rezervasyonları göster (iptal edilmemiş olanlar)
                    if (reservation.status !== 'rejected') {
                        reservations.push(reservation);
                    }
                });
                
                if (reservations.length === 0) {
                    dailyReservationsList.innerHTML = '<div class="no-reservations">Bu tarihte mevcut rezervasyon bulunmuyor.</div>';
                    return;
                }
                
                reservations.sort((a, b) => a.startTime.localeCompare(b.startTime));
                reservations.forEach(reservation => {
                    db.ref(`cars/${reservation.carId}`).once('value')
                        .then(carSnapshot => {
                            const car = carSnapshot.val() || { brand: 'Bilinmeyen', model: 'Araç', plate: '' };
                            renderDailyReservationItem(reservation, car);
                        });
                });
            }
        })
        .catch(error => {
            console.error("Günlük mevcut rezervasyonlar yüklenirken hata:", error);
            dailyReservationsList.innerHTML = '<div class="error">Mevcut rezervasyonlar yüklenirken bir hata oluştu.</div>';
        });

    // 2. Araç seçme dropdown'ını doldur
    dailySelectCar.innerHTML = '<option value="">-- Araç Seçiniz --</option>'; // Temizle ve varsayılanı ekle
    db.ref('cars').once('value')
        .then(snapshot => {
            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot => {
                    const car = { id: childSnapshot.key, ...childSnapshot.val() };
                    const option = document.createElement('option');
                    option.value = car.id;
                    option.textContent = `${car.brand} ${car.model} (${car.plate || 'Plaka Yok'})`;
                    dailySelectCar.appendChild(option);
                });
            } else {
                // Hiç araç yoksa bir mesaj gösterilebilir veya dropdown boş kalabilir
                const option = document.createElement('option');
                option.value = "";
                option.textContent = "Sistemde kayıtlı araç bulunamadı";
                option.disabled = true;
                dailySelectCar.appendChild(option);
            }
        })
        .catch(error => {
            console.error("Araçlar dropdown için yüklenirken hata:", error);
            const option = document.createElement('option');
            option.value = "";
            option.textContent = "Araçlar yüklenemedi";
            option.disabled = true;
            dailySelectCar.appendChild(option);
        });

    // Araç seçimi değiştiğinde zaman çizelgesini güncelle
    dailySelectCar.addEventListener('change', () => {
        const carId = dailySelectCar.value;
        const dateStr = dailyReservationDateInput.value; // Bu zaten YYYY-MM-DD
        if (carId && dateStr) {
            renderCarDayTimeline(carId, dateStr, dailyCarScheduleTimeline);
        }
    });

    dailyStartTimeInput.addEventListener('change', checkDailyAvailability);
    dailyEndTimeInput.addEventListener('change', checkDailyAvailability);

    // TODO: daily-new-reservation-form submit olayını handle et
    dailyNewReservationForm.addEventListener('submit', handleDailyNewReservationSubmit);

    // Ayrıca müsaitlik panelini de güncelleyelim
    updateAvailabilityPanel(clickedDate);
}

// Araç müsaitlik panelini güncelle
function updateAvailabilityPanel(date) {
    const dateStr = getLocalDateString(date);
    availabilityDate.textContent = formatDate(date);
    availabilityCarList.innerHTML = '<div class="loading">Araç müsaitlikleri yükleniyor...</div>';
    
    // Takvimden bir gün seçildiğinde paneli göster
    availabilityPanel.classList.add('active');
    
    // Güncel seçili tarihi saklayalım
    availabilityPanel.setAttribute('data-selected-date', dateStr);
    
    console.log(`[updateAvailabilityPanel] Tarih: ${dateStr} için araç müsaitlikleri yükleniyor`);
    
    // Önce tüm rezervasyonları çekelim (tarih filtresine göre)
    db.ref('reservations')
        .orderByChild('date')
        .equalTo(dateStr)
        .once('value')
        .then(reservationsSnapshot => {
            // Rezervasyon verilerini saklayalım
            const reservations = [];
            if (reservationsSnapshot.exists()) {
                reservationsSnapshot.forEach(childSnapshot => {
                    const reservation = { id: childSnapshot.key, ...childSnapshot.val() };
                    // Sadece onaylanmış veya bekleyen rezervasyonları dahil et, reddedilenleri ele
                    if (reservation.status !== 'rejected') {
                        reservations.push(reservation);
                    }
                });
            }
            
            console.log(`[updateAvailabilityPanel] ${dateStr} tarihindeki rezervasyon sayısı: ${reservations.length}`);
            
            // Şimdi araçları çekip müsaitlik durumlarını belirleyelim
            return db.ref('cars').once('value')
                .then(carsSnapshot => {
                    if (!carsSnapshot.exists()) {
                        availabilityCarList.innerHTML = '<div class="no-cars">Henüz araç eklenmemiş.</div>';
                        return;
                    }
                    
                    availabilityCarList.innerHTML = '';
                    
                    const cars = [];
                    carsSnapshot.forEach(childSnapshot => {
                        // Araç ID'sinin de cars dizisine dahil edildiğinden emin ol
                        cars.push({ id: childSnapshot.key, ...childSnapshot.val() });
                    });
                    
                    console.log(`[updateAvailabilityPanel] Toplam ${cars.length} araç bulundu`);
                    
                    if (cars.length === 0) {
                        availabilityCarList.innerHTML = '<div class="no-cars">Henüz araç eklenmemiş.</div>';
                        return;
                    }
                    
                    // Her araç için günlük rezervasyon durumunu kontrol et
                    cars.forEach(car => {
                        console.log(`[updateAvailabilityPanel] Araç işleniyor: ${car.id} - ${car.brand} ${car.model}`);
                        
                        // Bu araç için rezervasyon var mı?
                        const carReservations = reservations.filter(r => r.carId === car.id);
                        
                        // Araç için geçerli rezervasyon olup olmadığını kontrol et
                        const now = new Date();
                        const currentTimeStr = now.getHours().toString().padStart(2, '0') + ":" + 
                                             now.getMinutes().toString().padStart(2, '0');
                        const currentDateStr = getLocalDateString(now);
                        
                        let isBooked = false;
                        
                        carReservations.forEach(reservation => {
                            // Geçerli bir rezervasyon mu? (aynı gün içinde geçmiş bir rezervasyon değilse)
                            if (!(dateStr === currentDateStr && reservation.endTime <= currentTimeStr)) {
                                isBooked = true;
                                console.log(`[updateAvailabilityPanel] Araç ${car.id} için rezervasyon bulundu: ${reservation.id}`);
                            }
                        });
                        
                        console.log(`[updateAvailabilityPanel] Araç ${car.id} - Müsait mi: ${!isBooked}`);
                        
                        // Müsaitlik durumuna göre öğeyi render et
                        renderAvailabilityCarItem(car, !isBooked);
                    });
                });
        })
        .catch(error => {
            console.error("Araç müsaitlikleri yüklenirken hata oluştu:", error);
            availabilityCarList.innerHTML = '<div class="error">Araç müsaitlikleri yüklenirken bir hata oluştu.</div>';
        });
}

// Müsaitlik panelinde bir araç öğesi oluştur
function renderAvailabilityCarItem(car, isAvailable) {
    const carItem = document.createElement('div');
    carItem.className = 'availability-car-item';
    
    carItem.innerHTML = `
        <div class="availability-car-info">
            <div class="car-title">${car.brand} ${car.model}</div>
            <div class="car-plate">${car.plate}</div>
        </div>
        <div class="availability-car-status ${isAvailable ? 'available' : 'unavailable'}">
            ${isAvailable ? 'Müsait' : 'Rezerve'}
        </div>
        ${isAvailable ? '<button class="small-reserve-btn" title="Rezervasyon Yap"><i class="fas fa-calendar-plus"></i></button>' : ''}
    `;
    
    // Rezervasyon yapma butonu için olay dinleyici ekle (müsaitse)
    if (isAvailable) {
        const reserveBtn = carItem.querySelector('.small-reserve-btn');
        if (reserveBtn) {
            // Burada onclick kullanarak hızlı bir çözüm deneyelim
            reserveBtn.onclick = function() {
                console.log("Rezervasyon butonu tıklandı, araç:", car);
                makeReservation(car);
                return false; // Event propagation'ı engelle
            };
        }
    }
    
    availabilityCarList.appendChild(carItem);
}

// Yeni fonksiyon: Rezervasyon yap
function makeReservation(car) {
    console.log("makeReservation fonksiyonu çağrıldı:", car);
    
    // Araç nesnesinin geçerli olup olmadığını kontrol et
    if (!car || !car.id) {
        console.error("Geçersiz araç nesnesi:", car);
        alert("Rezervasyon oluşturulamadı: Araç bilgisi eksik.");
        return;
    }
    
    // Müsaitlik panelinden seçilen tarihi al
    const selectedDate = availabilityPanel.getAttribute('data-selected-date');
    const today = new Date().toISOString().split('T')[0];
    
    // Araç detaylarını doldur
    carDetails.innerHTML = `
        <div class="selected-car-details">
            <h4>${car.brand} ${car.model}</h4>
            <div>Plaka: ${car.plate}</div>
            <div>Yıl: ${car.year || 'Belirtilmemiş'}</div>
            <div>Renk: ${car.color || 'Belirtilmemiş'}</div>
        </div>
    `;
    
    // Modalı hazırla
    document.querySelector('#reservationModal h3').textContent = 'Araç Rezervasyonu';
    document.querySelector('#reservation-form button[type="submit"]').textContent = 'Rezervasyon Yap';
    
    // Eğer varsa, önceki rezervasyon ID'sini kaldır
    const reservationIdInput = document.getElementById('reservationId');
    if (reservationIdInput) {
        reservationIdInput.remove();
    }
    
    // Form değerlerini ayarla
    const form = document.getElementById('reservation-form');
    form.reset();
    
    // Tarihi ayarla - seçilen tarih veya bugün 
    let dateToUse = selectedDate || today;
    // Eğer geçmiş tarihse bugünü kullan
    if (dateToUse < today) {
        dateToUse = today;
    }
    
    // Geçmiş tarihlere rezervasyon yapılamaması için minimum tarihi bugün olarak ayarla
    const reservationDateInput = document.getElementById('reservationDate');
    reservationDateInput.min = today;
    reservationDateInput.value = dateToUse;
    
    // Araç ID'sini ayarla  
    document.getElementById('carId').value = car.id;
    
    // Modalı göster
    reservationModal.classList.remove('hidden');
    
    console.log("Rezervasyon modalı açıldı: ", {
        car: car,
        selectedDate: dateToUse
    });
}

// Yeni Fonksiyon: Günlük modal için araç ve saat müsaitliğini kontrol eder
async function checkDailyAvailability() {
    const carId = dailySelectCar.value;
    const dateStr = dailyReservationDateInput.value;
    const startTime = dailyStartTimeInput.value;
    const endTime = dailyEndTimeInput.value;

    dailyAvailabilityMessage.textContent = '';
    dailyAvailabilityMessage.className = 'availability-message';
    dailySelectCarError.textContent = '';
    dailyStartTimeError.textContent = '';
    dailyEndTimeError.textContent = '';

    if (!carId) {
        // dailySelectCarError.textContent = 'Lütfen bir araç seçin.'; // Ya da mesajı boş bırak
        return;
    }
    if (!startTime || !endTime) {
        // dailyStartTimeError.textContent = 'Başlangıç ve bitiş saatlerini girin.';
        return;
    }
    if (startTime >= endTime) {
        dailyEndTimeError.textContent = 'Bitiş saati başlangıçtan sonra olmalıdır.';
        dailyAvailabilityMessage.textContent = 'Geçersiz saat aralığı.';
        dailyAvailabilityMessage.classList.add('unavailable');
        return;
    }

    dailyAvailabilityMessage.textContent = 'Müsaitlik kontrol ediliyor...';

    try {
        // Sadece seçilen araç ve tarih için rezervasyonları sorgula
        const reservationsSnapshot = await db.ref('reservations')
            .orderByChild('carId')
            .equalTo(carId)
            .once('value');
        
        let conflict = false;
        
        if (reservationsSnapshot.exists()) {
            reservationsSnapshot.forEach(childSnapshot => {
                const res = childSnapshot.val();
                // İptal edilmiş rezervasyonları dikkate alma
                if (res.date === dateStr && res.status !== 'rejected') {
                    if (isTimeOverlap(startTime, endTime, res.startTime, res.endTime)) {
                        conflict = true;
                    }
                }
            });
        }

        if (conflict) {
            dailyAvailabilityMessage.textContent = 'Seçilen araç bu saat aralığında rezerve edilmiş.';
            dailyAvailabilityMessage.classList.add('unavailable');
        } else {
            dailyAvailabilityMessage.textContent = 'Seçilen araç bu saat aralığında müsait.';
            dailyAvailabilityMessage.classList.add('available');
        }

    } catch (error) {
        console.error("Müsaitlik kontrolü hatası:", error);
        dailyAvailabilityMessage.textContent = 'Müsaitlik kontrol edilemedi.';
        dailyAvailabilityMessage.classList.add('unavailable');
    }
}

// Yeni Fonksiyon: Günlük modal formunun gönderilmesini yönetir
async function handleDailyNewReservationSubmit(e) {
    e.preventDefault();

    const carId = dailySelectCar.value;
    const date = dailyReservationDateInput.value;
    const startTime = dailyStartTimeInput.value;
    const endTime = dailyEndTimeInput.value;
    const note = dailyReservationNote.value;

    // Geçmiş tarih kontrolü
    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
        alert("Geçmiş tarihe rezervasyon yapılamaz. Lütfen bugün veya daha sonraki bir tarih seçin.");
        return;
    }

    // Alan doğrulamaları
    let isValid = true;
    if (!carId) {
        dailySelectCarError.textContent = 'Araç seçimi zorunludur.';
        isValid = false;
    }
    if (!startTime) {
        dailyStartTimeError.textContent = 'Başlangıç saati zorunludur.';
        isValid = false;
    }
    if (!endTime) {
        dailyEndTimeError.textContent = 'Bitiş saati zorunludur.';
        isValid = false;
    }
    if (startTime && endTime && startTime >= endTime) {
        dailyEndTimeError.textContent = 'Bitiş saati başlangıçtan sonra olmalıdır.';
        isValid = false;
    }

    if (!isValid) return;

    // Son bir müsaitlik kontrolü
    try {
        const snapshot = await db.ref('reservations').orderByChild('carId').equalTo(carId).once('value');
        let conflict = false;
        let conflictDetails = [];
        
        if (snapshot.exists()) {
            snapshot.forEach(childSnapshot => {
                const res = childSnapshot.val();
                // Sadece iptal edilmemiş rezervasyonları kontrol et
                if (res.date === date && res.status !== 'rejected' && 
                    isTimeOverlap(startTime, endTime, res.startTime, res.endTime)) {
                    conflict = true;
                    conflictDetails.push({
                        startTime: res.startTime,
                        endTime: res.endTime,
                        user: res.userName || "Bilinmeyen Kullanıcı"
                    });
                }
            });
        }

        if (conflict) {
            let conflictMessage = "Bu araç seçtiğiniz saat aralığında rezerve edilmiş:\n\n";
            conflictDetails.forEach(conflict => {
                conflictMessage += `- ${conflict.startTime} - ${conflict.endTime} (${conflict.user})\n`;
            });
            conflictMessage += "\nLütfen farklı bir zaman veya araç seçin.";
            alert(conflictMessage);
            dailyAvailabilityMessage.textContent = 'Seçilen araç bu saat aralığında rezerve edilmiş.';
            dailyAvailabilityMessage.className = 'availability-message unavailable';
            return;
        }

        // Rezervasyonu kaydet
        const newReservationData = {
            carId: carId,
            userId: auth.currentUser.uid,
            userName: auth.currentUser.displayName || auth.currentUser.email,
            userEmail: auth.currentUser.email,
            date: date,
            startTime: startTime,
            endTime: endTime,
            note: note,
            status: 'pending', // Onay bekleyen durum
            createdAt: firebase.database.ServerValue.TIMESTAMP
        };

        await db.ref('reservations').push(newReservationData);
        alert("Rezervasyon başarıyla oluşturuldu!");
        dailyReservationsModal.classList.add('hidden');
        loadCars();      // Eğer araç listesi hala varsa ve güncellenmesi gerekiyorsa
        updateStats();   // İstatistikleri güncelle
        loadDashboardUserReservations(); // Dashboard'daki kullanıcı rezervasyonlarını güncelle
        renderCalendar(); // Takvimi yenile (yeni rezervasyon işaretçisi için)

    } catch (error) {
        console.error("Rezervasyon oluşturulurken hata:", error);
        alert(`Rezervasyon oluşturulurken hata oluştu: ${error.message}`);
    }
}

// Yeni Fonksiyon: Rezervasyon Silme Onayı
function confirmDeleteReservation(reservationId, reservationDetailsText) {
    if (confirm(`${reservationDetailsText} rezervasyonunu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) {
        deleteReservation(reservationId);
    }
}

// Yeni Fonksiyon: Rezervasyon Silme
function deleteReservation(reservationId) {
    db.ref(`reservations/${reservationId}`).remove()
        .then(() => {
            alert("Rezervasyon başarıyla silindi.");
            loadReservations(); // Rezervasyon listesini yenile
            loadUserReservations(); // Kullanıcı rezervasyonlarını güncelle
            loadDashboardUserReservations(); // Dashboard'daki kullanıcı rezervasyonlarını güncelle
            updateStats(); // İstatistikleri güncelle
            
            // Eğer detay modalı açıksa ve silinen rezervasyona aitse kapat
            if (!reservationDetailModal.classList.contains('hidden') && currentReservationId === reservationId) {
                reservationDetailModal.classList.add('hidden');
            }
            
            // Eğer günlük rezervasyon modalı açıksa ve silinen rezervasyon oradaysa listeyi yenile
            if (!dailyReservationsModal.classList.contains('hidden')) {
                const dateStr = selectedDateDisplay.textContent; // Bu formatı kontrol et, formatDate ile aynı olmalı
                // openDailyReservationsModal fonksiyonunu uygun tarihle tekrar çağırabiliriz
                // Ya da daha basitçe, eğer açık olan günün tarihiyle eşleşiyorsa, modalı yeniden yükle
                // Şimdilik, kullanıcı modalı kapatıp tekrar açabilir veya sayfa yenilemesi gerekebilir.
                // Daha sofistike bir güncelleme eklenebilir.
                loadReservations(); // Bu genel bir yükleme yapar, belki spesifik günlük yükleme daha iyi olurdu
            }
            
            // Takvimi güncelle
            renderCalendar();
        })
        .catch(error => {
            alert(`Rezervasyon silinirken hata oluştu: ${error.message}`);
        });
}

// Belirli bir tarihte rezervasyon var mı kontrol et (Takvimdeki event indicator için)
function checkDateReservations(date) {
    const dateStr = getLocalDateString(date);
    console.log(`[checkDateReservations] Takvim için kontrol edilen tarih: ${dateStr}`);

    // Daha verimli sorgu: doğrudan o tarihe eşit olanları çek
    return db.ref('reservations').orderByChild('date').equalTo(dateStr).once('value')
        .then(snapshot => {
            const hasReservation = snapshot.exists(); // Eğer o tarihte en az bir kayıt varsa, exists() true döner
            if (hasReservation) {
                console.log(`[checkDateReservations] ${dateStr} tarihinde rezervasyon bulundu (takvim işaretçisi için).`);
            }
            console.log(`[checkDateReservations] ${dateStr} için sonuç (hasReservation): ${hasReservation}`);
            return hasReservation;
        })
        .catch(error => {
            console.error("[checkDateReservations] Rezervasyon kontrolü yapılırken hata oluştu:", error);
            return false;
        });
}

// Belirli bir araç için günlük zaman çizelgesini oluşturur
async function renderCarDayTimeline(carId, dateStr, timelineElement) {
    timelineElement.innerHTML = '<div class="loading">Program yükleniyor...</div>';

    try {
        const snapshot = await db.ref('reservations')
            .orderByChild('carId')
            .equalTo(carId)
            .once('value');

        const carReservationsToday = [];
        if (snapshot.exists()) {
            snapshot.forEach(childSnapshot => {
                const res = childSnapshot.val();
                // Sadece seçilen tarih için ve iptal edilmemiş rezervasyonları al
                if (res.date === dateStr && res.status !== 'rejected') {
                    carReservationsToday.push(res);
                }
            });
        }

        timelineElement.innerHTML = ''; // Temizle

        // Örnek çalışma saatleri: 08:00 - 18:00, saatlik slotlar
        for (let hour = 8; hour < 18; hour++) {
            const slotStartTime = `${hour.toString().padStart(2, '0')}:00`;
            const slotEndTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
            
            let slotStatus = 'free';
            let bookingInfo = '';

            for (const res of carReservationsToday) {
                // Basit çakışma kontrolü (slotun herhangi bir kısmı rezervasyonla çakışıyor mu?)
                // isTimeOverlap(slotBaslangic, slotBitis, rezervasyonBaslangic, rezervasyonBitis)
                if (isTimeOverlap(slotStartTime, slotEndTime, res.startTime, res.endTime)) {
                    slotStatus = 'booked';
                    bookingInfo = ` (${res.userName ? res.userName.split(' ')[0] : 'Rezerve'})`; // Sadece ilk isim veya genel bir ifade
                    break; 
                }
            }

            const slotDiv = document.createElement('div');
            slotDiv.className = 'timeline-slot';
            slotDiv.innerHTML = `
                <span class="time">${slotStartTime} - ${slotEndTime}</span>
                <span class="status ${slotStatus}">${slotStatus === 'booked' ? 'Dolu' + bookingInfo : 'Boş'}</span>
            `;
            timelineElement.appendChild(slotDiv);
        }
        if (timelineElement.children.length === 0) { // Hiç slot oluşturulmadıysa (döngü çalışmadıysa)
             timelineElement.innerHTML = '<div>Çalışma saatleri dışında veya program alınamadı.</div>';
        }

    } catch (error) {
        console.error("Araç günlük programı yüklenirken hata:", error);
        timelineElement.innerHTML = '<div class="error">Program yüklenemedi.</div>';
    }
}

// Günlük rezervasyon listesinde bir rezervasyon öğesi oluştur
function renderDailyReservationItem(reservation, car) {
    const reservationCard = document.createElement('div');
    reservationCard.className = 'reservation-card-condensed';
    
    const statusLabel = getStatusLabel(reservation.status);
    const statusClass = `status-${reservation.status}`;
    
    reservationCard.innerHTML = `
        <div class="reservation-time">
            <strong>${reservation.startTime} - ${reservation.endTime}</strong>
        </div>
        <div class="reservation-car">
            ${car.brand} ${car.model} (${car.plate || 'Plaka Yok'})
        </div>
        <div class="reservation-user">
            ${reservation.userName || 'İsimsiz Kullanıcı'}
        </div>
        <div class="reservation-status ${statusClass}">
            ${statusLabel}
        </div>
        <button class="view-detail-btn" data-id="${reservation.id}">Detay</button>
    `;
    
    dailyReservationsList.appendChild(reservationCard);
    
    // Detay butonuna tıklanınca
    const viewDetailBtn = reservationCard.querySelector('.view-detail-btn');
    viewDetailBtn.addEventListener('click', () => {
        openReservationDetail(reservation, car);
    });
}

// DOM Elementleri - Admin/Yönetim
const manageCarsBtn = document.getElementById('manageCarsBtn');
const carManagementSection = document.getElementById('car-management-section');
const carManagementList = document.getElementById('carManagementList');
const backToDashboardFromCarsBtn = document.getElementById('backToDashboardFromCarsBtn');
const addNewCarBtn = document.getElementById('addNewCarBtn');

// ... existing code ...

// Araç yönetimi butonu
if (manageCarsBtn) {
    manageCarsBtn.addEventListener('click', () => {
        openCarManagement();
    });
}

// Araç yönetimi sayfasından panele dön
if (backToDashboardFromCarsBtn) {
    backToDashboardFromCarsBtn.addEventListener('click', () => {
        carManagementSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
    });
}

// Araç yönetiminden yeni araç ekleme
if (addNewCarBtn) {
    addNewCarBtn.addEventListener('click', () => {
        openAddCarModal();
    });
}

// Araç yönetim ekranını aç
function openCarManagement() {
    dashboardSection.classList.add('hidden');
    carManagementSection.classList.remove('hidden');
    
    loadCarsForManagement();
}

// Araçları yönetim ekranı için yükle
function loadCarsForManagement() {
    carManagementList.innerHTML = '<div class="loading">Araçlar yükleniyor...</div>';
    
    db.ref('cars').once('value')
        .then(snapshot => {
            if (!snapshot.exists()) {
                carManagementList.innerHTML = '<div class="no-cars">Henüz araç eklenmemiş.</div>';
                return;
            }
            
            carManagementList.innerHTML = '';
            
            const cars = [];
            snapshot.forEach(childSnapshot => {
                cars.push({ id: childSnapshot.key, ...childSnapshot.val() });
            });
            
            // En son eklenen araçlar üstte olacak şekilde sırala
            cars.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            
            cars.forEach(car => {
                renderCarManagementItem(car);
            });
        })
        .catch(error => {
            console.error("Araçlar yüklenirken hata oluştu:", error);
            carManagementList.innerHTML = '<div class="error">Araçlar yüklenirken bir hata oluştu.</div>';
        });
}

// Araç yönetim öğesi oluştur
function renderCarManagementItem(car) {
    const carItem = document.createElement('div');
    carItem.className = 'car-management-item';
    
    // Görseli oluştur ve çalışan bir placeholder kullan
    const imageUrl = car.imageUrl || 'https://placehold.co/300x180?text=Arac+Gorseli';
    
    carItem.innerHTML = `
        <div class="car-image" style="background-image: url('${imageUrl}')"></div>
        <div class="car-info">
            <div class="car-title">${car.brand} ${car.model}</div>
            <div class="car-plate">${car.plate}</div>
            <div class="car-details">
                <div>Yıl: ${car.year || 'Belirtilmemiş'}</div>
                <div>Renk: ${car.color || 'Belirtilmemiş'}</div>
            </div>
        </div>
        <div class="car-actions">
            <button class="edit-car-btn" data-car-id="${car.id}"><i class="fas fa-edit"></i> Düzenle</button>
            <button class="delete-car-btn" data-car-id="${car.id}"><i class="fas fa-trash-alt"></i> Sil</button>
        </div>
    `;
    
    carManagementList.appendChild(carItem);
    
    // Düzenleme butonu için olay dinleyicisi
    const editBtn = carItem.querySelector('.edit-car-btn');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            // Bu araç ID'sine sahip aracı getir
            db.ref(`cars/${car.id}`).once('value')
                .then(snapshot => {
                    const carData = snapshot.val();
                    if (carData) {
                        openEditCarModal({id: car.id, ...carData});
                    } else {
                        alert("Araç bilgisi bulunamadı.");
                    }
                })
                .catch(error => {
                    alert(`Araç bilgisi yüklenirken hata oluştu: ${error.message}`);
                });
        });
    }
    
    // Silme butonu için olay dinleyicisi
    const deleteBtn = carItem.querySelector('.delete-car-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            confirmDeleteCar(car);
        });
    }
}

// Rezervasyon düzenleme modalını oluştur
function openEditReservationModal(reservation, car) {
    // Rezervasyon modalını kullan ama başlığını değiştir
    document.querySelector('#reservationModal h3').textContent = 'Rezervasyon Düzenle';
    
    // Araç detayları
    carDetails.innerHTML = `
        <div class="selected-car-details">
            <h4>${car.brand} ${car.model}</h4>
            <div>Plaka: ${car.plate}</div>
            <div>Yıl: ${car.year}</div>
            <div>Renk: ${car.color}</div>
        </div>
    `;
    
    // Geçmiş tarihlere rezervasyon yapılamaması için minimum tarihi bugün olarak ayarla
    const today = new Date().toISOString().split('T')[0];
    const reservationDateInput = document.getElementById('reservationDate');
    reservationDateInput.min = today;
    
    // Form değerlerini doldur
    document.getElementById('reservationDate').value = reservation.date;
    // Eğer rezervasyon tarihi geçmiş tarihse ve düzenleme yapılıyorsa, bugünün tarihini seç
    if (reservation.date < today) {
        document.getElementById('reservationDate').value = today;
    }
    
    document.getElementById('startTime').value = reservation.startTime;
    document.getElementById('endTime').value = reservation.endTime;
    document.getElementById('reservationNote').value = reservation.note || '';
    document.getElementById('carId').value = reservation.carId;
    
    // Rezervasyon ID'sini hidden input olarak ekle
    let reservationIdInput = document.getElementById('reservationId');
    if (!reservationIdInput) {
        reservationIdInput = document.createElement('input');
        reservationIdInput.type = 'hidden';
        reservationIdInput.id = 'reservationId';
        document.getElementById('reservation-form').appendChild(reservationIdInput);
    }
    reservationIdInput.value = reservation.id;
    
    // Submit butonunun metnini değiştir
    const submitBtn = document.querySelector('#reservation-form button[type="submit"]');
    submitBtn.textContent = 'Rezervasyonu Güncelle';
    
    // Modalı göster
    reservationModal.classList.remove('hidden');
}

// Kullanıcı giriş yaptığında ya da dashboard açıldığında çağrılacak fonksiyon
function loadDashboardUserReservations() {
    console.log("[loadDashboardUserReservations] Fonksiyon çağrıldı");
    console.log("[loadDashboardUserReservations] dashboardUserReservations:", dashboardUserReservations);
    console.log("[loadDashboardUserReservations] currentUser:", window.currentUser);
    
    if (!dashboardUserReservations) {
        console.error("[loadDashboardUserReservations] dashboardUserReservations elementi bulunamadı");
        return;
    }
    
    if (!window.currentUser) {
        console.error("[loadDashboardUserReservations] Kullanıcı oturum açmamış");
        return;
    }
    
    dashboardUserReservations.innerHTML = '<div class="loading">Rezervasyonlar yükleniyor...</div>';
    
    console.log("[loadDashboardUserReservations] Rezervasyonlar yükleniyor için Firebase sorgusu başlıyor");
    db.ref('reservations')
        .orderByChild('userId')
        .equalTo(window.currentUser.uid)
        .once('value')
        .then(snapshot => {
            console.log("[loadDashboardUserReservations] Firebase'den veri alındı:", snapshot.exists());
            
            if (!snapshot.exists()) {
                dashboardUserReservations.innerHTML = '<div class="no-reservations">Henüz rezervasyonunuz bulunmuyor.</div>';
                return;
            }
            
            dashboardUserReservations.innerHTML = '';
            
            // Rezervasyonları tarih sırasına göre sırala
            const reservations = [];
            
            snapshot.forEach(childSnapshot => {
                const reservation = {
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                };
                reservations.push(reservation);
            });
            
            console.log("[loadDashboardUserReservations] Bulunan rezervasyon sayısı:", reservations.length);
            
            // En yakın tarihli rezervasyonlar önce
            reservations.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            // Her rezervasyon için araç bilgilerini al ve kartı oluştur
            reservations.forEach(reservation => {
                console.log(`[loadDashboardUserReservations] Rezervasyon işleniyor: ${reservation.id}`);
                db.ref(`cars/${reservation.carId}`).once('value')
                    .then(carSnapshot => {
                        const car = carSnapshot.val() || { brand: 'Bilinmeyen', model: 'Araç', plate: '' };
                        console.log(`[loadDashboardUserReservations] Araç bilgisi alındı:`, car);
                        renderDashboardUserReservationCard(reservation, car);
                    })
                    .catch(error => {
                        console.error(`[loadDashboardUserReservations] Araç bilgisi alınırken hata: ${error.message}`);
                    });
            });
        })
        .catch(error => {
            console.error("[loadDashboardUserReservations] Rezervasyonlar yüklenirken hata oluştu:", error);
            dashboardUserReservations.innerHTML = '<div class="error">Rezervasyonlar yüklenirken bir hata oluştu.</div>';
        });
}

// Dashboard için kullanıcı rezervasyon kartı oluştur
function renderDashboardUserReservationCard(reservation, car) {
    const statusLabel = getStatusLabel(reservation.status);
    const statusClass = `status-${reservation.status}`;
    
    // Tarih karşılaştırması için önce ISO formatında tarih oluşturalım
    const reservationDate = new Date(`${reservation.date}T${reservation.startTime}`);
    const today = new Date();
    
    // Eğer rezervasyon geçmiş tarihte ise ve saat olarak da geçmişse
    const isPast = reservationDate < today;
    
    // Değerlendirme durumunu kontrol et
    let hasReview = false;
    let reviewContent = '';
    
    // İlk önce değerlendirme var mı diye kontrol et, asenkron olarak daha sonra güncellenecek
    if (isPast && reservation.status === 'approved') {
        db.ref(`reviews/${reservation.id}`).once('value')
            .then(snapshot => {
                if (snapshot.exists()) {
                    hasReview = true;
                    const review = snapshot.val();
                    const reviewCard = dashboardUserReservations.querySelector(`[data-id="${reservation.id}"]`);
                    if (reviewCard) {
                        const reviewSection = reviewCard.querySelector('.review-section');
                        if (reviewSection) {
                            reviewSection.innerHTML = `
                                <div class="reservation-rating">
                                    <i class="fas fa-star"></i>
                                    <span>${review.rating}/5</span>
                                </div>
                                <p class="review-comment">${review.comment || 'Yorum yapılmadı'}</p>
                            `;
                        }
                    }
                }
            });
    }
    
    const reservationCard = document.createElement('div');
    reservationCard.className = 'reservation-card';
    reservationCard.setAttribute('data-id', reservation.id);
    
    reservationCard.innerHTML = `
        <div class="reservation-header">
            <div class="reservation-title">
                ${car.brand} ${car.model}
                <span class="car-plate">${car.plate}</span>
            </div>
            <div class="reservation-status ${statusClass}">${statusLabel}</div>
        </div>
        <div class="reservation-content">
            <div class="reservation-info">
                <ul>
                    <li><i class="fas fa-calendar"></i> Tarih: ${formatDate(new Date(reservation.date))}</li>
                    <li><i class="fas fa-clock"></i> Saat: ${reservation.startTime} - ${reservation.endTime}</li>
                    ${reservation.note ? `<li><i class="fas fa-sticky-note"></i> Not: ${reservation.note}</li>` : ''}
                </ul>
                <div class="review-section">
                    ${isPast && reservation.status === 'approved' ? 
                        (hasReview ? 
                            reviewContent : 
                            `<button class="review-btn" data-id="${reservation.id}"><i class="fas fa-star"></i> Değerlendir</button>`) : 
                        ''}
                </div>
            </div>
            <div class="reservation-actions" style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
                ${!isPast || reservation.status !== 'approved' ? 
                    `<button class="edit-reservation-btn" data-id="${reservation.id}" style="background-color: #2563eb; color: white; padding: 8px; border-radius: 4px; border: none;"><i class="fas fa-edit"></i> Düzenle</button>` : 
                    ''}
                <button class="delete-reservation-btn" data-id="${reservation.id}" style="background-color: #ef4444; color: white; padding: 8px; border-radius: 4px; border: none;"><i class="fas fa-trash"></i> Sil</button>
            </div>
        </div>
    `;
    
    dashboardUserReservations.appendChild(reservationCard);
    
    // Düzenleme butonu için olay dinleyicisi
    const editBtn = reservationCard.querySelector('.edit-reservation-btn');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            openEditReservationModal(reservation, car);
        });
    }
    
    // Silme butonu için olay dinleyicisi
    const deleteBtn = reservationCard.querySelector('.delete-reservation-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (confirm(`${car.brand} ${car.model} (${formatDate(new Date(reservation.date))}, ${reservation.startTime}-${reservation.endTime}) rezervasyonunu silmek istediğinize emin misiniz?`)) {
                deleteReservation(reservation.id);
            }
        });
    }
    
    // Değerlendirme butonu için olay dinleyicisi
    const reviewBtn = reservationCard.querySelector('.review-btn');
    if (reviewBtn) {
        reviewBtn.addEventListener('click', () => {
            openReviewModal(reservation, car);
        });
    }
}

// ... existing code ...

function deleteReservation(reservationId) {
    db.ref(`reservations/${reservationId}`).remove()
        .then(() => {
            alert("Rezervasyon başarıyla silindi.");
            loadReservations(); // Rezervasyon listesini yenile
            loadUserReservations(); // Kullanıcı rezervasyonlarını güncelle
            loadDashboardUserReservations(); // Dashboard'daki kullanıcı rezervasyonlarını güncelle
            updateStats(); // İstatistikleri güncelle
            
            // Eğer detay modalı açıksa ve silinen rezervasyona aitse kapat
            if (!reservationDetailModal.classList.contains('hidden') && currentReservationId === reservationId) {
                reservationDetailModal.classList.add('hidden');
            }
            
            // Eğer günlük rezervasyon modalı açıksa ve silinen rezervasyon oradaysa listeyi yenile
            if (!dailyReservationsModal.classList.contains('hidden')) {
                const dateStr = selectedDateDisplay.textContent; // Bu formatı kontrol et, formatDate ile aynı olmalı
                // openDailyReservationsModal fonksiyonunu uygun tarihle tekrar çağırabiliriz
                // Ya da daha basitçe, eğer açık olan günün tarihiyle eşleşiyorsa, modalı yeniden yükle
                // Şimdilik, kullanıcı modalı kapatıp tekrar açabilir veya sayfa yenilemesi gerekebilir.
                // Daha sofistike bir güncelleme eklenebilir.
                loadReservations(); // Bu genel bir yükleme yapar, belki spesifik günlük yükleme daha iyi olurdu
            }
            
            // Takvimi güncelle
            renderCalendar();
        })
        .catch(error => {
            alert(`Rezervasyon silinirken hata oluştu: ${error.message}`);
        });
}




        
       

// ... rest of the code ...

// Belirli bir tarihteki araç müsaitlik durumunu kontrol et
function checkCarAvailabilityForDate(date) {
    const dateStr = getLocalDateString(date);
    console.log(`[checkCarAvailabilityForDate] ${dateStr} tarihi için müsaitlik kontrolü başladı`);
    
    // Promise.all kullanarak hem araçları hem de rezervasyonları aynı anda alalım
    return Promise.all([
        db.ref('cars').once('value'),
        db.ref('reservations').orderByChild('date').equalTo(dateStr).once('value')
    ])
    .then(([carsSnapshot, reservationsSnapshot]) => {
        // Tüm araçları diziye al
        const cars = [];
        const totalCarCount = carsSnapshot.numChildren();
        
        // Araç yoksa erken dön
        if (totalCarCount === 0) {
            console.log(`[checkCarAvailabilityForDate] Hiç araç bulunamadı`);
            return { available: false, availableCount: 0, totalCount: 0, percentage: 0 };
        }
        
        // Araçları diziye ekle
        carsSnapshot.forEach(carSnapshot => {
            cars.push({
                id: carSnapshot.key,
                ...carSnapshot.val()
            });
        });
        
        // Rezerve edilmiş araç ID'lerini bul
        const reservedCarIds = new Set();
        
        if (reservationsSnapshot.exists()) {
            // Şu anki zamanı al (bugünkü geçmiş rezervasyonları kontrol etmek için)
            const now = new Date();
            const currentTimeStr = now.getHours().toString().padStart(2, '0') + ":" + 
                                now.getMinutes().toString().padStart(2, '0');
            const currentDateStr = getLocalDateString(now);
            
            reservationsSnapshot.forEach(childSnapshot => {
                const reservation = childSnapshot.val();
                // Sadece onaylanmış veya bekleyen rezervasyonları dikkate al
                if (reservation.status !== 'rejected') {
                    // Eğer bugün ise ve bitiş saati geçmişse, bu araç artık müsait
                    if (!(dateStr === currentDateStr && reservation.endTime <= currentTimeStr)) {
                        reservedCarIds.add(reservation.carId);
                    }
                }
            });
        }
        
        // Müsait araçları bul
        const availableCars = cars.filter(car => !reservedCarIds.has(car.id));
        const availableCarCount = availableCars.length;
        const availablePercentage = Math.round((availableCarCount / totalCarCount) * 100);
        
        console.log(`[checkCarAvailabilityForDate] ${dateStr} tarihi için sonuç:`, {
            availableCarCount,
            totalCarCount,
            availablePercentage,
            availableCars: availableCars.map(c => c.id)
        });
        
        return {
            available: availableCarCount > 0,
            availableCount: availableCarCount,
            totalCount: totalCarCount,
            percentage: availablePercentage,
            availableCars: availableCars  // Müsait araçlar listesini de döndür
        };
    })
    .catch(error => {
        console.error(`[checkCarAvailabilityForDate] ${dateStr} için müsaitlik kontrolü hatası:`, error);
        return { 
            available: false, 
            availableCount: 0, 
            totalCount: 0, 
            percentage: 0 
        };
    });
}

// ... existing code ...

// DOM Elementleri - Değerlendirme
const reviewModal = document.getElementById('reviewModal');
const reviewCarDetails = document.getElementById('reviewCarDetails');
const reviewReservationId = document.getElementById('reviewReservationId');
const ratingStars = document.querySelectorAll('.rating-stars i');
const ratingValue = document.getElementById('ratingValue');
const reviewComment = document.getElementById('reviewComment');
const reviewForm = document.getElementById('review-form');

// Değerlendirme yıldızları için olay dinleyicileri
ratingStars.forEach(star => {
    star.addEventListener('click', () => {
        const rating = star.getAttribute('data-rating');
        ratingValue.value = rating;
        
        // Tüm yıldızların stilini sıfırla
        ratingStars.forEach(s => s.classList.remove('active'));
        
        // Seçilen yıldız ve öncesindeki yıldızları aktifleştir
        for (let i = 0; i < rating; i++) {
            ratingStars[i].classList.add('active');
        }
    });
});

// Değerlendirme formunu gönder
reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const reservationId = reviewReservationId.value;
    const rating = ratingValue.value;
    const comment = reviewComment.value;
    
    if (!rating || rating === '0') {
        alert('Lütfen bir derecelendirme puanı seçin (1-5 yıldız)');
        return;
    }
    
    // Değerlendirmeyi kaydet
    db.ref(`reviews/${reservationId}`).set({
        rating: parseInt(rating),
        comment: comment,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || auth.currentUser.email,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    })
    .then(() => {
        alert('Değerlendirmeniz için teşekkür ederiz!');
        reviewModal.classList.add('hidden');
        
        // Formu sıfırla
        reviewForm.reset();
        ratingStars.forEach(s => s.classList.remove('active'));
        ratingValue.value = 0;
        
        // Kullanıcı rezervasyonlarını güncelle
        loadUserReservations();
        loadDashboardUserReservations();
    })
    .catch(error => {
        alert(`Değerlendirme gönderilirken hata oluştu: ${error.message}`);
    });
});

// Değerlendirme modalını aç
function openReviewModal(reservation, car) {
    reviewCarDetails.innerHTML = `
        <div class="selected-car-details">
            <h4>${car.brand} ${car.model}</h4>
            <div>Plaka: ${car.plate}</div>
            <div>Tarih: ${formatDate(new Date(reservation.date))}</div>
            <div>Saat: ${reservation.startTime} - ${reservation.endTime}</div>
        </div>
    `;
    
    reviewReservationId.value = reservation.id;
    
    // Daha önceki değerlendirme kontrolü
    db.ref(`reviews/${reservation.id}`).once('value')
        .then(snapshot => {
            if (snapshot.exists()) {
                const review = snapshot.val();
                
                // Yıldızları ayarla
                ratingValue.value = review.rating;
                ratingStars.forEach(s => s.classList.remove('active'));
                for (let i = 0; i < review.rating; i++) {
                    ratingStars[i].classList.add('active');
                }
                
                // Yorumu göster
                reviewComment.value = review.comment || '';
            } else {
                // Yıldızları sıfırla
                ratingValue.value = 0;
                ratingStars.forEach(s => s.classList.remove('active'));
                reviewComment.value = '';
            }
        });
    
    reviewModal.classList.remove('hidden');
}

// Red sebebi modalını aç
function openRejectionReasonModal(reservationId) {
    rejectionReservationId.value = reservationId;
    rejectionReason.value = '';
    rejectionReasonModal.classList.remove('hidden');
}

// Red sebebi modalını kapat
function closeRejectionReasonModal() {
    rejectionReasonModal.classList.add('hidden');
    rejectionReasonForm.reset();
}

// Red sebebi modalı event listener'ları
rejectionReasonForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const reservationId = rejectionReservationId.value;
    const reason = rejectionReason.value.trim();
    
    if (!reason) {
        alert('Lütfen red sebebini belirtin.');
        return;
    }
    
    try {
        // Rezervasyonu reddet
        await updateReservationStatus(reservationId, 'rejected', reason);
        closeRejectionReasonModal();
    } catch (error) {
        console.error('Rezervasyon reddetme hatası:', error);
        alert('Rezervasyon reddedilirken bir hata oluştu.');
    }
});

// İptal butonu
cancelRejectionBtn.addEventListener('click', () => {
    closeRejectionReasonModal();
});

// Rezervasyon detay modalındaki red butonu
rejectReservationBtn.addEventListener('click', () => {
    if (currentReservationId) {
        openRejectionReasonModal(currentReservationId);
    }
});

// Rezervasyon detay modalındaki onay butonu
approveReservationBtn.addEventListener('click', () => {
    if (currentReservationId) {
        updateReservationStatus(currentReservationId, 'approved');
    }
});

// Modal kapatma butonları için event listener'lar
document.querySelectorAll('.close-button').forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    });
});

// Modal dışına tıklayınca kapatma
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
});