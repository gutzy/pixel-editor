import {CanvasAction} from "../../classes/abstracts/Actions";

export default class ClearRect extends CanvasAction {

    do(target, x, y, w, h) {
        x = Math.floor(x);
        y = Math.floor(y);
        w = Math.floor(w);
        h = Math.floor(h);

        target.ctx.clearRect(x,y,w,h);
    }

}
