(function () {
    // 1. HTML Modal ปรับ layout 2 บรรทัด ตามลายมือเขียน
    const modalHTML = `
    <style>
        .custom-modal-overlay { 
            position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
            background: rgba(15, 23, 42, 0.6); 
            backdrop-filter: blur(4px); 
            display: none; 
            align-items: center; 
            justify-content: center; 
            z-index: 9999; 
            padding: 0.5rem; 
        }
        .custom-modal-overlay.active { display: flex; }
        .custom-modal-box { 
            background: #ffffff; 
            border-radius: 1.25rem; 
            max-width: 24rem; 
            width: 100%; 
            padding: 1rem; 
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); 
            max-height: 90vh; 
            overflow-y: auto; 
            border: 2px solid #3b82f6; 
            touch-action: pan-y; 
        }
    </style>
    <div id="itemDetailModal" class="custom-modal-overlay" onclick="handleOverlayClick(event)">
        <div class="custom-modal-box" onclick="event.stopPropagation()">
            <!-- หัวข้อเมนู -->
            <div class="flex justify-between items-center border-b border-slate-100 pb-2 mb-2">
                <h3 id="detailItemName" class="text-base font-extrabold text-slate-800">ชื่อเมนู</h3>
                <button type="button" onclick="closeModal('itemDetailModal')" class="text-slate-400 text-lg font-bold p-1 cursor-pointer">✕</button>
            </div>
            
            <!-- รายการที่สั่งไว้แล้ว -->
            <div id="existingCartItemsSection" class="hidden bg-blue-50/60 p-2 rounded-xl border border-blue-300 mb-2">
                <div class="font-bold text-blue-700 text-[11px] mb-1">🛒 รายการที่เลือกไว้แล้ว:</div>
                <div id="existingCartItemsList" class="flex flex-col gap-1"></div>
            </div>

            <div class="space-y-2 mt-2">
                <!-- บรรทัดที่ 1: จำนวน + ไข่ดาว + ไข่เจียว (อยู่ในแถวเดียวกันตามภาพวาด) -->
                <div class="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200 gap-1">
                    
                    <!-- จำนวน -->
                    <div class="flex items-center gap-1">
                        <span class="text-xs font-bold text-slate-700 whitespace-nowrap">จำนวน</span>
                        <div class="flex items-center bg-white rounded border border-slate-300">
                            <button type="button" onclick="adjustQty(-1)" class="w-5 h-6 text-xs font-bold">-</button>
                            <input type="number" id="itemQtyInput" value="1" readonly class="w-5 text-center font-extrabold text-xs bg-transparent p-0">
                            <button type="button" onclick="adjustQty(1)" class="w-5 h-6 text-xs font-bold">+</button>
                        </div>
                    </div>

                    <!-- ออปชันท็อปปิ้ง (ไข่ดาว & ไข่เจียว) -->
                    <div id="boxRiceBoxAddons" class="hidden items-center gap-1">
                        <!-- ไข่ดาว -->
                        <div class="flex items-center gap-1">
                            <span class="text-xs font-bold text-slate-700 whitespace-nowrap">ไข่ดาว</span>
                            <div class="flex items-center bg-white rounded border border-slate-300">
                                <button type="button" onclick="adjustAddonQty('friedEggQty', -1)" class="w-5 h-6 text-xs font-bold">-</button>
                                <input type="number" id="friedEggQty" value="0" readonly class="w-4 text-center font-extrabold text-xs bg-transparent p-0">
                                <button type="button" onclick="adjustAddonQty('friedEggQty', 1)" class="w-5 h-6 text-xs font-bold">+</button>
                            </div>
                        </div>

                        <!-- ไข่เจียว -->
                        <div class="flex items-center gap-1">
                            <span class="text-xs font-bold text-slate-700 whitespace-nowrap">ไข่เจียว</span>
                            <div class="flex items-center bg-white rounded border border-slate-300">
                                <button type="button" onclick="adjustAddonQty('omeletQty', -1)" class="w-5 h-6 text-xs font-bold">-</button>
                                <input type="number" id="omeletQty" value="0" readonly class="w-4 text-center font-extrabold text-xs bg-transparent p-0">
                                <button type="button" onclick="adjustAddonQty('omeletQty', 1)" class="w-5 h-6 text-xs font-bold">+</button>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- บรรทัดที่ 2: ช่องระบุรายละเอียดเพิ่มเติม (NOTE) อยู่ด้านล่าง -->
                <input type="text" id="itemNoteInput" placeholder="รายละเอียดเพิ่มเติม (NOTE)" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500">
                
                <!-- ปุ่มบันทึก -->
                <button type="button" onclick="saveAndClose()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded-xl text-xs shadow-sm mt-1">✓ บันทึกรายการ</button>
            </div>
        </div>
    </div>`;

    if (document.body) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        });
    }

    // ล็อกซูมหน้าจอ
    document.addEventListener('gesturestart', function (e) { e.preventDefault(); }, { passive: false });
    document.addEventListener('touchstart', function (e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
})();

// Logic จัดการข้อมูลใน Modal
window.editingCartIndex = null;

window.openOrderModal = function (food, categoryName) {
    window.currentItem = food;
    resetModalForm();
    document.getElementById('detailItemName').innerText = food.name;
    
    const addonBox = document.getElementById('boxRiceBoxAddons');
    if (addonBox) {
        if (categoryName === 'ข้าวกล่อง') {
            addonBox.classList.remove('hidden');
            addonBox.classList.add('flex');
        } else {
            addonBox.classList.add('hidden');
            addonBox.classList.remove('flex');
        }
    }
    
    renderExistingCartItems(food.id);
    document.getElementById('itemDetailModal').classList.add('active');
};

