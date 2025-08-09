'use client';

import { useState, useRef, useEffect } from 'react';
import Container from '@/components/Container';
import TabsExample from '@/components/Tabs/example';

const TestPage = () => {
    return (
        <Container className='my-30'>
            <TabsExample />
        </Container>
    );
};

export default TestPage;
