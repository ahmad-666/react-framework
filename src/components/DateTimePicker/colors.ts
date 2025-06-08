import { type Colors } from './types';

const DEFAULT_COLORS: Required<Colors> = {
    primary: 'violet-700', //selection color
    inRange: 'violet-100', //for color of between dates
    hover: 'violet-200', //hover color
    today: 'amber-500', //today color
    text: 'slate-700', //default day color
    textLighten: 'slate-300', //default lighten color ... for close icons , outline of prev/next month , ...
    error: 'red-600' //default error color ... use clear btn , ...
    //no need to define any color for disabled because we reduce opacity for disabled days
};

export default DEFAULT_COLORS;
