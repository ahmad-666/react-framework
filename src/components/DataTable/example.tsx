import { useState } from 'react';
import DataTable, { type Column, type Pagination, type Sort } from '.';

type Product = {
    id: number | string;
    name: string;
    price: number;
    desc: string;
};

export default function DataTableExample() {
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState<Pagination>({ page: 1, pageSize: 10, pageSizes: [10, 20, 30] });
    const [sort, setSort] = useState<null | Sort>(null);
    const [selections, setSelections] = useState<(number | string)[]>([]);
    const [expansions, setExpansions] = useState<(number | string)[]>([]);
    const products: Product[] = Array.from({ length: 100 }).map((_, i) => ({
        id: i,
        name: `name#${i}`,
        price: i * 1000,
        desc: `desc=${i}`
    }));
    const headers: Column<Product>[] = [
        {
            label: 'Name',
            value: 'name',
            align: 'center',
            width: {
                min: 100, //we can use high min-width on column with mobileBreakpoint={-1} to see horizontal scrollbar
                main: 200,
                max: 300
            },
            sortable: false
        },
        {
            label: 'Price',
            value: 'price',
            headerRender: ({ column }) => <h6>header-{column.label}</h6>,
            cellRender: ({ row, column }) => <p>{Intl.NumberFormat('en-US').format(row.price)}</p>,
            classNames: {
                headerCell: '',
                headerCellContent: '',
                bodyCell: '',
                bodyCellContent: ''
            }
        }
    ];

    return (
        <div>
            <div>
                <h5 className='mb-8'>#1: basic table with custom style </h5>
                <DataTable
                    rows={products}
                    columns={headers}
                    color='secondary'
                    size='md'
                    loading={false}
                    loadingText='Loading...'
                    noDataText='No Data...'
                    mobileBreakpoint={1000}
                    showSearch={false}
                    showPagination={false} //show all
                    showSort={false}
                    showSelections={false}
                    showExpansions={false}
                    classNames={{
                        table: '',
                        header: '',
                        headerRow: 'bg-slate-200',
                        headerCell: 'border-b border-solid border-slate-600',
                        headerCellContent: '',
                        body: '',
                        bodyRow: 'odd:bg-transparent even:bg-slate-100',
                        bodyCellContent: '',
                        bodyCell: '',
                        bodyRowSelection: '',
                        bodyCellContentExpansion: ''
                    }}
                />
            </div>
            <div>
                <h5 className='mb-8'>#2: full features with local states</h5>
                <DataTable
                    rows={products}
                    columns={headers}
                    showSearch
                    showPagination
                    pagination={{ page: 1, pageSize: 5, pageSizes: [5, 10, 15] }}
                    showSort
                    showSelections
                    showExpansions
                />
            </div>
            <div>
                <h5 className='mb-8'>#3: full controlled states</h5>
                <DataTable
                    rows={products}
                    columns={headers}
                    showSearch
                    search={search}
                    onSearchChange={setSearch}
                    showPagination
                    pagination={pagination}
                    onPaginationChange={setPagination}
                    showSort
                    sort={sort}
                    onSortChange={setSort}
                    showSelections
                    selections={selections}
                    onSelectionsChange={setSelections}
                    showExpansions
                    expansions={expansions}
                    onExpansionsChange={setExpansions}
                    expansionRender={({ row }) => <h6>{row.desc}</h6>}
                />
            </div>
        </div>
    );
}
