/**
 * FoodGroupPopup.js - ตัวจัดการ Pop-up UI ดีไซน์ตามปุ่มแถบรับออเดอร์
 */

window.FoodGroupPopup = {
    // ไอคอนหมวดหมู่ที่จะวนใช้อัตโนมัติเรียงตามกลุ่ม
    categoryIcons: ['🍱', '🍲', '🍳', '🍚', '🥩', '⭐', '🥗', '🛍️', '🍽️', '🥢', '🍹'],

    init() {
        if (document.getElementById('foodGroupModalContainer')) return;

        const modalHtml = `
            <div id="foodGroupModalContainer" class="hidden fixed inset-0 bg-slate-900/60 z-[999] flex items-center justify-center p-4 backdrop-blur-xs transition-opacity duration-200">
                <div class="bg-slate-50 rounded-3xl max-w-sm w-full p-4 shadow-2xl space-y-3 relative transform transition-all scale-100 border border-slate-200">
                    
                    <div class="flex items-center justify-between border-b border-slate-200 pb-2.5">
                        <h3 id="foodGroupModalTitle" class="text-base font-extrabold text-slate-800 flex items-center gap-2">
                            📂 เลือกกลุ่มอาหาร
                        </h3>
                        <button type="button" onclick="FoodGroupPopup.close()" class="text-slate-400 hover:text-slate-600 font-bold text-lg leading-none p-1">✕</button>
                    </div>

                    <div id="foodGroupModalSubTitle" class="hidden text-xs font-bold text-slate-600 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    </div>

                    <!-- พื้นที่แสดงปุ่มหมวดหมู่ 2 คอลัมน์ สไตล์ .cat-nav-btn -->
                    <div id="foodGroupButtonsGrid" class="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto p-1 scrollbar-thin">
                    </div>

                    <div class="pt-1 border-t border-slate-200">
                        <button type="button" onclick="FoodGroupPopup.close()" class="w-full bg-white hover:bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl text-xs border border-slate-300 shadow-xs transition active:scale-95">
                            ยกเลิก
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    /**
     * เรียกเปิด Pop-up
     * @param {Object} config 
     */
    open(config = {}) {
        this.init();

        const titleEl = document.getElementById('foodGroupModalTitle');
        const subTitleEl = document.getElementById('foodGroupModalSubTitle');
        const gridEl = document.getElementById('foodGroupButtonsGrid');
        const container = document.getElementById('foodGroupModalContainer');

        if (config.title) titleEl.innerHTML = config.title;
        
        if (config.subtitle) {
            subTitleEl.innerHTML = config.subtitle;
            subTitleEl.classList.remove('hidden');
        } else {
            subTitleEl.classList.add('hidden');
        }

        let gridHtml = '';

        // ตัวเลือก "แสดงทุกหมวดหมู่"
        if (config.includeAllOption) {
            const isSelected = String(config.selectedId) === 'all';
            const btnStyle = isSelected 
                ? 'background-color: #10b981; color: #ffffff; border-color: #10b981;' 
                : 'background-color: #ffffff; color: #1e293b; border-color: #cbd5e1;';

            gridHtml += `
                <button type="button" 
                        onclick="FoodGroupPopup._handleSelect('all', '-- แสดงทุกหมวดหมู่ --')" 
                        style="${btnStyle}"
                        class="col-span-2 p-2.5 border rounded-xl text-xs font-extrabold text-center flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95 min-h-[44px]">
                    <span class="text-sm">🌐</span>
                    <span>-- แสดงทุกหมวดหมู่ --</span>
                    ${isSelected ? '<span class="ml-1">✓</span>' : ''}
                </button>
            `;
        }

        // รายการปุ่มกลุ่มอาหาร แบบ 2 คอลัมน์ ตามในรูป
        (config.categories || []).forEach((cat, index) => {
            const isSelected = String(config.selectedId) === String(cat.id);
            const icon = this.categoryIcons[index % this.categoryIcons.length];

            // สไตล์แบบ .cat-nav-btn 
            const btnStyle = isSelected 
                ? 'background-color: #10b981; color: #ffffff; border-color: #10b981; box-shadow: 0 2px 4px rgba(16,185,129,0.2);' 
                : 'background-color: #ffffff; color: #1e293b; border-color: #cbd5e1; box-shadow: 0 1px 2px rgba(0,0,0,0.05);';

            gridHtml += `
                <button type="button" 
                        onclick="FoodGroupPopup._handleSelect('${cat.id}', '${cat.name.replace(/'/g, "\\'")}')" 
                        style="${btnStyle}"
                        class="p-2 border rounded-xl text-xs font-extrabold text-center flex items-center justify-center gap-1.5 leading-tight transition active:scale-95 min-h-[44px] break-words">
                    <span class="text-base shrink-0">${icon}</span>
                    <span class="truncate">${cat.name}</span>
                </button>
            `;
        });

        gridEl.innerHTML = gridHtml;
        this.currentCallback = config.onSelect;
        container.classList.remove('hidden');
    },

    _handleSelect(id, name) {
        if (typeof this.currentCallback === 'function') {
            this.currentCallback({ id, name });
        }
        this.close();
    },

    close() {
        const container = document.getElementById('foodGroupModalContainer');
        if (container) container.classList.add('hidden');
    }
};
