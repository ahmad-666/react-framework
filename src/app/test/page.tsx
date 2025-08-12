'use client';

import { useState, useRef, useEffect } from 'react';
import Container from '@/components/Container';
import TooltipExample from '@/components/Tooltip/example';

const TestPage = () => {
    return (
        <Container className='my-30 overflow-visible'>
            <TooltipExample />
        </Container>
    );
};

export default TestPage;
