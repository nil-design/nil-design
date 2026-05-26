#!/usr/bin/env node
/* eslint-disable no-console */
/* global document, window */
import { access, mkdir, readdir, rm } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const rootDir = resolve(fileURLToPath(new URL('..', import.meta.url)));
const docsDir = join(rootDir, 'docs');
const screenshotsDir = join(docsDir, '.screenshots');

const DEFAULT_BRAND_H = 255;
const DEFAULT_DEV_HOST = '127.0.0.1:5173';
const DEFAULT_LOCALES = ['zh-CN'];
const DEFAULT_MODE = 'light';
const DEVICE_SCALE_FACTOR = 2;
const EXCLUDED_COMPONENTS = new Set(['icon', 'watermark', 'transition']);
const MODES = new Set(['light', 'dark', 'both']);
const VIEWPORT = { width: 1440, height: 1000 };
const SCREENSHOT_STYLE = `
.VPNav,
.VPLocalNav,
.VPSidebar,
.VPDocAside,
.VPBackToTop,
.vp-raw.fixed.z-39 {
    visibility: hidden !important;
}
`;

const DEFAULT_BEHAVIORS = [{ state: 'default' }];

const COMPONENT_BEHAVIORS = {
    input: [
        {
            state: 'focused',
            prepare: async page => {
                const input = page.locator('.react-live input:not([disabled])').first();

                await waitForVisible(input, 'available input demo control');
                await input.scrollIntoViewIfNeeded();
                await input.focus();
                await page.waitForFunction(() => document.activeElement?.matches('.react-live input'));
            },
        },
    ],
    modal: [
        {
            state: 'dialog',
            prepare: async page => {
                await page.getByRole('button', { name: 'Open dialog' }).click();
                await page.getByRole('dialog', { name: 'Delete confirmation' }).waitFor({ state: 'visible' });
            },
        },
        {
            state: 'drawer',
            prepare: async page => {
                await page.getByRole('button', { name: 'Open drawer' }).click();
                await page.getByRole('dialog', { name: 'Filter panel' }).waitFor({ state: 'visible' });
            },
        },
    ],
    popover: [
        {
            state: 'hover',
            prepare: async page => {
                await hoverPromptTrigger(page);
            },
        },
    ],
    select: [
        {
            state: 'opened',
            prepare: async page => {
                const target = await getDemoTargetByHeading(page, {
                    headingTexts: ['\u57fa\u7840\u591a\u9009', 'Basic multiple'],
                    selector: '.nd-select-trigger',
                });

                if (target) {
                    try {
                        await target.scrollIntoViewIfNeeded();
                        await target.click();
                    } finally {
                        await target.dispose();
                    }
                } else {
                    const fallback = page
                        .locator('.react-live .nd-select-trigger')
                        .filter({ hasText: 'CSS, React' })
                        .first();

                    await waitForVisible(fallback, 'basic multiple select trigger');
                    await fallback.scrollIntoViewIfNeeded();
                    await fallback.click();
                }

                await page.locator('[role="listbox"]').first().waitFor({ state: 'visible' });
            },
        },
    ],
    switch: [
        {
            state: 'checked',
            prepare: async page => {
                const switcher = page.locator('.react-live [role="switch"]:not(:disabled)').first();

                await waitForVisible(switcher, 'available switch demo control');
                await switcher.scrollIntoViewIfNeeded();

                if ((await switcher.getAttribute('aria-checked')) !== 'true') {
                    await switcher.click();
                }

                await page.waitForFunction(() => {
                    return (
                        document.querySelector('.react-live [role="switch"]')?.getAttribute('aria-checked') === 'true'
                    );
                });
            },
        },
    ],
    tooltip: [
        {
            state: 'hover',
            prepare: async page => {
                await hoverPromptTrigger(page);
            },
        },
    ],
};

const printHelp = () => {
    console.log(`Usage: pnpm docs:screenshot -- [options]

Options:
  --locales <list>       Comma-separated locale list. Default: zh-CN
  --brand-h <list>       One or more --nd-brand-h values. Default: 255
  --mode <mode>          Screenshot mode: light, dark, or both. Default: light
  --dev-host <host>      Docs dev server host. Default: 127.0.0.1:5173
  --help                 Show this help message
`);
};

