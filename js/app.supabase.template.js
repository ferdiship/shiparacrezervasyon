// Supabase App - Ana Uygulama Mantığı
// NOT: Bu dosya app.supabase.js olarak kaydedilmeli
// Orijinal app.js dosyasının tüm fonksiyonlarını Supabase'e dönüştürülmüş halidir

// ============================================
// ARAÇ YÖNETİMİ (CARS)
// ============================================

// Tüm araçları yükle
async function loadCars() {
    const carList = document.getElementById('carList');
    carList.innerHTML = '<div class="loading">Araçlar yükleniyor...</div>';
    
    try {
        const { data: cars, error } = await supabase
            .from('cars')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (!cars || cars.length === 0) {
            carList.innerHTML = '<div class="no-cars">Henüz araç eklenmemiş</div>';
            return;
        }
        
        carList.innerHTML = '';
        cars.forEach(car => {
            carList.appendChild(createCarCard(car));
        });
        
    } catch (error) {
        console.error('Araçlar yüklenemedi:', error);
        carList.innerHTML = '<div class="error">Araçlar yüklenemedi</div>';
    }
}

// Araç kartı oluştur
function createCarCard(car) {
    const card = document.createElement('div');
    card.className = 'car-card';
    card.innerHTML = `
        <div class="car-image" style="background-image: url('${car.image_url || 'https://via.placeholder.com/400x200?text=Araç'}')"></div>
        <div class="car-info">
            <div class="car-title">${car.brand} ${car.model}</div>
            <div class="car-plate">${car.plate}</div>
            <div class="car-details">
                <span>${car.year}</span>
                <span>${car.color}</span>
            </div>
            <button class="reserve-btn primary-btn" onclick="openReservationModal('${car.id}')">
                <i class="fas fa-calendar-plus"></i> Rezervasyon Yap
            </button>
        </div>
    `;
    return card;
}

// Yeni araç ekle
async function addCar(carData) {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error('Kullanıcı girişi gerekli');
        
        const { data, error } = await supabase
            .from('cars')
            .insert({
                plate: carData.plate,
                brand: carData.brand,
                model: carData.model,
                year: parseInt(carData.year),
                color: carData.color,
                image_url: carData.image_url,
                added_by: user.id
            })
            .select()
            .single();
        
        if (error) throw error;
        
        alert('Araç başarıyla eklendi!');
        loadCars();
        closeModal('addCarModal');
        
    } catch (error) {
        console.error('Araç eklenemedi:', error);
        alert('Araç eklenirken hata oluştu: ' + error.message);
    }
}

// Araç sil
async function deleteCar(carId) {
    if (!confirm('Bu aracı silmek istediğinizden emin misiniz?')) return;
    
    try {
        const { error } = await supabase
            .from('cars')
            .delete()
            .eq('id', carId);
        
        if (error) throw error;
        
        alert('Araç başarıyla silindi');
        loadCars();
        
    } catch (error) {
        console.error('Araç silinemedi:', error);
        alert('Araç silinirken hata oluştu: ' + error.message);
    }
}

// ============================================
// REZERVASYON YÖNETİMİ (RESERVATIONS)
// ============================================

// Rezervasyon yap
async function createReservation(reservationData) {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error('Kullanıcı girişi gerekli');
        
        // Kullanıcı bilgilerini al
        const { data: userData } = await supabase
            .from('users')
            .select('name')
            .eq('id', user.id)
            .single();
        
        // Rezervasyon oluştur
        const { data, error } = await supabase
            .from('reservations')
            .insert({
                car_id: reservationData.carId,
                user_id: user.id,
                user_name: userData?.name || user.email,
                user_email: user.email,
                date: reservationData.date,
                start_time: reservationData.startTime,
                end_time: reservationData.endTime,
                note: reservationData.note,
                status: 'pending'
            })
            .select(`
                *,
                cars (*)
            `)
            .single();
        
        if (error) throw error;
        
        // E-posta bildirimi gönder
        await sendReservationNotification(data, data.cars, 'new');
        
        alert('Rezervasyon başarıyla oluşturuldu!');
        loadDashboardUserReservations();
        closeModal('reservationModal');
        
    } catch (error) {
        console.error('Rezervasyon oluşturulamadı:', error);
        alert('Rezervasyon oluşturulurken hata oluştu: ' + error.message);
    }
}

// Rezervasyonları yükle
async function loadReservations(filters = {}) {
    const list = document.getElementById('reservationsList');
    list.innerHTML = '<div class="loading">Rezervasyonlar yükleniyor...</div>';
    
    try {
        let query = supabase
            .from('reservations')
            .select(`
                *,
                cars (brand, model, plate)
            `)
            .order('created_at', { ascending: false });
        
        // Filtreler
        if (filters.status && filters.status !== 'all') {
            query = query.eq('status', filters.status);
        }
        if (filters.date) {
            query = query.eq('date', filters.date);
        }
        
        const { data: reservations, error } = await query;
        
        if (error) throw error;
        
        if (!reservations || reservations.length === 0) {
            list.innerHTML = '<div class="no-cars">Rezervasyon bulunamadı</div>';
            return;
        }
        
        list.innerHTML = '';
        reservations.forEach(res => {
            list.appendChild(createReservationCard(res));
        });
        
    } catch (error) {
        console.error('Rezervasyonlar yüklenemedi:', error);
        list.innerHTML = '<div class="error">Rezervasyonlar yüklenemedi</div>';
    }
}

