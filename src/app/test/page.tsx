'use client';

import { useState, useRef, useEffect } from 'react';
import Container from '@/components/Container';
import SkeletonExample from '@/components/Skeleton/example';

const TestPage = () => {
    return (
        <Container className='my-30'>
            <SkeletonExample />
        </Container>
    );
};

export default TestPage;
