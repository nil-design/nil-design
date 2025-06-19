import React, { useState, useRef, useEffect, useMemo } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { cnJoin } from '@nild/shared';
import * as __Shared__ from '@nild/shared';
import * as __Components__ from '@nild/components';
import * as __Hooks__ from '@nild/hooks';
import { DynamicIcon, Icon } from '@nild/icons';
import Layers from '@nild/icons/Layers';
import replaceImports from './replaceImports';
import useTheme from './useTheme';

const ReactLive = ({ dark = false, code: encodedCode }) => {
    const [editorVisible, setEditorVisible] = useState(false);
    const [rawCode, setRawCode] = useState(decodeURIComponent(encodedCode));
    const [copyActive, setCopyActive] = useState(false);
    const [hasError, setHasError] = useState(false);
    const errorRef = useRef(null);
    const theme = useTheme(dark);
    const scope = useMemo(
        () => ({
            __React__: React,
            __Shared__,
            __Components__,
            __Hooks__,
            __Icons__: { DynamicIcon, Icon },
            __Icon_Layers__: Layers,
        }),
        [],
    );
    const resolvedCode = useMemo(
        () =>
            replaceImports(rawCode, {
                react: '__React__',
                '@nild/shared': '__Shared__',
                '@nild/components': '__Components__',
                '@nild/hooks': '__Hooks__',
                '@nild/icons': '__Icons__',
                '@nild/icons/Layers': '__Icon_Layers__',
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
        <LiveProvider noInline theme={theme} code={resolvedCode} scope={scope}>
            <div className="live-demo vp-raw flex flex-col rounded-lg bg-transparent border border-vp-divider">
                {<LivePreview className={cnJoin('live-preview px-6 py-8', hasError && 'hidden')} />}
                <div
                    className={cnJoin('live-error rounded-t-lg', hasError ? 'px-6 py-8 bg-vp-danger' : 'hidden')}
                    ref={errorRef}
                >
                    <LiveError className="m-0 whitespace-pre-wrap" />
                </div>
                <div
                    className={cnJoin(
                        'live-actions flex justify-end gap-4 px-4 py-2 text-vp-text-1 bg-vp-info',
                        !editorVisible && 'rounded-b-lg',
                    )}
                >
                    <button className="px-1 cursor-pointer" onClick={() => setEditorVisible(v => !v)}>
                        {editorVisible ? <DynamicIcon name="collapse-text-input" /> : <DynamicIcon name="code" />}{' '}
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
                        <DynamicIcon name="copy" variant={copyActive ? 'filled' : 'outline'} />
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
    );
};

export default ReactLive;
