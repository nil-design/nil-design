import booleanNaming from '../boolean-naming';
import { asTs, asVue, ruleTester } from './utils';

ruleTester.run('@nild/boolean-naming', booleanNaming, {
    valid: [
        asTs('const ready: boolean = true;'),
        asTs('const dialogStatus: boolean = true;'),
        asTs('const authState = true;'),
        asTs('const foo = true;'),
        asTs('const custom = true;'),
        asTs('const checkout = true;'),
        asTs('const loading = true;'),
        asTs('const loaded = true;'),
        asTs('const loading2 = true;'),
        asTs('const dialogOpen = true;'),
        asTs('const request_pending = true;'),
        asTs('function isVisible(): boolean { return true; }'),
        asTs('function areDepsEqual(): boolean { return true; }'),
        asTs('const isReady = () => true;'),
        asTs('interface Props { open?: boolean }'),
        asTs('interface Props { submitDisabled: boolean }'),
        asTs('type State = { errored: boolean };'),
        asTs('type State = { requestPending: boolean };'),
        asTs('class Popup { open = true; }'),
        asTs('class Popup { visible = true; }'),
        asTs('const info = { directory: true };'),
        asTs("const info = { 'directory': true };"),
        asTs('const info = { panelCollapsed: true };'),
        asTs('const info = { isVisible: () => true };'),
        asTs('const isVisible = () => true; const info = { isVisible };'),
        asTs("const info = { ['isVisible']: true };"),
        asTs('const info = { panelCondition: true };'),
        asTs('class Popup { get open(): boolean { return true; } }'),
        asTs('class Popup { get loadingState(): boolean { return true; } }'),
        asTs('type Checks = { isVisible: () => boolean };'),
        asTs('type Foo = { value: string }; const isButtonElement = (value: unknown): value is Foo => true;'),
        asVue('<script setup lang="ts">const ready: boolean = true;</script>'),
        asVue('<script setup lang="ts">const dialogStatus: boolean = true;</script>'),
    ],
    invalid: [
        {
            ...asTs('const isReady: boolean = true;'),
            errors: [{ messageId: 'unexpectedDataPrefix' }],
        },
        {
            ...asTs('function visible(): boolean { return true; }'),
            errors: [{ messageId: 'missingFunctionPrefix' }],
        },
        {
            ...asTs('const areReady: boolean = true;'),
            errors: [{ messageId: 'unexpectedDataPrefix' }],
        },
        {
            ...asTs('interface Props { isOpen?: boolean }'),
            errors: [{ messageId: 'unexpectedDataPrefix' }],
        },
        {
            ...asTs('type State = { hasError: boolean };'),
            errors: [{ messageId: 'unexpectedDataPrefix' }],
        },
        {
            ...asTs('class Popup { isOpen = true; }'),
            errors: [{ messageId: 'unexpectedDataPrefix' }],
        },
        {
            ...asTs('const info = { isDirectory: true };'),
            errors: [{ messageId: 'unexpectedDataPrefix' }],
        },
        {
            ...asTs("const info = { 'isDirectory': true };"),
            errors: [{ messageId: 'unexpectedDataPrefix' }],
        },
        {
            ...asTs('const open = true; const info = { isOpen: open };'),
            errors: [{ messageId: 'unexpectedDataPrefix' }],
        },
        {
            ...asTs('const info = { visible: () => true };'),
            errors: [{ messageId: 'missingFunctionPrefix' }],
        },
        {
            ...asTs('const isVisible = () => true; const info = { visible: isVisible };'),
            errors: [{ messageId: 'missingFunctionPrefix' }],
        },
        {
            ...asTs('class Popup { get isOpen(): boolean { return true; } }'),
            errors: [{ messageId: 'unexpectedDataPrefix' }],
        },
        {
            ...asTs('type Checks = { visible: () => boolean };'),
            errors: [{ messageId: 'missingFunctionPrefix' }],
        },
        {
            ...asTs('const info = { visible() { return true; } };'),
            errors: [{ messageId: 'missingFunctionPrefix' }],
        },
        {
            ...asVue('<script setup lang="ts">const isReady: boolean = true;</script>'),
            errors: [{ messageId: 'unexpectedDataPrefix' }],
        },
    ],
});
