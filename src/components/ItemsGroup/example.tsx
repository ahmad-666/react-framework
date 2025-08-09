import { useState } from 'react';
import ItemsGroup from '.';

export default function Example() {
    const [val1, setVal1] = useState<null | number>(null);
    const [val2, setVal2] = useState<string[]>([]);

    return (
        <div>
            <div>
                <p className='text-title-lg'>#1: Single Items-Group:</p>
                <ItemsGroup
                    multiple={false}
                    value={val1}
                    onChange={(newVal) => {
                        setVal1(newVal as null | number);
                        // if (newVal) setVal1(newVal as number) --> If we want mandatory effect
                    }}
                    activeClassName='bg-primary text-white'
                    className='grid grid-cols-3 gap-4'
                >
                    {[1, 2, 3].map((item) => (
                        <ItemsGroup.Item
                            key={item}
                            value={item}
                            className='rounded-sm border border-slate-400 p-5 text-center'
                        >
                            {item}
                        </ItemsGroup.Item>
                    ))}
                </ItemsGroup>
            </div>
            <div className='mt-30'>
                <p className='text-title-lg'>#2: Multiple Items-Group:</p>
                <ItemsGroup
                    multiple
                    value={val2}
                    onChange={(newVal) => {
                        setVal2(newVal as string[]);
                        // if (newVal.length) setVal2(newVal as string[]) --> If we want mandatory effect
                    }}
                    activeClassName='bg-primary text-white'
                    className='grid grid-cols-3 gap-4'
                >
                    {['a', 'b', 'c'].map((item) => (
                        <ItemsGroup.Item
                            key={item}
                            value={item}
                            className='rounded-sm border border-slate-400 p-5 text-center'
                        >
                            {item}
                        </ItemsGroup.Item>
                    ))}
                </ItemsGroup>
            </div>
        </div>
    );
}
