declare global {
    export interface TwitterButton {
        id: string;
        label: string;
        ariaLabel: string;
        selector?: string;
    }

    export interface RightSidebarElement {
        id: string;
        label: string;
        category: string;
    }

    export interface Settings {
        isEnabled: boolean;
        hiddenButtons: string[];
        hiddenRightElements: string[];
        removeGrokSuggestions: boolean;
    }

    interface Window {
        chrome: typeof chrome;
    }
}

export {};
