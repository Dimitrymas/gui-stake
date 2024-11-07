import {store} from "../store";
import {AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from "axios";
import {authSlice} from "../features/auth/authSlice.ts";
import {CustomError, ErrorType, handleNoAccessTokenError, handleSignInvalidError,} from "./errors.ts";
import {toast} from "react-toastify";

// Список исключаемых путей с поддержкой регулярных выражений
const excludedPaths = [
    /^\/user\/mnemonic$/,
    /^\/user\/login$/,
    /^\/user\/register$/,
];

const handleRequest = async (config: InternalAxiosRequestConfig) => {
    if (excludedPaths.some((regex) => regex.test(config.url ?? ''))) {
        return config;
    }
    const token = store.getState().authReducer?.token;
    if (!token) return Promise.reject(handleNoAccessTokenError());

    config.headers.Authorization = `Bearer ${token}`;

    return config;
};

const handleResponse = async (response: AxiosResponse) => {
    const {sign, message, warning} = response.data;
    if (sign) {
        if (!(await verifySignature(response.data))) {
            toast.error('Signature is not verified');
            return Promise.reject(handleSignInvalidError());
        }
        delete response.data.sign;
    }
    if (message) {
        if (warning) {
            toast.warning(warning);
        } else {
            toast.success(message);
        }
    }
    return response;
};


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const handleError = async (error) => {
    const {status, data} = error.response || {};

    // Обработка кастомных ошибок
    if (error instanceof CustomError) {
        if (error.type === ErrorType.SignInvalid || error.type === ErrorType.NoAccessToken) {
            toast.error(error.message);
            store.dispatch(authSlice.actions.logout());
        }
        return Promise.reject(error);
    }

    // Обработка ошибки 401
    if (status === 401) {
        store.dispatch(authSlice.actions.logout());
        return Promise.reject(handleNoAccessTokenError());
    }

    // Обработка остальных ошибок (например, статус 400 или другие)
    if (data?.error) {
        let details = "";

        // Если присутствуют errors, добавляем их в details
        if (data.errors) {
            details = Object.entries(data.errors)
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n');
        }

        // Выводим сообщение об ошибке и дополнительные подробности
        toast.error(`${data.error}\n${details}`);
    } else {
        // Обработка ошибок, не относящихся к кастомным или 401
        toast.error('Something went wrong');
    }

    return Promise.reject(error);
};


export const setupInterceptors = (apiInstance: AxiosInstance) => {
    apiInstance.interceptors.request.use(handleRequest, Promise.reject);
    apiInstance.interceptors.response.use(handleResponse, handleError);
};

async function importPublicKey(base64Key: string) {
    const binaryDerString = atob(base64Key);
    const binaryDer = new Uint8Array(binaryDerString.length);
    for (let i = 0; i < binaryDerString.length; i++) {
        binaryDer[i] = binaryDerString.charCodeAt(i);
    }

    return await crypto.subtle.importKey(
        "spki",  // Используем формат spki для публичного ключа
        binaryDer.buffer,
        {
            name: "RSASSA-PKCS1-v1_5",  // Используем PKCS#1 v1.5
            hash: {name: "SHA-256"}, // Алгоритм хеширования
        },
        true,
        ["verify"]
    );
}



// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
async function verifySignature(data) {
    try {
        const {sign, ...dataToVerify} = data;
        const decodedSign = atob(sign);
        const signature = new Uint8Array([...decodedSign].map(c => c.charCodeAt(0)));
        const publicKeyPem = store.getState().authReducer?.publicKey || data.publicKey;
        if (!publicKeyPem) {
            return false;
        }
        const publicKey = await importPublicKey(publicKeyPem);
        const dataString = JSON.stringify(dataToVerify);
        const encoder = new TextEncoder();
        const encodedData = encoder.encode(dataString);

        return await crypto.subtle.verify(
            {
                name: "RSASSA-PKCS1-v1_5"
            },
            publicKey,
            signature,
            encodedData
        );

    } catch (e) {
        console.log(e)
    }
}
