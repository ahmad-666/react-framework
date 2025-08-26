'use client';

import { useRef, useState, useEffect, useCallback, Fragment, type ReactNode, type CSSProperties } from 'react';
import styles from './styles.module.css';

type Props<T> = {
    playing?: boolean;
    slides: T[];
    cloneCounts?: number;
    /** animation duration in milliseconds for 1 full loop */
    duration?: number;
    spacing?: number;
    reverse?: boolean;
    pauseOnHover?: boolean;
    children: (slide: T) => ReactNode;
    slideClassName?: string;
    className?: string;
};

export default function AutoSlider<T>({
    playing = true,
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
    const [position, setPosition] = useState({ start: 0, end: 0 });
    const calcMovement = useCallback(
        (elm: HTMLDivElement) => {
            //* each slide can have different sizing
            const mainSlides = Array.from(elm.querySelectorAll('.slide.main')) as HTMLElement[];
            const start = mainSlides.at(0)?.offsetLeft || 0;
            const end =
                start + mainSlides.reduce((sum, slide) => sum + slide.offsetWidth, 0) + mainSlides.length * spacing; //OR mainSlides.at(-1)?.offsetLeft + mainSlides.at(-1)?.offsetWidth + spacing
            setPosition({
                start: -start,
                end: -end
            });
        },
        [spacing]
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
        <div
            ref={container}
            className={`overflow-hidden ${styles.container} ${className}`}
            style={
                {
                    '--duration': `${duration}ms`,
                    '--start': `${position.start}px`,
                    '--end': `${position.end}px`,
                    '--playing-state': playing ? 'running' : 'paused',
                    '--hover-state': !playing || pauseOnHover ? 'paused' : 'running',
                    '--direction': reverse ? 'reverse' : 'normal'
                } as CSSProperties
            }
        >
            <div
                className={`flex flex-nowrap ${styles.slider}`}
                style={
                    {
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
