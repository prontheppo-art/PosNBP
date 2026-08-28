/**
 * EditPricePopup.js
 * จัดการ Pop-up ตารางแก้ไขราคาอาหารประจำหมวดหมู่ (เวอร์ชันแก้ไขการแตะบนมือถือ)
 */

const EditPricePopup = {
    overlayEl: null,
    onPriceUpdateCallback: null,
    onChangeCatCallback: null,

    init() {
        if (document.getElementById('editPriceModalOverlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'editPriceModalOverlay';
        overlay.className = 'custom-modal-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
            display: none; align-items: center; justify-content: center;
            z-index: 9998; padding: 0.75rem;
        `;

        overlay.innerHTML = `
            <div class="custom-modal-box relative bg-white rounded-3xl max-w-lg w-full p-4 shadow-xl max-h-[85vh] flex flex-col border-t-4 border-slate-700">
                <!-- Header ของ Pop-up -->
                <div class="flex justify-between items-center pb-3 border-b border-slate-100 shrink-0">
                    <div class="flex items-center gap-2">
                        <span id="pricePopupIcon" class="text-xl">📂</span>
                        <h3 id="pricePopupTitle" class="text-base font-extrabold text-slate-800">หมวดหมู่อาหาร</h3>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <a id="pricePopupAddBtn" href="#" class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-2.5 py-1.5 rounded-xl shadow-xs transition no-underline flex items-center gap-1">
                            ➕ เมนู
                        </a>
                        <button type="button" onclick="EditPricePopup.close()" class="text-slate-400 hover:text-slate-600 text-2xl font-bold ml-1 leading-none">&times;</button>
                    </div>
                </div>

                <!-- เนื้อหา ตารางแก้ไขราคาอาหาร -->
                <div class="overflow-y-auto my-2 flex-1 min-h-0 border border-slate-200 rounded-xl" style="-webkit-overflow-scrolling: touch;">
                    <table class="w-full text-xs border-collapse table-fixed">
                        <thead>
                            <tr class="bg-blue-500 text-white font-bold sticky top-0 z-10">
                                <th class="p-2 text-left pl-2.5 bg-blue-500 text-[11px]" style="width: 49%;">รายการอาหาร</th>
                                <th class="p-2 text-center bg-blue-500 text-[11px]" style="width: 17%;">ชาวบ้าน</th>
                                <th class="p-2 text-center bg-blue-500 text-[11px]" style="width: 17%;">นักท่องเที่ยว</th>
                                <th class="p-2 text-center bg-blue-500 text-[11px] pr-2" style="width: 17%;">สบายดี</th>
                            </tr>
                        </thead>
                        <tbody id="pricePopupTableBody" class="bg-white">
                            <!-- แถวอาหารจะถูก Render ใส่ตรงนี้ -->
                        </tbody>
                    </table>
                </div>

                <!-- ปุ่มปิด Modal ด้านล่าง -->
                <div class="pt-2 border-t border-slate-100 shrink-0">
                    <button type="button" onclick="EditPricePopup.close()" class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition">
                        ปิดหน้านี้
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        this.overlayEl = overlay;
    },

    open({ category, foods, icon, onPriceUpdate, onChangeCategory }) {
        this.init();
        this.onPriceUpdateCallback = onPriceUpdate;
        this.onChangeCatCallback = onChangeCategory;

        document.getElementById('pricePopupIcon').innerText = icon || '📁';
        document.getElementById('pricePopupTitle').innerText = category.name;
        document.getElementById('pricePopupAddBtn').href = `AddMenu.html?groupId=${category.id}`;

        const tbody = document.getElementById('pricePopupTableBody');
        tbody.innerHTML = '';

        if (foods.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-slate-400 text-xs py-8 font-bold">ยังไม่มีรายการอาหารในหมวดนี้</td>
                </tr>
            `;
        } else {
            foods.forEach((m, index) => {
                const borderClass = index === foods.length - 1 ? '' : 'border-b border-gray-200';
                const tr = document.createElement('tr');
                tr.className = borderClass;

                tr.innerHTML = `
                    <td class="p-2 font-bold text-gray-800 text-left pl-2.5 text-xs cursor-pointer hover:bg-blue-50 active:bg-blue-100 transition rounded-lg select-none" style="width: 49%;" title="แตะเพื่อย้ายกลุ่มอาหาร">
                        <span class="hover:underline flex items-center gap-1 pointer-events-none">
                            ${m.name}
                            <span class="text-[10px] text-gray-400 font-normal">✏️</span>
                        </span>
                    </td>
                    <td class="p-1 text-center" style="width: 17%;">
                        <input type="number" value="${m.price_1 || 0}" 
                               class="price-input-p1 w-full max-w-[50px] border border-gray-300 rounded-lg py-1.5 px-0.5 text-center font-bold text-gray-700 outline-none focus:border-blue-500 text-xs bg-white">
                    </td>
                    <td class="p-1 text-center" style="width: 17%;">
                        <input type="number" value="${m.price_2 || 0}" 
                               class="price-input-p2 w-full max-w-[50px] border border-gray-300 rounded-lg py-1.5 px-0.5 text-center font-bold text-gray-700 outline-none focus:border-blue-500 text-xs bg-white">
                    </td>
                    <td class="p-1 text-center pr-2" style="width: 17%;">
                        <input type="number" value="${m.price_3 || 0}" 
                               class="price-input-p3 w-full max-w-[50px] border border-gray-300 rounded-lg py-1.5 px-0.5 text-center font-bold text-gray-700 outline-none focus:border-blue-500 text-xs bg-white">
                    </td>
                `;

                // แตะชื่อรายการเพื่อเปลี่ยนกลุ่ม (จัดการ Event ทั้ง Click และ Touch บนมือถือ)
                const nameTd = tr.querySelector('td');
                const triggerCatChange = (e) => {
                    if (e) {
                        e.stopPropagation();
                    }
                    if (typeof FoodGroupPopup === 'undefined') {
                        alert('❌ ไม่พบไฟล์ FoodGroupPopup.js หรือยังไม่ได้โหลดไฟล์ลงระบบ');
                        return;
                    }
                    if (this.onChangeCatCallback) {
                        this.onChangeCatCallback(m.id);
                    }
                };

                nameTd.onclick = triggerCatChange;

                // ใส่ Event onblur/onfocus ในช่องกรอกราคา
                const p1Input = tr.querySelector('.price-input-p1');
                const p2Input = tr.querySelector('.price-input-p2');
                const p3Input = tr.querySelector('.price-input-p3');
                [p1Input, p2Input, p3Input].forEach((inp, i) => {
                    const colName = `price_${i + 1}`;
                    inp.onfocus = function() { this.select(); };
                    inp.onblur = () => {
                        if (this.onPriceUpdateCallback) {
                            this.onPriceUpdateCallback(m.id, colName, inp.value);
                        }
                    };
                });

                tbody.appendChild(tr);
            });
        }

        this.overlayEl.style.display = 'flex';
    },

    close() {
        if (this.overlayEl) {
            this.overlayEl.style.display = 'none';
        }
    }
};
