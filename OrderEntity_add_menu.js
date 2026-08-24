(function () {
    // 1. ฉีด CSS และ HTML ของ Modal เข้าสู่หน้าเว็บอัตโนมัติ
    const modalStylesAndHTML = `
    <style>
        .no-zoom-touch {
            touch-action: pan-x pan-y;
        }
        .add-menu-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(4px);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            padding: 1rem;
        }
        .add-menu-overlay.active {
            display: flex;
        }
        .add-menu-box {
            background: #ffffff;
            border-radius: 1.5rem;
            max-width: 22rem;
            width: 100%;
            padding: 1.25rem;
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
            border-top: 4px solid #10b981;
            animation: modalPop 0.2s ease-out forwards;
        }
        .custom-alert-box {
            background: #ffffff;
            border-radius: 1.25rem;
            max-width: 18rem;
            width: 100%;
            padding: 1.25rem;
            text-align: center;
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.15);
            animation: modalPop 0.15s ease-out forwards;
        }
        @keyframes modalPop {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
    </style>

    <!-- Modal เพิ่มเมนูอาหาร -->
    <div id="addMenuModalOverlay" class="add-menu-overlay no-zoom-touch" onclick="closeAddMenuModalOnOverlay(event)">
        <div class="add-menu-box" onclick="event.stopPropagation()">
            <div class="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
                <h3 class="text-base font-extrabold text-slate-800 flex items-center gap-1.5">
                    <span>➕</span> เพิ่มเมนูอาหารใหม่
                </h3>
                <button type="button" onclick="closeAddMenuModal()" class="text-slate-400 hover:text-slate-600 text-xl font-bold p-1">✕</button>
            </div>

            <form id="addMenuForm" onsubmit="submitNewMenu(event)" class="space-y-3">
                <input type="hidden" id="addMenuCatId">
                
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">หมวดหมู่:</label>
                        <input type="text" id="addMenuCatName" readonly class="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none">
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">ชื่อเมนูอาหาร <span class="text-rose-500">*</span></label>
                        <input type="text" id="addMenuFoodName" placeholder="เช่น กะเพราไก่, ต้มยำกุ้ง..." class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition">
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">ราคา (บาท):</label>
                    <div class="grid grid-cols-3 gap-1.5">
                        <div>
                            <span class="text-[10px] text-slate-500 block font-bold mb-0.5">ชาวบ้าน</span>
                            <input type="number" id="addMenuPrice1" placeholder="0" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center focus:outline-none focus:border-emerald-500">
                        </div>
                        <div>
                            <span class="text-[10px] text-slate-500 block font-bold mb-0.5">นักท่องเที่ยว</span>
                            <input type="number" id="addMenuPrice2" placeholder="0" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center focus:outline-none focus:border-emerald-500">
                        </div>
                        <div>
                            <span class="text-[10px] text-slate-500 block font-bold mb-0.5">สบายดี</span>
                            <input type="number" id="addMenuPrice3" placeholder="0" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center focus:outline-none focus:border-emerald-500">
                        </div>
                    </div>
                </div>

                <div class="pt-2">
                    <button type="submit" id="btnSubmitAddMenu" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded-xl text-xs shadow-md active:scale-95 transition">
                        ✓ บันทึกเมนูอาหาร
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Custom Alert Popup -->
    <div id="customAlertOverlay" class="add-menu-overlay no-zoom-touch" style="z-index: 100000;" onclick="closeCustomAlert()">
        <div class="custom-alert-box" onclick="event.stopPropagation()">
            <div class="w-12 h-12 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-2 text-xl font-bold">
                ⚠️
            </div>
            <h4 class="text-sm font-extrabold text-slate-800 mb-1">แจ้งเตือน</h4>
            <p id="customAlertMessage" class="text-xs text-slate-600 font-medium mb-4">กรุณากรอกชื่อเมนูอาหาร</p>
            <button type="button" onclick="closeCustomAlert()" class="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 rounded-xl text-xs active:scale-95 transition">
                ตกลง
            </button>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalStylesAndHTML);
})();

// 2. ฟังก์ชันสำหรับเปิด Modal
window.openAddMenuModal = function (catId, catName) {
    document.getElementById('addMenuCatId').value = catId || '';
    document.getElementById('addMenuCatName').value = catName || 'ทั่วไป';
    document.getElementById('addMenuFoodName').value = '';
    document.getElementById('addMenuPrice1').value = '';
    document.getElementById('addMenuPrice2').value = '';
    document.getElementById('addMenuPrice3').value = '';

    document.getElementById('addMenuModalOverlay').classList.add('active');
    setTimeout(() => document.getElementById('addMenuFoodName').focus(), 100);
};

// 3. ฟังก์ชันสำหรับปิด Modal
window.closeAddMenuModal = function () {
    document.getElementById('addMenuModalOverlay').classList.remove('active');
};

window.closeAddMenuModalOnOverlay = function (event) {
    if (event.target.id === 'addMenuModalOverlay') {
        closeAddMenuModal();
    }
};

// 4. ฟังก์ชันแสดง Custom Alert Pop-up
window.showCustomAlert = function (msg) {
    document.getElementById('customAlertMessage').innerText = msg;
    document.getElementById('customAlertOverlay').classList.add('active');
};

window.closeCustomAlert = function () {
    document.getElementById('customAlertOverlay').classList.remove('active');
};

// 5. ฟังก์ชันบันทึกข้อมูลเข้า Supabase
window.submitNewMenu = async function (event) {
    event.preventDefault();

    const catId = document.getElementById('addMenuCatId').value;
    const foodName = document.getElementById('addMenuFoodName').value.trim();
    const p1 = Number(document.getElementById('addMenuPrice1').value) || 0;
    const p2 = Number(document.getElementById('addMenuPrice2').value) || 0;
    const p3 = Number(document.getElementById('addMenuPrice3').value) || 0;

    if (!foodName) {
        showCustomAlert('กรุณากรอกชื่อเมนูอาหาร');
        return;
    }

    const btn = document.getElementById('btnSubmitAddMenu');
    btn.disabled = true;
    btn.innerText = '⏳ กำลังบันทึก...';

    try {
        if (typeof supabaseClient === 'undefined') {
            showCustomAlert('ไม่พบการเชื่อมต่อ Supabase');
            btn.disabled = false;
            btn.innerText = '✓ บันทึกเมนูอาหาร';
            return;
        }

        const { data: foodData, error: foodErr } = await supabaseClient
            .from('foods')
            .insert([{ name: foodName, group_id: catId, category_id: catId }])
            .select();

        if (foodErr) throw foodErr;

        if (foodData && foodData.length > 0) {
            const newFoodId = foodData[0].id;

            const pricePayloads = [
                { food_id: newFoodId, customer_group_id: 1, price: p1 },
                { food_id: newFoodId, customer_group_id: 2, price: p2 },
                { food_id: newFoodId, customer_group_id: 3, price: p3 }
            ];

            await supabaseClient.from('food_prices').insert(pricePayloads);
        }

        closeAddMenuModal();

        if (typeof loadData === 'function') {
            loadData();
        }

    } catch (err) {
        console.error('Error adding menu:', err);
        showCustomAlert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
        btn.disabled = false;
        btn.innerText = '✓ บันทึกเมนูอาหาร';
    }
};
