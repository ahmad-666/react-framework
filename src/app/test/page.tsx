'use client';

import { useState, useRef, useEffect } from 'react';
import Container from '@/components/Container';
import Rating from '@/components/Rating';

const TestPage = () => {
    const [val, setVal] = useState(0);

    return (
        <div>
            <Container className='m-20 !overflow-visible'>
                <Rating value={val} onChange={(newVal) => setVal(newVal)} length={10} halfIncrement />
            </Container>
        </div>
    );
};

export default TestPage;
