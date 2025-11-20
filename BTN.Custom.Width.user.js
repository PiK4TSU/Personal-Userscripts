// ==UserScript==
// @name         BTN Custom Width
// @namespace    https://broadcasthe.net/
// @version      420
// @author       KatSu
// @description  Apply custom max-width (1920px) for #wrapper on wide screens (≥1236px). Works with BTN Future CSS.
// @match        https://broadcasthe.net/*
// @icon         https://broadcasthe.net/favicon.ico
// @run-at       document-start
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    // Media query: only apply when viewport ≥ 1236px
    const css = `
@media (min-width: 1236px) {
    #wrapper {
        max-width: 1920px !important;
        margin-left: auto !important;
        margin-right: auto !important;
    }
}
    `.trim();

    GM_addStyle(css);
})();
