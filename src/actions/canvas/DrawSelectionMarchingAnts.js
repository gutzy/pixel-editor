/**
 * Draw Selection Marching Ants
 * @ActionType: Canvas
 * @Description Draws a marching ants animation around the active selection, by moving around a couple of masks.
 * The animation is achieved by creating 2 striped mask elements, then masking the border image, but using an offset
 * to make the striped mask move up/down/left/right along the border image, creating a marching ants illusion without
 * having to re-calculate the border shape.
 *
 */
import {CanvasAction} from "../../classes/abstracts/Actions";
import Canvas from "../../classes/Canvas";
import DrawImage from "./DrawImage";
let w, h, xMask, yMask;

export default class DrawSelectionMarchingAnts extends CanvasAction {
    /**
     *
     * @param target
     * @param {Canvas[]} borders - array of 4 border canvases, each representing left,up,right,down. Created by DrawSelectionBorders.
     * @param {number} offset - an incrementing integer designating the current frame of the animation
     * @param {number} size - px width of the marching ants. lines will take up 1/2 of this size, with a gap in the remaining half.
     * @param {number} zoom - designates the viewport zoom. The selection image is scaled accordingly, as it is drawn independently.
     */
    do(target, borders, offset, size = 8, zoom = 1) {

        // Draw the marching ants masking elements, if they don't exist or the canvas was resized
        // These are two images, with an interchanging stripe pattern, that are later cut from the borders
        if (target.el.width !== w || target.el.height !== h) {
            w = target.el.width; h = target.el.height;
            xMask = new Canvas(null, w, h);
            yMask = new Canvas(null, w, h);

            // Draw the striped masks
            for (let x = 0; x <= w; x += size) xMask.ctx.fillRect(x, 0, size/2, h)
            for (let y = 0; y <= h; y += size) yMask.ctx.fillRect(0, y, w, size/2)

        }

        // Create a fresh target canvas for the drawn borders
        let tgt = new Canvas(null, w, h);
        tgt.ctx.imageSmoothingEnabled = false;
        target.ctx.imageSmoothingEnabled = false;

        // iterate the borders created with DrawSelectionBorders
        for (let i = 0; i < borders.length; i++) {
            // Draw the selection border on the target canvas
            tgt.doAction(DrawImage, borders[i].el, 0, 0)

            // Depending on the border, apply the mask on target canvas w/ a different offset, to create the animation
            tgt.ctx.globalCompositeOperation = 'destination-out';
            switch (i) {
                case 0: tgt.doAction(DrawImage, yMask.el, 0, size-offset%size); break; // left
                case 1: tgt.doAction(DrawImage, xMask.el, offset%size, 0); break; // up
                case 2: tgt.doAction(DrawImage, yMask.el, 0, offset%size); break; // right
                case 3: tgt.doAction(DrawImage, xMask.el, size-offset%size, 0); break; // down
            }

            // Apply this borders to the target canvas
            target.doAction(DrawImage,tgt.el, 0,0);

            // reset the target canvas drawing mode
            tgt.ctx.globalCompositeOperation = 'source-over';
        }
    }
}
