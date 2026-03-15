import noHardcodedColors from '../no-hardcoded-colors';
import { asJsx, asTs, asTsx, asVue, ruleTester } from './utils';

ruleTester.run('@nild/no-hardcoded-colors', noHardcodedColors, {
    valid: [
        asTs("const token = 'var(--text-main)';"),
        asTs("const className = 'text-red-500';"),
        asTs("const className = 'text-brand';"),
        asTs("const sentence = 'border: 1px solid red';"),
        asTs("const sentence = 'prefix #fff suffix';"),
        asTs("const sentence = 'rgb(255, 0, 0) and more';"),
        asTs('const fill = token;'),
        asTs('const color = `brand-red`;'),
        asTsx('const icon = <svg fill={token} />;'),
        asJsx('const icon = <svg fill={currentColor} />;'),
        asVue('<template><div :style="{ color: \'var(--text-main)\' }" /></template>'),
        asVue('<template><div class="text-red-500" /></template>'),
    ],
    invalid: [
        {
            ...asTs("const value = '#fff';"),
            errors: [{ messageId: 'unexpectedColor' }],
        },
        {
            ...asTs("const value = ' red\\n';"),
            errors: [{ messageId: 'unexpectedColor' }],
        },
        {
            ...asTs('const value = `rgb(255, 0, 0)`;'),
            errors: [{ messageId: 'unexpectedColor' }],
        },
        {
            ...asTs("const value = 'red';"),
            errors: [{ messageId: 'unexpectedColor' }],
        },
        {
            ...asTs("const value = '\\n#ffffff\\n';"),
            errors: [{ messageId: 'unexpectedColor' }],
        },
        {
            ...asTsx('const icon = <svg fill="rgb(255, 0, 0)" />;'),
            errors: [{ messageId: 'unexpectedColor' }],
        },
        {
            ...asVue('<template><svg fill="rgb(255, 0, 0)" /></template>'),
            errors: [{ messageId: 'unexpectedColor' }],
        },
        {
            ...asVue('<template><svg :fill="\'red\'" /></template>'),
            errors: [{ messageId: 'unexpectedColor' }],
        },
    ],
});
