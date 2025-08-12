import Skeleton from '.';

export default function SkeletonExample() {
    return (
        <div>
            <Skeleton variant='rounded' width='100%' height={200} animation='pulse' />
            <div className='mt-20 grid grid-cols-5 gap-5'>
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} variant='rectangular' color='slate-300' height={50} animation='wave' />
                ))}
            </div>
        </div>
    );
}
