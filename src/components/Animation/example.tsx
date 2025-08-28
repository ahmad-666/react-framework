import { useState } from 'react';
import Animation from '.';

export default function AnimationExample() {
    const [show, setShow] = useState(false);
    const [tab, setTab] = useState(1);

    return (
        <div>
            <div>
                <p className='text-title-lg'>#1: Simple in/out animation:</p>
                <button onClick={() => setShow((old) => !old)} className='mt-5'>
                    toggle animation
                </button>
                <Animation show={show} animation='fade' duration={1000} easing='linear' className='mt-5'>
                    <div className='text-title-lg rounded-md border border-slate-900 p-5 text-slate-700'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                    </div>
                </Animation>
                <Animation show={show} animation='slide-ltr' duration={500} easing='ease-in-out' className='mt-5'>
                    <div className='text-title-lg rounded-md border border-slate-900 p-5 text-slate-700'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                    </div>
                </Animation>
            </div>
            <div className='mt-20'>
                <p className='text-title-lg'>#2: More complex animation with tabs:</p>
                <div className='mt-5 flex justify-center gap-2'>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            onClick={() => setTab(i + 1)}
                            className='text-body-lg rounded-md border p-2 text-slate-700'
                        >
                            tab#{i + 1}
                        </div>
                    ))}
                </div>
                <div className='text-title-lg mt-5 overflow-hidden border border-slate-700 p-10 text-slate-700'>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i}>
                            <Animation show={tab === i + 1} duration={300} animation='slide-ltr'>
                                <div>content of {i + 1}</div>
                            </Animation>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
