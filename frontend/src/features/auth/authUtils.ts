export const saveToken = (token: string | undefined) => {
    localStorage.setItem('token', token || '');
}

export const getToken = (): string | undefined => {
    return localStorage.getItem('token') || undefined;
}

export const getPublicKey = (): string | undefined => {
    return localStorage.getItem('publicKey') || undefined;
}

export const savePublicKey = (publicKey: string | undefined) => {
    localStorage.setItem('publicKey', publicKey || '');
}
