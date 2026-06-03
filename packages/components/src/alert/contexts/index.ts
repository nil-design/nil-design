import { createContextSuite } from '@nild/shared';
import type { AlertType } from '../interfaces';

const [AlertProvider, useAlertContext] = createContextSuite<{ type: AlertType }>({
    defaultValue: {
        type: 'info',
    },
});

export { AlertProvider, useAlertContext };
