'use client';

import {
    useRef,
    useEffect,
    useMemo,
    Children,
    cloneElement,
    isValidElement,
    type ReactNode,
    type ReactElement
} from 'react';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import Animation from '@/components/Animation';
import useColor from '@/hooks/useColor';

//* Tabs Item Component -----------------------------------
type TabProps = {
    value: number | string;
    onChange?: (newValue: number | string) => void;
    isActive?: boolean;
    children: ReactNode;
    activeClassName?: string;
    className?: string;
};
const Tab = ({ value, onChange, isActive = false, children, activeClassName = '', className = '' }: TabProps) => {
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
//* Tab Content Component -----------------------------------
type ContentProps = {
    /** should be equal to one of 'value' prop of Tabs.Tab */
    value: number | string;
    show?: boolean;
    children: ReactNode;
    className?: string;
};
const Content = ({ value, show = false, children, className = '' }: ContentProps) => {
    return (
        <Animation show={show} animation='fade' duration={500} easing='ease-in-out' className={`${className}`}>
            {children}
        </Animation>
    );
};
//* Tabs Component -----------------------------------
type TabsProps = {
    value: number | string;
    onChange: (newValue: number | string) => void;
    align?: 'start' | 'center' | 'end';
    grow?: boolean;
    showArrows?: boolean;
    arrowColor?: string;
    showIndicator?: boolean;
    indicatorColor?: string;
    children: ReactNode;
    tabsContainerClassName?: string;
    activeClassName?: string;
    indicatorClassName?: string;
    contentsContainerClassName?: string;
    className?: string;
};
const Tabs = ({
    value,
    onChange,
    align = 'start',
    grow = false,
    showArrows = false,
    arrowColor = 'purple-500',
    showIndicator = true,
    indicatorColor = 'purple-500',
    children,
    tabsContainerClassName = '',
    activeClassName = '',
    indicatorClassName = '',
    contentsContainerClassName = '',
    className = ''
}: TabsProps) => {
    const containerRef = useRef<HTMLDivElement>(null!);
    const parsedIndicatorColor = useColor(indicatorColor);
    const TabChildren = useMemo<ReactElement<TabProps>[]>(() => {
        //@ts-expect-error "manually type children"
        return Children.toArray(children).filter((child: ReactElement<TabProps>) => child.type === Tab);
    }, [children]);
    const ContentChildren = useMemo<ReactElement<ContentProps>[]>(() => {
        //@ts-expect-error "manually type children"
        return Children.toArray(children).filter((child: ReactElement<ContentProps>) => child.type === Content);
    }, [children]);
    const activeIdx = TabChildren.findIndex((child) => child.props.value === value);
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
        const newIdx = activeIdx - 1 >= 0 ? activeIdx - 1 : TabChildren.length - 1;
        onChange?.(TabChildren[newIdx].props.value);
    };
    const nextSlide = () => {
        const newIdx = (activeIdx + 1) % TabChildren.length;
        onChange?.(TabChildren[newIdx].props.value);
    };
    useEffect(() => {
        scrollIntoActiveTab();
        setIndicatorStyles();
    }, [value]);

    return (
        <div ref={containerRef} className={`${className}`}>
            <div className={`relative ${tabsContainerClassName}`}>
                <div
                    role='tablist'
                    className={`relative flex w-full flex-nowrap gap-0 overflow-auto ${align === 'start' ? 'justify-start' : align === 'center' ? 'justify-center' : 'justify-end'}`}
                >
                    {Children.map(TabChildren, (Tab) => {
                        if (!isValidElement<TabProps>(Tab)) return null;
                        const { value: tabValue, className, ...rest } = Tab.props;
                        const isActive = value === tabValue;
                        return cloneElement<TabProps>(Tab, {
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
            <div className={`mt-10 ${contentsContainerClassName}`}>
                {Children.map(ContentChildren, (Content) => {
                    if (!isValidElement<ContentProps>(Content)) return null;
                    const { value: contentValue, ...rest } = Content.props;
                    return cloneElement<ContentProps>(Content, {
                        show: contentValue === value,
                        value: contentValue,
                        ...rest
                    });
                })}
            </div>
        </div>
    );
};
//* Exports -----------------------------------
Tabs.Tab = Tab;
Tabs.Content = Content;
export default Tabs;

//? Tabs component is not draggable but on mobile because of overflow:auto we can swipe it
