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
        <!-- Pop-up ย้ายกลุ่มหมวดหมู่ -->
        <div id="changeCategoryModal" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-3 relative max-h-[85vh] flex flex-col">
                <h3 class="text-base font-bold text-gray-800 text-center border-b pb-2 shrink-0">📁 ย้ายกลุ่มหมวดหมู่</h3>
                
                <div class="text-xs text-gray-600 flex-1 overflow-y-auto pr-1">
                    <p class="mb-1 font-semibold">รายการอาหาร:</p>
                    <p id="modalFoodName" class="text-sm font-bold text-blue-600 bg-blue-50 p-2.5 rounded-xl mb-3 truncate"></p>
                    
                    <label class="block mb-2 font-semibold text-gray-700">เลือกกลุ่มอาหารใหม่:</label>
                    <div id="categoryGridContainer" class="grid grid-cols-2 gap-2 bg-slate-50 p-2 border border-slate-200 rounded-2xl max-h-52 overflow-y-auto"></div>
                </div>

                <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 shrink-0">
                    <button type="button" onclick="ManageCategoryPopup.close()" class="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2.5 rounded-xl text-xs">
                        ยกเลิก
                    </button>
                    <button type="button" onclick="ManageCategoryPopup.save()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md">
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
        document.getElementById('modalFoodName').textContent = foodItem.name;

        this.renderGrid();
        document.getElementById('changeCategoryModal').classList.remove('hidden');
    },

    renderGrid() {
        const gridContainer = document.getElementById('categoryGridContainer');
        if (!gridContainer) return;
        gridContainer.innerHTML = '';

        this.foodGroups.forEach((group, index) => {
            const icon = this.categoryIcons[index % this.categoryIcons.length];
            const isSelected = String(group.id) === String(this.selectedGroupId);

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `cat-select-card ${isSelected ? 'selected' : ''}`;
            btn.innerHTML = `<span>${icon}</span> <span class="truncate">${group.name}</span>`;
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
        if (!this.currentEditingFoodId || !this.selectedGroupId) return;

        const foodItem = this.menus.find(m => String(m.id) === String(this.currentEditingFoodId));
        if (!foodItem) return;

        if (String(foodItem.group_id) === String(this.selectedGroupId)) {
            this.close();
            return;
        }

        try {
            const { error } = await this.db.from('foods')
                .update({ group_id: parseInt(this.selectedGroupId) || this.selectedGroupId })
                .eq('id', parseInt(this.currentEditingFoodId));

            if (error) {
                alert('เกิดข้อผิดพลาดในการย้ายกลุ่ม: ' + error.message);
            } else {
                foodItem.group_id = this.selectedGroupId;
                this.close();
                if (typeof this.onSaveCallback === 'function') {
                    this.onSaveCallback();
                }
            }
        } catch (err) {
            console.error("Exception on saveNewCategory:", err);
        }
    }
};
