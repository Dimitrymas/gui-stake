import styles from "./index.module.css";
import {FC} from "react";
import {FiPlus, FiRotateCw} from "react-icons/fi";
import {Button} from "../../../../components/Button";
import {ButtonType} from "../../../../types/buttonType.ts";
import {Input} from "../Input";
import {AccountFormOnSubmit} from "../../../../components/AccountForm";

interface HeaderProps {
    onSearch: (value: string) => void;
    createDisabled: boolean;
    onRefresh: () => void;
    onAdd: (data: AccountFormOnSubmit) => void;
    openPopup: () => void;
}

export const Header: FC<HeaderProps> = ({onSearch, createDisabled, onRefresh, openPopup}: HeaderProps) => {
    return (
        <>
            <div
                className={styles.Header}
            >
                <Input onChange={onSearch}/>
                <Button
                    type="submit"
                    styleType={ButtonType.Secondary}
                    icon={<FiRotateCw size={23} />}
                    onClick={onRefresh}
                >
                    Refresh
                </Button>
                <Button
                    type="button"
                    disabled={createDisabled}
                    styleType={ButtonType.Primary}
                    icon={<FiPlus size={23} />}
                    onClick={openPopup}
                >
                    Create account
                </Button>
            </div>

        </>
    );
}
