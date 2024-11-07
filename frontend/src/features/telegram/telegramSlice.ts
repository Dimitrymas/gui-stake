import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IRootState} from "../../store";

export interface ITelegramState {
    isLogged: boolean;
    userInfo?: UserInfo;
}

export type UserInfo = {
    first_name: string;
    last_name: string;
    avatar?: Avatar;
}

export type Avatar = {
    b64: string;
    type: string;
}


export const initialState: ITelegramState = {
    isLogged: false,
    userInfo: undefined
};


export const telegramSlice = createSlice({
    name: 'telegramReducer',
    initialState,
    reducers: {
        setLogged: (state, action: PayloadAction<boolean>) => {
            state.isLogged = action.payload;
        },
        setUserInfo: (state, action: PayloadAction<UserInfo>) => {
            state.userInfo = action.payload;
        },
        logout: (state) => {
            state.isLogged = false;
            state.userInfo = undefined;
        }
    },
});

export const telegramSelectors = {
    isLogged: (state: IRootState) => state.telegramReducer.isLogged,
    userInfo: (state: IRootState) => state.telegramReducer.userInfo
};

export const telegramReducer = telegramSlice.reducer;



