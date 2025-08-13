import { useState } from 'react';
import Switch from '.';

export default function SwitchExample() {
    const [value1, setValue1] = useState(false);
    const [value2, setValue2] = useState(false);

    return (
        <div>
            <div>
                <p className='text-title-lg'>#1: inline Switch with coloring and label/error message</p>
                <Switch
                    value={value1}
                    onChange={(newVal) => setValue1(newVal)}
                    trackWidth={50}
                    trackHeight={20}
                    handleSize={16}
                    trackColor='rose-400'
                    handleColor='rose-800'
                    label='Label'
                    error
                    helperText='Error message'
                    className='mt-5'
                />
            </div>
            <div className='mt-20'>
                <p className='text-title-lg'>#2: Outline Switch with custom left/right labels and coloring</p>
                <Switch
                    value={value2}
                    onChange={(newVal) => setValue2(newVal)}
                    trackWidth={50}
                    trackHeight={20}
                    handleSize={26}
                    trackColor={value2 ? 'sky-500' : 'slate-300'}
                    handleColor={value2 ? 'sky-700' : 'white'}
                    leftLabel={
                        <span className={`text-label-md ${value2 ? 'text-neutral-light2' : 'text-neutral-dark4'}`}>
                            Left
                        </span>
                    }
                    rightLabel={
                        <span className={`text-label-md ${value2 ? 'text-neutral-dark4' : 'text-neutral-light2'}`}>
                            Right
                        </span>
                    }
                    className='mt-5'
                />
            </div>
        </div>
    );
}
