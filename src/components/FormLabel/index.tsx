import useColor from '@/hooks/useColor';
import { type ReactNode } from 'react';

type Component = 'div' | 'p' | 'label';
type Props = {
    inputId?: string;
    color?: string;
    component?: Component;
    children?: ReactNode;
    onClick?: () => void;
    className?: string;
};

export default function FormLabel({
    inputId,
    color = 'slate-700',
    component = 'label',
    children,
    onClick,
    className
}: Props) {
    const parsedColor = useColor(color);
    const Comp = component;

    return (
        <div
            onClick={onClick}
            className={`text-label-lg inline-block font-semibold whitespace-nowrap ${className}`}
            style={{ color: parsedColor }}
        >
            <Comp htmlFor={inputId}>{children}</Comp>
        </div>
    );
}
