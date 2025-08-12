import { type ReactNode, type CSSProperties } from 'react';

type PositionX = 'left' | 'center' | 'right';
type PositionY = 'top' | 'center' | 'bottom';
type Props = {
    position?: `${PositionX}-${PositionY}`;
    zIndex?: number;
    content: ReactNode;
    children: ReactNode;
    contentClassName?: string;
    className?: string;
};

export default function Tooltip({
    position = 'center-bottom',
    zIndex = 3,
    content,
    children,
    contentClassName = '',
    className = ''
}: Props) {
    const getStyles = (): CSSProperties => {
        const styles: CSSProperties = {};
        const positionSplit = position.split('-');
        const positionX = positionSplit[0] as PositionX;
        const positionY = positionSplit[1] as PositionY;
        if (positionX === 'left') styles.left = '0%';
        else if (positionX === 'center') {
            styles.left = '50%';
            styles.transform = 'translateX(-50%)';
        } else if (positionX === 'right') styles.right = '0%';
        if (positionY === 'top') styles.bottom = '100%';
        else if (positionY === 'center') {
            styles.top = '50%';
            styles.transform = `${styles.transform || ''} translateY(-50%)`;
        } else if (positionY === 'bottom') styles.top = '100%';

        return styles;
    };

    return (
        <div className={`group relative inline-block ${className}`}>
            {children}
            <div
                className={`pointer-events-none absolute opacity-0 transition-opacity delay-150 duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus:opacity-100`}
                style={{
                    zIndex,
                    ...getStyles()
                }}
            >
                <div className={`text-label-md rounded-md bg-neutral-800 px-2 py-1 text-white ${contentClassName}`}>
                    {content}
                </div>
            </div>
        </div>
    );
}
