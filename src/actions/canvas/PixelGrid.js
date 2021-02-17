/**
 * Pixel Grid
 * @ActionType: Canvas
 * @Description Clears a 1px-wide grid in a canvas. Useful for designating individual in zoomed-in viewports.
 *
 */
import {CanvasAction} from "../../classes/abstracts/Actions";

export default class PixelGrid extends CanvasAction {
    /**
     *
     * @param target
     * @param {number} gridSize - px size of each pixel
     * @param {number} startX - x drawing start position
     * @param {number} startY - y drawing start position
     * @param {number | null} size - optional, designates grid clearing size (default is 1)
     */
    do(target, gridSize, startX, startY, size = 1) {
        for (let x = startX; x < target.el.width; x += gridSize) {
            target.ctx.clearRect(x, 0, size, target.el.height);
        }
        for (let y = startY; y < target.el.height; y += gridSize) {
            target.ctx.clearRect(0, y, target.el.width, size);
        }
    }
}
