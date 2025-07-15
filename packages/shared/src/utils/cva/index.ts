import { UnionToIntersection } from '../../interfaces';
import cnJoin, { ClassValue } from '../cn-join';

type BooleanVariant = {
    true: ClassValue;
    false: ClassValue;
};

type UnionVariant<T> = UnionToIntersection<T extends string | number ? { [K in T & string]: ClassValue } : never>;

type Variant<T> = T extends boolean ? BooleanVariant : T extends string | number ? UnionVariant<T> : never;

type Variants<Props extends object> = {
    [Name in keyof Props]?: Variant<Props[Name]>;
};

type Compound<Props extends object> = {
    [Name in keyof Props]?: Props[Name] | Props[Name][];
} & {
    className: ClassValue;
};

interface Config<Props extends object> {
    variants?: Variants<Props>;
    compoundVariants?: Compound<Props>[];
    defaultVariants?: Partial<Props>;
}

const falsyToString = <T>(value: T) => (typeof value === 'boolean' ? `${value}` : value === 0 ? '0' : value);

const cva = <Props extends object>(base: ClassValue, config: Config<Props> = {} as Config<Props>) => {
    const { variants = {} as Variants<Props>, compoundVariants = [], defaultVariants = {} as Partial<Props> } = config;
    const variantNames = Object.keys(variants);
    const compoundPairs: [[string, unknown | unknown[]][], string][] = compoundVariants.map(
        ({ className, ...conditions }) => [Object.entries(conditions), cnJoin(className)],
    );

    return (props: Props = {} as Props) => {
        const variantClassNames = variantNames.map(name => {
            const propValue = props[name as keyof Props];
            const defaultValue = defaultVariants?.[name as keyof Props];
            const valueKey = falsyToString(propValue) || falsyToString(defaultValue);
            const variant = variants[name as keyof Variants<Props>];

            return variant[valueKey as keyof typeof variant];
        });

        const compoundVariantClassNames = compoundPairs.reduce<string[]>((classNames, [entries, className]) => {
            return entries.every(([name, compoundValue]) => {
                const propValue = props[name as keyof Props];
                const defaultValue = defaultVariants?.[name as keyof Props];
                const value = propValue ?? defaultValue;

                return Array.isArray(compoundValue) ? compoundValue.includes(value) : compoundValue === value;
            })
                ? classNames.concat(className)
                : classNames;
        }, []);

        return cnJoin(base, variantClassNames, compoundVariantClassNames);
    };
};

export default cva;
