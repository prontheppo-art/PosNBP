// ManageCategoryPopup.js
const ManageCategoryPopup = {
    db: null,
    menus: [],
    foodGroups: [],
    currentEditingFoodId: null,
    selectedGroupId: null,
    categoryIcons: ['🍱', '🍲', '🍳', '🍚', '🥩', '⭐', '🥗', '🛍️', '🍽️', '🥢', '🍹'],
    onSaveCallback: null,

    init(dbInstance, onSaveCallback) {
        this.db = dbInstance;
        this.onSaveCallback = onSaveCallback;
        this.injectModalHTML();
    },

    updateData(menusData, foodGroupsData) {
        this.menus = menusData || [];
        this.foodGroups = foodGroupsData || [];
    },

    injectModalHTML() {
        if (document.getElementById('changeCategoryModal')) return;

        const modalHTML = `
        <style>
            .cat-select-wrap {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                padding: 0.5rem;
                width: 100%;
                max-height: 220px;
                overflow-y: auto;
            }
            .cat-select-btn {
                background-color: #ffffff;
                border: 1.5px solid #cbd5e1;
                color: #1e293b;
                font-size: 0.8rem;
                font-weight: 700;
                padding: 0.5rem 0.4rem;
                border-radius: 0.85rem;
                text-align: center;
                transition: all 0.15s ease;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 0.35rem;
                cursor: pointer;
                min-height: 46px;
                flex: 1 1 calc(33.333% - 0.5rem);
                min-width: 90px;
                word-break: break-word;
                line-height: 1.25;
            }
            .cat-select-btn.wide-btn {
                flex: 2 1 calc(50% - 0.5rem);
            }
            .cat-select-btn.selected {
                background-color: #eff6ff;
                border-color: #2563eb;
                color: #1d4ed8;
                box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
            }
        </style>

        <!-- Pop-up ย้ายกลุ่มหมวดหมู่ & แก้ไขชื่ออาหาร -->
        <div id="changeCategoryModal" class="hidden fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 backdrop-blur-sm">
            <div class="bg-white rounded-3xl max-w-sm w-full p-4 shadow-2xl space-y-3 relative max-h-[85vh] flex flex-col border border-slate-100">
                <h3 class="text-base font-extrabold text-slate-800 text-center border-b pb-2 shrink-0 flex items-center justify-center gap-1.5">
                    ✏️ แก้ไขข้อมูลและย้ายหมวดหมู่
                </h3>
                
                <div class="text-xs text-slate-600 flex-1 overflow-y-auto space-y-2">
                    <label class="block font-bold text-slate-500">ชื่อรายการอาหาร (แตะเพื่อแก้ไข):</label>
                    <input type="text" id="modalFoodNameInput" 
                           class="w-full text-sm font-bold text-blue-700 bg-blue-50 p-2.5 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition" 
                           placeholder="พิมพ์ชื่ออาหาร..." />
                    
                    <label class="block font-bold text-slate-500 pt-1">เลือกกลุ่มอาหารใหม่:</label>
                    <div id="categoryGridContainer" class="cat-select-wrap bg-slate-50 border border-slate-200 rounded-2xl"></div>
                </div>

                <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 shrink-0">
                    <button type="button" onclick="ManageCategoryPopup.close()" class="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition">
                        ยกเลิก
                    </button>
                    <button type="button" id="modalSaveBtn" onclick="ManageCategoryPopup.save()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition">
                        บันทึก
                    </button>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    open(foodId) {
        const foodItem = this.menus.find(m => String(m.id) === String(foodId));
        if (!foodItem) return;

        this.currentEditingFoodId = foodId;
        this.selectedGroupId = foodItem.group_id;
        
        const inputElem = document.getElementById('modalFoodNameInput');
        if (inputElem) {
            inputElem.value = foodItem.name || '';
        }

        this.renderGrid();
        document.getElementById('changeCategoryModal').classList.remove('hidden');
    },

    renderGrid() {
        const gridContainer = document.getElementById('categoryGridContainer');
        if (!gridContainer) return;
        gridContainer.innerHTML = '';

        if (this.foodGroups.length === 0) {
            gridContainer.innerHTML = `<div class="w-full text-center text-slate-400 py-4 font-bold">ไม่พบข้อมูลกลุ่มอาหาร</div>`;
            return;
        }

        this.foodGroups.forEach((group, index) => {
            const icon = this.categoryIcons[index % this.categoryIcons.length];
            const isSelected = String(group.id) === String(this.selectedGroupId);
            const isLongName = (group.name || '').length > 8;

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `cat-select-btn ${isLongName ? 'wide-btn' : ''} ${isSelected ? 'selected' : ''}`;
            btn.innerHTML = `<span>${icon}</span> <span>${group.name}</span>`;
            btn.onclick = () => {
                this.selectedGroupId = group.id;
                this.renderGrid();
            };
            gridContainer.appendChild(btn);
        });
    },

    close() {
        document.getElementById('changeCategoryModal').classList.add('hidden');
        this.currentEditingFoodId = null;
        this.selectedGroupId = null;
    },

    async save() {
        if (!this.currentEditingFoodId) return;

        const foodItem = this.menus.find(m => String(m.id) === String(this.currentEditingFoodId));
        if (!foodItem) return;

        const newName = document.getElementById('modalFoodNameInput').value.trim();
        if (!newName) {
            alert('กรุณากรอกชื่ออาหาร');
            return;
        }

        const saveBtn = document.getElementById('modalSaveBtn');
        try {
            if (saveBtn) {
                saveBtn.disabled = true;
                saveBtn.innerText = '⏳ บันทึก...';
            }

            const updatePayload = {
                name: newName,
                group_id: parseInt(this.selectedGroupId) || this.selectedGroupId
            };

            const { error } = await this.db.from('foods')
                .update(updatePayload)
                .eq('id', parseInt(this.currentEditingFoodId));

            if (error) {
                alert('เกิดข้อผิดพลาดในการบันทึก: ' + error.message);
            } else {
                foodItem.name = newName;
                foodItem.group_id = this.selectedGroupId;
                this.close();
                if (typeof this.onSaveCallback === 'function') {
                    this.onSaveCallback();
                }
            }
        } catch (err) {
            console.error("Exception on save food details:", err);
        } finally {
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.innerText = 'บันทึก';
            }
        }
    }
};
