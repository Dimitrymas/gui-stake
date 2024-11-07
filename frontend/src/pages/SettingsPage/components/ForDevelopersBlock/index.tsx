import {FC} from "react";

import styles from './index.module.css';


export const ForDevelopersBlock: FC = () => {
    return (
        <div className={styles.ForDevelopersBlock}>
            <span className={styles.ForDevelopersBlockTitle}>For Developers</span>
        </div>
    )
}