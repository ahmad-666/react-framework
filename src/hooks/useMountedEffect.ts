import { useRef, useEffect, type DependencyList } from 'react';

const useMountedEffect = (cb: () => void, dependencies: DependencyList = []) => {
    const isMounted = useRef(false);
    useEffect(() => {
        if (!isMounted.current) isMounted.current = true;
        else cb();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);
};

export default useMountedEffect;

//* Same as UseEffect but will not run on first render e.g if we want to reset page to '1' if any of filter changes
