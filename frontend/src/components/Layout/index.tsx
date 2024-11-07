import * as React from 'react';
import {Layout as L} from 'antd';
import styles from "./index.module.css"

import {Outlet} from "react-router-dom";
import {Content} from "antd/es/layout/layout";
import {Sider} from "./components/Sider";

export const Layout: React.FC = () => {
    return (
        <L className={styles.Layout}>
            <Sider/>
            <L>
                <Content className={styles.Content}>
                    <div className={styles.PageWrapper}>
                        <div className={styles.Page}>
                            <Outlet/>
                        </div>
                    </div>
                </Content>
            </L>
        </L>
    )
}