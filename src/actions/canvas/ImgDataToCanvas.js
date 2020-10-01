import {CanvasAction} from "../../classes/abstracts/Actions";
import Canvas from "../../classes/Canvas";

export default class ImgDataToCanvas extends CanvasAction {
    do(target, imgData) {
        return new Canvas(null, imgData.width, imgData.height, imgData);
    }
}
