import {CanvasAction} from "../../classes/abstracts/Actions";
import {getCenterRect} from "../../utils/CanvasUtils";
import Rectangle from "./Rectangle";

export default class DrawMainCanvasBoundaries extends CanvasAction {

    do(target, width, height) {
        const rect = getCenterRect(target.el, width, height);
        target.doAction(Rectangle, ...rect, '#ffffff');
        rect[0]--; rect[2]++; rect[3]++;
        target.doAction(Rectangle, ...rect, null, '#000000');
    }

}
