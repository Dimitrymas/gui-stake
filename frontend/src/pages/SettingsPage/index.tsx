import {FC} from "react";
import {TelegramBlock} from "./components/TelegramBlock";

import styles from './index.module.css';
import {ChannelsBlock} from "./components/ChannelsBlock";
import {ForDevelopersBlock} from "./components/ForDevelopersBlock";
import {UserBlock} from "./components/UserBlock";
import {AppBlock} from "./components/AppBlock";

export const SettingsPage: FC = () => {
    return (
        <div className={styles.SettingsPage}>
            <div className={styles.SettingsPageLine}>
                <TelegramBlock/>
                <UserBlock/>
            </div>
            <div className={styles.SettingsPageLine}>
                <ChannelsBlock/>
                <AppBlock/>
            </div>
            <div className={styles.SettingsPageLine}>
                <ForDevelopersBlock/>
            </div>
        </div>
    )
}
