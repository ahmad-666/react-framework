'use client';

import { useState, useRef, useEffect } from 'react';
import Container from '@/components/Container';
import TreeExample from '@/components/Tree/example';
import AutoSliderExample from '@/components/AutoSlider/example';

const TestPage = () => {
    return (
        <Container className='my-30 overflow-visible'>
            {/* <TreeExample /> */}
            <AutoSliderExample />
        </Container>
    );
};

export default TestPage;
