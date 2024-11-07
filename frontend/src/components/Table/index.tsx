import React, {FC, ReactNode, useCallback, useState} from "react";
import styles from "./index.module.css"
import {FilterHeader} from "./components/FilterHeader";
import {Row} from "./components/Row";
import {ActionFooter} from "./components/ActionFooter";
import {FilterSetting} from "../../features/settings/settingsSlice.ts";
import {ActionCreatorWithPayload} from "@reduxjs/toolkit";

interface TableProps {
    rows: { id: string }[],
    onEdit?: (id: string) => void,
    onDelete: (ids: string[]) => void,
    tabs?: ReactNode,
    settings: FilterSetting[],
    setSettings: ActionCreatorWithPayload<FilterSetting[]>;
}

export const Table: FC<TableProps> = ({rows, onEdit, onDelete, tabs, setSettings, settings}: TableProps) => {
    const [checked, setChecked] = useState<string[]>([])
    const filterHeaderRef = React.useRef<HTMLDivElement | null>(null)

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        if (filterHeaderRef.current) {
            filterHeaderRef.current.scrollLeft = e.currentTarget.scrollLeft
        }
    }, [filterHeaderRef])

    const handleCheckAll = useCallback(() => {
        if (checked.length === rows.length) {
            setChecked([])
        } else {
            setChecked(rows.map((account) => account.id))
        }
    }, [checked, rows])

    const handleCheck = useCallback((id: string) => {
        if (checked.includes(id)) {
            setChecked(checked.filter((checkedId) => checkedId !== id))
        } else {
            setChecked([...checked, id])
        }
    }, [checked])

    const handleDelete = useCallback(() => {
        onDelete(checked)
        setChecked([])
    }, [checked, onDelete])

    return (
        <div className={styles.Table}>
            {tabs}
            <div className={styles.TableContent}>
                <FilterHeader
                    checkedAll={checked.length === rows.length && rows.length > 0}
                    checkedSome={checked.length > 0}
                    onCheckAll={handleCheckAll}
                    ref={filterHeaderRef}
                    withEdit={!!onEdit}
                    settings={settings}
                    setSettings={setSettings}
                />
                <div className={styles.TableRows} onScroll={handleScroll}>
                    {rows.map((rowData) => (
                        <Row
                            onEdit={onEdit}
                            key={rowData.id}
                            data={rowData}
                            checked={checked.includes(rowData.id)}
                            onCheck={handleCheck}
                            settings={settings}
                        />
                    ))}
                </div>
            </div>
            <ActionFooter onDelete={handleDelete}/>
        </div>
    )
}