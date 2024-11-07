export enum ErrorType {
    NoAccessToken,
    SignInvalid,
}


export class CustomError extends Error {
    type: ErrorType;

    constructor(message: string, type: ErrorType) {
        super(message);
        this.type = type;
        this.name = 'CustomError';
    }
}

export const handleNoAccessTokenError = (): CustomError => {
    return new CustomError('Unauthorized', ErrorType.NoAccessToken);
};

export const handleSignInvalidError = (): CustomError => {
    return new CustomError('Signature is not verified', ErrorType.SignInvalid);
}
