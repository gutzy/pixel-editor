/**
 * Offset Image
 * @ActionType: Canvas
 * @Description Translates a canvas image by given x,y coordinates
 *
 */
import {CanvasAction} from "../../classes/abstracts/Actions";
import Canvas from "../../classes/Canvas";
import ClearCanvas from "./ClearCanvas";
import DrawImage from "./DrawImage";

export default class OffsetImage extends CanvasAction {
    /**
     *
     * @param target
     * @param {number} x
     * @param {number} y
     */
    do(target, x, y) {
        // create a copy
        const c = new Canvas(null, target.el.width, target.el.height, target.ctx.getImageData(0, 0, target.el.width, target.el.height));

        // delete original image
        target.doAction(ClearCanvas);

        // draw copy with designated offset
        target.doAction(DrawImage, c.el, x, y);
    }
}
