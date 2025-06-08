'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import dayjs from '@/libs/dayjs';
import Button from '@/components/Button';
import DEFAULT_COLORS from './colors';
import type { Month, MonthPickerProps } from './types';

export default function MonthPicker({
    value,
    onChange,
    calendar = 'gregory',
    min = 1,
    max = 12,
    color = DEFAULT_COLORS.primary,
    className = ''
}: MonthPickerProps) {
    const activeMonth = useRef<HTMLLIElement>(null!);
    const [months, setMonths] = useState<Month[]>([]);
    const locale = calendar === 'gregory' ? 'en' : 'fa';
    const generateMonths = useCallback(() => {
        const newMonths: Month[] = [];
        for (let i = 1; i <= 12; i++) {
            //generate months
            const m = dayjs()
                .calendar(calendar)
                .locale(locale)
                .month(i - 1);
            newMonths.push({
                value: i,
                name: m.format('MMMM'),
                isSelected: i === value,
                isDisabled: !!((min && i < min) || (max && i > max))
            });
        }
        setMonths(newMonths);
    }, [value, locale, calendar, min, max]);
    useEffect(() => {
        //generate list of months
        generateMonths();
    }, [generateMonths]);
    useEffect(() => {
        //scroll into active month
        setTimeout(() => {
            activeMonth.current?.scrollIntoView({ behavior: 'smooth' });
        }, 0);
    }, []);

    return (
        <div className={`overflow-auto ${className}`}>
            <p className='text-title-md text-center text-slate-700'>Select Month</p>
            <ul className='mobile:grid-cols-3 tablet:grid-cols-4 laptop:grid-cols-6 mt-3 grid grid-cols-2 gap-0'>
                {months.map((month) => (
                    <li
                        key={month.value}
                        ref={(node: null | HTMLLIElement) => {
                            if (node && month.isSelected) activeMonth.current = node;
                        }}
                    >
                        <Button
                            variant={month.isSelected ? 'fill' : 'text'}
                            size='sm'
                            color={color}
                            disabled={month.isDisabled}
                            onClick={() => onChange?.(month.value)}
                            className='w-full'
                        >
                            {month.name}
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

//? Usage:
// const [month, setMonth] = useState(9);
// <MonthPicker value={month} onChange={(v) => setMonth(v)} min={3} max={10} color='secondary' />;
