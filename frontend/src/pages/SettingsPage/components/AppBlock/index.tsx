import {FC} from "react";

import styles from './index.module.css';


export const AppBlock: FC = () => {
    return (
        <div className={styles.AppBlock}>
            <span className={styles.AppBlockTitle}>App Settings</span>
        </div>
    )
}