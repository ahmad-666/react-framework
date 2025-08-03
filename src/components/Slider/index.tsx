'use client';

import { useRef, useState, useEffect, useCallback, type ReactNode, type CSSProperties } from 'react';
import useColor from '@/hooks/useColor';
import { alpha } from '@/utils/colors';

type Single = {
    multiple?: false;
    value: number;
    onChange?: (value: number) => void;
};
type Multiple = {
    multiple: true;
    value: number[];
    onChange?: (value: number[]) => void;
};
type Props = (Single | Multiple) & {
    min?: number;
    max?: number;
    step?: number;
    /** show ticks on track for each step */
    ticks?: boolean;
    /** min distance between thumbs ... only useful for multiple:true */
    distance?: number;
    /** show tooltip for each thumb or not */
    tooltip?: boolean;
    /** track height */
    trackSize?: number;
    /** thumb size */
    thumbSize?: number;
    /** color of non active part of track */
    trackColor?: string;
    /** color of active part of track */
    activeTrackColor?: string;
    /** color of thumb */
    thumbColor?: string;
    thumbRenderer?: ({ isDragging, value }: { isDragging: boolean; value: number }) => ReactNode;
    tooltipRenderer?: ({ value }: { value: number }) => ReactNode;
    trackClassName?: string;
    activeTrackClassName?: string;
    thumbClassName?: string;
    tooltipClassName?: string;
    className?: string;
};

