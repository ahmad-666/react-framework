'use client';

import { useState, useEffect } from 'react';
import twColors from 'tailwindcss/colors';
// import paletteColors from '@/themes/mui/palette';

const useColor = (input: string) => {
    //?it supports 'primary','primary-light1','primary.light1' formats
    const getColor = () => {
        const rootStyles = getComputedStyle(document.documentElement);
        const splitter = input.includes('.') ? '.' : '-'; //'.' for mui colors and '-' for tailwind colors
        const colorSplit = input.split(splitter) || [];
        const [colorName, colorVariant = ''] = colorSplit;
        const paletteColor = rootStyles.getPropertyValue(
            `--color-${[colorName, colorVariant].filter((c) => c).join('-')}`
        );
        //@ts-expect-error 'get tailwind color'
        const twColor = twColors[colorName]?.[colorVariant];
        return paletteColor || twColor || input || 'transparent';
    };
    const [color, setColor] = useState<string>('transparent');
    useEffect(() => {
        const newColor = getColor();
        setColor(newColor);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input]);
    return color;
};

export default useColor;

//? Usage: useColor('primary') , useColor('pastelPink-light2') , useColor('blue-500') , useColor('#ff00ff') , useColor('red') , useColor('neutral.light3')
