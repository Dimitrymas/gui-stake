import styles from "./index.module.css";
import {MnemonicForm} from "../../components/MnemonicForm";
import {MnemonicFormType} from "../../types/mnemonicFormType.ts";
import {requestLogin} from "../../api";
import {useAppDispatch} from "../../hooks/redux.ts";
import {authSlice} from "../../features/auth/authSlice.ts";
import {FC, useCallback, useState} from "react";
import {AuthMessageType} from "../../types/authMessageType.ts";
import {AuthMessage} from "../../components/AuthMessage";

export const LoginPage: FC = () => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = useCallback(async (mnemonics: string[]) => {
        setLoading(true);
        try {
            const response = await requestLogin(mnemonics);
            dispatch(authSlice.actions.login(response));
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }, [setLoading, dispatch])

    return (
        <div className={styles.LoginPage}>
            <MnemonicForm
                loading={loading}
                onSubmit={handleSubmit}
                type={MnemonicFormType.Login}
            />
            <AuthMessage type={AuthMessageType.Login}/>
        </div>
    );
}
