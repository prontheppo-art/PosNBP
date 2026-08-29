// OrderSelect.js

const OrderSelectPopup = {
    open: function ({ category, foods, cart, icon, onSelectFood, onAddMenu, onClearCategory }) {
        this.category = category;
        this.foods = foods || [];
        this.cart = cart || [];
        this.icon = icon || '🍱';
        this.onSelectFood = onSelectFood;
        this.onAddMenu = onAddMenu;
        this.onClearCategory = onClearCategory;

        const existingModal = document.getElementById('orderSelectCategoryModalOverlay');
        if (existingModal) existingModal.remove();

        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'orderSelectCategoryModalOverlay';
        modalOverlay.className = 'custom-modal-overlay active';

        modalOverlay.innerHTML = `
            <div class="custom-modal-box relative p-4 rounded-[2rem] max-w-md w-full bg-white shadow-2xl transition-all border-none">
                
                <!-- ส่วนหัว Header -->
                <div class="flex justify-between items-center mb-3 pb-2 border-b border-slate-100 gap-1">
                    <div class="flex items-center gap-2 overflow-hidden">
                        <span class="text-xl shrink-0">${this.icon}</span>
                        <h3 class="text-sm sm:text-base font-extrabold text-slate-800 truncate">${this.category.name}</h3>
                    </div>

                    <div class="flex items-center gap-1.5 shrink-0">
                        <button type="button" id="btnClearCatCart" class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-500 font-extrabold text-xs rounded-xl border border-rose-100 transition cursor-pointer">
                            ยกเลิก
                        </button>
                        <button type="button" id="btnAddMenuInCat" class="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-0.5 cursor-pointer">
                            + เมนู
                        </button>
                        <button type="button" id="btnCloseCatModalX" class="text-slate-400 hover:text-slate-600 text-xl font-bold px-1 leading-none ml-1 cursor-pointer">
                            &times;
                        </button>
                    </div>
                </div>

                <!-- รายการอาหาร Grid 3 คอลัมน์ -->
                <div id="categoryFoodGridContainer" class="grid grid-cols-3 gap-2.5 max-h-[58vh] overflow-y-auto p-1 py-2">
                </div>

                <!-- ปุ่มปิดหน้านี้ ด้านล่างสุด -->
                <div class="mt-3 pt-2 border-t border-slate-100">
                    <button type="button" id="btnCloseCatModalBottom" class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs rounded-2xl transition text-center cursor-pointer">
                        ปิดหน้านี้
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modalOverlay);

        const closeModal = () => modalOverlay.remove();
        modalOverlay.querySelector('#btnCloseCatModalX').onclick = closeModal;
        modalOverlay.querySelector('#btnCloseCatModalBottom').onclick = closeModal;

        // กดปุ่ม "+ เมนู"
        modalOverlay.querySelector('#btnAddMenuInCat').onclick = () => {
            if (window.AddMenuPopup && typeof window.AddMenuPopup.open === 'function') {
                window.AddMenuPopup.open({ 
                    category: this.category,
                    onSave: (newMenu) => {
                        if (typeof this.onAddMenu === 'function') {
                            this.onAddMenu(newMenu);
                        }
                    }
                });
            }
        };

        // กดปุ่ม "ยกเลิก"
        modalOverlay.querySelector('#btnClearCatCart').onclick = () => {
            if (typeof this.onClearCategory === 'function') {
                this.onClearCategory(this.category.id);
            } else {
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const catFoodIds = this.foods.map(f => String(f.id));
                cart = cart.filter(item => !catFoodIds.includes(String(item.food_id || item.id)));
                localStorage.setItem('cart', JSON.stringify(cart));
            }
            this.renderFoodGrid();
        };

        this.renderFoodGrid();
    },

    renderFoodGrid: function () {
        const container = document.getElementById('categoryFoodGridContainer');
        if (!container) return;

        container.innerHTML = '';
        const currentCart = JSON.parse(localStorage.getItem('cart')) || [];

        if (!this.foods || this.foods.length === 0) {
            container.innerHTML = `<div class="col-span-3 text-center py-8 text-slate-400 font-bold text-xs">ยังไม่มีเมนูในหมวดนี้</div>`;
            return;
        }

        this.foods.forEach(food => {
            const cartItem = currentCart.find(item => String(item.food_id || item.id) === String(food.id));
            const itemQty = cartItem ? cartItem.qty : 0;

            const card = document.createElement('div');
            card.className = `relative p-2.5 py-3 rounded-2xl border-2 transition-all text-center flex flex-col items-center justify-center cursor-pointer min-h-[58px] active:scale-95 ${
                itemQty > 0 
                ? 'bg-white border-emerald-500 shadow-sm' 
                : 'bg-white border-emerald-300 hover:border-emerald-400'
            }`;

            let badgeHTML = itemQty > 0 
                ? `<span class="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">${itemQty}</span>` 
                : '';

            card.innerHTML = `
                ${badgeHTML}
                <div class="font-extrabold text-xs text-emerald-800 leading-tight text-center break-words w-full">
                    ${food.name}
                </div>
            `;

            // เมื่อกดที่รายการอาหาร ให้เปิด OrderSelectDetail ป๊อปอัพ
            card.onclick = () => {
                if (window.OrderSelectDetail && typeof window.OrderSelectDetail.open === 'function') {
                    window.OrderSelectDetail.open({
                        food: food,
                        onSave: (detailData) => {
                            let cart = JSON.parse(localStorage.getItem('cart')) || [];
                            const index = cart.findIndex(item => String(item.food_id || item.id) === String(food.id));

                            if (index > -1) {
                                cart[index].qty += detailData.qty;
                                if (detailData.note) cart[index].note = detailData.note;
                            } else {
                                cart.push({
                                    food_id: food.id,
                                    id: food.id,
                                    name: food.name,
                                    price: food.price || food.price_1 || 0,
                                    qty: detailData.qty,
                                    note: detailData.note
                                });
                            }

                            localStorage.setItem('cart', JSON.stringify(cart));
                            if (typeof this.onSelectFood === 'function') {
                                this.onSelectFood(food, detailData);
                            }
                            this.renderFoodGrid();
                        }
                    });
                }
            };

            container.appendChild(card);
        });
    }
};

window.OrderSelectPopup = OrderSelectPopup;
window.OrderSelect = OrderSelectPopup;
