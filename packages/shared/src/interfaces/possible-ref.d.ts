import { ForwardedRef, LegacyRef } from 'react';

type PossibleRef<T> = LegacyRef<T> | ForwardedRef<T> | undefined;

export default PossibleRef;
