export const isValidTelegramUsername = (username: string) => {
    return username.length >= 4 && username.length <= 32 && /^[a-zA-Z0-9_]+$/.test(username) && !username[0].match(/[0-9]/);
}