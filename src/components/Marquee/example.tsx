import Marquee from '.';

export default function MarqueeExample() {
    return (
        <div>
            <Marquee
                direction='horizontal'
                duplicationCount={3}
                items={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
                className='rounded border border-slate-400 p-8'
            >
                {(item) => <div className='text-title-lg border border-slate-400 p-6 text-center'>{item}</div>}
            </Marquee>
            <Marquee
                direction='vertical'
                duplicationCount={5}
                items={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
                maxHeight={500}
                className='mt-20 rounded border border-slate-400 p-8'
            >
                {(item) => <div className='text-title-lg border border-slate-400 p-6 text-center'>{item}</div>}
            </Marquee>
        </div>
    );
}
