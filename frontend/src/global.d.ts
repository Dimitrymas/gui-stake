declare global {
    interface Window {
        requestQrCode: () => Promise<string>;
        updateQrCode?: (data: string) => void;
        requestAvatar: () => Promise<string>;
        requestUsername: () => Promise<string>;
        requestLogout: () => Promise<void>;
    }
}

export {};