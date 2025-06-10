import { useState, useRef } from 'react';

type Args = {
    /** start time in seconds e.g 100 means count down from 100s to 0s */
    init: number;
};

const useTimer = ({ init }: Args) => {
    const timerRef = useRef<null | NodeJS.Timeout>(null);
    const [countDown, setCountDown] = useState(init);
    const [isRunning, setIsRunning] = useState(false);
    const stop = () => {
        setIsRunning(false);
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };
    const start = () => {
        if (isRunning) return null;
        stop(); //for prevent multiple timer running at same time
        setIsRunning(true);
        timerRef.current = setInterval(() => {
            setCountDown((old) => {
                const newVal = old - 1;
                if (newVal <= 0) {
                    stop();
                    return 0;
                } else return newVal;
            });
        }, 1000);
    };
    const reset = () => {
        setIsRunning(false);
        setCountDown(init);
        stop();
    };

    return {
        isRunning,
        countDown,
        start,
        stop,
        reset
    };
};

export default useTimer;
