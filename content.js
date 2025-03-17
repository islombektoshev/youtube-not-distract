const STYLE_ID = "hide-recommendations-style";
const COMMENT_STYLE_ID = "hide-comments-style";


// Function to toggle recommendations
function toggleRecommendations(hide) {
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

// Load and apply initial state
chrome.storage.local.get(["hideRecommendations", "hideComments"], (data) => {
    toggleRecommendations(data.hideRecommendations ?? true);
    toggleComments(data.hideComments ?? false);
});

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "toggleRecommendations") {
        toggleRecommendations(request.state);
    }

    if (request.action === "toggleComments") {
        toggleComments(request.state);
    }
});

