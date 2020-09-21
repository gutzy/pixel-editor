import {CanvasAction} from "../../classes/abstracts/Actions";
import {hexToRgba} from "../../utils/ColorUtils";

const MAX_ATTEMPTS = 9999;

export default class FillArea extends CanvasAction {
    async do(target, x, y, color) {
        color = hexToRgba(color);
        await fill(target.el, target.ctx, x, y, color);
    }
}
function fill(el, ctx, startX, startY, fillColor) {

    startX = Math.floor(startX);
    startY = Math.floor(startY);

    let attempt = 0;

    //changes a pixels color
    function colorPixel(tempImage, pixelPos, fillColor) {
        tempImage.data[pixelPos] = fillColor.r;
        tempImage.data[pixelPos + 1] = fillColor.g;
        tempImage.data[pixelPos + 2] = fillColor.b;
        tempImage.data[pixelPos + 3] = 255;
    }

    //change x y to color value passed from the function and use that as the original color
    function matchStartColor(tempImage, pixelPos, color) {
        let r = tempImage.data[pixelPos];
        let g = tempImage.data[pixelPos + 1];
        let b = tempImage.data[pixelPos + 2];
        let a = tempImage.data[pixelPos + 3];
        return matchColor(color, [r,g,b,a]);
    }

    function matchColor(color1, color2) {
        return (color1[0] === color2[0] && color1[1] === color2[1] && color1[2] === color2[2] && color1[3] === color2[3]);
    }

    function coordColor(img, x,y,width) {
        const red = y * (width * 4) + x * 4;
        return [img.data[red], img.data[red + 1], img.data[red + 2], img.data[red + 3]];
    }

    let tempImage = ctx.getImageData(0, 0, el.width, el.height);
    let topmostPixelsArray = [[Math.floor(startX), Math.floor(startY)]];
    let r = startY * (el.width*4) + startX * 4;
    let clusterColor = coordColor(tempImage, startX, startY, el.width);

    if (matchColor(clusterColor,[fillColor.r,fillColor.g,fillColor.b,fillColor.a])) {
        console.log(clusterColor, fillColor);
        return; // same color already
    }
    while (topmostPixelsArray.length && attempt < MAX_ATTEMPTS) {
        let reachLeft, reachRight;

        let currentPixel = topmostPixelsArray.pop();

        let x = currentPixel[0];
        let y = currentPixel[1];

        let pixelPos = y * (el.width*4) + x * 4;

        while (y-- >= 0 && matchStartColor(tempImage, pixelPos, clusterColor)) {
            pixelPos -= el.width * 4;
        }
        pixelPos += el.width * 4;
        ++y;
        reachLeft = false;
        reachRight = false;

        attempt++;

        while (y++ < el.height - 1 && matchStartColor(tempImage, pixelPos, clusterColor)) {
            colorPixel(tempImage, pixelPos, fillColor);
            if (x > 0) {
                if (matchStartColor(tempImage, pixelPos - 4, clusterColor)) {
                    if (!reachLeft) {
                        topmostPixelsArray.push([x - 1, y]);
                        reachLeft = true;
                    }
                }
                else if (reachLeft) {
                    reachLeft = false;
                }

            }

            if (x < el.width - 1) {
                if (matchStartColor(tempImage, pixelPos + 4, clusterColor)) {
                    if (!reachRight) {
                        topmostPixelsArray.push([x + 1, y]);
                        reachRight = true;
                    }
                }
                else if (reachRight) {
                    reachRight = false;
                }
            }
            else {
                console.log(x, el.width)
            }

            pixelPos += el.width * 4;
        }
    }
    ctx.putImageData(tempImage, 0, 0);
}
