'use client';

import { useId, type ReactNode } from 'react';
import FormLabel from '@/components/FormLabel';
import FormMessage from '@/components/FormMessage';
import useColor from '@/hooks/useColor';

type Props = {
    /** id of invisible input[type="checkbox"] */
    id?: string;
    /** on LTR layout value:true means switch is in right side and in RTL layout value:true means switch is in left side  */
    value: boolean;
    onChange?: (newValue: boolean) => void;
    label?: string;
    trackWidth?: number;
    trackHeight?: number;
    handleSize?: number;
    trackColor?: string;
    handleColor?: string;
    leftLabel?: ReactNode;
    rightLabel?: ReactNode;
    error?: boolean;
    helperText?: string;
    /** content inside handler */
    children?: ReactNode;
    trackClassName?: string;
    handleClassName?: string;
    containerClassName?: string;
    className?: string;
};

export default function Switch({
    id,
    value = false,
    onChange,
    label,
    trackWidth = 50,
    trackHeight = 20,
    handleSize = 24,
    trackColor = 'sky-500',
    handleColor = 'sky-700',
    leftLabel,
    rightLabel,
    error = false,
    helperText,
    children,
    trackClassName = '',
    handleClassName = '',
    containerClassName = '',
    className = ''
}: Props) {
    const generatedId = useId();
    const inputId = id || generatedId;
    const parsedTrackColor = useColor(trackColor);
    const parsedHandleColor = useColor(handleColor);

    return (
        <div className={`${className}`}>
            {!!label && (
                <FormLabel inputId={inputId} className='mb-2'>
                    {label}
                </FormLabel>
            )}
            <div className={`flex items-center gap-3 ${containerClassName}`}>
                {leftLabel}
                <div
                    className={`relative cursor-pointer rounded-full p-0.5 ${trackClassName}`}
                    style={{
                        width: `${trackWidth}px`,
                        height: `${trackHeight}px`,
                        backgroundColor: parsedTrackColor
                    }}
                    onClick={() => onChange?.(!value)}
                >
                    <div
                        className={`rounded-circle absolute top-1/2 aspect-square -translate-y-1/2 shadow-[0_0_5px_1px_rgb(0_0_0_/_0.25)] transition-all duration-300 ease-in-out ${handleClassName}`}
                        style={{
                            width: `${handleSize}px`,
                            height: `${handleSize}px`,
                            backgroundColor: parsedHandleColor,
                            ...(handleSize > trackHeight && { left: value ? `calc(100% - ${handleSize}px)` : '0px' }), //outline
                            ...(handleSize <= trackHeight && {
                                left: value ? `calc(100% - ${handleSize}px - 3px)` : '3px'
                            }) //inline
                        }}
                    >
                        {children}
                    </div>
                    <input
                        id={inputId}
                        type='checkbox'
                        checked={value}
                        className='pointer-events-none absolute top-0 left-0 h-0 w-0 opacity-0'
                    />
                </div>
                {rightLabel}
            </div>
            {!!helperText && (
                <FormMessage error={error} className='mt-2'>
                    {helperText}
                </FormMessage>
            )}
        </div>
    );
}
