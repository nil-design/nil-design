import React, { useState, useRef, useEffect, useMemo } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { cnJoin } from '@nild/shared/utils';
import { IconProvider, DEFAULT_ICON_CONFIGS, Code, CollapseTextInput, Copy } from '@icon-park/react';
import * as __Components__ from '@nild/components';
import * as __Icons__ from '@nild/icons';
import replaceImports from './replaceImports';
import useTheme from './useTheme';

const ReactLive = ({ dark = false, code: encodedCode }) => {
    const scope = useMemo(() => ({ __React__: React, __Components__, __Icons__ }), []);
    const [editorVisible, setEditorVisible] = useState(false);
    const [rawCode, setRawCode] = useState(decodeURIComponent(encodedCode));
    const [copyActive, setCopyActive] = useState(false);
    const [hasError, setHasError] = useState(false);
    const errorRef = useRef(null);
    const theme = useTheme(dark);

    const resolvedCode = useMemo(
        () =>
            replaceImports(rawCode, {
                react: '__React__',
                '@nild/components': '__Components__',
                '@nild/icons': '__Icons__',
            }),
        [rawCode],
    );

    /** 未暴露 onError，监听 dom 收集状态 */
    useEffect(() => {
        if (!errorRef.current) return;

        const observer = new MutationObserver(() => {
            setHasError(!!errorRef.current.querySelector('pre'));
        });

        observer.observe(errorRef.current, {
            childList: true,
            subtree: true,
        });

        return () => observer.disconnect();
    }, []);

    return (
        <IconProvider value={{ ...DEFAULT_ICON_CONFIGS, size: 16, theme: 'outline' }}>
            <LiveProvider noInline theme={theme} code={resolvedCode} scope={scope}>
                <div className="live-demo vp-raw flex flex-col rounded-lg bg-transparent border border-vp-divider">
                    {<LivePreview className={cnJoin('live-preview px-6 py-8', hasError && 'hidden')} />}
                    <div
                        className={cnJoin('live-error rounded-t-lg', hasError ? 'px-6 py-8 bg-vp-danger' : 'hidden')}
                        ref={errorRef}
                    >
                        <LiveError className="m-0" />
                    </div>
                    <div
                        className={cnJoin(
                            'live-actions flex justify-end gap-4 px-4 py-2 text-vp-text-1 bg-vp-info',
                            !editorVisible && 'rounded-b-lg',
                        )}
                    >
                        <button className="px-1 cursor-pointer" onClick={() => setEditorVisible(v => !v)}>
                            {editorVisible ? <CollapseTextInput /> : <Code />}{' '}
                        </button>
                        <button
                            className="px-1 cursor-pointer"
                            onClick={() => {
                                navigator.clipboard.writeText(rawCode);
                            }}
                            onMouseDown={() => setCopyActive(true)}
                            onMouseUp={() => setCopyActive(false)}
                            onMouseLeave={() => setCopyActive(false)}
                        >
                            <Copy theme={copyActive ? 'filled' : 'outline'} />
                        </button>
                    </div>
                    {
                        <LiveEditor
                            className={cnJoin('live-editor', !editorVisible && 'hidden')}
                            code={rawCode}
                            onChange={setRawCode}
                        />
                    }
                </div>
            </LiveProvider>
        </IconProvider>
    );
};

export default ReactLive;
