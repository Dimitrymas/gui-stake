import {FC, useCallback, useEffect} from "react";
import {usePopup} from "../../../../components/PopupProvider/utils.ts";
import {TelegramPopup} from "../TelegramPopup";
import {useAppDispatch, useAppSelector} from "../../../../hooks/redux.ts";
import {telegramSelectors, telegramSlice} from "../../../../features/telegram/telegramSlice.ts";

import styles from './index.module.css';
import {FaQrcode} from "react-icons/fa6";
import {TgDeleteSession} from "../../../../../wailsjs/go/main/app";
import {toast} from "react-toastify";


export const TelegramBlock: FC = () => {
    const isTgAuthorized = useAppSelector(telegramSelectors.isLogged);
    const userInfo = useAppSelector(telegramSelectors.userInfo);
    const dispatch = useAppDispatch()

    const {openPopup} = usePopup();


    const handleTelegramAuth = useCallback(async () => {
        const toastId = toast.info("Loading QR code...");
        dispatch(telegramSlice.actions.logout());
        await TgDeleteSession();
        openPopup({
            width: 500,
            items: [
                {
                    tabIcon: <FaQrcode size={18}/>,
                    tabText: "Via QR code",
                    element: <TelegramPopup/>
                }
            ],
            closeable: false
        });
        // delete toasts
        toast.dismiss(toastId);
    }, []);

    useEffect(() => {
        if (!isTgAuthorized) {
            handleTelegramAuth().then();
        }
    }, []);

    return (
        <div className={styles.TelegramBlock}>
            <span className={styles.TelegramBlockTitle}>Telegram settings</span>
            {
                isTgAuthorized && userInfo && userInfo.avatar && (
                    <div className={styles.TelegramBlockUserInfo}>
                        {
                            userInfo.avatar.type === "img" ? (
                                <img src={userInfo.avatar.b64} className={styles.TelegramBlockUserAvatar} alt="avatar"/>
                            ) : (
                                <video src={userInfo.avatar.b64} className={styles.TelegramBlockUserAvatar} autoPlay loop
                                       muted/>
                            )
                        }
                        <div className={styles.TelegramBlockUserInfoText}>
                            <span
                                className={styles.TelegramBlockUserInfoTextUsername}>{userInfo.first_name} {userInfo.last_name}</span>
                            <div className={styles.TelegramBlockReLogin}>
                                <span>Not you?</span>
                                <span className={styles.TelegramBlockReLoginButton}
                                      onClick={handleTelegramAuth}
                                >
                                    Change user
                                </span>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}