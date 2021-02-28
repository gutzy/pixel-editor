/**
 * Get Center Rect - get the coordinates for a rectangle of a given width/height/scale/offset positioned in the
 * center of a target canvas
 *
 * @param {HTMLCanvasElement} canvas - target canvas, represents full size
 * @param {number} width - rect width
 * @param {number} height - rect height
 * @param {number} scale - rect scale - allows calculating viewport zoom
 * @param {{x,y}|null} offset - rect offset - allows calculating viewport pan
 * @return {[number, number, number, number]} rectangle coords
 */
export function getCenterRect(canvas, width, height, scale = 1, offset = null) {
    const cw = canvas.width, ch = canvas.height;

    const res = [Math.floor(cw/2-(width*scale)/2), Math.floor(ch/2-(height*scale)/2), Math.floor(width*scale), Math.floor(height*scale)];

    if (offset && typeof offset.x !== 'undefined') {
        res[0] -= offset.x;
        res[1] -= offset.y;
    }
    return res;
}


/**
 * Returns a rectangle between two sets of {x, y} coordinates
 *
 * @param {{x,y}} xy1 - first point
 * @param  {{x,y}} xy2 -second point
 * @param {boolean} absolute - if true, the second represents x,y coordinates. If false, it represents positive width and height
 * @return {null|[number, number, number, number]} - rectangle
 */
export function getRect(xy1, xy2, absolute = false) {
    if (!xy1 || !xy2) return null;
    const res = [  Math.min(xy1.x, xy2.x), Math.min(xy1.y, xy2.y),
        Math.max(xy1.x, xy2.x), Math.max(xy1.y, xy2.y)];
    if (!absolute) {
        res[2] -= res[0]; res[3] -= res[1];
    }

    return res;
}

/**
 * Returns whether a given x/y coordinate is inside a rectangle
 *
 * @param {[number,number,number,number]|null} r - rectangle array {4}
 * @param {number} x - x coordinate to check
 * @param {number} y - y coordinate to check
 * @return {boolean}
 */
export function isXYinRect(r, x, y) {
    return !(x < r[0] || y < r[1] || x > r[0]+r[2] || y > r[1]+r[3]) ;
}

/**
 * Deducts rect position from x/y coordinates
 *
 * @param {[number,number,number,number]|null}r - rectangle array {4}
 * @param {number} x - x position
 * @param {number} y - y position
 * @return {{x: number, y: number}} - normalized position
 */
export function screenToRectXY(r, x, y) {

    x = x-r[0];
    y = y-r[1];

    return {x,y}
}

/**
 * Color a pixel inside an ImageData object
 *
 * @param {ImageData} img - imgData to draw
 * @param {number} pixelPos - ImageData red pixel position
 * @param {{r,g,b}} fillColor - color to set the pixel to
 */
export function colorPixel(img, pixelPos, fillColor) {
    img.data[pixelPos] = fillColor.r;
    img.data[pixelPos + 1] = fillColor.g;
    img.data[pixelPos + 2] = fillColor.b;
    img.data[pixelPos + 3] = 255;
}

/**
 * See if a pixel in given pos is a certain color
 *
 * @param {ImageData} tempImage
 * @param {number} pixelPos - ImageData red pixel position
 * @param color - color to match the color against
 * @return {boolean}
 */
export function matchPixelColor(tempImage, pixelPos, color) {
    let r = tempImage.data[pixelPos];
    let g = tempImage.data[pixelPos + 1];
    let b = tempImage.data[pixelPos + 2];
    let a = tempImage.data[pixelPos + 3];
    return matchColor(color, [r,g,b,a]);
}

/**
 * Compare two colors, see if they match
 *
 * @param {[number,number,number,number]} color1
 * @param {[number,number,number,number]} color2
 * @return {boolean}
 */
export function matchColor(color1, color2) {
    return (color1[0] === color2[0] && color1[1] === color2[1] && color1[2] === color2[2] && color1[3] === color2[3]);
}

/**
 * Get the color of a given x/y coordinate
 *
 * @param {ImageData} img
 * @param {number} x
 * @param {number} y
 * @param {number} width - canvas width
 * @return {*[]}
 */
export function coordColor(img, x,y,width) {
    const red = y * (width * 4) + x * 4;
    return [img.data[red], img.data[red + 1], img.data[red + 2], img.data[red + 3]];
}

/**
 * Calculate the distance between two points
 *
 * @param {number} x1 - first x coordinate
 * @param {number} y1 - first y coordinate
 * @param {number} x2 - second x coordinate
 * @param {number} y2 - second y coordinate
 * @return {number}
 */
export function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2, 2));
}

/**
 * Get a list of all the pixels directly between two points
 *
 * @param {number} x1 - first x coordinate
 * @param {number} y1 - first y coordinate
 * @param {number} x2 - second x coordinate
 * @param {number} y2 - second y coordinate
 * @return {{x: *, y: *}[]}
 */
export function pixelsBetween(x1, y1, x2, y2) {
    let res = {};
    x1 = Math.floor(x1); y1 = Math.floor(y1); x2 = Math.floor(x2); y2 = Math.floor(y2);
    let dx = Math.abs(x1 - x2);
    let dy = Math.abs(y1 - y2);
    let sx = (x1 < x2 ? 1 : -1);
    let sy = (y1 < y2 ? 1 : -1);
    let err = dx - dy;

    while ((x1 != x2 || y1 != y2)) {
        res[x1 + ',' + y1] = true;

        let e2 = err;

		if (e2 >-dy) {
			err -=dy; 
			x1 += sx;
		}

		if (e2 < dx) {
			err +=dx; 
			y1 += sy;
		}
    }

    return Object.keys(res).map(e => ({x : e.split(",")[0], y: e.split(",")[1] }));
}
