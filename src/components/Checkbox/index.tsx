import { useId, useRef, useEffect, type ChangeEvent, type ReactNode } from 'react';
import Icon from '@/components/Icon';
import FormMessage from '@/components/FormMessage';
import useColor from '@/hooks/useColor';

type Size = number | 'sm' | 'md' | 'lg';
type Props = {
    id?: string;
    name?: string;
    /** boolean value for specifying if checkbox is checked or not */
    checked: boolean;
    /** indeterminate state of checkbox ... totally unrelated to checked state */
    indeterminate?: boolean;
    /** value of specific checkbox ... always use string even for multiple:true */
    value?: string;
    onChange?: (checked: boolean, value: string) => void;
    size?: Size;
    color?: string;
    checkIcon?: ReactNode;
    indeterminateIcon?: ReactNode;
    readOnly?: boolean;
    disabled?: boolean;
    hideMessage?: boolean;
    error?: boolean;
    message?: string;
    children?: ReactNode;
    contentClassName?: string;
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
    color = 'primary',
    checkIcon,
    indeterminateIcon,
    readOnly = false,
    disabled = false,
    hideMessage = false,
    error = false,
    message,
    children,
    contentClassName = '',
    className = ''
}: Props) {
    const checkboxRef = useRef<HTMLInputElement>(null!);
    const parsedColor = useColor(color);
    const randomId = useId().replace(/\W/g, '').toLowerCase();
    const inputId = id || randomId;
    const getSize = () => {
        let s;
        switch (size) {
            case 'sm':
                s = 14;
                break;
            case 'md':
                s = 18;
                break;
            case 'lg':
                s = 22;
                break;
            default:
                s = size;
        }
        return s;
    };
    const checkboxSize = getSize();
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { checked, value } = e.target;
        onChange?.(checked, value || '');
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
                htmlFor={inputId}
                className={`inline-flex cursor-pointer items-center gap-2 capitalize ${readOnly ? 'pointer-events-none' : ''} ${disabled ? 'pointer-events-none opacity-50' : ''} ${contentClassName}`}
            >
                <input
                    id={inputId}
                    name={name}
                    type='checkbox'
                    checked={checked}
                    // we don't have any indeterminate attribute for input[type="checkbox"]
                    value={value}
                    onChange={onChangeHandler}
                    readOnly={readOnly}
                    disabled={disabled}
                    className='hidden'
                />
                <span
                    className='flex items-center justify-center rounded-sm border border-solid transition-colors duration-300'
                    style={{
                        width: `${checkboxSize}px`,
                        height: `${checkboxSize}px`,
                        backgroundColor: checked ? parsedColor : 'transparent',
                        color: checked ? 'white' : 'transparent',
                        borderColor: checked ? 'transparent' : '#aaa'
                    }}
                >
                    {checked && checkIcon ? (
                        checkIcon
                    ) : indeterminate && indeterminateIcon ? (
                        indeterminateIcon
                    ) : (
                        <Icon
                            icon={checked ? 'mdi:check' : indeterminate ? 'mdi:minus' : ''}
                            size='md'
                            color='white'
                            className={`pointer-events-none transition-opacity duration-300 ${checked || indeterminate ? 'opacity-100' : 'opacity-0'}`}
                        />
                    )}
                </span>
                <span className='text-label-lg text-slate-700'>{children}</span>
            </label>
            {!hideMessage && (
                <FormMessage error={error} className='mt-1'>
                    {message}
                </FormMessage>
            )}
        </div>
    );
}


