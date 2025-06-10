import useMediaQuery from '@/hooks/useMediaQuery';

type Breakpoints = {
    mobile?: number;
    tablet?: number;
    laptop?: number;
    desktop?: number;
};

const defaultBreakpoints: Breakpoints = {
    mobile: 500,
    tablet: 800,
    laptop: 1100,
    desktop: 1400
};

const useBreakpoint = ({
    mobile = 500,
    tablet = 800,
    laptop = 1100,
    desktop = 1400
}: Breakpoints = defaultBreakpoints) => {
    //* [0,500] --> mobile , [500,800] --> tablet , [800,1100] --> laptop , [1100,...] --> desktop
    //? mobileOnly means --> we are on mobile breakpoint not on tablet,laptop,desktop
    //? mobileAndLower means viewport is smaller that mobile breakpoint
    //? mobileAndHigher means viewport is bigger that mobile breakpoint

    const mobileOnly = useMediaQuery(`(0 < width <= ${mobile}px)`);
    const mobileAndLower = useMediaQuery(`(width <= ${mobile}px)`);
    const mobileAndHigher = useMediaQuery(`(width > ${mobile}px)`);
    const tabletOnly = useMediaQuery(`(${mobile}px < width <= ${tablet}px)`);
    const tabletAndLower = useMediaQuery(`(width <= ${tablet}px)`);
    const tabletAndHigher = useMediaQuery(`(width > ${tablet}px)`);
    const laptopOnly = useMediaQuery(`(${tablet}px < width <= ${laptop}px)`);
    const laptopAndLower = useMediaQuery(`(width <= ${laptop}px)`);
    const laptopAndHigher = useMediaQuery(`(width > ${laptop}px)`);
    const desktopOnly = useMediaQuery(`(width > ${desktop}px)`);
    const desktopAndLower = useMediaQuery(`(width <= ${desktop}px)`);
    const desktopAndHigher = useMediaQuery(`(width > ${desktop}px)`);

    return {
        mobileOnly,
        mobileAndLower,
        mobileAndHigher,
        tabletOnly,
        tabletAndLower,
        tabletAndHigher,
        laptopOnly,
        laptopAndLower,
        laptopAndHigher,
        desktopOnly,
        desktopAndLower,
        desktopAndHigher
    };
};

export default useBreakpoint;
