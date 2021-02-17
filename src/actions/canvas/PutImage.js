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
     * @param {number} x - origin x position
     * @param {number} y - origin y position
     * @param {number} dx - destination x position
     * @param {number} dy - destination y position
     * @param {number} dw - destination width
     * @param {number} dh - destination height
     */
    do(target, imgData, x = 0, y = 0, dx = 0, dy = 0, dw = null, dh = null) {
        return target.ctx.putImageData(imgData, x, y,dx,dy,target.el.width,target.el.height);
    }
}
