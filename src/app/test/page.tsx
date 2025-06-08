'use client';

import { useState, useRef, useEffect } from 'react';
import Container from '@/components/Container';
import dayjs from '@/libs/dayjs';
import DateTimePicker, { DateTimePickerProps, Calendar } from '@/components/DateTimePicker';
import useMediaQuery from '@/hooks/useMediaQuery';

const TestPage = () => {
    const format = 'YYYY-MM-DD HH:mm';
    const isMobile = useMediaQuery('(width < 750px)');
    const cols = isMobile ? 1 : 2;
    const size = isMobile ? 40 : 50;
    const offset = isMobile ? 0 : 120;
    const [dates, setDates] = useState<string[]>(['2025-04-12 10:45', '2025-06-14 05:45']);
    const [calendar, setCalendar] = useState<Calendar>('gregory');
    const [minMax, setMinMax] = useState({ min: '2025-04-10 10:15', max: '2025-06-25 05:45' });

    return (
        <div>
            <Container className='m-20 !overflow-visible'>
                <DateTimePicker
                    type='datetime'
                    mode='range'
                    value={dates}
                    onChange={(newVal) => {
                        setDates(newVal);
                    }}
                    format={format}
                    min={minMax.min}
                    max={minMax.max}
                    calendar={calendar}
                    onCalendarChange={(newCalendar) => {
                        setCalendar(newCalendar);
                        setMinMax((old) => ({
                            min: dayjs(old.min, { jalali: calendar === 'jalali' })
                                .calendar(newCalendar)
                                .format(format),
                            max: dayjs(old.max, { jalali: calendar === 'jalali' })
                                .calendar(newCalendar)
                                .format(format)
                        }));
                    }}
                    cols={cols}
                    size={size}
                    style={{ width: cols * size * 7 + offset }}
                />
            </Container>
        </div>
    );
};

export default TestPage;
