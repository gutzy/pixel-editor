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
        startPos.x = Math.floor(startPos.x); startPos.y = Math.floor(startPos.y);
        endPos.x = Math.floor(endPos.x); endPos.y = Math.floor(endPos.y);

        const pixelsToPaint = pixelsBetween(startPos.x, startPos.y, endPos.x, endPos.y);
        
        for (let p of pixelsToPaint) { // draw pixels between this and the previous mouse movement
            target.doAction(DrawRect, p.x - Math.floor(strokeWidth/2), p.y - Math.floor(strokeWidth/2), strokeWidth, strokeWidth, color);
        }
    }
}