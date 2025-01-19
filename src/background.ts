import browser from "webextension-polyfill";

browser.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
});

function injectContentScript(tabId: number) {
    browser.scripting
        .executeScript({
            target: { tabId: tabId },
            files: ["content.js"],
        })
        .catch((err) => {
            console.error("Error injecting content script:", err);
        });
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (
        changeInfo.status === "complete" &&
        tab.url &&
        (tab.url.includes("x.com") || tab.url.includes("twitter.com"))
    ) {
        injectContentScript(tabId);
    }
});
