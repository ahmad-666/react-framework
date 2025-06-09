import { useState } from 'react';
import DateTimePicker, { type Calendar } from '.';
import dayjs from '@/libs/dayjs';
import useMediaQuery from '@/hooks/useMediaQuery';

export default function DateTimePickerExample() {
    const format1 = 'HH:mm';
    const [dates1, setDates1] = useState<string[]>([]);

    const format2 = 'YYYY-MM-DD';
    const [dates2, setDates2] = useState<string[]>([]);

    const format3 = 'YYYY-MM-DD HH:mm';
    const isMobile = useMediaQuery('(width < 750px)');
    const cols = isMobile ? 1 : 2;
    const size = isMobile ? 40 : 50;
    const offset = isMobile ? 0 : 120;
    const [dates3, setDates3] = useState<string[]>(['2025-04-12 10:45', '2025-06-14 05:45']);
    const [calendar, setCalendar] = useState<Calendar>('gregory');
    const [minMax, setMinMax] = useState({ min: '2025-04-10 10:15', max: '2025-06-25 05:45' });

    return (
        <div>
            <div>
                <h5 className='mb-8'>#1: time range example without min,max:</h5>
                <DateTimePicker
                    type='time'
                    mode='range'
                    value={dates1}
                    onChange={(newVal) => {
                        setDates1(newVal);
                    }}
                    showCalendarBtn={false}
                    format={format1}
                />
            </div>
            <div>
                <h5 className='mb-8'>#2: date single example with min,max and static gregory calendar:</h5>
                <DateTimePicker
                    type='date'
                    mode='single'
                    calendar='gregory'
                    showCalendarBtn={false}
                    value={dates2}
                    onChange={(newVal) => {
                        setDates2(newVal);
                    }}
                    format={format2}
                    min='2025-04-10'
                    max='2025-06-25'
                    cols={1}
                    size={50}
                />
            </div>
            <div className='mt-20'>
                <h5 className='mb-8'>
                    #3: date-time range example with min,max and update calendar prop with responsive sizing:
                </h5>
                <DateTimePicker
                    type='datetime'
                    mode='range'
                    value={dates3}
                    onChange={(newVal) => {
                        setDates3(newVal);
                    }}
                    format={format3}
                    min={minMax.min}
                    max={minMax.max}
                    calendar={calendar}
                    onCalendarChange={(newCalendar) => {
                        setCalendar(newCalendar);
                        setMinMax((old) => ({
                            min: dayjs(old.min, { jalali: calendar === 'jalali' })
                                .calendar(newCalendar)
                                .format(format3),
                            max: dayjs(old.max, { jalali: calendar === 'jalali' })
                                .calendar(newCalendar)
                                .format(format3)
                        }));
                    }}
                    cols={cols}
                    size={size}
                    style={{ width: cols * size * 7 + offset }}
                />
            </div>
        </div>
    );
}
