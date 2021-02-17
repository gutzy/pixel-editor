/**
 * Get Rectangle Image
 * @ActionType: Canvas
 * @Description Returns the imageData for a given rectangle in the canvas
 * @return ImageData
 *
 */

import {CanvasAction} from "../../classes/abstracts/Actions";

export default class GetRectImage extends CanvasAction {
    /**
     *
     * @param target
     * @param {number} x - rect x position
     * @param {number} y - rect y position
     * @param {number} w - rect width
     * @param {number} h - rect height
     * @return {ImageData}
     */
    do(target, x, y, w, h) {
        return target.ctx.getImageData(x, y, w, h);
    }
}
