// ==UserScript==
// @name         BTN Show & Hide File list
// @version      2.0
// @description  Improves sites usability
// @author       KatSu
// @match        https://broadcasthe.net/*
// @grant        none
// ==/UserScript==
'use strict';

jQuery(document).ready(function(){
    var table = jQuery("#torrents .linkbox + div + table");
    table.hide();
    jQuery("<div class='head colhead_dark'><strong>File list</strong> <a style='cursor: pointer' class='swapfilelist'>(Show)</a></div>").insertBefore(table);
});
 
jQuery(".swapfilelist").click(function(){
        jQuery(this).parent().next().toggle();
})
