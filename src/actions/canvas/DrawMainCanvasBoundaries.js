import {CanvasAction} from "../../classes/abstracts/Actions";
import {getCenterRect} from "../../utils/CanvasUtils";
import DrawRect from "./DrawRect";

export default class DrawMainCanvasBoundaries extends CanvasAction {
    do(target, width, height) {
        const rect = getCenterRect(target.el, width, height);
        target.doAction(DrawRect, ...rect, '#ffffff');
        rect[0]--; rect[1]--; rect[2]++; rect[3]++;
        target.doAction(DrawRect, ...rect, null, '#000000');
    }
}
