/**
 * CategoryFoodPopup.js
 * จัดการ Pop-up แสดงรายการอาหารประจำหมวดหมู่
 */

const CategoryFoodPopup = {
    overlayEl: null,
    onSelectFoodCallback: null,
    onAddMenuCallback: null,
    onClearCatCallback: null,

    // สร้าง Element ของ Modal ไว้ใน DOM ครั้งแรก
    init() {
        if (document.getElementById('categoryFoodModalOverlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'categoryFoodModalOverlay';
        overlay.className = 'custom-modal-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
            display: none; align-items: center; justify-content: center;
            z-index: 9998; padding: 1rem;
        `;

        overlay.innerHTML = `
            <div class="custom-modal-box relative bg-white rounded-3xl max-w-lg w-full p-4 shadow-xl max-h-[85vh] flex flex-col border-t-4 border-rose-500">
                <!-- Header ของ Pop-up -->
                <div class="flex justify-between items-center pb-3 border-b border-slate-100 shrink-0">
                    <div class="flex items-center gap-2">
                        <span id="catPopupIcon" class="text-xl">🍱</span>
                        <h3 id="catPopupTitle" class="text-base font-extrabold text-rose-600">หมวดหมู่อาหาร</h3>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <button type="button" id="catPopupClearBtn" class="bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs px-2.5 py-1 rounded-lg border border-rose-200 transition">
                            ยกเลิก
                        </button>
                        <button type="button" id="catPopupAddBtn" class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded-lg shadow-xs transition">
                            + เมนู
                        </button>
                        <button type="button" onclick="CategoryFoodPopup.close()" class="text-slate-400 hover:text-slate-600 text-2xl font-bold ml-1 leading-none">&times;</button>
                    </div>
                </div>

                <!-- เนื้อหารายการอาหาร (Grid 3 คอลัมน์) -->
                <div id="catPopupFoodGrid" class="menu-list overflow-y-auto py-3 my-1 flex-1 min-h-0" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.4rem;">
                    <!-- ปุ่มอาหารจะถูก Render ใส่ตรงนี้ -->
                </div>

                <!-- ปุ่มปิด Modal ด้านล่าง -->
                <div class="pt-2 border-t border-slate-100 shrink-0">
                    <button type="button" onclick="CategoryFoodPopup.close()" class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition">
                        ปิดหน้านี้
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        this.overlayEl = overlay;
    },

    // เรียกเปิด Pop-up
    open({ category, foods, cart, icon, onSelectFood, onAddMenu, onClearCategory }) {
        this.init();
        this.onSelectFoodCallback = onSelectFood;
        this.onAddMenuCallback = onAddMenu;
        this.onClearCatCallback = onClearCategory;

        document.getElementById('catPopupIcon').innerText = icon || '🍱';
        document.getElementById('catPopupTitle').innerText = category.name;

        // ปุ่ม + เมนู
        const addBtn = document.getElementById('catPopupAddBtn');
        addBtn.onclick = () => {
            if (this.onAddMenuCallback) this.onAddMenuCallback(category);
        };

        // ปุ่ม ยกเลิกหมวดหมู่
        const clearBtn = document.getElementById('catPopupClearBtn');
        const catFoodIds = foods.map(f => String(f.id));
        const hasItems = cart.some(item => catFoodIds.includes(String(item.food_id)));
        
        if (hasItems) {
            clearBtn.className = "bg-rose-100 text-rose-700 font-bold text-xs px-2.5 py-1 rounded-lg border border-rose-300 cursor-pointer";
        } else {
            clearBtn.className = "bg-slate-50 text-slate-500 font-bold text-xs px-2.5 py-1 rounded-lg border border-slate-200 opacity-60 cursor-not-allowed";
        }

        clearBtn.onclick = () => {
            if (hasItems && this.onClearCatCallback) {
                this.onClearCatCallback(category.id);
                this.close();
            }
        };

        // Render ปุ่มอาหาร
        const grid = document.getElementById('catPopupFoodGrid');
        grid.innerHTML = '';

        if (foods.length === 0) {
            grid.innerHTML = '<div class="col-span-3 text-center py-8 text-slate-400 font-bold text-xs">ยังไม่มีรายการอาหารในหมวดหมู่นี้</div>';
        } else {
            foods.forEach(food => {
                const btn = document.createElement('button');
                btn.className = 'menu-item-btn';
                
                const count = cart.filter(i => String(i.food_id) === String(food.id)).reduce((s, i) => s + (Number(i.qty) || 0), 0);
                
                if (count > 0) {
                    btn.classList.add('selected');
                    btn.innerHTML = `${food.name}<span class="cart-badge">${count}</span>`;
                } else {
                    btn.innerText = food.name;
                }

                btn.onclick = () => {
                    if (this.onSelectFoodCallback) {
                        this.onSelectFoodCallback(food);
                    }
                };

                grid.appendChild(btn);
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
