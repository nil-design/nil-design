import { useControllable } from '@nild/hooks';
import { ChangeEvent, FC, ReactNode } from 'react';
import { cn } from '../_core/utils';

export interface SwitchProps {
    className?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?: (checked: boolean) => void;
}

const Switch: FC<SwitchProps> = ({ className, checked: checkedProp, defaultChecked = false, onChange }) => {
    const [checked, setChecked] = useControllable(checkedProp, defaultChecked);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setChecked(e.target.checked);
        onChange?.(e.target.checked);
    };

    return (
        <div className={cn('nd-switch', className)}>
            <input className="opacity-0" type="checkbox" checked={checked} onChange={handleChange} />
        </div>
    );
};

Switch.displayName = 'Switch';

export default Switch;
