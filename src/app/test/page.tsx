'use client';

import { useState, useRef, useEffect } from 'react';
import Container from '@/components/Container';
import TreeExample from '@/components/Tree/example';
import FileUploaderExample from '@/components/FileUploader/example';

const TestPage = () => {
    return (
        <Container className='my-30 overflow-visible'>
            {/* <TreeExample /> */}
            <FileUploaderExample />
        </Container>
    );
};

export default TestPage;
