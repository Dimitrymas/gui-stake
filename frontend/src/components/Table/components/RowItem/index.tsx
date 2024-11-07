import {FC} from "react";
import {FilterSetting} from "../../../../features/settings/settingsSlice.ts";
import {getValueByPath} from "../../../../utils";

import styles from './index.module.css';
import {Tooltip} from "antd";

interface RowItemProps {
    setting: FilterSetting;
    account: { [key: string]: any };
}

export const RowItem: FC<RowItemProps> = ({setting, account}: RowItemProps) => {
    let value = getValueByPath(account, setting.key) || setting.defaultValue;

    if (setting.type === "date") {
        value = new Date(value).toLocaleString().replace(",", "");
    }

    const stutus = setting.statusKey ? getValueByPath(account, setting.statusKey) : null;
    const description = setting.descriptionKey ? getValueByPath(account, setting.descriptionKey) : null;

    let className

    switch (typeof stutus) {
        case "boolean":
            className = stutus ? styles.RowItemGoodStatus : styles.RowItemBadStatus
            break
        case "undefined":
            className = styles.RowItemNoStatus
            break
        default:
            className = styles.RowItem
    }

    if (description) {
        return (
            <Tooltip title={description} placement={"top"}>
                <div
                    className={className}
                    style={{width: setting.width}}
                >
                    {value}
                </div>
            </Tooltip>
        )
    }

    return (
        <div
            className={className}
            style={{width: setting.width}}
        >
            {value}
        </div>
    )
}