import {FC, ReactNode} from "react";
import styles from "./index.module.css";


interface AuthButtonProps {
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    children: ReactNode;
}

export const AuthButton: FC<AuthButtonProps> = ({onClick, children, type, disabled}: AuthButtonProps) => {
    return (
        <button disabled={disabled} type={type} className={styles.AuthButton} onClick={onClick}>{children}</button>
    );
}
