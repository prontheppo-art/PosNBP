// OrderSelectPopup.js
const OrderSelectPopup = {
    options: null,
    currentCategory: null,

    initModalHTML() {
        if (document.getElementById('orderSelectModalOverlay')) return;

        const modalHTML = `
        <div id="orderSelectModalOverlay" class="hidden fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 backdrop-blur-sm">
            <div class="bg-white rounded-3xl w-full max-w-sm max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-100">
                
                <!-- Header -->
                <div class="p-3 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
                    <div class="flex items-center gap-2 overflow-hidden">
                        <span id="orderSelectCatIcon" class="text-xl shrink-0">🍱</span>
                        <h3 id="orderSelectCatTitle" class="font-extrabold text-slate-800 text-sm truncate">ชื่อหมวดหมู่</h3>
                    </div>
                    <div class="flex items-center gap-1.5 shrink-0">
                        <button type="button" onclick="OrderSelectPopup.handleClearCart()" class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-lg text-xs font-bold transition border border-rose-200">
                            ยกเลิก
                        </button>
                        <button type="button" onclick="OrderSelectPopup.handleAddMenu()" class="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-0.5 shadow-sm transition">
                            <span>+</span> เมนู
                        </button>
                        <button type="button" onclick="OrderSelectPopup.close()" class="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-full font-bold text-sm">
                            ✕
                        </button>
                    </div>
                </div>

                <!-- Food List Grid (ปรับให้เลื่อนลื่นขึ้นด้วย touch-action & overscroll) -->
                <div class="flex-1 overflow-y-auto p-3" style="touch-action: pan-y; -webkit-overflow-scrolling: touch; overscroll-behavior: contain;">
                    <div id="orderSelectFoodGrid" class="grid grid-cols-3 gap-2"></div>
                </div>

                <!-- Footer -->
                <div class="p-2.5 bg-slate-50 border-t border-slate-100 shrink-0">
                    <button type="button" onclick="OrderSelectPopup.close()" class="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition">
                        ปิดหน้านี้
                    </button>
                </div>

            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    open(options) {
        this.options = options || {};
        this.currentCategory = this.options.category || null;
        
        this.initModalHTML();

        const iconEl = document.getElementById('orderSelectCatIcon');
        const titleEl = document.getElementById('orderSelectCatTitle');
        const overlay = document.getElementById('orderSelectModalOverlay');

        if (iconEl) iconEl.textContent = this.options.icon || '🍱';
        if (titleEl) titleEl.textContent = this.currentCategory ? this.currentCategory.name : 'หมวดหมู่';

        this.renderFoodGrid();

        if (overlay) {
            overlay.classList.remove('hidden');
        }
    },

    renderFoodGrid() {
        const grid = document.getElementById('orderSelectFoodGrid');
        if (!grid) return;
        grid.innerHTML = '';

        const foods = (this.options && this.options.foods) ? this.options.foods : [];
        let cart = [];
        
        try {
            cart = JSON.parse(localStorage.getItem('cart')) || [];
        } catch (e) {
            cart = (this.options && this.options.cart) ? this.options.cart : [];
        }

        if (foods.length === 0) {
            grid.innerHTML = `<div class="col-span-3 text-center py-8 text-slate-400 text-xs font-bold">ไม่มีรายการอาหารในหมวดหมู่นี้</div>`;
            return;
        }

        foods.forEach(food => {
            const inCart = cart.find(c => String(c.food_id) === String(food.id));
            const qty = inCart ? (Number(inCart.qty) || 0) : 0;

            const btn = document.createElement('button');
            btn.type = 'button';
            
            // ดีไซน์ปุ่มสไตล์ทรงรูปที่ 2 (ขอบมนกำลังดี + กรอบสีเขียวเมื่อเลือก)
            btn.className = `p-2 rounded-xl border-2 text-center font-extrabold text-xs flex flex-col items-center justify-center min-h-[48px] transition relative active:scale-95 ${
                qty > 0 
                ? 'bg-white border-emerald-500 text-emerald-600 shadow-sm' 
                : 'bg-white border-emerald-500/60 text-slate-700 hover:border-emerald-500'
            }`;

            // ตัวเลข Badge วงกลมสีแดงมุมขวาบน
            let badge = '';
            if (qty > 0) {
                badge = `<span class="absolute -top-2 -right-1.5 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black border border-white shadow-md z-10">${qty}</span>`;
            }

            btn.innerHTML = `${badge}<span class="line-clamp-2 leading-tight">${food.name}</span>`;
            
            btn.onclick = () => {
                if (this.options && typeof this.options.onSelectFood === 'function') {
                    this.options.onSelectFood(food);
                }
            };
            
            grid.appendChild(btn);
        });
    },

    handleAddMenu() {
        if (this.options && typeof this.options.onAddMenu === 'function') {
            this.options.onAddMenu(this.currentCategory);
        }
    },

    handleClearCart() {
        if (this.options && typeof this.options.onClearCategory === 'function' && this.currentCategory) {
            this.options.onClearCategory(this.currentCategory.id);
            this.renderFoodGrid();
        }
    },

    close() {
        const overlay = document.getElementById('orderSelectModalOverlay');
        if (overlay) overlay.classList.add('hidden');
    }
};
