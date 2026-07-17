import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import type { ReactNode } from 'react';

const mount = (children: ReactNode) => {
    const $container = document.createElement('div');
    const root = createRoot($container);

    document.body.append($container);

    try {
        flushSync(() => root.render(children));
    } finally {
        root.unmount();
        $container.remove();
    }
};

export default mount;
