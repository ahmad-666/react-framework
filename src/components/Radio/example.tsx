import { useState } from 'react';
import RadioGroup from '.';

export default function RadioExample() {
    const [val, setVal] = useState<null | string>(null);

    return (
        <div>
            <RadioGroup
                value={val}
                onChange={(newVal) => setVal(newVal as string)}
                name='radio-group'
                color='purple-500'
                size='sm'
                label='Label'
                error
                helperText='Error Message'
            >
                <RadioGroup.Radio value='a'>🍌 #A Radio</RadioGroup.Radio>
                <RadioGroup.Radio value='b'>🌓 #B Radio</RadioGroup.Radio>
                <RadioGroup.Radio value='c'>🐳 #C Radio</RadioGroup.Radio>
            </RadioGroup>
        </div>
    );
}
