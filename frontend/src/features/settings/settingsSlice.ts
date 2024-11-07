import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IRootState} from "../../store";
import {
    getAccountsFilterSettings, getChannelsFilterSettings,
    saveAccountsFilterSettings, saveChannelsFilterSettings,
} from "./settingsUtils.ts";
import {z} from 'zod';

export interface ISettingsState {
    accountsFilter: FilterSetting[];
    channelsFilter: FilterSetting[];
}

export interface FilterSetting {
    name: string;
    key: string;
    enabled: boolean;
    width: number;
    minWidth: number;
    maxWidth: number;
    statusKey?: string;
    defaultValue?: string;
    descriptionKey?: string;
    type: "string" | "date"
}

export const FilterSettingsSchema = z.object({
    name: z.string(),
    key: z.string(),
    enabled: z.boolean(),
    width: z.number(),
    minWidth: z.number(),
    maxWidth: z.number(),
    statusKey: z.string().optional(),
    descriptionKey: z.string().optional(),
    defaultValue: z.string().optional(),
    type: z.string(),
});


export const initialState: ISettingsState = {
    accountsFilter: getAccountsFilterSettings(),
    channelsFilter: getChannelsFilterSettings()
};


export const settingsSlice = createSlice({
    name: 'settingsReducer',
    initialState,
    reducers: {
        setAccountsFilter: (state: ISettingsState, action: PayloadAction<FilterSetting[]>) => {
            state.accountsFilter = action.payload
            saveAccountsFilterSettings(action.payload)
        },
        setChannelFilter: (state: ISettingsState, action: PayloadAction<FilterSetting[]>) => {
            state.channelsFilter = action.payload
            saveChannelsFilterSettings(action.payload)
        }
    },
});

export const settingsSelectors = {
    getAccountsFilter: (state: IRootState) => state.settingsReducer.accountsFilter,
    getChannelsFilter: (state: IRootState) => state.settingsReducer.channelsFilter
};

export const settingsReducer = settingsSlice.reducer;



