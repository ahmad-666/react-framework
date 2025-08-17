import { useState } from 'react';
import Checkbox from '.';
import Icon from '@/components/Icon';

export default function CheckboxExample() {
    const [val1, setVal1] = useState(false);
    const [val2, setVal2] = useState<string[]>([]);

    return (
        <div>
            <div>
                <p>#1: Single boolean checkbox with custom props , icons</p>
                <Checkbox
                    id='id'
                    name='name'
                    checked={val1}
                    indeterminate //only goes into indeterminate state when checked is false because checked has higher priority
                    onChange={({ e, checked, indeterminate, value }) => setVal1(checked)}
                    readOnly={false}
                    disabled={false}
                    size={25}
                    color='orange-600'
                    checkedIcon={<Icon icon='solar:check-read-linear' size='lg' color='white' />}
                    indeterminateIcon={<Icon icon='solar:minus-circle-outline' size='lg' color='white' />}
                    error
                    message='error msg'
                    className='mt-3'
                >
                    label of checkbox
                </Checkbox>
            </div>
            <div className='mt-10'>
                <p>#2: Multiple array checkbox</p>
                <div className='mt-3 flex flex-col items-start gap-2'>
                    {['val1', 'val2', 'val3'].map((item) => (
                        <Checkbox
                            key={item}
                            checked={val2.includes(item)}
                            value={item}
                            onChange={({ checked, value }) => {
                                if (checked) setVal2((old) => [...old, value]);
                                else setVal2((old) => old.filter((o) => o !== value));
                            }}
                            hideMessage
                        >
                            <span className='text-body-lg font-bold text-orange-500'>{item}</span>
                        </Checkbox>
                    ))}
                </div>
            </div>
        </div>
    );
}
