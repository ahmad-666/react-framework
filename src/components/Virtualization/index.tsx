import { useRef, useState, type ReactNode } from 'react';

type Direction = 'horizontal' | 'vertical';
type Props<T> = {
    direction?: Direction;
    /** base on 'direction' prop can be width/height of container */
    containerSize: number;
    /** base on 'direction' prop can be width/height of item */
    itemSize: number;
    /** for preload more items bellow/above of current visible items */
    buffer?: number;
    items: T[];
    children: (item: T) => ReactNode;
    className?: string;
};

export default function Virtualization<T>({
    direction = 'vertical',
    containerSize,
    itemSize,
    buffer = 3,
    items = [],
    children,
    className = ''
}: Props<T>) {
    const containerRef = useRef<HTMLDivElement>(null!);
    const [scroll, setScroll] = useState(0);
    const totalSize = items.length * itemSize;
    const visibleItems = Math.ceil(containerSize / itemSize);
    const startIndex = Math.max(0, Math.floor(scroll / itemSize) - buffer);
    const endIndex = Math.min(startIndex + visibleItems + 2 * buffer, items.length);
    const scrollHandler = () => {
        const container = containerRef.current;
        if (container) setScroll(container[direction === 'horizontal' ? 'scrollLeft' : 'scrollTop']);
    };

    return (
        <div
            ref={containerRef}
            onScroll={scrollHandler}
            className={`${direction === 'horizontal' ? 'overflow-x-auto overflow-y-hidden' : 'overflow-x-hidden overflow-y-auto'} ${className}`}
            style={{
                width: direction === 'horizontal' ? `${containerSize}px` : undefined,
                height: direction === 'vertical' ? `${containerSize}px` : undefined
            }}
        >
            <div
                className={`relative flex ${direction === 'horizontal' ? 'flex-row' : 'flex-col'}`}
                style={{
                    width: direction === 'horizontal' ? `${totalSize}px` : undefined,
                    height: direction === 'vertical' ? `${totalSize}px` : undefined
                }}
            >
                {items.slice(startIndex, endIndex).map((item, i) => (
                    <div
                        key={i}
                        className={`absolute ${direction === 'horizontal' ? 'top-0' : 'left-0'}`}
                        style={{
                            left: direction === 'horizontal' ? `${(i + startIndex) * itemSize}px` : undefined,
                            top: direction === 'vertical' ? `${(i + startIndex) * itemSize}px` : undefined
                        }}
                    >
                        {children(item)}
                    </div>
                ))}
            </div>
        </div>
    );
}

//? General idea of virtualization is that we have large list of items but we only render those items that are inside viewport
//* For create spacing between items we can use padding or use bigger itemSize while actual item size content take less space
