// PriceEditPopup.js
const PriceEditPopup = {
    open: function (options) {
        const { category, menus, onSavePrice, onAddMenu, onChangeCategory } = options;

        // ลบ Popup เดิมหากมีค้างอยู่
        const existingPopup = document.getElementById('price-edit-popup-overlay');
        if (existingPopup) existingPopup.remove();

        // เรียงลำดับเมนูตามชื่อภาษาไทย
        const sortedMenus = [...menus].sort((a, b) => {
            const nameA = (a.name || '').trim();
            const nameB = (b.name || '').trim();
            return nameA.localeCompare(nameB, 'th', { sensitivity: 'base', numeric: true });
        });

        // สร้างรายการแถวอาหาร
        let rowsHtml = '';
        if (sortedMenus.length > 0) {
            sortedMenus.forEach((m) => {
                rowsHtml += `
                    <tr class="border-b border-gray-200 bg-white">
                        <td data-food-id="${m.id}" class="btn-change-cat p-2 font-bold text-gray-800 text-left pl-2.5 text-xs cursor-pointer hover:bg-blue-50 active:bg-blue-100 transition rounded-lg" style="width: 49%;" title="แตะเพื่อย้ายกลุ่มอาหาร">
                            <span class="hover:underline flex items-center gap-1">
                                ${m.name}
                                <span class="text-[10px] text-gray-400 font-normal">✏️</span>
                            </span>
                        </td>
                        <td class="p-1 text-center" style="width: 17%;">
                            <input type="number" value="${m.price_1 || 0}" 
                                   onfocus="this.select()"
                                   data-food-id="${m.id}" data-price-col="price_1"
                                   class="input-price-change w-full max-w-[50px] border border-gray-300 rounded-lg py-1.5 px-0.5 text-center font-bold text-gray-700 outline-none focus:border-blue-500 text-xs bg-white">
                        </td>
                        <td class="p-1 text-center" style="width: 17%;">
                            <input type="number" value="${m.price_2 || 0}" 
                                   onfocus="this.select()"
                                   data-food-id="${m.id}" data-price-col="price_2"
                                   class="input-price-change w-full max-w-[50px] border border-gray-300 rounded-lg py-1.5 px-0.5 text-center font-bold text-gray-700 outline-none focus:border-blue-500 text-xs bg-white">
                        </td>
                        <td class="p-1 text-center pr-2" style="width: 17%;">
                            <input type="number" value="${m.price_3 || 0}" 
                                   onfocus="this.select()"
                                   data-food-id="${m.id}" data-price-col="price_3"
                                   class="input-price-change w-full max-w-[50px] border border-gray-300 rounded-lg py-1.5 px-0.5 text-center font-bold text-gray-700 outline-none focus:border-blue-500 text-xs bg-white">
                        </td>
                    </tr>
                `;
            });
        } else {
            rowsHtml = `
                <tr>
                    <td colspan="4" class="text-center text-gray-400 text-xs py-6">ยังไม่มีรายการอาหารในหมวดนี้</td>
                </tr>
            `;
        }

        // สร้าง Modal Element
        const overlay = document.createElement('div');
        overlay.id = 'price-edit-popup-overlay';
        overlay.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fadeIn';

        overlay.innerHTML = `
            <div class="w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-gray-100">
                <!-- ส่วนหัว Modal -->
                <div class="bg-slate-700 text-white font-bold py-3 px-4 text-xs flex items-center justify-between shrink-0">
                    <span class="truncate flex items-center gap-1.5 text-sm">📁 ${category.name}</span>
                    <div class="flex items-center gap-2 shrink-0">
                        <a href="AddMenu.html?groupId=${category.id}" 
                           class="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition shadow-xs flex items-center gap-1 no-underline">
                            ➕ เมนู
                        </a>
                        <button id="btn-close-popup" type="button" class="bg-slate-600 hover:bg-slate-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ml-1 transition">
                            ✕
                        </button>
                    </div>
                </div>

                <!-- ตารางรายการอาหาร -->
                <div class="overflow-y-auto flex-1 min-h-0 bg-gray-50" style="-webkit-overflow-scrolling: touch;">
                    <table class="w-full text-xs border-collapse table-fixed">
                        <thead>
                            <tr class="bg-blue-500 text-white font-bold sticky top-0 z-10 shadow-xs">
                                <th class="p-2.5 text-left pl-3 bg-blue-500 text-[11px]" style="width: 49%;">รายการอาหาร</th>
                                <th class="p-2.5 text-center bg-blue-500 text-[11px]" style="width: 17%;">ชาวบ้าน</th>
                                <th class="p-2.5 text-center bg-blue-500 text-[11px]" style="width: 17%;">นักท่องเที่ยว</th>
                                <th class="p-2.5 text-center bg-blue-500 text-[11px] pr-2" style="width: 17%;">สบายดี</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                        </tbody>
                    </table>
                </div>

                <!-- ปุ่มปิดด้านล่าง -->
                <div class="p-3 bg-white border-t border-gray-100 shrink-0 text-center">
                    <button id="btn-close-popup-footer" type="button" class="w-full bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs transition">
                        ปิดหน้าต่าง
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // ผูก Event ปุ่มปิด
        const closeBtn = overlay.querySelector('#btn-close-popup');
        const closeFooterBtn = overlay.querySelector('#btn-close-popup-footer');
        const closeHandler = () => overlay.remove();

        closeBtn.addEventListener('click', closeHandler);
        closeFooterBtn.addEventListener('click', closeHandler);

        // ปิดเมื่อกดพื้นหลังนอก Card
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeHandler();
        });

        // ผูก Event แก้ไขราคา
        const priceInputs = overlay.querySelectorAll('.input-price-change');
        priceInputs.forEach(input => {
            input.addEventListener('blur', (e) => {
                const foodId = e.target.getAttribute('data-food-id');
                const priceCol = e.target.getAttribute('data-price-col');
                const value = e.target.value;
                if (typeof onSavePrice === 'function') {
                    onSavePrice(foodId, priceCol, value);
                }
            });
        });

        // ผูก Event แตะชื่ออาหารเพื่อเปลี่ยนหมวดหมู่
        const catBtns = overlay.querySelectorAll('.btn-change-cat');
        catBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const foodId = btn.getAttribute('data-food-id');
                if (typeof onChangeCategory === 'function') {
                    onChangeCategory(foodId);
                }
            });
        });
    }
};
