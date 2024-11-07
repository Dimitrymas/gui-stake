import {createSlice} from '@reduxjs/toolkit';
import {IRootState} from "../../store";
import {getPublicKey, getToken, savePublicKey, saveToken} from "./authUtils.ts";

export interface IAuthState {
    isAuthenticated: boolean;
    user?: User;
    token?: string;
    publicKey?: string;
}

export type User = {
    id: string;
    maxAccounts: number;
    subStart: string;
    subEnd: string;
    subActive: boolean;
}

const token = getToken();
const publicKey = getPublicKey();
const isAuthenticated = !!(token && publicKey);

export const initialState: IAuthState = {
    isAuthenticated: isAuthenticated,
    token: isAuthenticated ? token : undefined,
    publicKey: isAuthenticated ? publicKey : undefined,
};


export const authSlice = createSlice({
    name: 'authReducer',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.token = undefined;
            state.user = undefined
            saveToken(undefined);
            savePublicKey(undefined);
        },
        login: (state, action) => {
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.publicKey = action.payload.publicKey;
            saveToken(action.payload.token);
            savePublicKey(action.payload.publicKey);
        }
    },
});

export const authSelectors = {
    getIsAuthenticated: (state: IRootState) => state.authReducer.isAuthenticated,
    getUser: (state: IRootState) => state.authReducer.user,
};

export const authReducer = authSlice.reducer;
