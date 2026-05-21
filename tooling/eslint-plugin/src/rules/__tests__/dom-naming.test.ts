import domNaming from '../dom-naming';
import { asTs, asTsx, asVue, ruleTester } from './utils';

ruleTester.run('@nild/dom-naming', domNaming, {
    valid: [
        asTs("const $root: HTMLDivElement = document.createElement('div');"),
        asTs("const $root = document.createElement('div');"),
        asTs('const value: string = "root";'),
        asTs('const root = getRoot();'),
        asTs('const node: Node | null = null;'),
        asTs('const elementName: HTMLElementTagNameMap = {};'),
        asTs('function update($root: HTMLDivElement) { return $root; }'),
        asTs('const update = ($root: HTMLElement | null = null) => $root;'),
        asTs('interface Props { root: HTMLDivElement }'),
        asTs('type Update = (root: HTMLDivElement) => void;'),
        asTs('class View { root: HTMLDivElement | null = null; }'),
        asTs('namespace Rule { export type Node = unknown; } const typedNode = value as Rule.Node;'),
        asTsx('const view = <div ref={rootRef} />;'),
        asVue('<script setup lang="ts">const $root = document.createElement("div");</script>'),
    ],
    invalid: [
        {
            ...asTs("const root: HTMLDivElement = document.createElement('div');"),
            errors: [{ messageId: 'missingDomPrefix' }],
        },
        {
            ...asTs('const root: HTMLElement | null = null;'),
            errors: [{ messageId: 'missingDomPrefix' }],
        },
        {
            ...asTs('const root = document.createElement("div");'),
            errors: [{ messageId: 'missingDomPrefix' }],
        },
        {
            ...asTs('const root = document.querySelector(".root");'),
            errors: [{ messageId: 'missingDomPrefix' }],
        },
        {
            ...asTs('const root = container.querySelector(".root") as HTMLDivElement;'),
            errors: [{ messageId: 'missingDomPrefix' }],
        },
        {
            ...asTs('const root = ref.current as HTMLElement | null;'),
            errors: [{ messageId: 'missingDomPrefix' }],
        },
        {
            ...asTs('function update(root: HTMLDivElement) { return root; }'),
            errors: [{ messageId: 'missingDomPrefix' }],
        },
        {
            ...asTs('const update = (container: HTMLElement | null = null) => container;'),
            errors: [{ messageId: 'missingDomPrefix' }],
        },
        {
            ...asTs('class View { mount(root: SVGElement) { return root; } }'),
            errors: [{ messageId: 'missingDomPrefix' }],
        },
        {
            ...asVue('<script setup lang="ts">const root = document.createElement("div");</script>'),
            errors: [{ messageId: 'missingDomPrefix' }],
        },
    ],
});
