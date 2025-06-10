import { useState } from 'react';
import Cookie from 'js-cookie';

type CookieOptions = {
    secure?: boolean;
    path?: string;
    domain?: string;
    sameSite?: 'none' | 'strict' | 'lax';
    /** number means how many days till expires , Date means expiration date */
    expires?: number | Date;
};
type Args = {
    name: string;
    defaultValue?: string;
    options?: CookieOptions;
};

const defaultOptions: CookieOptions = {
    secure: true,
    path: '/',
    sameSite: 'lax',
    expires: 365 //365 days
};

const useCookie = ({ name, defaultValue = '', options = defaultOptions }: Args) => {
    const [value, setValue] = useState(() => {
        const cookie = Cookie.get(name);
        if (cookie) return cookie;
        Cookie.set(name, defaultValue, options);
        return defaultValue;
    });
    const updateCookie = (newValue: string, newOptions: CookieOptions = defaultOptions) => {
        Cookie.set(name, newValue, newOptions);
        setValue(newValue);
    };
    const deleteCookie = () => {
        Cookie.remove(name, options);
        setValue('');
    };
    return { value, updateCookie, deleteCookie };
};

export default useCookie;

//? Usage:
// const { value, updateCookie, deleteCookie } = useCookie({ name: 'cookie-name', defaultValue: 'base value' });
// <button onClick={() => updateCookie('new value')}>update</button>
// <button onClick={() => deleteCookie()}>delete</button>
