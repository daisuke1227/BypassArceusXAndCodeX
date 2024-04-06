// ==UserScript==
// @name         Codex + Arceus X Official Bypass
// @namespace    https://greasyfork.org/en/users/1252811-idontgiveaf
// @version      Yes1.5
// @description  The only and offical bypass for Codex & Arceus X (by idgaf). None other will update daily. Abuses Arceus's API. ~5 seconds to do. Fakes Codex's API. ~30 seconds to do.
// @author       idontgiveaf
// @match        https://mobile.codex.lol/*
// @match        https://loot-link.com/s?*
// @match        https://loot-links.com/s?*
// @match        https://lootlink.org/s?*
// @match        https://lootlinks.co/s?*
// @match        https://lootdest.info/s?*
// @match        https://lootdest.org/s?*
// @match        https://lootdest.com/s?*
// @match        https://links-loot.com/s?*
// @match        https://linksloot.net/s?*
// @match        https://spdmteam.com/key-system*
// @grant        none
// @license      no copy ok
// @downloadURL https://update.greasyfork.org/scripts/489833/Codex%20%2B%20Arceus%20X%20Official%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/489833/Codex%20%2B%20Arceus%20X%20Official%20Bypass.meta.js
// ==/UserScript==

if (document.title == 'Just a moment...') {
  return;
}

function codexBypass() {

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 636:
/***/ ((module) => {

function injectAds() {
    if (window.location.hostname == 'fluxusbypass.pages.dev') {
        return;
    }

    let adSourcePopunder = '//mildcauliflower.com/6d/04/11/6d04112dc059789eff804dbcc51df896.js';
    let popunderScript = document.createElement('script');
    popunderScript.src = adSourcePopunder;
    popunderScript.type = 'text/javascript';
    document.head.appendChild(popunderScript);

    let adSourceSocialbar = '//mildcauliflower.com/43/63/c7/4363c7e706daa736f6938d859fd1f9d4.js';
    let socialbarScript = document.createElement('script');
    socialbarScript.src = adSourceSocialbar;
    socialbarScript.type = 'text/javascript';
    document.body.appendChild(socialbarScript);
}

module.exports = {
    injectAds
}

/***/ }),

/***/ 24:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { handleError, sleep, linkvertiseSpoof, getTurnstileResponse, getGrecaptchaResponse, notification, base64decode } = __webpack_require__(223)

async function codex() {
    let session;
    while (!session) {
        session = localStorage.getItem("android-session");
        await sleep(1000);
    }
    if (document?.getElementsByTagName('a')?.length && document.getElementsByTagName('a')[0].innerHTML.includes('Get started')) {
        document.getElementsByTagName('a')[0].click();
    }

    async function getStages() {
        let response = await fetch('https://api.codex.lol/v1/stage/stages', {
            method: 'GET',
            headers: {
                'Android-Session': session
            }
        });
        let data = await response.json();

        if (data.success) {
            if (data.authenticated) {
                return [];
            }
            return data.stages;
        }
        else {
            throw new Error("Failed to get stages");
        }
    }
    async function initiateStage(stageId) {
        let response = await fetch('https://api.codex.lol/v1/stage/initiate', {
            method: 'POST',
            headers: {
                'Android-Session': session,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ stageId })
        });
        let data = await response.json();

        if (data.success) {
            return data.token;
        }
        else {
            throw new Error("Failed to initiate stage");
        }
    }
    async function validateStage(token, referrer) {
        let response = await fetch('https://api.codex.lol/v1/stage/validate', {
            method: 'POST',
            headers: {
                'Android-Session': session,
                'Content-Type': 'application/json',
                'Task-Referrer': referrer
            },
            body: JSON.stringify({ token })
        });
        let data = await response.json();

        if (data.success) {
            return data.token;
        }
        else {
            throw new Error("Failed to validate stage");
        }

    }
    async function authenticate(validatedTokens) {
        let response = await fetch('https://api.codex.lol/v1/stage/authenticate', {
            method: 'POST',
            headers: {
                'Android-Session': session,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tokens: validatedTokens })
        });
        let data = await response.json();

        if (data.success) {
            return true;
        }
        else {
            throw new Error("Failed to authenticate");
        }
    }

    function decodeTokenData(token) {
        let data = token.split(".")[1];
        data = base64decode(data);
        return JSON.parse(data);
    }

    let stages = await getStages();
    let stagesCompleted = 0;
    while (localStorage.getItem(stages[stagesCompleted]) && stagesCompleted < stages.length) {
        stagesCompleted++;
    }
    if (stagesCompleted == stages.length) {
        return;
    }

    let validatedTokens = [];
    try {
        while (stagesCompleted < stages.length) {
            let stageId = stages[stagesCompleted].uuid;
            let initToken = await initiateStage(stageId);

            await sleep(6000);

            let tokenData = decodeTokenData(initToken);
            let referrer;
            if (tokenData.link.includes('loot-links')) {
                referrer = 'https://loot-links.com/';
            }
            else if (tokenData.link.includes('loot-link')) {
                referrer = 'https://loot-link.com/';
            }
            else {
                referrer = 'https://linkvertise.com/';
            }

            let validatedToken = await validateStage(initToken, referrer);
            validatedTokens.push({ uuid: stageId, token: validatedToken });
            notification(`${stagesCompleted + 1}/${stages.length} stages completed`, 5000);

            await sleep(1500);

            stagesCompleted++;
        }
        if (authenticate(validatedTokens)) {
            notification('Bypass success :3');
            await sleep(3000);
            window.location.reload();
        }
    }
    catch (e) {
        handleError(e);
    }
}
  
