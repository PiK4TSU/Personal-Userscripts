// ==UserScript==
// @name         BTN External Tracker Search
// @namespace    http://tampermonkey.net/
// @version      0
// @description  Use IMDb ID if available, otherwise title+year – for ALL trackers
// @author       KatSu
// @match        https://broadcasthe.net/series.php?id=*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const headDiv = document.querySelector('.box > .head');
        if (!headDiv) {
            console.log('BTN Tracker: No .box > .head found — skipping');
            return;
        }

        let searchQuery = null;
        let isImdb = false;

        // 1. Try to get IMDb ID first
        const imdbLink = document.querySelector('a[href*="imdb.com/title/tt"]');
        if (imdbLink) {
            const match = imdbLink.href.match(/tt\d{7,8}/);
            if (match) {
                searchQuery = match[0];
                isImdb = true;
                console.log('BTN Tracker: Using IMDb ID:', searchQuery);
            } else {
                console.log('BTN Tracker: IMDb link found but no ttID match');
            }
        } else {
            console.log('BTN Tracker: No IMDb link found — trying title fallback');
        }

        // 2. Fallback: Extract title + year
        if (!searchQuery) {
            const titleStrong = headDiv.querySelector('strong');
            if (!titleStrong) {
                console.log('BTN Tracker: No <strong> in title — skipping');
                return;
            }
            let fullTitle = titleStrong.textContent.trim();
            console.log('BTN Tracker: Raw title:', fullTitle);

            // Extract year
            const yearMatch = fullTitle.match(/\b(19|20)\d{2}\b/);
            const year = yearMatch ? yearMatch[0] : '';

            // Clean title
            let cleanTitle = fullTitle
                .replace(/\s*\(.*\d{4}.*\)$/, '')
                .replace(/\s*\[.*\d{4}.*\]$/, '')
                .replace(/\s*[\u2013\u2014]\s*\d{4}.*$/, '')
                .replace(/\s+\d{4}.*$/, '')
                .trim();

            if (cleanTitle) {
                searchQuery = year ? `${cleanTitle} ${year}` : cleanTitle;
                console.log('BTN Tracker: Using title search:', searchQuery);
            } else {
                console.log('BTN Tracker: Could not clean title — skipping');
                return;
            }
        }

        if (!searchQuery) return;

        // 3. Build tracker URLs based on IMDb or Title
        const trackers = [
            {
                name: 'HDB',
                url: isImdb
                    ? `https://hdbits.org/browse.php?descriptions=0&imdb=${searchQuery}`
                    : `https://hdbits.org/browse.php?search=${encodeURIComponent(searchQuery)}`
            },
            {
                name: 'BHD',
                url: isImdb
                    ? `https://beyond-hd.me/torrents?search=&imdb=${searchQuery}`
                    : `https://beyond-hd.me/torrents?search=${encodeURIComponent(searchQuery)}`
            },
            {
                name: 'FL',
                url: `https://filelist.io/browse.php?search=${encodeURIComponent(searchQuery)}`
            },
            {
                name: 'Aither',
                url: isImdb
                    ? `https://aither.cc/torrents?perPage=25&imdbId=${searchQuery}`
                    : `https://aither.cc/torrents?name=${encodeURIComponent(searchQuery)}`
            },
            {
                name: 'FNP',
                url: isImdb
                    ? `https://fearnopeer.com/torrents?perPage=25&imdbId=${searchQuery}`
                    : `https://fearnopeer.com/torrents?name=${encodeURIComponent(searchQuery)}`
            }
        ];

        // 4. Create link bar (BTN style)
        const linkBar = document.createElement('div');
        linkBar.style.cssText = `
            text-align: center !important;
            margin-top: 8px !important;
            font-size: 11px !important;
            color: #cccccc !important;
            line-height: 1.4 !important;
        `;

        const label = document.createElement('strong');
        label.textContent = 'Search Trackers: ';
        linkBar.appendChild(label);

        trackers.forEach((t, i) => {
            const a = document.createElement('a');
            a.href = t.url;
            a.target = '_blank';
            a.textContent = t.name;
            a.title = t.name;
            a.style.cssText = `
                color: #88b3e0 !important;
                text-decoration: none !important;
                margin: 0 6px !important;
                font-weight: bold !important;
            `;
            a.onmouseover = () => a.style.textDecoration = 'underline';
            a.onmouseout = () => a.style.textDecoration = 'none';

            linkBar.appendChild(a);
            if (i < trackers.length - 1) {
                linkBar.appendChild(document.createTextNode('·'));
            }
        });

        // 5. Insert under title
        headDiv.parentNode.insertBefore(linkBar, headDiv.nextSibling);

        console.log(`BTN Tracker: Added ${trackers.length} links (${isImdb ? 'IMDb' : 'Title'} search: "${searchQuery}")`);
    });
})();