const parseArgs = args => {
    const options = {
        brandHValues: [DEFAULT_BRAND_H],
        devHost: DEFAULT_DEV_HOST,
        help: false,
        locales: DEFAULT_LOCALES,
        modes: [DEFAULT_MODE],
    };

    for (let idx = 0; idx < args.length; idx += 1) {
        const arg = args[idx];

        if (arg === '--') {
            continue;
        }

        if (arg === '--help' || arg === '-h') {
            options.help = true;
            continue;
        }

        if (arg === '--mode') {
            const mode = args[++idx];

            if (!MODES.has(mode)) {
                throw new Error('--mode must be light, dark, or both.');
            }

            options.modes = mode === 'both' ? ['light', 'dark'] : [mode];
            continue;
        }

        if (arg === '--locales') {
            const locales = args[++idx]?.split(',').filter(Boolean) ?? [];

            if (locales.length === 0) {
                throw new Error('--locales must include at least one locale.');
            }

            options.locales = locales;
            continue;
        }

        if (arg === '--brand-h') {
            const values = [];

            while (idx + 1 < args.length && !args[idx + 1].startsWith('--')) {
                values.push(args[++idx]);
            }

            const brandHValues = values
                .join(' ')
                .split(/[,\s]+/)
                .filter(Boolean)
                .map(value => Number(value));

            if (brandHValues.length === 0 || brandHValues.some(value => !Number.isFinite(value))) {
                throw new Error('--brand-h must include at least one finite number.');
            }

            options.brandHValues = brandHValues;
            continue;
        }

        if (arg === '--dev-host') {
            const devHost = args[++idx];

            if (!devHost || devHost.startsWith('--')) {
                throw new Error('--dev-host requires a value.');
            }

            options.devHost = devHost;
            continue;
        }

        throw new Error(`Unknown argument: ${arg}`);
    }

    const cleanDevHost = options.devHost.replace(/\/+$/, '');

    return {
        ...options,
        baseUrl: /^https?:\/\//.test(cleanDevHost) ? cleanDevHost : `http://${cleanDevHost}`,
    };
};

const ensureDevServer = async (baseUrl, locale) => {
    const url = new URL(`/${locale}/components/`, baseUrl);

    try {
        const response = await fetch(url, { signal: AbortSignal.timeout(5000) });

        if (!response.ok) {
            throw new Error(`status ${response.status}`);
        }
    } catch (error) {
        throw new Error(
            `Docs dev server is not available at ${url.toString()} (${error.message}). Run pnpm docs:dev first.`,
        );
    }
};

const getComponentRoutes = async locale => {
    const componentsDir = join(docsDir, locale, 'components');

    try {
        await access(componentsDir);
    } catch {
        throw new Error(`Missing components docs directory: ${relative(rootDir, componentsDir)}`);
    }

    const entries = await readdir(componentsDir, { withFileTypes: true });
    const components = [];

    for (const entry of entries) {
        if (!entry.isDirectory() || EXCLUDED_COMPONENTS.has(entry.name)) {
            continue;
        }

        try {
            await access(join(componentsDir, entry.name, 'index.md'));
        } catch {
            continue;
        }

        components.push({
            name: entry.name,
            route: `/${locale}/components/${entry.name}/`,
        });
    }

    components.sort((a, b) => a.name.localeCompare(b.name));

    if (components.length === 0) {
        throw new Error(`No component docs found under ${relative(rootDir, componentsDir)}`);
    }

    return { components, locale };
};

const clearScreenshots = async () => {
    await rm(screenshotsDir, { force: true, recursive: true });
    await mkdir(screenshotsDir, { recursive: true });
};

const waitForVisible = async (locator, description) => {
    try {
        await locator.waitFor({ state: 'visible', timeout: 5000 });
    } catch {
        throw new Error(`Could not find ${description}.`);
    }
};

const waitForPageSettled = async page => {
    await page.evaluate(() => document.fonts?.ready).catch(() => {});
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(250);
};

const openComponentPage = async (page, item, options) => {
    await page.goto(new URL(item.route, options.baseUrl).toString(), { waitUntil: 'domcontentloaded' });
    await page.locator('.vp-doc').waitFor({ state: 'visible' });
    await waitForPageSettled(page);
    await applyMode(page, options.mode === 'dark');
};

const applyMode = async (page, dark) => {
    await page.evaluate(targetDark => {
        document.documentElement.classList.toggle('dark', targetDark);
        document.documentElement.style.colorScheme = targetDark ? 'dark' : 'light';
    }, dark);
};

const applyBrandH = async (page, brandH) => {
    await page.evaluate(value => {
        document.documentElement.style.setProperty('--nd-brand-h', String(value));
    }, brandH);
};

