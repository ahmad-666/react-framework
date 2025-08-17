'use client';

import { useRef, useEffect, type ReactNode, type ChangeEvent } from 'react';
import FormMessage from '@/components/FormMessage';
import Icon from '@/components/Icon';
import useColor from '@/hooks/useColor';

type Size = 'sm' | 'md' | 'lg' | number;
type Props = {
    id?: string;
    name?: string;
    /** checked attribute of input[type="checkbox"] */
    checked?: boolean;
    /** totally independent from checked state ... only go to indeterminate state when checked is false because checked has higher priority */
    indeterminate?: boolean;
    /** value attribute of input[type="checkbox"] */
    value?: string;
    onChange?: ({
        e,
        checked,
        indeterminate,
        value
    }: {
        e: ChangeEvent<HTMLDivElement>;
        checked: boolean;
        indeterminate: boolean;
        value: string;
    }) => void;
    size?: Size;
    color?: string;
    readOnly?: boolean;
    disabled?: boolean;
    checkedIcon?: ReactNode;
    indeterminateIcon?: ReactNode;
    hideMessage?: boolean;
    error?: boolean;
    message?: string;
    /** content of <label>*/
    children?: ReactNode;
    containerClassName?: string;
    className?: string;
};

export default function Checkbox({
    id,
    name,
    checked = false,
    indeterminate = false,
    value,
    onChange,
    size = 'md',
    color = 'sky-600',
    readOnly = false,
    disabled = false,
    checkedIcon,
    indeterminateIcon,
    hideMessage = false,
    error = false,
    message,
    children,
    containerClassName = '',
    className = ''
}: Props) {
    const checkboxRef = useRef<HTMLInputElement>(null);
    const parsedColor = useColor(color);
    const getSize = () => {
        let result = 0;
        switch (size) {
            case 'sm':
                result = 16;
                break;
            case 'md':
                result = 20;
                break;
            case 'lg':
                result = 25;
                break;
            default:
                result = size;
        }
        return result;
    };
    const checkboxSize = getSize();
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.({
            e,
            checked: e.target.checked,
            indeterminate: e.target.indeterminate,
            value: value || ''
        });
    };
    useEffect(() => {
        const checkbox = checkboxRef.current;
        if (checkbox) {
            checkbox.indeterminate = indeterminate;
        }
    }, [indeterminate]);

    return (
        <div className={`inline-block ${className}`}>
            <label
                className={`text-body-md flex cursor-pointer items-center gap-2 text-slate-800 ${disabled ? 'opacity-50' : 'opacity-100'} ${readOnly || disabled ? 'pointer-events-none' : 'cursor-pointer'} ${containerClassName}`}
            >
                <div
                    className='shrink-0 overflow-hidden rounded-sm transition-colors duration-300'
                    style={{
                        width: `${checkboxSize}px`,
                        height: `${checkboxSize}px`,
                        border: !checked && !indeterminate ? `1px solid #aaa` : 'none',
                        backgroundColor: checked || indeterminate ? parsedColor : 'transparent'
                    }}
                >
                    <div
                        className={`pointer-events-none flex h-full w-full items-center justify-center transition-opacity duration-300 ${checked || indeterminate ? 'opacity-100' : 'opacity-0'}`}
                    >
                        {checked && (checkedIcon || <Icon icon='mdi:check' size='md' color='white' />)}
                        {!checked &&
                            indeterminate &&
                            (indeterminateIcon || <Icon icon='mdi:minus' size='md' color='white' />)}
                    </div>
                </div>
                {children}
                <input
                    ref={checkboxRef}
                    type='checkbox'
                    hidden
                    id={id}
                    name={name}
                    checked={checked}
                    value={value}
                    onChange={onChangeHandler}
                    readOnly={readOnly}
                    disabled={disabled}
                />
            </label>
            {!hideMessage && (
                <FormMessage error={error} className='mt-1'>
                    {message}
                </FormMessage>
            )}
        </div>
    );
}

//? We can use 2 approach for labels and in both cases click on label is equal to click on input and triggers onChange event:
// #1:
//     <div>
//         <label htmlFor="id">...</label>
//         <input type="checkbox" hidden id="id" onChange={} />
//     </div>
// #2:
//     <label>
//         <div>...</div>
//         <input type="checkbox" hidden onChange={} />
//     </label>
