import { camelCase } from 'lodash-es';

const pascalize = (text: string) => {
    const camelizedText = camelCase(text);

    return camelizedText.charAt(0).toUpperCase() + camelizedText.slice(1);
};

export default pascalize;
