(function(){
    'use strict';

    var supportsPassive = (function(){
        var ok = false;
        try{
            var opts = Object.defineProperty({}, 'passive', {
                get: function(){ ok = true; }
            });
            window.addEventListener('test', null, opts);
        }catch(e){}
        return ok;
    })();
    var popt = supportsPassive ? { passive: true } : false;

    var addBtn = document.getElementById('addServerBtn');
    var helpBtn = document.getElementById('helpBtn');
    var addModal = document.getElementById('addServerModal');
    var helpModal = document.getElementById('helpModal');
    var closeAdd = document.getElementById('closeAddServer');
    var closeHelp = document.getElementById('closeHelp');
    var toast = document.getElementById('copyToast');
    var copyBtns = document.querySelectorAll('[data-copy]');
    var activeModal = null;
    var toastTimer = null;
    var lastFocus = null;
    var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function openModal(modal){
        if(!modal || activeModal) return;
        lastFocus = document.activeElement;
        activeModal = modal;
        modal.classList.add('active');
        document.documentElement.classList.add('modal-open');
        var focusables = modal.querySelectorAll('input, button, [tabindex]:not([tabindex="-1"])');
        modal._first = focusables[0] || null;
        modal._last = focusables[focusables.length - 1] || null;
        var target = modal._first || modal;
        if(target.focus){ window.setTimeout(function(){ target.focus(); }, 0); }
    }

    function closeModal(){
        if(!activeModal) return;
        var m = activeModal;
        m.classList.remove('active');
        activeModal = null;
        document.documentElement.classList.remove('modal-open');
        if(lastFocus && lastFocus.focus){
            window.setTimeout(function(){ lastFocus.focus(); }, 0);
        }
    }

    if(addBtn) addBtn.addEventListener('click', function(){ openModal(addModal); }, false);
    if(helpBtn) helpBtn.addEventListener('click', function(){ openModal(helpModal); }, false);
    if(closeAdd) closeAdd.addEventListener('click', closeModal, false);
    if(closeHelp) closeHelp.addEventListener('click', closeModal, false);

    document.querySelectorAll('.modal-mask').forEach(function(mask){
        mask.addEventListener('click', function(e){
            if(e.target === mask) closeModal();
        }, false);
    });

    document.addEventListener('keydown', function(e){
        if(e.key === 'Escape' && activeModal){ closeModal(); return; }
        if(e.key === 'Tab' && activeModal){ handleTab(activeModal, e); }
    }, false);

    function handleTab(modal, e){
        var first = modal._first, last = modal._last;
        if(!first || !last) return;
        if(e.shiftKey && document.activeElement === first){
            e.preventDefault();
            last.focus();
        } else if(!e.shiftKey && document.activeElement === last){
            e.preventDefault();
            first.focus();
        }
    }

    function copyText(text, btn){
        var onSuccess = function(){
            flashBtn(btn);
            showToast();
        };
        if(navigator.clipboard && navigator.clipboard.writeText){
            var p = navigator.clipboard.writeText(text);
            if(p && p.then){ p.then(onSuccess, function(){ fallback(text, onSuccess); }); }
            else { fallback(text, onSuccess); }
        } else {
            fallback(text, onSuccess);
        }
    }

    function fallback(text, cb){
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.setAttribute('aria-hidden', 'true');
        ta.style.position = 'fixed';
        ta.style.top = '0';
        ta.style.left = '-9999px';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.setSelectionRange(0, text.length);
        var ok = false;
        try{
            ok = document.execCommand('copy');
            if(ok && cb) cb();
        }catch(err){
            if(cb) cb();
        }
        document.body.removeChild(ta);
    }

    function flashBtn(btn){
        var oldHTML = btn.innerHTML;
        var oldBg = btn.style.background;
        var oldColor = btn.style.color;
        btn.innerHTML = 'Copied';
        btn.setAttribute('data-done', 'true');
        window.setTimeout(function(){
            btn.innerHTML = oldHTML;
            btn.removeAttribute('data-done');
            btn.style.background = oldBg;
            btn.style.color = oldColor;
        }, 1400);
    }

    function showToast(){
        if(!toast) return;
        if(toastTimer){ window.clearTimeout(toastTimer); toastTimer = null; }
        toast.classList.remove('show');
        void toast.offsetWidth;
        toast.classList.add('show');
        toastTimer = window.setTimeout(function(){ toast.classList.remove('show'); toastTimer = null; }, 1800);
    }

    document.querySelectorAll('.input-group input').forEach(function(input){
        input.addEventListener('focus', function(){ input.select(); }, false);
    });

    document.querySelectorAll('[data-copy]').forEach(function(btn){
        btn.addEventListener('click', function(e){
            e.preventDefault();
            var id = btn.getAttribute('data-copy');
            var target = id ? document.getElementById(id) : null;
            var val = target ? target.value : '';
            if(!val){ return; }
            copyText(val, btn);
        }, false);
    });

    var counted = false;
    function countUp(el, target){
        var cur = 0;
        var step = Math.max(1, Math.ceil(target / 32));
        var timer = window.setInterval(function(){
            cur += step;
            if(cur >= target){
                cur = target;
                window.clearInterval(timer);
            }
            el.textContent = cur;
        }, 30);
    }

    var stats = document.querySelectorAll('.stat b[data-count]');
    if('IntersectionObserver' in window && stats.length){
        var io = new IntersectionObserver(function(entries){
            for(var i = 0; i < entries.length; i++){
                if(entries[i].isIntersecting && !counted){
                    counted = true;
                    for(var j = 0; j < stats.length; j++){
                        countUp(stats[j], parseInt(stats[j].getAttribute('data-count'), 10) || 0);
                    }
                    io.disconnect();
                    break;
                }
            }
        }, { threshold: 0.5 });
        io.observe(stats[0]);
    } else if(stats.length){
        for(var j = 0; j < stats.length; j++){
            stats[j].textContent = stats[j].getAttribute('data-count') || '0';
        }
    }

})();