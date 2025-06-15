import { isBrowser } from '@nild/shared/utils';
import { useEffect, useLayoutEffect } from 'react';

const useIsomorphicLayoutEffect = isBrowser() ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
