'use client';

import {
    useId,
    useRef,
    useState,
    useEffect,
    useMemo,
    useCallback,
    type ChangeEvent,
    type KeyboardEvent,
    type CSSProperties
} from 'react';
import Icon from '@/components/Icon';
import FormLabel from '@/components/FormLabel';
import FormMessage from '@/components/FormMessage';
import CircularLoader from '@/components/CircularLoader';
import Menu from '@/components/Menu';
import Checkbox from '@/components/Checkbox';
import useColor from '@/hooks/useColor';
import useClickOutside from '@/hooks/useClickOutside';
import colors from './colors';
import type { BlurReason, SelectReason, Option, AutoCompleteProps } from './types';
export type { Option } from './types';
import styles from './styles.module.css';

const AutoComplete = <Opt extends Option>({
    mode = 'autocomplete',
    variant = 'outline',
    size = 'md',
    value,
    onChange,
    options = [],
    multiple,
    valueRender,
    optionRender,
    placeholder,
    labelPos = 'inside',
    label,
    labelKey = 'label',
    valueKey = 'value',
    loadingText = 'Loading ...',
    noDataText = 'No data found !',
    inputName,
    inputId,
    inputRef,
    autoComplete = 'off',
    readOnly = false,
    disabled = false,
    clearable = false,
    loading = false,
    filterSelections = false,
    filterFn,
    prependOuterIcon,
    prependOuterRender,
    prependInnerIcon,
    prependInnerRender,
    appendInnerIcon,
    appendInnerRender,
    appendOuterIcon,
    appendOuterRender,
    hideMessage = false,
    error,
    helperText,
    search = '',
    onSearchChange,
    menu = false,
    onMenuChange,
    onFocus,
    onBlur,
    onKeyDown,
    containerRef,
    theme = colors,
    classNames = {
        container: '',
        label: '',
        input: '',
        menu: '',
        option: '',
        loadingText: '',
        noDataText: '',
        valueContainer: '',
        value: '',
        helperText: ''
    },
    className = '',
    style
}: AutoCompleteProps<Opt>) => {
    const localContainerRef = useRef<HTMLDivElement>(null!);
    const localInputRef = useRef<HTMLInputElement>(null!);
    const focusedOptionRef = useRef<HTMLLIElement>(null!);
    useClickOutside(localContainerRef, () => {
        //we use callback version to prevent any infinite re-renders of useEffect
        blurHandler(!multiple ? value : null, 'click-outside');
    });
    const randomId = useId().replace(/\W/g, '').toLowerCase();
    const finalId = inputId || randomId;
    const [isFocus, setIsFocus] = useState(false); //control focus state of container
    const [searchLocal, setSearchLocal] = useState(search || ''); //control value of <input type="text" />
    const [menuLocal, setMenuLocal] = useState(menu || false); //control options menu visibility
    const [applyFilter, setApplyFilter] = useState(false); //control whether to apply filter or not ... e.g if user select an option on multiple:false we don't want to apply filter on options
    const [focusedOptionIdx, setFocusedOptionIdx] = useState(-1); //for store focused option in menu
    const [navigationMode, setNavigationMode] = useState<'mouse' | 'keyboard'>('mouse'); // check whether we are selecting options with mouse or keyboard
    const parsedPrimaryColor = useColor(theme.primary || colors.primary!);
    const parsedOutlineColor = useColor(theme.outline || colors.outline!);
    const parsedFillColor = useColor(theme.fill || colors.fill!);
    const parsedTextColor = useColor(theme.text || colors.text!);
    const parsedAccentColor = useColor(theme.accent || colors.accent!);
    const parsedHoverColor = useColor(theme.hover || colors.hover!);
    const parsedSelectionColor = useColor(theme.selection || colors.selection!);
    const parsedErrorColor = useColor(theme.error || colors.error!);
    const hasValue = !!(multiple ? value?.length : value);
    const isError = !!error;
    const accentColor = isError ? parsedErrorColor : isFocus ? parsedPrimaryColor : parsedAccentColor;
    const parseAccentColor = useColor(accentColor! || 'transparent');
    const textfieldHeight = size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 48 : 40; //height of wrapper for multiple:false and min-height of wrapper for multiple:true
    const iconSize = size === 'lg' ? 28 : size === 'sm' ? 20 : 24; //size of icons and circular loader except chevron,close icon
    const arrowIconSize = size === 'lg' ? 30 : size === 'sm' ? 22 : 26; //size of arrow(chevron) icon
    const closeIconSize = size === 'lg' ? 22 : size === 'sm' ? 16 : 20; //size of close icon
    const labelAscended = isFocus || hasValue || placeholder; //ascend label if we have focus,value,placeholder
    const hideInput = (mode === 'select' && hasValue) || (mode !== 'select' && !multiple && hasValue && !isFocus);
    const isOptionSelected = useCallback(
        (option: Opt) => {
            if (!multiple) return value?.[valueKey] === option[valueKey];
            return !!value.find((val) => val[valueKey] === option[valueKey]);
        },
        [value, multiple, valueKey]
    );
    const filteredOptions = useMemo(() => {
        const filteredOptions: Opt[] = options.filter((option) =>
            !filterSelections ? true : !isOptionSelected(option)
        );
        if (!applyFilter) return filteredOptions;
        else {
            if (filterFn) return filterFn(searchLocal, options);
            else {
                return filteredOptions.filter((option) =>
                    (option[labelKey] as string).toLowerCase().includes(searchLocal.toLowerCase())
                );
            }
        }
    }, [applyFilter, options, searchLocal, labelKey, filterSelections, isOptionSelected, filterFn]);
    const comboboxHandler = useCallback(() => {
        const optionalOption = searchLocal ? ({ [valueKey]: searchLocal, [labelKey]: searchLocal } as Opt) : null;
        const targetOption = options.find((option) => option[labelKey] === optionalOption?.[labelKey]);
        if (targetOption || optionalOption) {
            if (!multiple) onChange?.(targetOption || optionalOption);
            else {
                const newValue = [...value, targetOption || optionalOption] as Opt[];
                const filteredNewValue = Array.from(new Map(newValue.map((opt) => [opt[valueKey], opt])).values());
                onChange?.(filteredNewValue);
            }
        }
    }, [value, multiple, options, searchLocal, labelKey, valueKey, onChange]);
    const focusHandler = useCallback(() => {
        const firstSelectedOption = filteredOptions.find((option) => isOptionSelected(option));
        const firstSelectedOptionIdx = filteredOptions.findIndex(
            (option) => option[valueKey] === firstSelectedOption?.[valueKey]
        );
        localInputRef.current.focus();
        setIsFocus(true);
        setMenuLocal(true);
        onMenuChange?.(true);
        setFocusedOptionIdx(firstSelectedOptionIdx);
        if (!multiple) {
            setSearchLocal(firstSelectedOption?.label || '');
            onSearchChange?.(firstSelectedOption?.label || '');
            if (!isFocus) {
                setTimeout(() => {
                    localInputRef?.current.select();
                }, 0);
            }
        }
        onFocus?.(localContainerRef);
    }, [multiple, isFocus, filteredOptions, isOptionSelected, valueKey, onFocus, onMenuChange, onSearchChange]);
    const blurHandler = useCallback(
        (selectedOption: null | Opt, reason: BlurReason) => {
            localInputRef.current.blur();
            setIsFocus(false);
            setMenuLocal(false);
            onMenuChange?.(false);
            setApplyFilter(false);
            setFocusedOptionIdx(-1);
            setNavigationMode('mouse');
            if (mode === 'combobox' && reason === 'click-outside') comboboxHandler();
            setSearchLocal('');
            onSearchChange?.('');
            onBlur?.(localContainerRef);
        },
        [mode, comboboxHandler, onMenuChange, onSearchChange, onBlur]
    );
    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        const sensitiveKeys = ['arrowup', 'arrowdown', 'enter'];
        const key = e.key.toLowerCase();
        setNavigationMode('keyboard');
        if (sensitiveKeys.includes(key)) {
            e.preventDefault();
            switch (key) {
                case 'arrowup':
                    setFocusedOptionIdx((old) => (old - 1 >= 0 ? old - 1 : filteredOptions.length - 1));
                    break;
                case 'arrowdown':
                    setFocusedOptionIdx((old) => (old + 1) % filteredOptions.length);
                    break;
                case 'enter':
                    const focusedOption = filteredOptions[focusedOptionIdx];
                    if (focusedOption) onOptionSelect(focusedOption, 'enter-key');
                    else if (mode === 'combobox') comboboxHandler();
                    if (!multiple || !focusedOption) {
                        setSearchLocal('');
                        onSearchChange?.('');
                    }
                    break;
            }
        }
        onKeyDown?.(e);
    };
    const onContainerClickHandler = () => {
        //always open menu on container click
        focusHandler();
    };
    const onSearchChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value;
        setSearchLocal(newVal);
        onSearchChange?.(newVal);
        setApplyFilter(true);
    };
    const onOptionSelect = (option: null | Opt, reason: SelectReason) => {
        if (!option) return null;
        let newValue: Opt | Opt[];
        if (!multiple) {
            newValue = option;
            blurHandler(newValue, 'option-select');
            onChange?.(newValue);
        } else {
            const isSelected = isOptionSelected(option);
            newValue = !isSelected ? [...value, option] : value.filter((val) => val[valueKey] !== option[valueKey]);
            onChange?.(newValue);
        }
    };
    const onChipCloseHandler = (chipOption: Opt) => {
        let newValue: null | Opt[];
        if (!multiple) {
            newValue = null;
            onChange?.(newValue);
        } else {
            newValue = value.filter((val) => val[valueKey] !== chipOption[valueKey]);
            onChange?.(newValue);
        }
    };
    const onClearHandler = () => {
        setSearchLocal('');
        onSearchChange?.('');
        setApplyFilter(false);
        if (!multiple) onChange?.(null);
        else onChange?.([]);
    };
    useEffect(() => {
        //handle scrolling to focusedOptionIdx
        focusedOptionRef.current?.scrollIntoView({ behavior: 'instant', inline: 'nearest', block: 'nearest' }); //use 'instant' version to prevent any conflicts
    }, [focusedOptionIdx]);
    useEffect(() => {
        //update local state for search every time 'search' prop changes
        setSearchLocal(search || '');
        if (search) setApplyFilter(true);
    }, [search]);
    useEffect(() => {
        //update local state for menu every time 'menu' prop changes
        setMenuLocal(menu || false);
        if (menu) {
            setIsFocus(true);
            localInputRef.current.focus();
        } else {
            setIsFocus(false);
            localInputRef.current.blur();
        }
    }, [menu]);

    return (
        <div
            className={`${disabled ? 'pointer-events-none opacity-50' : ''} ${styles.container || ''} ${className}`}
            style={
                {
                    '--primary-color': parsedPrimaryColor,
                    '--outline-color': parsedOutlineColor,
                    '--fill-color': parsedFillColor,
                    '--text-color': parsedTextColor,
                    '--accent-color': parsedAccentColor,
                    '--hover-color': parsedHoverColor,
                    '--selection-color': parsedSelectionColor,
                    ...style
                } as CSSProperties
            }
        >
            <div
                ref={(node: null | HTMLDivElement) => {
                    if (node) {
                        localContainerRef.current = node;
                        if (containerRef) containerRef.current = node;
                    }
                }}
                onClick={onContainerClickHandler}
                onKeyDown={onKeyDownHandler}
                className={`outline-none ${classNames.container}`}
            >
                {!!(label && labelPos === 'outside') && (
                    <FormLabel inputId={finalId} color={accentColor} className={`mb-3 ${classNames.label}`}>
                        {label}
                    </FormLabel>
                )}
                <div className={`flex items-center gap-2 ${readOnly ? 'pointer-events-none' : ''}`}>
                    {!!(prependOuterRender || prependOuterIcon) && (
                        <div className='flex shrink-0 items-center gap-2'>
                            {prependOuterRender?.({ isFocus, isError })}
                            {!!prependOuterIcon && <Icon icon={prependOuterIcon} color={accentColor} size={iconSize} />}
                        </div>
                    )}
                    <div
                        className='relative flex grow cursor-text items-center gap-2 overflow-visible rounded-md py-2 ps-4 pe-3'
                        style={{
                            minHeight: multiple ? `${textfieldHeight}px` : 'initial',
                            height: !multiple ? `${textfieldHeight}px` : 'auto',
                            backgroundColor: variant === 'fill' ? parsedFillColor : 'transparent'
                        }}
                    >
                        {!!(prependInnerRender || prependInnerIcon) && (
                            <div className='flex shrink-0 items-center gap-2'>
                                {prependInnerRender?.({ isFocus, isError })}
                                {!!prependInnerIcon && (
                                    <Icon icon={prependInnerIcon} color={accentColor} size={iconSize} />
                                )}
                            </div>
                        )}
                        <div className='flex grow flex-wrap items-center gap-1'>
                            {/* if multiple:false and we have value then first check if we have valueRenderer use it else use simple <p> tag with  */}
                            {!!(!multiple && value && !isFocus) &&
                                (valueRender?.(value) || (
                                    <p
                                        className={`text-body-md line-clamp-1 ${classNames.value}`}
                                        style={{
                                            color: parsedTextColor
                                        }}
                                    >
                                        {value?.[labelKey] as string}
                                    </p>
                                ))}
                            {/* if multiple:true and we have value then loop through values and first check if we have valueRenderer use it else manually create a chip */}
                            {!!(multiple && value.length) &&
                                value.map((val) => (
                                    <div
                                        key={val[valueKey] as string}
                                        className={`text-body-md flex max-w-full items-center gap-2 rounded-full px-2 py-1 text-white ${classNames.value}`}
                                        style={{
                                            backgroundColor: parsedPrimaryColor
                                        }}
                                    >
                                        {valueRender?.(val) || (val[labelKey] as string)}
                                        <button
                                            type='button'
                                            onClick={() => onChipCloseHandler(val)}
                                            className='cursor-pointer'
                                        >
                                            <Icon icon='mdi:close' color='white' size={16} />
                                        </button>
                                    </div>
                                ))}
                            <input
                                ref={(node: null | HTMLInputElement) => {
                                    if (node) {
                                        localInputRef.current = node;
                                        if (inputRef) inputRef.current = node;
                                    }
                                }}
                                autoComplete={autoComplete}
                                type='text'
                                id={finalId}
                                name={inputName}
                                value={searchLocal}
                                onChange={onSearchChangeHandler}
                                readOnly={readOnly || mode === 'select'}
                                disabled={disabled}
                                placeholder={placeholder}
                                className={`text-body-md placeholder:text-label-lg inline-block appearance-none overflow-hidden border-none outline-none placeholder:text-slate-300 ${hideInput ? 'pointer-events-none h-0 w-0 opacity-0' : 'h-6 w-25 grow'} ${classNames.input}`}
                                style={{
                                    color: parsedTextColor
                                }}
                            />
                        </div>
                        <div className='flex shrink-0 items-center gap-2'>
                            <Icon
                                icon='mdi:chevron-down'
                                color={accentColor}
                                size={arrowIconSize}
                                className={`transition-transform duration-300 ${menuLocal ? '-rotate-180' : ''}`}
                            />
                            {loading && (
                                <CircularLoader
                                    thickness={2}
                                    size={iconSize}
                                    color={parsedPrimaryColor}
                                    duration={1000}
                                />
                            )}
                            {clearable && hasValue && (
                                <button
                                    type='button'
                                    onClick={(e) => {
                                        e.stopPropagation(); //for prevent container onClick from firing
                                        onClearHandler();
                                    }}
                                    className='inline-flex cursor-pointer'
                                >
                                    <Icon icon='mdi:close' color={accentColor} size={closeIconSize} />
                                </button>
                            )}
                            {!!appendInnerIcon && <Icon icon={appendInnerIcon} color={accentColor} size={iconSize} />}
                            {appendInnerRender?.({ isFocus, isError })}
                        </div>
                        {!!(label && labelPos === 'inside') && (
                            <FormLabel
                                inputId={finalId}
                                color={accentColor}
                                className={`pointer-events-none absolute left-0 origin-left -translate-y-1/2 transition-all duration-300 rtl:right-0 rtl:origin-right rtl:-translate-x-4.5 ${labelAscended ? `text-label-md translate-x-4.5 ${variant === 'outline' ? 'top-0' : '-top-3'}` : `text-label-lg top-1/2 ${!!(prependInnerIcon || prependInnerRender) ? 'translate-x-12 rtl:-translate-x-12' : 'translate-x-4.5 rtl:-translate-x-4.5'}`} ${classNames.label}`}
                            >
                                {label}
                            </FormLabel>
                        )}
                        <fieldset
                            className={`pointer-events-none absolute top-0 left-0 h-full w-full rounded-md px-3 py-0 ${isFocus ? 'border-2' : 'border'}`}
                            style={{
                                borderColor:
                                    variant === 'outline'
                                        ? isFocus || isError
                                            ? parseAccentColor
                                            : parsedOutlineColor
                                        : 'transparent'
                            }}
                        >
                            {!!(label && labelPos === 'inside') && (
                                <legend
                                    className={`invisible h-0 overflow-hidden font-semibold whitespace-nowrap duration-300 ${labelAscended ? 'text-label-md w-auto px-1' : 'text-label-lg w-0 px-0'}`}
                                >
                                    <span>{label}</span>
                                </legend>
                            )}
                        </fieldset>
                        <Menu
                            open={menuLocal}
                            position='left-bottom'
                            zIndex={2}
                            animation='fade-in'
                            offset={{ y: 5 }}
                            className={`shadow-full-md max-h-57 w-full overflow-auto rounded-md bg-white !p-0 ${classNames.menu}`}
                        >
                            {loading && (
                                <p
                                    className={`text-title-md p-4 text-center ${classNames.loadingText}`}
                                    style={{
                                        color: parsedTextColor
                                    }}
                                >
                                    {loadingText}
                                </p>
                            )}
                            {!loading && !filteredOptions.length && (
                                <p
                                    className={`text-title-md p-4 text-center ${classNames.noDataText}`}
                                    style={{
                                        color: parsedTextColor
                                    }}
                                >
                                    {noDataText}
                                </p>
                            )}
                            {!!(!loading && filteredOptions.length) && (
                                <ul onMouseMove={() => setNavigationMode('mouse')}>
                                    {filteredOptions.map((option, idx) => {
                                        const isSelected = isOptionSelected(option);
                                        const isFocused = focusedOptionIdx === idx;
                                        return (
                                            <li
                                                key={option[valueKey] as string}
                                                ref={(node: null | HTMLLIElement) => {
                                                    if (node && isFocused) {
                                                        focusedOptionRef.current = node;
                                                    }
                                                }}
                                                role={!option.disabled ? 'button' : undefined}
                                                onMouseEnter={() =>
                                                    navigationMode === 'mouse' && setFocusedOptionIdx(idx)
                                                }
                                                // we don't use onMouseLeave event here and just reset focusedOptionIdx,navigationMode states inside blurHandler
                                                onClick={(e) => {
                                                    e.stopPropagation(); //not propagate to parent element so we don't face conflicts with onClick of container
                                                    onOptionSelect(option, 'option-click');
                                                }}
                                                className={`cursor-pointer rounded-md p-2 transition-colors duration-300 ${option.disabled ? 'pointer-events-none opacity-50' : ''} ${classNames.option}`}
                                                style={{
                                                    backgroundColor: isSelected
                                                        ? parsedSelectionColor
                                                        : isFocused
                                                          ? parsedHoverColor
                                                          : 'transparent',
                                                    border: '1px solid',
                                                    borderColor: isFocused
                                                        ? `color-mix(in srgb, ${parsedPrimaryColor}, white 75%)`
                                                        : 'transparent'
                                                }}
                                            >
                                                {!multiple &&
                                                    (optionRender?.(option, isSelected) || (
                                                        <span
                                                            className='text-body-md'
                                                            style={{
                                                                color: parsedTextColor
                                                            }}
                                                        >
                                                            {option[labelKey] as string}
                                                        </span>
                                                    ))}
                                                {multiple &&
                                                    (optionRender?.(option, isSelected) || (
                                                        <Checkbox
                                                            checked={isSelected}
                                                            value={`${option[valueKey] as string}`}
                                                            // onChange={()=>{}} // we don't need it because we handle it in the onOptionSelect
                                                            color={parsedPrimaryColor}
                                                            size='md'
                                                            readOnly //add this to prevent checkbox from being checked when clicked
                                                            hideMessage
                                                            className='!flex'
                                                        >
                                                            <span
                                                                className='text-body-md'
                                                                style={{
                                                                    color: parsedTextColor
                                                                }}
                                                            >
                                                                {option[labelKey] as string}
                                                            </span>
                                                        </Checkbox>
                                                    ))}
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </Menu>
                    </div>
                    {!!(appendOuterIcon || appendOuterRender) && (
                        <div className='flex shrink-0 items-center gap-2'>
                            {!!appendOuterIcon && <Icon icon={appendOuterIcon} color={accentColor} size={iconSize} />}
                            {appendOuterRender?.({ isFocus, isError })}
                        </div>
                    )}
                </div>
            </div>
            {!hideMessage && (
                <FormMessage error={error} className={`mt-3 ${classNames.helperText}`}>
                    {helperText}
                </FormMessage>
            )}
        </div>
    );
};

export default AutoComplete;

//? Coloring of <AutoComplete />:
//* we use theme={{primary,error,...}} prop and also we have ./colors.ts file with default colors
//* for every color in 'theme' prop we should use: const parsedPrimaryColor = useColor(theme.primary || colors.primary!)
//* we can use return value of useColor as inline style or color prop e.g <Icon color={parsedPrimaryColor} style={{color:parsedPrimaryColor}} />
//? Sizing of <AutoComplete />:
//* we use fixed height for multiple:false and fixed min-height with height:auto on multiple: true so multiple:true generally take more height than multiple:false
//? Structure of value and search part:
//* we render value,search part inside 'flex flex-wrap' ... we use conditional rendering for value part and check value existence and multiple prop ... for search part we check its visibility base on multiple,value,isFocus states
{
    /* <div className='flex grow flex-wrap items-center gap-1'>
    {!!(!multiple && value) && (valueRender?.(value) || <p>{value?.label}</p>)}
    {!!(multiple && value.length) && (value.map((val) => <div key={val.value}>{valueRender?.(val) || val.label}</div>))}
    <input className={`${!multiple && value && !isFocus ? 'pointer-events-none w-0 opacity-0' : 'w-25 grow'}`} />
</div> */
}
//? Structure of <label>,<fieldset>,<legend>:
//* for outline variant we use border on <fieldset>
//* we use visible <label> and base on focus state change it position also we add hidden <legend> inside <fieldset> with same typography as <label> so it take same space ... because changing transform:scale not affect sizing of <legend> then we change font-size base on focus state
//* use left/right padding on <fieldset> to set starting location of <legend> empty space and use left/right padding on <legend> to set amount of extra empty space also amount of translate-x on <label> is related to total amount of left/right padding on <fieldset> and <legend>
