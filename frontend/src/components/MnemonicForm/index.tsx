import React, {FC, useRef, useState} from "react";
import {MnemonicFormRow, MnemonicFormRowRef} from "../MnemonicFormRow";
import styles from "./index.module.css";
import {MnemonicFormType} from "../../types/mnemonicFormType.ts";
import {Loading} from "../Loading";
import {AuthButton} from "../AuthButton";

interface MnemonicFormProps {
    loading: boolean;
    onSubmit: (mnemonics: string[]) => Promise<void>;
    type: MnemonicFormType;
    expectedMnemonic?: string[];
}

export const MnemonicForm: FC<MnemonicFormProps> = ({onSubmit, type, loading, expectedMnemonic}: MnemonicFormProps) => {
    const [mnemonics, setMnemonics] = useState(Array(12).fill(''));

    const refs = useRef<Array<React.RefObject<MnemonicFormRowRef>>>([]); // Типизированный массив рефов

    if (refs.current.length === 0) {
        // Заполняем массив новыми рефами
        refs.current = Array(12)
            .fill(null)
            .map(() => React.createRef<MnemonicFormRowRef>());
    }

    const handleChange = (index: number, value: string) => {
        const newMnemonics = [...mnemonics];
        newMnemonics[index] = value.toLowerCase();
        setMnemonics(newMnemonics);
    };

    const isInvalid = () => mnemonics.some(mnemonic => mnemonic.length === 0);

    const invalidateAllRefs = () => {
        refs.current.forEach(ref => ref.current?.invalidate());
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (expectedMnemonic) {
            let invalid = false;
            for (let i = 0; i < mnemonics.length; i++) {
                if (mnemonics[i] !== expectedMnemonic[i]) {
                    invalid = true;
                    refs.current[i].current?.invalidate();
                }
            }
            if (invalid) {
                return;
            }
        }


        if (isInvalid()) {
            invalidateAllRefs();
        } else {
            onSubmit(mnemonics).then(r => r);
        }
    };

    const isDisabled = () => {
        return loading || isInvalid();
    };
    // typeof refs[0] - React.RefObject<HTMLInputElement>
    const renderInputs = (startIndex: number, endIndex: number) => {
        return mnemonics.slice(startIndex, endIndex).map((mnemonic, index) => (
            <MnemonicFormRow
                key={index}
                placeholder={`Word ${startIndex + index + 1}`}
                ref={refs.current[startIndex + index]}
                value={mnemonic}
                onChange={(value: string) => handleChange(startIndex + index, value)}
                height={"45px"}
                width={"100%"}
                invalidateFn={(value: string) => value.length === 0}
            />
        ));
    };


    return (
        <form onSubmit={handleSubmit} className={styles.MnemonicForm}>
            <div className={styles.MnemonicFormColumns}>
                <div className={styles.MnemonicFormColumn}>{renderInputs(0, 6)}</div>
                <div className={styles.MnemonicFormColumn}>{renderInputs(6, 12)}</div>
            </div>
            <AuthButton
                type={"submit"}
                disabled={isDisabled()}
            >
                {loading ? <Loading/> :
                    type === MnemonicFormType.Login ? 'Login' : 'Register'
                }
            </AuthButton>
        </form>
    )
}
