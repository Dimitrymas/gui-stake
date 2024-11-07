import {FC, ReactNode} from "react";
import styles from "./index.module.css";

interface TabProps {
    icon: ReactNode
    text: string,
    enabled: boolean
    onClick?: () => void
}

export const Tab: FC<TabProps> = ({icon, text, enabled, onClick}: TabProps) => {
    return (
        <span onClick={onClick} className={enabled ? styles.Tab : styles.TabDisabled}>
            {icon}
            {text}
        </span>
    )
}
