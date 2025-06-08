'use client';

import { useRef, useState, useEffect, type MouseEvent } from 'react';
import Icon from '@/components/Icon';
import useColor from '@/hooks/useColor';

type Size = 'sm' | 'md' | 'lg' | number;
type Props = {
    /** value of rating ... between [0,length] */
    value: number;
    /** for controlled behavior */
    onChange?: (newValue: number) => void;
    /** counts of rendered icons */
    length?: number;
    /** color of icons */
    color?: string;
    /** size of icons , can be 'sm'|'md'|'lg' or number */
    size?: Size;
    /** for css gap of container */
    spacing?: number;
    /** icon name for full icon */
    fullIcon?: string;
    /** icon name for half icon */
    halfIcon?: string;
    /** icon name for empty icon */
    emptyIcon?: string;
    /** allow selection of half floating(.5) values */
    halfIncrement?: boolean;
    /** we can have mouse,touch interaction with icons  */
    hover?: boolean;
    /** make rating section readonly */
    readOnly?: boolean;
    /** disable whole rating section and add fadeout effect */
    disabled?: boolean;
    /** css ClassName of container */
    className?: string;
};

export default function Rating({
    value = 0,
    onChange,
    length = 5,
    color = 'yellow-500',
    size = 'md',
    spacing = 6,
    fullIcon = 'ph:star-fill',
    halfIcon = 'ph:star-half-fill',
    emptyIcon = 'ph:star-bold',
    halfIncrement = false,
    hover = true,
    readOnly = false,
    disabled = false,
    className = ''
}: Props) {
    const container = useRef<HTMLUListElement>(null!);
    const [icons, setIcons] = useState<string[]>([]);
    const parsedColor = useColor(color);
    const getSize = () => {
        let result;
        switch (size) {
            case 'sm':
                result = 18;
                break;
            case 'md':
                result = 24;
                break;
            case 'lg':
                result = 30;
                break;
            default:
                result = size;
        }
        return result;
    };
    const getPositionValue = (position: number) => {
        //position if current mouse,touch position in pixels
        //convert amount of movement to normalized value between [0,length] and base on that return result
        const offset = halfIncrement ? 0.75 : 0.5;
        const { width, left } = container.current.getBoundingClientRect();
        const percentage = Math.round(((position - left) / width) * 100); //between [0,100]
        const normalizeValue = (length * percentage) / 100 - offset; //between [0,length]
        const floor = Math.floor(normalizeValue);
        const ceil = Math.ceil(normalizeValue);
        const floating = +(normalizeValue - floor).toFixed(2);
        let result;
        if (halfIncrement) {
            if (floating < 0.25) result = floor;
            else if (0.25 <= floating && floating < 0.75) result = floor + 0.5;
            else result = ceil;
        } else {
            if (floating < 0.5) result = floor;
            else result = ceil;
        }
        return result;
    };
    const generateIcons = (newValue: number) => {
        const icons = Array.from({ length }).map((_, idx) => {
            if (idx <= Math.floor(newValue)) return fullIcon;
            else if (idx === Math.ceil(newValue)) return halfIncrement ? halfIcon : emptyIcon;
            else return emptyIcon;
        });
        setIcons(icons);
    };
    const clickHandler = (e: MouseEvent<HTMLUListElement>) => {
        const newValue = getPositionValue(e.clientX);
        onChange?.(newValue + 1);
    };
    const doubleClickHandler = () => {
        onChange?.(0);
    };
    const mouseMoveHandler = (e: MouseEvent<HTMLUListElement>) => {
        const newValue = getPositionValue(e.clientX);
        generateIcons(newValue);
    };
    const mouseLeaveHandler = () => {
        generateIcons(value - 1);
    };
    const iconSize = getSize();
    useEffect(() => {
        generateIcons(value - 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <ul
            ref={container}
            onClick={clickHandler}
            onDoubleClick={doubleClickHandler}
            onMouseMove={hover ? mouseMoveHandler : undefined}
            onMouseLeave={mouseLeaveHandler}
            className={`inline-flex cursor-pointer flex-wrap items-center justify-center ${readOnly ? 'pointer-events-none' : ''} ${disabled ? 'pointer-events-none opacity-50' : ''} ${className}`}
            style={{
                gap: `${spacing}px`
            }}
        >
            {icons.map((icon, i) => (
                <li key={i} role='button'>
                    <Icon icon={icon} size={iconSize} color={parsedColor} className='transition-all duration-200' />
                </li>
            ))}
        </ul>
    );
}

//? Usage:
// const [val, setVal] = useState(0);
// <Rating value={val} onChange={(newVal) => setVal(newVal)}
//     length={5} hover halfIncrement={true} color='sky-600'
//     size='md' spacing={20} readOnly={false} disabled={false}
// />
