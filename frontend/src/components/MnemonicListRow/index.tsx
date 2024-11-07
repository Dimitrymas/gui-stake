import styles from './index.module.css';
import {FC} from "react";

interface MnemonicListRowProps {
    index: number;
    value: string;
    onClick: () => void;
}

export const MnemonicListRow: FC<MnemonicListRowProps> = ({index, value, onClick}: MnemonicListRowProps) => {
    return (
        <div className={styles.MnemonicListRow} onClick={onClick}>
            <span className={styles.MnemonicListRowIndex}>#{index}</span>
            <span className={styles.MnemonicListRowValue}>{value}</span>
        </div>
    );
}
