import {CanvasAction} from "../../classes/abstracts/Actions";
import Canvas from "../../classes/Canvas";
import DrawImage from "./DrawImage";
let w, h, xMask, yMask;

export default class DrawSelectionMarchingAnts extends CanvasAction {
    do(target, borders, offset, size = 8, zoom = 1) {

        if (target.el.width !== w || target.el.height !== h) {
            w = target.el.width; h = target.el.height;
            xMask = new Canvas(null, w, h);
            yMask = new Canvas(null, w, h);

            for (let x = 0; x <= w; x += size) xMask.ctx.fillRect(x, 0, size/2, h)
            for (let y = 0; y <= h; y += size) yMask.ctx.fillRect(0, y, w, size/2)

        }

        let tgt = new Canvas(null, w, h);
        tgt.ctx.imageSmoothingEnabled = false;
        target.ctx.imageSmoothingEnabled = false;

        for (let i = 0; i < borders.length; i++) {
            tgt.doAction(DrawImage, borders[i].el, 0, 0)
            tgt.ctx.globalCompositeOperation = 'destination-out';
            switch (i) {
                case 0: tgt.doAction(DrawImage, yMask.el, 0, size-offset%size); break; // left
                case 1: tgt.doAction(DrawImage, xMask.el, offset%size, 0); break; // up
                case 2: tgt.doAction(DrawImage, yMask.el, 0, offset%size); break; // right
                case 3: tgt.doAction(DrawImage, xMask.el, size-offset%size, 0); break; // down
            }
            target.doAction(DrawImage,tgt.el, 0,0);
            tgt.ctx.globalCompositeOperation = 'source-over';
        }
        // target.doAction(DrawImage,tgt.el, 0,0);
    }
}
