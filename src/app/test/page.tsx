'use client';

import { useState, useRef, useEffect } from 'react';
import Container from '@/components/Container';
import SparkLineExample from '@/components/SparkLine/example';

const TestPage = () => {
    return (
        <Container className='my-30 overflow-visible'>
            <SparkLineExample />
        </Container>
    );
};

export default TestPage;
