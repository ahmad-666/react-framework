'use client';

import { useState, useRef, useEffect } from 'react';
import Container from '@/components/Container';
import SwitchExample from '@/components/Switch/example';

const TestPage = () => {
    return (
        <Container className='my-30 overflow-visible'>
            <SwitchExample />
        </Container>
    );
};

export default TestPage;
