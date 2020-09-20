import {CanvasAction} from "../../classes/abstracts/Actions";

export default class DrawImage extends CanvasAction {
    do(target, imgData, x = 0, y = 0) {
        return target.ctx.drawImage(imgData, x, y);
    }
}
