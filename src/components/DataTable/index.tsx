'use client';

import { useState, useEffect, useMemo, useCallback, Fragment, type ReactNode, type ChangeEvent } from 'react';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import Textfield from '@/components/Textfield';
import AutoComplete from '@/components/AutoComplete';
import Checkbox from '@/components/Checkbox';
import Pagination from '@/components/Pagination';
import CircularLoader from '@/components/CircularLoader';
import useColor from '@/hooks/useColor';
import useMediaQuery from '@/hooks/useMediaQuery';

export type Size = 'sm' | 'md' | 'lg';
export type Align = 'start' | 'center' | 'end';
export type Pagination = {
    page: number;
    pageSize: number;
    pageSizes: number[];
};
export type SortOrder = 'asc' | 'desc';
export type Sort = { by: string; order: SortOrder };
export type Width = {
    min?: number | string;
    main?: number | string;
    max?: number | string;
};
export type ClassNames = {
    table?: string; //on <table>
    header?: string; //on <thead>
    headerRow?: string; //on <thead> <tr>
    headerCell?: string; //on <thead> <tr> <th>
    headerCellContent?: string; //on <thead> <tr> <th> <div>
    body?: string; //on <tbody>
    bodyRow?: string; //on <tbody> <tr>
    bodyCell?: string; //on <tbody> <tr> <td>
    bodyCellContent?: string; //on <tbody> <tr> <td> <div>
    bodyRowSelection?: string; //on <tbody> <tr> that is selected
    bodyCellContentExpansion?: string; //on <tbody> <tr> <td> <div> that is expanded
};
export type BaseRow = {
    id: number | string;
    [key: string]: unknown;
};
export type Column<Row> = {
    label: string; //text of header in ui
    value: string; //act as identifier of column , should be one of keys from Row generic(type of each row)
    sortable?: boolean;
    width?: Width;
    align?: Align;
    headerRender?: ({ column }: { column: Column<Row> }) => ReactNode;
    cellRender?: ({ row, column }: { row: Row; column: Column<Row> }) => ReactNode;
    classNames?: Pick<ClassNames, 'headerCell' | 'headerCellContent' | 'bodyCell' | 'bodyCellContent'>;
};
export type Props<Row> = {
    columns: Column<Row>[];
    rows: Row[];
    size?: Size;
    color?: string;
    loading?: boolean;
    loadingText?: string;
    noDataText?: string;
    mobileBreakpoint?: number;
    showSearch?: boolean;
    search?: string;
    onSearchChange?: (newSearch: string) => void;
    showPagination?: boolean;
    pagination?: Pagination;
    onPaginationChange?: (newPagination: Pagination) => void;
    showSort?: boolean;
    sort?: null | Sort;
    onSortChange?: (newSort: null | Sort) => void;
    showSelections?: boolean;
    selections?: (number | string)[];
    onSelectionsChange?: (newSelection: (number | string)[]) => void;
    showExpansions?: boolean;
    expansions?: (number | string)[];
    onExpansionsChange?: (newSelection: (number | string)[]) => void;
    expansionRender?: ({ row }: { row: Row }) => ReactNode;
    classNames?: ClassNames;
    className?: string;
};

const DEFAULT_PAGINATION: Pagination = { page: 1, pageSize: 10, pageSizes: [10, 25, 50, 100] };
const ALL_RECORDS_PAGINATION: Pagination = { page: 1, pageSize: -1, pageSizes: [] };

