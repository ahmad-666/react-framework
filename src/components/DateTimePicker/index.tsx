'use client';

import { useState, useEffect, useMemo, useCallback, Fragment } from 'react';
import { type Dayjs } from 'dayjs';
import dayjs from '@/libs/dayjs';
import Button from '@/components/Button';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
import DEFAULT_COLORS from './colors';
import type { DateTimePickerProps } from './types';
export type { DateTimePickerProps, Calendar } from './types';

export default function DateTimePicker({
    type = 'date',
    calendar = 'gregory',
    onCalendarChange,
    mode = 'single',
    format = 'YYYY-MM-DD',
    value = [], //something like ['2020-10-05','2022-05-10'] ... for all mode we use string[] to handle all scenarios easily
    onChange,
    min,
    max,
    cols = 1,
    size = 50,
    showCalendarBtn = true,
    showTodayBtn = true,
    showClearBtn = true,
    dayRender,
    colors = DEFAULT_COLORS,
    classNames = {
        day: '', //basic css className of each day
        selected: '', //css className of selected dates in days
        inRange: '', //css className of in-range dates in days(e.g dates between first/last selected dates)
        hover: '', //css className for hover days
        today: '', //css className of today date in days
        disabled: '' //css className of disabled dates in days
    },
    className = '',
    style
}: DateTimePickerProps) {
    const [startDate, setStartDate] = useState<Dayjs>(dayjs().calendar(calendar));
    const hasDatePicker = type === 'date' || type === 'datetime';
    const hasTimePicker = type === 'time' || type === 'datetime';
    const isJalali = calendar === 'jalali';
    const locale = calendar === 'gregory' ? 'en' : 'fa';
    const dir = calendar === 'gregory' ? 'ltr' : 'rtl';
    const formats = useMemo(() => {
        let dateFormat = '';
        let timeFormat = '';
        const formatParts = format.split(/(\W)/); //separate format prop by delimiters,separators,white-space,...
        const yearFormats = ['YY', 'YYYY'];
        const monthFormats = ['M', 'MM', 'MMM', 'MMMM'];
        const dayFormats = ['D', 'DD'];
        const hourFormats = ['h', 'hh', 'H', 'HH'];
        const minuteFormats = ['m', 'mm'];
        const secondFormats = ['s', 'ss'];
        const dateFormats = [...yearFormats, ...monthFormats, ...dayFormats];
        const timeFormats = [...hourFormats, ...minuteFormats, ...secondFormats];
        formatParts.forEach((part) => {
            if (dateFormats.includes(part)) dateFormat += part;
            else if (timeFormats.includes(part)) timeFormat += part;
            else {
                //delimiter,separators,white-space,...
                if (dateFormat.length) dateFormat += part;
                if (timeFormat.length) timeFormat += part;
            }
        });
        return {
            year: yearFormats.find((f) => formatParts.includes(f)),
            month: monthFormats.find((f) => formatParts.includes(f)),
            day: dayFormats.find((f) => formatParts.includes(f)),
            hour: hourFormats.find((f) => formatParts.includes(f)),
            minute: minuteFormats.find((f) => formatParts.includes(f)),
            second: secondFormats.find((f) => formatParts.includes(f)),
            //trim all delimiters,separators,white-space,... from start,end
            datePicker: dateFormat.replace(/^\W*/g, '').replace(/\W*$/g, ''),
            timePicker: timeFormat.replace(/^\W*/g, '').replace(/\W*$/g, '')
        };
    }, [format]);
    const dayjsConfig = useMemo(() => {
        // for specify 2nd arg of dayjs
        // for parse empty value we use {jalali:isJalali} --> dayjs(undefined,{jalali:true})
        // for parse time we use time formats like HH:mm --> dayjs('10:45','HH:mm')
        // for parse date we use {jalali:isJalali} --> dayjs('2020-10-05',{jalali:true})
        // for parse datetime we use {jalali:isJalali} --> dayjs('2020-10-05 10:45',{jalali:true})
        return hasDatePicker ? { jalali: isJalali } : formats.timePicker;
    }, [hasDatePicker, isJalali, formats.timePicker]);
    const values = useMemo(() => {
        return {
            start: value[0],
            end: value[mode === 'single' ? 0 : 1],
            datePicker: value.map((val) => dayjs(val, dayjsConfig).calendar(calendar).format(formats.datePicker)),
            timePicker: value.map((val) => dayjs(val, dayjsConfig).format(formats.timePicker))
        };
    }, [value, mode, calendar, formats, dayjsConfig]);
    const dates = useMemo(() => {
        return {
            start: dayjs(values.start, dayjsConfig),
            end: dayjs(values.end, dayjsConfig),
            min: dayjs(min, dayjsConfig),
            max: dayjs(max, dayjsConfig)
        };
    }, [values, min, max, dayjsConfig]);
    const minMax = useMemo(() => {
        //for type==='datetime' we need to apply min,max to time-picker only if we reach min-date,max-date
        const { start: startD, end: endD, min: minD, max: maxD } = dates;
        const startReachMinDate = startD.isSame(minD, 'day');
        const startReachMaxDate = startD.isSame(maxD, 'day');
        const endReachMinDate = endD.isSame(minD, 'day');
        const endReachMaxDate = endD.isSame(maxD, 'day');
        const datePickerMin = min && hasDatePicker ? minD.calendar(calendar).format(formats.datePicker) : undefined;
        const datePickerMax = max && hasDatePicker ? maxD.calendar(calendar).format(formats.datePicker) : undefined;
        const timePickerStartMin =
            min && hasTimePicker && (type === 'time' || startReachMinDate)
                ? minD.format(formats.timePicker)
                : undefined;
        const timePickerStartMax =
            max && hasTimePicker && (type === 'time' || startReachMaxDate)
                ? maxD.format(formats.timePicker)
                : undefined;
        const timePickerEndMin =
            min && hasTimePicker && (type === 'time' || endReachMinDate) ? minD.format(formats.timePicker) : undefined;
        const timePickerEndMax =
            max && hasTimePicker && (type === 'time' || endReachMaxDate) ? maxD.format(formats.timePicker) : undefined;
        return {
            datePickerMin,
            datePickerMax,
            timePickerStartMin,
            timePickerStartMax,
            timePickerEndMin,
            timePickerEndMax
        };
    }, [formats, dates, type, hasDatePicker, hasTimePicker, calendar, min, max]);
    const onCalendarChangeHandler = () => {
        const newCalendar = calendar === 'gregory' ? 'jalali' : 'gregory';
        const newValue = value.map((val) => dayjs(val, dayjsConfig).calendar(newCalendar).format(format));
        onCalendarChange?.(newCalendar);
        onChange?.(newValue);
    };
    const onClearHandler = () => {
        onChange?.([]);
    };
    const onTodayHandler = () => {
        setStartDate(dayjs().calendar(calendar).locale(locale));
    };
    const checkMinMax = useCallback(
        (value: string[]) => {
            //? 1st check value prop against min,max and update value prop if its outside of min,max thresholds
            //? 2nd for mode==='range' check start is lower than end and end is greater than start
            const valueCopy = [...value];
            let start = valueCopy[0];
            let end = valueCopy[1];
            const { min: minD, max: maxD } = dates;
            let startBelowMin = false;
            let endPassedMax = false;
            let startPassedEnd = false;
            let endBelowStart = false;
            if (mode === 'single') {
                //in single mode we don't have any end so we work with start only
                startBelowMin = min && start ? dayjs(start, dayjsConfig).isBefore(minD) : false;
                endPassedMax = max && start ? dayjs(start, dayjsConfig).isAfter(maxD) : false;
                if (startBelowMin) start = min!;
                if (endPassedMax) start = max!;
            } else {
                startBelowMin = min && start ? dayjs(start, dayjsConfig).isBefore(minD) : false;
                endPassedMax = max && end ? dayjs(end, dayjsConfig).isAfter(maxD) : false;
                if (startBelowMin) start = min!;
                if (endPassedMax) end = max!;
                startPassedEnd =
                    mode === 'range' && start && end
                        ? dayjs(start, dayjsConfig).isAfter(dayjs(end, dayjsConfig))
                        : false;
                endBelowStart =
                    mode === 'range' && start && end
                        ? dayjs(end, dayjsConfig).isBefore(dayjs(start, dayjsConfig))
                        : false;
                if (startPassedEnd) start = end!;
                if (endBelowStart) end = start!;
            }
            //return final value
            return (mode === 'single' ? [start] : [start, end]).filter((v) => v);
        },
        [mode, dates, dayjsConfig, min, max]
    );
    const onDatePickerChangeHandler = useCallback(
        (newValue: string[]) => {
            //newValue arg is only consist of dates without time so we use {jalali:isJalali} instead of dayjsConfig
            //value prop can consist date or time so we use dayjsConfig
            const newVal = newValue
                .map((v, i) => {
                    const year = dayjs(v, { jalali: isJalali }).calendar(calendar).get('year');
                    const month = dayjs(v, { jalali: isJalali }).calendar(calendar).get('month');
                    const day = dayjs(v, { jalali: isJalali }).calendar(calendar).get('date');
                    return dayjs(value[i], dayjsConfig)
                        .calendar(calendar)
                        .set('year', +year)
                        .set('month', +month)
                        .set('date', +day)
                        .format(format);
                })
                .filter((v) => v);
            onChange?.(checkMinMax(newVal));
        },
        [value, onChange, isJalali, dayjsConfig, calendar, format, checkMinMax]
    );
    const onTimePickerChangeHandler = useCallback(
        (newValue: string, i: number) => {
            //newValue is only consist of time without date so we use formats.timePicker instead of dayjsConfig
            //value prop can consist date or time so we use dayjsConfig
            //for type==='time' we directly update time but for type==='date'||type==='datetime' we only update time if we already have a value like date,datetime
            const shouldUpdateTime = type === 'time' || !!(hasDatePicker && value[i]);
            if (shouldUpdateTime) {
                const valueCopy = [...value];
                const oldValue = valueCopy[i];
                const hour = dayjs(newValue, formats.timePicker).get('hour');
                const minute = dayjs(newValue, formats.timePicker).get('minute');
                const finalValue = dayjs(oldValue, !oldValue ? { jalali: isJalali } : dayjsConfig)
                    .calendar(calendar)
                    .set('hour', hour)
                    .set('minute', minute)
                    .format(format);
                valueCopy[i] = finalValue;
                onChange?.(checkMinMax(valueCopy));
            }
        },
        [value, onChange, type, isJalali, dayjsConfig, calendar, hasDatePicker, format, formats.timePicker, checkMinMax]
    );
    useEffect(() => {
        // for type="time" we update value prop with current time if its empty
        if (type === 'time') {
            const initValue: string[] = [];
            let shouldUpdate = false;
            if (!value[0]) {
                initValue[0] = dayjs().format(formats.timePicker);
                shouldUpdate = true;
            }
            if (mode === 'range' && !value[1]) {
                initValue[1] = dayjs().format(formats.timePicker);
                shouldUpdate = true;
            }
            if (shouldUpdate) onChange?.(checkMinMax(initValue));
        }
    }, [value, onChange, type, mode, formats.timePicker, checkMinMax]);

    return (
        <div className={`${className}`} style={{ ...style }}>
            {showCalendarBtn && hasDatePicker && (
                <div className='mb-5 flex items-center gap-2'>
                    <Button
                        variant='fill'
                        size='sm'
                        color={colors.primary}
                        onClick={onCalendarChangeHandler}
                        className='mb-2 capitalize'
                    >
                        {isJalali ? 'show gregory calendar' : 'show jalali calendar'}
                    </Button>
                </div>
            )}
            <div>
                {hasDatePicker && (
                    <DatePicker
                        calendar={calendar}
                        mode={mode}
                        value={values.datePicker}
                        onChange={onDatePickerChangeHandler}
                        startDate={startDate}
                        onStartDateChange={setStartDate}
                        min={minMax.datePickerMin}
                        max={minMax.datePickerMax}
                        cols={cols}
                        size={size}
                        format={formats.datePicker}
                        dayRender={dayRender}
                        colors={colors}
                        classNames={classNames}
                        className={`${hasTimePicker ? 'mb-2' : ''}`}
                    />
                )}
                {hasTimePicker && (
                    // timepicker should be disabled if also have date and don't select date yet
                    <div dir={dir} className='flex flex-wrap items-center justify-center gap-10'>
                        <TimePicker
                            variants={['hour', 'minute']}
                            value={values.timePicker[0]}
                            onChange={(newVal) => onTimePickerChangeHandler(newVal, 0)}
                            label={mode === 'range' ? 'Start Time' : ''}
                            min={minMax.timePickerStartMin}
                            max={minMax.timePickerStartMax}
                            format={formats.timePicker}
                            disabled={hasDatePicker && !values.start}
                        />
                        {mode === 'range' && (
                            <TimePicker
                                variants={['hour', 'minute']}
                                value={values.timePicker[1]}
                                onChange={(newVal) => onTimePickerChangeHandler(newVal, 1)}
                                label='End Time'
                                min={minMax.timePickerEndMin}
                                max={minMax.timePickerEndMax}
                                format={formats.timePicker}
                                disabled={hasDatePicker && !values.end}
                            />
                        )}
                    </div>
                )}
            </div>
            <div className='tablet:flex-row tablet:items-center tablet:justify-between mt-5 flex flex-col gap-4'>
                <div className='text-body-md flex items-center gap-2 text-slate-700'>
                    {value.map((val, i) => (
                        <Fragment key={i}>
                            <div className='rounded-md border border-slate-300 px-4 py-1'>
                                <p>{val}</p>
                            </div>
                            {i < value.length - 1 && <span>-</span>}
                        </Fragment>
                    ))}
                </div>
                <div className='flex items-center gap-2'>
                    {showClearBtn && hasDatePicker && (
                        <Button variant='outline' size='sm' color={colors.error} onClick={onClearHandler}>
                            Clear
                        </Button>
                    )}
                    {showTodayBtn && hasDatePicker && (
                        <Button variant='fill' size='sm' color={colors.today} onClick={onTodayHandler}>
                            Today
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
//? Usage:
//* #1: time range example without min,max:
// const format = 'HH:mm';
// const [dates, setDates] = useState<string[]>([]);
// <DateTimePicker type='time' mode='range'
//     value={dates} onChange={(newVal) => {setDates(newVal);}}
//     showCalendarBtn={false} format={format}
// />
//* #2: date single example with min,max and static gregory calendar:
// const format = 'YYYY-MM-DD';
// const [dates, setDates] = useState<string[]>([]);
// <DateTimePicker type='date' mode='single' calendar='gregory' showCalendarBtn={false}
//     value={dates} onChange={(newVal) => {setDates(newVal);}}
//     format={format} min='2025-04-10' max='2025-06-25' cols={1} size={50}
// />
//* #3: date-time range example with min,max and update calendar prop with responsive sizing:
// const format = 'YYYY-MM-DD HH:mm';
// const isMobile = useMediaQuery('(width < 750px)');
// const cols = isMobile ? 1 : 2;
// const size = isMobile ? 40 : 50;
// const offset = isMobile ? 0 : 120;
// const [dates, setDates] = useState<string[]>(['2025-04-12 10:45', '2025-06-14 05:45']);
// const [calendar, setCalendar] = useState<Calendar>('gregory');
// const [minMax, setMinMax] = useState({min: '2025-04-10 10:15',max: '2025-06-25 05:45'});
// <DateTimePicker type='datetime' mode='range' value={dates} onChange={(newVal) => {setDates(newVal);}}
//     format={format} min={minMax.min} max={minMax.max} calendar={calendar}
//     onCalendarChange={(newCalendar) => {
//         setCalendar(newCalendar);
//         setMinMax((old) => ({
//             min: dayjs(old.min, { jalali: calendar === 'jalali' }).calendar(newCalendar).format(format),
//             max: dayjs(old.max, { jalali: calendar === 'jalali' }).calendar(newCalendar).format(format)
//         }));
//     }}
//    cols={cols} size={size} style={{width: cols * size * 7 + offset}}
// />
