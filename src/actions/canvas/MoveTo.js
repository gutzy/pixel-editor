import {CanvasAction} from "../../classes/abstracts/Actions";

export default class MoveTo extends CanvasAction {

    do(target, x, y) {
        target.ctx.moveTo(x, y);
    }

}
