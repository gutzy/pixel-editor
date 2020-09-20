import {CanvasAction} from "../../classes/abstracts/Actions";
import {hexToRgba} from "../../utils/ColorUtils";

export default class FillArea extends CanvasAction {
    async do(target, x, y, color) {
        color = hexToRgba(color);
        await fill(target.el, target.ctx, x, y, color);
    }
}
function fill(el, ctx, x, y, fillColor) {

    //changes a pixels color
    console.log(x, y);
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
        return (r === color[0] && g === color[1] && b === color[2]);
    }

    let tempImage = ctx.getImageData(0, 0, el.width, el.height);
    let topmostPixelsArray = [[x, y]];
    let startingPosition = (topmostPixelsArray[0][1] * el.width + topmostPixelsArray[0][0]) * 4;
    let clusterColor = [tempImage.data[startingPosition],tempImage.data[startingPosition+1],tempImage.data[startingPosition+2]];

    if (clusterColor[0] === fillColor.r &&
        clusterColor[1] === fillColor.g &&
        clusterColor[2] === fillColor.b )
        return;

    while (topmostPixelsArray.length) {
        let reachLeft, reachRight;

        let currentPixel = topmostPixelsArray.pop();

        let x = currentPixel[0];
        let y = currentPixel[1];

        let pixelPos = (y * el.width + x) * 4;

        while (y-- >= 0 && matchStartColor(tempImage, pixelPos, clusterColor)) {
            pixelPos -= el.width * 4;
        }
        pixelPos += el.width * 4;
        ++y;
        reachLeft = false;
        reachRight = false;
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

            pixelPos += el.width * 4;
        }
    }
    ctx.putImageData(tempImage, 0, 0);
}
