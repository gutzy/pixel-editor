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
        startPos.x = Math.round(startPos.x); startPos.y = Math.round(startPos.y);
        endPos.x = Math.round(endPos.x); endPos.y = Math.round(endPos.y);

        if (color !== null) {
            // Stroke settings
            target.ctx.strokeStyle = (color ? color : 'transparent');
            target.ctx.strokeWidth = strokeWidth;
            
            // Creating the path
            target.ctx.beginPath();
            target.ctx.moveTo(startPos.x, startPos.y);
            target.ctx.lineTo(endPos.x, endPos.y);

            // Drawing the line
            target.ctx.stroke();
        }
    }

}
