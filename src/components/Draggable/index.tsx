'use client';

import { useRef, useState, useEffect, useCallback, type ReactNode } from 'react';

type Props = {
    /** control drag speed
     *
     *  use lower that 1 values for applying threshold on start/end
     * */
    speed?: number;
    /** in ms for snap transition */
    transitionDuration?: number;
    /** if set to true then we don't have any snap alignment */
    free?: boolean;
    children: ReactNode;
    wrapperClassName?: string;
    className?: string;
};

export default function Draggable({
    speed = 0.75,
    transitionDuration = 150,
    free = false,
    children,
    wrapperClassName,
    className = ''
}: Props) {
    const [isDragging, setIsDragging] = useState(false);
    const container = useRef<HTMLDivElement>(null!);
    const wrapper = useRef<HTMLDivElement>(null!);
    const containerBounds = useRef<{ width: number; left: number }>({ width: 0, left: 0 });
    const wrapperThreshold = useRef<{ min: number; max: number }>({ min: 0, max: 0 });
    const itemWidth = useRef(0);
    const startPos = useRef(0);
    const endPos = useRef(0);

    const startHandler = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDragging(true);
        const { clientX } = 'touches' in e ? e.touches[0] : e;
        startPos.current = clientX - containerBounds.current.left;
    };
    const moveHandler = useCallback(
        (e: MouseEvent | TouchEvent) => {
            if (!isDragging) return;
            const { clientX } = 'touches' in e ? e.touches[0] : e;
            const movement = endPos.current + (clientX - containerBounds.current.left - startPos.current) * speed; //for prevent any jump effect we should start from previous end position
            wrapper.current.style.transform = `translate(${movement}px,0px)`;
        },
        [isDragging, speed]
    );
    const endHandler = useCallback(() => {
        setIsDragging(false);
        const styles = getComputedStyle(wrapper.current);
        const matrix = new DOMMatrixReadOnly(styles.transform);
        const movement = matrix.m41; //m41 is translateX and m42 is translateY
        const { min, max } = wrapperThreshold.current;
        let snap = 0;
        if (movement > min) snap = min;
        else if (movement < max) snap = max;
        else {
            const w = itemWidth.current;
            const clamp = Math.max(Math.min(min, movement), max);
            snap = !free ? Math.round(clamp / w) * w : clamp;
        }
        endPos.current = snap;
        wrapper.current.style.transition = `transform ${transitionDuration}ms ease-in-out`;
        wrapper.current.style.transform = `translate(${snap}px,0px)`;
        setTimeout(() => {
            wrapper.current.style.transition = '';
        }, transitionDuration);
    }, [free, transitionDuration]);
    useEffect(() => {
        const ro = new ResizeObserver(() => {
            const containerElm = container.current;
            const wrapperElm = wrapper.current;
            const itemElm = wrapperElm.firstElementChild as HTMLElement;
            const { width, left } = containerElm.getBoundingClientRect();
            containerBounds.current = {
                width,
                left
            };
            wrapperThreshold.current = {
                min: 0,
                max: -(wrapperElm.scrollWidth - wrapperElm.offsetWidth)
            };
            itemWidth.current = itemElm?.offsetWidth ?? 0;
        });
        ro.observe(container.current);
        return () => {
            ro.disconnect();
        };
    }, []);
    useEffect(() => {
        //* We use onMouseDown/onTouchStart on container element for find out that we are dragging
        //* We use onMouseMove/onTouchMove/onMouseUp/onTouchEnd on window element because user can still drag even outside of container.
        if (isDragging) {
            window.addEventListener('mousemove', moveHandler);
            window.addEventListener('touchmove', moveHandler);
            window.addEventListener('mouseup', endHandler);
            window.addEventListener('touchend', endHandler);
        }
        return () => {
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('touchmove', moveHandler);
            window.removeEventListener('mouseup', endHandler);
            window.removeEventListener('touchend', endHandler);
        };
    }, [isDragging, moveHandler, endHandler]);

    return (
        <div
            ref={container}
            onMouseDown={startHandler}
            onTouchStart={startHandler}
            className={`overflow-hidden select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${className}`}
        >
            <div ref={wrapper} className={`flex flex-nowrap gap-6 [&>*]:shrink-0 ${wrapperClassName}`}>
                {children}
            </div>
        </div>
    );
}

//? For more smooth transitions we update translateX on wrapper element base of mouse/touch start/current position of container element
//? We could also update its scroll position too but here we use translateX approach
