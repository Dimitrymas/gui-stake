import { useState, useEffect } from 'react';

type WailsResponse<T> = {
    data: T | null;
    error: Error | null;
    loading: boolean;
};

// Типизация функции бэкенда
type BackendFunction<T> = (...args: any[]) => Promise<T>;

// Кастомный хук для работы с Wails
export const useWails = <T>(backendFunction: BackendFunction<T>, ...args: any[]): WailsResponse<T> => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await backendFunction(...args);
                setData(response);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err);
                } else {
                    setError(new Error('Неизвестная ошибка'));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData().then();
    }, [backendFunction, ...args]);

    return { data, error, loading };
};
