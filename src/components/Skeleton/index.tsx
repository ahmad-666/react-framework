'use client';

import { type CSSProperties } from 'react';
import useColor from '@/hooks/useColor';
import styles from './styles.module.css';

type Variant = 'rectangular' | 'rounded' | 'circular';
type Props = {
    variant?: Variant;
    color?: string;
    width?: number | string;
    height?: number | string;
    animation?: false | 'pulse' | 'wave';
    className?: string;
};

export default function Skeleton({
    variant = 'rounded',
    color = 'slate-200',
    width = '100%',
    height = 100,
    animation = 'pulse',
    className = ''
}: Props) {
    const parsedColor = useColor(color);

    return (
        <div
            className={`relative overflow-hidden ${variant === 'rectangular' ? 'rounded-none' : variant === 'rounded' ? 'rounded-md' : 'aspect-square rounded-full'} ${styles.skeleton} ${animation === 'pulse' ? styles.pulse : animation === 'wave' ? styles.wave : ''} ${className}`}
            style={
                {
                    '--color': parsedColor,
                    width: typeof width === 'number' ? `${width}px` : width,
                    height: typeof height === 'number' ? `${height}px` : height,
                    backgroundColor: parsedColor
                } as CSSProperties
            }
        ></div>
    );
}
