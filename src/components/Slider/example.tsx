import { useState } from 'react';
import Slider from '.';

export default function SliderExample() {
    const [val1, setVal1] = useState(90);
    const [val2, setVal2] = useState([20, 60]);

    return (
        <div>
            {val1}
            <Slider value={val1} onChange={(v) => setVal1(v)} min={0} max={100} step={10} />
            {val2}
            <Slider
                multiple
                value={val2}
                onChange={(v) => setVal2(v)}
                min={0}
                max={100}
                step={1}
                distance={5}
                tooltip
                ticks
                // thumbRenderer={({value,isDragging}) => <div className='aspect-square w-10 bg-red-500' />}
                // tooltipRenderer={({value}) => <div>{value}</div>}
            />
        </div>
    );
}
