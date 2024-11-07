import {FC} from "react";

import styles from './index.module.css';
import {authSelectors} from "../../../../features/auth/authSlice.ts";
import {useAppSelector} from "../../../../hooks/redux.ts";
import {appSelectors} from "../../../../features/app/appSlice.ts";


export const UserBlock: FC = () => {
    const user = useAppSelector(authSelectors.getUser);
    const accounts = useAppSelector(appSelectors.getAccounts);

    // date from unix timestamp
    const subEnd = new Date(Number(user!.subEnd) * 1000).toLocaleDateString()
    const subDays = Math.floor((Number(user!.subEnd) - Date.now() / 1000) / 86400)
    const subActive = user!.subActive

    return (
        <div className={styles.UserBlock}>
            <span className={styles.UserBlockTitle}>User Settings</span>
            <div className={styles.UserBlockInfo}>
                <div className={styles.UserBlockInfoSub}>
                    <span className={styles.UserBlockInfoSubTitle}>Until {subEnd} ({subDays} days)</span>
                    <span
                        className={subActive ? styles.UserBlockInfoSubStatusActive : styles.UserBlockInfoSubStatusInactive}
                    >
                        {subActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
                <div className={styles.UserBlockInfoAccounts}>
                    <span className={styles.UserBlockInfoAccountsTitle}>
                        <span>{accounts.length}</span>
                        <span>/</span>
                        <span>{user!.maxAccounts}</span>
                    </span>
                    <span
                        className={subActive ? styles.UserBlockInfoSubStatusActive : styles.UserBlockInfoSubStatusInactive}
                    >
                        {subActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>
        </div>
    )
}