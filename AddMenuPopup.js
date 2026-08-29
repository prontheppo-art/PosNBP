// AddMenuPopup.js

const AddMenuPopup = {
    open: function ({ category, onSave }) {
        this.category = category || { name: '' };
        this.onSave = onSave;

        const existingModal = document.getElementById('addMenuModalOverlay');
        if (existingModal) existingModal.remove();

        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'addMenuModalOverlay';
        modalOverlay.className = 'custom-modal-overlay active';

        // ปรับ HTML ให้หน้าตาเหมือนรูปที่ 2 (3 ช่องราคา + ชื่อหมวดในวงเล็บ)
        modalOverlay.innerHTML = `
            <div class="custom-modal-box relative p-5 rounded-[2rem] max-w-sm w-full bg-white shadow-2xl transition-all border-none">
                
                <!-- ส่วนหัว Header -->
                <div class="mb-4 pb-2 border-b border-slate-100">
                    <h3 class="text-base font-extrabold text-slate-800">
                        เพิ่มเมนูใหม่ ${this.category.name ? `(${this.category.name})` : ''}
                    </h3>
                    ${this.category.name ? `<p class="text-xs font-bold text-emerald-600 mt-0.5">หมวดหมู่: ${this.category.name}</p>` : ''}
                </div>

                <!-- ฟอร์มกรอกข้อมูล -->
                <form id="formAddMenu" class="space-y-3.5">
                    <!-- ช่องชื่อเมนู -->
                    <div>
                        <label class="block text-xs font-extrabold text-slate-700 mb-1">
                            ชื่อเมนูอาหาร <span class="text-rose-500">*</span>
                        </label>
                        <input type="text" id="inputMenuName" required placeholder="ระบุชื่อเมนู" 
                               class="w-full px-3.5 py-2.5 border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-emerald-500 bg-slate-50/30">
                    </div>

                    <!-- ช่องราคา 3 ระดับ (ชาวบ้าน / นักท่องเที่ยว / สบายดี) -->
                    <div class="grid grid-cols-3 gap-2 pt-1">
                        <div>
                            <label class="block text-[11px] font-extrabold text-slate-600 mb-1 text-center">
                                ชาวบ้าน (P1)
                            </label>
                            <input type="number" id="inputPrice1" value="0" min="0" onfocus="this.select()"
                                   class="w-full px-2 py-2 border border-slate-200 rounded-2xl text-center text-xs font-extrabold text-slate-700 focus:outline-none focus:border-emerald-500 bg-slate-50/30">
                        </div>
                        <div>
                            <label class="block text-[11px] font-extrabold text-slate-600 mb-1 text-center">
                                นักเที่ยว (P2)
                            </label>
                            <input type="number" id="inputPrice2" value="0" min="0" onfocus="this.select()"
                                   class="w-full px-2 py-2 border border-slate-200 rounded-2xl text-center text-xs font-extrabold text-slate-700 focus:outline-none focus:border-emerald-500 bg-slate-50/30">
                        </div>
                        <div>
                            <label class="block text-[11px] font-extrabold text-slate-600 mb-1 text-center">
                                สบายดี (P3)
                            </label>
                            <input type="number" id="inputPrice3" value="0" min="0" onfocus="this.select()"
                                   class="w-full px-2 py-2 border border-slate-200 rounded-2xl text-center text-xs font-extrabold text-slate-700 focus:outline-none focus:border-emerald-500 bg-slate-50/30">
                        </div>
                    </div>

                    <!-- ปุ่มควบคุม (ยกเลิก / บันทึกเมนู) -->
                    <div class="grid grid-cols-2 gap-2.5 pt-3">
                        <button type="button" id="btnCancelAddMenu" 
                                class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-extrabold rounded-2xl transition text-center">
                            ยกเลิก
                        </button>
                        <button type="submit" 
                                class="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold rounded-2xl transition shadow-xs text-center">
                            บันทึกเมนู
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modalOverlay);

        const closeModal = () => modalOverlay.remove();
        modalOverlay.querySelector('#btnCancelAddMenu').onclick = closeModal;

        // ดักจับการส่งข้อมูลบันทึก
        modalOverlay.querySelector('#formAddMenu').onsubmit = (e) => {
            e.preventDefault();
            const name = modalOverlay.querySelector('#inputMenuName').value.trim();
            const price1 = parseFloat(modalOverlay.querySelector('#inputPrice1').value) || 0;
            const price2 = parseFloat(modalOverlay.querySelector('#inputPrice2').value) || 0;
            const price3 = parseFloat(modalOverlay.querySelector('#inputPrice3').value) || 0;

            const newMenuData = {
                category_id: this.category.id || this.category.group_id,
                name: name,
                price_1: price1,
                price_2: price2,
                price_3: price3,
                price: price1 // ใช้ราคานี้เป็นราคาเริ่มต้นสำรอง
            };

            if (typeof this.onSave === 'function') {
                this.onSave(newMenuData);
            }

            closeModal();
        };

        // Focus ที่ช่องชื่อเมนูอัตโนมัติ
        setTimeout(() => {
            const inputName = modalOverlay.querySelector('#inputMenuName');
            if (inputName) inputName.focus();
        }, 100);
    }
};

window.AddMenuPopup = AddMenuPopup;
