(function () {
    // 1. ฉีด CSS และ HTML ของ Modal เข้าสู่ body อัตโนมัติ
    const modalStylesAndHTML = `
    <style>
        .no-zoom-touch {
            touch-action: pan-x pan-y;
        }
        .custom-scroll::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
        }
    </style>
    <!-- Pop-up Modal เลือกสถานที่ และ Zone -->
    <div id="locationModal" class="hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] no-zoom-touch" onclick="handleOutsideClick()">
        <div class="bg-white rounded-[28px] p-4 w-full max-w-[360px] max-h-[80vh] flex flex-col shadow-2xl relative border border-slate-100" onclick="event.stopPropagation()">
            
            <!-- Modal Header (แสดงเฉพาะหน้าแรก Location) -->
            <div id="modalHeaderSection" class="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                <div class="flex items-center gap-2">
                    <span id="modalHeaderIcon" class="text-xl">📍</span>
                    <h3 id="modalHeaderTitle" class="text-sm font-extrabold text-slate-800">เลือกสถานที่</h3>
                </div>
                <button type="button" onclick="closeLocationModal()" class="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 font-bold text-sm flex items-center justify-center transition active:scale-95">✕</button>
            </div>

            <!-- Modal Content (Grid Container ที่ Scroll ได้) -->
            <div id="gridContainer" class="grid gap-2 overflow-y-auto py-1 pr-1 max-h-[65vh] custom-scroll">
                <div class="col-span-2 text-center text-slate-400 py-8 text-xs font-semibold">กำลังโหลดข้อมูล...</div>
            </div>
        </div>
    </div>
    `;

    if (document.body) {
        document.body.insertAdjacentHTML('beforeend', modalStylesAndHTML);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            document.body.insertAdjacentHTML('beforeend', modalStylesAndHTML);
        });
    }
})();

// ตัวแปรเช็กสเต็ปปัจจุบัน (1: Location, 2: Zone)
window.currentModalStep = 1;

// 2. ฟังก์ชันแยกไอคอนประจำสถานที่ให้แตกต่างกัน
function getLocationEmoji(name) {
    if (!name) return '📍';
    if (name.includes('หน้าร้าน')) return '📍';
    if (name.includes('บาหลี')) return '🏨';
    if (name.includes('ชิลล์') || name.includes('เกาะ')) return '🏝️';
    if (name.includes('ลาน')) return '⛺';
    if (name.includes('น้ำ') || name.includes('คลอง') || name.includes('ริม')) return '🌊';
    if (name.includes('บ้าน') || name.includes('เรือน')) return '🏡';
    if (name.includes('เขา') || name.includes('ดอย')) return '⛰️';
    return '📌';
}

// 3. ระบบคลิกนอกกรอบ (ย้อนกลับ 1 สเต็ป หรือ ปิดหน้าต่าง)
window.handleOutsideClick = function () {
    if (window.currentModalStep === 2) {
        // ถอยหลังกลับไป 1 สเต็ป (หน้าเลือกสถานที่)
        renderLocationStep();
    } else {
        // ปิด Modal กลับหน้าหลัก
        closeLocationModal();
    }
};

window.openLocationModal = function () {
    const modal = document.getElementById('locationModal');
    if (modal) {
        modal.classList.remove('hidden');
        renderLocationStep();
    }
};

window.closeLocationModal = function () {
    const modal = document.getElementById('locationModal');
    if (modal) modal.classList.add('hidden');
    window.currentModalStep = 1;
};

// --- ขั้นตอนที่ 1: เลือกสถานที่ (Location) ---
window.renderLocationStep = function () {
    window.currentModalStep = 1;
    const container = document.getElementById('gridContainer');
    const headerSection = document.getElementById('modalHeaderSection');
    const headerTitle = document.getElementById('modalHeaderTitle');
    const headerIcon = document.getElementById('modalHeaderIcon');

    if (headerSection) headerSection.classList.remove('hidden');
    if (headerTitle) headerTitle.innerText = 'เลือกสถานที่';
    if (headerIcon) headerIcon.innerText = '📍';

    container.className = 'grid grid-cols-2 gap-3 overflow-y-auto py-1 pr-1 max-h-[65vh] custom-scroll';
    container.innerHTML = '';

    if (typeof locationsData === 'undefined' || !locationsData || locationsData.length === 0) {
        container.innerHTML = '<div class="col-span-2 text-center text-slate-400 py-8 text-xs font-semibold">ไม่พบข้อมูลสถานที่</div>';
        return;
    }

    locationsData.forEach(loc => {
        const icon = getLocationEmoji(loc.name);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'flex flex-col items-center justify-center p-3 min-h-[85px] bg-gradient-to-b from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200/80 rounded-2xl transition-all cursor-pointer shadow-sm hover:shadow active:scale-95 text-center group';
        btn.innerHTML = `
            <span class="text-2xl mb-1 transform group-hover:scale-110 transition-transform">${icon}</span>
            <span class="text-xs font-extrabold text-slate-800 leading-snug break-words w-full px-1">${loc.name}</span>
        `;
        
        btn.onclick = () => {
            // Check ถ้าชื่อเป็น "หน้าร้าน" ให้เลือกอัตโนมัติ ไม่ต้องเปิดหน้าเลือก Zone
            if (loc.name.includes('หน้าร้าน')) {
                selectedLocationObj = loc;
                saveLocationAndFinish({ name: 'หน้าร้าน' });
            } else {
                renderZoneStep(loc);
            }
        };

        container.appendChild(btn);
    });
};

// --- ขั้นตอนที่ 2: เลือกโซน (Zone) ---
window.renderZoneStep = function (loc) {
    window.currentModalStep = 2;
    selectedLocationObj = loc;
    const container = document.getElementById('gridContainer');
    const headerSection = document.getElementById('modalHeaderSection');

    // ซ่อน Header ส่วนบน เมื่อเลือกโซน
    if (headerSection) headerSection.classList.add('hidden');

    container.className = 'grid grid-cols-2 gap-2 overflow-y-auto py-1 pr-1 max-h-[70vh] custom-scroll';
    container.innerHTML = '';

    const filteredZones = (typeof zonesData !== 'undefined' && zonesData) 
        ? zonesData.filter(z => String(z.location_id) === String(loc.id)) 
        : [];

    if (filteredZones.length === 0) {
        container.innerHTML = '<div class="col-span-2 text-center text-slate-400 py-6 text-xs font-semibold">ไม่มีรายการ Zone ในสถานที่นี้</div>';
        return;
    }

    filteredZones.forEach(z => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'flex items-center justify-center min-h-[38px] py-1.5 px-2 bg-blue-50/80 hover:bg-blue-100/90 border border-blue-200/80 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 text-center';
        btn.innerHTML = `
            <span class="text-xs font-bold text-slate-800 leading-tight break-words w-full">${z.name}</span>
        `;
        btn.onclick = () => saveLocationAndFinish(z);
        container.appendChild(btn);
    });
};

// --- ขั้นตอนที่ 3: บันทึกค่าลง LocalStorage ---
window.saveLocationAndFinish = function (zone) {
    const locName = selectedLocationObj ? selectedLocationObj.name : '';
    const zoneName = zone ? zone.name : '';

    localStorage.setItem('selectedLocationName', locName);
    localStorage.setItem('selectedZoneName', zoneName);
    localStorage.setItem('selectedLocation', zoneName === 'หน้าร้าน' ? locName : `${locName} - ${zoneName}`);

    if (typeof updateLocationButtonText === 'function') {
        updateLocationButtonText();
    }
    closeLocationModal();
};
