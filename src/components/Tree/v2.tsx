import {
    useRef,
    useState,
    useEffect,
    useMemo,
    useCallback,
    useImperativeHandle,
    forwardRef,
    type ReactNode,
    type ForwardedRef
} from 'react';
import Collapse from '@/components/Collapse';
import Checkbox from '@/components/Checkbox';
import Icon from '@/components/Icon';

//* id,treeId should be unique in whole tree means even in different depth we should not have duplicated ids,treeIds
export type TreeNode = {
    /** our own id ... can be anything */
    id: number | string;
    /**
     * specific tree id ... should be in format of '1','1-1','1-1-1','1-1-2',...,'2','2-1','2-2',...
     *
     * id,treeId should be unique in whole tree means even in different depth we should not have duplicated ids,treeIds
     *
     */
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
    /** utility method to open checked nodes */
    openSelectedNodes: () => void;
};
type Props = {
    data: TreeNode[];
    /**
     * array of treeIds
     *
     *  only store treeId of parent if all of its children are select and store treeId of selected children if parent is not selected
     *
     *  we have 'overallSelections' too for get id of every single selected node
     * */
    selections: string[];
    onSelectionsChange?: (val: string[]) => void;
    /** array of treeIds , id of those nodes that should be collapse
     *
     *  we must use separate state for opens and not use selections state because something can be checked while being closed.
     */
    opens?: string[];
    onOpensChange?: (val: string[]) => void;
    /**
     * for filter tree nodes at any depth
     *
     * for better performance we should debounced this 'search' value from parent
     * */
    search?: string;
    /** allow indeterminate state on parent(s) checkboxes */
    indeterminate?: boolean;
    /** if true we can open multiple nodes at same depth at once and if false we can only open one node at same depth */
    openMultiple?: boolean;
    /** disable collapse animation */
    collapseAnimation?: boolean;
    className?: string;
};

