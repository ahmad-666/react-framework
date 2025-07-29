import React from 'react';
import Slider from '.';

export default function SliderExample() {
    return (
        <div>
            <Slider
                min={0}
                max={100}
                step={1}
                values={[25]} // Single thumb
                onChange={(v) => console.log('Single:', v)}
            />

            <Slider
                min={0}
                max={100}
                step={1}
                values={[30, 70]} // Double thumbs
                onChange={(v) => console.log('Double:', v)}
            />
        </div>
    );
}
