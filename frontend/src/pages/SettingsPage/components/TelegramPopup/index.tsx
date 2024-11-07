import {FC, useCallback, useEffect, useState} from "react";
import {TgCancelQrLogin, TgGetQrCode, TgLoginWithPassword} from "../../../../../wailsjs/go/main/app";
import {EventsOff, EventsOn, EventsOnce} from "../../../../../wailsjs/runtime";
import {telegramEvents} from "../../../../types/wailsEventNames.ts";
import {telegramResponses} from "../../../../types/wailsEventResponses.ts";
import {useAppDispatch} from "../../../../hooks/redux.ts";
import {telegramSlice} from "../../../../features/telegram/telegramSlice.ts";

import styles from './index.module.css';
import {QRCode} from 'react-qrcode-logo';
import {toast} from "react-toastify";
import {usePopup} from "../../../../components/PopupProvider/utils.ts";
import tgIconB64 from '../../../../assets/tg_icon.png';
import {Button} from "../../../../components/Button";
import {ButtonType} from "../../../../types/buttonType.ts";
import {handleWailsError} from "../../../../utils/wails.ts";


export const TelegramPopup: FC = () => {
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [twoFactorRequired, setTwoFactorRequired] = useState<boolean>(false);
    const [twoFactorCode, setTwoFactorCode] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const {closePopup} = usePopup();


    const dispatch = useAppDispatch();


    const getQrCode = useCallback(async () => {
        const resp = await TgGetQrCode();
        if (!handleWailsError(setError, resp)) {
            setQrCode(resp.qr_code);
        }
    }, []);

    const handleTwoFactorSubmit = useCallback(async () => {
        const errorString = await TgLoginWithPassword(twoFactorCode);
        if (errorString) {
            toast.error(errorString);
        }
    }, [twoFactorCode]);

    useEffect(() => {
        EventsOn(telegramEvents.QrRecreateEvent, (data: telegramResponses.QrRecreateResponse) => {
            if (!handleWailsError(setError, data)) {
                setQrCode(data.qr_url);
            }
        });

        EventsOnce(telegramEvents.Qr2FARequiredEvent, () => {
            setTwoFactorRequired(true);
        });

        EventsOnce(telegramEvents.QrErrorEvent, (data: string) => {
            setError(data);
        });

        EventsOnce(telegramEvents.QrLoggedInEvent, async () => {
            dispatch(telegramSlice.actions.setLogged(true));
            closePopup();
        })

        getQrCode().then();

        return () => {
            EventsOff(telegramEvents.QrRecreateEvent);
            EventsOff(telegramEvents.Qr2FARequiredEvent);
            EventsOff(telegramEvents.QrErrorEvent);
            EventsOff(telegramEvents.QrLoggedInEvent);
            TgCancelQrLogin().then();
        }
    }, []);

    if (error) {
        return (
            <div className={styles.TelegramLoginQr}>
                {error}
            </div>
        )
    }

    if (twoFactorRequired) {
        return (
            <div className={styles.TelegramLoginQr}>
                <div className={styles.TwoFactor}>
                    <div className={styles.TwoFactorInfo}>
                        <h3 className={styles.TwoFactorTitle}>Cloud password check</h3>
                        <p className={styles.TwoFactorDesc}>Please enter your cloud password</p>
                    </div>
                    <div data-placeholder={"Name"}>
                        <input
                            className={styles.TelegramLoginQrInput}
                            value={twoFactorCode}
                            onChange={(e) => setTwoFactorCode(e.target.value)}
                            placeholder={"Password"}
                            type={"password"}
                        />
                    </div>
                    <Button
                        style={{padding: "17px 10px"}}
                        styleType={ButtonType.Primary}
                        onClick={handleTwoFactorSubmit}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.TelegramLoginQr}>
            {
                qrCode && (
                    <QRCode
                        id={"telegram-qr-code"}
                        value={qrCode}
                        bgColor={"#212b36"}
                        fgColor={"#00aa54"}
                        qrStyle="dots"    // type of qr code, wether you want dotted ones or the square ones
                        size={200}    // size of the qr code
                        eyeRadius={40}    // radius of the promocode eye
                        logoImage={tgIconB64}    // logo image of the qr code
                        removeQrCodeBehindLogo={true}    // remove the qr code behind the logo
                        logoPaddingStyle={"square"}
                        logoPadding={6}    // padding around the logo
                        ecLevel={"H"}    // error correction level
                    />
                )
            }
            <div>
                <h3 className={styles.TelegramLoginQrDescTitle}>Scan From Mobile Telegram</h3>
                <p className={styles.TelegramLoginQrDesc}>1. Open Telegram on your phone</p>
                <p className={styles.TelegramLoginQrDesc}>2. Go to Settings &gt; Devices &gt; Link Desktop Device</p>
                <p className={styles.TelegramLoginQrDesc}>3. Scan this image to Log in</p>
            </div>
        </div>
    )
}