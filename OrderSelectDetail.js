window.currentSelectedFood = null;
window.editingItemId = null;

window.modalMainQty = 1;
window.modalEgg1Qty = 0;
window.modalEgg2Qty = 0;

function openOrderDetailModal(food) {
    window.currentSelectedFood = food;
    window.editingItemId = null; 

    resetModalFields();
    renderSelectedFoodItems();

    const catName = window.currentCategory ? window.currentCategory.name : '';
    const isSingleDish = catName.includes('อาหารจานเดียว') || catName.includes('ข้าวกล่อง') || catName.includes('จานเดียว');

    const egg1Row = document.getElementById('egg1Row');
    const egg2Row = document.getElementById('egg2Row');

    if (egg1Row && egg2Row) {
        if (isSingleDish) {
            egg1Row.style.display = 'flex';
            egg2Row.style.display = 'flex';
        } else {
            egg1Row.style.display = 'none';
            egg2Row.style.display = 'none';
        }
    }

    document.getElementById('detailFoodName').querySelector('span').textContent = food.name;
    document.getElementById('orderDetailModalOverlay').classList.add('active');
}

function closeOrderDetailModal() {
    document.getElementById('orderDetailModalOverlay').classList.remove('active');
}

function resetModalFields() {
    window.modalMainQty = 1;
    window.modalEgg1Qty = 0;
    window.modalEgg2Qty = 0;

    document.getElementById('displayMainQty').textContent = '1';
    document.getElementById('displayEgg1Qty').textContent = '0';
    document.getElementById('displayEgg2Qty').textContent = '0';

    document.getElementById('customPriceInput').value = '';
    document.getElementById('detailNoteInput').value = '';

    const btnSave = document.getElementById('btnSaveOrderDetail');
    if (btnSave) {
        btnSave.innerHTML = '✓ บันทึกรายการ';
        btnSave.className = 'w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-3 rounded-xl text-sm shadow transition flex items-center justify-center gap-1';
    }
}

function changeDetailQty(type, delta) {
    if (type === 'main') {
        window.modalMainQty = Math.max(1, window.modalMainQty + delta);
        document.getElementById('displayMainQty').textContent = window.modalMainQty;
    } else if (type === 'egg1') {
        window.modalEgg1Qty = Math.max(0, window.modalEgg1Qty + delta);
        document.getElementById('displayEgg1Qty').textContent = window.modalEgg1Qty;
    } else if (type === 'egg2') {
        window.modalEgg2Qty = Math.max(0, window.modalEgg2Qty + delta);
        document.getElementById('displayEgg2Qty').textContent = window.modalEgg2Qty;
    }
}

function renderSelectedFoodItems() {
    if (!window.currentSelectedFood) return;

    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    const items = currentCart.filter(item => String(item.food_id) === String(window.currentSelectedFood.id));

    const section = document.getElementById('selectedItemsSection');
    const listContainer = document.getElementById('selectedItemsList');

    if (!section || !listContainer) return;

    if (items.length === 0) {
        section.classList.add('hidden');
        listContainer.innerHTML = '';
        return;
    }

    section.classList.remove('hidden');
    listContainer.innerHTML = '';

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'flex justify-between items-center bg-white p-2 rounded-xl border border-sky-100 shadow-sm text-xs';

        let detailText = `${item.qty}x ${item.name}`;
        let extras = [];
        if (item.egg1_qty > 0) extras.push(`ไข่ดาว ${item.egg1_qty}`);
        if (item.egg2_qty > 0) extras.push(`ไข่เจียว ${item.egg2_qty}`);
        if (item.custom_price) extras.push(`@${item.custom_price}฿`);
        if (item.note) extras.push(`(${item.note})`);

        if (extras.length > 0) {
            detailText += ` <span class="text-slate-400 font-normal">[${extras.join(', ')}]</span>`;
        }

        div.innerHTML = `
            <div class="font-bold text-slate-700 truncate pr-2">${detailText}</div>
            <div class="flex items-center gap-1">
                <button type="button" onclick="editCartItem('${item.id}')" class="text-amber-500 hover:text-amber-600 p-1"><i class="fa-solid fa-pen"></i></button>
                <button type="button" onclick="removeCartItem('${item.id}')" class="text-rose-500 hover:text-rose-600 p-1"><i class="fa-solid fa-xmark"></i></button>
            </div>
        `;
        listContainer.appendChild(div);
    });
}

function saveOrderDetailToList() {
    if (!window.currentSelectedFood) return;

    let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    const customPriceVal = document.getElementById('customPriceInput').value;
    const noteVal = document.getElementById('detailNoteInput').value.trim();

    const price = customPriceVal !== '' ? Number(customPriceVal) : Number(window.currentSelectedFood.price || 0);

    if (window.editingItemId) {
        currentCart = currentCart.map(item => {
            if (item.id === window.editingItemId) {
                return {
                    ...item,
                    qty: window.modalMainQty,
                    egg1_qty: window.modalEgg1Qty,
                    egg2_qty: window.modalEgg2Qty,
                    custom_price: customPriceVal !== '' ? Number(customPriceVal) : null,
                    price: price,
                    note: noteVal
                };
            }
            return item;
        });
    } else {
        const newItem = {
            id: 'item_' + Date.now(),
            food_id: window.currentSelectedFood.id,
            name: window.currentSelectedFood.name,
            qty: window.modalMainQty,
            egg1_qty: window.modalEgg1Qty,
            egg2_qty: window.modalEgg2Qty,
            custom_price: customPriceVal !== '' ? Number(customPriceVal) : null,
            price: price,
            note: noteVal
        };
        currentCart.push(newItem);
    }

    localStorage.setItem('cart', JSON.stringify(currentCart));
    window.cart = currentCart;

    updateCartUI();
    renderQuickNav();

    if (window.currentCategory) {
        const icon = window.categoryIcons[window.categories.findIndex(c => c.id === window.currentCategory.id) % window.categoryIcons.length] || '🍱';
        openCategoryFoodModal(window.currentCategory, icon);
    }

    closeOrderDetailModal();
}

function editCartItem(itemId) {
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = currentCart.find(i => i.id === itemId);
    if (!item) return;

    window.editingItemId = itemId;

    window.modalMainQty = item.qty || 1;
    window.modalEgg1Qty = item.egg1_qty || 0;
    window.modalEgg2Qty = item.egg2_qty || 0;

    document.getElementById('displayMainQty').textContent = window.modalMainQty;
    document.getElementById('displayEgg1Qty').textContent = window.modalEgg1Qty;
    document.getElementById('displayEgg2Qty').textContent = window.modalEgg2Qty;

    document.getElementById('customPriceInput').value = item.custom_price !== null && item.custom_price !== undefined ? item.custom_price : '';
    document.getElementById('detailNoteInput').value = item.note || '';

    const btnSave = document.getElementById('btnSaveOrderDetail');
    if (btnSave) {
        btnSave.innerHTML = '✓ บันทึกการแก้ไข';
        btnSave.className = 'w-full bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold py-3 rounded-xl text-sm shadow transition flex items-center justify-center gap-1';
    }
}

function removeCartItem(itemId) {
    let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    currentCart = currentCart.filter(i => i.id !== itemId);
    
    localStorage.setItem('cart', JSON.stringify(currentCart));
    window.cart = currentCart;

    updateCartUI();
    renderQuickNav();
    renderSelectedFoodItems();

    if (window.currentCategory) {
        const icon = window.categoryIcons[window.categories.findIndex(c => c.id === window.currentCategory.id) % window.categoryIcons.length] || '🍱';
        openCategoryFoodModal(window.currentCategory, icon);
    }
}
