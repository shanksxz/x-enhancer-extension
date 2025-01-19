import browser from "webextension-polyfill";
import { RIGHT_SIDEBAR_ELEMENTS, TWITTER_BUTTONS } from "./utils";

function getElementForButton(button: TwitterButton): Element | null {
    if (button.selector) {
        return document.querySelector(button.selector);
    }
    const ariaLabel = button.ariaLabel || button.label;
    const regex = new RegExp(`^${ariaLabel}`);
    return (
        Array.from(document.querySelectorAll("a, button")).find((el) =>
            regex.test(el.getAttribute("aria-label") || ""),
        ) || null
    );
}

function getElementForRightSidebar(element: RightSidebarElement): Element | null {
    switch (element.id) {
        case "entire-sidebar":
            return document.querySelector('div[data-testid="sidebarColumn"]');
        case "premium-subscribe":
            return (
                document.querySelector('aside[aria-label="Subscribe to Premium"]')?.parentElement ||
                null
            );
        case "search":
            return (
                document.querySelector('div[data-testid="SearchBox_Search_Input_label"]')
                    ?.parentElement || null
            );
        case "trending":
            return (
                document.querySelector('div[aria-label="Timeline: Trending now"]')?.parentElement ||
                null
            );
        case "who-to-follow":
            return (
                document.querySelector('aside[aria-label="Who to follow"]')?.parentElement || null
            );
        default:
            return null;
    }
}

function toggleElementVisibility(element: Element | null, hide: boolean): void {
    if (element) {
        element.classList.toggle("x-enhancer-hidden", hide);
    }
}

function removeGrokSuggestions(): void {
    //TODO: Implement this function
}

function applySettings(settings: Settings): void {
    const {
        isEnabled,
        hiddenButtons,
        hiddenRightElements,
        removeGrokSuggestions: shouldRemoveGrok,
    } = settings;

    for (const button of TWITTER_BUTTONS) {
        const buttonElement = getElementForButton(button);
        if (!buttonElement) continue;
        const shouldHide = isEnabled && hiddenButtons.includes(button.id);
        toggleElementVisibility(buttonElement, shouldHide);
    }

    for (const element of RIGHT_SIDEBAR_ELEMENTS) {
        const sidebarElement = getElementForRightSidebar(element);
        if (!sidebarElement) continue;
        const shouldHide = isEnabled && hiddenRightElements.includes(element.id);
        toggleElementVisibility(sidebarElement, shouldHide);
    }

    if (isEnabled && shouldRemoveGrok) {
        removeGrokSuggestions();
    }

    console.log("Applied settings:", settings);
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
    browser.runtime.onMessage.addListener(
        (
            message: unknown,
            _sender: browser.Runtime.MessageSender,
            sendResponse: (response?: unknown) => void,
        ): true | Promise<void> | undefined => {
            console.log("Received message in content script:", message);
            if (typeof message === "object" && message !== null && "type" in message) {
                const request = message as { type: string } & Partial<Settings>;
                if (request.type === "TOGGLE_ELEMENTS") {
                    applySettings({
                        isEnabled: request.isEnabled ?? false,
                        hiddenButtons: request.hiddenButtons ?? [],
                        hiddenRightElements: request.hiddenRightElements ?? [],
                        removeGrokSuggestions: request.removeGrokSuggestions ?? false,
                    });
                    sendResponse({ success: true });
                    return true;
                }
            }
        },
    );

    browser.storage.sync
        .get(["isEnabled", "hiddenButtons", "hiddenRightElements", "removeGrokSuggestions"])
        .then((result: Partial<Settings>) => {
            applySettings({
                isEnabled: result.isEnabled ?? false,
                hiddenButtons: result.hiddenButtons ?? [],
                hiddenRightElements: result.hiddenRightElements ?? [],
                removeGrokSuggestions: result.removeGrokSuggestions ?? false,
            });
        });

    const observer = new MutationObserver(() => {
        browser.storage.sync
            .get(["isEnabled", "hiddenButtons", "hiddenRightElements", "removeGrokSuggestions"])
            .then((result: Partial<Settings>) => {
                applySettings({
                    isEnabled: result.isEnabled ?? false,
                    hiddenButtons: result.hiddenButtons ?? [],
                    hiddenRightElements: result.hiddenRightElements ?? [],
                    removeGrokSuggestions: result.removeGrokSuggestions ?? false,
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
