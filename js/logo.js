(function(){
    'use strict';

    var mark = document.getElementById('logoMark');
    if(!mark) return;

    var R = '<svg viewBox="0 0 40 96" width="22" height="52" aria-hidden="true" focusable="false"><path d="M26 6 C14 14 10 28 10 48 C10 68 14 82 26 90" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round"/></svg>';

    var W = '<svg viewBox="0 0 96 96" width="52" height="52" aria-hidden="true" focusable="false"><path d="M8 16 L8 78 L26 78 L32 36 L44 78 L56 36 L62 78 L80 78 L80 16 L66 16 L60 60 L49 22 L36 60 L30 22 L36 22 L36 16 Z" fill="currentColor"/></svg>';

    var H = '<svg viewBox="0 0 96 96" width="52" height="52" aria-hidden="true" focusable="false"><path d="M8 16 L8 78 L24 78 L24 52 L72 52 L72 78 L88 78 L88 16 L72 16 L72 40 L24 40 L24 16 Z" fill="currentColor"/></svg>';

    var T = '<svg viewBox="0 0 96 96" width="52" height="52" aria-hidden="true" focusable="false"><path d="M6 16 L90 16 L90 32 L58 32 L58 78 L42 78 L42 32 L6 32 Z" fill="currentColor"/></svg>';

    var slash = '<span class="slash" aria-hidden="true">/</span>';

    var stack = '<span class="stack" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>';

    var Z = '<svg viewBox="0 0 96 96" width="52" height="52" aria-hidden="true" focusable="false"><path d="M10 18 L86 18 L86 34 L40 62 L86 62 L86 78 L10 78 L10 62 L56 34 L10 34 Z" fill="currentColor"/></svg>';

    var cup = '<span class="cup" aria-hidden="true"><i></i><b></b></span>';

    var dot = '<span class="antenna" aria-hidden="true"><i></i><i></i></span>';

    var ghost = '<span class="ghost" aria-hidden="true"><span class="ghost-body"><i></i><i></i><b></b><u></u></span></span>';

    var r = '<span class="reg" aria-hidden="true">®</span>';

    mark.innerHTML = R + W + H + T + slash + stack + Z + cup + dot + ghost + r;
    mark.setAttribute('role', 'img');
    mark.setAttribute('aria-label', 'WHTZ logo');

})();
