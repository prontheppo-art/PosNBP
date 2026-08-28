// OrderSelectPopup.js

const OrderSelectPopup = {
    open: function ({ category, foods, cart, icon, onSelectFood, onAddMenu, onClearCategory }) {
        // ลบ Modal เดิมหากมีค้างอยู่
        const existingModal = document.getElementById('orderSelectModalOverlay');
        if (existingModal) existingModal.remove();

        // 1. คำนวณจำนวนสินค้าที่อยู่ใน Cart ของแต่ละ food_id (รวม qty)
        const itemQtyMap = {};
        if (Array.isArray(cart)) {
            cart.forEach(item => {
                const foodId = String(item.food_id);
                itemQtyMap[foodId] = (itemQtyMap[foodId] || 0) + (Number(item.qty) || 0);
            });
        }

        // 2. สร้าง Element ป๊อปอัพ
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'orderSelectModalOverlay';
        modalOverlay.className = 'custom-modal-overlay active';

        // 3. ใส่โครงสร้าง HTML & CSS สำหรับหน้าต่าง Popup
        modalOverlay.innerHTML = `
            <div class="custom-modal-box relative border-t-0 p-5 rounded-3xl max-w-sm w-full bg-white shadow-2xl transition-all">
                
                <!-- ส่วนหัว (Header) -->
                <div class="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                    <div class="flex items-center gap-2">
                        <span class="text-2xl">${icon || '🍱'}</span>
                        <h3 class="text-lg font-extrabold text-slate-800">${category.name}</h3>
                    </div>
                    
                    <div class="flex items-center gap-1.5">
                        <button type="button" id="btnClearCatCart" class="px-2.5 py-1 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition active:scale-95 border border-slate-200">
                            ยกเลิก
                        </button>
                        <button type="button" id="btnAddCatMenu" class="px-2.5 py-1 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-sm transition active:scale-95 flex items-center gap-0.5">
                            + เมนู
                        </button>
                        <button type="button" id="btnCloseCatModal" class="text-slate-400 hover:text-slate-600 text-2xl font-bold ml-1 leading-none">&times;</button>
                    </div>
                </div>

                <!-- ส่วนรายการอาหาร (Grid Foods) -->
                <div class="grid grid-cols-2 gap-2.5 max-h-[55vh] overflow-y-auto p-1 text-slate-700">
                    ${foods.length === 0 ? `
                        <div class="col-span-2 text-center py-8 text-slate-400 font-bold text-xs">
                            ยังไม่มีรายการอาหารในหมวดหมู่นี้
                        </div>
                    ` : foods.map(food => {
                        const qty = itemQtyMap[String(food.id)] || 0;
                        const hasQty = qty > 0;

                        return `
                            <button type="button" data-food-id="${food.id}" 
                                class="food-item-btn relative flex items-center justify-center p-3 rounded-xl font-bold text-sm text-center transition active:scale-95 min-h-[54px] border-2 
                                ${hasQty 
                                    ? 'bg-emerald-50/80 border-emerald-500 text-emerald-800 shadow-sm' 
                                    : 'bg-white border-sky-200 hover:border-sky-400 text-slate-700 shadow-xs'
                                }">
                                
                                <span>${food.name}</span>

                                <!-- Badge แสดงจำนวนตัวเลขมุมขวาบนเมื่อมีการสั่งสินค้า -->
                                ${hasQty ? `
                                    <span class="absolute -top-2 -right-2 bg-rose-500 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                                        ${qty}
                                    </span>
                                ` : ''}
                            </button>
                        `;
                    }).join('')}
                </div>

                <!-- ปุ่มปิดหน้านี้ ด้านล่าง -->
                <div class="mt-4 pt-2 border-t border-slate-100">
                    <button type="button" id="btnBottomCloseCatModal" class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-600 font-bold text-xs rounded-xl transition">
                        ปิดหน้านี้
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modalOverlay);

        // 4. ผูก Event Listeners ให้กับปุ่มต่างๆ
        const closeModal = () => modalOverlay.remove();

        modalOverlay.querySelector('#btnCloseCatModal').onclick = closeModal;
        modalOverlay.querySelector('#btnBottomCloseCatModal').onclick = closeModal;

        // ปุ่มยกเลิกสินค้าเฉพาะหมวดหมู่นี้
        modalOverlay.querySelector('#btnClearCatCart').onclick = () => {
            if (typeof onClearCategory === 'function') {
                onClearCategory(category.id);
            }
            closeModal();
        };

        // ปุ่มเพิ่มเมนูใหม่ในหมวดหมู่นี้
        modalOverlay.querySelector('#btnAddCatMenu').onclick = () => {
            closeModal();
            if (typeof onAddMenu === 'function') {
                onAddMenu(category);
            }
        };

        // ปุ่มเลือกรายการอาหารแต่ละรายการ
        modalOverlay.querySelectorAll('.food-item-btn').forEach(btn => {
            btn.onclick = () => {
                const foodId = btn.getAttribute('data-food-id');
                const selectedFood = foods.find(f => String(f.id) === String(foodId));
                closeModal();
                if (selectedFood && typeof onSelectFood === 'function') {
                    onSelectFood(selectedFood);
                }
            };
        });
    }
};
