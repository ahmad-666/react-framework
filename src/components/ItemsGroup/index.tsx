import { Children, cloneElement, isValidElement, type ReactNode } from 'react';

type ItemProps = {
    value: number | string;
    onChange?: (newValue: number | string) => void;
    isActive?: boolean;
    children: ReactNode;
    activeClassName?: string;
    className?: string;
};
const Item = ({ value, onChange, isActive = false, children, activeClassName = '', className = '' }: ItemProps) => {
    return (
        <div
            onClick={() => onChange?.(value)}
            className={`cursor-pointer ${isActive ? activeClassName : ''} ${className}`}
        >
            {children}
        </div>
    );
};

type ItemsGroupSingle = {
    multiple?: false;
    value: null | number | string;
    onChange: (newValue: null | number | string) => void;
};
type ItemsGroupMultiple = {
    multiple: true;
    value: (number | string)[];
    onChange: (newValue: (number | string)[]) => void;
};
type ItemsGroupProps = (ItemsGroupSingle | ItemsGroupMultiple) &
    Pick<ItemProps, 'children' | 'activeClassName' | 'className'>;
const ItemsGroup = ({ multiple, value, onChange, children, activeClassName = '', className = '' }: ItemsGroupProps) => {
    return (
        <div className={`${className}`}>
            {Children.map(children, (item) => {
                if (!isValidElement<ItemProps>(item)) return null;
                const { value: itemValue, ...rest } = item.props;
                const isActive = !multiple ? value === itemValue : value.includes(itemValue);
                return cloneElement<ItemProps>(item, {
                    ...rest,
                    value: itemValue,
                    onChange: (newValue) => {
                        if (!multiple) onChange?.(!isActive ? newValue : null);
                        else onChange?.(!isActive ? [...value, newValue] : value.filter((v) => v !== newValue));
                    },
                    isActive,
                    activeClassName
                });
            })}
        </div>
    );
};

ItemsGroup.Item = Item;
export default ItemsGroup;
