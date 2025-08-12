import { useState } from 'react';
import Snackbar from '.';

export default function SnackbarExample() {
    const [show, setShow] = useState(false);
    return (
        <div>
            <button onClick={() => setShow(true)}>open snackbar</button>
            <Snackbar
                type='info'
                show={show}
                onChange={(newVal) => setShow(newVal)}
                timeout={2000}
                position='center-center'
                zIndex={10}
            >
                <div className='flex items-center justify-between gap-4'>
                    <p>Some Message for snackbar</p>
                    <button onClick={() => setShow(false)}>X</button>
                </div>
            </Snackbar>
        </div>
    );
}
