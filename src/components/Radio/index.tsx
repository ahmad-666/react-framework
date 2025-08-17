'use client';

import { Children, cloneElement, isValidElement, type ReactNode, type ChangeEvent } from 'react';
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
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.checked);
    };

    return (
        <label
            className={`text-body-md text-neutral-dark2 flex items-center gap-2 ${disabled ? 'opacity-50' : ''} ${readOnly || disabled ? 'pointer-events-none' : 'cursor-pointer'} ${className}`}
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
            {children}
            <input
                type='radio'
                hidden
                id={id}
                name={name}
                value={value}
                checked={checked}
                onChange={onChangeHandler}
                readOnly={readOnly}
                disabled={disabled}
            />
        </label>
    );
};
//* RadioGroup component -----------------------------------
type RadioGroupProps = Pick<RadioProps, 'name' | 'variant' | 'size' | 'color' | 'icon' | 'children' | 'className'> & {
    value: null | number | string;
    onChange?: (newValue: null | number | string) => void;
    label?: string;
    error?: boolean;
    helperText?: string;
    containerClassName?: string;
};
const RadioGroup = ({
    value,
    onChange,
    name,
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
    return (
        <div className={`inline-flex flex-col gap-4 ${className}`}>
            {!!label && <FormLabel>{label}</FormLabel>}
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
//? We can use 2 approach for labels and in both cases click on label is equal to click on input and triggers onChange event:
// #1:
//     <div>
//         <label htmlFor="id">...</label>
//         <input type="radio" hidden id="id" onChange={} />
//     </div>
// #2:
//     <label>
//         <div>...</div>
//         <input type="radio" hidden onChange={} />
//     </label>
