const pascalize = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

const kebabToPascal = (text: string) => {
    const resolvedText = text.trim();

    if (resolvedText.includes('-')) {
        return resolvedText
            .split('-')
            .map(word => pascalize(word))
            .join('');
    }

    return pascalize(resolvedText);
};

export default kebabToPascal;
