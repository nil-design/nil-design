import type { RefObject } from 'react';

type TargetType = EventTarget;

type ResolvableTarget<T extends TargetType = TargetType> = T | RefObject<T | null | undefined> | undefined | null;

export default ResolvableTarget;
