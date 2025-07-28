import Draggable from '.';

export default function DraggableExample() {
    return (
        <div>
            <Draggable
                free={false}
                speed={1.5}
                transitionDuration={500}
                wrapperClassName='!gap-10'
                className='border border-orange-500 p-10'
            >
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className='h-20 w-50 bg-red-500'>
                        {i}
                    </div>
                ))}
            </Draggable>
        </div>
    );
}
