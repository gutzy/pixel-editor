/**
 * Draw Main Canvas Boundaries
 * @ActionType: Canvas
 * @Description Draws the rectangular boundaries of the main canvas in the center of the screen, depending on zoom/pan
 *
 */
import {CanvasAction} from "../../classes/abstracts/Actions";
import {getCenterRect} from "../../utils/CanvasUtils";
import DrawRect from "./DrawRect";

// Create a canvas to contain transparent checker pattern
const gridCanvas = document.createElement("canvas");
gridCanvas.width = 32;
gridCanvas.height = 32;

// Draw checker pattern
const ctx = gridCanvas.getContext("2d");
ctx.fillStyle = "#ccc8ce";
ctx.fillRect(0,0,32,32);
ctx.fillStyle = "#b3adb6";
ctx.fillRect(0,0,16,16);
ctx.fillRect(16,16,16,16);

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
        let rect = getCenterRect(target.el, width, height, zoom, offset);
        rect = rect.map(val=>Math.floor(val))

        // use DrawRect canvas action to fill the rectangle with transparent checker pattern
        target.ctx.save() 
            target.ctx.translate(rect[0], rect[1])
            target.ctx.scale(zoom,zoom)
            const pattern = target.ctx.createPattern(gridCanvas, "repeat");
            target.ctx.fillStyle = pattern;
            target.doAction(DrawRect, 0, 0, rect[2]/zoom , rect[3]/zoom, pattern);
        target.ctx.restore() 

        // move rectnagle boundaries ones px outwards
        rect[0]--; rect[1]--; rect[2]++; rect[3]++;

        // use DrawRect canvas action to stroke the rectangle along the outer edges
        target.doAction(DrawRect, ...rect, null, '#000000');
    }
}
