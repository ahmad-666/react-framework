import { type ReactNode, type MouseEvent } from 'react';

type Props = {
    //no need for onChange and we can combine show,onClick for open,close overlay
    show?: boolean;
    position?: 'absolute' | 'fixed';
    zIndex?: number;
    color?: string;
    animation?: boolean;
    children: ReactNode;
    onClick?: (e: MouseEvent<HTMLDivElement>) => void;
    className?: string;
};

export default function Overlay({
    show = true,
    position = 'fixed',
    zIndex = 4,
    color = 'rgba(0,0,0,.65)',
    animation = true,
    children,
    onClick,
    className = ''
}: Props) {
    if (!show) return null;

    return (
        <div
            className={`top-0 left-0 flex h-full w-full items-center justify-center ${position === 'absolute' ? 'absolute' : 'fixed'} ${animation ? 'animate-fade-in' : ''} ${className}`}
            style={{
                backgroundColor: color,
                zIndex
            }}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
