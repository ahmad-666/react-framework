import { Children, cloneElement, isValidElement, type ReactNode } from 'react';
import Icon from '@/components/Icon';

//* Breadcrumb Item Component -----------------------------------
type ItemProps = {
    children: ReactNode;
    className?: string;
};
const Item = ({ children, className = '' }: ItemProps) => {
    return <div className={`text-body-md text-slate-600 ${className}`}>{children}</div>;
};
//* Breadcrumb Component -----------------------------------
type BreadcrumbsProps = {
    separate?: ReactNode;
    children: ReactNode;
    containerClassName?: string;
    className?: string;
};
const Breadcrumbs = ({ separate, children, containerClassName = '', className = '' }: BreadcrumbsProps) => {
    return (
        <nav className={`inline-block ${className}`}>
            <ol className={`flex flex-wrap items-center justify-start gap-2 ${containerClassName}`}>
                {Children.map(children, (item, i) => {
                    const isLastItem = Children.count(children) === i + 1;
                    if (!isValidElement<ItemProps>(item)) return null;
                    return (
                        <>
                            <li>
                                {cloneElement(item, {
                                    ...item.props
                                    // children: item.props.children,
                                })}
                            </li>
                            {!isLastItem && (
                                <li>{separate || <Icon icon='mdi:chevron-right' size='md' color='slate-600' />}</li>
                            )}
                        </>
                    );
                })}
            </ol>
        </nav>
    );
};
//* Exports -----------------------------------
Breadcrumbs.Item = Item;
export default Breadcrumbs;
