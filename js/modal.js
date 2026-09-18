(function () {
    'use strict';

    const ScrollLock = {
        _scrollPosition: 0,

        lock: function () {
            this._scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            document.body.style.position = 'fixed';
            document.body.style.top = '-' + this._scrollPosition + 'px';
            document.body.style.width = '100%';
        },

        unlock: function () {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, this._scrollPosition);
        }
    };

    const ModalTransitions = {
        animateIn: function (modal) {
            const content = modal.querySelector('.modal-content');
            if (content) {
                content.style.opacity = '0';
                content.style.transform = 'translateY(30px) scale(0.95)';

                void content.offsetWidth;

                requestAnimationFrame(function () {
                    content.style.transition = 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    content.style.opacity = '1';
                    content.style.transform = 'translateY(0) scale(1)';
                });
            }
        },

        animateOut: function (modal, callback) {
            const content = modal.querySelector('.modal-content');
            if (content) {
                content.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
                content.style.opacity = '0';
                content.style.transform = 'translateY(20px) scale(0.97)';

                setTimeout(function () {
                    if (callback) callback();
                }, 250);
            } else if (callback) {
                callback();
            }
        }
    };

    const FocusTrap = {
        _focusableElements: 'button, input, [tabindex]:not([tabindex="-1"])',

        trap: function (modal) {
            const focusable = modal.querySelectorAll(this._focusableElements);
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (first) first.focus();

            modal.addEventListener('keydown', function handler(e) {
                if (e.key === 'Tab') {
                    if (e.shiftKey && document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    } else if (!e.shiftKey && document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
                modal._focusHandler = handler;
            });
        },

        release: function (modal) {
            if (modal && modal._focusHandler) {
                modal.removeEventListener('keydown', modal._focusHandler);
            }
        }
    };

    function openModalEnhanced(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        ScrollLock.lock();
        modal.classList.add('active');
        modal.style.display = 'flex';
        ModalTransitions.animateIn(modal);
        FocusTrap.trap(modal);
        window.WHTZ._currentModal = modal;
    }

    function closeModalEnhanced() {
        const modal = window.WHTZ._currentModal;
        if (!modal) return;

        FocusTrap.release(modal);

        ModalTransitions.animateOut(modal, function () {
            modal.classList.remove('active');
            modal.style.display = '';

            const content = modal.querySelector('.modal-content');
            if (content) {
                content.style.opacity = '';
                content.style.transform = '';
                content.style.transition = '';
            }

            ScrollLock.unlock();
            window.WHTZ._currentModal = null;
        });
    }

    document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
        overlay.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            if (window.WHTZ._currentModal === overlay) {
                closeModalEnhanced();
            }
        });
    });

    window.WHTZ = window.WHTZ || {};
    window.WHTZ.openModal = openModalEnhanced;
    window.WHTZ.closeModalEnhanced = closeModalEnhanced;

})();