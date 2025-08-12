'use client';

import { useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Overlay from '@/components/Overlay';
import useClient from '@/hooks/useClient';

type Props = {
    show: boolean;
    onChange?: (newShow: boolean) => void;
    width?: number | string;
    minWidth?: number | string;
    maxWidth?: number | string;
    height?: number | string;
    minHeight?: number | string;
    maxHeight?: number | string;
    zIndex?: number;
    overlay?: boolean;
    overlayColor?: string;
    closeOnOverlayClick?: boolean;
    children: ReactNode;
    contentClassName?: string;
    className?: string;
};

export default function Dialog({
    show = false,
    onChange,
    width = 750,
    minWidth = 0,
    maxWidth = '90vw',
    height = 'auto',
    minHeight = 0,
    maxHeight = '90vh',
    zIndex = 4,
    overlay = true,
    overlayColor = 'rgba(0,0,0,.65)',
    closeOnOverlayClick = true,
    children,
    contentClassName = '',
    className = ''
}: Props) {
    const contentRef = useRef<HTMLDivElement>(null!);
    const isClient = useClient();
    if (!isClient || !show) return null;

    return createPortal(
        <Overlay
            show={show}
            invisible={!overlay}
            onClick={(e) => {
                if (closeOnOverlayClick && !contentRef.current.contains(e.target as HTMLElement)) onChange?.(false);
            }}
            color={overlayColor}
            zIndex={zIndex}
            className={`animate-fade-in ${className}`}
        >
            <div
                ref={contentRef}
                className={`overflow-auto rounded-md bg-white p-4 ${contentClassName}`}
                style={{
                    width: typeof width === 'number' ? `${width}px` : width,
                    minWidth: typeof minWidth === 'number' ? `${minWidth}px` : minWidth,
                    maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
                    height: typeof height === 'number' ? `${height}px` : height,
                    minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
                    maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight
                }}
            >
                {children}
            </div>
        </Overlay>,
        document.querySelector('#portals')!
    );
}
