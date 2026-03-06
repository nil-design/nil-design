import { useControllableState } from '@nild/hooks';
import { Icon } from '@nild/icons';
import SearchIcon from '@nild/icons/Search';
import { forwardRef } from 'react';
import Input from './Input';
import { SearchProps } from './interfaces';
import Prefix from './Prefix';

const Search = forwardRef<HTMLInputElement, SearchProps>(
    (
        { value: externalValue, defaultValue = '', keyword: externalKeyword, defaultKeyword, onChange, ...restProps },
        ref,
    ) => {
        const [keyword, setKeyword] = useControllableState<string>(
            externalKeyword ?? externalValue,
            defaultKeyword ?? defaultValue,
        );

        const handleChange = (v: string | number, evt: React.ChangeEvent<HTMLInputElement>) => {
            setKeyword(String(v));
            onChange?.(String(v), evt);
        };

        return (
            <Input ref={ref} value={keyword} onChange={handleChange} {...restProps}>
                <Prefix>
                    <Icon component={SearchIcon} />
                </Prefix>
            </Input>
        );
    },
);

Search.displayName = 'Input.Search';

export default Search;
