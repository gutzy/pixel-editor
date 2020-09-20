export function hexToRgba(hex, divisor) {
    //if divisor isn't set, set it to one (so it has no effect)
    divisor = divisor || 1;

    //split given hex code into array of 3 values
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());

    //console.log('hex: '+hex)
    //console.log([parseInt(result[1], 16)/divisor, parseInt(result[2], 16)/divisor, parseInt(result[3], 16)/divisor])
    //console.log(result)

    return result ? {
        r: parseInt(result[1], 16)/divisor,
        g: parseInt(result[2], 16)/divisor,
        b: parseInt(result[3], 16)/divisor,
        a: 255
    } : null;
}

export function hslToRgb(h, s, l){
    h /= 255;
    s /= 255;
    l /= 255;

    let r, g, b;

    if(s === 0){
        r = g = b = l; // achromatic
    }else{
        let hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return {
        r:Math.round(r * 255),
        g:Math.round(g * 255),
        b:Math.round(b * 255)
    };
}

export function rgbToHex (r,g,b) {
    function componentToHex (c) {
        let hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }

    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

//put in red green blue values and get out hue saturation luminosity values

export function rgbToHsl(r, g, b){
    r /= 255;
    g /= 255;
    b /= 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let hue, saturation, luminosity = (max + min) / 2;

    if(max === min){
        hue = saturation = 0; // achromatic
    }else{
        let d = max - min;
        saturation = luminosity > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: hue = (g - b) / d + (g < b ? 6 : 0); break;
            case g: hue = (b - r) / d + 2; break;
            case b: hue = (r - g) / d + 4; break;
        }
        hue /= 6;
    }

    return {h:hue, s:saturation, l:luminosity};
}
