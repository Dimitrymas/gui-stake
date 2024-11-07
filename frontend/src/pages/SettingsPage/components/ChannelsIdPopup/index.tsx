import {FC, useCallback, useState} from "react";
import styles from './index.module.css';
import {Button} from "../../../../components/Button";
import {ButtonType} from "../../../../types/buttonType.ts";
import {FiPlus} from "react-icons/fi";
import {Id, toast} from "react-toastify";
import {isValidTelegramID} from "./utils.ts";
import {TgGetNameByPeerID} from "../../../../../wailsjs/go/main/app";
import {handleWailsError} from "../../../../utils/wails.ts";
import {requestChannels, requestCreateChannel} from "../../../../api";
import {usePopup} from "../../../../components/PopupProvider/utils.ts";
import {appSlice} from "../../../../features/app/appSlice.ts";
import {useAppDispatch} from "../../../../hooks/redux.ts";

export const ChannelsIdPopup: FC = () => {
    const [telegramId, setTelegramId] = useState<string>('');
    const [toastId, setToastId] = useState<Id | null>(null);
    const [invalid, setInvalid] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const {closePopup} = usePopup();


    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isNaN(+e.target.value) && e.target.value !== '-') {
            if (toastId) toast.dismiss(toastId);
            return setToastId(toast.error('Channel ID must be a number'));
        }

        setInvalid(!isValidTelegramID(e.target.value));

        setTelegramId(e.target.value);
    }

    const handleCreate = useCallback(async () => {
        if (invalid) return;
        const tgId = Number(telegramId);
        if (isNaN(tgId)) return;

        const checkResponse = await TgGetNameByPeerID(tgId);

        if (handleWailsError(toast.error, checkResponse)) {
            return;
        }

        await requestCreateChannel(Number(tgId), checkResponse.name);
        closePopup();

        const channels = await requestChannels();
        dispatch(appSlice.actions.setChannels(channels));
    }, [telegramId, invalid]);

    return (
        <div className={styles.ChannelsIdPopup}>
            <input
                className={styles.ChannelsIdPopupInput}
                placeholder={"Channel ID"}
                value={telegramId}
                onChange={handleInput}
            />
            <Button
                styleType={ButtonType.Primary}
                icon={<FiPlus size={23}/>}
                disabled={!telegramId || invalid}
                onClick={handleCreate}
            >
                Create
            </Button>
        </div>
    )
}