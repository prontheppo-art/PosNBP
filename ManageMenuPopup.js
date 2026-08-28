// ManageMenuPopup.js
const ManageMenuPopup = {
    db: null,
    menus: [],
    foodGroups: [],
    activeGroup: null,

    init(dbInstance) {
        this.db = dbInstance;
        this.injectModalHTML();
    },

    updateData(menusData, foodGroupsData) {
        this.menus = menusData || [];
        this.foodGroups = foodGroupsData || [];
    },

    injectModalHTML() {
        if (document.getElementById('priceCategoryModal')) return;

        const modalHTML = `
        <!-- Pop-up ตารางราคาหมวดหมู่ -->
        <div id="priceCategoryModal" class="hidden fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3">
            <div class="bg-white rounded-3xl w-full max-w-lg h-[85vh] flex flex-col overflow-hidden shadow-2xl border-2 border-slate-700">
                <div class="bg-slate-700 text-white font-bold p-3 text-sm flex items-center justify-between shrink-0">
                    <span id="modalGroupTitle" class="truncate flex items-center gap-1.5">📁 ชื่อหมวดหมู่</span>
                    <div class="flex items-center gap-2">
                        <button type="button" id="modalAddMenuBtn" onclick="ManageMenuPopup.openAddMenuModal()" 
                                class="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer">
                            ➕ เมนู
                        </button>
                        <button type="button" onclick="ManageMenuPopup.closePriceModal()" class="bg-slate-600 hover:bg-slate-500 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm cursor-pointer">
                            ✕
                        </button>
                    </div>
                </div>

                <div class="flex-1 overflow-y-auto">
                    <table class="w-full text-xs border-collapse table-fixed">
                        <thead class="sticky top-0 z-10">
                            <tr class="bg-blue-500 text-white font-bold">
                                <th class="p-2.5 text-left pl-3 text-[11px]" style="width: 46%;">รายการอาหาร</th>
                                <th class="p-2 text-center text-[11px]" style="width: 18%;">ชาวบ้าน</th>
                                <th class="p-2 text-center text-[11px]" style="width: 18%;">นักท่องเที่ยว</th>
                                <th class="p-2 text-center text-[11px] pr-3" style="width: 18%;">สบายดี</th>
                            </tr>
                        </thead>
                        <tbody id="modalTableBody"></tbody>
                    </table>
                </div>

                <div class="p-3 bg-gray-50 border-t border-gray-200 shrink-0">
                    <button type="button" onclick="ManageMenuPopup.closePriceModal()" class="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer">
                        ปิดหน้าต่าง
                    </button>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    openCategoryPriceModal(group) {
        this.activeGroup = group;
        const titleEl = document.getElementById('modalGroupTitle');
        const tbodyEl = document.getElementById('modalTableBody');

        titleEl.innerHTML = `📁 ${group.name}`;

        const filteredMenus = this.menus
            .filter(m => String(m.group_id) === String(group.id))
            .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'th', { numeric: true }));

        let rowsHtml = '';
        if (filteredMenus.length > 0) {
            filteredMenus.forEach((m, index) => {
                const borderClass = index === filteredMenus.length - 1 ? 'bg-white' : 'border-b border-gray-200 bg-white';
                rowsHtml += `
                    <tr class="${borderClass}">
                        <td onclick="ManageCategoryPopup.open('${m.id}')" 
                            class="p-2.5 font-bold text-gray-800 text-left pl-3 text-xs cursor-pointer hover:bg-blue-50 active:bg-blue-100 transition rounded-lg" style="width: 46%;">
                            <span class="flex items-center gap-1">
                                ${m.name}
                                <span class="text-[10px] text-gray-400 font-normal">✏️</span>
                            </span>
                        </td>
                        <td class="p-1 text-center" style="width: 18%;">
                            <input type="number" value="${m.price_1 || 0}" 
                                   onfocus="this.select()"
                                   onblur="ManageMenuPopup.updatePriceDirect('${m.id}', 'price_1', this.value)"
                                   class="w-full max-w-[52px] border border-gray-300 rounded-lg py-1.5 px-0.5 text-center font-bold text-gray-700 outline-none focus:border-blue-500 text-xs bg-white">
                        </td>
                        <td class="p-1 text-center" style="width: 18%;">
                            <input type="number" value="${m.price_2 || 0}" 
                                   onfocus="this.select()"
                                   onblur="ManageMenuPopup.updatePriceDirect('${m.id}', 'price_2', this.value)"
                                   class="w-full max-w-[52px] border border-gray-300 rounded-lg py-1.5 px-0.5 text-center font-bold text-gray-700 outline-none focus:border-blue-500 text-xs bg-white">
                        </td>
                        <td class="p-1 text-center pr-2" style="width: 18%;">
                            <input type="number" value="${m.price_3 || 0}" 
                                   onfocus="this.select()"
                                   onblur="ManageMenuPopup.updatePriceDirect('${m.id}', 'price_3', this.value)"
                                   class="w-full max-w-[52px] border border-gray-300 rounded-lg py-1.5 px-0.5 text-center font-bold text-gray-700 outline-none focus:border-blue-500 text-xs bg-white">
                        </td>
                    </tr>
                `;
            });
        } else {
            rowsHtml = `<tr><td colspan="4" class="text-center text-gray-400 text-xs py-10">ยังไม่มีรายการอาหารในกลุ่มนี้</td></tr>`;
        }

        tbodyEl.innerHTML = rowsHtml;
        document.getElementById('priceCategoryModal').classList.remove('hidden');
    },

    openAddMenuModal() {
        if (this.activeGroup && typeof AddMenuPopup !== 'undefined') {
            AddMenuPopup.open(this.activeGroup.id);
        } else if (!this.activeGroup) {
            alert('กรุณาเลือกกลุ่มอาหารก่อนครับ');
        } else {
            alert('ไม่พบระบบ AddMenuPopup กรุณาแนบไฟล์ AddMenuPopup.js ในหน้าเว็บ');
        }
    },

    refreshActiveModal() {
        if (this.activeGroup) {
            this.openCategoryPriceModal(this.activeGroup);
        }
    },

    closePriceModal() {
        document.getElementById('priceCategoryModal').classList.add('hidden');
        this.activeGroup = null;
    },

    async updatePriceDirect(foodId, priceColumn, newPrice) {
        const parsedPrice = newPrice === '' ? 0 : parseFloat(newPrice);
        const item = this.menus.find(m => String(m.id) === String(foodId));
        if (item) item[priceColumn] = parsedPrice;

        try {
            const updateData = {};
            updateData[priceColumn] = parsedPrice;
            const { error } = await this.db.from('foods').update(updateData).eq('id', parseInt(foodId));
            if (error) alert(`เกิดข้อผิดพลาดในการบันทึก: ${error.message}`);
        } catch (err) {
            console.error("Exception on updatePriceDirect:", err);
        }
    }
};
