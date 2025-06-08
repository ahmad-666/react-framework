'use client';

import { type ReactNode, type ComponentProps, type CSSProperties } from 'react';
import Link, { type LinkProps } from 'next/link';
import CircularLoader from '@/components/CircularLoader';
import useColor from '@/hooks/useColor';

//* Types -----------------------------
export type Variant = 'fill' | 'outline' | 'text';
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type Props = ComponentProps<'button'> & {
    variant?: Variant;
    size?: Size;
    color?: string;
    circular?: boolean;
    href?: LinkProps['href'];
    target?: '_self' | '_blank';
    /** can be noopener,noreferrer,nofollow,prev,next */
    rel?: string;
    hover?: boolean;
    press?: boolean;
    loading?: boolean;
    children: ReactNode;
};

//* Component -----------------------------
const Button = ({
    variant = 'fill',
    size = 'md',
    color = 'primary',
    circular = false,
    href,
    target = '_self',
    rel,
    //noopener: browser not providing context access to the webpage that opened the link ... use on external links with target="_blank"
    //noreferrer: browser not send info about our site(referrer) to target website ... use on external links with target="_blank" except those links that are still own by us e.g dashboard,other landings,blogs,... else google analytics cannot track link.
    //nofollow: don't endorse target website so we don't pass any link juice ...  use for ads,paid links,... not use for social links
    //prev | next: set url of prev,next page for paginated sections
    hover = true,
    press = true,
    //show shadow we can use css class on parent
    disabled = false,
    loading = false,
    children,
    style,
    className = '',
    ...rest
}: Props) => {
    const isLink = !!href;
    const Component = isLink ? Link : 'button';
    const parsedColor = useColor(color);
    const parsedNeutralColor = useColor('neutral-light4');
    const cssClasses = {
        text: `bg-transparent text-(--color) outline-none border-none ${hover ? 'hover:bg-(--color-neutral)' : ''} ${press ? 'active:outline-1 active:outline-solid active:outline-(--color)' : ''}`,
        outline: `bg-transparent text-(--color) outline-1 outline-solid outline-(--color) ${hover ? 'hover:bg-(--color-neutral)' : ''} ${press ? `active:outline-2` : ''}`,
        fill: `bg-(--color) text-white outline-none border-none ${hover ? 'hover:bg-(--color-dark)' : ''} ${press ? 'active:bg-(--color-light)' : ''}`,
        padding: `${circular ? 'p-0' : ''} ${!circular ? `${size === 'xs' ? 'py-0.5 px-1' : size === 'sm' ? 'py-1 px-3' : size === 'md' ? 'py-1 px-4' : size === 'lg' ? 'py-1 px-5' : 'py-2 px-6'}` : ''}`,
        size: `${!circular ? (size === 'xs' ? 'min-h-6' : size === 'sm' ? 'min-h-9' : size === 'md' ? 'min-h-12' : size === 'lg' ? 'min-h-16' : 'min-h-20') : ''} ${
            circular
                ? size === 'xs'
                    ? 'w-5 h-5'
                    : size === 'sm'
                      ? 'w-7 h-7'
                      : size === 'md'
                        ? 'w-9 h-9'
                        : size === 'lg'
                          ? 'w-12 h-12'
                          : 'w-16 h-16'
                : ''
        }`,
        radius: `${circular ? 'rounded-circle' : 'rounded-lg'}`
    };
    const loaderSize = size === 'xs' ? 12 : size === 'sm' ? 16 : size === 'md' ? 22 : size === 'lg' ? 28 : 32;

    return (
        <Component
            //@ts-expect-error "manually handle type of href"
            href={isLink ? href : undefined}
            target={isLink ? target : undefined}
            rel={rel}
            disabled={disabled}
            className={`inline-flex cursor-pointer items-center justify-center leading-[normal] transition-colors duration-200 ${size === 'xs' || size === 'sm' ? 'text-label-md' : 'text-label-lg'} ${cssClasses[variant]} ${cssClasses.padding} ${cssClasses.size} ${cssClasses.radius} ${loading ? 'pointer-events-none' : ''} ${disabled ? 'pointer-events-none opacity-40' : ''} ${className}`}
            style={
                {
                    '--color': parsedColor,
                    '--color-neutral': parsedNeutralColor,
                    '--color-light': `color-mix(in srgb,${parsedColor},white 15%)`,
                    '--color-dark': `color-mix(in srgb,${parsedColor},black 15%)`,
                    ...style
                } as CSSProperties
            }
            {...rest}
        >
            {loading ? (
                <CircularLoader
                    size={loaderSize}
                    thickness={size === 'xs' || size === 'sm' ? 1 : 2}
                    color={variant === 'fill' ? 'white' : color}
                />
            ) : (
                children
            )}
        </Component>
    );
};

export default Button;
