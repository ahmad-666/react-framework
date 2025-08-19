import { useMemo, useCallback, useImperativeHandle, forwardRef, type ReactNode, type ForwardedRef } from 'react';
import Collapse from '@/components/Collapse';
import Checkbox from '@/components/Checkbox';
import Icon from '@/components/Icon';

//* id,treeId should be unique in whole tree means even in different depth we should not have duplicated ids,treeIds
export type TreeNode = {
    /** our own id ... can be anything */
    id: number | string;
    /** specific tree id ... should be in format of '1','1-1','1-1-1','1-1-2',...,'2','2-1','2-2',... */
    treeId: string;
    label: ReactNode;
    children?: TreeNode[];
    [key: string]: unknown;
};
export type TreeRef = {
    /** contain treeId of every selected tree node */
    overallSelections: string[];
    /** utility method to find specific tree node */
    findNode: (tree: TreeNode[], cb: (node: TreeNode) => boolean) => null | TreeNode;
    /** utility method to find all descendants of a specific tree node */
    findAllDescendants: (node: null | TreeNode) => TreeNode[];
};
type Props = {
    data: TreeNode[];
    /** store treeId of parent if all of its children are selected and store treeId of selected children if parent is not selected
     *
     * we can use 'overallSelections' for get id of every single selected node
     */
    selections: string[];
    onSelectionsChange?: (val: string[]) => void;
    /** id of those nodes that should be collapse
     *
     *  we must use separate state for opens and not use selections state because something can be checked while being closed.
     */
    opens: string[];
    onOpensChange?: (val: string[]) => void;
    className?: string;
};

const Tree = (
    { data = [], selections = [], opens = [], onSelectionsChange, onOpensChange, className = '' }: Props,
    ref: ForwardedRef<TreeRef>
) => {
    const findNode = useCallback((tree: TreeNode[], cb: (node: TreeNode) => boolean): null | TreeNode => {
        for (const node of tree) {
            if (cb(node)) return node;
            if (node.children) {
                const found = findNode(node.children, cb);
                if (found) return found;
            }
        }
        return null; // not found
    }, []);
    const findAllDescendants = useCallback((node: null | TreeNode): TreeNode[] => {
        if (!node || !node.children) return [];
        let descendants: TreeNode[] = [];
        for (const child of node.children) {
            descendants.push(child);
            descendants = descendants.concat(findAllDescendants(child));
        }
        return descendants;
    }, []);
    const overallSelections = useMemo(() => {
        // for get ids of every single selected tree nodes
        const result: Set<string> = new Set();
        for (const selection of selections) {
            result.add(selection);
            const node = findNode(data, (node) => node.treeId === selection);
            const descendants = findAllDescendants(node);
            for (const descendant of descendants) {
                result.add(descendant.treeId);
            }
        }
        return result;
    }, [data, selections, findNode, findAllDescendants]);
    const selectNodeAndChildren = (node: TreeNode, newSelections: Set<string>) => {
        //select parent and all of its children if parent is being selected
        newSelections.add(node.treeId);
        node.children?.forEach((child) => selectNodeAndChildren(child, newSelections));
    };
    const unselectNodeAndChildren = (node: TreeNode, newSelections: Set<string>) => {
        //deselect parent and all of its children if parent is being deselected
        newSelections.delete(node.treeId);
        node.children?.forEach((child) => unselectNodeAndChildren(child, newSelections));
    };
    const updateParentNodes = useCallback(
        (nodes: TreeNode[], newSelections: Set<string>, newOverallSelections: Set<string>) => {
            //select parent if all of its children are selected and deselect parent if some of its children are not selected
            nodes.forEach((node) => {
                if (node.children?.length) {
                    node.children.forEach((child) => updateParentNodes([child], newSelections, newOverallSelections));
                    const childIds = node.children.map((child) => child.treeId);
                    const allChildrenChecked = childIds.every((childId) => newOverallSelections.has(childId));
                    if (allChildrenChecked) {
                        // if all children of parent are selected --> remove all children from selections and only store parent id inside selections
                        childIds.forEach((childId) => newSelections.delete(childId));
                        newSelections.add(node.treeId);
                        newOverallSelections.add(node.treeId); // ensure parent stays checked
                    } else {
                        // if not all children are selected --> remove parent from overallSelections and selections and store id of selected children inside selections
                        newSelections.delete(node.treeId);
                        newOverallSelections.delete(node.treeId);
                        node.children.forEach((child) => {
                            if (newOverallSelections.has(child.treeId)) {
                                newSelections.add(child.treeId);
                            }
                        });
                    }
                }
            });
        },
        []
    );
    const updateOpens = (node: TreeNode) => {
        const isOpen = opens.includes(node.treeId);
        onOpensChange?.(isOpen ? opens.filter((o) => o !== node.treeId) : [...opens, node.treeId]);
    };
    const onCheckboxChange = (node: TreeNode, isChecked: boolean) => {
        const updatedSelections = new Set<string>();
        const updatedOverallSelections = new Set(overallSelections);
        if (isChecked) selectNodeAndChildren(node, updatedOverallSelections);
        else unselectNodeAndChildren(node, updatedOverallSelections);
        updateParentNodes(data, updatedSelections, updatedOverallSelections);
        onSelectionsChange?.(Array.from(updatedSelections));
    };
    useImperativeHandle(ref, () => ({
        overallSelections: Array.from(overallSelections),
        findNode,
        findAllDescendants
    }));

    const renderTree = (nodes: TreeNode[]) => {
        return (
            <div className='space-y-3'>
                {nodes.map((node) => {
                    const hasChildren = !!node.children?.length;
                    const isChecked = overallSelections.has(node.treeId);
                    const isOpen = opens.includes(node.treeId);
                    return (
                        <div key={node.treeId}>
                            <div className='flex items-center justify-between gap-4'>
                                <Checkbox
                                    checked={isChecked}
                                    value={node.treeId}
                                    onChange={({ checked }) => onCheckboxChange(node, checked)}
                                    hideMessage
                                >
                                    <p className='text-body-md text-slate-700'>{node.label}</p>
                                </Checkbox>
                                {hasChildren && (
                                    <button onClick={() => updateOpens(node)}>
                                        <Icon icon={isOpen ? 'mdi:minus' : 'mdi:plus'} size='md' color='newNeutral' />
                                    </button>
                                )}
                            </div>
                            {hasChildren && (
                                <Collapse open={isOpen} unmountOnClose className='mt-2 pl-6'>
                                    {renderTree(node.children!)}
                                </Collapse>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return <div className={`${className}`}>{renderTree(data)}</div>;
};

export default forwardRef(Tree);
