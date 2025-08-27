'use client';

import { useState, useEffect, type ReactNode, type CSSProperties } from 'react';
import styles from './styles.module.css';

type Animation = 'fade' | 'slide-ltr' | 'slide-rtl';
type Easing = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
type Props = {
    /** if true first we render children and then start 'in' animation , if false first play 'out' animation and then remove children from DOM  */
    show: boolean;
    /** set one of predefined animations */
    animation?: Animation;
    /** animation duration in milliseconds */
    duration?: number;
    /** easing of animation */
    easing?: Easing;
    children: ReactNode;
    className?: string;
};

export default function Animation({
    show = false,
    animation = 'fade',
    duration = 1_000,
    easing = 'linear',
    children,
    className = ''
}: Props) {
    const [render, setRender] = useState(show);
    const getAnimationClass = () => {
        if (animation === 'fade') return show ? 'fade-in' : 'fade-out';
        else if (animation === 'slide-ltr') return show ? 'slide-in-ltr' : 'slide-out-ltr';
        else if (animation === 'slide-rtl') return show ? 'slide-in-rtl' : 'slide-out-rtl';
        return '';
    };
    useEffect(() => {
        if (show) setRender(true);
    }, [show]);
    const onAnimationEnd = () => {
        if (!show) setRender(false);
    };

    return (
        <div className={`${className}`}>
            {render ? (
                <div
                    onAnimationEnd={onAnimationEnd}
                    className={`${styles[getAnimationClass()]}`}
                    style={
                        {
                            '--duration': `${duration}ms`,
                            '--easing': easing
                        } as CSSProperties
                    }
                >
                    {children}
                </div>
            ) : null}
        </div>
    );
}

//? Basic Flow:
//* if 'show' prop set to true -->  first we render children and then start 'in' animation
//* if 'show' prop set to false-->  first play 'out' animation and then remove children from DOM

//? Tip: sometimes for simpler use-cases we can apply 'in' animation with normal css class like 'animate-fade-in' and use dynamic 'key' prop that changes base on user interaction and now each time we change 'key' prop then react re-render that component and we see animation effect.
