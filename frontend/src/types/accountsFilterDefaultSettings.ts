import {FilterSetting} from "../features/settings/settingsSlice.ts";

export const AccountsFilterDefaultSettings: FilterSetting[] = [
    {
        name: "Name",
        enabled: true,
        width: 300,
        minWidth: 80,
        maxWidth: 300,
        key: "name",
        type: "string"
    },
    {
        name: "Last promo",
        enabled: true,
        width: 150,
        key: "lastActivation.promoCode.name",
        minWidth: 100,
        maxWidth: 150,
        statusKey: "lastActivation.succeeded",
        descriptionKey: "lastActivation.error",
        defaultValue: "No promo",
        type: "string"
    },
    {
        name: "Token",
        enabled: true,
        width: 300,
        key: "token",
        minWidth: 80,
        maxWidth: 300,
        type: "string"
    },
    {
        name: "Proxy",
        enabled: true,
        width: 300,
        key: "proxy",
        minWidth: 100,
        maxWidth: 300,
        type: "string"
    },
    {
        name: "Created",
        enabled: true,
        width: 150,
        key: "createdAt",
        minWidth: 50,
        maxWidth: 150,
        type: "date"
    }
]


