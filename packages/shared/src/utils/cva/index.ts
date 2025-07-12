import { OmitUndefined, StringToBoolean } from '../../interfaces';
import cnJoin, { ClassValue } from '../cn-join';

type ClassNameProp = { className?: ClassValue };

type UnknownVariants = Record<string, Record<string, ClassValue>>;

type Compound<Variants extends UnknownVariants> = {
    [Name in keyof Variants]?: StringToBoolean<keyof Variants[Name]> | StringToBoolean<keyof Variants[Name]>[];
} & Required<ClassNameProp>;

type Props<Variants extends UnknownVariants> = {
    [Name in keyof Variants]?: StringToBoolean<keyof Variants[Name]>;
};

interface Config<Variants extends UnknownVariants> {
    variants?: Variants;
    compoundVariants?: Compound<Variants>[];
    defaultVariants?: Props<Variants>;
}

export type CVAProps<CVAReturn extends (props: Props<UnknownVariants>) => string> = OmitUndefined<
    Parameters<CVAReturn>[0]
>;

const falsyToString = <T>(value: T) => (typeof value === 'boolean' ? `${value}` : value === 0 ? '0' : value);

const cva = <Variants extends UnknownVariants = UnknownVariants>(
    base: ClassValue,
    config: Config<Variants> = {} as Config<Variants>,
) => {
    const {
        variants = {} as Variants,
        compoundVariants = [],
        defaultVariants = {} as Omit<Props<Variants>, 'className'>,
    } = config;
    const variantNames = Object.keys(variants);

    return (props: Props<Variants>) => {
        if (!variantNames.length) {
            return cnJoin(base);
        }

        const variantClassNames = variantNames.map((name: keyof Variants) => {
            const propValue = props[name as keyof typeof props];
            const defaultValue = defaultVariants?.[name as keyof typeof defaultVariants];
            const valueKey = (falsyToString(propValue) ||
                falsyToString(defaultValue)) as keyof (typeof variants)[typeof name];

            return variants[name][valueKey];
        });

        const compoundVariantClassNames = compoundVariants.reduce<string[]>(
            (classNames, { className, ...variantCompounds }) => {
                return Object.entries(variantCompounds).every(([name, compoundValue]) => {
                    const propValue = props[name as keyof typeof props];
                    const defaultValue = defaultVariants?.[name as keyof typeof defaultVariants];
                    const value = propValue ?? defaultValue;

                    return Array.isArray(compoundValue) ? compoundValue.includes(value) : compoundValue === value;
                })
                    ? classNames.concat(cnJoin(className))
                    : classNames;
            },
            [],
        );

        return cnJoin(base, variantClassNames, compoundVariantClassNames);
    };
};

export default cva;
