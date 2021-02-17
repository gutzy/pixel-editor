import {CanvasAction} from "../../classes/abstracts/Actions";

export default class PutImage extends CanvasAction {
    do(target, imgData, x = 0, y = 0, dx = 0, dy = 0, dw = null, dh = null) {

        return target.ctx.putImageData(imgData, x, y,dx,dy,target.el.width,target.el.height);
    }
}
