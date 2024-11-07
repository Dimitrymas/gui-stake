import {FC, useCallback, useEffect} from "react";

import styles from './index.module.css';
import {settingsSelectors, settingsSlice} from "../../../../features/settings/settingsSlice.ts";
import {Table} from "../../../../components/Table";
import {requestChannels, requestDeleteChannels} from "../../../../api";
import {useAppDispatch, useAppSelector} from "../../../../hooks/redux.ts";
import {Button} from "../../../../components/Button";
import {ButtonType} from "../../../../types/buttonType.ts";
import {FiPlus, FiRotateCw} from "react-icons/fi";
import {usePopup} from "../../../../components/PopupProvider/utils.ts";
import {ChannelsIdPopup} from "../ChannelsIdPopup";
import {ChannelsUsernamePopup} from "../ChannelsUsernamePopup";
import {HiAtSymbol, HiHashtag} from "react-icons/hi";
import {appSelectors, appSlice} from "../../../../features/app/appSlice.ts";


export const ChannelsBlock: FC = () => {
    const channels = useAppSelector(appSelectors.getChannels);
    const settings = useAppSelector(settingsSelectors.getChannelsFilter);
    const dispatch = useAppDispatch();
    const {openPopup} = usePopup();

    const fetchChannels = useCallback(async () => {
        try {
            const data = await requestChannels();
            dispatch(appSlice.actions.setChannels(data))
        } catch (e) {
            console.error(e);
        }
    }, [dispatch])

    useEffect(() => {
        fetchChannels().then()
    }, [])

    const handleAdd = useCallback(() => {
        openPopup({
            width: 500,
            items: [
                {
                    tabIcon: <HiHashtag size={18}/>,
                    tabText: "Create with ID",
                    element: <ChannelsIdPopup/>
                },
                {
                    tabIcon: <HiAtSymbol size={18}/>,
                    tabText: "Create with username",
                    element: <ChannelsUsernamePopup/>
                }
            ],
            closeable: true
        });
    }, [])

    const handleRefresh = useCallback(() => {
        fetchChannels().then()
    }, [])

    const handleDelete = useCallback(async (ids: string[]) => {
        await requestDeleteChannels(ids);
        handleRefresh();
    }, [])


    return (
        <div className={styles.ChannelBlock}>
            <div className={styles.ChannelBlockHeader}>
                <span className={styles.ChannelBlockTitle}>Channels settings</span>
                <div className={styles.ChannelBlockHeaderButtons}>
                    <Button
                        type="submit"
                        styleType={ButtonType.Secondary}
                        onClick={handleRefresh}
                        icon={<FiRotateCw size={23} />}
                    >
                        Refresh
                    </Button>
                    <Button
                        type="button"
                        styleType={ButtonType.Primary}
                        icon={<FiPlus size={23} />}
                        onClick={handleAdd}
                    >
                        Add channel
                    </Button>
                </div>
            </div>
            <Table
                rows={channels}
                onDelete={handleDelete}
                settings={settings}
                setSettings={settingsSlice.actions.setChannelFilter}
            />
        </div>
    )
}