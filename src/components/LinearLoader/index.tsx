'use client';

import useColor from '@/hooks/useColor';
import styles from './styles.module.css';

type Props = {
    color?: string;
    size?: number;
    className?: string;
};

export default function LinearLoader({ color = 'sky-600', size = 4, className = '' }: Props) {
    const parsedColor = useColor(color);

    return (
        <div
            className={`w-full rounded-full ${styles['linear-loader']} ${className}`}
            style={{ height: `${size}px`, backgroundColor: parsedColor }}
        ></div>
    );
}
