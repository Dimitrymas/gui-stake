import {message} from "antd";
import {Message} from "./Message.tsx";
import {MessageInstance} from "antd/es/message/interface";
import React from "react";


const messageSuccess = (content: string, duration?: number) => message.success(<Message message={content}/>, duration);
const messageError = (content: string, duration?: number) => message.error(<Message message={content}/>, duration);
const messageInfo = (content: string, duration?: number) => message.info(<Message message={content}/>, duration);
const messageWarning = (content: string, duration?: number) => message.warning(<Message message={content}/>, duration);


// возвращать типизированный объект
export const useCustomMessage = (): [MessageInstance, React.ReactNode] => {
    const [messageApi, contextHolder] = message.useMessage();

    const customMessageApi = {
        ...messageApi,
        success: messageSuccess,
        error: messageError,
        info: messageInfo,
        warning: messageWarning,
    }

    return [customMessageApi as MessageInstance, contextHolder];
}
