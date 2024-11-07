import { AccountsFilterDefaultSettings } from "../../types/accountsFilterDefaultSettings.ts";
import { ChannelsFilterDefaultSettings } from "../../types/channelsFilterDefaultSettings.ts";
import { FilterSetting, FilterSettingsSchema } from "./settingsSlice.ts";

// Универсальная функция проверки валидности настроек
const isFilterHeaderSettings = (obj: unknown): obj is FilterSetting[] => {
    return Array.isArray(obj) && obj.every((item) => FilterSettingsSchema.safeParse(item).success);
}

// Универсальная функция для получения настроек из localStorage
const getFilterSettings = (key: string, defaultSettings: FilterSetting[]): FilterSetting[] => {
    try {
        const data = localStorage.getItem(key);
        if (!data) {
            return defaultSettings;
        }
        const parsedData = JSON.parse(data);
        if (isFilterHeaderSettings(parsedData)) {
            return parsedData as FilterSetting[];
        }
    } catch (e) {
        console.error(e);
    }
    saveFilterSettings(key, defaultSettings);
    return defaultSettings;
}

// Универсальная функция для сохранения настроек в localStorage
const saveFilterSettings = (key: string, settings: FilterSetting[]) => {
    localStorage.setItem(key, JSON.stringify(settings));
}

// Специфичные функции для аккаунтов и каналов
export const getAccountsFilterSettings = (): FilterSetting[] => {
    return getFilterSettings("accountsFilterSettings", AccountsFilterDefaultSettings);
}

export const saveAccountsFilterSettings = (settings: FilterSetting[]) => {
    saveFilterSettings("accountsFilterSettings", settings);
}

export const getChannelsFilterSettings = (): FilterSetting[] => {
    return getFilterSettings("channelsFilterSettings", ChannelsFilterDefaultSettings);
}

export const saveChannelsFilterSettings = (settings: FilterSetting[]) => {
    saveFilterSettings("channelsFilterSettings", settings);
}
