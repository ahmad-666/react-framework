'use client';

import { useState, useRef, useEffect } from 'react';
import Container from '@/components/Container';
import TreeExample from '@/components/Tree/v2-example';
import TimelineExample from '@/components/Timeline/example';

const TestPage = () => {
    return (
        <Container className='my-30 overflow-visible'>
            <TreeExample />
            {/* <TimelineExample /> */}
        </Container>
    );
};

export default TestPage;
