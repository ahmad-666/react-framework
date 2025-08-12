'use client';

import { useState, useRef, useEffect } from 'react';
import Container from '@/components/Container';
import OverlayExample from '@/components/Overlay/example';

const TestPage = () => {
    return (
        <Container className='my-30'>
            <OverlayExample />
        </Container>
    );
};

export default TestPage;
