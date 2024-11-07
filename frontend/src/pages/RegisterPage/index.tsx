import {FC, useCallback, useEffect, useState} from "react";
import styles from "./index.module.css";
import {MnemonicList} from "../../components/MnemonicList";
import {Loading} from "../../components/Loading";
import {requestMnemonic, requestRegister} from "../../api";
import {AuthMessage} from "../../components/AuthMessage";
import {AuthMessageType} from "../../types/authMessageType.ts";
import {RegisterStep} from "../../types/registerStep.ts";
import {MnemonicForm} from "../../components/MnemonicForm";
import {MnemonicFormType} from "../../types/mnemonicFormType.ts";
import {BackButton} from "./components/BackButton";
import {authSlice} from "../../features/auth/authSlice.ts";
import {useAppDispatch} from "../../hooks/redux.ts";

export const RegisterPage: FC = () => {
    const [mnemonic, setMnemonic] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [step, setStep] = useState<RegisterStep>(RegisterStep.ReadMnemonic)
    const dispatch = useAppDispatch();
    
    const handleSubmitForm = useCallback(async (mnemonics: string[]) => {
        setLoading(true);
        try {
            const response = await requestRegister(mnemonics);
            dispatch(authSlice.actions.login(response));
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }, [dispatch, setLoading]);

    const handleSubmitList = () => {
        setStep(RegisterStep.WriteMnemonic);
    }
    useEffect(() => {
        const fetchMnemonic = async () => {
            const data = await requestMnemonic();
            setMnemonic(data);
        };

        fetchMnemonic().then();
    }, []);

    if (mnemonic.length === 0) {
        return <Loading/>
    }

    return (
        <div className={styles.RegisterPage}>
            <span className={styles.RegisterPageWarning}>
                {
                    step === RegisterStep.ReadMnemonic ? "Your mnemonic is the key to recovering your account. Do not lose it!" : "Confirm the words"
                }
            </span>
            {
                step === RegisterStep.ReadMnemonic ? (
                        <>
                            <MnemonicList mnemonic={mnemonic} onSubmit={handleSubmitList}/>
                            <AuthMessage type={AuthMessageType.Register}/>
                        </>
                    )
                    :
                    (
                        <>
                            <BackButton onClick={() => setStep(RegisterStep.ReadMnemonic)}/>
                            <MnemonicForm
                                loading={loading}
                                onSubmit={handleSubmitForm}
                                type={MnemonicFormType.Register}
                                expectedMnemonic={mnemonic}
                            />
                        </>
                    )
            }
        </div>
    );
}
