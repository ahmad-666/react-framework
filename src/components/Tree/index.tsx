'use client';

import { useImperativeHandle, useMemo, useCallback, forwardRef, memo, type ReactNode, type ForwardedRef } from 'react';
import Icon from '@/components/Icon';
import Checkbox from '@/components/Checkbox';
import Collapse from '@/components/Collapse';

//* Tree Node ----------------------------------------
export type Node = {
    /**
     *  must is special format --> '1','1-1','1-2','1-1-1','1-1-2',...
     *
     *  '1-1-2' means ancestor node is '1' and parent node is '1-1' and '1-1-X' are siblings and '1-1-2-X' are children
     *
     * passing treeId from parent is optional because we manually generate it inside component
     */
    treeId?: string;
    /** checked state of node checkbox */
    checked?: boolean;
    /** indeterminate state of node checkbox */
    indeterminate?: boolean;
    /** open(collapse) state of node */
    open?: boolean;
    /** label of node */
    label: ReactNode;
    /** children nodes of node */
    children?: Node[];
    /** we can have any other optional keys too */
    [key: string]: unknown;
};
type TreeNodeProps = {
    nodes: Node[];
    indeterminate?: boolean;
    color?: string;
    onNodeSelection: (nodes: Node[], nodeId: string, checked: boolean) => void;
    onNodeCollapse: (nodes: Node[], nodeId: string, open: boolean) => void;
};
const TreeNode = ({
    nodes = [],
    indeterminate = false,
    color = 'primary',
    onNodeSelection,
    onNodeCollapse
}: TreeNodeProps) => {
    return (
        <div className='space-y-2'>
            {nodes.map((node) => (
                <div key={node.treeId}>
                    <div className='flex justify-between gap-4'>
                        <Checkbox
                            checked={node.checked}
                            indeterminate={indeterminate && node.indeterminate}
                            onChange={({ checked }) => onNodeSelection(nodes, node.treeId!, checked)}
                            color={color}
                            hideMessage
                        >
                            {node.label}
                        </Checkbox>
                        {!!node.children?.length && (
                            <button onClick={() => onNodeCollapse(nodes, node.treeId!, !node.open)}>
                                <Icon
                                    icon='mdi:chevron-down'
                                    size='md'
                                    color='slate-800'
                                    className={`transition-transform duration-300 ${node.open ? '-rotate-180' : ''}`}
                                />
                            </button>
                        )}
                    </div>
                    {node.children?.length && (
                        <Collapse open={node.open} duration={300} unmountOnClose className='mt-2'>
                            <div className='ps-4'>
                                {node.children?.length && (
                                    <TreeNode
                                        nodes={node.children}
                                        indeterminate={indeterminate}
                                        color={color}
                                        onNodeSelection={onNodeSelection}
                                        onNodeCollapse={onNodeCollapse}
                                    />
                                )}
                            </div>
                        </Collapse>
                    )}
                </div>
            ))}
        </div>
    );
};
const TreeNodeMemo = memo(TreeNode);
//* Tree ---------------------------------------------
export type Ref = {
    findNode: (nodes: Node[], cb: (node: Node) => boolean) => Promise<null | Node>;
    findParent: (nodes: Node[], nodeId: string) => Promise<null | Node>;
    findAncestors: (nodes: Node[], nodeId: string) => Promise<Node[]>;
    findChildren: (nodes: Node[], nodeId: string) => Promise<Node[]>;
    findDescendants: (nodes: Node[], nodeId: string) => Promise<Node[]>;
    findSiblings: (nodes: Node[], nodeId: string) => Promise<Node[]>;
    traverseTree: (nodes: Node[], cb: (node: Node) => undefined) => void;
    generateTreeIds: (nodes: Node[], parentId: string) => Node[];
};
type TreeProps = {
    data: Node[];
    indeterminate?: boolean;
    color?: string;
    onChange?: (newData: Node[]) => void;
    className?: string;
};
const Tree = (
    { data = [], indeterminate = false, color = 'primary', onChange, className = '' }: TreeProps,
    ref?: ForwardedRef<Ref>
) => {
    const generateTreeIds = useCallback((nodes: Node[], parentId: string): Node[] => {
        // recursive function to generate tree ids in '1','1-1','1-1-1','1-1-2',... format
        return nodes.map((node, i) => {
            const nodeId = parentId ? `${parentId}-${i + 1}` : `${i + 1}`;
            return {
                ...node,
                treeId: nodeId,
                ...(node.children?.length && { children: generateTreeIds(node.children, nodeId) })
            };
        });
    }, []);
    const dataWithTreeIds = useMemo(() => {
        return generateTreeIds(data, '');
    }, [data, generateTreeIds]);
    const findNode = useCallback((nodes: Node[], cb: (node: Node) => boolean): Promise<null | Node> => {
        // recursive function to go as deep as possible to find the node
        return new Promise(async (resolve) => {
            for (const node of nodes) {
                if (cb(node)) return resolve(node);
                else if (node.children?.length) {
                    const nestedNode = await findNode(node.children, cb);
                    if (nestedNode) resolve(nestedNode);
                }
            }
            resolve(null);
        });
    }, []);
    const traverseTree = useCallback((nodes: Node[], cb: (node: Node) => undefined) => {
        for (const node of nodes) {
            cb(node);
            if (node.children?.length) traverseTree(node.children, cb);
        }
    }, []);
    const findParent = useCallback(
        (nodes: Node[], nodeId: string): Promise<null | Node> => {
            // if we want parent of node with id of '1-2-3' it means we want '1-2' node
            return new Promise(async (resolve) => {
                const parentId = nodeId.split('-').slice(0, -1).join('-');
                const parent = await findNode(nodes, (node) => node.treeId === parentId);
                resolve(parent);
            });
        },
        [findNode]
    );
    const findAncestors = useCallback(
        (nodes: Node[], nodeId: string): Promise<Node[]> => {
            // if we want ancestors of node with id of '1-2-3' it means we want ['1','1-2'] nodes
            return new Promise(async (resolve) => {
                const ancestors: Node[] = [];
                const ancestorIds: string[] = [];
                const splittedId = nodeId.split('-');
                for (let i = 1; i < splittedId.length; i++) {
                    ancestorIds.push(splittedId.slice(0, i).join('-'));
                }
                for (const id of ancestorIds) {
                    const ancestor = await findNode(nodes, (node) => node.treeId === id);
                    if (ancestor) ancestors.push(ancestor);
                }
                resolve(ancestors);
            });
        },
        [findNode]
    );
    const findChildren = useCallback(
        (nodes: Node[], nodeId: string): Promise<Node[]> => {
            // find node with same id and return its children
            return new Promise(async (resolve) => {
                const node = await findNode(nodes, (node) => node.treeId === nodeId);
                resolve(node?.children || []);
            });
        },
        [findNode]
    );
    const findDescendants = useCallback(
        (nodes: Node[], nodeId: string): Promise<Node[]> => {
            // if we want descendants of node with id of '1-2-3' it means we want all nodes that their id starts with '1-2-3'
            return new Promise(async (resolve) => {
                const descendants: Node[] = [];
                const children = await findChildren(nodes, nodeId);
                for (const node of children) {
                    descendants.push(node);
                    if (node.children?.length) {
                        descendants.push(...(await findDescendants(node.children, node.treeId!)));
                    }
                }
                resolve(descendants);
            });
        },
        [findChildren]
    );
    const findSiblings = useCallback(
        (nodes: Node[], nodeId: string): Promise<Node[]> => {
            // if we want siblings of node with id of '1-2-3' it means we want all nodes that their parent is '1-2'
            return new Promise(async (resolve) => {
                const parentId = nodeId.split('-').slice(0, -1).join('-');
                const siblings = await findChildren(nodes, parentId);
                resolve(siblings.filter((node) => node.treeId !== nodeId));
            });
        },
        [findChildren]
    );
    const safeCloneNodes = useCallback((nodes: Node[]): Node[] => {
        // because 'label' on parent of 'label' in children can contain jsx and jsx cannot be clones via JSON.parse(JSON.stringify(node)) or structuredClone(node) then we should handle them separately
        return nodes.map(({ label, children, ...rest }) => ({
            ...structuredClone(rest),
            label,
            ...(children?.length && { children: safeCloneNodes(children) })
        }));
    }, []);
    const treeValidator = useCallback((nodes: Node[]): Node[] => {
        // if all children of node are checked then parent node itself should be checked too
        // if any of children are not checked then parent node itself should be unchecked too
        return nodes.map((node) => {
            if (node.children?.length) {
                const validatedChildren = treeValidator(node.children); //first we validate children of node then we check 'checked' state of validated children
                const allChecked = validatedChildren.every((node) => node.checked);
                const someChecked = validatedChildren.some((node) => node.checked);
                return {
                    ...node,
                    checked: allChecked,
                    indeterminate: !allChecked && someChecked,
                    children: validatedChildren
                };
            }
            return {
                ...node,
                indeterminate: false
            };
        });
    }, []);
    const onNodeSelection = useCallback(
        async (nodes: Node[], nodeId: string, checked: boolean) => {
            const nodesCopy = safeCloneNodes(nodes);
            // when we select node we want to select all of its descendants
            // when we deselect node we want to deselect all of its descendants
            const descendants = await findDescendants(nodesCopy, nodeId);
            for (const node of descendants) {
                node.checked = checked;
                node.indeterminate = false;
            }
            const validatedNodes = treeValidator(nodesCopy);
            onChange?.(validatedNodes);
        },
        [findDescendants, safeCloneNodes, treeValidator, onChange]
    );
    const onNodeCollapse = useCallback(
        async (nodes: Node[], nodeId: string, open: boolean) => {
            const nodesCopy = safeCloneNodes(nodes);
            const node = await findNode(nodesCopy, (node) => node.treeId === nodeId);
            if (node) node.open = open;
            onChange?.(nodesCopy);
        },
        [findNode, safeCloneNodes, onChange]
    );
    useImperativeHandle(ref, () => ({
        findNode,
        findParent,
        findAncestors,
        findChildren,
        findDescendants,
        findSiblings,
        traverseTree,
        generateTreeIds
    }));

    return (
        <div className={`${className}`}>
            <TreeNodeMemo
                nodes={dataWithTreeIds}
                indeterminate={indeterminate}
                color={color}
                onNodeSelection={onNodeSelection}
                onNodeCollapse={onNodeCollapse}
            />
        </div>
    );
};
export default forwardRef(Tree);

//? check all methods separately
