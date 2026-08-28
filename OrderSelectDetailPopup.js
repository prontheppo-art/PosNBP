// OrderSelectDetailPopup.js

const OrderSelectDetailPopup = {
    open: function ({ food, initialData, onSave }) {
        // ลบ Popup เดิมหากมีค้างอยู่
        const existingModal = document.getElementById('orderSelectDetailModalOverlay');
        if (existingModal) existingModal.remove();

        // -------------------------------------------------------------
        // ตรวจสอบหมวดหมู่: แสดงท็อปปิ้งเฉพาะ "อาหารจานเดียว" และ "ข้าวผัด"
        // -------------------------------------------------------------
        const groupName = (food.group_name || food.category_name || '').trim();
        const groupId = Number(food.group_id);

        const isSingleDishOrFriedRice = 
            groupName.includes('อาหารจานเดียว') || 
            groupName.includes('ข้าวผัด') ||
            [1, 2].includes(groupId); // ปรับ ID หมวดหมู่เพิ่มเติมได้ตาม DB

        // ค่าเริ่มต้น
        let currentQty = initialData?.qty || 1;
        let currentFriedEgg = initialData?.fried_egg || 0;
        let currentOmelet = initialData?.omelet || 0;

        // 1. สร้าง Element Popup Overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'orderSelectDetailModalOverlay';
        modalOverlay.className = 'custom-modal-overlay active';

        // 2. โครงสร้าง HTML & ดีไซน์รูปแบบตาราง
        modalOverlay.innerHTML = `
            <div class="custom-modal-box relative border-t-0 p-5 rounded-3xl max-w-sm w-full bg-white shadow-2xl transition-all">
                
                <!-- ส่วนหัว Header -->
                <div class="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                    <h3 class="text-base font-extrabold text-slate-800 flex items-center gap-1.5">
                        <span class="text-emerald-600">📌</span> ${food.name}
                    </h3>
                    <button type="button" id="btnCloseDetailPopup" class="text-slate-400 hover:text-slate-600 text-2xl font-bold p-1 leading-none">&times;</button>
                </div>

                <!-- ตารางจัดการตัวเลือกสินค้า (Table Container) -->
                <div class="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm mb-3">
                    <table class="w-full text-left border-collapse">
                        <tbody class="divide-y divide-slate-100 text-xs">
                            
                            <!-- แถวที่ 1: จำนวนสินค้าหลัก (มีทุกหมวดหมู่) -->
                            <tr class="bg-slate-50/50">
                                <td class="py-2.5 px-3 font-bold text-slate-700 w-1/3">จำนวน</td>
                                <td class="py-2.5 px-3 align-middle">
                                    <div class="flex items-center justify-end">
                                        <div class="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs">
                                            <button type="button" id="btnQtyMinus" class="w-8 h-7 bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center hover:bg-slate-200 border-r border-slate-300 active:bg-slate-300">-</button>
                                            <span id="popupQtyVal" class="font-extrabold text-xs text-slate-800 px-3 min-w-[2rem] text-center">${currentQty}</span>
                                            <button type="button" id="btnQtyPlus" class="w-8 h-7 bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center hover:bg-slate-200 border-l border-slate-300 active:bg-slate-300">+</button>
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            <!-- แถวท็อปปิ้ง (แสดงเฉพาะ อาหารจานเดียว / ข้าวผัด) -->
                            ${isSingleDishOrFriedRice ? `
                                <!-- แถวที่ 2: ไข่ดาว -->
                                <tr>
                                    <td class="py-2.5 px-3 font-bold text-slate-700">🍳 ไข่ดาว</td>
                                    <td class="py-2.5 px-3 align-middle">
                                        <div class="flex items-center justify-end">
                                            <div class="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs">
                                                <button type="button" id="btnEggMinus" class="w-8 h-7 bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center hover:bg-slate-200 border-r border-slate-300 active:bg-slate-300">-</button>
                                                <span id="popupEggVal" class="font-extrabold text-xs text-slate-800 px-3 min-w-[2rem] text-center">${currentFriedEgg}</span>
                                                <button type="button" id="btnEggPlus" class="w-8 h-7 bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center hover:bg-slate-200 border-l border-slate-300 active:bg-slate-300">+</button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>

                                <!-- แถวที่ 3: ไข่เจียว -->
                                <tr>
                                    <td class="py-2.5 px-3 font-bold text-slate-700">🍳 ไข่เจียว</td>
                                    <td class="py-2.5 px-3 align-middle">
                                        <div class="flex items-center justify-end">
                                            <div class="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs">
                                                <button type="button" id="btnOmeletMinus" class="w-8 h-7 bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center hover:bg-slate-200 border-r border-slate-300 active:bg-slate-300">-</button>
                                                <span id="popupOmeletVal" class="font-extrabold text-xs text-slate-800 px-3 min-w-[2rem] text-center">${currentOmelet}</span>
                                                <button type="button" id="btnOmeletPlus" class="w-8 h-7 bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center hover:bg-slate-200 border-l border-slate-300 active:bg-slate-300">+</button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ` : ''}

                            <!-- แถวราคาพิเศษ -->
                            <tr class="bg-amber-50/30">
                                <td class="py-2.5 px-3 font-bold text-amber-600">ราคาพิเศษ</td>
                                <td class="py-2 px-3">
                                    <input type="number" id="popupCustomPriceInput" placeholder="ระบุราคา" value="${initialData?.custom_price || ''}" class="w-full text-xs p-1.5 border border-amber-300 rounded-lg bg-white focus:outline-none focus:border-amber-500 font-bold text-amber-700 text-right">
                                </td>
                            </tr>

                            <!-- แถวหมายเหตุ -->
                            <tr>
                                <td class="py-2.5 px-3 font-bold text-slate-700">หมายเหตุ</td>
                                <td class="py-2 px-3">
                                    <input type="text" id="popupNoteInput" placeholder="(เช่น เผ็ดน้อย, ไม่ใส่ผัก)" value="${initialData?.note || ''}" class="w-full text-xs p-1.5 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-emerald-500 focus:bg-white placeholder:text-slate-400">
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>

                <!-- ปุ่มกดบันทึก -->
                <button type="button" id="btnSaveDetail" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1">
                    ✓ บันทึกรายการ
                </button>
            </div>
        `;

        document.body.appendChild(modalOverlay);

        // 3. การผูก Event Listeners และจัดการปุ่มกด
        const closeModal = () => modalOverlay.remove();
        modalOverlay.querySelector('#btnCloseDetailPopup').onclick = closeModal;

        // เพิ่ม/ลด จำนวนสินค้าหลัก
        modalOverlay.querySelector('#btnQtyMinus').onclick = () => {
            currentQty = Math.max(1, currentQty - 1);
            modalOverlay.querySelector('#popupQtyVal').innerText = currentQty;
        };
        modalOverlay.querySelector('#btnQtyPlus').onclick = () => {
            currentQty += 1;
            modalOverlay.querySelector('#popupQtyVal').innerText = currentQty;
        };

        // เพิ่ม/ลด ท็อปปิ้ง (ทำงานเฉพาะเมื่อตารางไข่ถูกวาดขึ้นมา)
        if (isSingleDishOrFriedRice) {
            modalOverlay.querySelector('#btnEggMinus').onclick = () => {
                currentFriedEgg = Math.max(0, currentFriedEgg - 1);
                modalOverlay.querySelector('#popupEggVal').innerText = currentFriedEgg;
            };
            modalOverlay.querySelector('#btnEggPlus').onclick = () => {
                currentFriedEgg += 1;
                modalOverlay.querySelector('#popupEggVal').innerText = currentFriedEgg;
            };

            modalOverlay.querySelector('#btnOmeletMinus').onclick = () => {
                currentOmelet = Math.max(0, currentOmelet - 1);
                modalOverlay.querySelector('#popupOmeletVal').innerText = currentOmelet;
            };
            modalOverlay.querySelector('#btnOmeletPlus').onclick = () => {
                currentOmelet += 1;
                modalOverlay.querySelector('#popupOmeletVal').innerText = currentOmelet;
            };
        }

        // ปุ่มบันทึกข้อมูล
        modalOverlay.querySelector('#btnSaveDetail').onclick = () => {
            const customPriceVal = modalOverlay.querySelector('#popupCustomPriceInput').value;
            const noteVal = modalOverlay.querySelector('#popupNoteInput').value.trim();

            const savedData = {
                qty: currentQty,
                fried_egg: isSingleDishOrFriedRice ? currentFriedEgg : 0,
                omelet: isSingleDishOrFriedRice ? currentOmelet : 0,
                custom_price: customPriceVal ? parseFloat(customPriceVal) : null,
                note: noteVal
            };

            closeModal();
            if (typeof onSave === 'function') {
                onSave(savedData);
            }
        };
    }
};
