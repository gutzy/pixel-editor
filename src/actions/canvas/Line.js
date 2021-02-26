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
    do(target, startPos, endPos, color = null, strokeWidth = 1) {
        startPos[0] = Math.round(startPos[0]); startPos[1] = Math.round(startPos[1]);
        endPos[0] = Math.round(endPos[0]); endPos[1] = Math.round(endPos[1]);

        if (color !== null) {
            target.ctx.moveTo(startPos[0], startPos[1]);
            target.ctx.strokeStyle = (color ? color : 'transparent');
            target.ctx.strokeWidth = strokeWidth;
            target.ctx.lineTo(endPos[0], endPos[1]);
            target.ctx.stroke();
        }
    }

}
