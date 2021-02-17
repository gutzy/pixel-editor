/**
 * Fill Area
 * @ActionType: Canvas
 * @Description Does a flood-fill (paint bucket) on a given canvas
 *
 */

import {CanvasAction} from "../../classes/abstracts/Actions";
import {hexToRgba} from "../../utils/ColorUtils";
import {colorPixel, coordColor, matchColor, matchPixelColor} from "../../utils/CanvasUtils";

// maximum attempts to fill area. Used to prevent endless loops :)
const MAX_ATTEMPTS = 9999;

export default class FillArea extends CanvasAction {
    /**
     *
     * @param target
     * @param {number} x - fill x position
     * @param {number} y - fill y position
     * @param {string} color - hex color to fill area
     * @param {CanvasRenderingContext2D | null} source - optional source ctx, used to sample flood fill from one canvas and apply it to another
     */
    async do(target, x, y, color, source = null) {
        color = hexToRgba(color);
        await fill(target.el, target.ctx, x, y, color, source);
    }
}

/**
 * actual fill function
 * @param {HTMLCanvasElement} el
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} startX
 * @param {number} startY
 * @param {string} fillColor
 * @param {CanvasRenderingContext2D | null}source
 */
function fill(el, ctx, startX, startY, fillColor, source = null) {

    // initialize fill start position
    startX = Math.floor(startX);
    startY = Math.floor(startY);

    // define destination image and sampled image data
    let attempt = 0, t = source || ctx;
    let tempImage = t.getImageData(0, 0, el.width, el.height);
    let destImg = (source ? new ImageData(el.width, el.height) : tempImage); // use fresh data when applying externally

    // Initialize the lookup array
    let topmostPixelsArray = [[startX, startY]];

    // Sample the cluster color at start coordinates - the function will then look for it in the surrounding pixels
    let clusterColor = coordColor(tempImage, startX, startY, el.width);

    // same color already (and applying locally) - can skip.
    if (!source && matchColor(clusterColor,[fillColor.r,fillColor.g,fillColor.b,fillColor.a])) {
        return;
    }

    // Loop through pixel lookup array as long as it exists (or attempts weren't exhausted)
    while (topmostPixelsArray.length && attempt < MAX_ATTEMPTS) {
        let reachLeft, reachRight;

        // Get a pixel for lookup
        let currentPixel = topmostPixelsArray.pop();
        let x = currentPixel[0];
        let y = currentPixel[1];

        let pixelPos = y * (el.width*4) + x * 4;

        // Start iterating along the image
        while (y-- >= 0 && matchPixelColor(tempImage, pixelPos, clusterColor)) {
            pixelPos -= el.width * 4;
        }
        pixelPos += el.width * 4;
        ++y;
        reachLeft = false;
        reachRight = false;
        attempt++;
        while (y++ < el.height - 1 && matchPixelColor(tempImage, pixelPos, clusterColor)) {

            // Draw both target and source for resolution (however only target drawing will be applied)
            colorPixel(tempImage, pixelPos, fillColor);
            colorPixel(destImg, pixelPos, fillColor);

            // Iterate pixels, add them to lookup array if they match the cluster color
            if (x > 0) {
                if (matchPixelColor(tempImage, pixelPos - 4, clusterColor)) {
                    if (!reachLeft) {
                        topmostPixelsArray.push([x - 1, y]);
                        reachLeft = true;
                    }
                }
                else if (reachLeft) { reachLeft = false; }
            }

            if (x < el.width - 1) {
                if (matchPixelColor(tempImage, pixelPos + 4, clusterColor)) {
                    if (!reachRight) {
                        topmostPixelsArray.push([x + 1, y]);
                        reachRight = true;
                    }
                }
                else if (reachRight) { reachRight = false; }
            }

            pixelPos += el.width * 4;
        }
    }

    // When done, draw fill on destination canvas
    ctx.putImageData(destImg, 0, 0);
}
