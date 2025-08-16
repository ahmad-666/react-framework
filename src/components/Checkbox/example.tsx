import { useState } from 'react';
import Checkbox from '.';

export default function CheckboxExample() {
    const [val1, setVal1] = useState(false);
    const [val2, setVal2] = useState<string[]>([]);

    return (
        <div>
            <div>
                <p>#1: Single boolean checkbox</p>
                <Checkbox
                    id='id'
                    name='name'
                    checked={val1}
                    onChange={(checked) => setVal1(checked)}
                    readOnly={false}
                    disabled={false}
                    size='sm'
                    color='sky-600'
                    className='mt-5'
                >
                    label of checkbox
                </Checkbox>
            </div>
            <div className='mt-20'>
                <p>#2: Multiple array checkbox</p>
                <div className='mt-5 flex flex-col gap-5'>
                    {['val1', 'val2', 'val3'].map((item) => (
                        <Checkbox
                            key={item}
                            checked={val2.includes(item)}
                            value={item}
                            onChange={(checked, value) => {
                                if (checked) setVal2((old) => [...old, value as string]);
                                else setVal2((old) => old.filter((o) => o !== value));
                            }}
                            color='purple-500'
                            size='md'
                            error
                            message='This is a message'
                        >
                            <span className='text-body-lg font-bold text-orange-500'>{item}</span>
                        </Checkbox>
                    ))}
                </div>
            </div>
        </div>
    );
}
