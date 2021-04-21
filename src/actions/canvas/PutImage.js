/**
 * Put Image
 * @ActionType: Canvas
 * @Description Applies ImageData on target canvas
 *
 */
import {CanvasAction} from "../../classes/abstracts/Actions";

export default class PutImage extends CanvasAction {
    /**
     *
     * @param target
     * @param {ImageData} imgData - ImageData to apply on canvas
     * @param {number} x - x position of where to place the imgData in the target
     * @param {number} y - y position of where to place the imgData in the target
     * @param {number} dx - x coordinate of the top-left corner from which the image data will be extracted.
     * @param {number} dy - y coordinate of the top-left corner from which the image data will be extracted.
     * @param {number} dw - destination width
     * @param {number} dh - destination height
     */
    do(target, imgData, x = 0, y = 0, dx = 0, dy = 0, dw = null, dh = null) {
        if (dw === null)
            dw = target.el.width;
        if (dh === null)
            dh = target.el.height;
        
        return target.ctx.putImageData(imgData, x, y, dx, dy, dw, dh);
    }
}
