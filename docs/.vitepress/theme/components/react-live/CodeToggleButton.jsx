import { DynamicIcon } from '@nild/icons';
import styles from './style';

const CodeToggleButton = ({ editorVisible, labels, onClick }) => {
    const label = editorVisible ? labels.visible : labels.hidden;

    return (
        <button
            type="button"
            className={styles.actionButton()}
            aria-label={label}
            aria-pressed={editorVisible}
            title={label}
            onClick={onClick}
        >
            <span className={styles.iconStack()}>
                <DynamicIcon name={editorVisible ? 'collapse-text-input' : 'code'} />
            </span>
        </button>
    );
};

export default CodeToggleButton;
