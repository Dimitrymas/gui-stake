import {
    useRef,
    useState,
    ReactNode,
    createContext,
    FC,
    useCallback,
} from "react";
import styles from "./index.module.css";
import {Tab} from "../Tab";
import {Tabs} from "../Tabs";
import {IoCloseOutline} from "react-icons/io5";


// Определяем интерфейс TabProps или импортируем его из компонента Tab
interface Item {
    tabIcon: ReactNode;
    tabText: string;
    element: ReactNode;
}

interface PopupOpenProps {
    width: number;
    items: Item[];
    closeable?: boolean
}

interface PopupProviderProps {
    children: ReactNode;
}

export interface PopupContextProps {
    openPopup: ({width, items}: PopupOpenProps) => void;
    closePopup: () => void;
}

export const PopupContext = createContext<PopupContextProps | undefined>(undefined);

export const PopupProvider: FC<PopupProviderProps> = ({children}: PopupProviderProps) => {
    const [activeTab, setActiveTab] = useState<number>(0);
    const [visible, setVisible] = useState<boolean>(false);
    const [currentWidth, setCurrentWidth] = useState<number>(0);
    const [currentItems, setCurrentItems] = useState<Item[]>([])
    const [rightIndent, setRightIndent] = useState<number>(0);
    const [isCloseable, setIsClosable] = useState<boolean>(true);
    const divRef = useRef<HTMLDivElement | null>(null);

    const openPopup = useCallback(({width, items, closeable}: PopupOpenProps) => {
        setCurrentItems(items);
        setCurrentWidth(width);
        setRightIndent(width);
        setVisible(true);
        setTimeout(() => {
            setRightIndent(0);
        }, 20)
        setIsClosable(closeable ?? true);

    }, [setCurrentWidth, setCurrentItems]);

    const closePopup = useCallback(() => {
        setVisible(false);
    }, [setVisible]);

    const handleClose = useCallback(() => {
        if (isCloseable) {
            closePopup();
        }
    }, [isCloseable, closePopup]);

    return (
        <PopupContext.Provider value={{openPopup, closePopup}}>
            {children}
            {visible && (
                <div className={styles.Popup}>
                    <div
                        className={styles.PopupShadow}
                        onClick={handleClose}
                    />
                    <div
                        className={styles.PopupContentWrapper}
                        style={{
                            width: `${currentWidth}px`,
                            right: `-${rightIndent}px`,
                        }}
                        ref={divRef}
                    >
                        <div className={styles.PopupContentHeader}>
                            <Tabs>
                                {currentItems.map((item, index) => (
                                    <Tab
                                        key={index}
                                        icon={item.tabIcon}
                                        text={item.tabText}
                                        enabled={index === activeTab}
                                        onClick={() => setActiveTab(index)}
                                    />
                                ))}
                            </Tabs>
                            {
                                isCloseable && (
                                    <IoCloseOutline className={styles.PopupContentHeaderIcon}
                                                    onClick={closePopup}/>
                                )
                            }
                        </div>
                        <div className={styles.PopupContent}>
                            {currentItems[activeTab].element}
                        </div>
                    </div>
                </div>
            )}
        </PopupContext.Provider>
    );
};
