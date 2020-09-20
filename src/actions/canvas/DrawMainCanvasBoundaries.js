import {CanvasAction} from "../../classes/abstracts/Actions";
import {getCenterRect} from "../../utils/CanvasUtils";
import Rectangle from "./Rectangle";

export default class DrawMainCanvasBoundaries extends CanvasAction {

    do(target, width, height) {
        const rect = getCenterRect(target.el, width, height);
        target.doAction(Rectangle, ...rect, '#ffaaaa', '#000000');
    }

}
