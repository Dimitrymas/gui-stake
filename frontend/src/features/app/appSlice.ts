import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IRootState} from "../../store";
import {AccountResponse, ChannelResponse} from "../../api/responses.ts";

export interface IAppState {
    accounts: AccountResponse[];
    channels: ChannelResponse[];
}


export const initialState: IAppState = {
    accounts: [],
    channels: [],
};


export const appSlice = createSlice({
    name: 'appReducer',
    initialState,
    reducers: {
        setAccounts: (state, action: PayloadAction<AccountResponse[]>) => {
            state.accounts = action.payload;
        },
        setChannels: (state, action: PayloadAction<ChannelResponse[]>) => {
            state.channels = action.payload;
        }
    },
});

export const appSelectors = {
    getAccounts: (state: IRootState) => state.appReducer.accounts,
    getChannels: (state: IRootState) => state.appReducer.channels,
};

export const appReducer = appSlice.reducer;
