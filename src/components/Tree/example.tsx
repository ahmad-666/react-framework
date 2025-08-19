import { useRef, useState } from 'react';
import Tree, { type Ref, type Node } from './index';

export default function TreeExample() {
    const treeRef = useRef<Ref>(null!);
    const [techs, setTechs] = useState<Node[]>([
        {
            id: 'react',
            label: 'react',
            children: [
                {
                    id: 'next',
                    label: <>Next.js 🍲</>
                }
            ]
        },
        {
            id: 'vue',
            label: 'Vue',
            children: [{ id: 'nuxt', label: <>Nuxt.js 🍟</> }]
        }
    ]);
    //? because of tree structure we store whole tree data and checked,opened,... in 1 single state

    return (
        <div>
            <Tree
                ref={treeRef}
                data={techs}
                onChange={(newData) => setTechs(newData)}
                color='orange-500'
                indeterminate
            />
        </div>
    );
}

//? Test if we set checked,opened in initial state if it will work correctly ?
