'use client';

import { useRef, useEffect, useMemo, Children, cloneElement, isValidElement, type ReactNode } from 'react';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import useColor from '@/hooks/useColor';

type TabProps<T> = {
    value: T;
    onChange?: (newValue: T) => void;
    isActive?: boolean;
    children: ReactNode;
    activeClassName?: string;
    className?: string;
};
const Tab = <T,>({
    value,
    onChange,
    isActive = false,
    children,
    activeClassName = '',
    className = ''
}: TabProps<T>) => {
    return (
        <div
            role='tab'
            onClick={() => onChange?.(value)}
            className={`cursor-pointer ${isActive ? activeClassName : ''} ${className}`}
        >
            {children}
        </div>
    );
};

type TabsProps<T> = {
    value: T;
    onChange: (newValue: T) => void;
    align?: 'start' | 'center' | 'end';
    grow?: boolean;
    showArrows?: boolean;
    arrowColor?: string;
    showIndicator?: boolean;
    indicatorColor?: string;
    children: ReactNode;
    activeClassName?: string;
    indicatorClassName?: string;
    className?: string;
};
const Tabs = <T,>({
    value,
    onChange,
    align = 'start',
    grow = false,
    showArrows = false,
    arrowColor = 'purple-500',
    showIndicator = true,
    indicatorColor = 'purple-500',
    children,
    activeClassName = '',
    indicatorClassName = '',
    className = ''
}: TabsProps<T>) => {
    const containerRef = useRef<HTMLDivElement>(null!);
    const parsedIndicatorColor = useColor(indicatorColor);
    const childrenArr = useMemo(() => {
        return Children.toArray(children).filter((child) => isValidElement<TabProps<T>>(child));
    }, [children]);
    const activeIdx = childrenArr.findIndex((child) => child.props.value === value);
    const scrollIntoActiveTab = () => {
        const container = containerRef.current;
        if (container) {
            const activeTab = container.querySelector('.active') as HTMLElement;
            if (activeTab) {
                activeTab.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };
    const setIndicatorStyles = () => {
        const container = containerRef.current;
        if (container) {
            const activeTab = container.querySelector('.active') as HTMLElement;
            const indicator = container.querySelector('.indicator') as HTMLElement;
            if (activeTab && indicator) {
                indicator.style.width = `${activeTab.clientWidth}px`;
                indicator.style.left = `${activeTab.offsetLeft}px`;
            }
        }
    };
    const prevSlide = () => {
        const newIdx = activeIdx - 1 >= 0 ? activeIdx - 1 : childrenArr.length - 1;
        onChange?.(childrenArr[newIdx].props.value);
    };
    const nextSlide = () => {
        const newIdx = (activeIdx + 1) % childrenArr.length;
        onChange?.(childrenArr[newIdx].props.value);
    };
    useEffect(() => {
        scrollIntoActiveTab();
        setIndicatorStyles();
    }, [value]);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <div
                role='tablist'
                className={`relative flex w-full flex-nowrap gap-0 overflow-auto ${align === 'start' ? 'justify-start' : align === 'center' ? 'justify-center' : 'justify-end'}`}
            >
                {Children.map(children, (item) => {
                    if (!isValidElement<TabProps<T>>(item)) return null;
                    const { value: tabValue, className, ...rest } = item.props;
                    const isActive = value === tabValue;
                    return cloneElement<TabProps<T>>(item, {
                        ...rest,
                        value: tabValue,
                        isActive,
                        onChange,
                        activeClassName: `active ${activeClassName || ''}`,
                        className: `tab shrink-0 px-5 py-2 rounded-sm duration-300 transition-all ${align === 'center' ? 'text-center' : ''} ${grow ? 'grow' : ''} ${className || ''}`
                    });
                })}
                {showIndicator && (
                    <div
                        className={`indicator pointer-events-none absolute bottom-0 h-0.5 rounded-xs transition-all duration-300 ${indicatorClassName}`}
                        style={{
                            backgroundColor: parsedIndicatorColor
                        }}
                    />
                )}
            </div>
            {showArrows && (
                <>
                    <Button
                        variant='text'
                        size='xs'
                        onClick={() => prevSlide()}
                        className='absolute top-1/2 left-2 -translate-y-1/2'
                    >
                        <Icon icon='mdi:chevron-left' size='md' color={arrowColor} />
                    </Button>
                    <Button
                        variant='text'
                        size='xs'
                        onClick={() => nextSlide()}
                        className='absolute top-1/2 right-2 -translate-y-1/2'
                    >
                        <Icon icon='mdi:chevron-right' size='md' color={arrowColor} />
                    </Button>
                </>
            )}
        </div>
    );
};

Tabs.Tab = Tab;
export default Tabs;

//? Tabs component is not draggable but on mobile because of overflow:auto we can swipe it
