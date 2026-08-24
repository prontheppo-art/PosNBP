// ConfirmOrder_Location.js - ระบบ Popup เลือกสถานที่ (ผูกด้วย ID แบบแม่นยำ)

document.addEventListener('DOMContentLoaded', () => {
    const modalHTML = `
    <div id="locationModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
        <div class="bg-white rounded-[32px] w-full max-w-[340px] p-5 max-h-[85vh] flex flex-col shadow-2xl border border-slate-100">
            <div class="flex justify-between items-center pb-2 mb-3">
                <div class="flex items-center gap-2">
                    <span id="modalIconHeader" class="text-lg">📍</span>
                    <h3 id="locationModalTitle" class="font-extrabold text-slate-800 text-base">เลือกสถานที่</h3>
                </div>
                <button type="button" onclick="closeLocationModal()" class="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center font-bold text-sm transition">✕</button>
            </div>
            
            <div id="locationModalContent" class="overflow-y-auto flex-1 pr-0.5"></div>

            <div id="modalFooter" class="pt-3 border-t border-slate-100 mt-2 hidden">
                <button type="button" onclick="renderMainLocations()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold active:scale-95 transition flex items-center gap-1">
                    <span>⬅️</span> <span>ย้อนกลับ</span>
                </button>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
});

// ข้อมูลสำรอง (Fallback Data) กรณีโหลด Supabase ไม่สำเร็จ
const fallbackLocations = [
    { id: '1', name: 'บาหลี', icon: '🏨' },
    { id: '2', name: 'บ้านเขาบ้านเรา', icon: '🏡' },
    { id: '3', name: 'เฮ้ย ! ชิลล์มั้ย', icon: '🏝️' },
    { id: '4', name: 'หน้าร้าน', icon: '📍' }
];

const fallbackRooms = [
    'หลังที่ 1', 'หลังที่ 2', 'หลังที่ 3', 'หลังที่ 4',
    'หลังที่ 5', 'หลังที่ 6', 'หลังที่ 7', 'หลังที่ 8',
    'หลังที่ 9', 'ริมคลองหลังแรก', 'ริมคลองหลังกลาง', 'ริมคลองหลังใน',
    'หลังร้านค้า', 'หลังเขียวติดถนน', 'หลังเขียวในสุด', 'หลังขาวตรงกลาง'
];

let dbLocations = [];
let dbZones = [];

// ฟังก์ชันดึงข้อมูลจาก Supabase
async function fetchLocationsAndZones() {
    try {
        if (typeof supabaseClient !== 'undefined') {
            const [locRes, zoneRes] = await Promise.all([
                supabaseClient.from('locations').select('*'),
                supabaseClient.from('zones').select('*')
            ]);
            if (locRes.data && locRes.data.length > 0) dbLocations = locRes.data;
            if (zoneRes.data && zoneRes.data.length > 0) dbZones = zoneRes.data;
        }
    } catch (err) {
        console.log('Supabase read fallback active');
    }
}

// เปิด-ปิด Modal
function openLocationModal() {
    const modal = document.getElementById('locationModal');
    if (modal) modal.classList.remove('hidden');
    renderMainLocations();
}

function closeLocationModal() {
    const modal = document.getElementById('locationModal');
    if (modal) modal.classList.add('hidden');
}

// Render เลือกสถานที่หลัก
function renderMainLocations() {
    document.getElementById('locationModalTitle').textContent = 'เลือกสถานที่';
    document.getElementById('modalFooter').classList.add('hidden');

    const container = document.getElementById('locationModalContent');
    container.className = 'grid grid-cols-2 gap-3 py-1';
    container.innerHTML = '';

    const list = dbLocations.length > 0 ? dbLocations : fallbackLocations;

    list.forEach(loc => {
        const locId = loc.id;
        const locName = loc.name || loc.location_name || '';
        const icon = loc.icon || (locName.includes('หน้าร้าน') ? '📍' : locName.includes('ชิลล์') ? '🏝️' : locName.includes('บ้าน') ? '🏡' : '🏨');

        const card = document.createElement('div');
        card.className = 'location-card';
        card.innerHTML = `
            <span class="text-3xl mb-1">${icon}</span>
            <span class="font-bold text-slate-800 text-xs text-center truncate w-full">${locName}</span>
        `;

        card.onclick = function() {
            if (locName === 'หน้าร้าน') {
                finishSelection('หน้าร้าน');
            } else {
                renderSubRooms(locId, locName);
            }
        };

        container.appendChild(card);
    });
}

// Render เลือกโซน/ห้อง (กรองด้วย ID ของสถานที่)
function renderSubRooms(locationId, locationName) {
    document.getElementById('locationModalTitle').textContent = locationName;
    document.getElementById('modalFooter').classList.remove('hidden');

    const container = document.getElementById('locationModalContent');
    container.className = 'grid grid-cols-2 gap-2 py-1';
    container.innerHTML = '';

    // กรองโซนด้วย location_id (เปรียบเทียบทั้งแบบ String และ Number)
    let matched = dbZones.filter(z => String(z.location_id) === String(locationId));
    
    // ถ้าไม่เจอตาม ID ลองค้นด้วยชื่อเดิมเพื่อกันพลาด หรือใช้ Fallback
    if (matched.length === 0) {
        matched = dbZones.filter(z => z.location_name === locationName);
    }

    let roomList = matched.length > 0 ? matched.map(m => m.name || m.zone_name || m.room_name) : fallbackRooms;

    roomList.forEach(roomName => {
        const btn = document.createElement('div');
        btn.className = 'room-card';
        btn.textContent = roomName;
        
        btn.onclick = function() {
            finishSelection(`${locationName} - ${roomName}`);
        };

        container.appendChild(btn);
    });
}

// ยืนยันการเลือกสถานที่ บันทึกและรีเฟรชหน้า Cart
function finishSelection(finalLocationName) {
    localStorage.setItem('selectedLocation', finalLocationName);
    if (typeof updateLocationButtonText === 'function') updateLocationButtonText();
    if (typeof renderCartList === 'function') renderCartList();
    closeLocationModal();
}
    