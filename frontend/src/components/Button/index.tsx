import {CSSProperties, ReactNode} from "react";

import styles from "./index.module.css";
import {ButtonType} from "../../types/buttonType.ts";

interface ButtonProps {
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    styleType: ButtonType;
    icon?: ReactNode;
    children: ReactNode;
    style?: CSSProperties
}

export const Button = ({onClick, type, disabled, styleType, icon, children, style}: ButtonProps) => {
    return (
        <button
            style={style}
            disabled={disabled}
            type={type}
            className={styleType === ButtonType.Primary ? styles.ButtonPrimary : styles.ButtonSecondary}
            onClick={onClick}
        >
            {icon}
            <span className={styles.ButtonText}>{children}</span>
        </button>
    );
}
