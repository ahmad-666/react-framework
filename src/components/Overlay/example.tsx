import { useState, useRef } from 'react';
import Overlay from '.';

export default function OverlayExample() {
    const [show, setShow] = useState(false);
    const content = useRef<HTMLDivElement>(null!);

    return (
        <div>
            <button onClick={() => setShow(!show)}>Show</button>
            <Overlay
                show={show}
                onClick={(e) => {
                    if (!content.current.contains(e.target as HTMLElement)) setShow(false);
                }}
            >
                <div
                    ref={(node) => {
                        if (node) content.current = node;
                    }}
                    className='rounded-md bg-white p-5'
                >
                    <h1>Hello</h1>
                </div>
            </Overlay>
        </div>
    );
}
