/**
 * Line
 * @ActionType: Canvas
 * @Description Draws a simple line
 */
import {CanvasAction} from "../../classes/abstracts/Actions";

export default class Line extends CanvasAction {
    /**
     *
     * @param target
     * @param {number} x - rect x position
     * @param {number} y - rect y position
     * @param {string | null} color - hex color
     * @param {number} strokeWidth - line width in px
     */
    do(target, x, y, color = null, strokeWidth = 1) {
        x = Math.floor(x); y = Math.floor(y);
        if (color !== null) {
            target.ctx.strokeStyle = (color ? color : 'transparent');
            target.ctx.strokeWidth = strokeWidth;
            target.ctx.lineTo(x,y);
            target.ctx.stroke();
        }
    }

}
