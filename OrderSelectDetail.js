// ==========================================
// ไฟล์: OrderSelectDetail.js ( Pop-up สั่งรายละเอียดอาหาร )
// ==========================================

window.OrderSelectDetail = (function() {
    let currentFood = null;
    let onSaveCallback = null;

    let qty = 1;
    let egg1Qty = 0; // ไข่ดาว
    let egg2Qty = 0; // ไข่เจียว
    let noteText = '';

    // สร้าง Element ของ Modal ใน DOM ถ้ายังไม่มี
    function initModalDOM() {
        if (document.getElementById('orderDetailModalOverlay')) return;

        const modalHTML = `
        <div id="orderDetailModalOverlay" class="custom-modal-overlay">
            <div class="custom-modal-box" style="max-width: 24rem;">
                <div class="flex justify-between items-center mb-2">
                    <h2 id="detailFoodName" class="font-extrabold text-lg text-slate-800">ชื่ออาหาร</h2>
                    <button type="button" onclick="window.OrderSelectDetail.close()" class="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
                </div>
                <div id="detailFoodPrice" class="text-emerald-600 font-extrabold text-sm mb-4">ราคา: ฿0</div>

                <!-- กล่องแสดงตัวอย่างรายการที่เลือก (แก้ไข undefinedx) -->
                <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4">
                    <div class="text-xs text-slate-500 font-bold mb-1">🛒 รายการที่เลือกไว้แล้ว:</div>
                    <div class="bg-white border border-slate-300 rounded-lg p-2.5 flex justify-between items-center">
                        <span id="detailPreviewText" class="text-emerald-600 font-bold text-sm">1x รายการ</span>
                        <div class="flex items-center gap-2">
                            <span class="text-slate-400 text-xs">✏️</span>
                            <span onclick="window.OrderSelectDetail.resetInputs()" class="text-slate-400 hover:text-slate-600 cursor-pointer font-bold">&times;</span>
                        </div>
                    </div>
                </div>

                <!-- ปุ่มเพิ่ม/ลด จำนวนจานหลัก -->
                <div class="flex justify-between items-center py-2 border-b border-slate-100">
                    <span class="text-xs font-bold text-slate-700">จำนวน</span>
                    <div class="flex items-center gap-3">
                        <button type="button" onclick="window.OrderSelectDetail.changeQty('main', -1)" class="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center active:scale-95">-</button>
                        <span id="displayMainQty" class="font-bold text-sm min-w-[20px] text-center">1</span>
                        <button type="button" onclick="window.OrderSelectDetail.changeQty('main', 1)" class="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center active:scale-95">+</button>
                    </div>
                </div>

                <!-- ปุ่มเพิ่ม/ลด ไข่ดาว -->
                <div class="flex justify-between items-center py-2 border-b border-slate-100">
                    <span class="text-xs font-bold text-slate-700">🔍 ไข่ดาว</span>
                    <div class="flex items-center gap-3">
                        <button type="button" onclick="window.OrderSelectDetail.changeQty('egg1', -1)" class="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center active:scale-95">-</button>
                        <span id="displayEgg1Qty" class="font-bold text-sm min-w-[20px] text-center">0</span>
                        <button type="button" onclick="window.OrderSelectDetail.changeQty('egg1', 1)" class="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center active:scale-95">+</button>
                    </div>
                </div>

                <!-- ปุ่มเพิ่ม/ลด ไข่เจียว -->
                <div class="flex justify-between items-center py-2 border-b border-slate-100">
                    <span class="text-xs font-bold text-slate-700">🔍 ไข่เจียว</span>
                    <div class="flex items-center gap-3">
                        <button type="button" onclick="window.OrderSelectDetail.changeQty('egg2', -1)" class="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center active:scale-95">-</button>
                        <span id="displayEgg2Qty" class="font-bold text-sm min-w-[20px] text-center">0</span>
                        <button type="button" onclick="window.OrderSelectDetail.changeQty('egg2', 1)" class="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center active:scale-95">+</button>
                    </div>
                </div>

                <!-- ช่องพิมพ์ NOTE -->
                <div class="mt-3">
                    <label class="block text-xs font-bold text-slate-600 mb-1">รายละเอียดเพิ่มเติม (NOTE)</label>
                    <input type="text" id="detailNoteInput" oninput="window.OrderSelectDetail.onNoteChange(this.value)" placeholder="(เช่น เผ็ดน้อย, ไม่ใส่ผัก)" class="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-emerald-500">
                </div>

                <!-- ปุ่มบันทึกรายการ (กล่องสีเหลืองเดิม) -->
                <button type="button" onclick="window.OrderSelectDetail.save()" class="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold py-3 rounded-full text-sm mt-4 shadow flex items-center justify-center gap-2">
                    ✓ บันทึกรายการ
                </button>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // ฟังก์ชันจัดฟอร์แมตข้อความ (แก้ไขสีแดง undefinedx)
    function formatDisplayText(q, foodName, egg1, egg2, note) {
        const validQty = parseInt(q) || 1;
        let options = [];

        if (egg1 > 0) options.push(`ไข่ดาว ${egg1}`);
        if (egg2 > 0) options.push(`ไข่เจียว ${egg2}`);
        if (note && note.trim() !== '') options.push(note.trim());

        const optionsText = options.length > 0 ? ` (${options.join(', ')})` : '';
        return `${validQty}x ${foodName}${optionsText}`;
    }

    function updatePreview() {
        const previewEl = document.getElementById('detailPreviewText');
        if (previewEl && currentFood) {
            previewEl.textContent = formatDisplayText(qty, currentFood.name, egg1Qty, egg2Qty, noteText);
        }
    }

    return {
        open: function(options) {
            initModalDOM();
            currentFood = options.food;
            onSaveCallback = options.onSave;

            // ค่าเริ่มต้นเปิดขึ้นมาทุกครั้งจะเป็น 1 จานเสมอ
            qty = 1;
            egg1Qty = 0;
            egg2Qty = 0;
            noteText = '';

            document.getElementById('detailFoodName').textContent = currentFood.name;
            document.getElementById('detailFoodPrice').textContent = `ราคา: ฿${currentFood.price_1 || currentFood.price || 0}`;
            document.getElementById('detailNoteInput').value = '';

            document.getElementById('displayMainQty').textContent = qty;
            document.getElementById('displayEgg1Qty').textContent = egg1Qty;
            document.getElementById('displayEgg2Qty').textContent = egg2Qty;

            updatePreview();
            document.getElementById('orderDetailModalOverlay').classList.add('active');
        },

        close: function() {
            const modal = document.getElementById('orderDetailModalOverlay');
            if (modal) modal.classList.remove('active');
        },

        resetInputs: function() {
            qty = 1;
            egg1Qty = 0;
            egg2Qty = 0;
            noteText = '';
            document.getElementById('displayMainQty').textContent = qty;
            document.getElementById('displayEgg1Qty').textContent = egg1Qty;
            document.getElementById('displayEgg2Qty').textContent = egg2Qty;
            document.getElementById('detailNoteInput').value = '';
            updatePreview();
        },

        changeQty: function(type, delta) {
            if (type === 'main') {
                qty = Math.max(1, qty + delta);
                document.getElementById('displayMainQty').textContent = qty;
            } else if (type === 'egg1') {
                egg1Qty = Math.max(0, egg1Qty + delta);
                document.getElementById('displayEgg1Qty').textContent = egg1Qty;
            } else if (type === 'egg2') {
                egg2Qty = Math.max(0, egg2Qty + delta);
                document.getElementById('displayEgg2Qty').textContent = egg2Qty;
            }
            updatePreview();
        },

        onNoteChange: function(val) {
            noteText = val;
            updatePreview();
        },

        save: function() {
            if (onSaveCallback && currentFood) {
                const displayText = formatDisplayText(qty, currentFood.name, egg1Qty, egg2Qty, noteText);
                const basePrice = parseFloat(currentFood.price_1 || currentFood.price || 0);
                const extraPrice = (egg1Qty * 10) + (egg2Qty * 10); // ราคาไข่เพิ่ม
                const totalPrice = (basePrice + extraPrice) * qty;

                onSaveCallback({
                    qty: qty,
                    egg1: egg1Qty,
                    egg2: egg2Qty,
                    note: noteText,
                    displayText: displayText,
                    totalPrice: totalPrice
                });
            }
            this.close();
        }
    };
})();

// กำหนด Alias เพื่อความเข้ากันได้ของชื่อเรียก
window.OrderSelectDetailPopup = window.OrderSelectDetail;
