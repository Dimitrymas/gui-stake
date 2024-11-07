import {IoSearchOutline} from "react-icons/io5"
import {FC, useEffect, useState} from "react";
import styles from "./index.module.css"
import {useDebounce} from "use-debounce";

interface InputProps {
    onChange: (value: string) => void
}

export const Input: FC<InputProps> = ({onChange}: InputProps) => {
    const [inputValue, setInputValue] = useState("");
    const [debouncedInputValue] = useDebounce(inputValue, 100);

    useEffect(() => {
        onChange(debouncedInputValue);
    }, [debouncedInputValue, onChange]);

    return (
        <div className={styles.InputContainer}>
            <input
                className={styles.Input}
                type={"text"}
                placeholder={"Search"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <IoSearchOutline className={styles.InputIcon}/>
        </div>
    )
}
