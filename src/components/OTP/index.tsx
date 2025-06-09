'use client';

import { useRef, useState, useEffect, type CSSProperties } from 'react';
import FormLabel from '@/components/FormLabel';
import FormMessage from '@/components/FormMessage';
import useColor from '@/hooks/useColor';

type Type = 'number' | 'text';
type Variant = 'outline' | 'fill';
type Size = 'sm' | 'md' | 'lg' | number;
type Props = {
    value: string;
    onChange: (newVal: string) => void;
    length?: number;
    type?: Type;
    variant?: Variant;
    size?: Size;
    color?: string;
    placeholder?: string;
    label?: string;
    autoFocus?: boolean;
    readOnly?: boolean;
    disabled?: boolean;
    error?: boolean;
    message?: string;
    hideMessage?: boolean;
    inputClassName?: string;
    className?: string;
};

export default function OTP({
    value = '',
    onChange,
    length = 5,
    type = 'text',
    variant = 'outline',
    size = 'md',
    color = 'primary',
    placeholder,
    label,
    autoFocus = false,
    readOnly = false,
    disabled = false,
    error = false,
    message,
    hideMessage = false,
    inputClassName = '',
    className = ''
}: Props) {
    const inputRefs = useRef<HTMLInputElement[]>([]);
    const [localValue, setLocalValue] = useState<string[]>(value.split(''));
    const [focusIdx, setFocusIdx] = useState(autoFocus ? 0 : -1);
    const placeholderArr = placeholder?.split('') || [];
    const parsedColor = useColor(color);
    const getSize = () => {
        let result = 0;
        switch (size) {
            case 'sm':
                result = 35;
                break;
            case 'md':
                result = 48;
                break;
            case 'lg':
                result = 60;
                break;
            default:
                result = size;
        }

        return result;
    };
    const inputSize = getSize();
    const focusNextInput = (from: number = focusIdx) => {
        setFocusIdx(Math.min(from + 1, length - 1));
    };
    const focusPrevInput = (from: number = focusIdx) => {
        setFocusIdx(Math.max(0, from - 1));
    };
    useEffect(() => {
        //anytime we change focusIdx state then manually focus,select target input element
        const focusedInput = inputRefs.current[focusIdx];
        if (focusedInput) {
            setTimeout(() => {
                //use setTimeout so we don't face conflicts with browser default focus behavior
                focusedInput.focus();
                focusedInput.select();
            }, 0);
        }
    }, [focusIdx]);
    useEffect(() => {
        //anytime value prop changes then update localValue state(convert value string to array)
        setLocalValue(value.split(''));
    }, [value]);

    return (
        <div
            className={`${readOnly ? 'pointer-events-none' : ''} ${disabled ? 'pointer-events-none opacity-40' : ''} ${className}`}
            style={
                {
                    '--color': parsedColor
                } as CSSProperties
            }
        >
            {!!label && (
                <FormLabel inputId='' onClick={() => setFocusIdx(0)} className='mb-3'>
                    {label}
                </FormLabel>
            )}
            <ul className='flex flex-wrap gap-3'>
                {Array.from({ length }).map((_, i) => (
                    <li key={i}>
                        <input
                            type={type}
                            inputMode={type === 'number' ? 'numeric' : 'text'}
                            maxLength={1}
                            ref={(node: null | HTMLInputElement) => {
                                if (node) inputRefs.current[i] = node;
                            }}
                            readOnly={readOnly}
                            disabled={disabled}
                            placeholder={placeholderArr[i]}
                            value={localValue[i] || ''}
                            onChange={(e) => {
                                const lastCharacter = e.target.value?.at(-1);
                                if (lastCharacter) {
                                    const newValue = [
                                        ...localValue.slice(0, i),
                                        lastCharacter,
                                        ...localValue.slice(i + 1)
                                    ].slice(0, length);
                                    setLocalValue(newValue);
                                    focusNextInput(newValue.length - 1);
                                    onChange?.(newValue.join(''));
                                }
                            }}
                            onFocus={() => setFocusIdx(i)}
                            onBlur={() => setFocusIdx(-1)}
                            onKeyDown={(e) => {
                                if (focusIdx >= 0) {
                                    const key = e.key.toLowerCase();
                                    if (key === 'backspace') {
                                        const newValue = [
                                            ...localValue.slice(0, focusIdx),
                                            ...localValue.slice(focusIdx + 1)
                                        ];
                                        focusPrevInput();
                                        setLocalValue(newValue);
                                        onChange?.(newValue.join(''));
                                    } else if (key === 'arrowleft') focusPrevInput();
                                    else if (key === 'arrowright') focusNextInput();
                                }
                            }}
                            onPaste={(e) => {
                                e.preventDefault();
                                const data = e.clipboardData.getData('text');
                                if (data) {
                                    const newValue = data.slice(0, length).split('');
                                    setLocalValue(newValue);
                                    focusNextInput(newValue.length - 1);
                                    onChange?.(newValue.join(''));
                                }
                            }}
                            className={`text-body-lg text-neutral-dark4 placeholder:text-body-lg placeholder:text-neutral-light3 aspect-square shrink-0 overflow-hidden rounded-md p-2 text-center outline focus:outline-2 ${error ? 'outline-error' : `focus:outline-(--color) ${variant === 'outline' ? 'outline-neutral-light1' : 'outline-transparent'}`} ${variant === 'outline' ? 'bg-transparent' : ''} ${variant === 'fill' ? 'bg-neutral-light4' : ''} ${inputClassName}`}
                            style={{
                                width: `${inputSize}px`,
                                height: `${inputSize}px`
                            }}
                        />
                    </li>
                ))}
            </ul>
            {!hideMessage && (
                <FormMessage error={error} className='mt-2'>
                    {message}
                </FormMessage>
            )}
        </div>
    );
}
