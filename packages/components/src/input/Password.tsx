import { useControllableState } from '@nild/hooks';
import { Icon } from '@nild/icons';
import PreviewCloseOne from '@nild/icons/PreviewCloseOne';
import PreviewOpen from '@nild/icons/PreviewOpen';
import { ChangeEvent, forwardRef } from 'react';
import Input from './Input';
import { PasswordProps } from './interfaces';
import Suffix from './Suffix';

const Password = forwardRef<HTMLInputElement, PasswordProps>(
    (
        {
            value: externalValue,
            defaultValue = '',
            visible: visibleProp,
            defaultVisible = false,
            onChange,
            onVisibleChange,
            ...restProps
        },
        ref,
    ) => {
        const [visible, setVisible] = useControllableState<boolean>(visibleProp, defaultVisible);
        const [value, setValue] = useControllableState<string>(externalValue, defaultValue);

        const handleToggle = () => {
            const nextVisible = !visible;

            setVisible(nextVisible);
            onVisibleChange?.(nextVisible);
        };

        const handleChange = (v: string | number, evt: ChangeEvent<HTMLInputElement>) => {
            setValue(String(v));
            onChange?.(String(v), evt);
        };

        return (
            <Input ref={ref} type={visible ? 'text' : 'password'} value={value} onChange={handleChange} {...restProps}>
                <Suffix
                    onClick={handleToggle}
                    className="cursor-pointer flex items-center hover:text-brand transition-colors"
                >
                    <Icon component={visible ? PreviewOpen : PreviewCloseOne} />
                </Suffix>
            </Input>
        );
    },
);

Password.displayName = 'Input.Password';

export default Password;
