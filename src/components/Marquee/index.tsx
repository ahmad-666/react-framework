'use client';

import { Fragment, useRef, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import styles from './styles.module.css';

type Direction = 'horizontal' | 'vertical';
type Props<T> = {
    direction?: Direction;
    /** for add more buffer */
    duplicationCount?: number;
    items: T[];
    children: (item: T) => ReactNode;
    width?: number | string;
    minWidth?: number | string;
    maxWidth?: number | string;
    height?: number | string;
    minHeight?: number | string;
    maxHeight?: number | string;
    gap?: number;
    className?: string;
};

export default function Marquee<T>({
    direction = 'vertical',
    duplicationCount = 3,
    items = [],
    children,
    width = '100%',
    minWidth = 0,
    maxWidth = '100%',
    height = 'auto',
    minHeight = 0,
    maxHeight,
    gap = 16,
    className = ''
}: Props<T>) {
    const containerRef = useRef<HTMLDivElement>(null!);
    const duplicatedItems = useMemo(() => {
        return Array.from({ length: duplicationCount }, () => items).flat();
    }, [duplicationCount, items]);
    const handleScroll = () => {
        const container = containerRef.current;
        if (container) {
            const containerSize = direction === 'horizontal' ? container.clientWidth : container.clientHeight;
            const scrollAmount = direction === 'horizontal' ? container.scrollLeft : container.scrollTop;
            const maxScroll = direction === 'horizontal' ? container.scrollWidth : container.scrollHeight;
            const start = maxScroll / duplicationCount;
            const end = start * 2 - containerSize;
            if (scrollAmount <= 0) container[direction === 'horizontal' ? 'scrollLeft' : 'scrollTop'] = start;
            if (scrollAmount >= maxScroll - containerSize)
                container[direction === 'horizontal' ? 'scrollLeft' : 'scrollTop'] = end;
        }
    };
    const wheelHandler = useCallback(
        (e: WheelEvent) => {
            e.preventDefault();
            const container = containerRef.current;
            if (container) container[direction === 'horizontal' ? 'scrollLeft' : 'scrollTop'] += e.deltaY;
        },
        [direction]
    );
    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            if (direction === 'horizontal') {
                container.scrollLeft = container.scrollWidth / duplicationCount;
                container.addEventListener('wheel', wheelHandler, { passive: false }); //not use onWheel prop because we want force this handler to not be passive
            } else container.scrollTop = container.scrollHeight / duplicationCount;
            return () => {
                container.removeEventListener('wheel', wheelHandler);
            };
        }
    }, [direction, duplicationCount, wheelHandler]);

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            className={`flex ${direction === 'horizontal' ? 'flex-row overflow-x-auto overflow-y-hidden' : 'flex-col overflow-x-hidden overflow-y-auto'} ${styles['scrollbar-hidden']} ${className}`}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                minWidth: typeof minWidth === 'number' ? `${minWidth}px` : minWidth,
                maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
                height: typeof height === 'number' ? `${height}px` : height,
                minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
                maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
                gap: `${gap}px`
            }}
        >
            {duplicatedItems.map((item, i) => (
                <Fragment key={i}>{children(item)}</Fragment>
            ))}
        </div>
    );
}

//? Overall idea is that we create container that its content is overflowing and we use overflow-auto so user can scroll but hide scrollbar and if we reach certain points we change scroll position
//? Also for direction:'horizontal' for be able to scroll left-to-right via mouse wheel we add onWheel event too
