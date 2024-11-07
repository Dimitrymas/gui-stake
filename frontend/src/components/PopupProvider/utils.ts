import {useContext} from "react";
import {PopupContext, PopupContextProps} from "./index.tsx";

export const usePopup = (): PopupContextProps => {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error('usePopup должен использоваться внутри PopupProvider');
    }
    return context;
};