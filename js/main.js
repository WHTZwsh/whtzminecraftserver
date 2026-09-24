/*
 * WHTZ logo loader
 * 1. 加载 logo.png（优先），找不到自动尝试 logo.svg / logo.jpg / logo.webp
 *    以及 assets/logo.png、assets/logo.svg
 * 2. 也可以在 <img> 上写 data-logo="/cdn/logo.png" 指定任意地址
 * 3. 加载失败时显示旁边的文字回退（.logo-fallback）
 */
(function(){
    'use strict';

    var img = document.getElementById('logoImg');
    if(!img){ return; }

    var list = ['logo.png', 'logo.svg', 'logo.jpg', 'logo.webp',
                'assets/logo.png', 'assets/logo.svg'];

    var seed = img.getAttribute('data-logo') || '';
    if(seed && list.indexOf(seed) === -1){
        list.unshift(seed);
    }

    var step = 1;
    var onLoad = function(){
        img.removeAttribute('hidden');
        img.style.display = '';
        var fb = document.getElementById('logoFallback');
        if(fb){ fb.style.display = 'none'; }
    };
    var onError = function(){
        if(step < list.length){
            img.src = list[step];
            step += 1;
        } else {
            img.style.display = 'none';
        }
    };

    img.addEventListener('load', onLoad, false);
    img.addEventListener('error', onError, false);

    if(img.complete && img.naturalWidth > 0){
        onLoad();
    } else if(!img.getAttribute('src')){
        img.src = list[0];
    }
})();
