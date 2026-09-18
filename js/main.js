(function(){
    'use strict';

    var addBtn = document.getElementById('addServerBtn');
    var helpBtn = document.getElementById('helpBtn');
    var addModal = document.getElementById('addServerModal');
    var helpModal = document.getElementById('helpModal');
    var closeAdd = document.getElementById('closeAddServer');
    var closeHelp = document.getElementById('closeHelp');
    var toast = document.getElementById('copyToast');
    var activeModal = null;
    var toastTimer = null;

    function openModal(modal){
        if(!modal) return;
        modal.classList.add('active');
        activeModal = modal;
        document.body.classList.add('modal-open');
        trapFocus(modal);
        var first = modal.querySelector('input, button');
        if(first) first.focus();
    }

    function closeModal(){
        if(!activeModal) return;
        activeModal.classList.remove('active');
        activeModal = null;
        document.body.classList.remove('modal-open');
    }

    if(addBtn) addBtn.addEventListener('click', function(){ openModal(addModal); });
    if(helpBtn) helpBtn.addEventListener('click', function(){ openModal(helpModal); });
    if(closeAdd) closeAdd.addEventListener('click', closeModal);
    if(closeHelp) closeHelp.addEventListener('click', closeModal);

    document.querySelectorAll('.modal-mask').forEach(function(mask){
        mask.addEventListener('click', function(e){
            if(e.target === mask) closeModal();
        });
    });

    document.addEventListener('keydown', function(e){
        if(e.key === 'Escape' && activeModal) closeModal();
        if(e.key === 'Tab' && activeModal) handleTab(activeModal, e);
    });

    function trapFocus(modal){
        var focusable = modal.querySelectorAll('input, button');
        if(focusable.length){
            modal._first = focusable[0];
            modal._last = focusable[focusable.length - 1];
        }
    }

    function handleTab(modal, e){
        if(e.shiftKey && document.activeElement === modal._first){
            e.preventDefault();
            modal._last.focus();
        } else if(!e.shiftKey && document.activeElement === modal._last){
            e.preventDefault();
            modal._first.focus();
        }
    }

    function copyText(text, btn){
        var done = function(){
            showToast();
            var old = btn.innerHTML;
            btn.innerHTML = '✓ Copied';
            btn.style.background = '#1faa6b';
            btn.style.color = '#fff';
            setTimeout(function(){
                btn.innerHTML = old;
                btn.style.background = '';
                btn.style.color = '';
            }, 1400);
        };

        if(navigator.clipboard && navigator.clipboard.writeText){
            navigator.clipboard.writeText(text).then(done, function(){ fallback(text, done); });
        } else {
            fallback(text, done);
        }
    }

    function fallback(text, cb){
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try{ document.execCommand('copy'); cb(); }
        catch(err){ console.warn('copy failed', err); }
        document.body.removeChild(ta);
    }

    function showToast(){
        if(toastTimer) clearTimeout(toastTimer);
        toast.classList.remove('show');
        void toast.offsetWidth;
        toast.classList.add('show');
        toastTimer = setTimeout(function(){ toast.classList.remove('show'); }, 1800);
    }

    document.querySelectorAll('.input-group input').forEach(function(input){
        input.addEventListener('focus', function(){ input.select(); });
    });

    document.querySelectorAll('[data-copy]').forEach(function(btn){
        btn.addEventListener('click', function(){
            var target = document.getElementById(btn.getAttribute('data-copy'));
            if(target) copyText(target.value, btn);
        });
    });

    var counted = false;
    function countUp(el, target){
        var cur = 0;
        var step = Math.max(1, Math.ceil(target / 40));
        var timer = setInterval(function(){
            cur += step;
            if(cur >= target){
                cur = target;
                clearInterval(timer);
            }
            el.textContent = cur;
        }, 28);
    }

    var stats = document.querySelectorAll('.stat b[data-count]');
    if('IntersectionObserver' in window && stats.length){
        var io = new IntersectionObserver(function(entries){
            entries.forEach(function(en){
                if(en.isIntersecting && !counted){
                    counted = true;
                    stats.forEach(function(el){
                        countUp(el, parseInt(el.getAttribute('data-count'), 10));
                    });
                }
            });
        }, { threshold: .5 });
        io.observe(stats[0]);
    } else if(stats.length){
        stats.forEach(function(el){ el.textContent = el.getAttribute('data-count'); });
    }

})();