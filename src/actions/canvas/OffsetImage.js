import {CanvasAction} from "../../classes/abstracts/Actions";
import Canvas from "../../classes/Canvas";
import ClearCanvas from "./ClearCanvas";
import DrawImage from "./DrawImage";

export default class OffsetImage extends CanvasAction {
    do(target, x, y) {
        const c = new Canvas(null, target.el.width, target.el.height, target.ctx.getImageData(0, 0, target.el.width, target.el.height));
        target.doAction(ClearCanvas);
        target.doAction(DrawImage, c, x, y);
    }
}
