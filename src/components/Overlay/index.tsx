import { type ReactNode, type MouseEvent } from 'react';

type Props = {
    /** decide whether we want to render Overlay on DOM or not ... if set to false we don't render overlay or its children */
    show: boolean;
    /** decide whether background of overlay should be visible or not ... if set to false we can still see its children */
    invisible?: boolean;
    position?: 'absolute' | 'fixed';
    zIndex?: number;
    color?: string;
    animation?: boolean;
    children: ReactNode;
    onClick?: (e: MouseEvent<HTMLDivElement>) => void; //no need for onChange and we can combine show,onClick for open,close overlay
    className?: string;
};

export default function Overlay({
    show = true,
    invisible = false,
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
            className={`top-0 left-0 flex h-full w-full items-center justify-center ${position === 'absolute' ? 'absolute' : 'fixed'} ${invisible ? 'pointer-events-none' : ''} ${animation ? 'animate-fade-in' : ''} ${className}`}
            style={{
                backgroundColor: invisible ? 'transparent' : color,
                zIndex
            }}
            onClick={onClick}
        >
            <div className='pointer-events-auto'>{children}</div>
        </div>
    );
}
