import { useState } from 'react';
import Animation from '.';

export default function AnimationExample() {
    const [show, setShow] = useState(false);

    return (
        <div>
            <button onClick={() => setShow((old) => !old)}>toggle animation</button>
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
    );
}
