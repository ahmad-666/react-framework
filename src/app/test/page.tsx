'use client';

import { useState, useRef, useEffect } from 'react';
import Container from '@/components/Container';
import SnackbarExample from '@/components/Snackbar/example';

const TestPage = () => {
    return (
        <Container className='my-30'>
            <SnackbarExample />
        </Container>
    );
};

export default TestPage;
