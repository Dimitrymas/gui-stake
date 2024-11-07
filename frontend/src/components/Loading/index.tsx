import {Spin} from "antd";
import styles from "./index.module.css";
import {FC} from "react";

export const Loading: FC = () => {
    return (
        <div className={styles.Loading}>
            <Spin className={styles.LoadingIcon}/>
        </div>
    )
}