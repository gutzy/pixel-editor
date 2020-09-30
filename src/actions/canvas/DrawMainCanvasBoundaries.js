import {CanvasAction} from "../../classes/abstracts/Actions";
import {getCenterRect} from "../../utils/CanvasUtils";
import DrawRect from "./DrawRect";

export default class DrawMainCanvasBoundaries extends CanvasAction {
    do(target, width, height, zoom = 1, offset) {

console.log(zoom);

        width *= zoom;
        height *= zoom;

        const rect = getCenterRect(target.el, width, height);
        target.doAction(DrawRect, ...rect, '#ffffff');
        rect[0]--; rect[1]--; rect[2]++; rect[3]++;
        target.doAction(DrawRect, ...rect, null, '#000000');
    }
}
