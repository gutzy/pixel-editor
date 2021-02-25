/**
 * Draw Selection borders
 * @ActionType: Canvas
 * @Description Creates borders for current selection - generates 4 border elements, that could later be animated using
 * a marching ants pattern.
 *

 * @return array {4 x Canvas}
 *
 */
import {CanvasAction} from "../../classes/abstracts/Actions";
import Canvas from "../../classes/Canvas";
import DrawRect from "./DrawRect";
import GetImage from "./GetImage";
import DrawImage from "./DrawImage";

let data;

export default class DrawSelectionBorders extends CanvasAction {
    /**
     *
     * @param target
     * @param {Canvas} source - source mask image. Every solid pixel here will have borders drawn around it in the result
     * @param {number} zoom - designates the viewport zoom. The selection image is scaled accordingly, as it is drawn independently.
     * @param {*} file - the referenced file
     * @param {boolean} skipData - boolean flag indicating whether to recalculate data. Can be avoided when just moving selection.
     * @return {[Canvas, Canvas, Canvas, Canvas]}
     */
    do(target, source, zoom = 1, file, skipData = false) {

        // Initialize helper functions
        const w = Math.min(screen.width, target.el.width*zoom), h = Math.min(screen.height, target.el.height*zoom);
        const l = (i) => i-4,
            u = (i) => i-w*4,
            r = (i) => i+4,
            d = (i) => i+w*4,
            hard =(i) => data.data[i+3] > 200; // checks if a px is solid

        target.ctx.imageSmoothingEnabled = false;

        // Create result canvases
        const c = new Canvas(null, w , h );
        const res = [
            new Canvas(null, w, h),
            new Canvas(null, w, h),
            new Canvas(null, w, h),
            new Canvas(null, w, h),
        ];

        // Draw initial mask according to scale on result canvas
        c.ctx.imageSmoothingEnabled = false;
        c.doAction(DrawImage, source.el,0,0,zoom);

        // If a selection is being expanded (shift+drag in select tool), account for it until it is solidified
        if (file.expandArea) c.doAction(DrawRect, ...file.expandArea.map(it => it*zoom),'#000000');

        // Accordingly, do the same for a selection that is being shrunk (alt+drag)
        c.ctx.globalCompositeOperation = 'destination-out'; // change drawing mode to remove
        if (file.shrinkArea) c.doAction(DrawRect, ...file.shrinkArea.map(it => it*zoom),'#000000');
        c.ctx.globalCompositeOperation = 'source-over'; // change drawing mode back.

        data = c.doAction(GetImage);

        // Calculate selection edges. Iterate through the selection, and whenver a hard edge is fold, draw it on one
        // of the 4 border canvases, each representing a 'side' (up, down, left, right). These are drawn seperately
        // to allow for a cpu-cheap marching-ants animation later
        for (let i = 0; i < data.data.length; i+= 4) {
            let x = (i/4) % w, y = Math.floor((i/4)/w),
                b = 0; // border types: 1 = left, 2 = top, 3 = right, 4 = bottom

            if (hard(i)) {
                if (!hard(l(i))) b = 1;
                else if (!hard(u(i))) b = 2;
                else if (!hard(r(i))) b = 3;
                else if (!hard(d(i))) b = 4;
            }
            if (b>0) {
                // if a border was found, draw it on the appropriate result canvas
                res[b-1].doAction(DrawRect,x,y,1,1,'#000000');
            }
        }

        // Return the array of 4 result canvases
        return res;
    }

}
