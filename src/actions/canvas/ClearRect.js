/**
 * Clear Rectangle
 * @ActionType: Canvas
 * @Description Clears a rectangle
 *
 */
import {CanvasAction} from "../../classes/abstracts/Actions";

export default class ClearRect extends CanvasAction {

    /**
     *
     * @param target
     * @param {number} x - rect x position
     * @param {number} y - rect y position
     * @param {number} w - rect width
     * @param {number} h - rect height
     */
    do(target, x, y, w, h) {
        x = Math.floor(x);
        y = Math.floor(y);
        w = Math.floor(w);
        h = Math.floor(h);

        target.ctx.clearRect(x,y,w,h);
    }

}
