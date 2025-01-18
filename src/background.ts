chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
});

function injectContentScript(tabId: number) {
    chrome.scripting.executeScript(
        {
            target: { tabId: tabId },
            files: ["content.js"],
        },
        () => {
            if (chrome.runtime.lastError) {
                console.error("Error injecting content script:", chrome.runtime.lastError.message);
            } else {
                console.log("Content script injected successfully");
            }
        },
    );
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (
        changeInfo.status === "complete" &&
        tab.url &&
        (tab.url.includes("x.com") || tab.url.includes("twitter.com"))
    ) {
        injectContentScript(tabId);
    }
});
