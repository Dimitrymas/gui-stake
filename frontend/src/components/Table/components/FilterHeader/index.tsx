import {forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {useAppDispatch} from '../../../../hooks/redux.ts';
import {FilterSetting} from '../../../../features/settings/settingsSlice.ts';
import {ResizableWrapper} from '../../../ResizableWrapper';
import styles from './index.module.css';
import {Checkbox} from 'antd';
import {CheckboxChangeEvent} from 'antd/es/checkbox';
import {ActionCreatorWithPayload} from "@reduxjs/toolkit";

interface FilterHeaderProps {
    checkedSome: boolean;
    checkedAll: boolean;
    onCheckAll: (e: CheckboxChangeEvent) => void;
    settings: FilterSetting[];
    withEdit: boolean;
    setSettings: ActionCreatorWithPayload<FilterSetting[]>;
}

export const FilterHeader = forwardRef<HTMLDivElement, FilterHeaderProps>((
    {
        checkedAll,
        checkedSome,
        onCheckAll,
        settings,
        setSettings,
        withEdit,
    }: FilterHeaderProps,
    ref
) => {
    const [filteredSettings, setFilteredSettings] = useState<FilterSetting[]>([]);
    const dispatch = useAppDispatch();

    const namesRef = useRef<HTMLDivElement | null>(null);

    useImperativeHandle(ref, () => namesRef.current as HTMLDivElement);

    useEffect(() => {
        setFilteredSettings(settings.filter((e) => e.enabled));
    }, [settings]);


    const bindOnResize = useCallback((settingsIndex: number) => {
        return (width: number) => {
            const newSettings = settings.map((e, i) => {
                if (i === settingsIndex) {
                    return {...e, width};
                }
                return e;
            });
            dispatch(setSettings(newSettings));
        };
    }, [settings, dispatch, setSettings]);

    return (
        <div className={styles.FilterHeader}>
            <div className={styles.FilterHeaderNames} ref={namesRef}>
                <Checkbox
                    indeterminate={checkedAll}
                    checked={checkedSome}
                    onChange={onCheckAll}
                    className={withEdit ? styles.FilterHeaderCheckbox : undefined}
                />
                {filteredSettings.map(({name, width, minWidth, maxWidth}, index) => {
                    const isLastElement = index === filteredSettings.length - 1;

                    if (isLastElement) {
                        return (
                            <span
                                className={styles.FilterHeaderName}
                                style={{width: `${width}px`}}
                                key={index}
                            >
                                {name}
                            </span>
                        );
                    }

                    return (
                        <ResizableWrapper
                            defaultWidth={width}
                            onResize={bindOnResize(index)}
                            key={index}
                            minWidth={minWidth}
                            maxWidth={maxWidth}
                        >
                            <span className={styles.FilterHeaderName}>{name}</span>
                        </ResizableWrapper>
                    );
                })}
            </div>
        </div>
    );
});

FilterHeader.displayName = 'FilterHeader';