// Rezervasyon kartı oluştur
function createReservationCard(reservation) {
    const card = document.createElement('div');
    card.className = 'reservation-card';
    
    const statusClass = `status-${reservation.status}`;
    const statusText = {
        pending: 'Bekliyor',
        approved: 'Onaylandı',
        rejected: 'Reddedildi',
        canceled: 'İptal Edildi'
    }[reservation.status];
    
    card.innerHTML = `
        <div class="reservation-header">
            <div class="reservation-title">
                ${reservation.cars.brand} ${reservation.cars.model}
                <span class="car-plate">${reservation.cars.plate}</span>
            </div>
            <span class="reservation-status ${statusClass}">${statusText}</span>
        </div>
        <div class="reservation-content">
            <div class="reservation-info">
                <ul>
                    <li><i class="fas fa-user"></i> ${reservation.user_name}</li>
                    <li><i class="fas fa-envelope"></i> ${reservation.user_email}</li>
                    <li><i class="fas fa-calendar"></i> ${formatDate(reservation.date)}</li>
                    <li><i class="fas fa-clock"></i> ${reservation.start_time} - ${reservation.end_time}</li>
                    <li><i class="fas fa-comment"></i> ${reservation.note}</li>
                </ul>
            </div>
            <div class="reservation-actions">
                <button class="view-btn" onclick="viewReservationDetails('${reservation.id}')">
                    <i class="fas fa-eye"></i> Detay
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Rezervasyon onayla
async function approveReservation(reservationId) {
    try {
        const { data, error } = await supabase
            .from('reservations')
            .update({ status: 'approved' })
            .eq('id', reservationId)
            .select(`
                *,
                cars (*)
            `)
            .single();
        
        if (error) throw error;
        
        // E-posta bildirimi gönder
        await notifyReservationStatusChange(reservationId, 'approved');
        
        alert('Rezervasyon onaylandı!');
        loadReservations();
        closeModal('reservationDetailModal');
        
    } catch (error) {
        console.error('Rezervasyon onaylanamadı:', error);
        alert('Rezervasyon onaylanırken hata oluştu: ' + error.message);
    }
}

// Rezervasyon reddet
async function rejectReservation(reservationId, reason) {
    try {
        const { data, error } = await supabase
            .from('reservations')
            .update({ 
                status: 'rejected',
                rejection_reason: reason
            })
            .eq('id', reservationId)
            .select(`
                *,
                cars (*)
            `)
            .single();
        
        if (error) throw error;
        
        // E-posta bildirimi gönder
        await notifyReservationStatusChange(reservationId, 'rejected', reason);
        
        alert('Rezervasyon reddedildi!');
        loadReservations();
        closeModal('reservationDetailModal');
        
    } catch (error) {
        console.error('Rezervasyon reddedilemedi:', error);
        alert('Rezervasyon reddedilirken hata oluştu: ' + error.message);
    }
}

// ============================================
// İSTATİSTİKLER (STATISTICS)
// ============================================

async function updateStats() {
    try {
        // Toplam araç
        const { count: totalCars } = await supabase
            .from('cars')
            .select('*', { count: 'exact', head: true });
        
        // Bugünün tarihi
        const today = new Date().toISOString().split('T')[0];
        
        // Bugünkü rezervasyonlar
        const { count: todayReservations } = await supabase
            .from('reservations')
            .select('*', { count: 'exact', head: true })
            .eq('date', today)
            .eq('status', 'approved');
        
        // Toplam rezervasyon
        const { count: totalReservations } = await supabase
            .from('reservations')
            .select('*', { count: 'exact', head: true });
        
        // Müsait araçlar (bugün rezerve edilmemiş)
        const { data: reservedCars } = await supabase
            .from('reservations')
            .select('car_id')
            .eq('date', today)
            .eq('status', 'approved');
        
        const reservedCarIds = reservedCars?.map(r => r.car_id) || [];
        const availableCars = (totalCars || 0) - reservedCarIds.length;
        
        // DOM güncelle
        document.getElementById('total-cars').textContent = totalCars || 0;
        document.getElementById('today-reservations').textContent = todayReservations || 0;
        document.getElementById('available-cars').textContent = availableCars;
        document.getElementById('total-reservations').textContent = totalReservations || 0;
        
    } catch (error) {
        console.error('İstatistikler güncellenemedi:', error);
    }
}

// ============================================
// TAKVİM (CALENDAR)
// ============================================

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function renderCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const monthTitle = document.getElementById('calendar-month');
    
    const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
                        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    
    monthTitle.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    calendarGrid.innerHTML = '';
    
    // Haftanın günleri
    const weekdays = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    weekdays.forEach(day => {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-weekday';
        dayEl.textContent = day;
        calendarGrid.appendChild(dayEl);
    });
    
    // Ayın ilk günü
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Boş günler
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Günler
    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-date';
        dayEl.innerHTML = `<div class="date-number">${day}</div>`;
        
        const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dayEl.dataset.date = date;
        
        dayEl.addEventListener('click', () => selectDate(date));
        
        calendarGrid.appendChild(dayEl);
    }
    
    // Rezervasyonları yükle ve takvimde göster
    loadCalendarReservations();
}

async function loadCalendarReservations() {
    try {
        const firstDay = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
        const lastDay = `${currentYear}-${String(currentMonth + 2).padStart(2, '0')}-01`;
        
        const { data: reservations, error } = await supabase
            .from('reservations')
            .select('date, status')
            .gte('date', firstDay)
            .lt('date', lastDay);
        
        if (error) throw error;
        
        // Tarihlere göre rezervasyon sayısını hesapla
        const dateMap = {};
        reservations?.forEach(res => {
            if (!dateMap[res.date]) dateMap[res.date] = 0;
            if (res.status === 'approved' || res.status === 'pending') {
                dateMap[res.date]++;
            }
        });
        
        // Takvimde göster
        document.querySelectorAll('.calendar-date').forEach(dayEl => {
            const date = dayEl.dataset.date;
            if (dateMap[date]) {
                const indicator = document.createElement('span');
                indicator.className = 'event-indicator';
                dayEl.appendChild(indicator);
            }
        });
        
    } catch (error) {
        console.error('Takvim rezervasyonları yüklenemedi:', error);
    }
}

function selectDate(date) {
    // Seçili tarihi işaretle
    document.querySelectorAll('.calendar-date').forEach(el => {
        el.classList.remove('selected-date');
    });
    event.target.closest('.calendar-date').classList.add('selected-date');
    
    // Müsaitlik panelini göster
    showAvailabilityPanel(date);
}

async function showAvailabilityPanel(date) {
    const panel = document.getElementById('availabilityPanel');
    const dateDisplay = document.getElementById('availabilityDate');
    const carList = document.getElementById('availabilityCarList');
    
    panel.classList.add('active');
    dateDisplay.textContent = formatDate(date);
    carList.innerHTML = '<div class="loading">Yükleniyor...</div>';
    
    try {
        // Tüm araçları al
        const { data: cars, error: carsError } = await supabase
            .from('cars')
            .select('*');
        
        if (carsError) throw carsError;
        
        // Seçili tarihte onaylanmış rezervasyonları al
        const { data: reservations, error: resError } = await supabase
            .from('reservations')
            .select('car_id')
            .eq('date', date)
            .eq('status', 'approved');
        
        if (resError) throw resError;
        
        const reservedCarIds = reservations?.map(r => r.car_id) || [];
        
        carList.innerHTML = '';
        cars.forEach(car => {
            const isAvailable = !reservedCarIds.includes(car.id);
            
            const item = document.createElement('div');
            item.className = `availability-car-item ${isAvailable ? 'available' : 'unavailable'}`;
            item.innerHTML = `
                <div class="availability-car-info">
                    <div class="car-title">${car.brand} ${car.model}</div>
                    <div class="car-plate">${car.plate}</div>
                </div>
                <span class="availability-car-status ${isAvailable ? 'available' : 'unavailable'}">
                    ${isAvailable ? 'Müsait' : 'Dolu'}
                </span>
                ${isAvailable ? `
                    <button class="small-reserve-btn" onclick="openReservationModal('${car.id}', '${date}')">
                        <i class="fas fa-plus"></i>
                    </button>
                ` : ''}
            `;
            carList.appendChild(item);
        });
        
    } catch (error) {
        console.error('Müsaitlik yüklenemedi:', error);
        carList.innerHTML = '<div class="error">Yüklenemedi</div>';
    }
}

// ============================================
// YARDIMCI FONKSİYONLAR (HELPERS)
// ============================================

async function getCurrentUser() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user;
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function openReservationModal(carId, date = null) {
    document.getElementById('carId').value = carId;
    if (date) {
        document.getElementById('reservationDate').value = date;
    }
    openModal('reservationModal');
}

// Event Listeners
document.getElementById('prev-month')?.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
});

document.getElementById('next-month')?.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
});

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    renderCalendar();
});

// Global fonksiyonlar
window.loadCars = loadCars;
window.addCar = addCar;
window.deleteCar = deleteCar;
window.createReservation = createReservation;
window.loadReservations = loadReservations;
window.approveReservation = approveReservation;
window.rejectReservation = rejectReservation;
window.updateStats = updateStats;
window.openReservationModal = openReservationModal;
window.closeModal = closeModal;
