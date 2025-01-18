declare global {
    interface TwitterButton {
        id: string;
        label: string;
        ariaLabel?: string;
        selector?: string;
    }

    interface Settings {
        isEnabled: boolean;
        hiddenButtons: string[];
    }

    interface Window {
        chrome: typeof chrome;
    }
}

export {};
