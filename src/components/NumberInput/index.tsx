import { useState, useEffect, type FocusEvent, type KeyboardEvent, type ChangeEvent, type ComponentProps } from 'react';
import Textfield from '@/components/Textfield';
import Icon from '@/components/Icon';

type Props = Omit<ComponentProps<typeof Textfield>, 'type' | 'value' | 'onChange' | 'autoComplete'> & {
    value: null | number;
    onChange?: (newVal: null | number) => void;
    min?: number;
    max?: number;
    maxFloatingPoint?: number;
    showArrows?: boolean;
    arrowColor?: string;
};

//? this component will accept position,negative,floating point numbers
const NumberInput = ({
    value = null,
    onChange,
    onBlur,
    onKeyDown,
    size = 'md',
    color = 'primary',
    arrowColor = 'neutral-lighten-2',
    /** we check min,max on 'arrowUp'/'arrowDown' key press,click on arrow icons,blur event */
    min,
    max,
    /** set to true if we want to have only work with arrows and not the textfield */
    readonly = false,
    disabled = false,
    /** max number for allowed floating points */
    maxFloatingPoint = 6,
    showArrows = true,
    containerClassName = '',
    ...rest
}: Props) => {
    const [inputValue, setInputValue] = useState(''); //we need separate state beside 'value' prop for <input type="text" />
    const reachMin = typeof min === 'number' && typeof value === 'number' && value <= min;
    const reachMax = typeof max == 'number' && typeof value === 'number' && value >= max;
    const decreaseDisabled = disabled || reachMin;
    const increaseDisabled = disabled || reachMax;
    const arrowSize = size === 'sm' ? 15 : size === 'md' ? 19 : 23;
    const decreaseVal = () => {
        if (!reachMin) updateValue(`${(value || 0) - 1}`);
    };
    const increaseVal = () => {
        if (!reachMax) updateValue(`${(value || 0) + 1}`);
    };
    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { key } = e;
        const keyLower = key.toLowerCase();
        if (keyLower === 'arrowup') increaseVal();
        else if (keyLower === 'arrowdown') decreaseVal();
        onKeyDown?.(e);
    };
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val = e.target.value;
        if (/[^-.,0-9]/g.test(val)) {
            //if input has anything except accepted characters(numbers,'-','.',',') to don't add it
            e.preventDefault();
            return null;
        } else {
            setInputValue(val);
            updateValue(val);
        }
    };
    const updateValue = (newValue: string) => {
        const newValueNormalize = newValue.replace(/[^-.0-9]/g, ''); //remove anything except numbers,'-','.' ... remove ',' too
        const finalValue = newValueNormalize.length ? +newValueNormalize : null;
        onChange?.(isNaN(finalValue as number) ? null : finalValue);
    };
    const onBlurHandler = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (reachMin) updateValue(`${min}`);
        else if (reachMax) updateValue(`${max}`);
        onBlur?.(e);
    };
    useEffect(() => {
        //anytime 'value' prop updates we update 'inputValue' too
        const intl = new Intl.NumberFormat('en-US', { maximumFractionDigits: maxFloatingPoint }); //max allow for floating point is 6
        const newInputValue = typeof value === 'number' ? intl.format(value) : '';
        setInputValue(newInputValue);
    }, [value, maxFloatingPoint]);

    return (
        <Textfield
            autoComplete={false}
            type='text'
            value={inputValue || ''}
            size={size}
            color={color}
            readonly={readonly}
            disabled={disabled}
            onBlur={onBlurHandler}
            onKeyDown={onKeyDownHandler}
            onChange={onChangeHandler}
            appendInnerRender={
                showArrows
                    ? ({ isFocus, isError }) => (
                          <div className='flex h-full flex-col gap-0'>
                              <button
                                  type='button'
                                  disabled={increaseDisabled}
                                  onMouseDown={(e) => {
                                      //we use onMouseDown instead of onClick so input[type="text"] still keeps its focus state
                                      e.preventDefault(); //prevent button from taking focus state
                                      const input = e.currentTarget
                                          .closest('.textfield-container')
                                          ?.querySelector('input');
                                      input?.focus(); //manually focus input[type="text"]
                                      increaseVal();
                                  }}
                                  className={`flex h-1/2 items-center justify-center ${increaseDisabled ? 'pointer-events-none opacity-40' : ''}`}
                              >
                                  <Icon
                                      icon='mdi:chevron-up'
                                      size={arrowSize}
                                      color={isError ? 'error' : isFocus ? color : arrowColor}
                                      className='pointer-events-none'
                                  />
                              </button>
                              <button
                                  type='button'
                                  disabled={decreaseDisabled}
                                  onMouseDown={(e) => {
                                      e.preventDefault();
                                      const input = e.currentTarget
                                          .closest('.textfield-container')
                                          ?.querySelector('input');
                                      input?.focus();
                                      decreaseVal();
                                  }}
                                  className={`flex h-1/2 items-center justify-center ${decreaseDisabled ? 'pointer-events-none opacity-40' : ''}`}
                              >
                                  <Icon
                                      icon='mdi:chevron-down'
                                      size={arrowSize}
                                      color={isError ? 'error' : isFocus ? color : arrowColor}
                                      className='pointer-events-none'
                                  />
                              </button>
                          </div>
                      )
                    : undefined
            }
            containerClassName={`!py-0 ${containerClassName}`}
            {...rest}
        />
    );
};

export default NumberInput;
