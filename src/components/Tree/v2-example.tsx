import { useRef, useState } from 'react';
import Tree, { type TreeRef, type TreeNode } from './v2';

export default function TreeExample() {
    const treeRef = useRef<TreeRef>(null!); //access to tree api ... have util methods like treeRef.current.findNode(),...
    const tree: TreeNode[] = [
        {
            id: 1,
            treeId: '1',
            label: 'Parent 1',
            children: [
                { id: 2, treeId: '1-1', label: 'Child 1-1' },
                {
                    id: 3,
                    treeId: '1-2',
                    label: 'Child 1-2',
                    children: [{ id: 4, treeId: '1-2-1', label: 'Child 1-2-1' }]
                }
            ]
        },
        {
            id: 5,
            treeId: '2',
            label: <>🌋 Parent 2</>,
            children: [{ id: 6, treeId: '2-1', label: 'Child 2-1' }]
        }
    ];
    const [selections, setSelections] = useState<string[]>(['1-1', '1-2-1', '2']);
    const [opens, setOpens] = useState<string[]>([]);
    // treeRef.current.overallSelections

    return (
        <div>
            <Tree
                ref={treeRef}
                data={tree}
                selections={selections}
                opens={opens}
                onSelectionsChange={(newVal) => setSelections(newVal)}
                onOpensChange={(newVal) => setOpens(newVal)}
            />
        </div>
    );
}
