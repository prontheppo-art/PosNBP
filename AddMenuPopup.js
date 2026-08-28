/**
 * AddMenuPopup.js
 * จัดการ Pop-up สำหรับเพิ่มรายการอาหารใหม่ประจำหมวดหมู่
 */

const AddMenuPopup = {
    overlayEl: null,
    onSuccessCallback: null,
    categoryId: null,

    init() {
        if (document.getElementById('addMenuModalOverlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'addMenuModalOverlay';
        overlay.className = 'custom-modal-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
            display: none; align-items: center; justify-content: center;
            z-index: 99999; padding: 1rem;
        `;

        overlay.innerHTML = `
            <div class="custom-modal-box relative bg-white rounded-3xl max-w-xs w-full p-5 shadow-2xl border-t-4 border-emerald-500 transition-all duration-200">
                
                <!-- หัวข้อ Pop-up -->
                <h3 id="addMenuCategoryTitle" class="text-base font-extrabold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-1.5">
                    📌 เพิ่มเมนูใหม่
                </h3>

                <!-- ฟอร์มกรอกข้อมูล -->
                <form id="addMenuPopupForm" onsubmit="AddMenuPopup.handleSubmit(event)" class="space-y-3.5">
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1.5">ชื่อเมนูอาหาร *</label>
                        <input type="text" id="addMenuPopupName" required placeholder="ระบุชื่อเมนู" 
                               class="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500 font-bold text-slate-800 transition">
                    </div>

                    <!-- ช่องกรอกราคา 3 กลุ่ม -->
                    <div class="grid grid-cols-3 gap-2">
                        <div>
                            <label class="block text-[11px] font-bold text-slate-600 mb-1 text-center truncate">ชาวบ้าน (P1)</label>
                            <input type="number" id="addMenuPopupPrice1" placeholder="0" 
                                   onfocus="this.select()"
                                   class="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-center font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500">
                        </div>
                        <div>
                            <label class="block text-[11px] font-bold text-slate-600 mb-1 text-center truncate">นักเที่ยว (P2)</label>
                            <input type="number" id="addMenuPopupPrice2" placeholder="0" 
                                   onfocus="this.select()"
                                   class="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-center font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500">
                        </div>
                        <div>
                            <label class="block text-[11px] font-bold text-slate-600 mb-1 text-center truncate">สบายดี (P3)</label>
                            <input type="number" id="addMenuPopupPrice3" placeholder="0" 
                                   onfocus="this.select()"
                                   class="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-center font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500">
                        </div>
                    </div>

                    <!-- ปุ่มกด ยกเลิก / บันทึก -->
                    <div class="grid grid-cols-2 gap-2 pt-2">
                        <button type="button" onclick="AddMenuPopup.close()" 
                                class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition cursor-pointer">
                            ยกเลิก
                        </button>
                        <button type="submit" id="addMenuSubmitBtn"
                                class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer">
                            บันทึกเมนู
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(overlay);
        this.overlayEl = overlay;
    },

    /**
     * เปิดใช้งาน Pop-up
     * @param {Object} category - ออบเจกต์หมวดหมู่ { id, name }
     * @param {Function} onSuccess - Callback function เมื่อบันทึกสำเร็จ (ส่งค่า newMenu กลับไป)
     */
    open({ category, onSuccess }) {
        this.init();
        this.categoryId = category.id || category;
        this.onSuccessCallback = onSuccess;

        const catName = category.name ? ` (${category.name})` : '';
        document.getElementById('addMenuCategoryTitle').innerText = `เพิ่มเมนูใหม่${catName}`;
        
        // ล้างค่าข้อมูลในฟอร์ม
        document.getElementById('addMenuPopupForm').reset();

        this.overlayEl.style.display = 'flex';
        setTimeout(() => {
            document.getElementById('addMenuPopupName')?.focus();
        }, 100);
    },

    close() {
        if (this.overlayEl) {
            this.overlayEl.style.display = 'none';
        }
    },

    async handleSubmit(e) {
        e.preventDefault();

        const nameInput = document.getElementById('addMenuPopupName');
        const p1Input = document.getElementById('addMenuPopupPrice1');
        const p2Input = document.getElementById('addMenuPopupPrice2');
        const p3Input = document.getElementById('addMenuPopupPrice3');
        const submitBtn = document.getElementById('addMenuSubmitBtn');

        const name = nameInput.value.trim();
        const price_1 = parseFloat(p1Input.value) || 0;
        const price_2 = parseFloat(p2Input.value) || 0;
        const price_3 = parseFloat(p3Input.value) || 0;

        if (!name) {
            alert('กรุณากรอกชื่อเมนูอาหาร');
            return;
        }

        // ค้นหาตัวเชื่อมต่อ Supabase
        let client = null;
        if (typeof supabaseClient !== 'undefined') client = supabaseClient;
        else if (typeof window.supabaseClient !== 'undefined') client = window.supabaseClient;
        else if (typeof window.supabase !== 'undefined' && typeof SUPABASE_URL !== 'undefined' && typeof SUPABASE_KEY !== 'undefined') {
            client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        }

        if (!client) {
            alert('❌ ไม่พบระบบเชื่อมต่อฐานข้อมูล Supabase');
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.innerText = '⏳ กำลังบันทึก...';

            const payload = {
                group_id: parseInt(this.categoryId) || this.categoryId,
                name: name,
                price_1: price_1,
                price_2: price_2,
                price_3: price_3
            };

            const { data, error } = await client
                .from('foods')
                .insert([payload])
                .select();

            if (error) throw error;

            const newFoodItem = data && data.length > 0 ? data[0] : payload;

            this.close();

            if (this.onSuccessCallback) {
                this.onSuccessCallback(newFoodItem);
            }

        } catch (err) {
            console.error('Error adding menu:', err);
            alert('❌ เกิดข้อผิดพลาดในการบันทึกเมนู: ' + err.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = 'บันทึกเมนู';
        }
    }
};