const getDemoTargetByHeading = async (page, { headingTexts, selector }) => {
    const handle = await page.evaluateHandle(
        ({ headingTexts: texts, selector: targetSelector }) => {
            const normalize = value => value.replace(/\u200B/g, '').trim();
            const demos = [...document.querySelectorAll('.react-live')];

            for (const demo of demos) {
                let $node = demo.previousElementSibling;

                while ($node && !/^H[2-6]$/.test($node.tagName)) {
                    $node = $node.previousElementSibling;
                }

                if (!$node) {
                    continue;
                }

                const heading = normalize($node.textContent ?? '');

                if (texts.some(text => heading.includes(text))) {
                    return demo.querySelector(targetSelector);
                }
            }

            return null;
        },
        { headingTexts, selector },
    );
    const element = handle.asElement();

    if (!element) {
        await handle.dispose();

        return null;
    }

    return element;
};

const hoverPromptTrigger = async page => {
    await page.mouse.move(0, 0);
    await page.waitForTimeout(150);

    const trigger = page.locator('.react-live .nd-popup-trigger').filter({ hasText: 'Hover me' }).first();

    await waitForVisible(trigger, 'Hover me popup trigger');
    await trigger.hover();
    await page.waitForFunction(
        () => {
            return (
                [...document.querySelectorAll('.nd-popup-portal')].filter(element => {
                    const rect = element.getBoundingClientRect();
                    const style = window.getComputedStyle(element);

                    return (
                        element.textContent?.includes('Prompt Text') &&
                        rect.width > 0 &&
                        rect.height > 0 &&
                        style.visibility !== 'hidden' &&
                        style.opacity !== '0'
                    );
                }).length > 0
            );
        },
        undefined,
        { timeout: 5000 },
    );
};

const closeTransientUI = async page => {
    const modalClose = page.locator('.nd-modal-close:visible').first();

    if ((await modalClose.count()) > 0) {
        await modalClose.click({ timeout: 1000 }).catch(() => {});
    }

    await page.keyboard.press('Escape').catch(() => {});
    await page.mouse.move(0, 0).catch(() => {});
    await page.waitForTimeout(200);
};

const slugify = value => {
    return String(value)
        .trim()
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
};

const getScreenshotFileName = (componentName, mode, brandH, state) => {
    return `${componentName}-h${slugify(brandH)}-${mode}-${slugify(state)}.png`;
};

const captureComponent = async (page, item, options) => {
    const componentName = slugify(item.name);
    const componentDir = join(screenshotsDir, item.locale, 'components', componentName);
    const behaviors = COMPONENT_BEHAVIORS[item.name] ?? DEFAULT_BEHAVIORS;

    await mkdir(componentDir, { recursive: true });
    await openComponentPage(page, item, options);

    for (const behavior of behaviors) {
        await closeTransientUI(page);

        if (behavior.prepare) {
            await behavior.prepare(page);
            await waitForPageSettled(page);
        }

        for (const brandH of options.brandHValues) {
            await applyBrandH(page, brandH);

            const filePath = join(
                componentDir,
                getScreenshotFileName(componentName, options.mode, brandH, behavior.state),
            );

            await page.screenshot({ fullPage: true, path: filePath, style: SCREENSHOT_STYLE });
            console.log(`Captured ${item.locale}/${componentName}/${relative(componentDir, filePath)}`);
        }

        await closeTransientUI(page);
    }
};

const main = async () => {
    const options = parseArgs(process.argv.slice(2));

    if (options.help) {
        printHelp();

        return;
    }

    const localeRouteGroups = [];

    for (const locale of options.locales) {
        localeRouteGroups.push(await getComponentRoutes(locale));
    }

    await ensureDevServer(options.baseUrl, options.locales[0]);
    await clearScreenshots();

    const browser = await chromium.launch();

    try {
        for (const mode of options.modes) {
            const captureOptions = { ...options, mode };
            const context = await browser.newContext({
                colorScheme: mode,
                deviceScaleFactor: DEVICE_SCALE_FACTOR,
                viewport: VIEWPORT,
            });
            const page = await context.newPage();

            for (const { components, locale } of localeRouteGroups) {
                console.log(
                    `Capturing ${components.length} ${mode} component pages for ${locale} at --nd-brand-h ${options.brandHValues.join(',')}...`,
                );

                for (const component of components) {
                    await captureComponent(page, { ...component, locale }, captureOptions);
                }
            }

            await context.close();
        }
    } finally {
        await browser.close();
    }

    console.log(`Screenshots saved to ${relative(rootDir, screenshotsDir)}`);
};

main().catch(error => {
    console.error(error.message);
    process.exit(1);
});
