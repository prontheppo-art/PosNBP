// OrderEntity_confirm.js
(function() {
    function injectConfirmClearModal() {
        if (document.getElementById('confirmClearModalOverlay')) return;

        const modalHtml = `
            <div id="confirmClearModalOverlay" class="custom-modal-overlay">
                <div class="custom-modal-box text-center">
                    <div class="w-12 h-12 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                        ⚠️
                    </div>
                    <h3 class="font-bold text-base text-slate-800 mb-1">ยืนยันการยกเลิกรายการ?</h3>
                    <p class="text-xs text-slate-500 mb-4">รายการอาหารทั้งหมดในตะกร้าจะถูกลบออกทันที</p>

                    <div class="flex gap-2">
                        <button type="button" onclick="closeConfirmClearModal()" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs active:scale-95 transition">
                            ยกเลิก
                        </button>
                        <button type="button" onclick="executeClearAllCart()" class="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md active:scale-95 transition">
                            ยืนยันลบทั้งหมด
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    window.openConfirmClearModal = function() {
        injectConfirmClearModal();
        const overlay = document.getElementById('confirmClearModalOverlay');
        overlay.classList.add('active');
    };

    window.closeConfirmClearModal = function() {
        const overlay = document.getElementById('confirmClearModalOverlay');
        if (overlay) overlay.classList.remove('active');
    };

    window.executeClearAllCart = function() {
        localStorage.removeItem('cart');
        localStorage.removeItem('pendingOrderData');
        localStorage.removeItem('customerPhone');
        localStorage.removeItem('orderNote');
        
        if (typeof window.syncAndRefreshMainUI === 'function') {
            window.syncAndRefreshMainUI([]);
        } else {
            window.dispatchEvent(new Event('cartUpdated'));
        }

        closeConfirmClearModal();
    };
})();
