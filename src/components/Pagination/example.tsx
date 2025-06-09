import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Pagination from '.';
import envs from '@/configs/envs';

export default function PaginationExample() {
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const [page, setPage] = useState(1);
    const totalItems = 100;
    const pageSize = 5;
    const totalPages = Math.ceil(totalItems / pageSize);
    const onChange = (newPage: number) => {
        //onChange if we want to manually change route
        router.replace(`/something/${newPage}`);
    };

    return (
        <div>
            <p>active: {page}</p>
            <Pagination
                value={page}
                onChange={(newPage) => setPage(newPage)}
                // onChange={onChange}
                totalPages={totalPages}
                navigation
                siblingCount={2}
                circular
                size='md'
                color='primary'
                showHref
                hrefGenerator={(targetPage) => {
                    //* Default behavior
                    const queries = new URLSearchParams(searchParams);
                    if (targetPage === 1) queries.delete('page');
                    else queries.set('page', `${targetPage}`);
                    return `${envs.frontUrl}${pathName}${queries.size ? `?${queries.toString()}` : ''}`;
                }}
            />
        </div>
    );
}
