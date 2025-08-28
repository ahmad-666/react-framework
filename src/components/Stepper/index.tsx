'use client';

import {
    useMemo,
    Children,
    cloneElement,
    isValidElement,
    type ReactNode,
    type ReactElement,
    type CSSProperties
} from 'react';
import Icon from '@/components/Icon';
import Animation, { type AnimationType } from '@/components/Animation';
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
    const getSizing = () => {
        let circleSize = 0;
        switch (size) {
            case 'sm':
                circleSize = 25;
                break;
            case 'md':
                circleSize = 35;
                break;
            case 'lg':
                circleSize = 45;
                break;
            default:
                circleSize = size;
        }
        return { circleSize, iconSize: circleSize - 8 };
    };
    const { circleSize, iconSize } = getSizing();

    return (
        <div
            className={`flex items-center gap-3 ${direction === 'horizontal' ? 'flex-col' : 'flex-row'} ${status === 'default' ? 'opacity-50' : ''} ${className}`}
            style={
                {
                    '--color': parsedColor
                } as CSSProperties
            }
        >
            <div
                className={`rounded-circle inline-flex aspect-square shrink-0 items-center justify-center transition-colors duration-300 ${status === 'default' ? 'bg-slate-200 text-slate-500' : status === 'active' ? 'bg-(--color) text-white outline outline-offset-4 outline-(--color) outline-solid' : status === 'complete' ? 'bg-green-600 text-white' : ''} ${stepClassName}`}
                style={{
                    width: `${circleSize}px`,
                    height: `${circleSize}px`
                }}
            >
                {status === 'default' && (icon ? <Icon icon={icon} size={iconSize} color='inherit' /> : step)}
                {status === 'active' &&
                    (activeIcon ? <Icon icon={activeIcon} size={iconSize} color='inherit' /> : step)}
                {status === 'complete' &&
                    (completeIcon ? <Icon icon={completeIcon} size={iconSize} color='inherit' /> : step)}
            </div>
            {children}
        </div>
    );
};
//* Stepper Content ---------------------------------------------
type ContentProps = Pick<ItemProps, 'value' | 'children' | 'className'> & {
    show?: boolean;
    animation?: AnimationType;
};
const Content = ({ value, show = false, animation = 'slide-ltr', children, className = '' }: ContentProps) => {
    return (
        <Animation show={show} duration={300} easing='linear' animation={animation} className={`${className}`}>
            {children}
        </Animation>
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
> &
    Pick<ContentProps, 'animation'> & {
        /** value of Stepper , should be one of 'value' prop of Stepper.Item */
        value: number | string;
        onChange?: (value: number | string) => void;
        stepsContainerClassName?: string;
        contentsContainerClassName?: string;
        dividerClassName?: string;
    };

const Stepper = ({
    direction = 'horizontal',
    value,
    onChange,
    clickable = false,
    color = 'sky-600',
    size = 'md',
    animation = 'slide-ltr',
    icon,
    activeIcon,
    completeIcon,
    children,
    stepsContainerClassName = '',
    stepClassName = '',
    dividerClassName = '',
    contentsContainerClassName = '',
    className = ''
}: Props) => {
    const parsedColor = useColor(color);
    const Items = useMemo<ReactElement<ItemProps>[]>(() => {
        return Children.toArray(children).filter(
            //@ts-expect-error "manually type child"
            (child: ReactElement<ItemProps>) => isValidElement<ItemProps>(child) && child?.type === Item
        );
    }, [children]);
    const Contents = useMemo<ReactElement<ContentProps>[]>(() => {
        return Children.toArray(children).filter(
            //@ts-expect-error "manually type child"
            (child: ReactElement<ContentProps>) => isValidElement<ContentProps>(child) && child?.type === Content
        );
    }, [children]);
    const valueIndex = Items.findIndex((item) => item.props?.value === value);

    return (
        <div
            className={`overflow-hidden ${className}`}
            style={
                {
                    '--color': parsedColor
                } as CSSProperties
            }
        >
            <div
                className={`flex flex-nowrap items-center gap-3 overflow-auto p-4 ${direction === 'horizontal' ? 'flex-row' : 'flex-col'} ${stepsContainerClassName}`}
            >
                {Children.map(Items, (Item, i) => {
                    const { value: stepValue, className: stepClassName2 = '', ...rest } = Item.props;
                    const isLastStep = i === Items.length - 1;
                    const status: Status = i === valueIndex ? 'active' : i < valueIndex ? 'complete' : 'default';
                    return (
                        <>
                            <div
                                role={clickable ? 'button' : undefined}
                                onClick={() => {
                                    if (clickable) onChange?.(stepValue);
                                }}
                                className={`shrink-0 ${clickable ? 'cursor-pointer' : ''}`}
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
                                <div
                                    className={`relative grow overflow-hidden rounded-full bg-slate-200 ${direction === 'horizontal' ? 'h-1' : 'w-1'} ${dividerClassName}`}
                                >
                                    <div
                                        className={`absolute top-0 left-0 h-full w-full transition-all duration-300 ${direction === 'horizontal' ? 'origin-left' : 'origin-top'} ${status === 'complete' ? `bg-green-600 ${direction === 'horizontal' ? 'scale-x-100' : 'scale-y-100'}` : status === 'active' ? `bg-(--color) ${direction === 'horizontal' ? 'scale-x-50' : 'scale-y-50'}` : `bg-transparent ${direction === 'horizontal' ? 'scale-x-0' : 'scale-y-0'}`}`}
                                    />
                                </div>
                            )}
                        </>
                    );
                })}
            </div>
            <div className={`mt-10 ${contentsContainerClassName}`}>
                {Children.map(Contents, (Content) => {
                    const { value: contentValue, ...rest } = Content.props;
                    return cloneElement<ContentProps>(Content, {
                        value: contentValue,
                        show: contentValue === value,
                        animation,
                        ...rest
                    });
                })}
            </div>
        </div>
    );
};

Stepper.Item = Item;
Stepper.Content = Content;
export default Stepper;

//? We have Stepper , Stepper.Item and Stepper.Content
