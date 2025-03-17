document.addEventListener("DOMContentLoaded", () => {
    const toggleRcmndsBtn = document.getElementById("toggleRecommendationsBtn");
    const toggleCommentsBtn = document.getElementById("toggleCommentsBtn");
    const toggleBlurBtn = document.getElementById("toggleBlurBtn");


    chrome.storage.local.get(["hideRecommendations", "hideComments", "toggleBlurBtn"], (data) => {
        const isHidden = data.hideRecommendations ?? true;
        const areCommentsHidden = data.hideComments ?? false;

        toggleRcmndsBtn.textContent = isHidden
            ? "Enable Recommendations"
            : "Disable Recommendations";

        toggleCommentsBtn.textContent = areCommentsHidden
            ? "Enable Comments"
            : "Disable Comments";
    })

    toggleRcmndsBtn.addEventListener("click", () => {
        chrome.storage.local.get("hideRecommendations", (data) => {
            const newState = !data.hideRecommendations;
            chrome.storage.local.set({ hideRecommendations: newState });

            // Update button text
            toggleRcmndsBtn.textContent = newState
                ? "Enable Recommendations"
                : "Disable Recommendations";


            chrome.tabs.query({ url: "*://www.youtube.com/*" },
                (tabs) => {
                    tabs.forEach(tab => {
                        chrome.tabs.sendMessage(tab.id,
                            {
                                action: "toggleRecommendations",
                                state: newState
                            }
                        );

                    })
                });
        });
    });


    // Toggle Comments
    toggleCommentsBtn.addEventListener("click", () => {
        chrome.storage.local.get("hideComments", (data) => {
            const newState = !data.hideComments;
            chrome.storage.local.set({ hideComments: newState });

            toggleCommentsBtn.textContent = newState ? "Enable Comments" : "Disable Comments";

            chrome.tabs.query({ url: "*://www.youtube.com/*" }, (tabs) => {
                tabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, { action: "toggleComments", state: newState });
                });
            });
        });
    });

    // Toggle Comments
    toggleBlurBtn.addEventListener("click", () => {
        chrome.tabs.query({ url: "*://www.youtube.com/*", active: true }, (tabs) => {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, { action: "toggleBlur" });
            });
        });
    });
})


