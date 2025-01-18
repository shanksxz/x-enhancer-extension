//?: had to explicitly declare twitter_buttons here as i can't use import statement in content script
const TWITTER_BUTTONS: TwitterButton[] = [
    { id: "home", label: "Home" },
    { id: "explore", label: "Explore", ariaLabel: "Search and explore" },
    { id: "notifications", label: "Notifications" },
    { id: "messages", label: "Messages", ariaLabel: "Direct Messages" },
    { id: "grok", label: "Grok" },
    { id: "lists", label: "Lists" },
    { id: "bookmarks", label: "Bookmarks" },
    { id: "jobs", label: "Jobs" },
    { id: "communities", label: "Communities" },
    { id: "premium", label: "Premium" },
    { id: "verified", label: "Verified Orgs" },
    { id: "profile", label: "Profile" },
    {
        id: "more",
        label: "More",
        selector: 'button[aria-label="More menu items"]',
    },
];

function getElementForButton(button: TwitterButton): Element | null {
    if (button.selector) {
        return document.querySelector(button.selector);
    }
    const ariaLabel = button.ariaLabel || button.label;
    const regex = new RegExp(`^${ariaLabel}`);
    return (
        Array.from(document.querySelectorAll("a")).find((el) =>
            regex.test(el.getAttribute("aria-label") || ""),
        ) || null
    );
}

function toggleButtonVisibility(buttonId: string, hide: boolean): void {
    const button = TWITTER_BUTTONS.find((b) => b.id === buttonId);
    if (button) {
        const element = getElementForButton(button);
        if (element) {
            element.classList.toggle("x-enhancer-hidden", hide);
        }
    }
}

function applySettings({ isEnabled, hiddenButtons }: Settings): void {
    for (const button of TWITTER_BUTTONS) {
        const shouldHide = isEnabled && hiddenButtons.includes(button.id);
        toggleButtonVisibility(button.id, shouldHide);
    }
    console.log("Applied settings:", { isEnabled, hiddenButtons });
}

function injectCSS(): void {
    const style = document.createElement("style");
    style.textContent = `
    .x-enhancer-hidden {
      display: none !important;
    }
  `;
    document.head.appendChild(style);
    console.log("Injected CSS");
}

function initContentScript(): void {
    chrome.runtime.onMessage.addListener((request, _sender, sendResponse): boolean => {
        console.log("Received message in content script:", request);
        if (request.type === "TOGGLE_BUTTONS") {
            applySettings(request);
            sendResponse({ success: true });
        }
        return true;
    });

    chrome.storage.sync.get(["isEnabled", "hiddenButtons"], (result) => {
        applySettings({
            isEnabled: result.isEnabled || false,
            hiddenButtons: result.hiddenButtons || [],
        });
    });

    const observer = new MutationObserver(() => {
        chrome.storage.sync.get(["isEnabled", "hiddenButtons"], (result) => {
            applySettings({
                isEnabled: result.isEnabled || false,
                hiddenButtons: result.hiddenButtons || [],
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    injectCSS();
    console.log("Content script initialization complete");
}

initContentScript();
