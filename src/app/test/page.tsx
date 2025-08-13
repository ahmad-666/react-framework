'use client';

import { useState, useRef, useEffect } from 'react';
import Container from '@/components/Container';
import RadioExample from '@/components/Radio/example';

const TestPage = () => {
    return (
        <Container className='my-30 overflow-visible'>
            <RadioExample />
        </Container>
    );
};

export default TestPage;
