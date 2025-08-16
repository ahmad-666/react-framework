'use client';

import { useId, useRef, useLayoutEffect, useMemo, useCallback, type RefObject } from 'react';
import useColor from '@/hooks/useColor';
import styles from './styles.module.css';

type Props = {
    /** use in svg attributes --> <svg width={width} height={height} viewport={`0 0 ${width} ${height}`}> */
    width?: number;
    /** use in svg attributes --> <svg width={width} height={height} viewport={`0 0 ${width} ${height}`}> */
    height?: number;
    /** not padding of svg and it affect our x,y coords of svg path or polyline ... if we see points getting overflowed we should use this */
    padding?: number;
    data: number[];
    smooth?: boolean;
    smoothFactor?: number;
    autoDraw?: boolean;
    strokeWidth?: number;
    strokeColor?: string;
    strokeGradient?: string[];
    strokeGradientDirection?: 'left' | 'right';
    fill?: boolean;
    fillColor?: string;
    fillGradient?: string[];
    fillGradientDirection?: 'top' | 'bottom' | 'left' | 'right';
    className?: string;
};

export default function SparkLine({
    width = 100,
    height = 50,
    padding = 10,
    data = [],
    smooth = false,
    smoothFactor = 0.2,
    autoDraw = false,
    strokeWidth = 1,
    strokeColor = 'zinc-600',
    strokeGradient = [],
    strokeGradientDirection = 'right',
    fill = false,
    fillColor = 'zinc-300',
    fillGradient = [],
    fillGradientDirection = 'bottom',
    className = ''
}: Props) {
    const pathRef = useRef<SVGPolylineElement | SVGPathElement>(null!);
    const parsedStrokeColor = useColor(strokeColor);
    const parsedFillColor = useColor(fillColor);
    const generatedId = useId().replace(/\W/g, '');
    const strokeGradientId = `stroke-gradient-${generatedId}`;
    const fillGradientId = `fill-gradient-${generatedId}`;
    const min = data.length ? Math.min(...data) : 0;
    const max = data.length ? Math.max(...data) : 0;
    const distance = max - min || 1; //prevent divide by zero
    const clamp = (val: number) => {
        return Math.min(Math.max(min, val), max);
    };
    const catmullRom = useCallback(
        (points: [number, number][]) => {
            // this is utility function that used catmull-rom to convert points to bezier curve means converting sharp path smooth(curve) path
            if (points.length < 2) return '';
            let d = `M ${points[0][0]} ${points[0][1]}`;
            for (let i = 0; i < points.length - 1; i++) {
                const [x0, y0] = i === 0 ? points[i] : points[i - 1];
                const [x1, y1] = points[i];
                const [x2, y2] = points[i + 1];
                const [x3, y3] = i + 2 < points.length ? points[i + 2] : points[i + 1];
                const cp1x = x1 + (x2 - x0) * smoothFactor;
                const cp1y = y1 + (y2 - y0) * smoothFactor;
                const cp2x = x2 - (x3 - x1) * smoothFactor;
                const cp2y = y2 - (y3 - y1) * smoothFactor;
                d += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${x2} ${y2}`;
            }
            return d;
        },
        [smoothFactor]
    );
    const points = useMemo(() => {
        const points: [number, number][] = [];
        data.forEach((d, i) => {
            const wPadding = width - padding * 2;
            const hPadding = height - padding * 2;
            const x = padding + (i / (data.length - 1)) * wPadding;
            const y = padding + hPadding - ((d - min) / distance) * hPadding;
            points.push([x, y]);
        });
        return points;
    }, [width, height, padding, min, data, distance]);
    const sharpPoints = useMemo(() => points.join(' '), [points]); //for uses in <polyline points />
    const smoothPath = useMemo(() => catmullRom(points), [points, catmullRom]); //for uses in <path d />
    const fillPath = useMemo(
        () =>
            !smooth
                ? `${sharpPoints} ${width},${height} 0,${height} Z`
                : `${smoothPath} L ${width} ${height} L 0 ${height} Z`,
        [width, height, smooth, sharpPoints, smoothPath]
    );
    useLayoutEffect(() => {
        const path = pathRef.current;
        if (path && autoDraw) {
            const length = path.getTotalLength();
            path.style.strokeDasharray = `${length}`;
            path.style.strokeDashoffset = `${length}`;
        }
    }, [autoDraw]);

    return (
        <div className={`${className}`}>
            <svg
                role='img'
                aria-label='sparkline-chart'
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
            >
                <defs>
                    {!!strokeGradient.length && (
                        <linearGradient
                            id={strokeGradientId}
                            x1={strokeGradientDirection === 'left' ? '100%' : 0}
                            y1={0}
                            x2={strokeGradientDirection === 'right' ? '100%' : 0}
                            y2={0}
                        >
                            {strokeGradient.map((color, i, colors) => (
                                <stop
                                    key={i}
                                    stopColor={color}
                                    offset={colors.length > 1 ? i / (colors.length - 1) : 0} //prevent divide by zero
                                ></stop>
                            ))}
                        </linearGradient>
                    )}
                    {!!fillGradient.length && (
                        <linearGradient
                            id={fillGradientId}
                            x1={fillGradientDirection === 'left' ? '100%' : 0}
                            y1={fillGradientDirection === 'top' ? '100%' : 0}
                            x2={fillGradientDirection === 'right' ? '100%' : 0}
                            y2={fillGradientDirection === 'bottom' ? '100%' : 0}
                        >
                            {fillGradient.map((color, i, colors) => (
                                <stop
                                    key={i}
                                    stopColor={color}
                                    offset={colors.length > 1 ? i / (colors.length - 1) : 0} //prevent divide by zero
                                ></stop>
                            ))}
                        </linearGradient>
                    )}
                </defs>
                {!smooth ? (
                    <polyline
                        ref={pathRef as RefObject<SVGPolylineElement>}
                        points={sharpPoints}
                        strokeWidth={strokeWidth}
                        stroke={strokeGradient.length ? `url(#${strokeGradientId})` : parsedStrokeColor}
                        fill='none'
                        className={`${autoDraw ? styles['auto-draw'] : ''}`}
                    />
                ) : (
                    <path
                        ref={pathRef as RefObject<SVGPathElement>}
                        d={smoothPath}
                        strokeWidth={strokeWidth}
                        stroke={strokeGradient.length ? `url(#${strokeGradientId})` : parsedStrokeColor}
                        fill='none'
                        className={`${autoDraw ? styles['auto-draw'] : ''}`}
                    />
                )}
                {fill && (
                    <>
                        {!smooth ? (
                            <polyline
                                points={fillPath}
                                stroke='none'
                                fill={fillGradient.length ? `url(#${fillGradientId})` : parsedFillColor}
                                opacity={0.3}
                            />
                        ) : (
                            <path
                                d={fillPath}
                                stroke='none'
                                fill={fillGradient.length ? `url(#${fillGradientId})` : parsedFillColor}
                                opacity={0.3}
                            />
                        )}
                    </>
                )}
            </svg>
        </div>
    );
}
