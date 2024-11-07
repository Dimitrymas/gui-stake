import {forwardRef, useImperativeHandle, useState} from 'react';
import styles from './index.module.css';

interface MnemonicFormRowProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    invalidateFn?: (value: string) => boolean;
    height: string;
    width: string;
}

export interface MnemonicFormRowRef {
    invalidate: () => void;
}

export const MnemonicFormRow = forwardRef<MnemonicFormRowRef, MnemonicFormRowProps>(
    ({value, onChange, placeholder, invalidateFn, height, width}, ref) => {
        const [invalid, setInvalid] = useState<boolean>(false);

        const handleBlur = () => {
            setInvalid(invalidateFn ? invalidateFn(value) : false);
        };

        const handleFocus = () => {
            setInvalid(false);
        }

        useImperativeHandle(ref, () => ({
            invalidate: () => setInvalid(true),
        }), [setInvalid]);

        return (
            <input
                className={invalid ? styles.MnemonicFormRowInvalid : styles.MnemonicFormRow}
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={handleBlur}
                onFocus={handleFocus}
                style={{height, width}}
            />
        );
    }
);
