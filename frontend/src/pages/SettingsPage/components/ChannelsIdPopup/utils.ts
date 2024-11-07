export const isValidTelegramID = (id: string) => {
    // Разрешаем ID пользователей и ID каналов/групп с префиксом -100
    return (/^\d+$/.test(id) && id.length >= 7 && id.length <= 13) ||
        (/^-100\d{1,13}$/.test(id) && id.length <= 15);
}