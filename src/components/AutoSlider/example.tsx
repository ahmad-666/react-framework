import AutoSlider from '.';

type Slide = {
    id: number;
    name: string;
    desc: string;
};

export default function AutoSliderExample() {
    const slidesCount = 10;
    const slides: Slide[] = Array.from({ length: slidesCount }, (_, i) => ({
        id: i,
        name: `slide ${i}`,
        desc: `desc ${i}`
    }));

    return (
        <div>
            <AutoSlider
                slides={slides}
                cloneCounts={2}
                duration={30_000}
                spacing={20}
                pauseOnHover={false}
                reverse={false}
            >
                {({ name, desc }) => (
                    <div className='flex w-40 flex-col items-center gap-8 rounded-md border border-slate-300 p-4'>
                        <p className='text-title-lg text-sky-700'>{name}</p>
                        <p className='text-body-md text-slate-700'>{desc}</p>
                    </div>
                )}
            </AutoSlider>
        </div>
    );
}
