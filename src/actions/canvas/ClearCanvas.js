import {CanvasAction} from "../../classes/abstracts/Actions";
import {getCenterRect} from "../../utils/CanvasUtils";

export default class ClearCanvas extends CanvasAction {

    do(target) {
        target.ctx.clearRect(0,0, target.el.width, target.el.height);
    }

}
