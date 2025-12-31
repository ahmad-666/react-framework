import { useRef, useState } from 'react';
import Tree, { type TreeRef, type TreeNode } from './v2';
import TextField from '../Textfield';

export default function TreeExample() {
    const treeRef = useRef<TreeRef>(null!); //access to tree api ... have util methods like treeRef.current.findNode(),...
    // treeRef.current.overallSelections
    const tree: TreeNode[] = [
        {
            id: 1,
            treeId: '1',
            label: 'Parent 1',
            children: [
                {
                    id: 2,
                    treeId: '1-1',
                    label: 'Child 1-1',
                    children: [
                        {
                            id: 3,
                            treeId: '1-1-1',
                            label: 'Child 1-1-1'
                        },
                        {
                            id: 4,
                            treeId: '1-1-2',
                            label: 'Child 1-1-2'
                        },
                        {
                            id: 5,
                            treeId: '1-1-3',
                            label: 'Child 1-1-3'
                        }
                    ]
                },
                {
                    id: 6,
                    treeId: '1-2',
                    label: 'Child 1-2',
                    children: [{ id: 7, treeId: '1-2-1', label: 'Child 1-2-1' }]
                }
            ]
        },
        {
            id: 8,
            treeId: '2',
            label: <>🌋 Parent 2</>,
            children: [{ id: 9, treeId: '2-1', label: 'Child 2-1' }]
        }
    ];
    const [selections, setSelections] = useState<string[]>(['1-1', '1-2-1', '2']);
    const [opens, setOpens] = useState<string[]>([]);
    const [search, setSearch] = useState<string>('');

    return (
        <div>
            <TextField
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search ...'
                className='mb-6 w-52'
            />
            <Tree
                ref={treeRef}
                data={tree}
                selections={selections}
                opens={opens}
                onSelectionsChange={(newVal) => setSelections(newVal)}
                onOpensChange={(newVal) => setOpens(newVal)}
                search={search}
                indeterminate
                openMultiple
                collapseAnimation
            />
        </div>
    );
}
