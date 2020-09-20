export function getCenterRect(canvas, width, height, scale = 1) {
    const cw = canvas.width, ch = canvas.height;
    return [cw/2-width*scale/2, ch/2-height*scale/2, width*scale, height*scale];
}

export function screenToRectXY(r, x, y) {
    if (x < r[0] || y < r[1] || x > r[0]+r[2] || y > r[1]+r[3]) return false;

    x = x-r[0];
    y = y-r[1];

    return {x,y}
}

