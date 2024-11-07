import {FC, useEffect} from "react";
import * as React from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {telegramSelectors, telegramSlice} from "./telegramSlice.ts";
import {TgGetUserInfo, TgIsAuthorized} from "../../../wailsjs/go/main/app";
import {toast} from "react-toastify";
import {Loading} from "../../components/Loading";

interface TelegramProviderProps {
    children: React.ReactNode;
}

export const TelegramProvider: FC<TelegramProviderProps> = ({children}) => {
    const [loading, setLoading] = React.useState<boolean>(true);

    const dispatch = useAppDispatch();
    const isTgLogged = useAppSelector(telegramSelectors.isLogged);
    const tgUserInfo = useAppSelector(telegramSelectors.userInfo);

    useEffect(() => {
        if (!isTgLogged) {
            return;
        }
        const fetchUserInfo = async () => {
            const {error, ...data} = await TgGetUserInfo();
            if (error) {
                toast.error(error);
            }
            dispatch(telegramSlice.actions.setUserInfo(data));
        }
        fetchUserInfo().then().catch()
    }, [isTgLogged]);

    useEffect(() => {
        const fetchIsTgLogged = async () => {
            const isTgLogged = await TgIsAuthorized();
            setLoading(false);
            dispatch(telegramSlice.actions.setLogged(isTgLogged));
        }

        fetchIsTgLogged().then().catch()
    }, [])

    if (loading || (isTgLogged && !tgUserInfo)) {
        return <Loading/>
    }

    return children
}