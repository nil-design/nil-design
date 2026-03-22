import { isBrowser } from '@nild/shared';

const getOwnerDocument = (...nodes: Array<Node | null | undefined>): Document | null => {
    const ownerDocument = nodes.find(node => node?.ownerDocument)?.ownerDocument;

    if (ownerDocument) {
        return ownerDocument;
    }

    return isBrowser() ? document : null;
};

export default getOwnerDocument;
