import { ref, computed, unref } from 'vue';

const useTheme = isDark => {
    const theme = ref('base');
    const themeVariables = computed(() => {
        const dark = unref(isDark);

        return {
            darkMode: dark,
            mainBkg: dark ? '#161618' : '#F6F6F7',
            primaryColor: dark ? '#A8B1FF' : '#3451B2',
            primaryTextColor: dark ? '#E1E4E8' : '#24292E',
            primaryBorderColor: dark ? '#A8B1FF' : '#3451B2',
            lineColor: dark ? '#9ECBFF' : '#032F62',
        };
    });

    return {
        theme,
        themeVariables,
    };
};

export default useTheme;
