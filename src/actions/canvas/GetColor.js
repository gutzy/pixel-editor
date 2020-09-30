import {CanvasAction} from "../../classes/abstracts/Actions";
import {rgbToHex} from "../../utils/ColorUtils";

export default class GetColor extends CanvasAction {
    do(target, x, y) {
        const res = target.ctx.getImageData(x, y, 1, 1).data;
        return (res[3] === 255 ? "#"+rgbToHex(...res) : null);
    }
}

