'use client';

import { useState, useRef, useEffect } from 'react';
import Container from '@/components/Container';
import TreeExample from '@/components/Tree/example';

const TestPage = () => {
    return (
        <Container className='my-30 overflow-visible'>
            <TreeExample />
        </Container>
    );
};

export default TestPage;
