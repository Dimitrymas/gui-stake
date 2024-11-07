import {FC, useState} from "react";
import styles from './index.module.css';
import {Button} from "../../../../components/Button";
import {ButtonType} from "../../../../types/buttonType.ts";
import {FiPlus} from "react-icons/fi";
import {isValidTelegramUsername} from "./utils.ts";

export const ChannelsUsernamePopup: FC = () => {
    const [username, setUsername] = useState<string>('');
    const [invalid, setInvalid] = useState<boolean>(false);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        setInvalid(!isValidTelegramUsername(e.target.value));
    }

    const handleCreate = () => {

    }

    return (
        <div className={styles.ChannelsIdPopup}>
            <input
                className={styles.ChannelsIdPopupInput}
                placeholder={"Channel ID"}
                value={username}
                onChange={handleInput}
            />
            <Button
                styleType={ButtonType.Primary}
                icon={<FiPlus size={23}/>}
                disabled={!username || invalid}
                onClick={handleCreate}
            >
                Create
            </Button>
        </div>
    )
}