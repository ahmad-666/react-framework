'use client';

import { useRef, useState, useEffect, useCallback, Fragment, type ReactNode, type CSSProperties } from 'react';
import styles from './styles.module.css';

type Props<T> = {
    slides: T[];
    cloneCounts?: number;
    /** animation duration in milliseconds */
    duration?: number;
    spacing?: number;
    reverse?: boolean;
    pauseOnHover?: boolean;
    children: (slide: T) => ReactNode;
    slideClassName?: string;
    className?: string;
};

export default function AutoSlider<T>({
    slides = [],
    cloneCounts = 2,
    duration = 30_000,
    spacing = 20,
    reverse = false,
    pauseOnHover = false,
    children,
    slideClassName = '',
    className = ''
}: Props<T>) {
    const container = useRef<HTMLDivElement>(null!);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(0);
    const calcMovement = useCallback(
        (elm: HTMLDivElement) => {
            // each slide can have different sizing
            const prevSlides = Array.from(elm.querySelectorAll('.slide.prev')) as HTMLElement[];
            const mainSlides = Array.from(elm.querySelectorAll('.slide.main')) as HTMLElement[];
            const prevSlidesSize = prevSlides.reduce((sum, slide) => sum + slide.offsetWidth, 0);
            const mainSlidesSize = mainSlides.reduce((sum, slide) => sum + slide.offsetWidth, 0);
            setStart(prevSlidesSize);
            setEnd((!reverse ? -1 : 1) * (prevSlidesSize + mainSlidesSize));
        },
        [reverse]
    );
    useEffect(() => {
        const elm = container.current;
        if (elm) {
            calcMovement(elm);
            const ro = new ResizeObserver(() => calcMovement(elm));
            ro.observe(elm);
            return () => {
                ro.disconnect();
            };
        }
    }, [calcMovement]);

    return (
        <div className={`overflow-hidden ${className}`}>
            <div
                ref={container}
                className={`flex flex-nowrap ${styles.container}`}
                style={
                    {
                        '--duration': `${duration}ms`,
                        '--start': `${start}px`,
                        '--end': `${end}px`,
                        '--hover-state': pauseOnHover ? 'paused' : 'running',
                        gap: `${spacing}px`
                    } as CSSProperties
                }
            >
                {Array.from({ length: cloneCounts }).map((_, i) => (
                    <Fragment key={i}>
                        {slides.map((slide, j) => (
                            <div key={j} className={`slide clone prev shrink-0 ${slideClassName}`}>
                                {children(slide)}
                            </div>
                        ))}
                    </Fragment>
                ))}
                {slides.map((slide, j) => (
                    <div key={j} className={`slide main shrink-0 ${slideClassName}`}>
                        {children(slide)}
                    </div>
                ))}
                {Array.from({ length: cloneCounts }).map((_, i) => (
                    <Fragment key={i}>
                        {slides.map((slide, j) => (
                            <div key={j} className={`slide clone next shrink-0 ${slideClassName}`}>
                                {children(slide)}
                            </div>
                        ))}
                    </Fragment>
                ))}
            </div>
        </div>
    );
}

//test with padding,margin,gap,border
