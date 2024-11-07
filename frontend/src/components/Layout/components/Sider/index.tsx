import styles from "./index.module.css";
import {Layout as L, Menu, Tooltip} from "antd";
import {useLocation, useNavigate} from "react-router-dom";
import {Routes} from "../../../../types/routes.ts";
import {MdOutlineViewComfy, MdOutlineSettings} from "react-icons/md";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Logo from "../../../../assets/logo.svg?react";

const {Sider: S} = L;


export const Sider = () => {
    const navigate = useNavigate();

    // получаем текущий путь и определяем активный пункт меню
    const path = useLocation().pathname;

    return (
        <S
            className={styles.Sider}
            collapsible
            collapsed={false}
            trigger={null}
            width={72}
        >
            <Logo className={styles.Logo}/>
            <Menu
                defaultSelectedKeys={[path]}
                onClick={(e) => {
                    navigate(e.key)
                }}
                className={styles.Menu}
                theme="dark"
                mode="inline"
                items={[
                    {
                        key: Routes.HomePage,
                        icon: (
                            <Tooltip className={styles.SiderTooltip} placement="right" title={"Accounts"}>
                                <MdOutlineViewComfy className={styles.ItemIcon}/>
                            </Tooltip>
                        ),
                    },
                    {
                        key: Routes.SettingsPage,
                        icon: (
                            <Tooltip className={styles.SiderTooltip}  placement="right" title={"Settings"}>
                                <MdOutlineSettings className={styles.ItemIcon}/>
                            </Tooltip>
                        ),
                    }
                ]}
            />
        </S>
    )
}