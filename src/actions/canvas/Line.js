import {CanvasAction} from "../../classes/abstracts/Actions";

export default class Line extends CanvasAction {

    do(target, x, y, stroke = null, strokeWidth = 1) {
        x = Math.floor(x); y = Math.floor(y);
        if (stroke !== null) {
            target.ctx.strokeStyle = (stroke ? stroke : 'transparent');
            target.ctx.strokeWidth = strokeWidth;
            target.ctx.lineTo(x,y);
            target.ctx.stroke();
        }
    }

}
