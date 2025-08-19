import { useRef, useState, useEffect, useCallback, type ReactNode, type CSSProperties } from 'react';

type Props = {
    open?: boolean;
    /** transition duration in milliseconds */
    duration?: number;
    /** totally unmount content from DOM when closed */
    unmountOnClose?: boolean;
    children: ReactNode;
    className?: string;
};

export default function Collapse({
    open = false,
    duration = 300,
    unmountOnClose = false,
    children,
    className = ''
}: Props) {
    const container = useRef<HTMLDivElement>(null!);
    const [render, setRender] = useState(unmountOnClose ? open : true);
    const calcHeight = useCallback(() => {
        setTimeout(
            () => {
                const elm = container.current;
                if (elm) elm.style.gridTemplateRows = open ? '1fr' : '0fr';
            },
            unmountOnClose ? 50 : 0
        );
    }, [open, unmountOnClose]);
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (unmountOnClose && !open) {
            timer = setTimeout(() => setRender(false), duration);
        } else setRender(true);
        calcHeight();
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [open, duration, unmountOnClose, calcHeight]);
    // useEffect(() => {
    //     const elm = container.current;
    //     if (elm) {
    //         const ro = new ResizeObserver(() => calcHeight());
    //         const mo = new MutationObserver(() => calcHeight());
    //         ro.observe(elm);
    //         mo.observe(elm, { childList: true, subtree: true, characterData: true });
    //         return () => {
    //             ro.disconnect();
    //             mo.disconnect();
    //         };
    //     }
    // }, [calcHeight]);

    if (!render) return null;
    return (
        <div
            aria-expanded={open}
            ref={(node) => {
                //use callback for 'ref' because we use conditional rendering for this jsx
                if (node) container.current = node;
            }}
            className={`grid grid-rows-[0fr] transition-[grid-template-rows] duration-(--duration) ${className}`}
            style={
                {
                    '--duration': `${duration}ms`
                } as CSSProperties
            }
        >
            <div className='overflow-hidden'>{children}</div>
        </div>
    );
}

//? we could use 'scrollHeight' approach too
