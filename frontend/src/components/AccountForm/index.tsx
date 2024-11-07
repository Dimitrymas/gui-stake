import {ChangeEvent, FC, useCallback, useState} from "react";
import styles from "./index.module.css";
import {parseAndValidate, validateField} from "./utils.ts";


export interface AccountFormOnSubmit {
    name: string,
    token: string,
    proxyType: string,
    proxyIp: string,
    proxyPort: string,
    proxyLogin: string,
    proxyPass: string,
}

interface AccountFormProps {
    onSubmit: (data: AccountFormOnSubmit) => void;
    defaultValues?: AccountFormOnSubmit;
}

export const AccountForm: FC<AccountFormProps> = ({onSubmit, defaultValues}: AccountFormProps) => {
    const [token, setToken] = useState<string>(defaultValues?.token || "");
    const [name, setName] = useState<string>(defaultValues?.name || "");
    const [proxyType, setProxyType] = useState<string | "http" | "socks5">(defaultValues?.proxyType || "");
    const [proxy, setProxy] = useState<string>(defaultValues?.proxyIp ? `${defaultValues.proxyIp}:${defaultValues.proxyPort}` : "");

    const [proxyInvalid, setProxyInvalid] = useState<boolean>(false);
    const [nameInvalid, setNameInvalid] = useState<boolean>(false);
    const [tokenInvalid, setTokenInvalid] = useState<boolean>(false);


    const onProxyChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setProxy(e.target.value);
        if (!e.target.value) {
            setProxyInvalid(false);
            return;
        }
        setProxyInvalid(parseAndValidate(e.target.value).invalid);
    }, [setProxy, setProxyInvalid]);

    const handleSubmit = useCallback(() => {
        let valid = validateField(name, setNameInvalid);
        valid = validateField(token, setTokenInvalid) && valid;

        const parsedProxy = parseAndValidate(proxy);
        if (parsedProxy.invalid && proxyType) {
            setProxyInvalid(true);
            valid = false;
        } else {
            setProxyInvalid(false);
        }

        if (nameInvalid || tokenInvalid || proxyInvalid) return;

        if (!valid) return;

        onSubmit({
            name,
            token,
            proxyType,
            proxyIp: parsedProxy.ip || "",
            proxyPort: parsedProxy.port || "",
            proxyLogin: parsedProxy.login || "",
            proxyPass: parsedProxy.pass || ""
        });
    }, [name, token, proxy, proxyType, nameInvalid, tokenInvalid, proxyInvalid, onSubmit]);

    const handleGetToken = useCallback(() => {
        console.log("https://stake.com/ru/settings/api")
    }, []);


    return (
        <div className={styles.AccountForm}>
            <div className={styles.InputWrapper} data-placeholder={"Name"}>
                <input
                    className={nameInvalid ? styles.InputInvalid : styles.Input}
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                        setNameInvalid(e.target.value.length === 0 || e.target.value.length > 50)
                    }}
                />
            </div>
            <div className={styles.TokenRow}>
                <div className={styles.InputWrapper} data-placeholder={"Token"}>
                    <input
                        className={tokenInvalid ? styles.InputInvalid : styles.Input}
                        value={token}
                        onChange={(e) => {
                            setToken(e.target.value)
                            setTokenInvalid(e.target.value.length !== 96)
                        }}
                    />
                </div>

                <button
                    className={styles.TokenButton}
                    onClick={handleGetToken}
                >
                    Get token
                </button>
            </div>
            <div className={styles.ProxyTypeRow}>
                <button
                    className={!proxyType ? styles.ProxyTypeButtonActive : styles.ProxyTypeButton}
                    onClick={() => {
                        setProxyType("")
                        setProxy("")
                        setProxyInvalid(false)
                    }}
                >
                    No proxy
                </button>
                <button
                    className={proxyType === "socks5" ? styles.ProxyTypeButtonActive : styles.ProxyTypeButton}
                    onClick={() => setProxyType("socks5")}
                >
                    SOCKS5
                </button>
                <button
                    className={proxyType === "http" ? styles.ProxyTypeButtonActive : styles.ProxyTypeButton}
                    onClick={() => setProxyType("http")}
                >
                    HTTP
                </button>
            </div>
            {
                proxyType && (
                    <div className={styles.ProxyRow} data-placeholder={"Proxy"}>
                        <input
                            placeholder={"Proxy string"}
                            className={proxyInvalid ? styles.InputInvalid : styles.Input}
                            value={proxy}
                            onChange={onProxyChange}
                        />
                    </div>
                )
            }
            <button
                className={styles.SubmitButton}
                onClick={handleSubmit}
            >
                Submit
            </button>
        </div>
    )
}