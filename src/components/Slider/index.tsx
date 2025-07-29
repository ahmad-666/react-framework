'use client';

import React, { useRef, useState, useEffect } from 'react';

export default function Slider({
    min = 0,
    max = 100,
    step = 1,
    values = [20, 80], // [oneThumb] or [leftThumb, rightThumb]
    onChange
}) {
    const trackRef = useRef(null);
    const [thumbs, setThumbs] = useState(values);
    const [dragging, setDragging] = useState(null); // 0 or 1

    useEffect(() => {
        setThumbs(values);
    }, [values]);

    const percent = (val) => ((val - min) / (max - min)) * 100;

    const getValueFromPosition = (clientX) => {
        const rect = trackRef.current.getBoundingClientRect();
        const percent = (clientX - rect.left) / rect.width;
        const rawValue = min + percent * (max - min);
        return Math.min(max, Math.max(min, Math.round(rawValue / step) * step));
    };

    const handleMouseMove = (e) => {
        if (dragging === null) return;
        const newValue = getValueFromPosition(e.clientX);
        setThumbs((prev) => {
            const updated = [...prev];
            updated[dragging] = newValue;

            if (updated.length === 2) {
                if (dragging === 0 && updated[0] > updated[1]) updated[0] = updated[1];
                if (dragging === 1 && updated[1] < updated[0]) updated[1] = updated[0];
            }

            onChange?.(updated);
            return updated;
        });
    };

    const handleMouseUp = () => setDragging(null);

    useEffect(() => {
        if (dragging !== null) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging]);

    return (
        <div className='w-full px-4 py-6'>
            <div ref={trackRef} className='relative h-2 rounded-full bg-gray-300'>
                {/* Range Highlight */}
                <div
                    className='absolute h-full rounded-full bg-blue-500'
                    style={{
                        left: `${percent(thumbs.length === 2 ? thumbs[0] : min)}%`,
                        width: `${thumbs.length === 2 ? percent(thumbs[1]) - percent(thumbs[0]) : percent(thumbs[0])}%`
                    }}
                />
                {/* Thumbs */}
                {thumbs.map((val, i) => (
                    <div
                        key={i}
                        className='absolute top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer rounded-full border-2 border-blue-500 bg-white shadow-md'
                        style={{ left: `${percent(val)}%` }}
                        onMouseDown={() => setDragging(i)}
                    />
                ))}
            </div>
        </div>
    );
}
