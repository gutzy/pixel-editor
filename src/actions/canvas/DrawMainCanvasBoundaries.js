/**
 * Draw Main Canvas Boundaries
 * @ActionType: Canvas
 * @Description Draws the rectangular boundaries of the main canvas in the center of the screen, depending on zoom/pan
 *
 */
import {CanvasAction} from "../../classes/abstracts/Actions";
import {getCenterRect} from "../../utils/CanvasUtils";
import DrawRect from "./DrawRect";

export default class DrawMainCanvasBoundaries extends CanvasAction {
    /**
     *
     * @param target
     * @param {number} width - file width
     * @param {number} height - file height
     * @param {number} zoom - indicates viewport zoom, so scale cutting porperly
     * @param {{x,y}} offset - offset from the center, useful to indicate pan
     */
    do(target, width, height, zoom = 1, offset) {

        // do getCenterRect action to get the rectangle for the boundaries
        const rect = getCenterRect(target.el, width, height, zoom, offset);

        // use DrawRect canvas action to fill the rectangle with white
        target.doAction(DrawRect, ...rect, '#ffffff');

        // move rectnagle boundaries ones px outwards
        rect[0]--; rect[1]--; rect[2]++; rect[3]++;

        // use DrawRect canvas action to stroke the rectangle along the outer edges
        target.doAction(DrawRect, ...rect, null, '#000000');
    }
}
