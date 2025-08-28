'use client';

import { useState, useRef, useEffect } from 'react';
import Container from '@/components/Container';
import TreeExample from '@/components/Tree/example';
import TabsExample from '@/components/Tabs/example';
import StepperExample from '@/components/Stepper/example';

const TestPage = () => {
    return (
        <Container className='my-30 overflow-visible'>
            {/* <TreeExample /> */}
            <TabsExample />
            <StepperExample />
        </Container>
    );
};

export default TestPage;
