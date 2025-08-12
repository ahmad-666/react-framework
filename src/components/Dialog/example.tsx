'use client';

import { useState } from 'react';
import Dialog from '.';

export default function DialogExample() {
    const [show, setShow] = useState(false);

    return (
        <div>
            <button onClick={() => setShow(true)}>show dialog</button>
            <Dialog
                show={show}
                onChange={(newVal) => setShow(newVal)}
                zIndex={6}
                overlayColor='rgba(0,0,0,.5)'
                closeOnOverlayClick
                width={500}
                maxWidth='90vw'
                contentClassName='text-primary'
            >
                <button onClick={() => setShow(false)}>X</button>
                <p className='mt-5'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
            </Dialog>
        </div>
    );
}
