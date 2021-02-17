import {CanvasAction} from "../../classes/abstracts/Actions";
import Canvas from "../../classes/Canvas";
import DrawRect from "./DrawRect";
import GetImage from "./GetImage";
import DrawImage from "./DrawImage";

let data;

export default class DrawSelectionBorders extends CanvasAction {
    do(target, source, zoom = 1, file, skipData = false) {
        const w = target.el.width*zoom, h = target.el.height*zoom;
        const l = (i) => i-4,
            u = (i) => i-w*4,
            r = (i) => i+4,
            d = (i) => i+w*4,
            hard =(i) => data.data[i+3] > 200;

        target.ctx.imageSmoothingEnabled = false;

        const c = new Canvas(null, w , h );
        const res = [
            new Canvas(null, w, h),
            new Canvas(null, w, h),
            new Canvas(null, w, h),
            new Canvas(null, w, h),
        ];

        c.ctx.imageSmoothingEnabled = false;
        c.doAction(DrawImage, source.el,0,0,zoom);

        if (file.expandArea) c.doAction(DrawRect, ...file.expandArea.map(it => it*zoom),'#000000');
        c.ctx.globalCompositeOperation = 'destination-out';
        if (file.shrinkArea) c.doAction(DrawRect, ...file.shrinkArea.map(it => it*zoom),'#000000');
        c.ctx.globalCompositeOperation = 'source-over';

        data = c.doAction(GetImage);
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
                res[b-1].doAction(DrawRect,x,y,1,1,'#000000');
            }
        }
        return res;
    }

}
