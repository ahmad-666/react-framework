'use client';

import { useState, useRef, useEffect } from 'react';
import Container from '@/components/Container';
import TreeExample from '@/components/Tree/example';
import StepperExample from '@/components/Stepper/example';
import AnimationExample from '@/components/Animation/example';

const TestPage = () => {
    return (
        <Container className='my-30 overflow-visible'>
            {/* <TreeExample /> */}
            {/* <StepperExample /> */}
            <AnimationExample />
        </Container>
    );
};

export default TestPage;
