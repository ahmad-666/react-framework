/** add alpha channel(opacity) to any color */
export const alpha = (color: string, alpha: number) => {
    //? Work with any valid color --> name,rgb,rgba,hex,hex with alpha,hsl,hsla,...
    //! Only works in client environment that we have access to DOM and on nodejs environment we should look for other approaches
    if (alpha < 0 || alpha > 1) {
        console.warn('Alpha value must be between 0 and 1');
        return color;
    }
    const div = document.createElement('DIV');
    div.style.color = color;
    document.body.appendChild(div);
    const parsedColor = window.getComputedStyle(div).color; //will return rgb/rgba for color names,rgb,rgba,hex,hex with alpha,hsl,hsla,... but for lab,oklab,lch,oklch it will return their own color space
    try {
        if (parsedColor.match(/(lab|oklab|lch|oklch)/)) {
            //? for lab,oklab,lch,oklch
            const colorSpace = parsedColor.split('(')[0];
            const colorValues = parsedColor.split('(')[1].split(')')[0];
            return `${colorSpace}(${colorValues} / ${alpha})`;
        } else {
            //? for color name,rgb,rgba,hex,hex with alpha,hsl,hsla,... parsedColor is rgb/rgba
            const [r, g, b] = parsedColor.split(',').map((section) => section.replace(/\D/g, ''));
            return `rgba(${r},${g},${b},${alpha})`; //return result in rgba format
        }
    } catch {
        return color;
    } finally {
        document.body.removeChild(div);
    }
};

//* Usage:
// alpha('red', 0.1) , alpha('rgb(255,0,0,)', 0.1) , alpha('#f00', 0.1) , alpha('#ff00ff55', 0.1) , alpha('oklch(10% 25 255)', 0.1) , alpha('oklab(40% 0.24 20.10 / .5)', 0.1)
