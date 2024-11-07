import {Dispatch, SetStateAction} from "react";

interface ParseResult {
    invalid: boolean;
    ip?: string;
    port?: string;
    login?: string;
    pass?: string;
}

export const parseAndValidate = (input: string): ParseResult => {
    // Regular expressions for different formats
    const patterns = [
        /^(?<login>[^:]+):(?<pass>[^:]+):(?<ip>[^:]+):(?<port>\d+)$/, // login:pass:ip:port
        /^(?<login>[^:]+):(?<pass>[^@]+)@(?<ip>[^:]+):(?<port>\d+)$/,  // login:pass@ip:port
        /^(?<ip>[^:]+):(?<port>\d+):(?<login>[^:]+):(?<pass>[^:]+)$/,  // ip:port:login:pass
        /^(?<ip>[^:]+):(?<port>\d+)@(?<login>[^:]+):(?<pass>[^:]+)$/   // ip:port@login:pass
    ];

    // Pattern for ip:port only
    const ipPortPattern = /^(?<ip>[^:]+):(?<port>\d+)$/;

    // IP validation regex
    const validIpPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    // Function to validate IP
    const validateIp = (ip: string): boolean => validIpPattern.test(ip);

    // Test all patterns
    for (const pattern of patterns) {
        const match = input.match(pattern);
        if (match && match.groups) {
            const { login, pass, ip, port } = match.groups;
            if (!validateIp(ip)) {
                return { invalid: true }; // Invalid IP
            }

            return { invalid: false, ip, port, login, pass };
        }
    }

    // Test ip:port only
    const ipPortMatch = input.match(ipPortPattern);
    if (ipPortMatch && ipPortMatch.groups) {
        const { ip, port } = ipPortMatch.groups;
        if (!validateIp(ip)) {
            return { invalid: true }; // Invalid IP
        }
        return { invalid: false, ip, port };
    }

    // If no match, return invalid
    return { invalid: true };
};


export const validateField = (
    field: string,
    setInvalid: Dispatch<SetStateAction<boolean>>
): boolean => {
    if (!field) {
        setInvalid(true);
    }
    return !!field
};
