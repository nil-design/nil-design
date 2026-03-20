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
        const classValues: ClassValue[] = [base];

        for (let i = 0; i < variantNames.length; i++) {
            const name = variantNames[i];
            const propValue = props[name as keyof Props];
            const defaultValue = defaultVariants?.[name as keyof Props];
            const valueKey = falsyToString(propValue ?? defaultValue);
            const variant = variants[name as keyof Variants<Props>];
            const classValue = variant[valueKey as keyof typeof variant];

            classValue && classValues.push(classValue);
        }

        for (let i = 0; i < compoundPairs.length; i++) {
            const [entries, className] = compoundPairs[i];
            let matched = true;

            for (let j = 0; j < entries.length; j++) {
                const [name, compoundValue] = entries[j];
                const propValue = props[name as keyof Props];
                const defaultValue = defaultVariants?.[name as keyof Props];
                const value = propValue ?? defaultValue;

                if (!(Array.isArray(compoundValue) ? compoundValue.includes(value) : compoundValue === value)) {
                    matched = false;
                    break;
                }
            }
            matched && classValues.push(className);
        }

        return cnJoin(classValues);
    };
};

export default cva;
