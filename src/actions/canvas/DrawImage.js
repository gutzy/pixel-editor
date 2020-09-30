import {CanvasAction} from "../../classes/abstracts/Actions";

export default class DrawImage extends CanvasAction {
    do(target, imgData, x = 0, y = 0, zoom = 1) {
        target.ctx.imageSmoothingEnabled = false;
        return target.ctx.drawImage(imgData, x, y, imgData.width * zoom, imgData.height * zoom);
    }
}
