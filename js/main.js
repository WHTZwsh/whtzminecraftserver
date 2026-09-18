(function () {
    'use strict';

    const addServerBtn = document.getElementById('addServerBtn');
    const helpBtn = document.getElementById('helpBtn');
    const addServerModal = document.getElementById('addServerModal');
    const helpModal = document.getElementById('helpModal');
    const closeAddServer = document.getElementById('closeAddServer');
    const closeHelp = document.getElementById('closeHelp');

    let activeModal = null;

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            activeModal = modal;
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (activeModal) {
            activeModal.classList.remove('active');
            activeModal = null;
            document.body.style.overflow = '';
        }
    }

    function closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(function (modal) {
            modal.classList.remove('active');
        });
        activeModal = null;
        document.body.style.overflow = '';
    }

    if (addServerBtn) {
        addServerBtn.addEventListener('click', function () {
            openModal('addServerModal');
        });
    }

    if (helpBtn) {
        helpBtn.addEventListener('click', function () {
            openModal('helpModal');
        });
    }

    if (closeAddServer) {
        closeAddServer.addEventListener('click', closeModal);
    }
    if (closeHelp) {
        closeHelp.addEventListener('click', closeModal);
    }

    document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                closeModal();
            }
        });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && activeModal) {
            closeModal();
        }
    });

    document.querySelectorAll('.modal-content').forEach(function (content) {
        content.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });

    window.WHTZ = window.WHTZ || {};
    window.WHTZ.openModal = openModal;
    window.WHTZ.closeModal = closeModal;
    window.WHTZ.closeAllModals = closeAllModals;

})();