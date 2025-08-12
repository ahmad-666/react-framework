import LinearLoader from '.';

export default function LinearLoaderExample() {
    return (
        <div>
            <div className='relative h-100 overflow-hidden border-2 border-slate-600'>
                <div className='absolute top-0 left-0 w-full'>
                    <LinearLoader size={4} color='purple-400' />
                </div>
            </div>
        </div>
    );
}
