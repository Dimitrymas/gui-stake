import styles from "./index.module.css";
import {MnemonicListRow} from "../MnemonicListRow";
import {FC} from "react";
import {useCustomMessage} from "../../hooks/useCustomMessage";
import {AuthButton} from "../AuthButton";

interface MnemonicListProps {
    onSubmit: () => void;
    mnemonic: string[];
}

export const MnemonicList: FC<MnemonicListProps> = ({onSubmit, mnemonic}: MnemonicListProps) => {
    const [messageApi, contextHolder] = useCustomMessage();


    const handleClick = async (value: string) => {
        await navigator.clipboard.writeText(value);
        messageApi.info("Copied to clipboard", 0.5);
    }

    const renderInputs = (startIndex: number, endIndex: number) => {
        return mnemonic.slice(startIndex, endIndex).map((mnemonic, index) => (
            <MnemonicListRow
                onClick={() => handleClick(mnemonic)}
                index={startIndex + index + 1}
                key={index}
                value={mnemonic}
            />
        ));
    };


    return (
        <div className={styles.MnemonicList}>
            {contextHolder}
            <div className={styles.MnemonicListColumns}>
                <div className={styles.MnemonicListColumn}>{renderInputs(0, 6)}</div>
                <div className={styles.MnemonicListColumn}>{renderInputs(6, 12)}</div>
            </div>
            <AuthButton onClick={onSubmit} type="submit">Continue</AuthButton>
        </div>
    )
}
