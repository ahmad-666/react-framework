import AutoSlider from '.';

type Slide = {
    id: number;
    name: string;
    desc: string;
};

export default function AutoSliderExample() {
    const slidesCount = 5;
    const slides: Slide[] = Array.from({ length: slidesCount }, (_, i) => ({
        id: i,
        name: `slide ${i}`,
        desc: Math.random() > 0.5 ? `desc ${i}` : `desc desc desc desc desc desc desc ${i}`
    }));

    return (
        <div>
            <AutoSlider
                playing
                slides={slides}
                cloneCounts={2}
                duration={3_000}
                spacing={30}
                pauseOnHover
                reverse={false}
            >
                {({ name, desc }) => (
                    <div className='flex w-auto flex-col items-center gap-8 rounded-md border-4 border-slate-300 p-8'>
                        <p className='text-title-lg text-sky-700'>{name}</p>
                        <p className='text-body-md text-slate-700'>{desc}</p>
                    </div>
                )}
            </AutoSlider>
        </div>
    );
}