export default function Slider({
    multiple,
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    ticks = false,
    distance,
    tooltip = true,
    trackSize = 10,
    thumbSize = 20,
    trackColor = 'slate-300',
    activeTrackColor = 'blue-500',
    thumbColor = 'blue-600',
    thumbRenderer,
    tooltipRenderer,
    trackClassName = '',
    activeTrackClassName = '',
    thumbClassName = '',
    tooltipClassName = '',
    className = ''
}: Props) {
    const trackRef = useRef<HTMLDivElement>(null!); //hold DOM node of container element
    const activeTrackRef = useRef<HTMLDivElement>(null!); //hold DOM node of active track element
    const thumbsRefs = useRef<HTMLDivElement[]>([]); //hold DOM nodes of thumbs elements
    const tooltipsRefs = useRef<HTMLDivElement[]>([]); //hold DOM nodes of tooltip elements
    const values = useRef<number[]>(!multiple ? [value] : [...value]); //hold final values of thumbs for updating parent(contains literal slider values not pixels or percentages) ... we use 'ref' for better performance and manually update DOM node styles
    const [draggingIdx, setDraggingIdx] = useState<null | number>(null);
    const trackParsedColor = useColor(trackColor);
    const activeTrackParsedColor = useColor(activeTrackColor);
    const thumbParsedColor = useColor(thumbColor);
    const totalTicks = Math.floor((max - min) / step) - 1;
    const valueToPercent = useCallback(
        (value: number) => {
            return ((value - min) / (max - min)) * 100;
        },
        [min, max]
    );
    const percentToValue = useCallback(
        (percent: number) => {
            return min + (max - min) * percent;
        },
        [min, max]
    );
    const updateValue = useCallback(() => {
        if (!multiple) onChange?.(values.current[0]);
        else onChange?.(values.current.toSorted((a, b) => a - b));
    }, [multiple, onChange]);
    const thumbMoveHandler = useCallback(
        (newValue: number, thumbIdx: number) => {
            // 'newValue' is the value of the thumb that is being dragged ...it is not pixels or percentage
            // 'thumbIdx' is the index of the thumb that is being dragged
            // inside this method we update 'values.current' refs and update DOM nodes(activeTrack,thumbs) styles
            const activeTrack = activeTrackRef.current;
            const snapToStep = Math.max(min, Math.min(Math.round(newValue / step) * step, max));
            let idx = thumbIdx;
            if (!multiple) {
                activeTrack.style.width = `${valueToPercent(snapToStep)}%`;
                activeTrack.style.left = `${0}%`;
            } else {
                const [start, end] = values.current;
                if (
                    typeof distance === 'number' &&
                    Math.abs((idx === 1 ? newValue : end) - (idx === 0 ? newValue : start)) <= distance
                ) {
                    return null;
                }
                if ((idx === 0 && snapToStep > end) || (idx === 1 && snapToStep < start)) {
                    [values.current[0], values.current[1]] = [end, start];
                    idx = idx === 0 ? 1 : 0;
                    setDraggingIdx(idx);
                }
                activeTrack.style.width = `${valueToPercent(end) - valueToPercent(start)}%`;
                activeTrack.style.left = `${valueToPercent(start)}%`;
            }
            const draggingThumb = thumbsRefs.current[idx];
            const tooltip = tooltipsRefs.current[idx];
            draggingThumb.style.left = `${valueToPercent(snapToStep)}%`;
            tooltip.textContent = `${snapToStep}`;
            values.current[idx] = snapToStep;
        },
        [multiple, min, max, step, distance, valueToPercent]
    );
    const onTrackClick = (e: React.MouseEvent) => {
        if (draggingIdx !== null) return null;
        const { clientX } = e;
        const track = trackRef.current;
        const vals = values.current;
        const px = clientX - track.getBoundingClientRect().left;
        const percent = px / track.offsetWidth;
        const newValue = percentToValue(percent);
        const nearestValue = vals.toSorted((a, b) => Math.abs(a - newValue) - Math.abs(b - newValue))[0];
        const nearestThumbIdx = vals.findIndex((v) => v === nearestValue);
        thumbMoveHandler(newValue, nearestThumbIdx); //when click on track we move the 1st thumb
        updateValue();
    };
    const onDragStart = (e: React.MouseEvent | React.TouchEvent, thumbIdx: number) => {
        e.stopPropagation();
        e.preventDefault();
        setDraggingIdx(thumbIdx);
    };
    const onDragMove = useCallback(
        (e: MouseEvent | TouchEvent) => {
            if (draggingIdx === null) return null;
            const track = trackRef.current;
            const { clientX } = 'touches' in e ? e.touches[0] : e;
            const px = clientX - track.getBoundingClientRect().left;
            const percent = px / track.offsetWidth;
            const newValue = percentToValue(percent);
            thumbMoveHandler(newValue, draggingIdx);
        },
        [draggingIdx, percentToValue, thumbMoveHandler]
    );
    const onDragEnd = useCallback(() => {
        //? We call onChange on after the dragging is finished for better performance
        if (draggingIdx === null) return null;
        setDraggingIdx(null);
        updateValue();
    }, [draggingIdx, updateValue]);
    useEffect(() => {
        values.current = !multiple ? [value] : [...value];
        //if we want to sort here we should make a copy(not use .sort and instead use .toSorted or use spread operator)
        values.current.forEach((val, i) => {
            thumbMoveHandler(val, i);
        });
    }, [value, multiple, thumbMoveHandler]);
    useEffect(() => {
        if (draggingIdx !== null) {
            window.addEventListener('mousemove', onDragMove);
            window.addEventListener('touchmove', onDragMove);
            window.addEventListener('mouseup', onDragEnd);
            window.addEventListener('touchend', onDragEnd);
        }
        return () => {
            window.removeEventListener('mousemove', onDragMove);
            window.removeEventListener('touchmove', onDragMove);
            window.removeEventListener('mouseup', onDragEnd);
            window.removeEventListener('touchend', onDragEnd);
        };
    }, [draggingIdx, onDragMove, onDragEnd]);

    return (
        <div
            className={`${className}`}
            style={
                {
                    '--track-size': `${trackSize}px`,
                    '--thumb-size': `${thumbSize}px`,
                    '--track-color': trackParsedColor,
                    '--active-track-color': activeTrackParsedColor,
                    '--thumb-color': thumbParsedColor,
                    '--thumb-color-alpha': alpha(thumbParsedColor, 0.2)
                } as CSSProperties
            }
        >
            <div
                ref={trackRef}
                onClick={onTrackClick}
                className={`track relative w-full cursor-pointer rounded-full select-none ${trackClassName}`}
                style={{ height: `${trackSize}px`, backgroundColor: trackParsedColor }}
            >
                <div
                    ref={activeTrackRef}
                    className={`active-track absolute top-0 h-full rounded-full ${draggingIdx !== null ? 'transition-none' : 'transition-all duration-150'} ${activeTrackClassName}`}
                    style={{
                        backgroundColor: activeTrackParsedColor
                    }}
                />
                {ticks &&
                    Array.from({ length: totalTicks }).map((_, i) => (
                        <span
                            key={i}
                            className='absolute top-1/2 aspect-square h-2/5 -translate-y-1/2 rounded-full bg-slate-200'
                            style={{
                                left: `${valueToPercent(min + (i + 1) * step)}%`
                            }}
                        />
                    ))}
                {values.current.map((value, i) => {
                    const isDragging = i === draggingIdx;
                    return (
                        <div
                            key={i}
                            ref={(node) => {
                                if (node) thumbsRefs.current[i] = node;
                            }}
                            onMouseDown={(e) => onDragStart(e, i)}
                            onTouchStart={(e) => onDragStart(e, i)}
                            className={`thumb absolute top-1/2 -translate-x-1/2 -translate-y-1/2 ${isDragging ? 'z-2 transition-none' : 'transition-all duration-150'} ${thumbClassName}`}
                        >
                            {thumbRenderer?.({ isDragging, value }) || (
                                <div
                                    className={`rounded-circle bg-(--thumb-color) transition-all duration-150 hover:bg-[color-mix(in_srgb,var(--thumb-color),black_30%)] ${isDragging ? 'shadow-[0_0_0_8px_var(--thumb-color-alpha)]' : 'hover:shadow-[0_0_0_5px_var(--thumb-color-alpha)]'}`}
                                    style={{
                                        width: `${thumbSize}px`,
                                        height: `${thumbSize}px`
                                    }}
                                />
                            )}
                            {tooltip &&
                                (tooltipRenderer?.({ value }) || (
                                    <div
                                        ref={(node) => {
                                            if (node) tooltipsRefs.current[i] = node;
                                        }}
                                        className={`text-label-md absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-1 rounded-sm bg-slate-800 p-1 text-white ${tooltipClassName}`}
                                    >
                                        {value}
                                    </div>
                                ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

//? We should always pass initial value for 'value' prop because value must always be number|number[]
