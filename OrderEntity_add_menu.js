// OrderEntity_add_menu.js
(function() {
    function injectAddMenuModal() {
        if (document.getElementById('addMenuModalOverlay')) return;

        const modalHtml = `
            <div id="addMenuModalOverlay" class="custom-modal-overlay">
                <div class="custom-modal-box">
                    <div class="flex justify-between items-center pb-2 mb-3 border-b border-slate-100">
                        <h3 id="addMenuModalCategoryTitle" class="font-extrabold text-base text-slate-800">เพิ่มเมนูใหม่</h3>
                        <button type="button" onclick="closeAddMenuModal()" class="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
                    </div>

                    <form id="addMenuForm" onsubmit="submitNewMenu(event)" class="space-y-3 text-xs">
                        <input type="hidden" id="addMenuCategoryId">

                        <div>
                            <label class="block font-bold text-slate-700 mb-1">ชื่อเมนูอาหาร *</label>
                            <input type="text" id="addMenuName" required placeholder="เช่น ผัดกะเพราหมูสับ" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800">
                        </div>

                        <div class="grid grid-cols-3 gap-2">
                            <div>
                                <label class="block font-bold text-slate-700 mb-1">ราคา ชาวบ้าน</label>
                                <input type="number" id="addMenuPrice1" required min="0" placeholder="0" class="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center font-bold text-slate-800">
                            </div>
                            <div>
                                <label class="block font-bold text-slate-700 mb-1">นักท่องเที่ยว</label>
                                <input type="number" id="addMenuPrice2" required min="0" placeholder="0" class="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center font-bold text-slate-800">
                            </div>
                            <div>
                                <label class="block font-bold text-slate-700 mb-1">สบายดี</label>
                                <input type="number" id="addMenuPrice3" required min="0" placeholder="0" class="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center font-bold text-slate-800">
                            </div>
                        </div>

                        <div class="mt-4 pt-2 flex gap-2">
                            <button type="button" onclick="closeAddMenuModal()" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl active:scale-95 transition">ยกเลิก</button>
                            <button type="submit" id="btnAddMenuSubmit" class="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md active:scale-95 transition">บันทึกเมนู</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    window.openAddMenuModal = function(catId, catName) {
        injectAddMenuModal();
        document.getElementById('addMenuCategoryId').value = catId;
        document.getElementById('addMenuModalCategoryTitle').innerText = `เพิ่มเมนู (${catName})`;
        document.getElementById('addMenuName').value = '';
        document.getElementById('addMenuPrice1').value = '';
        document.getElementById('addMenuPrice2').value = '';
        document.getElementById('addMenuPrice3').value = '';

        const overlay = document.getElementById('addMenuModalOverlay');
        overlay.classList.add('active');
    };

    window.closeAddMenuModal = function() {
        const overlay = document.getElementById('addMenuModalOverlay');
        if (overlay) overlay.classList.remove('active');
    };

    window.submitNewMenu = async function(e) {
        e.preventDefault();

        const catId = document.getElementById('addMenuCategoryId').value;
        const name = document.getElementById('addMenuName').value.trim();
        const price1 = Number(document.getElementById('addMenuPrice1').value || 0);
        const price2 = Number(document.getElementById('addMenuPrice2').value || 0);
        const price3 = Number(document.getElementById('addMenuPrice3').value || 0);

        if (!name) return;

        const btn = document.getElementById('btnAddMenuSubmit');
        btn.disabled = true;
        btn.innerText = 'กำลังบันทึก...';

        try {
            const { data: foodData, error: foodErr } = await supabaseClient
                .from('foods')
                .insert([{
                    group_id: catId,
                    name: name,
                    price_1: price1,
                    price_2: price2,
                    price_3: price3
                }])
                .select()
                .single();

            if (foodErr) throw foodErr;

            if (foodData && foodData.id) {
                const pricesPayload = [
                    { food_id: foodData.id, customer_group_id: 1, price: price1 },
                    { food_id: foodData.id, customer_group_id: 2, price: price2 },
                    { food_id: foodData.id, customer_group_id: 3, price: price3 }
                ];

                await supabaseClient.from('food_prices').insert(pricesPayload);
            }

            closeAddMenuModal();
            if (typeof window.loadData === 'function') {
                await window.loadData();
            }

        } catch (err) {
            console.error('Error adding new menu:', err);
            alert('เกิดข้อผิดพลาดในการบันทึกเมนู: ' + err.message);
        } finally {
            btn.disabled = false;
            btn.innerText = 'บันทึกเมนู';
        }
    };
})();
