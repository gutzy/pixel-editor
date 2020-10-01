import {CanvasAction} from "../../classes/abstracts/Actions";
import ClearRect from "./ClearRect";

export default class ClearMarquee extends CanvasAction {
    do(target, gridSize, x, y, width, height, offset = 0) {
        for (let _x = x; _x < x+width; _x += gridSize) {
            target.doAction(ClearRect, _x + offset % gridSize, y-1, gridSize/2, 2);
            target.doAction(ClearRect, _x - offset % gridSize, y+height-2, gridSize/2, 2);
        }
        for (let _y = y; _y < y+height; _y += gridSize) {
            target.doAction(ClearRect, x-1, _y - offset % gridSize, 2, gridSize/2);
            target.doAction(ClearRect, x+width-1, _y + offset % gridSize, 2, gridSize/2);
        }
    }
}
