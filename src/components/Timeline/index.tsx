'use client';

import { Children, cloneElement, isValidElement, type ReactNode, type ReactElement, type CSSProperties } from 'react';
import Icon from '@/components/Icon';
import useColor from '@/hooks/useColor';

//* Timeline.Dot Component ---------------------------------
type Size = 'sm' | 'md' | 'lg' | number;
type DotProps = {
    size?: Size;
    icon?: string;
    color?: string;
    iconColor?: string;
    children?: ReactNode;
    className?: string;
};
const Dot = ({
    size = 'md',
    icon = 'mdi:check',
    color = 'green-600',
    iconColor = 'white',
    children,
    className = ''
}: DotProps) => {
    return <div className={`${className}`}>{children}</div>;
};
//* Timeline.Content Component ---------------------------------
type ContentProps = {
    children?: ReactNode;
    className?: string;
};
const Content = ({ children, className = '' }: ContentProps) => {
    return <div className={`${className}`}>{children}</div>;
};
//* Timeline.Opposite Component ---------------------------------
type OppositeProps = {
    children?: ReactNode;
    className?: string;
};
const Opposite = ({ children, className = '' }: OppositeProps) => {
    return <div className={`${className}`}>{children}</div>;
};
//* Timeline.Item Component ---------------------------------
//Each Timeline.Item can have different size,color,icon,iconColor,...
//Each Timeline.Item also consist of divider line too
type ItemProps = Pick<DotProps, 'size' | 'icon' | 'color' | 'iconColor'> & {
    reverse?: boolean;
    /** start line even before of first item */
    startOverflow?: boolean;
    /** end line even after of last item */
    endOverflow?: boolean;
    lineSize?: number;
    lineColor?: string;
    children?: ReactNode;
    dotClassName?: string;
    lineClassName?: string;
    className?: string;
};
const Item = ({
    reverse = false,
    startOverflow = false,
    endOverflow = false,
    lineSize = 75,
    lineColor = 'slate-300',
    size = 'md',
    icon = 'mdi:check',
    color = 'green-600',
    iconColor = 'white',
    children,
    dotClassName = '',
    lineClassName = '',
    className = ''
}: ItemProps) => {
    const parsedColor = useColor(color);
    const parsedLineColor = useColor(lineColor);
    const DotChild = Children.toArray(children).find(
        (child) => isValidElement<DotProps>(child) && child.type === Dot
    ) as ReactElement<DotProps>;
    const ContentChild: ReactElement<ContentProps> | undefined = Children.toArray(children).find(
        (child) => isValidElement<ContentProps>(child) && child.type === Content
    ) as ReactElement<ContentProps>;
    const OppositeChild: ReactElement<OppositeProps> | undefined = Children.toArray(children).find(
        (child) => isValidElement<OppositeProps>(child) && child.type === Opposite
    ) as ReactElement<OppositeProps>;
    const getSize = () => {
        let circleSize = 0;
        switch (size) {
            case 'sm':
                circleSize = 20;
                break;
            case 'md':
                circleSize = 32;
                break;
            case 'lg':
                circleSize = 45;
                break;
            default:
                circleSize = size;
        }
        return { circleSize, iconSize: circleSize - 8 };
    };
    const { circleSize, iconSize } = getSize();

    return (
        <div
            className={`flex items-start justify-center gap-5 ${reverse ? 'flex-row-reverse' : 'flex-row'} ${className}`}
            style={
                {
                    '--color': parsedColor,
                    '--line-color': parsedLineColor
                } as CSSProperties
            }
        >
            <div className='flex-1'>
                {!!OppositeChild && cloneElement<OppositeProps>(OppositeChild, { ...OppositeChild.props })}
            </div>
            <div className='flex shrink-0 flex-col items-center gap-5'>
                {startOverflow && (
                    <div
                        className={`w-0.5 rounded-md bg-(--line-color) ${lineClassName}`}
                        style={{
                            height: `${lineSize}px`
                        }}
                    />
                )}
                {DotChild ? (
                    cloneElement<DotProps>(DotChild, {
                        size,
                        icon,
                        color,
                        iconColor,
                        children: DotChild.props?.children,
                        className: `${dotClassName} ${DotChild.props?.className}`
                    })
                ) : (
                    <div
                        className={`rounded-circle flex aspect-square items-center justify-center bg-(--color) ${dotClassName}`}
                        style={{
                            width: `${circleSize}px`,
                            height: `${circleSize}px`
                        }}
                    >
                        <Icon icon={icon} size={iconSize} color={iconColor} />
                    </div>
                )}
                {endOverflow && (
                    <div
                        className={`w-0.5 rounded-md bg-(--line-color) ${lineClassName}`}
                        style={{
                            height: `${lineSize}px`
                        }}
                    />
                )}
            </div>
            <div className='flex-1'>
                {!!ContentChild && cloneElement<ContentProps>(ContentChild, { ...ContentChild.props })}
            </div>
        </div>
    );
};
Item.Dot = Dot;
Item.Content = Content;
Item.Opposite = Opposite;
//* Timeline Component ---------------------------------
type TimelineProps = Pick<
    ItemProps,
    | 'startOverflow'
    | 'endOverflow'
    | 'icon'
    | 'size'
    | 'lineSize'
    | 'color'
    | 'iconColor'
    | 'lineColor'
    | 'dotClassName'
    | 'lineClassName'
> & {
    children?: ReactNode;
    lineClassName?: string;
    className?: string;
};
const Timeline = ({
    startOverflow = false,
    endOverflow = false,
    icon = 'mdi:check',
    size = 'md',
    lineSize = 75,
    color = 'green-600',
    iconColor = 'white',
    lineColor = 'slate-300',
    children,
    dotClassName = '',
    lineClassName = '',
    className = ''
}: TimelineProps) => {
    return (
        <ul className={`flex flex-col gap-5 ${className}`}>
            {Children.map(children, (Item, i) => {
                if (!isValidElement<ItemProps>(Item)) return null;
                return (
                    <li>
                        {cloneElement<ItemProps>(Item, {
                            startOverflow: (i === 0 && startOverflow) || i !== 0, //set startOverflow on all Timeline.Item except first one or even set it on first one if we set startOverflow prop on Timeline
                            endOverflow: i === Children.count(children) - 1 && endOverflow, //only set endOverflow on Timeline.Item if set its prop and its last item
                            icon,
                            size,
                            lineSize,
                            color,
                            iconColor,
                            lineColor,
                            lineClassName,
                            dotClassName,
                            ...Item.props
                        })}
                    </li>
                );
            })}
        </ul>
    );
};
Timeline.Item = Item;
export default Timeline;
