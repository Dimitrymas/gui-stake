
export const handleWailsError = (setError: (error: string) => void, obj: { error: string }): boolean => {
    if (obj.error) {
        setError(obj.error);
        return true;
    }
    return false
}
