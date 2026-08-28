// AddMenuPopup.js
const AddMenuPopup = {
    db: null,
    currentGroupId: null,
    onSuccessCallback: null,

    init(dbInstance, onSuccess) {
        this.db = dbInstance;
        this.onSuccessCallback = onSuccess;
        this.injectModalHTML();
    },

    injectModalHTML() {
        if (document.getElementById('addMenuModal')) return;

        const modalHTML = `
        <div id="addMenuModal" class="hidden fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-3 backdrop-blur-sm">
            <div class="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border-2 border-emerald-600 flex flex-col">
                <div class="bg-emerald-600 text-white font-bold p-3.5 text-sm flex items-center justify-between shrink-0">
                    <span class="flex items-center gap-1.5">➕ เพิ่มเมนูอาหารใหม่</span>
                    <button type="button" onclick="AddMenuPopup.close()" class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm cursor-pointer">
                        ✕
                    </button>
                </div>

                <form id="addMenuForm" onsubmit="AddMenuPopup.submitForm(event)" class="p-4 space-y-3 text-xs">
                    <div>
                        <label class="block text-slate-700 font-bold mb-1">ชื่อรายการอาหาร <span class="text-red-500">*</span></label>
                        <input type="text" id="addMenuName" required placeholder="เช่น ลาบหมู, ต้มแซ่บ"
                               class="w-full border border-slate-300 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-800 font-bold">
                    </div>

                    <div class="grid grid-cols-3 gap-2 pt-1">
                        <div>
                            <label class="block text-slate-600 font-bold mb-1 text-[11px] text-center">ราคา ชาวบ้าน</label>
                            <input type="number" id="addMenuPrice1" value="0" min="0" onfocus="this.select()"
                                   class="w-full border border-slate-300 rounded-xl p-2 text-center font-bold text-slate-700 outline-none focus:border-emerald-500">
                        </div>
                        <div>
                            <label class="block text-slate-600 font-bold mb-1 text-[11px] text-center">นักท่องเที่ยว</label>
                            <input type="number" id="addMenuPrice2" value="0" min="0" onfocus="this.select()"
                                   class="w-full border border-slate-300 rounded-xl p-2 text-center font-bold text-slate-700 outline-none focus:border-emerald-500">
                        </div>
                        <div>
                            <label class="block text-slate-600 font-bold mb-1 text-[11px] text-center">สบายดี</label>
                            <input type="number" id="addMenuPrice3" value="0" min="0" onfocus="this.select()"
                                   class="w-full border border-slate-300 rounded-xl p-2 text-center font-bold text-slate-700 outline-none focus:border-emerald-500">
                        </div>
                    </div>

                    <div class="pt-3 grid grid-cols-2 gap-2">
                        <button type="button" onclick="AddMenuPopup.close()" 
                                class="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2.5 rounded-xl transition cursor-pointer">
                            ยกเลิก
                        </button>
                        <button type="submit" id="addMenuSubmitBtn"
                                class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow transition cursor-pointer">
                            💾 บันทึกเมนู
                        </button>
                    </div>
                </form>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    open(groupId) {
        this.currentGroupId = groupId;
        document.getElementById('addMenuName').value = '';
        document.getElementById('addMenuPrice1').value = '0';
        document.getElementById('addMenuPrice2').value = '0';
        document.getElementById('addMenuPrice3').value = '0';
        
        document.getElementById('addMenuModal').classList.remove('hidden');
        setTimeout(() => document.getElementById('addMenuName').focus(), 100);
    },

    close() {
        document.getElementById('addMenuModal').classList.add('hidden');
        this.currentGroupId = null;
    },

    async submitForm(event) {
        event.preventDefault();
        const submitBtn = document.getElementById('addMenuSubmitBtn');
        const name = document.getElementById('addMenuName').value.trim();
        const price1 = parseFloat(document.getElementById('addMenuPrice1').value) || 0;
        const price2 = parseFloat(document.getElementById('addMenuPrice2').value) || 0;
        const price3 = parseFloat(document.getElementById('addMenuPrice3').value) || 0;

        if (!name) {
            alert('กรุณากรอกชื่อรายการอาหาร');
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.innerText = '⏳ กำลังบันทึก...';

            const payload = {
                name: name,
                group_id: this.currentGroupId,
                price_1: price1,
                price_2: price2,
                price_3: price3
            };

            const { error } = await this.db.from('foods').insert([payload]);

            if (error) throw error;

            this.close();
            if (typeof this.onSuccessCallback === 'function') {
                await this.onSuccessCallback();
            }
        } catch (err) {
            console.error("Error adding menu:", err);
            alert(`เกิดข้อผิดพลาด: ${err.message}`);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = '💾 บันทึกเมนู';
        }
    }
};
