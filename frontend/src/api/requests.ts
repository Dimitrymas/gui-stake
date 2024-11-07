export type CreateAccountRequest = {
    name: string; // Обязательно
    token: string; // Обязательно
    proxyType?: string; // Должно быть либо "http", либо "socks5", если указано
    proxyLogin?: string; // Обязательно, если указан ProxyType
    proxyPass?: string; // Обязательно, если указан ProxyLogin
    proxyIP?: string; // Должен быть валидным публичным IP-адресом, если указан порт
    proxyPort?: string; // Валидный порт, если указан IP
}

export type DeleteAccountRequest = {
    id: string; // Обязательно
}

export type DeleteManyAccountsRequest = {
    ids: string[]; // Обязательно
}

export type PatchAccountRequest = CreateAccountRequest & {
    id: string; // Обязательно
}