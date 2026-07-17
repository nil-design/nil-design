// @vitest-environment jsdom
import { bench, describe } from 'vitest';
import Tabs from '..';
import mount from '../../_shared/__benchmarks__/mount';

describe('Tabs', () => {
    bench('mounts and unmounts a tab set', () => {
        mount(
            <Tabs defaultValue="profile">
                <Tabs.List>
                    <Tabs.Tab value="profile">Profile</Tabs.Tab>
                    <Tabs.Tab value="security">Security</Tabs.Tab>
                    <Tabs.Tab value="billing">Billing</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="profile">Profile panel</Tabs.Panel>
                <Tabs.Panel value="security">Security panel</Tabs.Panel>
                <Tabs.Panel value="billing">Billing panel</Tabs.Panel>
            </Tabs>,
        );
    });
});
