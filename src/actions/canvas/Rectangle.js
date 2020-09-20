import {CanvasAction} from "../../classes/abstracts/Actions";

export default class Rectangle extends CanvasAction {

    do(target, x, y, w, h, fill = null, stroke = null, strokeWidth = 1) {
        if (fill !== null) {
            target.ctx.fillStyle = (fill ? fill : 'transparent');
            target.ctx.fillRect(x,y,w,h);
        }
        if (stroke !== null) {
            target.ctx.strokeStyle = (stroke ? stroke : 'transparent');
            target.ctx.strokeWidth = strokeWidth;
            target.ctx.strokeRect(x,y, w, h);
        }
    }

}
