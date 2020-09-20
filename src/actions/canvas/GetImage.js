import {CanvasAction} from "../../classes/abstracts/Actions";

export default class GetImage extends CanvasAction {
    do(target) {
        return target.ctx.getImageData(0, 0, target.el.width, target.el.height);
    }
}
