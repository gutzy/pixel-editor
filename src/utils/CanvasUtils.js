export function getCenterRect(canvas, width, height, scale = 1) {
    const cw = canvas.width, ch = canvas.height;
    return [Math.floor(cw/2-width*scale/2), Math.floor(ch/2-height*scale/2), Math.floor(width*scale), Math.floor(height*scale)];
}

export function screenToRectXY(r, x, y) {
    if (x < r[0] || y < r[1] || x > r[0]+r[2] || y > r[1]+r[3]) return false;

    x = x-r[0];
    y = y-r[1];

    return {x,y}
}

export function colorPixel(img, pixelPos, fillColor) {
    img.data[pixelPos] = fillColor.r;
    img.data[pixelPos + 1] = fillColor.g;
    img.data[pixelPos + 2] = fillColor.b;
    img.data[pixelPos + 3] = 255;
}

export function matchPixelColor(tempImage, pixelPos, color) {
    let r = tempImage.data[pixelPos];
    let g = tempImage.data[pixelPos + 1];
    let b = tempImage.data[pixelPos + 2];
    let a = tempImage.data[pixelPos + 3];
    return matchColor(color, [r,g,b,a]);
}

export function matchColor(color1, color2) {
    return (color1[0] === color2[0] && color1[1] === color2[1] && color1[2] === color2[2] && color1[3] === color2[3]);
}

export function coordColor(img, x,y,width) {
    const red = y * (width * 4) + x * 4;
    return [img.data[red], img.data[red + 1], img.data[red + 2], img.data[red + 3]];
}
