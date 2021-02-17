/**
 * Draw Image
 * @ActionType: Canvas
 * @Description Draws an image on the canvas
 *
 */
import {CanvasAction} from "../../classes/abstracts/Actions";

export default class DrawImage extends CanvasAction {
    /**
     *
     * @param target
     * @param {Image|HTMLCanvasElement|ImageData} imgData - Image, Canvas etc. to draw onto the canvas
     * @param x - drawing x offset
     * @param y - drawing y offset
     * @param zoom - indicates viewport zoom, so scale cutting porperly
     */
    do(target, imgData, x = 0, y = 0, zoom = 1) {
        // no anti-aliasing
        target.ctx.imageSmoothingEnabled = false;

        return target.ctx.drawImage(imgData, x, y, imgData.width * zoom, imgData.height * zoom);
    }
}
