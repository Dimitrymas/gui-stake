import {FilterSetting} from "../features/settings/settingsSlice.ts";

export const ChannelsFilterDefaultSettings: FilterSetting[] = [
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
        name: "Status",
        enabled: true,
        width: 150,
        statusKey: "succeeded",
        maxWidth: 150,
        minWidth: 50,
        key: "status",
        type: "string",
        descriptionKey: "error",
    },
    {
        name: "Telegram ID",
        enabled: true,
        width: 150,
        key: "telegram_id",
        minWidth: 50,
        maxWidth: 150,
        type: "string"
    }
]