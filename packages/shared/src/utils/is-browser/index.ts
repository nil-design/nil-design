const browser = typeof window !== 'undefined' && !!window.document?.createElement;

const isBrowser = () => browser;

export default isBrowser;
