/**
 * Line
 * @ActionType: Canvas
 * @Description Draws a simple line
 */
import {CanvasAction} from "../../classes/abstracts/Actions";
import DrawRect from "../canvas/DrawRect";
import {pixelsBetween} from "../../utils/CanvasUtils";

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

        const pixelsToPaint = pixelsBetween(startPos.x, startPos.y, endPos.x, endPos.y);
        
        for (let p of pixelsToPaint) { // draw pixels between this and the previous mouse movement
            target.doAction(DrawRect, p.x, p.y, strokeWidth, strokeWidth, color);
        }
    }
}