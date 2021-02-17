/**
 * Clear Canvas
 * @ActionType: Canvas
 * @Description Clears the entire given canvas (makes it fully transparent)
 *
 */
import {CanvasAction} from "../../classes/abstracts/Actions";

export default class ClearCanvas extends CanvasAction {

    do(target) {
        target.ctx.clearRect(0,0, target.el.width, target.el.height);
    }

}
