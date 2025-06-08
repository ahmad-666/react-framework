'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { type Dayjs } from 'dayjs';
import dayjs from '@/libs/dayjs';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import YearPicker from './YearPicker';
import MonthPicker from './MonthPicker';
import useColor from '@/hooks/useColor';
import DEFAULT_COLORS from './colors';
import type { CalendarMonth as Month, CalendarDay as Day, DatePickerProps } from './types';

type Step = 'calendar' | 'year-picker' | 'month-picker';

export default function DatePicker({
    mode = 'single',
    calendar = 'gregory',
    format = 'YYYY-MM-DD',
    cols = 1,
    value = [],
    onChange,
    startDate = dayjs(),
    onStartDateChange,
    min,
    max,
    colors = DEFAULT_COLORS,
    size = 50,
    dayRender,
    classNames = {
        day: '',
        selected: '',
        inRange: '',
        hover: '',
        today: '',
        disabled: ''
    },
    className = '',
    style
}: DatePickerProps) {
    const [step, setStep] = useState<Step>('calendar');
    const [hoverDate, setHoverDate] = useState<null | Dayjs>(null);
    const [months, setMonths] = useState<Month[]>([]);
    const parsedColor = useColor(colors.primary || DEFAULT_COLORS.primary);
    const parsedInRangeColor = useColor(colors.inRange || DEFAULT_COLORS.inRange);
    const parsedHoverColor = useColor(colors.hover || DEFAULT_COLORS.hover);
    const parsedTodayColor = useColor(colors.today || DEFAULT_COLORS.today);
    const parsedTextColor = useColor(colors.text || DEFAULT_COLORS.text);
    const isJalali = calendar === 'jalali';
    const locale = calendar === 'gregory' ? 'en' : 'fa';
    const dir = calendar === 'gregory' ? 'ltr' : 'rtl';
    const weekdays =
        calendar === 'gregory' ? ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] : ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
    const dates = useMemo(() => {
        return {
            todayDate: dayjs(undefined, { jalali: isJalali }).calendar(calendar),
            minDate: min && dayjs(min, { jalali: isJalali }).calendar(calendar),
            maxDate: max && dayjs(max, { jalali: isJalali }).calendar(calendar),
            valStartDate: value[0] && dayjs(value[0], { jalali: isJalali }).calendar(calendar),
            valEndDate:
                value[mode === 'range' ? 1 : 0] &&
                dayjs(value[mode === 'range' ? 1 : 0], { jalali: isJalali }).calendar(calendar)
        };
    }, [mode, value, min, max, isJalali, calendar]);
    const minMax = useMemo(() => {
        const { minDate, maxDate } = dates;
        const startDYear = +startDate.format('YYYY');
        const minYear = minDate ? +minDate.format('YYYY') : undefined;
        const maxYear = maxDate ? +maxDate.format('YYYY') : undefined;
        const minMonth = minDate && minYear === startDYear ? +minDate.format('M') : undefined;
        const maxMonth = maxDate && maxYear === startDYear ? +maxDate.format('M') : undefined;
        return {
            minYear,
            maxYear,
            minMonth,
            maxMonth
        };
    }, [dates, startDate]);
    const onPrevMonth = () => {
        onStartDateChange((old) => old.subtract(1, 'month'));
    };
    const onNextMonth = () => {
        onStartDateChange((old) => old.add(1, 'month'));
    };
    const onDayClick = ({ d, date }: Day) => {
        if (mode === 'single') {
            onChange?.([date]); //select new date as value
        } else {
            if (value.length === 0 || value.length === 2) {
                onChange?.([date]); //select new date as start value
            } else {
                const endIsAfterStart = d.isAfter(dates.valStartDate, 'date');
                if (endIsAfterStart) {
                    onChange?.([value[0], date]); //select new date as end value
                } else {
                    onChange?.([date, value[0]]); //select new date as start value and use previous start as new end
                }
            }
        }
    };
    const generateMonths = useCallback(() => {
        const newMonths: Month[] = [];
        const { valStartDate, valEndDate, minDate, maxDate, todayDate } = dates;
        for (let i = 0; i < cols; i++) {
            const m = startDate.add(i, 'month'); //current month
            const firstDayDate = m.startOf('month'); //first day of month
            const lastDayDate = m.endOf('month'); //last day of month
            const firstMonthDayIndex = firstDayDate.day() + (isJalali ? 1 : 0); //first day of month index(weekday) ... for jalali we add 1 to it to sync it
            const daysInMonth = m.daysInMonth(); //current month days count
            const days: Day[] = []; //days of month
            for (let i = 0; i < 42; i++) {
                //we use 42(6*7) because at most we have 6 rows(weeks) and 7 cols(weekdays) for single month
                const dayState =
                    i < firstMonthDayIndex ? 'prev' : i < firstMonthDayIndex + daysInMonth ? 'current' : 'next'; //each day that we render can be for previous month, current month or next month
                let d: Dayjs;
                if (dayState === 'prev') d = firstDayDate.subtract(firstMonthDayIndex - i, 'day');
                else if (dayState === 'next') d = lastDayDate.add(i - firstMonthDayIndex - daysInMonth + 1, 'day');
                else d = firstDayDate.add(i - firstMonthDayIndex, 'day');
                const isBetweenValues = !!(
                    mode === 'range' &&
                    value.length === 2 &&
                    d.isBetween(valStartDate, valEndDate, 'date', '[]')
                );
                const isBetweenStarAndHover = !!(
                    mode === 'range' &&
                    value.length === 1 &&
                    hoverDate &&
                    d.isBetween(valStartDate, hoverDate, 'date', '[]')
                );
                const date = d.format(format);
                const day = +d.format('D');
                const isSelected = !!value.find((v) => v === date);
                const isInRange = isBetweenValues || isBetweenStarAndHover;
                const isToday = date === todayDate.format(format);
                const isDisabled = !!(
                    (minDate && d.isBefore(minDate, 'date')) ||
                    (maxDate && d.isAfter(maxDate, 'date'))
                );
                const isOutside = dayState === 'prev' || dayState === 'next';
                days.push({
                    d,
                    date,
                    day,
                    isSelected,
                    isInRange,
                    isToday,
                    isDisabled,
                    isOutside
                });
            }
            newMonths.push({
                d: m,
                name: m.format('MMMM'),
                year: m.format('YYYY'),
                days
            });
        }
        setMonths(newMonths);
    }, [mode, isJalali, format, cols, value, startDate, hoverDate, dates]);
    useEffect(() => {
        //generate months whenever any of dependencies of generateMonths function changes(e.g mode,value,startD,...)
        generateMonths();
    }, [generateMonths]);
    useEffect(() => {
        //when we update calendar we should set new value of startD
        onStartDateChange(
            dayjs(value[0] || undefined, { jalali: isJalali })
                .calendar(calendar)
                .locale(locale)
        );
        //! we don't add 'value' as dependency because it will always jump on value[0] month
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [calendar]);

    return (
        <div dir={dir} className={`${className}`} style={{ ...style }}>
            {step === 'calendar' && (
                <div
                    className={`divide flex justify-center divide-x divide-solid divide-slate-200 ${dir === 'rtl' ? 'divide-x-reverse' : ''}`}
                >
                    {months.map((month, i) => {
                        const isFirstMonth = i === 0;
                        const isLastMonth = i === months.length - 1;
                        return (
                            <div key={month.name} className='px-8 first:ps-0 last:pe-0'>
                                <div
                                    style={{
                                        width: `${size * 7}px`
                                    }}
                                >
                                    <div className='flex items-center gap-5'>
                                        {isFirstMonth && (
                                            <Button
                                                variant='outline'
                                                size='sm'
                                                color={colors.textLighten}
                                                className='shrink-0 !p-1'
                                                onClick={onPrevMonth}
                                            >
                                                <Icon
                                                    icon={dir === 'ltr' ? 'mdi:chevron-left' : 'mdi:chevron-right'}
                                                    size='md'
                                                    color={colors.text}
                                                />
                                            </Button>
                                        )}
                                        <div className={`flex grow items-center justify-center gap-2`}>
                                            <p
                                                role='button'
                                                onClick={() => setStep('month-picker')}
                                                className='text-title-md text-slate-700'
                                            >
                                                {month.name}
                                            </p>
                                            <p
                                                role='button'
                                                onClick={() => setStep('year-picker')}
                                                className='text-title-md text-slate-400'
                                            >
                                                {month.year}
                                            </p>
                                        </div>
                                        {isLastMonth && (
                                            <Button
                                                variant='outline'
                                                size='sm'
                                                color={colors.textLighten}
                                                className='shrink-0 !p-1'
                                                onClick={onNextMonth}
                                            >
                                                <Icon
                                                    icon={dir === 'ltr' ? 'mdi:chevron-right' : 'mdi:chevron-left'}
                                                    size='md'
                                                    color={colors.text}
                                                />
                                            </Button>
                                        )}
                                    </div>
                                    <div className='mt-5'>
                                        <ul className='grid grid-cols-7 gap-0'>
                                            {weekdays.map((weekday) => (
                                                <li key={weekday} className='text-title-sm text-center text-slate-700'>
                                                    {weekday}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className='mt-5'>
                                        <ul className='grid grid-cols-7 gap-0'>
                                            {month.days.map((day) => {
                                                const {
                                                    d,
                                                    date,
                                                    day: monthDay,
                                                    isSelected,
                                                    isInRange,
                                                    isToday,
                                                    isDisabled,
                                                    isOutside
                                                } = day;
                                                const { valStartDate } = dates;
                                                const isStart = value[0] === date;
                                                const isEnd = value[1] === date;
                                                const isStartEndSame = value[0] === value[1];
                                                const isHover = !!hoverDate?.isSame(d, 'date');
                                                const isHoverBeforeStart = !!hoverDate?.isBefore(valStartDate, 'date');
                                                const isHoverAfterStart = !!hoverDate?.isAfter(valStartDate, 'date');
                                                let bgColor = 'transparent';
                                                let color = parsedTextColor;
                                                let radius = '0';
                                                let bgColorOverlay = 'transparent';
                                                let radiusOverlay = '0';
                                                if (isSelected) {
                                                    bgColor = parsedColor;
                                                    color = '#fff';
                                                    radius = '50%';
                                                    if (mode === 'range' && !isStartEndSame) {
                                                        bgColorOverlay = parsedInRangeColor;
                                                        radiusOverlay = '50%';
                                                        if (isStart && (isHoverAfterStart || value.length === 2))
                                                            radiusOverlay =
                                                                dir === 'ltr' ? '50% 0 0 50%' : '0 50% 50% 0';
                                                        else if (isEnd || isHoverBeforeStart)
                                                            radiusOverlay =
                                                                dir === 'ltr' ? '0 50% 50% 0' : '50% 0 0 50%';
                                                    }
                                                } else if (isInRange) {
                                                    bgColorOverlay = parsedInRangeColor;
                                                } else if (isHover) {
                                                    bgColorOverlay = parsedHoverColor;
                                                    radiusOverlay = '50%';
                                                } else if (isToday) {
                                                    bgColor = parsedTodayColor;
                                                    color = '#fff';
                                                    radius = '50%';
                                                } else if (isDisabled) {
                                                }

                                                return (
                                                    <li
                                                        key={date}
                                                        role={!isDisabled ? 'button' : 'listitem'}
                                                        onMouseEnter={() => setHoverDate(d)}
                                                        onMouseLeave={() => setHoverDate(null)}
                                                        onClick={() => onDayClick(day)}
                                                        className={`relative z-1 aspect-square overflow-hidden rounded-none bg-transparent ${isOutside || isDisabled ? 'pointer-events-none' : ''} ${isOutside ? 'opacity-0' : isDisabled ? 'opacity-50' : ''}`}
                                                        style={{
                                                            width: `${size}px`,
                                                            height: `${size}px`
                                                        }}
                                                    >
                                                        <div
                                                            className={`text-body-md flex h-full w-full items-center justify-center ${classNames.day} ${isSelected ? classNames.selected : ''} ${isInRange ? classNames.inRange : ''} ${isHover ? classNames.hover : ''} ${isToday ? classNames.today : ''} ${isDisabled ? classNames.disabled : ''}`}
                                                            style={{
                                                                backgroundColor: bgColor,
                                                                color,
                                                                borderRadius: radius
                                                            }}
                                                        >
                                                            {dayRender?.(day) || monthDay}
                                                        </div>
                                                        <div
                                                            className='pointer-events-none absolute top-0 left-0 -z-1 h-full w-full'
                                                            style={{
                                                                backgroundColor: bgColorOverlay,
                                                                borderRadius: radiusOverlay
                                                            }}
                                                        />{' '}
                                                        {/* only act as overlay  */}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            {step === 'year-picker' && (
                <div>
                    <div className='flex justify-end'>
                        <button onClick={() => setStep('calendar')} className='mb-2'>
                            <Icon icon='mdi:close' size='md' color={colors.error} />
                        </button>
                    </div>
                    <YearPicker
                        value={+startDate.format('YYYY')}
                        onChange={(val) => {
                            onStartDateChange((old) => old.year(val));
                            setStep('calendar');
                        }}
                        calendar={calendar}
                        offset={50}
                        min={minMax.minYear}
                        max={minMax.maxYear}
                        color={colors.primary}
                    />
                </div>
            )}
            {step === 'month-picker' && (
                <div>
                    <div className='flex justify-end'>
                        <button onClick={() => setStep('calendar')} className='mb-2'>
                            <Icon icon='mdi:close' size='md' color={colors.error} />
                        </button>
                    </div>
                    <MonthPicker
                        value={+startDate.format('M')}
                        onChange={(val) => {
                            onStartDateChange((old) => old.month(val - 1)); //dayjs month is zero-index but MonthPicker expect month to be [1,12]
                            setStep('calendar');
                        }}
                        calendar={calendar}
                        min={minMax.minMonth}
                        max={minMax.maxMonth}
                        color={colors.primary}
                    />
                </div>
            )}
        </div>
    );
}

//? Usage:
//! We should not use this component directly, instead use DateTimePicker component
//* #1: simple example with single mode:
// const [startDate, setStartDate] = useState<Dayjs>(dayjs().calendar(calendar));
// const [dates, setDates] = useState<string[]>(['2025/04/10']);
// <DatePicker mode='single' value={dates} onChange={(v) => setDates(v)}
//     startDate={startDate} onStartDateChange={setStartDate} cols={1}  size={50}
//     calendar='gregory' format='YYYY-MM-DD'
//     min='2025/04/05' max="'2025/04/25'"
// />
//* #2: range mode with update calendar/value/min,max and dayRender props:
// const [startDate, setStartDate] = useState<Dayjs>(dayjs().calendar(calendar));
// const [calendar, setCalendar] = useState<'gregory' | 'jalali'>('gregory');
// const [dates, setDates] = useState<string[]>([]);
// const [minMax, setMinMax] = useState({min: '2025/01/03',max: '2025/12/23'});
// const format = 'YYYY/MM/DD';
// <button onClick={() => {
//         //? 'jalali' is for input so we need old value
//         //? 'calendar','locale' are for output so we need new value
//         const oldIsJalali = calendar === 'jalali';
//         const newCalendar = calendar === 'gregory' ? 'jalali' : 'gregory';
//         const newLocale = newCalendar === 'gregory' ? 'en' : 'fa';
//         setCalendar(newCalendar);
//         setDates((old) =>old.map((date) =>dayjs(date, { jalali: oldIsJalali }).calendar(newCalendar).locale(newLocale).format(format)));
//         setMinMax((old) => ({
//             min: dayjs(old.min, { jalali: oldIsJalali }).calendar(newCalendar).format(format),
//             max: dayjs(old.max, { jalali: oldIsJalali }).calendar(newCalendar).format(format)
//         }));
//     }}
// >
//     toggle calendar
// </button>
// <h1>value: {JSON.stringify(dates)}</h1>
// <h1>min,max: {JSON.stringify(minMax)}</h1>
// <DatePicker mode='range' value={dates} onChange={(v) => setDates(v)}
//     startDate={startDate} onStartDateChange={setStartDate} cols={2} size={50}
//     calendar={calendar} format={format}  min={minMax.min} max={minMax.max}
//     dayRender={({ d, date, day, isDisabled, isOutside, isToday, isInRange, isSelected }) => <p>{date}</p>}
// />
