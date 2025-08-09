'use client';

import { useState, useEffect, type CSSProperties, type MouseEvent } from 'react';
import useColor from '@/hooks/useColor';
import styles from './styles.module.css';

type Ripple = {
    x: number;
    y: number;
    size: number;
};
type Props = {
    color?: string;
    /** ripple duration in ms */
    duration?: number;
    className?: string;
};

export default function Ripple({ color = 'slate-300', duration = 400, className = '' }: Props) {
    const [ripples, setRipples] = useState<Ripple[]>([]);
    const parsedColor = useColor(color);
    const onClick = (e: MouseEvent) => {
        const elm = e.currentTarget as HTMLElement;
        const { left, top } = elm.getBoundingClientRect();
        const { clientX, clientY } = e;
        const size = Math.max(elm.clientWidth, elm.clientHeight);
        setRipples((old) => [...old, { x: clientX - left - size / 2, y: clientY - top - size / 2, size }]);
    };
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (ripples.length) {
            timer = setTimeout(() => {
                setRipples([]);
            }, duration);
        }
        return () => {
            clearTimeout(timer);
        };
    }, [ripples, duration]);

    return (
        <div
            onClick={onClick}
            className={`absolute top-0 left-0 z-1 h-full w-full overflow-hidden rounded-[inherit] ${styles.container} ${className}`}
            style={
                {
                    '--ripple-duration': `${duration}ms`
                } as CSSProperties
            }
        >
            {ripples.map((ripple, i) => (
                <div
                    key={i}
                    className={`rounded-circle pointer-events-none absolute -z-1 aspect-square ${styles.ripple}`}
                    style={{
                        width: `${ripple.size}px`,
                        height: `${ripple.size}px`,
                        left: `${ripple.x}px`,
                        top: `${ripple.y}px`,
                        backgroundColor: parsedColor
                    }}
                />
            ))}
        </div>
    );
}

//? Parent/Ancestor(s) must be relative or absolute positioned element
