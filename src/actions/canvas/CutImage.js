import {CanvasAction} from "../../classes/abstracts/Actions";

export default class CutImage extends CanvasAction {
    do(target, imgData, x = 0, y = 0, zoom = 1) {
        target.ctx.imageSmoothingEnabled = false;
        target.ctx.globalCompositeOperation = 'destination-out';
        target.ctx.drawImage(imgData, x, y, imgData.width * zoom, imgData.height * zoom);
        target.ctx.globalCompositeOperation = 'source-over';
    }
}
