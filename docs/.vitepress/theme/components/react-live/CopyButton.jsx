import { DynamicIcon } from '@nild/icons';
import { useEffect, useRef, useState } from 'react';
import styles from './style';

const CopyButton = ({ code, labels }) => {
    const [copied, setCopied] = useState(false);
    const timerRef = useRef(null);
    const label = copied ? labels.copied : labels.idle;

    const handleClick = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => setCopied(false), 1000);
    };

    useEffect(() => () => window.clearTimeout(timerRef.current), []);

    return (
        <button type="button" className={styles.actionButton()} aria-label={label} title={label} onClick={handleClick}>
            <span className={styles.iconStack()}>
                {copied ? (
                    <DynamicIcon name="check" className="text-brand" />
                ) : (
                    <>
                        <DynamicIcon name="copy" className={styles.copyIcon()} />
                        <DynamicIcon name="copy" variant="filled" className={styles.copyIcon({ hover: true })} />
                    </>
                )}
            </span>
        </button>
    );
};

export default CopyButton;
