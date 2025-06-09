'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Icon from '@/components/Icon';
import useColor from '@/hooks/useColor';
import envs from '@/configs/envs';
import styles from './styles.module.css';

type Size = 'sm' | 'md' | 'lg' | number;
type Props = {
    value: number;
    onChange?: (newPage: number) => void;
    /** calc it via Math.ceil(total_items/page_size) */
    totalPages: number;
    siblingCount?: number;
    navigation?: boolean;
    size?: Size;
    color?: string;
    circular?: boolean;
    showHref?: boolean;
    hrefGenerator?: (page: number) => string;
    containerClassName?: string;
    navClassName?: string;
    pageClassName?: string;
    disabledClassName?: string;
    activePageClassName?: string;
    className?: string;
};

export default function Pagination({
    value = 1,
    onChange,
    totalPages,
    siblingCount = 2,
    navigation = true, //show prev,next page btns
    size = 'md',
    color = 'primary',
    circular = false,
    showHref = false,
    hrefGenerator, //generate href for nav btns,pages,...
    containerClassName = '',
    navClassName = '', //for prev,next navigation btns
    pageClassName = '', //for each page
    activePageClassName = '', //for active page
    disabledClassName = '', //for disable nav(s),page(s)
    className = ''
}: Props) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const parsedColor = useColor(color);
    const pageSize = (() => {
        switch (size) {
            case 'sm':
                return 30;
            case 'md':
                return 40;
            case 'lg':
                return 50;
            default:
                return size;
        }
    })();
    const paginationConfig = (() => {
        const firstPage = 1;
        const lastPage = totalPages;
        const leftSiblingStart = Math.max(firstPage, value - siblingCount);
        const rightSiblingEnd = Math.min(value + siblingCount, lastPage);
        return {
            firstPage,
            lastPage,
            leftSiblingStart,
            leftSiblingEnd: leftSiblingStart + siblingCount,
            rightSiblingStart: rightSiblingEnd - siblingCount,
            rightSiblingEnd,
            showLeftDots: leftSiblingStart - firstPage > 1 && totalPages > siblingCount * 2 + 5,
            showRightDots: lastPage - rightSiblingEnd > 1 && totalPages > siblingCount * 2 + 5,
            //we use '5' as offset because consider we are in middle of pagination we want to show dots if (2*siblingCount)+5(activePage+firstPage+lastPage+leftDots+rightDots) are less than total pages
            prevDisabled: value <= firstPage,
            nextDisabled: value >= lastPage
        };
    })();
    const paginationRange = (() => {
        let result: (number | '...')[] = [];
        const { firstPage, lastPage, leftSiblingStart, rightSiblingEnd, showLeftDots, showRightDots } =
            paginationConfig;
        const getRange = (start: number, end: number) =>
            Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
        if (!showLeftDots && !showRightDots) result = [...getRange(firstPage, lastPage)];
        else if (showLeftDots && !showRightDots)
            result = [firstPage, '...', ...getRange(lastPage - (2 * siblingCount + 2), lastPage)];
        else if (!showLeftDots && showRightDots)
            result = [...getRange(firstPage, firstPage + (2 * siblingCount + 2)), '...', lastPage];
        else if (showLeftDots && showRightDots)
            result = [firstPage, '...', ...getRange(leftSiblingStart, rightSiblingEnd), '...', lastPage];
        return [...result];
    })();
    const defaultHrefGenerator = (targetPage: number) => {
        const queries = new URLSearchParams(searchParams);
        if (targetPage === 1) queries.delete('page');
        else queries.set('page', `${targetPage}`);
        return `${envs.frontUrl}${pathname}${queries.size ? `?${queries.toString()}` : ''}`;
    };
    const hrefBuilder = (page: number) => {
        return hrefGenerator ? hrefGenerator(page) : defaultHrefGenerator(page);
    };
    const onPageClick = (newPage: number) => {
        onChange?.(newPage);
    };
    const onPrevPage = () => {
        onPageClick(Math.max(paginationConfig.firstPage, value - 1));
    };
    const onNextPage = () => {
        onPageClick(Math.min(value + 1, paginationConfig.lastPage));
    };

    if (!totalPages) return null;
    return (
        <div className={`inline-block ${styles.container} ${className}`}>
            <nav>
                <ul className={`flex flex-wrap items-center justify-center gap-2 ${containerClassName}`}>
                    {navigation && (
                        <li
                            onClick={onPrevPage}
                            className={`${styles['page-item']} ${paginationConfig.prevDisabled ? `${styles.disabled} ${disabledClassName}` : ''} ${navClassName}`}
                            style={{
                                width: `${pageSize}px`,
                                height: `${pageSize}px`
                            }}
                        >
                            <a
                                rel={paginationConfig.prevDisabled ? undefined : 'prev'}
                                role='button'
                                aria-label='prev btn'
                                aria-disabled={paginationConfig.prevDisabled}
                                href={paginationConfig.prevDisabled || !showHref ? undefined : hrefBuilder(value - 1)}
                                onClick={(e) => {
                                    if (e.ctrlKey) e.stopPropagation();
                                    else e.preventDefault();
                                }}
                                className={styles.page}
                            >
                                <Icon icon='solar:alt-arrow-left-outline' size='sm' color='neutral' />
                            </a>
                        </li>
                    )}
                    {paginationRange.map((page, idx) => {
                        const isDot = typeof page === 'string';
                        const isActive = value === page;
                        return (
                            <li
                                key={`${page}-${idx}`}
                                onClick={() => !isDot && onPageClick(page)}
                                className={`text-label-md transition-colors duration-200 ${styles['page-item']} ${circular ? styles.circular : ''} ${isDot ? `${styles.disabled} ${disabledClassName}` : ''} ${isActive ? `${styles.active} ${activePageClassName}` : ''} ${pageClassName}`}
                                style={{
                                    width: `${pageSize}px`,
                                    height: `${pageSize}px`,
                                    backgroundColor: isActive ? parsedColor : 'transparent'
                                }}
                            >
                                <a
                                    role={isDot ? undefined : 'button'}
                                    aria-label={isDot ? 'dots' : `page ${page}`}
                                    href={isDot || !showHref ? undefined : hrefBuilder(page)}
                                    onClick={(e) => {
                                        if (e.ctrlKey)
                                            e.stopPropagation(); //if we are holding ctrl key when clicking open link normally but not trigger <li onClick />
                                        else e.preventDefault(); //while link has href it will not be clickable and instead we change pagination state via <li onClick />
                                    }}
                                    className={styles.page}
                                >
                                    {page}
                                </a>
                            </li>
                        );
                    })}
                    {navigation && (
                        <li
                            onClick={onNextPage}
                            className={`${styles['page-item']} ${paginationConfig.nextDisabled ? `${styles.disabled} ${disabledClassName}` : ''} ${navClassName}`}
                            style={{
                                width: `${pageSize}px`,
                                height: `${pageSize}px`
                            }}
                        >
                            <a
                                rel={paginationConfig.nextDisabled ? undefined : 'next'}
                                role='button'
                                aria-label='next btn'
                                aria-disabled={paginationConfig.nextDisabled}
                                href={paginationConfig.nextDisabled || !showHref ? undefined : hrefBuilder(value + 1)}
                                onClick={(e) => {
                                    if (e.ctrlKey) e.stopPropagation();
                                    else e.preventDefault();
                                }}
                                className={styles.page}
                            >
                                <Icon icon='solar:alt-arrow-right-outline' size='sm' color='neutral' />
                            </a>
                        </li>
                    )}
                </ul>
            </nav>
        </div>
    );
}
