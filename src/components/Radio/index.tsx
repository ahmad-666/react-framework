'use client';

import { useId, Children, cloneElement, isValidElement, type ReactNode } from 'react';
import FormLabel from '@/components/FormLabel';
import FormMessage from '@/components/FormMessage';
import Icon from '@/components/Icon';
import useColor from '@/hooks/useColor';

//* Global Types -----------------------------------
type Size = 'sm' | 'md' | 'lg' | number;
type Variant = 'no-icon' | 'icon';
//* Radio Item component -----------------------------------
type RadioProps = {
    id?: string;
    name?: string;
    checked?: boolean;
    value: number | string;
    onChange?: (newChecked: boolean) => void;
    /** variant="icon" will show icon on checked state but variant="no-icon" will show smaller circle on checked state */
    variant?: Variant;
    size?: Size;
    color?: string;
    /** only useful for variant="icon" */
    icon?: ReactNode;
    readOnly?: boolean;
    disabled?: boolean;
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
    variant = 'no-icon',
    icon = <Icon icon='mdi:check' size='md' color='white' />,
    size = 'md',
    color = 'sky-600',
    readOnly = false,
    disabled = false,
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
        <div
            className={`flex items-center gap-2 ${disabled ? 'opacity-50' : ''} ${readOnly || disabled ? 'pointer-events-none' : 'cursor-pointer'} ${className}`}
            onClick={() => onChange?.(!checked)}
        >
            <div
                className='rounded-circle aspect-square shrink-0 transition-colors duration-300'
                style={{
                    width: `${radioSize}px`,
                    borderWidth: variant === 'no-icon' || !checked ? '1px' : '0px',
                    borderStyle: 'solid',
                    borderColor: checked ? parsedColor : '#aaa',
                    backgroundColor: variant === 'icon' && checked ? parsedColor : 'transparent'
                }}
            >
                <div
                    className={`pointer-events-none flex h-full w-full items-center justify-center transition-all duration-300 ${checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                >
                    {variant === 'no-icon' && (
                        <div
                            className='rounded-circle aspect-square'
                            style={{
                                width: `${radioSize * 0.55}px`,
                                backgroundColor: parsedColor
                            }}
                        />
                    )}
                    {variant === 'icon' && icon}
                </div>
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
                onChange={() => {}}
                readOnly={readOnly}
                disabled={disabled}
                className='pointer-events-none absolute top-0 left-0 h-0 w-0 opacity-0'
            />
        </div>
    );
};
//* RadioGroup component -----------------------------------
type RadioGroupProps = Pick<
    RadioProps,
    'id' | 'name' | 'variant' | 'size' | 'color' | 'icon' | 'children' | 'className'
> & {
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
    variant = 'no-icon',
    size = 'md',
    color = 'sky-600',
    icon,
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
                        variant,
                        size,
                        color,
                        icon,
                        name
                    });
                })}
            </div>
            {!!helperText && <FormMessage error={error}>{helperText}</FormMessage>}
        </div>
    );
};
//* Exports -----------------------------------
RadioGroup.Radio = Radio;
export default RadioGroup;

//? RadioGroup has value:number|string, onChange:(newValue:number|string)=>void props which control the whole component controlled states
//? Each RadioGroup.Radio should have its unique value:number|string , also internally we set its value:boolean,onChange:(newValue:boolean)=>void props too
