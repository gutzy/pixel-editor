import {CanvasAction} from "../../classes/abstracts/Actions";
import {hexToRgba} from "../../utils/ColorUtils";
import {colorPixel, coordColor, matchColor, matchPixelColor} from "../../utils/CanvasUtils";
import Canvas from "../../classes/Canvas";

const MAX_ATTEMPTS = 9999;

export default class FillArea extends CanvasAction {
    async do(target, x, y, color, source = null) {
        color = hexToRgba(color);
        await fill(target.el, target.ctx, x, y, color, source);
    }
}

function fill(el, ctx, startX, startY, fillColor, source = null) {

    startX = Math.floor(startX);
    startY = Math.floor(startY);

    let attempt = 0, t = source || ctx;
    let tempImage = t.getImageData(0, 0, el.width, el.height);
    let destImg = (source ? new ImageData(el.width, el.height) : tempImage);
    let topmostPixelsArray = [[startX, startY]];
    let clusterColor = coordColor(tempImage, startX, startY, el.width);

    if (!source && matchColor(clusterColor,[fillColor.r,fillColor.g,fillColor.b,fillColor.a])) {
        return; // same color already
    }

    while (topmostPixelsArray.length && attempt < MAX_ATTEMPTS) {
        let reachLeft, reachRight;

        let currentPixel = topmostPixelsArray.pop();
        let x = currentPixel[0];
        let y = currentPixel[1];

        let pixelPos = y * (el.width*4) + x * 4;

        while (y-- >= 0 && matchPixelColor(tempImage, pixelPos, clusterColor)) {
            pixelPos -= el.width * 4;
        }
        pixelPos += el.width * 4;
        ++y;
        reachLeft = false;
        reachRight = false;
        attempt++;
        while (y++ < el.height - 1 && matchPixelColor(tempImage, pixelPos, clusterColor)) {
            colorPixel(tempImage, pixelPos, fillColor);
            colorPixel(destImg, pixelPos, fillColor);
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
    ctx.putImageData(destImg, 0, 0);
}
