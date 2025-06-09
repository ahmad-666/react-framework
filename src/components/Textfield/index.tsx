'use client';

import {
    useId,
    useState,
    type RefObject,
    type ChangeEvent,
    type FormEvent,
    type FocusEvent,
    type KeyboardEvent
} from 'react';
import Icon from '@/components/Icon';
import FormLabel from '@/components/FormLabel';
import FormMessage from '@/components/FormMessage';
import useColor from '@/hooks/useColor';

type As = 'textfield' | 'textarea';
type Type = 'text' | 'number' | 'email' | 'password' | 'tel' | 'url';
type Variant = 'fill' | 'outline';
type Size = 'sm' | 'md' | 'lg' | number;
type Props = {
    id?: string;
    name?: string;
    as?: As;
    value: string;
    onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onInput?: (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onFocus?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type?: Type;
    variant?: Variant;
    size?: Size;
    minRows?: number;
    maxRows?: number;
    color?: string;
    placeholder?: string;
    label?: string;
    clearable?: boolean;
    readonly?: boolean;
    disabled?: boolean;
    hideMessage?: boolean;
    error?: boolean;
    message?: string;
    prependOuterIcon?: string;
    prependInnerIcon?: string;
    appendInnerIcon?: string;
    appendOuterIcon?: string;
    inputRef?: RefObject<HTMLInputElement | HTMLTextAreaElement>;
    inputClassName?: string;
    className?: string;
};

export default function TextField({
    id,
    name,
    as = 'textfield',
    value,
    onChange,
    onInput,
    onFocus,
    onBlur,
    onKeyDown,
    type = 'text',
    variant = 'outline',
    size = 'md',
    minRows = 2,
    maxRows = 5,
    color = 'primary',
    placeholder,
    label,
    clearable = false,
    readonly = false,
    disabled = false,
    hideMessage = false,
    error = false,
    message,
    prependOuterIcon,
    prependInnerIcon,
    appendInnerIcon,
    appendOuterIcon,
    inputRef,
    inputClassName = '',
    className = ''
}: Props) {
    const Component = as === 'textfield' ? 'input' : 'textarea';
    const randomId = useId().replace(/\W/g, '').toLowerCase();
    const inputId = id || randomId;
    const [isFocus, setIsFocus] = useState(false);
    const accentColor = error ? 'error' : isFocus ? color : 'neutral-dark4';
    const parsedAccentColor = useColor(accentColor);
    const height = size === 'sm' ? 32 : size === 'md' ? 36 : size === 'lg' ? 44 : size;
    const refHandler = (node: null | HTMLInputElement | HTMLTextAreaElement) => {
        if (node) {
            if (inputRef) inputRef.current = node;
        }
    };
    const focusHandler = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setIsFocus(true);
        onFocus?.(e);
    };
    const blurHandler = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setIsFocus(false);
        onBlur?.(e);
    };
    const keyDownHandler = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onKeyDown?.(e);
    };
    const clearHandler = () => {
        onChange?.({
            target: {
                value: ''
            }
        } as ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
    };
    const inputHandler = (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (as === 'textarea') {
            const textarea = e.target as HTMLTextAreaElement;
            textarea.style.height = 'auto'; //reset height
            const contentHeight = textarea.scrollHeight; //find content height
            textarea.style.height = `${contentHeight}px`; //apply content height as new height
        }
        onInput?.(e);
    };
    const changeHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // const newValue = e.target.value;
        onChange?.(e);
    };

    return (
        <div
            className={`${readonly ? 'pointer-events-none' : ''} ${disabled ? 'pointer-events-none opacity-40' : ''} ${className}`}
        >
            {!!label && (
                <FormLabel inputId={inputId} color={accentColor} className='mb-2'>
                    {label}
                </FormLabel>
            )}
            <div className='flex items-center gap-2'>
                {!!prependOuterIcon && (
                    <Icon icon={prependOuterIcon} size='sm' color={accentColor} className='shrink-0' />
                )}
                <div
                    className={`flex grow items-center gap-2 overflow-hidden rounded-md p-2 ${variant === 'fill' ? 'bg-neutral-light4' : 'bg-transparent'} ${variant === 'outline' || isFocus || error ? 'border' : 'border-0'}`}
                    style={{
                        height: as === 'textfield' ? `${height}px` : 'auto',
                        borderColor: parsedAccentColor //for all variants we use this
                    }}
                >
                    {!!prependInnerIcon && (
                        <Icon icon={prependInnerIcon} size='sm' color={accentColor} className='shrink-0' />
                    )}
                    <div className='grow'>
                        <Component
                            ref={refHandler}
                            id={inputId}
                            name={name}
                            type={as === 'textfield' ? type : undefined}
                            value={value}
                            readOnly={readonly}
                            disabled={disabled}
                            placeholder={placeholder}
                            onChange={changeHandler}
                            onInput={inputHandler}
                            onFocus={focusHandler}
                            onBlur={blurHandler}
                            onKeyDown={keyDownHandler}
                            className={`placeholder:text-body-sm placeholder:text-neutral text-body-md text-neutral-dark4 w-full appearance-none border-none bg-transparent outline-none ${as === 'textarea' ? 'resize-none overflow-y-auto leading-[1.5rem]' : ''} ${inputClassName}`}
                            style={{
                                minHeight: as === 'textarea' ? `${minRows * 1.5}rem` : undefined,
                                maxHeight: as === 'textarea' ? `${maxRows * 1.5}rem` : undefined
                            }}
                        />
                    </div>
                    {!!appendInnerIcon && (
                        <Icon icon={appendInnerIcon} size='sm' color={accentColor} className='shrink-0' />
                    )}
                    {!!(clearable && value) && (
                        <button type='button' onClick={clearHandler} className='inline-flex shrink-0 cursor-pointer'>
                            <Icon icon='ph:x' size='sm' color={accentColor} />
                        </button>
                    )}
                </div>
                {!!appendOuterIcon && (
                    <Icon icon={appendOuterIcon} size='sm' color={accentColor} className='shrink-0' />
                )}
            </div>
            {!hideMessage && (
                <FormMessage error={error} className='mt-2'>
                    {message}
                </FormMessage>
            )}
        </div>
    );
}
