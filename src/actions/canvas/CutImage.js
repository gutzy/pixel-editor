/**
 * Cut Image
 * @ActionType: Canvas
 * @Description Cut an image from another image (creates a mask)
 *
 */
import {CanvasAction} from "../../classes/abstracts/Actions";

export default class CutImage extends CanvasAction {
    /**
     *
     * @param target
     * @param {Image|HTMLCanvasElement|ImageData} imgData - Image, Canvas etc. to remove from the target image
     * @param {number} x - cut x offset
     * @param {number} y - cut y offset
     * @param {number} zoom - indicates viewport zoom, so scale cutting porperly
     */
    do(target, imgData, x = 0, y = 0, zoom = 1) {
        // no anti-aliasing
        target.ctx.imageSmoothingEnabled = false;

        // Set drawing mode to remove everything drawn instead of adding it
        target.ctx.globalCompositeOperation = 'destination-out';

        // draw image, then set drawing mode back to drawing normally
        target.ctx.drawImage(imgData, x, y, imgData.width * zoom, imgData.height * zoom);
        target.ctx.globalCompositeOperation = 'source-over';
    }
}
