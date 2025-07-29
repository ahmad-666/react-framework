'use client';

import { useState, useRef, useEffect } from 'react';
import Container from '@/components/Container';
import SliderExample from '@/components/Slider/example';

const TestPage = () => {
    return (
        <div>
            <Container className='m-20 !overflow-visible'>
                <SliderExample />
            </Container>
        </div>
    );
};

export default TestPage;
