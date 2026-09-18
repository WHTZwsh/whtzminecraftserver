(function () {
    'use strict';

    const copyButtons = document.querySelectorAll('.copy-btn');
    const copyToast = document.getElementById('copyToast');

    let toastTimeout = null;

    async function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (err) {
                console.warn('Clipboard API failed, trying fallback:', err);
                return fallbackCopy(text);
            }
        }
        return fallbackCopy(text);
    }

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';

        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);

        let success = false;
        try {
            success = document.execCommand('copy');
        } catch (err) {
            console.error('Fallback copy failed:', err);
            success = false;
        }

        document.body.removeChild(textarea);
        return success;
    }

    function showToast() {
        if (!copyToast) return;

        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }

        copyToast.classList.remove('show');
        void copyToast.offsetWidth;

        copyToast.classList.add('show');

        toastTimeout = setTimeout(function () {
            copyToast.classList.remove('show');
        }, 2000);
    }

    function showCopiedFeedback(btn) {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span class="copy-icon">✓</span> Copied!';
        btn.style.background = 'var(--mc-dark-green)';

        setTimeout(function () {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
        }, 1500);
    }

    copyButtons.forEach(function (btn) {
        btn.addEventListener('click', async function () {
            const targetId = btn.getAttribute('data-copy');
            const targetInput = document.getElementById(targetId);

            if (!targetInput) {
                console.error('Copy target not found:', targetId);
                return;
            }

            const textToCopy = targetInput.value;

            targetInput.select();
            targetInput.setSelectionRange(0, textToCopy.length);

            const success = await copyToClipboard(textToCopy);

            if (success) {
                showToast();
                showCopiedFeedback(btn);
            } else {
                console.warn('Automatic copy failed. Text is selected for manual copy.');
            }
        });
    });

    document.querySelectorAll('.copy-group input').forEach(function (input) {
        input.addEventListener('keydown', function (e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                setTimeout(function () {
                    showToast();
                }, 100);
            }
        });
    });

    window.WHTZ = window.WHTZ || {};
    window.WHTZ.copyToClipboard = copyToClipboard;

})();