'use client';

import { useState, useRef, useEffect } from 'react';
import Container from '@/components/Container';
import ItemsGroupExample from '@/components/ItemsGroup/example';

const a:string[] = []
const b:typeof a[0] = ''

const TestPage = () => {
    return (
        <Container className='my-30'>
            <ItemsGroupExample />
        </Container>
    );
};

export default TestPage;
