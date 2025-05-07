import React, { useState } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import clsx from 'clsx';
import * as components from '@nild/components';
import useTheme from './useTheme';

const ReactLive = ({ dark = false, code: initialCode }) => {
    const [editorVisible, setEditorVisible] = useState(true);
    const [code, setCode] = useState(decodeURIComponent(initialCode));
    const theme = useTheme(dark);

    return (
        <LiveProvider noInline theme={theme} code={code} scope={{ React, ...components }}>
            <div className="live-demo flex flex-col">
                <LivePreview className="live-preview px-6 py-6 rounded-t-lg bg-[#65758529]" />
                <div className={clsx('live-actions flex justify-end gap-4 px-4 py-2 bg-[#202127]', !editorVisible && 'rounded-b-lg')}>
                    <button className="action-btn" onClick={() => setEditorVisible(v => !v)}>
                        {editorVisible ? '隐藏代码' : '显示代码'}
                    </button>
                    <button
                        className="action-btn"
                        onClick={() => {
                            navigator.clipboard.writeText(code);
                        }}
                    >
                        复制代码
                    </button>
                </div>
                {editorVisible && <LiveEditor className="live-editor" onChange={setCode} />}
                <LiveError />
            </div>
        </LiveProvider>
    );
};

export default ReactLive;
