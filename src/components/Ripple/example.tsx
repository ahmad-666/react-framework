import Ripple from '.';
import useColor from '@/hooks/useColor';
import { alpha } from '@/utils/colors';

export default function RippleExample() {
    const parsedColor = useColor('primary');

    return (
        <div>
            <div className='mt-30'>
                <p className='text-title-lg'>#2: Ripple on div</p>
                <div className='text-title-md relative flex h-40 w-80 items-center justify-center rounded-md border border-slate-500'>
                    lorem ipsum
                    <Ripple color={alpha(parsedColor, 0.2)} duration={1000} />
                </div>
            </div>
        </div>
    );
}
