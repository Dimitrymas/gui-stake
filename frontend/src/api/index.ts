import axios from 'axios';
import {setupInterceptors} from "./interceptors.ts";
import {
    AccountResponse,
    AccountsResponse,
    AuthResponse,
    ChannelResponse,
    ChannelsResponse,
    MeResponse,
    MnemonicResponse
} from "./responses.ts";
import {CreateAccountRequest, PatchAccountRequest} from "./requests.ts";
import {AccountFormOnSubmit} from "../components/AccountForm";


const baseURL = import.meta.env.VITE_API_URL;
const api = axios.create({baseURL});
setupInterceptors(api);

export const requestLogin = async (mnemonic: string[]): Promise<AuthResponse> => {
    const {data}: { data: AuthResponse } = await api.post('/user/login', {mnemonic});
    return data as AuthResponse;
}

export const requestRegister = async (mnemonic: string[]): Promise<AuthResponse> => {
    const {data}: { data: AuthResponse } = await api.post('/user/register', {mnemonic});
    return data;
}

export const requestMe = async (): Promise<MeResponse> => {
    const {data}: { data: MeResponse } = await api.get('/user/me');
    return data;
}

export const requestMnemonic = async (): Promise<string[]> => {
    const {data: {mnemonic}}: {data: MnemonicResponse} = await api.get('/user/mnemonic');
    return mnemonic;
}

export const requestAccounts = async (): Promise<AccountResponse[]> => {
    const {data: {accounts}}: {data: AccountsResponse} = await api.get('/accounts/');
    return accounts
}

export const requestCreateAccount = async (data: AccountFormOnSubmit) => {
    const requestData: CreateAccountRequest = {
        name: data.name,
        token: data.token,
        proxyType: data.proxyType,
        proxyLogin: data.proxyLogin,
        proxyPass: data.proxyPass,
        proxyIP: data.proxyIp,
        proxyPort: data.proxyPort,
    }

    await api.post('/accounts/', requestData);
}

export const requestDeleteManyAccounts = async (ids: string[]) => {
    await api.delete('/accounts/bulk', {data: {ids}});
}

export const requestPatchAccount = async (data: AccountFormOnSubmit & { id: string }) => {
    const requestData: PatchAccountRequest = {
        id: data.id,
        name: data.name,
        token: data.token,
        proxyType: data.proxyType,
        proxyLogin: data.proxyLogin,
        proxyPass: data.proxyPass,
        proxyIP: data.proxyIp,
        proxyPort: data.proxyPort,
    }

    await api.patch('/accounts/', requestData);
}

export const requestChannels = async (): Promise<ChannelResponse[]> => {
    const {data: {channels}}: {data: ChannelsResponse} = await api.get('/channels/');
    return channels;
}

export const requestCreateChannel = async (telegramId: number, name: string) => {
    await api.post('/channels/', {
        "telegram_id": telegramId,
        "name": name,
    })
}

export const requestDeleteChannels = async (ids: string[]) => {
    await api.delete('/channels/bulk', {data: {ids}});
}