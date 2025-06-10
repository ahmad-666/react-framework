import { useState, useEffect, type RefObject } from 'react';

export type Config = IntersectionObserverInit & { once?: boolean };

const DEFAULT_ONCE = true;
const DEFAULT_ROOT_MARGIN = '0px 0px';
const DEFAULT_THRESHOLD = 0;

//? threshold can be number or number[] , if we use threshold:0 its means intersection observer callback will be executed after 1px of element gets visible/invisible , if we use threshold:[0,.25,.5,.75,1] it means intersection observer callback will be executed after each 25% of elements get visible/invisible
const useIntersection = (
    ref: RefObject<HTMLElement>,
    { once = DEFAULT_ONCE, root, rootMargin = DEFAULT_ROOT_MARGIN, threshold = DEFAULT_THRESHOLD }: Config = {
        once: DEFAULT_ONCE,
        rootMargin: DEFAULT_ROOT_MARGIN,
        threshold: DEFAULT_THRESHOLD
    }
) => {
    const [isIntersected, setIsIntersected] = useState(false);
    useEffect(() => {
        const elm = ref.current;
        if (elm) {
            const observer = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        //entry.target,entry.boundingClientRect,entry.isIntersecting,entry.intersectionRatio
                        setIsIntersected(entry.isIntersecting);
                        if (once && entry.isIntersecting) observer.disconnect();
                    });
                },
                { root, rootMargin, threshold }
            );
            observer.observe(elm);
            return () => {
                observer.disconnect();
                //.disconnect stops watching all of its target elements
                //.unobserve instructs the IntersectionObserver to stop observing the specified target
            };
        }
    }, [ref, once, root, rootMargin, threshold]);
    return isIntersected;
};

export default useIntersection;

//? Example
//#1: add animation with useIntersection:
// const ref = useRef<HTMLDivElement>(null!);
// const isIntersected = useIntersection(ref, { once: false, threshold: 0.5,rootMargin: '200px 0px 0px 0px' });
// <div ref={ref} className={`my-[200vh] aspect-square w-40 bg-primary transition-opacity duration-300 ${isIntersected ? 'opacity-100' : 'opacity-0'}`}
// ></div>
//#2: lazy loading with userIntersection + dynamic():
// import dynamic from 'next/dynamic'
// const LazyComp = dynamic(()=>import('./Comp'))
// const ref = useRef<HTMLDivElement>(null!);
// const isIntersected = useIntersection(ref, { once: true, threshold: 0 });
// <div ref={ref}>
//     {isIntersected && <LazyComp />}
// </div>
