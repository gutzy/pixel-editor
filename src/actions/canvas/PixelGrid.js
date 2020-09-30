import {CanvasAction} from "../../classes/abstracts/Actions";

export default class PixelGrid extends CanvasAction {

    do(target, gridSize) {
        for (let x = gridSize; x < target.el.width; x += gridSize) {
            target.ctx.clearRect(x, 0, 1, target.el.height);
        }
        for (let y = gridSize; y < target.el.height; y += gridSize) {
            target.ctx.clearRect(0, y, target.el.width, 1);
        }
    }

}
