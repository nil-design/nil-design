import { isUndefined } from 'lodash-es';

const browser = !!(!isUndefined(window) && window.document && window.document.createElement);

const isBrowser = () => browser;

export default isBrowser;
