/**
 * ImageData to Canvas
 * @ActionType: Canvas
 * @Description Returns a new canvas class instance, with an image created from the given ImageData
 *
 */
import {CanvasAction} from "../../classes/abstracts/Actions";
import Canvas from "../../classes/Canvas";

export default class ImgDataToCanvas extends CanvasAction {
    /**
     *
     * @param target
     * @param {ImageData} imgData - ImageData to draw on the new canvas instance
     * @return {Canvas}
     */
    do(target, imgData) {
        return new Canvas(null, imgData.width, imgData.height, imgData);
    }
}
