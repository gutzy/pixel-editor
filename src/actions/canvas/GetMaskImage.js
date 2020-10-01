import {CanvasAction} from "../../classes/abstracts/Actions";
import Canvas from "../../classes/Canvas";
import DrawImage from "./DrawImage";

export default class GetMaskImage extends CanvasAction {
    do(target, maskEl) {
        const c = new Canvas(null, target.el.width, target.el.height);
        c.doAction(DrawImage, maskEl);
        c.ctx.globalCompositeOperation = 'source-in';
        c.doAction(DrawImage, target.el);
        c.ctx.globalCompositeOperation = 'source-over';
        return c.ctx.getImageData(0,0,target.el.width, target.el.height);
    }
}
