const STYLE_ID = "hide-recommendations-style";
const COMMENT_STYLE_ID = "hide-comments-style";
const BLUR_STYLE_ID = "blure-video-style";

const URL_PATTERNS = [
    /^https:\/\/www\.youtube\.com\/$/,             // Home page
    /^https:\/\/www\.youtube\.com\/watch/,         // Video page
];


function shouldNotHide() {
    return !URL_PATTERNS.some(pattern => pattern.test(window.location.href));
}

// Function to toggle recommendations
function tryToggleRecommendations(hide) {
    if (shouldNotHide()) {
        hide = false
    }

    let styleTag = document.getElementById(STYLE_ID);

    if (hide) {
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = STYLE_ID;
            styleTag.textContent = `
                #related, #secondary, #contents.ytd-rich-grid-renderer {
                    display: none !important;
                }
            `;
            document.head.appendChild(styleTag);
            enableTheaterMode();
        }
    } else {
        if (styleTag) {
            styleTag.remove();
        }
    }
}

// Function to enable Theater Mode
function enableTheaterMode() {
    const theaterButton = document.querySelector('button.ytp-size-button');

    if (theaterButton) {
        const isTheaterMode = document.querySelector('ytd-watch-flexy[theater]');

        if (!isTheaterMode) {
            theaterButton.click(); // Enable theater mode only if not active
        }
    }
}


// Function to toggle comments
function toggleComments(hide) {
    let styleTag = document.getElementById(COMMENT_STYLE_ID);

    if (hide) {
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = COMMENT_STYLE_ID;
            styleTag.textContent = `
                #comments {
                    display: none !important;
                }
            `;
            document.head.appendChild(styleTag);
        }
    } else {
        if (styleTag) {
            styleTag.remove();
        }
    }
}


window.__blureVideo = false;
function toggleBlur() {
    window.__blureVideo = !window.__blureVideo;
    let styleTag = document.getElementById(BLUR_STYLE_ID);

    if (window.__blureVideo) {
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = BLUR_STYLE_ID;
            styleTag.textContent = `
                video.video-stream.html5-main-video{
                    filter: blur(80px);
                }
            `;
            document.head.appendChild(styleTag);
        }
    } else {
        if (styleTag) {
            styleTag.remove();
        }
    }
}

// Load and apply initial state
chrome.storage.local.get(["hideRecommendations", "hideComments"], (data) => {
    tryToggleRecommendations(data.hideRecommendations ?? true);
    toggleComments(data.hideComments ?? false);
});

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "toggleRecommendations") {
        tryToggleRecommendations(request.state);
    }

    if (request.action === "toggleComments") {
        toggleComments(request.state);
    }

    if (request.action === "toggleBlur") {
        toggleBlur();
    }

});

// recommendations might hide subscription page, but I don't wan
const observer = new MutationObserver(() => {
    try {
        chrome.storage.local.get("hideRecommendations", (data) => {
            tryToggleRecommendations(data.hideRecommendations ?? true);
        });
    } catch (e) {
        console.warn("extention failed to act on mutatition");
    }
});

observer.observe(document.body, { childList: true, subtree: true });
