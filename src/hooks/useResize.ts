import { useState, useEffect } from 'react';

const useResize = (ref: React.RefObject<HTMLElement>) => {
    const [resize, setResize] = useState<null | ResizeObserverEntry>(null);
    useEffect(() => {
        const elm = ref.current;
        if (elm) {
            const observer = new ResizeObserver((entries, observer) => {
                entries.forEach((entry) => {
                    setResize(entry);
                });
            });
            observer.observe(elm);
            return () => {
                observer.disconnect();
                //.disconnect stops watching all of its target elements
                //.unobserve instructs the IntersectionObserver to stop observing the specified target
            };
        }
    }, [ref]);
    return resize;
};

export default useResize;

//? useDomSizing return values from offsetLeft,offsetTop,offsetWidth,offsetHeight,getBoundingClientRect and update these values on window/element resize
//? useResize will return element sizing using resizeObserver api and update its value anytime size of target element size changes
//? return values of useDomSizing,useResize are totally different things and we should use that one that we need.
//? sometimes that we see useDomSizing(offsetWidth,...,getBoundingClientRect,...) are returning wrong(old) values we can use this hook and set return value on useEffect dependencies list
// const refs = useRefs<HTMLElement[]>([])
// const lastElm = useRef<HTMLElement>(null!)
// const lastElmResizing = useResize(lastElm)
// useEffect(()=>{
//*    now we are sure every single dom element inside 'ref's will have latest state in here
//     ...
// },[lastElmResizing])
//* Example:
// const [width, setWidth] = useState(100);
// const ref = useRef<HTMLDivElement>(null!);
// const resize = useResize(ref); //anytime at any scenario size of 'ref' changes we get latest value in 'resize' state
// resize.borderBoxSize[0] --> {inlineSize, blockSize} e.g resize?.borderBoxSize[0].inlineSize --> include width,padding,border
// resize.contentBoxSize[0] --> {inlineSize, blockSize} e.g resize?.contentBoxSize[0].inlineSize --> only include width without padding,border
// resize.devicePixelContentBoxSize[0] --> {inlineSize, blockSize}
// resize.contentRect --> {width,height,top,bottom,left,right,x,y}
// resize.target --> DOM Node
// <button onClick={() => {setWidth((old) => old + 1)}}>click</button>
// <div ref={ref} className='aspect-square bg-primary' style={{width: `${width}px`}} ></div>
