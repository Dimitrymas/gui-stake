import {FC} from "react";
import {IoArrowBack} from "react-icons/io5";
import styles from "./index.module.css";


interface BackButtonProps {
    onClick: () => void;
}

export const BackButton: FC<BackButtonProps> = ({onClick}: BackButtonProps) => {
    return (
        <div className={styles.BackButtonContainer}>
            <span onClick={onClick} className={styles.BackButton}>
                <IoArrowBack className={styles.BackButtonIcon}/>
                Back
            </span>
        </div>
    );
}
