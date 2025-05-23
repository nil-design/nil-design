export const kebabToPascal = (text: string) => {
    if (text.includes('-')) {
        return text
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');
    }
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
