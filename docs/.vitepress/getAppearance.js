/**
 * @returns {import('vitepress').UserConfig['appearance']}
 */
const getAppearance = () => {
    return {
        onChanged: (dark, defaultHandler) => {
            /* global document */
            const nextScheme = dark ? 'dark' : 'light';
            if (typeof document !== 'undefined' && document.startViewTransition) {
                document.startViewTransition(() => {
                    defaultHandler(nextScheme);
                });
            } else {
                defaultHandler(nextScheme);
            }
        },
    };
};

export default getAppearance;