const Tree = (
    {
        data = [],
        selections = [],
        onSelectionsChange,
        opens = [],
        onOpensChange,
        search,
        indeterminate = true,
        openMultiple = true,
        collapseAnimation = true,
        className = ''
    }: Props,
    ref: ForwardedRef<TreeRef>
) => {
    const container = useRef<HTMLDivElement>(null!);
    const [opensLocal, setOpensLocal] = useState<string[]>(opens || []); //treeIds of open nodes
    //? Util Tree Methods ----------------------------------------
    //! in findNode we get 'tree:TreeNode[]' as first arg so we have full control that we want to find node of what tree e.g full tree or filtered tree or ...
    //! if we want proper util methods --> 'node' arg should always be fetched from full tree not from filtered tree
    const findNode = useCallback((tree: TreeNode[], cb: (node: TreeNode) => boolean): null | TreeNode => {
        for (const node of tree) {
            if (cb(node)) return node; // found the node
            if (node.children) {
                const found = findNode(node.children, cb);
                if (found) return found; // found in deeper levels
            }
        }
        return null; // not found
    }, []);
    const findAllDescendants = useCallback((node: null | TreeNode): TreeNode[] => {
        if (!node || !node.children) return []; // no children, return empty array
        let descendants: TreeNode[] = [];
        for (const child of node.children) {
            descendants.push(child); // add child to descendants list
            descendants = descendants.concat(findAllDescendants(child)); // recursively get deeper descendants
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
    const onCheckboxChange = (node: TreeNode, isChecked: boolean) => {
        const updatedSelections = new Set<string>();
        const updatedOverallSelections = new Set(overallSelections);
        if (isChecked) selectNodeAndChildren(node, updatedOverallSelections);
        else unselectNodeAndChildren(node, updatedOverallSelections);
        updateParentNodes(data, updatedSelections, updatedOverallSelections);
        onSelectionsChange?.(Array.from(updatedSelections));
    };
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
    const setOpenNodes = (newOpens: string[]) => {
        // base on openMultiple and ... return finalize opens
        if (openMultiple) {
            setOpensLocal(newOpens);
            onOpensChange?.(newOpens);
        } else {
            const filteredNewOpens: string[] = [];
            newOpens.forEach((open, i, totalOpens) => {
                const depth = open.split('-').length;
                const j = totalOpens.findLastIndex((a1) => a1.split('-').length === depth);
                if (i === j) filteredNewOpens.push(open);
            });
            const uniqueOpens = Array.from(new Set(filteredNewOpens));
            setOpensLocal(uniqueOpens);
            onOpensChange?.(uniqueOpens);
        }
    };
    const onToggleOpenClick = (node: TreeNode) => {
        const shouldOpen = !opensLocal.includes(node.treeId); //if currently its not open then it should open
        const newOpens = shouldOpen ? [...opensLocal, node.treeId] : opensLocal.filter((o) => o !== node.treeId);
        setOpenNodes(newOpens);
        if (shouldOpen && !openMultiple) {
            //scroll into latest opened node
            const treeNodeElm = container.current.querySelector(`[data-treeid="${node.treeId}"]`);
            if (treeNodeElm) {
                // wait for changes + should use display:'start',inline:'nearest' to make sure we go to start of element
                setTimeout(() => {
                    treeNodeElm.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
                }, 150);
            }
        }
    };
    const openSelectedNodes = () => {
        // for manually open all selected nodes , if child is selected then all of its parents will be open too
        const newOpens: string[] = [];
        selections.forEach((treeId) => {
            const node = findNode(data, (n) => n.treeId === treeId);
            if (node) {
                const treeIdSplit = node.treeId.split('-');
                treeIdSplit.forEach((_, i) => {
                    const parentTreeId = treeIdSplit.slice(0, i).join('-');
                    const parentNode = findNode(data, (n) => n.treeId === parentTreeId);
                    if (parentNode) newOpens.push(parentNode.treeId);
                });
            }
        });
        setOpenNodes(newOpens);
    };
    //? Filter Methods ----------------------------------------
    const filterNodes = useCallback((searchInput: string, nodes: TreeNode[]) => {
        const term = searchInput.toLowerCase();
        const result = nodes
            .map((node) => {
                const selfMatch = node.label?.toString().toLowerCase().includes(term);
                const filteredChildren = node.children ? filterNodes(searchInput, node.children) : [];
                if (selfMatch || filteredChildren.length > 0) {
                    return {
                        ...node,
                        ...(filteredChildren.length && { children: filteredChildren })
                    };
                }
                return null;
            })
            .filter(Boolean) as TreeNode[];
        return result;
    }, []);
    const filteredNodes = useMemo(() => {
        if (!search) return data;
        return filterNodes(search, data);
    }, [search, data, filterNodes]);
    //? useEffect ----------------------------------------
    useEffect(() => {
        setOpensLocal(opens);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(opens)]);
    //? Ref ----------------------------------------
    useImperativeHandle(ref, () => ({
        overallSelections: Array.from(overallSelections),
        findNode,
        findAllDescendants,
        openSelectedNodes
    }));

    const renderTree = (nodes: TreeNode[], level: number = 1) => {
        return (
            <div className={`level-${level} space-y-3`}>
                {nodes.map((node) => {
                    //! for search mode --> check,indeterminate,onChange should be calculated from full tree not filtered one so in search mode we initiate 'targetNode' with result of findNode on full tree
                    //! for rendering children we should use filtered version --> 'node'
                    const targetNode = !search ? node : findNode(data, (n) => n.treeId === node.treeId)!;
                    const hasChildren = !!targetNode.children?.length;
                    const isChecked = overallSelections.has(targetNode.treeId);
                    const isIndeterminate =
                        indeterminate &&
                        !isChecked &&
                        targetNode.children?.some((child) => overallSelections.has(child.treeId)) &&
                        !targetNode.children?.every((child) => overallSelections.has(child.treeId));
                    const isOpen = opensLocal.includes(targetNode.treeId);
                    const depth = targetNode.treeId.split('-').length;
                    return (
                        <div
                            key={node.treeId}
                            data-treeid={targetNode.treeId}
                            data-depth={`${depth}`}
                            data-open={`${isOpen}`}
                            data-checked={`${isChecked}`}
                            data-indeterminate={`${isIndeterminate}`}
                        >
                            <div className='flex items-center justify-between gap-4'>
                                <Checkbox
                                    checked={isChecked}
                                    value={targetNode.treeId}
                                    onChange={({ checked }) => onCheckboxChange(targetNode, checked)}
                                    indeterminate={isIndeterminate}
                                    hideMessage
                                >
                                    <p className='text-body-md text-slate-700'>{targetNode.label}</p>
                                </Checkbox>
                                {hasChildren && (
                                    <button onClick={() => onToggleOpenClick(targetNode)}>
                                        <Icon icon={isOpen ? 'mdi:minus' : 'mdi:plus'} size='md' color='newNeutral' />
                                    </button>
                                )}
                            </div>
                            {hasChildren && (
                                <div className='mt-2 pl-6'>
                                    {!collapseAnimation && isOpen && renderTree(node.children!, level + 1)}
                                    {collapseAnimation && (
                                        // use unmountOnExit props for better performance in large trees
                                        // we use 'node' here not 'targetNode' for working with filtered node in search mode
                                        <Collapse open={isOpen} unmountOnClose>
                                            {renderTree(node.children!, level + 1)}
                                        </Collapse>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div ref={container} className={`${className}`}>
            {renderTree(filteredNodes, 1)}
        </div>
    );
};

export default forwardRef(Tree);
