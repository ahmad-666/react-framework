import { useRef, useEffect, type ReactNode, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import useClient from '@/hooks/useClient';

export type Type = 'success' | 'info' | 'warning' | 'error';
export type PositionX = 'left' | 'center' | 'right';
export type PositionY = 'top' | 'center' | 'bottom';
type Props = {
    type?: Type;
    show: boolean;
    onChange?: (newShow: boolean) => void;
    position?: `${PositionX}-${PositionY}`;
    zIndex?: number;
    /** duration in milliseconds for auto close ... set to -1 for disable auto close feature */
    timeout?: number;
    children?: ReactNode;
    className?: string;
};

export default function Snackbar({
    type = 'success',
    show = false,
    onChange,
    position = 'left-bottom',
    zIndex = 5,
    timeout = 3000,
    children,
    className = ''
}: Props) {
    const timer = useRef<NodeJS.Timeout>(null!);
    const isClient = useClient();
    const positionStyles = (): CSSProperties => {
        const styles: CSSProperties = {};
        const positionSplit = position.split('-');
        const positionX = positionSplit[0] as PositionX;
        const positionY = positionSplit[1] as PositionY;
        if (positionX === 'left') styles.left = '10px';
        else if (positionX === 'center') {
            styles.left = '50%';
            styles.transform = 'translateX(-50%)';
        } else if (positionX === 'right') styles.right = '10px';
        if (positionY === 'top') styles.top = '10px';
        else if (positionY === 'center') {
            styles.top = '50%';
            styles.transform = `${styles.transform} translateY(-50%)`;
        } else if (positionY === 'bottom') styles.bottom = '10px';
        return styles;
    };
    useEffect(() => {
        if (timeout > 0) {
            timer.current = setTimeout(() => {
                onChange?.(false);
            }, timeout);
        }
        return () => {
            clearTimeout(timer.current);
        };
    }, [show, timeout, onChange]);
    if (!isClient || !show) return null;

    return createPortal(
        <div
            className={`text-body-sm animate-fade-in fixed max-w-3/4 rounded-sm px-3 py-1.5 text-white ${type === 'success' ? 'bg-success' : type === 'info' ? 'bg-info' : type === 'warning' ? 'bg-warning' : 'bg-error'} ${className}`}
            style={{
                zIndex,
                ...positionStyles()
            }}
        >
            {children}
        </div>,
        document.querySelector('#portals')!
    );
}