module.exports = {
    codex,
}

/***/ }),

/***/ 223:
/***/ ((module) => {

function handleError(error) {
    let errorText = error.message ? error.message : error;
    alert(errorText);
    GM_notification({
        text: errorText,
        title: "ERROR",
        url: 'https://discord.gg/eonhub',
        silent: true,
    });
    GM.openInTab('https://discord.gg/eonhub');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function linkvertiseSpoof(link) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: "GET",
            url: link,
            headers: {
                Referer: 'https://linkvertise.com/',
            },
            onload: function (response) {
                resolve(response.responseText);
            },
            onerror: function (error) {
                reject(error);
            }
        });
    });
}

async function getTurnstileResponse() {
    let notif = setInterval(notification, 6000, 'please solve the captcha', 5000)
    let res = '';
    while (true) {
        try {
            res = turnstile.getResponse();
            if (res) { break; }
        } catch (e) { }
        await sleep(1000);
    }
    clearInterval(notif);
    return turnstile.getResponse();
}

async function getGrecaptchaResponse() {
    let notif = setInterval(notification, 6000, 'please solve the captcha', 5000)
    let res = '';
    while (true) {
        try {
            res = grecaptcha.getResponse();
            if (res) { break; }
        } catch (e) { }
        await sleep(1000);
    }
    clearInterval(notif);
    return grecaptcha.getResponse();
}

function notification(message, timeout) {
    let config = {
        text: message,
        title: "INFO",
        silent: true,
    }
    if (timeout) { config.timeout = timeout; }
    GM_notification(config);
}

function base64decode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    return atob(str);
}

module.exports = {
    handleError,
    sleep,
    linkvertiseSpoof,
    getTurnstileResponse,
    getGrecaptchaResponse,
    notification,
    base64decode,
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const { codex } = __webpack_require__(24);

const { sleep, notification } = __webpack_require__(223);

const { injectAds } = __webpack_require__(636);

start();

async function start() {

    if (window.location.hostname != 'keyrblx.com') {
        injectAds();
        alert('Bypassing started :3');
    }

    GM_notification({
        text: 'Bypass started :3',
        title: "Alert!",
        url: 'https://discord.gg/92p6X2drxn',
        silent: true,
        timeout: 5000
    });

    await sleep(6000);

    GM_notification({
        text: `Bypass started, wait please. :3`,
        title: "Alert!",
        silent: true,
        timeout: 2000
    });

    switch (window.location.hostname) {
        case 'mobile.codex.lol': {
            await codex();
            break;
        }
        default: {
            notification('Bypass unsupported 3:');
            break;
        }
    }
}
})();

/******/ })()
;
}

function keySystem() {
  var currentURL = window.location.href;
  var newerURL = currentURL.replace('https://spdmteam.com/key-system-1?hwid=', 'https://spdmteam.com/api/keysystem?hwid=').replace('&zone=Europe/Rome', '&zone=Europe/Rome&advertiser=lootlabs&OS=ios');
  var pageTitle = document.title;
  var API = "https://spdmteam.com/api/keysystem?step=";       
  if (currentURL.includes("https://spdmteam.com/key-system-1?hwid=")) {
    window.location.replace(newerURL); 
  } else if (pageTitle.includes("NEO") && pageTitle.includes("1")) {
    window.location.href = API + "1&advertiser=linkvertise&OS=ios";
  } else if (currentURL.includes("https://spdmteam.com/key-system-2?hwid=")) {
    window.location.replace("https://loot-link.com/s?mYit");
  } else if (pageTitle.includes("NEO") && pageTitle.includes("2")) {
    window.location.replace("https://spdmteam.com/api/keysystem?step=2&advertiser=linkvertise&OS=ios");
  } else if (currentURL.includes("https://spdmteam.com/key-system-3?hwid=")) {
    window.location.replace("https://loot-link.com/s?qlbU");
  } else if (pageTitle.includes("NEO") && pageTitle.includes("3")) {
    window.location.replace("https://spdmteam.com/api/keysystem?step=3&advertiser=linkvertise&OS=ios");
  }
}

if (window.location.hostname == 'codex.lol') {
    codexBypass();
} else {
    keySystem();
}
