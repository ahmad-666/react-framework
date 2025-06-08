import dayjs from 'dayjs';
//* Init plugins ...............................
import jalali from '@zoomit/dayjs-jalali-plugin';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import objectSupport from 'dayjs/plugin/objectSupport';
import toObject from 'dayjs/plugin/toObject';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
//* Create dayjs custom instance ...................
const dayjsExtended = dayjs;
dayjsExtended.extend(jalali);
dayjsExtended.extend(utc);
dayjsExtended.extend(customParseFormat);
dayjsExtended.extend(objectSupport);
dayjsExtended.extend(toObject);
dayjsExtended.extend(duration);
dayjsExtended.extend(isBetween);
//dayjs.extend(isToday); //don't use it because it will not work for jalali
//* Exports ...................
export default dayjsExtended;