const DataTable = <Row extends BaseRow>({
    columns = [], //act as headers
    rows = [], //act as items
    size = 'md',
    color = 'primary',
    loading = false,
    loadingText = 'Loading Data...',
    noDataText = 'No Data Found !',
    mobileBreakpoint = 600, //use -1 to disable it
    showSearch = false, //false to totally disable search, true without 'search','onSearchChange' props to have local search, true with 'search','onSearchChange' props to have controlled search from parent
    search = '',
    onSearchChange,
    showPagination = true, //false to totally disable pagination(show all records), true without 'pagination','onPaginationChange' props to have local pagination, true with 'pagination','onPaginationChange' props to have controlled pagination from parent
    pagination, //for show records use --> {page:1,pageSize:-1,pageSizes:[]}
    onPaginationChange,
    showSort = true, //false to totally disable sort, true without 'sort','onSortChange' props to have local sort, true with 'sort','onSortChange' props to have controlled sort from parent(we have 'sortable' key for each header too)
    sort = null,
    onSortChange,
    showSelections = false, //false to totally disable selections, true without 'selections','onSelectionsChange' props to have local selections, true with 'selections','onSelectionsChange' props to have controlled selections from parent
    selections,
    onSelectionsChange,
    showExpansions = false, //false to totally disable expansions, true without 'expansions','onExpansionsChange' props to have local expansions, true with 'expansions','onExpansionsChange' props to have controlled expansions from parent
    expansions,
    onExpansionsChange,
    expansionRender, //jsx content of expansion row
    classNames = {},
    className = ''
}: Props<Row>) => {
    //* States ........................
    const [searchLocal, setSearchLocal] = useState(search || '');
    const [sortLocal, setSortLocal] = useState(sort || null);
    const [paginationLocal, setPaginationLocal] = useState(
        pagination || (showPagination ? DEFAULT_PAGINATION : ALL_RECORDS_PAGINATION)
    );
    const [selectionsLocal, setSelectionsLocal] = useState(selections || []);
    const [expansionsLocal, setExpansionsLocal] = useState(expansions || []);
    const parsedColor = useColor(color);
    const isMobile = useMediaQuery(`(width < ${mobileBreakpoint}px)`);
    //* Methods ........................
    const resetPageHandler = (currentPagination: Pagination) => {
        //? reset pagination to 1st page
        const newPagination = { ...currentPagination, page: 1 };
        setPaginationLocal(newPagination);
        onPaginationChange?.(newPagination);
    };
    const onSearchHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newSearch = e.target.value;
        setSearchLocal(newSearch);
        onSearchChange?.(newSearch);
        if (paginationLocal) resetPageHandler(paginationLocal); //if we change search we should reset page to 1
    };
    const onPaginationHandler = (newPagination: Pagination) => {
        setPaginationLocal(newPagination);
        onPaginationChange?.(newPagination);
        if (newPagination?.pageSize !== paginationLocal?.pageSize) resetPageHandler(newPagination); //if we change pageSize we should reset page to 1
    };
    const onSortHandler = (newSort: null | Sort) => {
        setSortLocal(newSort);
        onSortChange?.(newSort);
    };
    const onSelectionsHandler = useCallback(
        (newSelection: (number | string)[]) => {
            setSelectionsLocal(newSelection);
            onSelectionsChange?.(newSelection);
        },
        [onSelectionsChange]
    );
    const onExpansionsHandler = useCallback(
        (newExpansions: (number | string)[]) => {
            setExpansionsLocal(newExpansions);
            onExpansionsChange?.(newExpansions);
        },
        [onExpansionsChange]
    );
    //* Calculations ........................
    const cellSizeClassNames = size === 'sm' ? 'p-1.5' : size === 'md' ? 'p-3' : 'p-5'; //use on <div> inside each <th>,<td>
    const pageSizesOptions = paginationLocal?.pageSizes.map((pageSize) => ({ label: `${pageSize}`, value: pageSize }));
    const sortOptions = columns
        .filter((col) => showSort && col.sortable !== false)
        .map((col) => ({ label: col.label, value: col.value }));
    const columnsNormalize = useMemo<Column<Row>[]>(() => {
        const columnsCopy = [...columns];
        if (showSelections) {
            columnsCopy.unshift({
                label: '',
                value: 'selection-column',
                align: 'start',
                sortable: false,
                cellRender: ({ row }) => {
                    const { id } = row;
                    const idStr = id.toString();
                    return (
                        <Checkbox
                            checked={selectionsLocal.includes(idStr)}
                            value={idStr}
                            onChange={(checked, value) => {
                                let newValue: (number | string)[] = [];
                                if (checked) newValue = [...selectionsLocal, value];
                                else newValue = selectionsLocal.filter((s) => s !== value);
                                onSelectionsHandler(newValue);
                            }}
                            color={color}
                            size='md'
                            hideMessage
                        ></Checkbox>
                    );
                }
            });
        }
        if (showExpansions) {
            columnsCopy.push({
                label: '',
                value: 'expansion-column',
                align: 'start',
                sortable: false,
                cellRender: ({ row }) => {
                    const { id } = row;
                    const isExpanded = expansionsLocal.includes(id);
                    const newExpansions = isExpanded
                        ? expansionsLocal.filter((exp) => exp !== id)
                        : [...expansionsLocal, id];
                    return (
                        <button
                            onClick={() => {
                                onExpansionsHandler(newExpansions);
                            }}
                        >
                            <Icon
                                icon='solar:alt-arrow-down-outline'
                                size='md'
                                color='neutral'
                                className={`transition-transform duration-200 ${!isExpanded ? 'rotate-0' : '-rotate-180'}`}
                            />
                        </button>
                    );
                }
            });
        }
        return columnsCopy;
    }, [
        columns,
        color,
        showSelections,
        selectionsLocal,
        onSelectionsHandler,
        showExpansions,
        expansionsLocal,
        onExpansionsHandler
    ]);
    const rowsNormalize = useMemo<{ filteredRowsCount: number; rows: Row[] }>(() => {
        const rowsCopy = [...rows];
        let finalRows: Row[] = rowsCopy;
        let filteredRowsCount = finalRows.length;
        //? apply search
        if (searchLocal) {
            finalRows = rowsCopy.filter((row) => {
                return !!Object.values(row).find((val) => `${val}`.includes(searchLocal || ''));
            });
            filteredRowsCount = finalRows.length; //total items of pagination is length of filtered rows not length of paginated rows else we always see only one page in pagination
        }
        //? apply sort
        if (sortLocal) {
            finalRows = finalRows.toSorted((row1, row2) => {
                const { by, order } = sortLocal;
                const row1Val = row1[by as keyof typeof row1] as number | string;
                const row2Val = row2[by as keyof typeof row1] as number | string;
                if (order === 'asc') return row2Val > row1Val ? -1 : 1;
                else return row1Val > row2Val ? -1 : 1;
            });
        }
        //? apply pagination(should be last step)
        if (paginationLocal) {
            const { page, pageSize } = paginationLocal;
            const start = pageSize !== -1 ? (page - 1) * pageSize : 0;
            const end = pageSize !== -1 ? start + pageSize : finalRows.length;
            finalRows = finalRows.slice(start, end);
        }
        //? return final value
        return { filteredRowsCount, rows: finalRows };
    }, [rows, searchLocal, sortLocal, paginationLocal]);
    const isEmpty = !rowsNormalize.rows.length;
    const totalPages = Math.ceil(rowsNormalize.filteredRowsCount / paginationLocal.pageSize);
    const totalCols = columnsNormalize.length;
    const showMobileSort = isMobile && !!sortOptions.length;
    //* UseEffects ........................
    useEffect(() => {
        //update search local state base on prop
        setSearchLocal(search || '');
    }, [search]);
    useEffect(() => {
        //update sort local state base on prop
        setSortLocal(sort || null);
    }, [sort]);
    useEffect(() => {
        //update pagination local state base on prop
        setPaginationLocal(pagination || (showPagination ? DEFAULT_PAGINATION : ALL_RECORDS_PAGINATION));
    }, [showPagination, pagination]);
    useEffect(() => {
        //update selection local state base on prop
        setSelectionsLocal(selections || []);
    }, [selections]);
    useEffect(() => {
        //update expansions local state base on prop
        setExpansionsLocal(expansions || []);
    }, [expansions]);

    return (
        <div className={`${className}`}>
            {(showSearch || showMobileSort) && (
                <div className='mobile:flex-row mobile:items-start mobile:justify-between mb-5 flex flex-col items-stretch gap-5'>
                    {showSearch && (
                        <Textfield
                            value={searchLocal}
                            onChange={onSearchHandler}
                            type='text'
                            variant='outline'
                            size='sm'
                            color={color}
                            placeholder='Search...'
                            clearable={false}
                            hideMessage
                            className='mobile:w-60 w-full'
                        />
                    )}
                    {showMobileSort && (
                        <div className='flex flex-col items-center gap-2'>
                            <AutoComplete
                                mode='select'
                                value={
                                    sortLocal
                                        ? {
                                              label: sortOptions.find((opt) => opt.value === sortLocal.by)?.label,
                                              value: sortLocal.by
                                          }
                                        : null
                                }
                                onChange={(newSortOpt) => {
                                    const val = newSortOpt?.value;
                                    onSortHandler(val ? { by: val, order: sortLocal?.order || 'asc' } : null);
                                }}
                                options={sortOptions}
                                variant='outline'
                                size='sm'
                                theme={{
                                    primary: color
                                }}
                                placeholder='Sort By...'
                                clearable
                                hideMessage
                                className='mobile:w-60 w-full'
                            />
                            {!!sortLocal?.by && (
                                <div className='flex justify-center gap-2'>
                                    {['asc', 'desc'].map((order) => (
                                        <Button
                                            key={order}
                                            variant={sortLocal?.order === order ? 'fill' : 'outline'}
                                            size='sm'
                                            color={color}
                                            onClick={() => {
                                                onSortHandler({
                                                    ...sortLocal,
                                                    order: order as SortOrder
                                                });
                                            }}
                                            className='uppercase'
                                        >
                                            {order}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
            <div className='custom-scrollbar w-full max-w-full overflow-auto'>
                <table className={`w-full ${classNames.table || ''}`}>
                    {!isMobile && (
                        <thead className={`${classNames.header || ''}`}>
                            <tr className={`${classNames.headerRow || ''}`}>
                                {columnsNormalize.map((col) => {
                                    const {
                                        label,
                                        value,
                                        sortable = true,
                                        width = {
                                            min: 0,
                                            main: 'auto',
                                            max: undefined
                                        },
                                        align = 'start',
                                        headerRender,
                                        classNames: colClassNames = {}
                                    } = col;
                                    const { min, main, max } = width;
                                    const canSort = showSort && sortable;
                                    const isSortedOnCol = sortLocal?.by === value;
                                    let newSort: null | Sort = null; //if we don't have any sort use asc, if sort is asc use desc, if sort is desc clear sort
                                    if (canSort) {
                                        if (!isSortedOnCol) newSort = { by: value, order: 'asc' };
                                        else if (sortLocal.order === 'asc') newSort = { by: value, order: 'desc' };
                                        else if (isSortedOnCol) newSort = null;
                                    }
                                    return (
                                        <th
                                            key={value}
                                            rowSpan={1}
                                            colSpan={1}
                                            onClick={() => {
                                                if (canSort) onSortHandler(newSort);
                                            }}
                                            className={`group ${canSort ? 'cursor-pointer' : ''} ${classNames.headerCell || ''} ${colClassNames.headerCell || ''}`}
                                            style={{
                                                minWidth: typeof min === 'number' ? `${min}px` : min,
                                                width: typeof main === 'number' ? `${main}px` : main,
                                                maxWidth: typeof max === 'number' ? `${max}px` : max
                                            }}
                                        >
                                            <div
                                                className={`text-label-lg text-neutral-dark4 flex items-center gap-2 ${align === 'start' ? 'justify-start' : align === 'center' ? 'justify-center' : 'justify-end'} ${cellSizeClassNames} ${classNames.headerCellContent || ''} ${colClassNames.headerCellContent || ''}`}
                                            >
                                                {headerRender ? headerRender({ column: col }) : <span>{label}</span>}
                                                {canSort && (
                                                    // asc sort means up arrow(low-to-high),desc sort means down arrow(high-to-low)
                                                    <Icon
                                                        icon='solar:alt-arrow-up-outline'
                                                        size='sm'
                                                        color='neutral-lighten-3'
                                                        className={`shrink-0 opacity-0 transition-all duration-200 ${isSortedOnCol ? 'opacity-100' : 'group-hover:opacity-100'} ${isSortedOnCol && sortLocal.order === 'desc' ? '-rotate-180' : 'rotate-0'}`}
                                                    />
                                                )}
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                    )}
                    <tbody className={`${classNames.body || ''}`}>
                        {loading && (
                            <tr className={`${classNames.bodyRow || ''}`}>
                                <td colSpan={totalCols} className={`${classNames.bodyRow || ''}`}>
                                    <div
                                        className={`flex flex-col items-center justify-center gap-3 ${cellSizeClassNames} ${classNames.bodyCellContent || ''}`}
                                    >
                                        <CircularLoader color={color} size={80} thickness={3} />
                                        <p className='text-body-lg text-neutral-lighten-2'>{loadingText}</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {!loading && isEmpty && (
                            <tr className={`${classNames.bodyRow || ''}`}>
                                <td colSpan={totalCols} className={`${classNames.bodyRow || ''}`}>
                                    <div
                                        className={`flex flex-col items-center justify-center gap-3 ${cellSizeClassNames} ${classNames.bodyCellContent || ''}`}
                                    >
                                        <p className='text-body-lg text-neutral-lighten-2'>{noDataText}</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {!loading &&
                            !isEmpty &&
                            rowsNormalize.rows.map((row) => {
                                const { id } = row;
                                const isSelected = selectionsLocal.includes(id);
                                const isExpanded = expansionsLocal.includes(id);
                                return (
                                    <Fragment key={id}>
                                        <tr
                                            className={`transition-colors duration-200 ${classNames.bodyRow || ''} ${isSelected ? classNames.bodyRowSelection || '' : ''}`}
                                            style={{
                                                backgroundColor: isSelected ? `${parsedColor}33` : undefined
                                            }}
                                        >
                                            {columnsNormalize.map((col) => {
                                                const {
                                                    label,
                                                    value,
                                                    align = 'start',
                                                    width = { min: 0, main: 'auto', max: undefined },
                                                    headerRender,
                                                    cellRender,
                                                    classNames: colClassNames = {}
                                                } = col;
                                                const { min, main, max } = width;
                                                const cellValue = row[value as keyof typeof row] as ReactNode;

                                                return (
                                                    <Fragment key={value}>
                                                        {!isMobile && (
                                                            <td
                                                                className={`${classNames.bodyCell || ''} ${colClassNames.bodyCell || ''}`}
                                                                style={{
                                                                    minWidth:
                                                                        typeof min === 'number' ? `${min}px` : min,
                                                                    width:
                                                                        typeof main === 'number' ? `${main}px` : main,
                                                                    maxWidth: typeof max === 'number' ? `${max}px` : max
                                                                }}
                                                            >
                                                                <div
                                                                    className={`text-body-md text-neutral ${align === 'start' ? 'text-start' : align === 'center' ? 'text-center' : 'text-end'} ${cellSizeClassNames} ${classNames.bodyCellContent || ''} ${colClassNames.bodyCellContent || ''}`}
                                                                >
                                                                    {cellRender ? (
                                                                        cellRender({ column: col, row })
                                                                    ) : (
                                                                        <span>{cellValue}</span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        )}
                                                        {isMobile && (
                                                            <td
                                                                className={`flex items-start justify-between gap-2 ${classNames.bodyCell || ''} ${colClassNames.bodyCell || ''}`}
                                                            >
                                                                <div
                                                                    className={`text-label-lg text-neutral-dark4 flex-shrink-0 text-start font-semibold ${cellSizeClassNames} ${classNames.headerCellContent || ''} ${colClassNames.headerCellContent || ''}`}
                                                                >
                                                                    {headerRender ? (
                                                                        headerRender({ column: col })
                                                                    ) : (
                                                                        <span>{label}</span>
                                                                    )}
                                                                </div>
                                                                <div
                                                                    className={`text-body-md text-neutral flex-grow text-end ${cellSizeClassNames} ${classNames.bodyCellContent || ''} ${colClassNames.bodyCellContent || ''}`}
                                                                >
                                                                    {cellRender ? (
                                                                        cellRender({ column: col, row })
                                                                    ) : (
                                                                        <span>{cellValue}</span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        )}
                                                    </Fragment>
                                                );
                                            })}
                                        </tr>
                                        {isExpanded && (
                                            <tr
                                                className={`transition-colors duration-200 ${classNames.bodyRow || ''}`}
                                                style={{
                                                    backgroundColor: isSelected ? `${parsedColor}33` : undefined
                                                }}
                                            >
                                                {/* for expanded we use simple <td colSpan={<all-cols>}> */}
                                                <td colSpan={totalCols} className={`${classNames.bodyCell || ''}`}>
                                                    <div
                                                        className={`text-body-md text-neutral ${cellSizeClassNames} ${classNames.bodyCellContent || ''} ${classNames.bodyCellContentExpansion || ''}`}
                                                    >
                                                        {expansionRender ? expansionRender({ row }) : null}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                );
                            })}
                    </tbody>
                </table>
            </div>
            {!!showPagination && (
                <div className='tablet:flex-row tablet:justify-between mt-5 flex flex-col items-center gap-5'>
                    <AutoComplete
                        mode='select'
                        value={{ label: `${paginationLocal.pageSize}`, value: paginationLocal.pageSize }}
                        onChange={(newPageSize) => {
                            onPaginationHandler({ ...paginationLocal, pageSize: newPageSize?.value || 0 });
                        }}
                        options={pageSizesOptions}
                        variant='outline'
                        size='sm'
                        theme={{ primary: color }}
                        placeholder='Page Size...'
                        clearable={false}
                        hideMessage
                        className='tablet:w-[150px] w-full'
                    />
                    <Pagination
                        value={paginationLocal.page}
                        onChange={(newPage) => {
                            onPaginationHandler({ ...paginationLocal, page: newPage });
                        }}
                        totalPages={totalPages}
                        size='md'
                        color={color}
                        navigation
                        circular
                        showHref={false}
                        className='tablet:w-[520px] w-full'
                    />
                </div>
            )}
        </div>
    );
};

export default DataTable;
