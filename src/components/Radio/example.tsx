import { useState } from 'react';
import RadioGroup from '.';
import Icon from '@/components/Icon';

export default function RadioExample() {
    const [val1, setVal1] = useState<null | string>(null);
    const [val2, setVal2] = useState<null | string>(null);

    return (
        <div>
            <div>
                <p>#1: Radio Group Component variant:icon prop</p>
                <RadioGroup
                    value={val1}
                    onChange={(newVal) => setVal1(newVal as string)}
                    variant='icon'
                    icon={<Icon icon='mdi:check' size='sm' color='white' />}
                    className='mt-4'
                >
                    <RadioGroup.Radio value='a' disabled>
                        #Disabled Radio
                    </RadioGroup.Radio>
                    <RadioGroup.Radio value='b' readOnly>
                        #Readonly Radio
                    </RadioGroup.Radio>
                    <RadioGroup.Radio value='c'>#Selectable Radio</RadioGroup.Radio>
                </RadioGroup>
            </div>
            <div className='mt-20'>
                <p>#2: Radio Group Component with variant:no-icon and advances props</p>
                <RadioGroup
                    value={val2}
                    onChange={(newVal) => setVal2(newVal as string)}
                    variant='no-icon'
                    name='radio-group'
                    color='purple-500'
                    size={22}
                    label='Label'
                    error
                    helperText='Error Message'
                    className='mt-4'
                >
                    <RadioGroup.Radio value='a'>🍌 #A Radio</RadioGroup.Radio>
                    <RadioGroup.Radio value='b'>🌓 #B Radio</RadioGroup.Radio>
                    <RadioGroup.Radio value='c'>🐳 #C Radio</RadioGroup.Radio>
                </RadioGroup>
            </div>
        </div>
    );
}
