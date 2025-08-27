'use client';

import { Children, cloneElement, isValidElement, type ReactNode, type CSSProperties } from 'react';
import Icon from '@/components/Icon';
import useColor from '@/hooks/useColor';

//* Stepper Item ---------------------------------------------
type Direction = 'horizontal' | 'vertical';
type Size = 'sm' | 'md' | 'lg' | number;
type Status = 'default' | 'active' | 'complete';
type ItemProps = {
    direction?: Direction;
    status?: Status;
    /** unique identifier of Stepper.Item, different from value prop of Stepper or step prop Stepper.Item  */
    value: number | string;
    /** step value of Stepper.Item e.g 1,2,3,... */
    step?: number;
    size?: Size;
    color?: string;
    icon?: string;
    activeIcon?: string;
    completeIcon?: string;
    /** if set to true then each step became clickable  */
    clickable?: boolean;
    /** for content of step */
    children?: ReactNode;
    stepClassName?: string;
    className?: string;
};
const Item = ({
    direction = 'horizontal',
    status = 'default',
    value,
    step,
    size = 'md',
    color = 'sky-700',
    /** icon of step for times it is not active or completed , if not set we show step value */
    icon,
    /** icon of step for times it is active , if not set we show step value */
    activeIcon,
    /** icon of step for times it is completed , if not set we show step value */
    completeIcon,
    clickable = false,
    children,
    stepClassName = '',
    className = ''
}: ItemProps) => {
    const parsedColor = useColor(color); //each step can have different color
    const getCircleSize = () => {
        let result = 0;
        switch (size) {
            case 'sm':
                result = 15;
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
    const circleSize = getCircleSize();

    return (
        <div
            className={`flex items-center gap-3 ${direction === 'horizontal' ? 'flex-col' : 'flex-row'} ${status === 'default' ? 'opacity-60' : ''} $ ${className}`}
            style={
                {
                    '--color': parsedColor
                } as CSSProperties
            }
        >
            <div
                className={`rounded-circle shrink- inline-flex aspect-square items-center justify-center ${status === 'default' ? 'bg-slate-400 text-(--color)' : status === 'active' ? 'bg-(--primary) text-white outline outline-offset-4 outline-(--color) outline-solid' : status === 'complete' ? 'bg-green-600 text-white' : ''} ${stepClassName}`}
                style={{
                    width: `${circleSize}px`,
                    height: `${circleSize}px`
                }}
            >
                {status === 'default' && (icon ? <Icon icon={icon} size='lg' color='inherit' /> : step)}
                {status === 'active' && (activeIcon ? <Icon icon={activeIcon} size='lg' color='inherit' /> : step)}
                {status === 'complete' &&
                    (completeIcon ? <Icon icon={completeIcon} size='lg' color='inherit' /> : step)}
            </div>
            {children}
        </div>
    );
};
//* Stepper ---------------------------------------------
type Props = Pick<
    ItemProps,
    | 'direction'
    | 'clickable'
    | 'size'
    | 'color'
    | 'icon'
    | 'activeIcon'
    | 'completeIcon'
    | 'children'
    | 'stepClassName'
    | 'className'
> & {
    /** value of Stepper , should be one of 'value' prop of Stepper.Item */
    value: number | string;
    onChange?: (value: number | string) => void;
    dividerClassName?: string;
};

const Stepper = ({
    direction = 'horizontal',
    value,
    onChange,
    clickable = false,
    color = 'sky-600',
    size = 'md',
    icon,
    activeIcon,
    completeIcon,
    children,
    stepClassName = '',
    dividerClassName = '',
    className
}: Props) => {
    const parsedColor = useColor(color);

    return (
        <div
            className={`flex flex-nowrap items-center gap-3 overflow-auto ${direction === 'horizontal' ? 'flex-row' : 'flex-col'} ${className}`}
            style={
                {
                    '--color': parsedColor
                } as CSSProperties
            }
        >
            {Children.map(children, (Item, i) => {
                if (!isValidElement<ItemProps>(Item)) return null;
                const { value: stepValue, className: stepClassName2, ...rest } = Item.props;
                const isLastStep = i === Children.count(children) - 1;
                //@ts-expect-error "manually type item.props"
                const valueIndex = Children.toArray(children).findIndex((item) => item.props?.value === value);
                const status: Status = i === valueIndex ? 'active' : i < valueIndex ? 'complete' : 'default';
                return (
                    <>
                        <div
                            role={clickable ? 'button' : undefined}
                            onClick={() => {
                                if (clickable) onChange?.(stepValue);
                            }}
                            className={`grow ${clickable ? 'cursor-pointer' : ''}`}
                        >
                            {cloneElement<ItemProps>(Item, {
                                direction,
                                value: stepValue,
                                step: i + 1,
                                status,
                                size,
                                color,
                                icon,
                                activeIcon,
                                completeIcon,
                                clickable,
                                stepClassName,
                                className: `${stepClassName} ${stepClassName2}`,
                                ...rest
                            })}
                        </div>

                        {!isLastStep && (
                            <span
                                className={`$} grow rounded-md ${direction === 'horizontal' ? 'h-0.5' : 'w-0.5'} ${
                                    status === 'complete' ? 'bg-(--color)' : 'bg-slate-400'
                                } ${dividerClassName}`}
                            />
                        )}
                    </>
                );
            })}
        </div>
    );
};

Stepper.Item = Item;
export default Stepper;
