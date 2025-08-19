import { useState } from 'react';
import Collapse from '.';

export default function CollapseExample() {
    const [activeIndex1, setActiveIndex1] = useState(-1);
    const [activeIndex2, setActiveIndex2] = useState<number[]>([]);

    return (
        <div>
            <div>
                <p className='text-title-lg'>#1: Single Faq selection with unmountOnClose:false :</p>
                <div className='mt-5'>
                    {Array.from({ length: 5 }).map((_, i) => {
                        const isOpen = activeIndex1 === i;
                        return (
                            <div key={i}>
                                <div className='flex items-center justify-between gap-4'>
                                    <p className='text-title-lg text-slate-8000'>title-#{i + 1}</p>
                                    <button onClick={() => setActiveIndex1(isOpen ? -1 : i)}>
                                        {isOpen ? 'close' : 'open'}
                                    </button>
                                </div>
                                <Collapse open={isOpen} unmountOnClose={false}>
                                    <div className='mt-2 rounded-md border border-slate-400 bg-slate-200 p-4'>123</div>
                                </Collapse>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className='mt-15'>
                <p className='text-title-lg'>#2: Multiple Faq selection with unmountOnClose:true :</p>
                <div className='mt-5'>
                    {Array.from({ length: 5 }).map((_, i) => {
                        const isOpen = activeIndex2.includes(i);
                        return (
                            <div key={i}>
                                <div className='flex items-center justify-between gap-4'>
                                    <p className='text-title-lg text-slate-8000'>title-#{i + 1}</p>
                                    <button
                                        onClick={() =>
                                            setActiveIndex2((old) =>
                                                !isOpen ? [...old, i] : old.filter((index) => index !== i)
                                            )
                                        }
                                    >
                                        {isOpen ? 'close' : 'open'}
                                    </button>
                                </div>
                                <Collapse open={isOpen} unmountOnClose>
                                    <div className='mt-2 rounded-md border border-slate-400 bg-slate-200 p-4'>123</div>
                                </Collapse>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
