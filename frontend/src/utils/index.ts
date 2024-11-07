export const getValueByPath = (obj: { [key: string]: any }, path: string): any => {
    return path.split('.').reduce((acc: any, part: string) => {
        if (acc === null || acc === undefined) return undefined; // Проверка на null или undefined
        const arrayMatch = part.match(/(\w+)\[(\d+)]/); // Проверяем, есть ли индекс массива
        if (arrayMatch) {
            const [, key, index] = arrayMatch;
            return acc && acc[key] && acc[key][parseInt(index, 10)];
        }
        return acc && acc[part];
    }, obj);
};

