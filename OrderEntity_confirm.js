(function () {
    // ฉีด Style และ Pop-up Modal เข้า Body อัตโนมัติ
    const modalStylesAndHTML = `
    <style>
        .no-zoom-touch { touch-action: pan-x pan-y; }
    </style>
    <div id="confirmClearModalOverlay" class="hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[99999] no-zoom-touch" onclick="closeConfirmClearModal()">
        <div class="bg-white rounded-[24px] p-5 w-full max-w-[320px] text-center shadow-2xl relative" onclick="event.stopPropagation()">
            <div class="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl shadow-inner">
                🗑️
            </div>
            <h3 class="text-base font-bold text-slate-800 mb-1">ยืนยันการทำรายการ</h3>
            <p class="text-xs text-slate-500 font-semibold mb-5 leading-relaxed">
                คุณต้องการยกเลิกรายการอาหารทั้งหมดใช่หรือไม่?
            </p>
            <div class="flex items-center gap-2">
                <button type="button" onclick="closeConfirmClearModal()" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition active:scale-95">
                    ยกเลิก
                </button>
                <button type="button" onclick="executeClearCart()" class="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs transition active:scale-95 shadow-md shadow-rose-200">
                    ตกลง
                </button>
            </div>
        </div>
    </div>
    `;

    if (document.body) {
        document.body.insertAdjacentHTML('beforeend', modalStylesAndHTML);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            document.body.insertAdjacentHTML('beforeend', modalStylesAndHTML);
        });
    }
})();

// เปิด Modal
window.openConfirmClearModal = function () {
    const modal = document.getElementById('confirmClearModalOverlay');
    if (modal) modal.classList.remove('hidden');
};

// ปิด Modal
window.closeConfirmClearModal = function () {
    const modal = document.getElementById('confirmClearModalOverlay');
    if (modal) modal.classList.add('hidden');
};

// ยืนยันล้างข้อมูล
window.executeClearCart = function () {
    localStorage.removeItem('cart');
    closeConfirmClearModal();
    if (typeof updateCartUI === 'function') updateCartUI();
    if (typeof renderCategoryGrid === 'function') renderCategoryGrid();
};
