/**
 * Get Color
 * @ActionType: Canvas
 * @Description Return the hex color for a given pixel in a canvas
 *
 */
import {CanvasAction} from "../../classes/abstracts/Actions";
import {rgbToHex} from "../../utils/ColorUtils";

export default class GetColor extends CanvasAction {
    /**
     *
     * @param target
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     * @return {string|null} hex color
     */
    do(target, x, y) {
        const res = target.ctx.getImageData(x, y, 1, 1).data;
        return (res[3] === 255 ? "#"+rgbToHex(...res) : null);
    }
}

