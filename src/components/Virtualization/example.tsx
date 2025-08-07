import Virtualization from '.';

export default function VirtualizationExample() {
    return (
        <div>
            <Virtualization
                direction='vertical'
                containerSize={400}
                itemSize={70} //use bigger itemSize while actual item size content take less space for having space between items
                buffer={3}
                items={Array.from({ length: 1000 }, (_, i) => i)}
                className='border border-slate-400 p-3'
            >
                {(item) => (
                    <div className='text-title-lg text-primary h-[60px] w-full rounded-sm border border-slate-400 p-5 text-center'>
                        {item}
                    </div>
                )}
            </Virtualization>
            <Virtualization
                direction='horizontal'
                containerSize={800}
                itemSize={80} //use bigger itemSize while actual item size content take less space for having space between items
                buffer={3}
                items={Array.from({ length: 1000 }, (_, i) => i)}
                className='mx-auto mt-30 h-30 border border-slate-400 p-3'
            >
                {(item) => (
                    <div className='text-title-lg text-primary w-[70px] rounded-sm border border-slate-400 p-5 text-center'>
                        {item}
                    </div>
                )}
            </Virtualization>
        </div>
    );
}
