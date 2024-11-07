import {AuthMessageType} from "../../types/authMessageType.ts";
import {FC} from "react";
import styles from "./index.module.css";
import {Link} from "react-router-dom";
import {Routes} from "../../types/routes.ts";

interface AuthMessageProps {
    type: AuthMessageType;
}

export const AuthMessage: FC<AuthMessageProps> = ({type}: AuthMessageProps) => {
    return (
        <span className={styles.AuthMessage}>
            {type === AuthMessageType.Register ? "Already have an account?" : "Don't have an account?"}
            <Link to={type === AuthMessageType.Register ? Routes.LoginPage : Routes.RegisterPage}>
                {type === AuthMessageType.Register ? "Login" : "Register"}
            </Link>
        </span>
    );
};
