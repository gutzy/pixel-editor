/**
 * Get Image
 * @ActionType: Canvas
 * @Description Return the entire image data for a given canvas
 *
 */
import {CanvasAction} from "../../classes/abstracts/Actions";

export default class GetImage extends CanvasAction {
    /**
     *
     * @param target
     * @return {ImageData}
     */
    do(target) {
        return target.ctx.getImageData(0, 0, target.el.width, target.el.height);
    }
}