window.resetModalForm = function () {
    window.editingCartIndex = null;
    if (document.getElementById('itemQtyInput')) document.getElementById('itemQtyInput').value = 1;
    if (document.getElementById('friedEggQty')) document.getElementById('friedEggQty').value = 0;
    if (document.getElementById('omeletQty')) document.getElementById('omeletQty').value = 0;
    if (document.getElementById('itemNoteInput')) document.getElementById('itemNoteInput').value = '';
};

window.editCartItem = function (idx) {
    const item = cart[idx];
    if (!item) return;
    window.editingCartIndex = idx;
    
    document.getElementById('itemQtyInput').value = item.qty;
    document.getElementById('friedEggQty').value = item.fried_egg || 0;
    document.getElementById('omeletQty').value = item.omelet || 0;
    
    let cleanNote = item.note || '';
    cleanNote = cleanNote.replace(/ไข่ดาว \d+ ฟอง/g, '').replace(/ไข่เจียว \d+ ฟอง/g, '').replace(/^,\s*|,\s*$/g, '').trim();
    document.getElementById('itemNoteInput').value = cleanNote;
};

window.renderExistingCartItems = function (foodId) {
    const list = document.getElementById('existingCartItemsList');
    const section = document.getElementById('existingCartItemsSection');
    const items = cart.map((item, idx) => ({ ...normalizeItem(item), idx })).filter(i => String(i.food_id) === String(foodId));
    
    if (items.length > 0) {
        list.innerHTML = items.map(item => {
            // แสดงเฉพาะข้อความในวงเล็บสีแดง ไม่มีคำว่า NOTE: หรือก้ามปู [] แล้ว
            const noteText = item.note ? `<span class="text-red-500 font-bold ml-1">(${item.note})</span>` : '';

            return `
            <div class="flex justify-between items-center bg-white p-1.5 rounded-lg border border-blue-200 text-xs text-slate-700 shadow-sm">
                <div class="pr-2 leading-tight">
                    <span class="font-extrabold text-blue-700">${item.qty}x</span> ${item.name} ${noteText}
                </div>
                <div class="flex items-center gap-1 shrink-0">
                    <button type="button" onclick="editCartItem(${item.idx})" class="p-1 hover:bg-slate-100 rounded">✏️</button>
                    <button type="button" onclick="removeCartItem(${item.idx})" class="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600">✕</button>
                </div>
            </div>`;
        }).join('');
        section.classList.remove('hidden');
    } else { section.classList.add('hidden'); }
};

window.removeCartItem = function (idx) {
    cart.splice(idx, 1);
    if (window.editingCartIndex === idx) resetModalForm();
    syncAndRefreshMainUI(cart);
    renderExistingCartItems(window.currentItem.id);
};

window.saveAndClose = function () {
    const friedEggQty = parseInt(document.getElementById('friedEggQty').value) || 0;
    const omeletQty = parseInt(document.getElementById('omeletQty').value) || 0;
    const customNote = document.getElementById('itemNoteInput').value.trim();

    const eggUnitPrice = 10; 
    const addonPriceSum = (friedEggQty * eggUnitPrice) + (omeletQty * eggUnitPrice);

    const baseP1 = getBasePrice(window.currentItem, 1);
    const baseP2 = getBasePrice(window.currentItem, 2);
    const baseP3 = getBasePrice(window.currentItem, 3);

    let noteParts = [];
    if (friedEggQty > 0) noteParts.push(`ไข่ดาว ${friedEggQty} ฟอง`);
    if (omeletQty > 0) noteParts.push(`ไข่เจียว ${omeletQty} ฟอง`);
    if (customNote) noteParts.push(customNote);

    const fullNote = noteParts.join(', ');

    const newPayload = {
        food_id: window.currentItem.id,
        name: window.currentItem.name,
        price_group_1: baseP1 + addonPriceSum,
        price_group_2: baseP2 + addonPriceSum,
        price_group_3: baseP3 + addonPriceSum,
        price: (baseP2 || baseP1) + addonPriceSum,
        qty: parseInt(document.getElementById('itemQtyInput').value) || 1,
        fried_egg: friedEggQty,
        omelet: omeletQty,
        note: fullNote
    };

    if (window.editingCartIndex !== null) {
        cart[window.editingCartIndex] = newPayload;
    } else {
        const existingIndex = cart.findIndex(item => 
            String(item.food_id) === String(newPayload.food_id) && 
            item.fried_egg === newPayload.fried_egg && 
            item.omelet === newPayload.omelet && 
            item.note === newPayload.note
        );
        
        if (existingIndex !== -1) {
            cart[existingIndex].qty += newPayload.qty;
        } else {
            cart.push(newPayload);
        }
    }
    
    syncAndRefreshMainUI(cart);
    closeModal('itemDetailModal');
};

window.handleOverlayClick = function (event) { 
    if (event.target.id === 'itemDetailModal') closeModal('itemDetailModal'); 
};

window.closeModal = function (id) { 
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active'); 
    resetModalForm(); 
};

window.adjustQty = function (n) { 
    const i = document.getElementById('itemQtyInput'); 
    if (i) i.value = Math.max(1, parseInt(i.value) + n); 
};

window.adjustAddonQty = function (id, n) { 
    const i = document.getElementById(id); 
    if (i) i.value = Math.max(0, parseInt(i.value) + n); 
};
