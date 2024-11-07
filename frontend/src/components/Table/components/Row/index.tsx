import {FC} from "react";
import {FilterSetting} from "../../../../features/settings/settingsSlice.ts";

import styles from './index.module.css';
import {Checkbox} from "antd";
import {RowItem} from "../RowItem";
import {FaPen} from "react-icons/fa";


interface RowProps {
    data: { id: string };
    onCheck: (id: string) => void;
    checked: boolean;
    onEdit?: (id: string) => void;
    settings: FilterSetting[];
}

export const Row: FC<RowProps> = ({data, checked, onCheck, onEdit, settings}: RowProps) => {
    const filterHeader = settings.filter((setting) => setting.enabled)

    return (
        <div className={checked ? styles.RowChecked : styles.Row}>
            <div className={styles.RowControl}>
                <Checkbox checked={checked} onChange={() => onCheck(data.id)}/>
                {
                    onEdit && (
                        <div className={styles.RowEdit} onClick={() => onEdit(data.id)}>
                            <FaPen className={styles.RowEditIcon}/>
                        </div>
                    )
                }
            </div>
            {filterHeader.map((setting, index) => (
                <RowItem key={index} setting={setting} account={data}/>
            ))}
        </div>
    )
}
