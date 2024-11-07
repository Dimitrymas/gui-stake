import {FC, useCallback, useEffect, useState} from "react";
import styles from "./index.module.css";
import {Header} from "./components/Header";
import {Table} from "../../components/Table";
import {requestAccounts, requestCreateAccount, requestDeleteManyAccounts, requestPatchAccount} from "../../api";
import {AccountResponse} from "../../api/responses.ts";
import {AccountForm, AccountFormOnSubmit} from "../../components/AccountForm";
import {FiPlus} from "react-icons/fi";
import {usePopup} from "../../components/PopupProvider/utils.ts";
import {FaPen} from "react-icons/fa";
import {Tab} from "../../components/Tab";
import {VscGlobe} from "react-icons/vsc";
import {Tabs} from "../../components/Tabs";
import {settingsSelectors, settingsSlice} from "../../features/settings/settingsSlice.ts";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {appSelectors, appSlice} from "../../features/app/appSlice.ts";


export const HomePage: FC = () => {
    const accounts = useAppSelector(appSelectors.getAccounts);
    const {openPopup, closePopup} = usePopup();
    const [search, setSearch] = useState<string>('');
    const settings = useAppSelector(settingsSelectors.getAccountsFilter);

    const dispatch = useAppDispatch();

    const fetchAccounts = useCallback(async () => {
        try {
            const data = await requestAccounts();
            dispatch(appSlice.actions.setAccounts(data))
        } catch (e) {
            console.error(e);
        }
    }, [dispatch])

    const handleSearch = useCallback((value: string) => {
        setSearch(value)
    }, [])

    const handleAdd = useCallback(async (data: AccountFormOnSubmit) => {
        try {
            await requestCreateAccount(data);
            closePopup()
        } catch (e) {
            console.error(e);
        }
        fetchAccounts().then()
    }, [fetchAccounts, closePopup])

    const handleEdit = useCallback(async (data: AccountFormOnSubmit, id: string) => {
        try {
            await requestPatchAccount({...data, id});
            closePopup()
        } catch (e) {
            console.error(e);
        }
        fetchAccounts().then()
    }, [fetchAccounts, closePopup])

    const handleOpenAddPopup = useCallback(() => {
        openPopup({
            width: 500,
            items: [
                {
                    tabIcon: <FiPlus size={18}/>,
                    tabText: "New account",
                    element: <AccountForm onSubmit={handleAdd}/>
                }
            ]
        })
    }, [openPopup, handleAdd])

    const handleOpenEditPopup = useCallback((id: string) => {
        const account = accounts.find((account) => account.id === id) as AccountResponse;
        openPopup({
            width: 500,
            items: [
                {
                    tabIcon: <FaPen size={18}/>,
                    tabText: "Edit account",
                    element: <AccountForm
                        onSubmit={(data) => handleEdit(data, id)}
                        defaultValues={{
                            name: account.name,
                            token: account.token,
                            proxyType: account.proxyType,
                            proxyIp: account.proxyIP,
                            proxyPort: account.proxyPort,
                            proxyLogin: account.proxyLogin,
                            proxyPass: account.proxyPass,
                        }}
                    />
                }
            ]
        })
    }, [accounts, openPopup, handleEdit])

    const handleDelete = useCallback(async (ids: string[]) => {
        try {
            await requestDeleteManyAccounts(ids);
        } catch (e) {
            console.error(e);
        }
        fetchAccounts().then()
    }, [fetchAccounts])

    useEffect(() => {
        fetchAccounts().then()
    }, [fetchAccounts])


    return (
        <div className={styles.HomePage}>
            <Header
                onSearch={handleSearch}
                createDisabled={false}
                onRefresh={fetchAccounts}
                onAdd={handleAdd}
                openPopup={handleOpenAddPopup}
            />
            <Table
                rows={accounts.filter((account) => JSON.stringify(account).includes(search))}
                onEdit={handleOpenEditPopup}
                onDelete={handleDelete}
                tabs={(<Tabs>
                    <Tab enabled={true} icon={<VscGlobe/>} text={"Accounts"}/>
                </Tabs>)}
                settings={settings}
                setSettings={settingsSlice.actions.setAccountsFilter}
            />
        </div>
    )
}
