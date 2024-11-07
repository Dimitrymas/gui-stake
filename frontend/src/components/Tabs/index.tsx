import {FC, ReactNode} from "react";
import styles from "./index.module.css";

interface TabsProps {
    children?: ReactNode
}

export const Tabs: FC<TabsProps> = ({children}: TabsProps) => {
    return (
        <div className={styles.Tabs}>
            {children}
        </div>
    )
}
