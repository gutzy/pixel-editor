/**
 * Draw Rectangle
 * @ActionType: Canvas
 * @Description Draws the boundaries of the main canvas in the center of the screen, depending on zoom/pan
 *

 *
 */
import {CanvasAction} from "../../classes/abstracts/Actions";

export default class DrawRect extends CanvasAction {

    /**
     *
     * @param target
     * @param {number} x - rect x
     * @param {number} y - rect y
     * @param {number} w - rect width
     * @param {number} h - rect height
     * @param {string|null} fill - fill color
     * @param {string|null} stroke - stroke color
     * @param {number|null} strokeWidth - stroke width
     */
    do(target, x, y, w, h, fill = null, stroke = null, strokeWidth = 1) {
        x = Math.floor(x);
        y = Math.floor(y);
        w = Math.floor(w);
        h = Math.floor(h);


        if (fill !== null) {
            target.ctx.fillStyle = (fill ? fill : 'transparent');
            target.ctx.fillRect(x,y,w,h);
        }
        if (stroke !== null) {
            target.ctx.fillStyle = (stroke ? stroke : 'transparent');
            target.ctx.fillRect(Math.floor(x),Math.floor(y), w, strokeWidth);
            target.ctx.fillRect(Math.floor(x),Math.floor(y), strokeWidth, h);
            target.ctx.fillRect(Math.floor(x),Math.floor(y+h)-1, w+strokeWidth, strokeWidth);
            target.ctx.fillRect(w+Math.floor(x),Math.floor(y), strokeWidth, h);
        }
    }

}
