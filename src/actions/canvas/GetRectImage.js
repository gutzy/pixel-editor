import {CanvasAction} from "../../classes/abstracts/Actions";

export default class GetRectImage extends CanvasAction {
    do(target,x, y, w, h) {
        return target.ctx.getImageData(x, y, w, h);
    }
}
