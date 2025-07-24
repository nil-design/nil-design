type TargetType = Window | Document | EventTarget | Element | HTMLElement;

type PossibleTarget<T extends TargetType = TargetType> = T | undefined | null;

export default PossibleTarget;
