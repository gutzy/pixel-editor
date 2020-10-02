import {CanvasAction} from "../../classes/abstracts/Actions";
import Canvas from "../../classes/Canvas";
import DrawRect from "./DrawRect";

const borderColors = ['#ff0000','#00ff00','#0000ff','#ff00ff'];

export default class DrawSelectionBorders extends CanvasAction {


    do(target, source) {
        const w = target.el.width, h = target.el.height;
        const l = (i) => i-4,
            u = (i) => i-w*4,
            r = (i) => i+4,
            d = (i) => i+w*4,
            hard =(i) => data[i+3] > 200;

        const data = source.ctx.getImageData(0, 0, w, h).data;
        for (let i = 0; i < data.length; i+= 4) {
            let x = (i/4) % w, y = Math.floor((i/4)/w),
                b = 0; // border types: 1 = left, 2 = top, 3 = right, 4 = bottom

            if (hard(i)) {
                if (!hard(l(i))) b = 1;
                else if (!hard(u(i))) b = 2;
                else if (!hard(r(i))) b = 3;
                else if (!hard(d(i))) b = 4;
            }
            if (b>0) {
                target.doAction(DrawRect,x,y,1,1,borderColors[b-1]);
            }
        }
    }

}
