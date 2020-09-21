import {CanvasAction} from "../../classes/abstracts/Actions";

export default class MoveTo extends CanvasAction {

    do(target, x, y) {
        x = Math.floor(x);
        y = Math.floor(y);
        target.ctx.moveTo(x, y);
    }

}
