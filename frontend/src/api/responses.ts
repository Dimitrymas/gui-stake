export type AuthResponse = {
    token: string;
    sign: string;
    publicKey: string;
}

export type MeResponse = {
    id: string;
    subStart: string;
    subEnd: string;
    subActive: boolean;
    maxAccounts: number;
    sign: string;
}

export type MnemonicResponse = {
    mnemonic: string[];
}

type PromoCodeDto = {
    id: string;
    name: string;
    value: number;
    description: string;
    createdAt: string;
}

type ActivationDto = {
    id: string;
    promoCode: PromoCodeDto;
    succeeded: boolean;
    duration: number;
    error: string;
    createdAt: string;
}

export type AccountResponse = {
    id: string;
    name: string;
    token: string;
    proxyType: string;
    proxyLogin: string;
    proxyPass: string;
    proxyIP: string;
    proxyPort: string;
    proxy: string;
    lastActivation: null | ActivationDto;
    createdAt: string;
}


export type AccountsResponse = {
    accounts: AccountResponse[];
}

export type ChannelResponse = {
    id: string;
    name: string;
    succeeded: boolean;
    error: string;
    telegramID: string;
}

export type ChannelsResponse = {
    channels: ChannelResponse[];
}