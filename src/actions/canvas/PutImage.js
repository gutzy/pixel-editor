import {CanvasAction} from "../../classes/abstracts/Actions";

export default class PutImage extends CanvasAction {
    do(target, imgData, x = 0, y = 0) {
        return target.ctx.putImageData(imgData, x, y);
    }
}
