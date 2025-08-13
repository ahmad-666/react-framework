'use client';

import { useId, Children, cloneElement, isValidElement, type ReactNode } from 'react';
import FormLabel from '@/components/FormLabel';
import FormMessage from '@/components/FormMessage';
import useColor from '@/hooks/useColor';

type Size = 'sm' | 'md' | 'lg' | number;

type RadioProps = {
    id?: string;
    name?: string;
    checked?: boolean;
    value: number | string;
    onChange?: (newChecked: boolean) => void;
    size?: Size;
    color?: string;
    /** act as label for input[type="radio"] */
    children: ReactNode;
    className?: string;
};
const Radio = ({
    id,
    /** all input[type="radio"] of same group should have same name */
    name,
    checked = false,
    value,
    onChange,
    size = 'md',
    color = 'sky-600',
    children,
    className = ''
}: RadioProps) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const parsedColor = useColor(color);
    const getSize = () => {
        let result = 0;
        switch (size) {
            case 'sm':
                result = 20;
                break;
            case 'md':
                result = 26;
                break;
            case 'lg':
                result = 32;
                break;
            default:
                result = size;
        }
        return result;
    };
    const radioSize = getSize();

    return (
        <div className={`flex cursor-pointer items-center gap-2 ${className}`} onClick={() => onChange?.(!checked)}>
            <div
                className='rounded-circle relative aspect-square shrink-0 border transition-colors duration-300'
                style={{
                    width: `${radioSize}px`,
                    borderColor: checked ? parsedColor : '#aaa'
                }}
            >
                <div
                    className={`rounded-circle pointer-events-none absolute top-1/2 left-1/2 aspect-square origin-center -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                    style={{
                        width: `${radioSize * 0.55}px`,
                        backgroundColor: parsedColor
                    }}
                />
            </div>
            <label htmlFor={inputId} className='text-body-md text-neutral-dark2 cursor-pointer'>
                {children}
            </label>
            <input
                type='radio'
                id={inputId}
                name={name}
                value={value}
                checked={checked}
                readOnly
                className='pointer-events-none absolute top-0 left-0 h-0 w-0 opacity-0'
            />
        </div>
    );
};

type RadioGroupProps = Pick<RadioProps, 'id' | 'name' | 'size' | 'color' | 'children' | 'className'> & {
    value: null | number | string;
    onChange?: (newValue: null | number | string) => void;
    label?: string;
    error?: boolean;
    helperText?: string;
    containerClassName?: string;
};
const RadioGroup = ({
    id,
    name,
    value,
    onChange,
    size = 'md',
    color = 'sky-600',
    label,
    error = false,
    helperText,
    children,
    containerClassName = '',
    className = ''
}: RadioGroupProps) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
        <div className={`inline-flex flex-col gap-4 ${className}`}>
            {!!label && <FormLabel inputId={inputId}>{label}</FormLabel>}
            <div role='radiogroup' className={`relative flex flex-col gap-3 ${containerClassName}`}>
                {Children.map(children, (radio) => {
                    if (!isValidElement<RadioProps>(radio)) return null;
                    const { checked, value: radioValue, ...rest } = radio.props;
                    return cloneElement(radio, {
                        ...rest,
                        checked: value === radioValue,
                        value: radioValue,
                        onChange: (checked) => {
                            if (checked) onChange?.(radioValue);
                            //if not checked don't do anything
                        },
                        size,
                        color,
                        name
                    });
                })}
            </div>
            {!!helperText && <FormMessage error={error}>{helperText}</FormMessage>}
        </div>
    );
};

RadioGroup.Radio = Radio;
export default RadioGroup;

//? RadioGroup has value:number|string, onChange:(newValue:number|string)=>void props which control the whole component controlled states
//? Each RadioGroup.Radio should have its unique value:number|string , also internally we set its value:boolean,onChange:(newValue:boolean)=>void props too
