import { useState } from 'react';
import Tabs from '.';

export default function TabsExample() {
    const [val1, setVal1] = useState('tab#1');
    const [val2, setVal2] = useState('tab#1');
    const [val3, setVal3] = useState('tab#1');
    const tabs = Array.from({ length: 20 }, (_, i) => `tab#${i + 1}`);

    return (
        <div>
            <div>
                <p className='text-title-lg'>#1: Basic Tabs with grow and center align</p>
                <Tabs
                    value={val1}
                    onChange={(newVal) => setVal1(newVal as string)}
                    align='center'
                    grow
                    showArrows={false}
                    showIndicator={false}
                    activeClassName='bg-slate-300'
                >
                    {tabs.slice(0, 3).map((tab) => (
                        <Tabs.Tab key={tab} value={tab}>
                            {tab}
                        </Tabs.Tab>
                    ))}
                </Tabs>
            </div>
            <div className='mt-30'>
                <p className='text-title-lg'>#2: Draggable Tabs with arrows,indicator</p>
                <Tabs
                    value={val2}
                    onChange={(newVal) => setVal2(newVal as string)}
                    align='start'
                    grow={false}
                    showArrows
                    arrowColor='orange-500'
                    showIndicator
                    activeClassName='bg-slate-300'
                >
                    {tabs.map((tab) => (
                        <Tabs.Tab key={tab} value={tab}>
                            {tab}
                        </Tabs.Tab>
                    ))}
                </Tabs>
            </div>
            <div className='mt-30'>
                <p className='text-title-lg'>#3: Tabs with fixed width with content</p>
                <Tabs value={val3} onChange={(newVal) => setVal3(newVal as string)} activeClassName='bg-slate-300'>
                    {tabs.slice(0, 2).map((tab) => (
                        <Tabs.Tab key={tab} value={tab} className='w-45 text-center'>
                            {tab}
                        </Tabs.Tab>
                    ))}
                    {tabs.slice(0, 2).map((tab, i) => (
                        <Tabs.Content key={tab} value={tab} className='text-title-lg'>
                            Tab#{i + 1}
                        </Tabs.Content>
                    ))}
                </Tabs>
            </div>
        </div>
    );
}
