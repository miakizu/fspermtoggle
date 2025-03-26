// ==UserScript==
// @name         Fullscreen Permission Prompt
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  prompts user for confirmation before allowing a website to enter fullscreen mode, comes with a "remember" option
// @author       YAKARY
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const storageKey = "allowedFullscreenSites";

    // Load allowed sites from localStorage
    function getAllowedSites() {
        return JSON.parse(localStorage.getItem(storageKey)) || [];
    }

    // Save allowed sites to localStorage
    function saveAllowedSite(site) {
        const sites = getAllowedSites();
        if (!sites.includes(site)) {
            sites.push(site);
            localStorage.setItem(storageKey, JSON.stringify(sites));
        }
    }

    // Check if a site is allowed
    function isSiteAllowed(site) {
        return getAllowedSites().includes(site);
    }

    // Store the original requestFullscreen function
    const originalRequestFullscreen = HTMLElement.prototype.requestFullscreen;

    // Override the requestFullscreen function
    HTMLElement.prototype.requestFullscreen = function() {
        const site = window.location.hostname;

        if (isSiteAllowed(site)) {
            originalRequestFullscreen.call(this);
            return;
        }

        const allowFullscreen = confirm(`This site wants to enter fullscreen mode. Allow?`);

        if (allowFullscreen) {
            const remember = confirm(`Remember this choice for ${site}?`);
            if (remember) {
                saveAllowedSite(site);
            }
            originalRequestFullscreen.call(this);
        }
    };
})();
