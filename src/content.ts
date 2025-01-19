import { TWITTER_BUTTONS } from "./utils";
import browser from "webextension-polyfill";


function getElementForButton(button: TwitterButton): Element | null {
  if (button.selector) {
    return document.querySelector(button.selector);
  }
  const ariaLabel = button.ariaLabel || button.label;
  const regex = new RegExp(`^${ariaLabel}`);
  return (
    Array.from(document.querySelectorAll("a")).find((el) =>
      regex.test(el.getAttribute("aria-label") || "")
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
  browser.runtime.onMessage.addListener(
    (
      message: unknown,
      _sender: browser.Runtime.MessageSender,
      sendResponse: (response?: unknown) => void
    ): true | Promise<void> | undefined => {
      console.log("Received message in content script:", message);
      if (typeof message === 'object' && message !== null && 'type' in message) {
        const request = message as { type: string } & Partial<Settings>;
        if (request.type === "TOGGLE_BUTTONS") {
          applySettings({
            isEnabled: request.isEnabled ?? false,
            hiddenButtons: request.hiddenButtons ?? [],
          });
          sendResponse({ success: true });
          return true; 
        }
      }
    }
  );

  browser.storage.sync
    .get(["isEnabled", "hiddenButtons"])
    .then((result: Partial<Settings>) => {
      applySettings({
        isEnabled: result.isEnabled ?? false,
        hiddenButtons: result.hiddenButtons ?? [],
      });
    });

  const observer = new MutationObserver(() => {
    browser.storage.sync
      .get(["isEnabled", "hiddenButtons"])
      .then((result: Partial<Settings>) => {
        applySettings({
          isEnabled: result.isEnabled ?? false,
          hiddenButtons: result.hiddenButtons ?? [],
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
