/**
 * @returns {import('vitepress').UserConfig['appearance']}
 */
const getAppearance = () => {
    return {
        onChanged: (dark, defaultHandler) => {
            /* global document */
            const nextScheme = dark ? 'dark' : 'light';
            if (typeof document !== 'undefined' && document.startViewTransition) {
                if (document.readyState === 'complete') {
                    const scheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
                    if (scheme === nextScheme) return;
                    document.startViewTransition(() => {
                        defaultHandler(nextScheme);
                    });
                } else {
                    defaultHandler(nextScheme);
                }
            } else {
                defaultHandler(nextScheme);
            }
        },
    };
};

export default getAppearance;
